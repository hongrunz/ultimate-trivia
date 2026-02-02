"""
Google Cloud Text-to-Speech service
"""

import os
from typing import Optional

from dotenv import load_dotenv
from google.cloud import texttospeech

# Load backend/.env first (with override)
_this_dir = os.path.dirname(os.path.abspath(__file__))
_backend_dir = os.path.abspath(os.path.join(_this_dir, "..", ".."))
_backend_env = os.path.join(_backend_dir, ".env")
if os.path.isfile(_backend_env):
    load_dotenv(_backend_env, override=True)
# Also load from project root and cwd
_root_env = os.path.join(_backend_dir, "..", ".env")
if os.path.isfile(_root_env):
    load_dotenv(_root_env)
load_dotenv()  # cwd .env

# Google Cloud TTS client (will be initialized lazily)
_tts_client: Optional[texttospeech.TextToSpeechClient] = None


def get_tts_client() -> texttospeech.TextToSpeechClient:
    """Get or create Google Cloud TTS client using service account credentials"""
    global _tts_client
    
    if _tts_client is not None:
        return _tts_client
    
    # Priority 1: Check for service account JSON in environment variable (for deployment)
    service_account_json = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
    
    if service_account_json and service_account_json.strip():
        try:
            import json
            from google.oauth2 import service_account
            
            # Parse and create credentials from JSON
            creds_info = json.loads(service_account_json)
            credentials = service_account.Credentials.from_service_account_info(creds_info)
            
            # Create client with explicit credentials
            _tts_client = texttospeech.TextToSpeechClient(credentials=credentials)
            return _tts_client
        except (json.JSONDecodeError, Exception):
            # Don't raise here, try other methods instead
            pass
    

def synthesize_speech(
    text: str,
    language_code: str = "en-US",
    voice_name: Optional[str] = None,
    ssml_gender: Optional[texttospeech.SsmlVoiceGender] = None,
    speaking_rate: float = 1.0,
    pitch: float = 0.0,
) -> bytes:
    """
    Synthesize speech using Google Cloud TTS
    
    Args:
        text: Text to synthesize
        language_code: Language code (e.g., "en-US")
        voice_name: Specific voice name (e.g., "en-US-Neural2-F")
        ssml_gender: Voice gender (MALE, FEMALE, NEUTRAL)
        speaking_rate: Speaking rate (0.25 to 4.0, default 1.0)
        pitch: Pitch adjustment (-20.0 to 20.0, default 0.0)
    
    Returns:
        Audio data as bytes (MP3 format)
    """
    try:
        client = get_tts_client()
        
        # Set up the voice selection
        if voice_name:
            voice = texttospeech.VoiceSelectionParams(
                name=voice_name,
                language_code=language_code,
            )
        else:
            # Auto-select a good voice based on gender preference
            voice = texttospeech.VoiceSelectionParams(
                language_code=language_code,
                ssml_gender=ssml_gender or texttospeech.SsmlVoiceGender.FEMALE,
            )
        
        # Configure audio output
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3,
            speaking_rate=speaking_rate,
            pitch=pitch,
        )
        
        # Perform the text-to-speech request
        synthesis_input = texttospeech.SynthesisInput(text=text)
        
        response = client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config,
        )
        
        return response.audio_content
        
    except Exception as e:
        raise RuntimeError(f"Failed to synthesize speech: {str(e)}") from e


def list_available_voices(language_code: str = "en-US") -> list:
    """List available voices for a language"""
    try:
        client = get_tts_client()
        voices = client.list_voices(language_code=language_code)
        return [
            {
                "name": voice.name,
                "language_code": voice.language_codes[0] if voice.language_codes else language_code,
                "ssml_gender": voice.ssml_gender.name if voice.ssml_gender else "NEUTRAL",
                "natural_sample_rate_hertz": voice.natural_sample_rate_hertz,
            }
            for voice in voices.voices
        ]
    except RuntimeError:
        # TTS not configured - return empty list, frontend will use browser TTS
        return []
    except Exception:
        return []
