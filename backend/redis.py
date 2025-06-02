import redis

r = redis.Redis(host='localhost', port=6379, db=0)

def set_value(key, value):
    try:
        r.set(key, value)
        return True
    except redis.RedisError as e:
        print(f"Error setting value in Redis: {e}")
        return False
    
def get_value(key):
    try:
        value = r.get(key)
        if value is not None:
            return value.decode('utf-8')  # Decode bytes to string
        return None
    except redis.RedisError as e:
        print(f"Error getting value from Redis: {e}")
        return None
    
def delete_value(key):
    try:
        r.delete(key)
        return True
    except redis.RedisError as e:
        print(f"Error deleting value from Redis: {e}")
        return False
    
def set_token_with_expiry(key, value, expiry_seconds):
    try:
        r.setex(key, expiry_seconds, value)
        return True
    except redis.RedisError as e:
        print(f"Error setting token with expiry in Redis: {e}")
        return False
    
def get_token_with_expiry(key):
    try:
        value = r.get(key)
        if value is not None:
            return value.decode('utf-8')  # Decode bytes to string
        return None
    except redis.RedisError as e:
        print(f"Error getting token with expiry from Redis: {e}")
        return None
    
def delete_token_with_expiry(key):
    try:
        r.delete(key)
        return True
    except redis.RedisError as e:
        print(f"Error deleting token with expiry from Redis: {e}")
        return False
    