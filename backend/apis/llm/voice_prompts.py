"""
Voice agent commentary generation using LLM
"""

import json
import logging
import os
from typing import Any, Dict, Optional

from dotenv import load_dotenv
from google import genai
from google.genai import types

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

MODEL_NAME = os.getenv("GEMINI_MODEL_NAME", "gemini-3-flash-preview")


def get_gemini_api_key() -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set")
    return api_key


def generate_voice_commentary(
    event_type: str,
    context: Dict[str, Any]
) -> str:
    """
    Generate contextual voice commentary for game events.
    
    Args:
        event_type: Type of event (welcome, question_intro, answer_reveal, 
                   timer_warning, round_complete, new_round, game_over)
        context: Game context including question, leaderboard, round info, etc.
    
    Returns:
        Generated commentary text to be spoken
    """
    
    client = genai.Client(api_key=get_gemini_api_key())
    
    # Build context string
    context_str = json.dumps(context, indent=2)
    
    # Different prompts for different event types
    prompts = {
        "welcome": f"""You are an enthusiastic game show host for a trivia game called "Ultimate Trivia". 
Generate a brief, energetic welcome message (2-3 sentences max) to start the game.

Context:
{context_str}

Make it exciting and engaging. Keep it concise - this will be spoken aloud.""",

        "question_intro": f"""You are an enthusiastic game show host. Introduce the next trivia question in an engaging way.

Context:
{context_str}

Generate a brief introduction (1-2 sentences) that:
- Mentions the question number and total questions
- Builds excitement
- Is natural to speak aloud

Keep it under 20 words if possible.""",

        "answer_reveal": f"""You are a game show host revealing the correct answer. Make it dramatic and engaging.

Context:
{context_str}

Generate a brief reveal (1-2 sentences) that:
- Announces the correct answer clearly
- Is exciting and dramatic
- Is natural to speak aloud

Keep it under 25 words.""",

        "timer_warning": f"""You are a game show host giving a time warning. Make it urgent but not panicked.

Context:
{context_str}

Generate a brief warning (1 sentence, under 10 words) that creates urgency.""",

        "round_complete": f"""You are a game show host announcing round completion and leaderboard standings.

Context:
{context_str}

Generate a brief announcement (2-3 sentences) that:
- Celebrates the round completion
- Mentions the top 3 players and their scores
- Builds excitement for the next round

Keep it under 40 words total.""",

        "new_round": f"""You are a game show host introducing a new round. Build excitement and anticipation.

Context:
{context_str}

Generate a brief introduction (1-2 sentences, under 20 words) that gets players excited for the next round.""",

        "game_over": f"""You are a game show host announcing the game winner and final results.

Context:
{context_str}

Generate a celebratory announcement (2-3 sentences) that:
- Congratulates the winner
- Mentions their final score
- Thanks all players

Keep it under 40 words total.""",

        "explanation": f"""You are a game show host explaining the answer to a trivia question.

Context:
{context_str}

Generate a brief, clear explanation (1-2 sentences, under 30 words) that helps players understand the answer."""
    }
    
    prompt_text = prompts.get(event_type, prompts["question_intro"])
    
    contents = [
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=prompt_text)],
        )
    ]
    
    config = types.GenerateContentConfig(
        temperature=0.8,  # Creative but consistent
    )
    
    try:
        logger.info(f"Generating voice commentary for event: {event_type}")
        
        resp = client.models.generate_content(
            model=MODEL_NAME,
            contents=contents,
            config=config,
        )
        
        commentary = getattr(resp, "text", None) or ""
        commentary = commentary.strip()
        
        # Remove quotes if the LLM wrapped the response in them
        if commentary.startswith('"') and commentary.endswith('"'):
            commentary = commentary[1:-1]
        if commentary.startswith("'") and commentary.endswith("'"):
            commentary = commentary[1:-1]
        
        logger.info(f"Generated commentary: {commentary[:100]}...")
        return commentary
        
    except Exception as e:
        logger.error(f"Failed to generate voice commentary: {e}")
        # Fallback to simple default messages
        fallbacks = {
            "welcome": f"Welcome to Ultimate Trivia! Round {context.get('round', 1)} is about to begin.",
            "question_intro": f"Question {context.get('questionNum', 1)} of {context.get('totalQuestions', 1)}.",
            "answer_reveal": f"The correct answer is {context.get('correctAnswer', '')}.",
            "timer_warning": f"{context.get('seconds', 10)} seconds remaining.",
            "round_complete": f"Round {context.get('round', 1)} complete!",
            "new_round": f"Get ready for round {context.get('nextRound', 1)}!",
            "game_over": "Game over!",
            "explanation": context.get('explanation', ''),
        }
        return fallbacks.get(event_type, "Let's continue!")
