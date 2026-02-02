"""
Voice commentary API endpoints
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Any, Dict, Optional
from io import BytesIO

from apis.llm.voice_prompts import generate_voice_commentary
from apis.tts_service import synthesize_speech

router = APIRouter(prefix="/api/voice", tags=["voice"])


class VoiceCommentaryRequest(BaseModel):
    event_type: str  # welcome, question_intro, answer_reveal, timer_warning, round_complete, new_round, game_over, explanation
    context: Dict[str, Any]


class VoiceCommentaryResponse(BaseModel):
    commentary: str


@router.post("/commentary", response_model=VoiceCommentaryResponse)
async def get_voice_commentary(request: VoiceCommentaryRequest):
    """
    Generate contextual voice commentary for game events
    """
    try:
        valid_event_types = [
            "welcome", "question_intro", "answer_reveal", "timer_warning",
            "round_complete", "new_round", "game_over", "explanation"
        ]
        
        if request.event_type not in valid_event_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid event_type. Must be one of: {', '.join(valid_event_types)}"
            )
        
        commentary = generate_voice_commentary(request.event_type, request.context)
        
        return VoiceCommentaryResponse(commentary=commentary)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating commentary: {str(e)}")


class TextToSpeechRequest(BaseModel):
    text: str
    language_code: str = "en-US"
    voice_name: Optional[str] = None
    speaking_rate: float = 1.0
    pitch: float = 0.0


@router.post("/speak")
async def text_to_speech(request: TextToSpeechRequest):
    """
    Convert text to speech using Google Cloud TTS and return audio stream
    Falls back gracefully if Google Cloud TTS is not configured
    """
    try:
        if not request.text or not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        if len(request.text) > 5000:
            raise HTTPException(status_code=400, detail="Text too long (max 5000 characters)")
        
        # Try to synthesize speech with Google Cloud TTS
        try:
            audio_content = synthesize_speech(
                text=request.text,
                language_code=request.language_code,
                voice_name=request.voice_name,
                speaking_rate=request.speaking_rate,
                pitch=request.pitch,
            )
            
            # Return audio as streaming response
            audio_buffer = BytesIO(audio_content)
            audio_buffer.seek(0)
            
            return StreamingResponse(
                audio_buffer,
                media_type="audio/mpeg",
                headers={
                    "Content-Disposition": "inline; filename=speech.mp3",
                    "Cache-Control": "no-cache"
                }
            )
        except RuntimeError as e:
            # Google Cloud TTS not configured - return error so frontend can use browser TTS
            error_msg = str(e)
            if "not configured" in error_msg.lower() or "credentials" in error_msg.lower():
                raise HTTPException(
                    status_code=503, 
                    detail="Google Cloud TTS not configured. Please use browser TTS fallback."
                )
            raise HTTPException(status_code=503, detail=str(e))
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error synthesizing speech: {str(e)}")


@router.get("/voices")
async def list_voices(language_code: str = "en-US"):
    """
    List available voices for a language
    """
    try:
        from apis.tts_service import list_available_voices
        voices = list_available_voices(language_code)
        return {"voices": voices}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing voices: {str(e)}")
