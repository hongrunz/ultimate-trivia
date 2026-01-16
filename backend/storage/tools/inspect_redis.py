#!/usr/bin/env python3
"""
Helper script to inspect Redis data
Usage: 
  From backend directory: python -m storage.tools.inspect_redis
  Or: python storage/tools/inspect_redis.py <room-id>
"""

import sys
import os
import json

# Add backend directory to path to allow imports
backend_dir = os.path.join(os.path.dirname(__file__), '../..')
backend_dir = os.path.abspath(backend_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from redis.exceptions import ConnectionError as RedisConnectionError
from storage.client import get_redis_client

def inspect_redis():
    """Inspect all Redis keys and their values"""
    try:
        r = get_redis_client()
        r.ping()
        print("✓ Connected to Redis\n")
    except RedisConnectionError as e:
        print(f"✗ Failed to connect to Redis: {e}")
        return
    
    # Get all keys
    keys = r.keys("*")
    
    if not keys:
        print("No keys found in Redis")
        return
    
    print(f"Found {len(keys)} keys:\n")
    print("=" * 80)
    
    for key in sorted(keys):
        key_type = r.type(key)
        print(f"\nKey: {key}")
        print(f"Type: {key_type}")
        
        if key_type == "hash":
            # Hash (rooms, players)
            data = r.hgetall(key)
            print(f"Fields: {len(data)}")
            for field, value in data.items():
                # Try to pretty-print JSON values
                if field in ["topics", "options"]:
                    try:
                        value = json.loads(value)
                        print(f"  {field}: {value}")
                    except:
                        print(f"  {field}: {value}")
                else:
                    print(f"  {field}: {value}")
        
        elif key_type == "string":
            # String (token mappings)
            value = r.get(key)
            print(f"Value: {value}")
        
        elif key_type == "set":
            # Set (room players)
            members = r.smembers(key)
            print(f"Members ({len(members)}): {list(members)}")
        
        elif key_type == "list":
            # List (questions)
            length = r.llen(key)
            print(f"Length: {length}")
            if length > 0:
                print("First item:")
                first = r.lindex(key, 0)
                try:
                    first_data = json.loads(first)
                    print(json.dumps(first_data, indent=2))
                except:
                    print(first)
        
        elif key_type == "zset":
            # Sorted set (leaderboard)
            members = r.zrevrange(key, 0, -1, withscores=True)
            print(f"Members ({len(members)}):")
            for member, score in members:
                print(f"  {member}: {score}")
        
        print("-" * 80)

def inspect_room(room_id: str):
    """Inspect a specific room"""
    try:
        r = get_redis_client()
        r.ping()
    except RedisConnectionError as e:
        print(f"✗ Failed to connect to Redis: {e}")
        return
    
    from uuid import UUID
    try:
        room_uuid = UUID(room_id)
    except:
        print(f"Invalid room ID: {room_id}")
        return
    
    room_key = f"room:{room_id}"
    if not r.exists(room_key):
        print(f"Room {room_id} not found")
        return
    
    print(f"\nRoom: {room_id}")
    print("=" * 80)
    
    # Room data
    room_data = r.hgetall(room_key)
    print("\nRoom Data:")
    for field, value in room_data.items():
        if field == "topics":
            try:
                value = json.loads(value)
            except:
                pass
        print(f"  {field}: {value}")
    
    # Players
    players_key = f"room:{room_id}:players"
    player_ids = r.smembers(players_key)
    player_ids = {pid for pid in player_ids if pid}
    
    print(f"\nPlayers ({len(player_ids)}):")
    for player_id in player_ids:
        player_key = f"player:{player_id}"
        player_data = r.hgetall(player_key)
        if player_data:
            print(f"  - {player_data.get('player_name', 'Unknown')} (ID: {player_id})")
            print(f"    Score: {player_data.get('score', 0)}")
            print(f"    Token: {player_data.get('player_token', 'N/A')[:20]}...")
    
    # Leaderboard
    scores_key = f"room:{room_id}:scores"
    leaderboard = r.zrevrange(scores_key, 0, -1, withscores=True)
    if leaderboard:
        print(f"\nLeaderboard:")
        for rank, (player_id, score) in enumerate(leaderboard, 1):
            player_key = f"player:{player_id}"
            player_data = r.hgetall(player_key)
            player_name = player_data.get('player_name', 'Unknown') if player_data else 'Unknown'
            print(f"  {rank}. {player_name}: {int(score)} points")
    
    # Questions
    questions_key = f"room:{room_id}:questions"
    question_count = r.llen(questions_key)
    print(f"\nQuestions: {question_count}")
    if question_count > 0:
        print("First question:")
        first_q = r.lindex(questions_key, 0)
        try:
            q_data = json.loads(first_q)
            print(json.dumps(q_data, indent=2))
        except:
            print(first_q)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Inspect specific room
        inspect_room(sys.argv[1])
    else:
        # Inspect all data
        inspect_redis()
