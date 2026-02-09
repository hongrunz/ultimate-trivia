"""
TTS service with Redis caching. Uses Gemini Live API for text-to-speech.

Primary entry points:
  - generate_tts(text, voice_config) -> bytes
  - get_audio_url(text, cache_key) -> str   (data: URL containing base64 audio)

Notes:
  - This repo's Redis client uses decode_responses=True, so we store base64 strings.
  - Uses Gemini Live API for TTS (via GEMINI_API_KEY).
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

from google import genai
from google.genai import types

# Cache for Gemini Live API client (reused across requests for lower latency)
_gemini_live_client: Optional[Any] = None


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
DEFAULT_TTS_MODEL = os.getenv("GEMINI_TTS_MODEL_NAME", "gemini-2.5-flash-native-audio-preview-12-2025")
# Pre-compute model name with prefix for faster lookups
DEFAULT_TTS_MODEL_FULL = DEFAULT_TTS_MODEL if DEFAULT_TTS_MODEL.startswith("models/") else f"models/{DEFAULT_TTS_MODEL}"
DEFAULT_AUDIO_MIME = os.getenv("TTS_AUDIO_MIME", "audio/wav")
DEFAULT_CACHE_TTL_SECONDS = int(os.getenv("TTS_CACHE_TTL_SECONDS", "86400"))

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


def generate_tts(text: str, voice_config: Dict[str, Any] | None = None) -> bytes:
    """
    Generate audio bytes from text using Gemini Live API.
    
    voice_config supports:
      - model: override model name (default: "gemini-2.5-flash-native-audio-preview-12-2025")
      - voiceName: voice name (default: "Zephyr")
    """
    if not text or not text.strip():
        raise ValueError("text must be a non-empty string")
    
    voice_config = voice_config or {}
    
    # Use Gemini Live API
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
        logger.error(f"Gemini Live API TTS failed: {e}")
        # Return empty WAV as fallback
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

