"""
TTS service with Redis caching. Uses Google Cloud Text-to-Speech API for low latency.

Primary entry points:
  - generate_tts(text, voice_config) -> bytes
  - get_audio_url(text, cache_key) -> str   (data: URL containing base64 audio)

Notes:
  - This repo's Redis client uses decode_responses=True, so we store base64 strings.
  - Uses Gemini API for TTS with Leda voice (via GEMINI_API_KEY).
  - Falls back to standard Google Cloud TTS if needed.
"""

from __future__ import annotations

import base64
import hashlib
import logging
import os
from typing import Any, Dict, Optional

from dotenv import load_dotenv

from storage.client import get_redis_client

logger = logging.getLogger(__name__)

# Try to import Google Cloud TTS (faster, lower latency)
try:
    from google.cloud import texttospeech
    GCLOUD_TTS_AVAILABLE = True
except ImportError:
    GCLOUD_TTS_AVAILABLE = False
    logger.warning("google-cloud-texttospeech not available, will use Gemini Live API fallback")

# Try to import Gemini TTS as fallback
try:
    from google import genai
    from google.genai import types
    GEMINI_TTS_AVAILABLE = True
    # Cache for Gemini Live API client (reused across requests for lower latency)
    _gemini_live_client: Optional[Any] = None
except ImportError:
    GEMINI_TTS_AVAILABLE = False
    _gemini_live_client = None


# Load backend/.env first (with override) so GEMINI_API_KEY from backend/.env is always used
_this_dir = os.path.dirname(os.path.abspath(__file__))
_backend_dir = os.path.abspath(os.path.join(_this_dir, "..", ".."))
_backend_env = os.path.join(_backend_dir, ".env")
if os.path.isfile(_backend_env):
    load_dotenv(_backend_env, override=True)
# Also load from project root and cwd so other vars are available
_root_env = os.path.join(_backend_dir, "..", ".env")
if os.path.isfile(_root_env):
    load_dotenv(_root_env)
load_dotenv()  # cwd .env


# TTS Configuration
DEFAULT_TTS_PROVIDER = os.getenv("TTS_PROVIDER", "gcloud")  # "gcloud" or "gemini"
DEFAULT_TTS_MODEL = os.getenv("GEMINI_TTS_MODEL_NAME", "gemini-2.5-flash-native-audio-preview-12-2025")
# Pre-compute model name with prefix for faster lookups
DEFAULT_TTS_MODEL_FULL = DEFAULT_TTS_MODEL if DEFAULT_TTS_MODEL.startswith("models/") else f"models/{DEFAULT_TTS_MODEL}"
DEFAULT_AUDIO_MIME = os.getenv("TTS_AUDIO_MIME", "audio/wav")
DEFAULT_CACHE_TTL_SECONDS = int(os.getenv("TTS_CACHE_TTL_SECONDS", "86400"))

# Google Cloud TTS voice configuration
# Using Gemini TTS model with v1beta1 API for better voices
DEFAULT_GCLOUD_VOICE_NAME = os.getenv("GCLOUD_TTS_VOICE_NAME", "Leda")
DEFAULT_GCLOUD_LANGUAGE_CODE = os.getenv("GCLOUD_TTS_LANGUAGE_CODE", "en-us")
DEFAULT_GCLOUD_SSML_GENDER = os.getenv("GCLOUD_TTS_SSML_GENDER", "FEMALE")
DEFAULT_GCLOUD_MODEL_NAME = os.getenv("GCLOUD_TTS_MODEL_NAME", "gemini-2.5-flash-lite-preview-tts")
DEFAULT_GCLOUD_TTS_PROMPT = os.getenv("GCLOUD_TTS_PROMPT", "Read aloud in a warm, welcoming tone.")
GCLOUD_TTS_API_KEY = os.getenv("GCLOUD_TTS_API_KEY")  # Optional API key for authentication


def _get_gemini_api_key() -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set")
    return api_key


def _get_gemini_live_client() -> genai.Client:
    """
    Get or create a cached Gemini Live API client for lower latency.
    The client is reused across requests to avoid connection overhead.
    """
    global _gemini_live_client
    
    if _gemini_live_client is not None:
        return _gemini_live_client
    
    # Create client with v1beta API version (required for Live API)
    _gemini_live_client = genai.Client(
        http_options={"api_version": "v1beta"},
        api_key=_get_gemini_api_key()
    )
    
    return _gemini_live_client


def _stable_cache_key(prefix: str, text: str, voice_config: Dict[str, Any]) -> str:
    """Helper for callers that want a deterministic key."""
    voice_part = str(sorted(voice_config.items())).encode("utf-8")
    h = hashlib.sha256()
    h.update(text.encode("utf-8"))
    h.update(b"|")
    h.update(voice_part)
    return f"{prefix}:{h.hexdigest()}"


def _pcm_to_wav(pcm_data: bytes, sample_rate: int = 24000, channels: int = 1, sample_width: int = 2) -> bytes:
    """
    Convert raw PCM audio data to WAV format.
    
    Args:
        pcm_data: Raw PCM audio bytes
        sample_rate: Sample rate in Hz (default: 24000 for Gemini Live API)
        channels: Number of audio channels (1 = mono, 2 = stereo)
        sample_width: Bytes per sample (2 = 16-bit)
    
    Returns:
        WAV file bytes
    """
    import struct
    
    # WAV file structure:
    # - RIFF header (12 bytes)
    # - fmt chunk (24 bytes)
    # - data chunk (8 + data bytes)
    
    data_size = len(pcm_data)
    fmt_chunk_size = 16  # Standard PCM fmt chunk size
    
    # WAV file structure:
    # - RIFF header: 12 bytes (4 "RIFF" + 4 size + 4 "WAVE")
    # - fmt chunk: 24 bytes (4 "fmt " + 4 size + 16 fmt data)
    # - data chunk: 8 + data_size bytes (4 "data" + 4 size + data)
    # Total: 44 + data_size bytes
    # RIFF size field = total - 8 (RIFF and size fields themselves)
    riff_size = 36 + data_size  # (44 + data_size) - 8
    
    # RIFF header
    wav = b'RIFF'
    wav += struct.pack('<I', riff_size)  # File size minus 8 bytes (RIFF + size fields)
    wav += b'WAVE'
    
    # fmt chunk
    wav += b'fmt '
    wav += struct.pack('<I', fmt_chunk_size)  # fmt chunk size
    wav += struct.pack('<H', 1)  # Audio format (1 = PCM)
    wav += struct.pack('<H', channels)  # Number of channels
    wav += struct.pack('<I', sample_rate)  # Sample rate
    wav += struct.pack('<I', sample_rate * channels * sample_width)  # Byte rate
    wav += struct.pack('<H', channels * sample_width)  # Block align
    wav += struct.pack('<H', sample_width * 8)  # Bits per sample
    
    # data chunk
    wav += b'data'
    wav += struct.pack('<I', data_size)  # Data size
    wav += pcm_data  # Audio data
    
    return wav


def _extract_audio_bytes(resp: Any) -> bytes:
    """
    Best-effort extraction of audio bytes from a google-genai response.

    We try a few common shapes:
      - resp.audio / resp.audios
      - resp.candidates[0].content.parts[*].inline_data.data
      - resp.candidates[0].content.parts[*].blob / .data
    """
    # 1) direct attribute
    for attr in ("audio", "audios"):
        val = getattr(resp, attr, None)
        if val:
            if isinstance(val, (bytes, bytearray)):
                return bytes(val)
            if isinstance(val, str):
                # sometimes base64
                try:
                    return base64.b64decode(val)
                except Exception:
                    pass

    # 2) candidate parts
    candidates = getattr(resp, "candidates", None) or []
    for cand in candidates[:1]:
        content = getattr(cand, "content", None)
        parts = getattr(content, "parts", None) or []
        for p in parts:
            inline = getattr(p, "inline_data", None)
            if inline is not None:
                data = getattr(inline, "data", None)
                if isinstance(data, (bytes, bytearray)):
                    return bytes(data)
                if isinstance(data, str):
                    try:
                        return base64.b64decode(data)
                    except Exception:
                        pass
            blob = getattr(p, "blob", None)
            if isinstance(blob, (bytes, bytearray)):
                return bytes(blob)
            data = getattr(p, "data", None)
            if isinstance(data, (bytes, bytearray)):
                return bytes(data)
            if isinstance(data, str):
                try:
                    return base64.b64decode(data)
                except Exception:
                    pass

    # 3) raw text fallback (not audio, but occasionally SDK sets resp.text to base64)
    text = getattr(resp, "text", None)
    if isinstance(text, str) and text.strip():
        try:
            return base64.b64decode(text.strip())
        except Exception:
            pass

    raise RuntimeError("Could not extract audio bytes from Gemini TTS response")


def _list_available_models() -> list[str]:
    """List available models to help debug TTS model availability."""
    try:
        client = genai.Client(api_key=_get_gemini_api_key())
        models = client.models.list()
        model_names = [m.name for m in models if hasattr(m, 'name')]
        logger.info(f"Available models: {model_names[:10]}...")  # Log first 10
        return model_names
    except Exception as e:
        logger.warning(f"Failed to list models: {e}")
        return []


async def _generate_tts_async(text: str, voice_config: Dict[str, Any] | None = None) -> bytes:
    """
    Generate audio bytes from text using Gemini Live API (async).
    Optimized for lower latency with client reuse and efficient processing.
    
    The native audio model requires the Live API, not generate_content.
    This is the async implementation that uses client.aio.live.connect().
    """
    # Early validation - strip once and reuse
    text_stripped = text.strip() if text else ""
    if not text_stripped:
        raise ValueError("text must be a non-empty string")
    
    voice_config = voice_config or {}

    # Optimize model name lookup - use pre-computed default if available
    model = voice_config.get("model")
    if model:
        model = str(model)
        # Ensure model name has "models/" prefix if not present
        if not model.startswith("models/"):
            model = f"models/{model}"
    else:
        model = DEFAULT_TTS_MODEL_FULL  # Use pre-computed model name
    
    voice_name = voice_config.get("voiceName", "Zephyr")  # Default voice

    # Use cached client for lower latency (avoids connection overhead)
    client = _get_gemini_live_client()

    # Configure Live API for audio output
    config = types.LiveConnectConfig(
        response_modalities=["AUDIO"],
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=voice_name)
            )
        ),
    )

    # Only log at info level if debug is enabled (reduce logging overhead)
    if logger.isEnabledFor(logging.DEBUG):
        logger.debug("Generating TTS audio via Gemini Live API model=%s voice=%s", model, voice_name)
    
    # Use bytearray for more efficient chunk accumulation
    audio_chunks = bytearray()
    try:
        async with client.aio.live.connect(model=model, config=config) as session:
            # Send text input (use pre-stripped text)
            await session.send(input=text_stripped, end_of_turn=True)
            
            # Receive audio response - process chunks as they arrive
            turn = session.receive()
            async for response in turn:
                if response.data:
                    # Append directly to bytearray for efficiency
                    audio_chunks.extend(response.data)
                # Skip text logging in production for performance
                if response.text and logger.isEnabledFor(logging.DEBUG):
                    logger.debug(f"Text response: {response.text}")
            
            # Convert accumulated chunks to bytes
            if audio_chunks:
                pcm_data = bytes(audio_chunks)
                # Only log if debug enabled
                if logger.isEnabledFor(logging.DEBUG):
                    logger.debug(f"Generated {len(pcm_data)} bytes of PCM audio")
                # Convert PCM to WAV format for browser playback
                # Gemini Live API returns PCM at 24kHz, 16-bit, mono
                wav_data = _pcm_to_wav(pcm_data, sample_rate=24000, channels=1, sample_width=2)
                if logger.isEnabledFor(logging.DEBUG):
                    logger.debug(f"Converted to {len(wav_data)} bytes of WAV audio")
                return wav_data
            else:
                raise RuntimeError("No audio data received from Live API")
                
    except Exception as e:
        logger.error(f"Failed to generate TTS audio via Live API: {e}")
        raise


def _generate_tts_gcloud(text: str, voice_config: Dict[str, Any] | None = None) -> bytes:
    """
    Generate audio bytes using Google Cloud Text-to-Speech API (standard v1 API).
    Uses default credentials if available, otherwise requires explicit authentication.
    """
    if not GCLOUD_TTS_AVAILABLE:
        raise RuntimeError("google-cloud-texttospeech not available")
    
    voice_config = voice_config or {}
    
    # Map style to voice if style is specified
    style = voice_config.get("style")
    if style == "game_show_host":
        # Use bright, energetic voice for game show host style
        voice_name = "en-US-Studio-O"  # Bright, energetic alternative
    else:
        voice_name = voice_config.get("voiceName") or DEFAULT_GCLOUD_VOICE_NAME
    
    # Configure voice settings
    language_code = voice_config.get("languageCode") or DEFAULT_GCLOUD_LANGUAGE_CODE
    
    # Use standard v1 API with Text-to-Speech client library
    client = texttospeech.TextToSpeechClient()
    
    # For standard API, ensure we're using a valid voice name
    if voice_name in ["Leda", "Aoede"]:
        voice_name = "en-US-Studio-O"  # Bright, energetic alternative
        logger.info(f"Using en-US-Studio-O as alternative to {voice_name} (Gemini voice not available via v1 API)")
    
    # Set the text input
    synthesis_input = texttospeech.SynthesisInput(text=text.strip())
    
    # Build the voice request
    voice = texttospeech.VoiceSelectionParams(
        language_code=language_code,
        name=voice_name,
    )
    
    # Select the type of audio file to return
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.LINEAR16,  # WAV format
        sample_rate_hertz=24000,
        pitch=voice_config.get("pitch", 0),
        speaking_rate=voice_config.get("speakingRate", 1.0),
    )
    
    logger.info(f"Generating TTS audio via Google Cloud TTS v1 voice={voice_name} language={language_code}")
    
    # Perform the text-to-speech request
    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )
    
    # Return the audio content as bytes
    audio_bytes = response.audio_content
    logger.info(f"Generated {len(audio_bytes)} bytes of audio via Google Cloud TTS v1")
    return audio_bytes


def _generate_tts_gcloud_v1beta1(text: str, voice_name: str, language_code: str, model_name: str, prompt: str, voice_config: Dict[str, Any]) -> bytes:
    """
    Generate audio using Gemini API with google-genai library for Leda voice.
    Uses GEMINI_API_KEY for authentication.
    """
    import struct
    
    if not GEMINI_TTS_AVAILABLE:
        raise RuntimeError("google-genai library not available. Install with: pip install google-genai")
    
    # Get Gemini API key
    gemini_api_key = _get_gemini_api_key()
    
    # Create client
    client = genai.Client(api_key=gemini_api_key)
    
    # Use the model from the example
    model = "gemini-2.5-flash-preview-tts"
    
    # Build the text with prompt
    full_text = f"{prompt}\n{text.strip()}"
    
    # Create content
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=full_text),
            ],
        ),
    ]
    
    # Configure generation with Leda voice
    generate_content_config = types.GenerateContentConfig(
        temperature=1,
        response_modalities=["audio"],
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                    voice_name=voice_name  # "Leda"
                )
            )
        ),
    )
    
    logger.info(f"Generating TTS audio via Gemini API voice={voice_name} model={model}")
    
    # Collect audio chunks
    audio_chunks = []
    audio_mime_type = None
    
    try:
        # Stream the response
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):
            if chunk.parts is None:
                continue
            
            # Check for audio data
            if chunk.parts[0].inline_data and chunk.parts[0].inline_data.data:
                inline_data = chunk.parts[0].inline_data
                audio_chunks.append(inline_data.data)
                if not audio_mime_type:
                    audio_mime_type = inline_data.mime_type
            elif chunk.text:
                logger.debug(f"Text response: {chunk.text}")
        
        if not audio_chunks:
            raise RuntimeError("No audio data received from Gemini API")
        
        # Combine all audio chunks
        audio_data = b''.join(audio_chunks)
        
        # Convert to WAV if needed
        if audio_mime_type and audio_mime_type != "audio/wav":
            audio_data = _convert_audio_to_wav(audio_data, audio_mime_type)
        
        logger.info(f"Generated {len(audio_data)} bytes of audio via Gemini API")
        return audio_data
        
    except Exception as e:
        logger.error(f"Failed to generate audio via Gemini API: {e}")
        raise RuntimeError(f"Failed to generate audio via Gemini API: {e}")


def _convert_audio_to_wav(audio_data: bytes, mime_type: str) -> bytes:
    """Convert audio data to WAV format based on MIME type parameters."""
    import struct
    
    # Parse MIME type to get parameters
    bits_per_sample = 16
    sample_rate = 24000
    num_channels = 1
    
    # Extract rate and bits from MIME type (e.g., "audio/L16;rate=24000")
    parts = mime_type.split(";")
    for param in parts:
        param = param.strip()
        if param.lower().startswith("rate="):
            try:
                rate_str = param.split("=", 1)[1]
                sample_rate = int(rate_str)
            except (ValueError, IndexError):
                pass
        elif param.startswith("audio/L"):
            try:
                bits_per_sample = int(param.split("L", 1)[1])
            except (ValueError, IndexError):
                pass
    
    # Calculate WAV header parameters
    bytes_per_sample = bits_per_sample // 8
    block_align = num_channels * bytes_per_sample
    byte_rate = sample_rate * block_align
    data_size = len(audio_data)
    chunk_size = 36 + data_size
    
    # Build WAV header
    header = struct.pack(
        "<4sI4s4sIHHIIHH4sI",
        b"RIFF",          # ChunkID
        chunk_size,       # ChunkSize
        b"WAVE",          # Format
        b"fmt ",          # Subchunk1ID
        16,               # Subchunk1Size
        1,                # AudioFormat (PCM)
        num_channels,     # NumChannels
        sample_rate,      # SampleRate
        byte_rate,        # ByteRate
        block_align,      # BlockAlign
        bits_per_sample,  # BitsPerSample
        b"data",          # Subchunk2ID
        data_size         # Subchunk2Size
    )
    
    return header + audio_data


def generate_tts(text: str, voice_config: Dict[str, Any] | None = None) -> bytes:
    """
    Generate audio bytes from text. Uses Gemini Live API as primary method.
    Falls back to other TTS providers if Live API is not available.
    
    voice_config is passed through best-effort; supported keys vary by provider.
    For Gemini Live API (primary):
      - model: override model name (default: "gemini-2.5-flash-native-audio-preview-12-2025")
      - voiceName: voice name (default: "Zephyr")
    For Gemini API (fallback):
      - model: override model name
      - voiceName: voice name (default: "Leda")
    For Google Cloud TTS (fallback):
      - voiceName: voice name (default: "en-US-Studio-O" - bright, energetic voice)
      - languageCode: language code (default: "en-US")
      - ssmlGender: "FEMALE", "MALE", or "NEUTRAL" (default: "FEMALE")
      - style: "game_show_host" will use a bright, energetic voice
    """
    if not text or not text.strip():
        raise ValueError("text must be a non-empty string")
    
    voice_config = voice_config or {}
    provider = voice_config.get("provider") or DEFAULT_TTS_PROVIDER
    
    # Primary: Try Gemini Live API first
    if GEMINI_TTS_AVAILABLE:
        import asyncio
        import concurrent.futures
        
        try:
            # Try to get existing event loop
            try:
                loop = asyncio.get_event_loop()
                if loop.is_running():
                    # If loop is running, we need to run in a thread
                    with concurrent.futures.ThreadPoolExecutor() as executor:
                        future = executor.submit(asyncio.run, _generate_tts_async(text, voice_config))
                        return future.result()
                else:
                    # Loop exists but not running, use it
                    return loop.run_until_complete(_generate_tts_async(text, voice_config))
            except RuntimeError:
                # No event loop, create new one
                return asyncio.run(_generate_tts_async(text, voice_config))
        except Exception as e:
            logger.warning(f"Gemini Live API TTS failed: {e}, falling back to other methods")
    
    # Fallback 1: Try Gemini API with generate_content_stream (for Leda voice)
    if GEMINI_TTS_AVAILABLE:
        try:
            # Check if we should use Gemini API (for Leda voice or if explicitly requested)
            style = voice_config.get("style")
            voice_name = voice_config.get("voiceName") or DEFAULT_GCLOUD_VOICE_NAME
            if style == "game_show_host" or voice_name == "Leda" or provider == "gemini":
                # Use Gemini API for Leda voice
                return _generate_tts_gcloud_v1beta1(
                    text,
                    voice_name if voice_name == "Leda" else "Leda",
                    voice_config.get("languageCode") or DEFAULT_GCLOUD_LANGUAGE_CODE,
                    voice_config.get("modelName") or DEFAULT_GCLOUD_MODEL_NAME,
                    voice_config.get("prompt") or DEFAULT_GCLOUD_TTS_PROMPT,
                    voice_config
                )
        except Exception as e:
            logger.warning(f"Gemini API TTS failed: {e}, falling back to Google Cloud TTS")
    
    # Fallback 2: Try Google Cloud TTS (standard API, no service account needed for basic usage)
    if provider == "gcloud" and GCLOUD_TTS_AVAILABLE:
        try:
            return _generate_tts_gcloud(text, voice_config)
        except Exception as e:
            logger.warning(f"Google Cloud TTS failed: {e}")
    
    # Return empty WAV as fallback
    logger.error("No TTS provider available")
    empty_wav = (
        b'RIFF'  # ChunkID
        b'\x24\x00\x00\x00'  # ChunkSize (36 bytes)
        b'WAVE'  # Format
        b'fmt '  # Subchunk1ID
        b'\x10\x00\x00\x00'  # Subchunk1Size (16)
        b'\x01\x00'  # AudioFormat (PCM)
        b'\x01\x00'  # NumChannels (mono)
        b'\x44\xac\x00\x00'  # SampleRate (44100)
        b'\x88\x58\x01\x00'  # ByteRate
        b'\x02\x00'  # BlockAlign
        b'\x10\x00'  # BitsPerSample (16)
        b'data'  # Subchunk2ID
        b'\x00\x00\x00\x00'  # Subchunk2Size (0 - no audio data)
    )
    return empty_wav


def get_audio_url(
    text: str,
    cache_key: str,
    *,
    voice_config: Optional[Dict[str, Any]] = None,
    ttl_seconds: int = DEFAULT_CACHE_TTL_SECONDS,
) -> str:
    """
    Return a data URL containing base64-encoded audio.

    cache_key: caller-provided Redis key. (Use `_stable_cache_key` if you want determinism.)
    """
    if not cache_key:
        raise ValueError("cache_key is required")
    voice_config = voice_config or {}
    mime_type = str(voice_config.get("mimeType") or DEFAULT_AUDIO_MIME)

    # Log the text being spoken by the voice agent
    logger.info(f"VOICE AGENT SAYING: {text}")

    r = get_redis_client()
    cached_b64 = r.get(cache_key)
    if cached_b64:
        logger.debug(f"Using cached audio for text (first 50 chars): {text[:50]}...")
        return f"data:{mime_type};base64,{cached_b64}"

    audio_bytes = generate_tts(text, voice_config)
    b64 = base64.b64encode(audio_bytes).decode("utf-8")
    # store base64 string with TTL
    if ttl_seconds and ttl_seconds > 0:
        r.setex(cache_key, ttl_seconds, b64)
    else:
        r.set(cache_key, b64)

    return f"data:{mime_type};base64,{b64}"

