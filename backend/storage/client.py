"""
Redis client setup
"""

import os
from dotenv import load_dotenv
from typing import Optional

# Import Redis classes directly to avoid naming conflict with this package
from redis import Redis
from redis.exceptions import ConnectionError as RedisConnectionError

# Load environment variables from .env file
load_dotenv()

_redis_client: Optional[Redis] = None


def get_redis_client() -> Redis:
    """
    Create and return a Redis client instance.
    Reads credentials from environment variables.
    """
    global _redis_client
    
    if _redis_client is not None:
        return _redis_client
    
    redis_url = os.getenv("REDIS_URL")
    redis_host = os.getenv("REDIS_HOST", "localhost")
    redis_port = int(os.getenv("REDIS_PORT", "6379"))
    redis_password = os.getenv("REDIS_PASSWORD")
    redis_db = int(os.getenv("REDIS_DB", "0"))
    
    # Import redis module for from_url function
    import redis as redis_module
    
    if redis_url:
        # Use Redis URL if provided (e.g., for Redis Cloud, Upstash, etc.)
        _redis_client = redis_module.from_url(redis_url, decode_responses=True)
    else:
        # Use individual connection parameters
        _redis_client = Redis(
            host=redis_host,
            port=redis_port,
            password=redis_password,
            db=redis_db,
            decode_responses=True  # Automatically decode bytes to strings
        )
    
    # Test connection
    try:
        _redis_client.ping()
    except RedisConnectionError as e:
        raise ValueError(f"Failed to connect to Redis: {e}")
    
    return _redis_client
