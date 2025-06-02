import requests
import os
from typing import Optional
from dotenv import load_dotenv
from fastapi import HTTPException
from jose import jwt, ExpiredSignatureError, JWTError
from datetime import datetime, timedelta
import bcrypt


# Load environment variables from .env
load_dotenv()

class Auth:
    def __init__(self):
        self.GITHUB_CLIENT_SECRET = os.getenv("CLIENT_SECRETS")
        self.GITHUB_CLIENT_ID = os.getenv("CLIENT_ID")
        
        if not self.GITHUB_CLIENT_SECRET or not self.GITHUB_CLIENT_ID:
            raise ValueError("Missing GitHub client credentials in environment variables")

    def get_github_access_token(self, code: str) -> str:
        """
        Exchange the authorization code for an access token from GitHub
        """
        token_url = "https://github.com/login/oauth/access_token"

        payload = {
            "client_id": self.GITHUB_CLIENT_ID,
            "client_secret": self.GITHUB_CLIENT_SECRET,
            "code": code
        }

        headers = {
            "Accept": "application/json"
        }

        try:
            response = requests.post(token_url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            
            access_token = data.get("access_token")
            if not access_token:
                raise ValueError("No access token in GitHub response")
                
            return access_token

        except requests.RequestException as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to retrieve GitHub access token: {str(e)}"
            )
        except ValueError as ve:
            raise HTTPException(
                status_code=500,
                detail=str(ve)
            )

    def generate_jwt_token(self, user_id: str) -> str:
        SECRET_KEY = os.getenv("JWT_SECRET_KEY")
        if not SECRET_KEY:
            raise ValueError("Missing JWT_SECRET_KEY in environment variables")
        try:
            payload = {
                "sub": user_id,
                "exp": datetime.utcnow() + timedelta(days=1)
            }
            token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
            return token
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate JWT token: {str(e)}"
            )
        
    def generate_refresh_token(self, user_id: str) -> str:
        SECRET_KEY = os.getenv("JWT_SECRET_KEY")
        if not SECRET_KEY:
            raise ValueError("Missing JWT_SECRET_KEY in environment variables")
        try:
            payload = {
                "sub": user_id,
                "exp": datetime.utcnow() + timedelta(days=30),  # 30 days expiry for refresh token
                "type": "refresh"  # Mark this as a refresh token
            }
            token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
            return token
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate refresh token: {str(e)}"
            )

    def refresh_access_token(self, refresh_token: str) -> dict:
        """
        Generate new access token using refresh token
        """
        try:
            # Verify the refresh token
            user_id = self.verify_jwt_token(refresh_token)
            if not user_id:
                raise HTTPException(status_code=401, detail="Invalid refresh token")
            
            # Check if refresh token exists in Redis
            from redis import get_token_with_expiry
            stored_token = get_token_with_expiry(f"refresh_token:{user_id}")
            if not stored_token or stored_token != refresh_token:
                raise HTTPException(status_code=401, detail="Refresh token expired or invalid")
            
            # Generate new access token
            access_token = self.generate_jwt_token(user_id)
            
            # Store new access token in Redis
            from redis import set_token_with_expiry
            set_token_with_expiry(f"user_token:{user_id}", access_token, 24 * 60 * 60)
            
            return {
                "access_token": access_token,
                "user_id": user_id
            }
            
        except (ExpiredSignatureError, JWTError) as e:
            raise HTTPException(status_code=401, detail=str(e))

    def get_github_user_details(self, code: str) -> dict:
        """
        Use the access token to retrieve the authenticated user's GitHub profile
        """
        user_url = "https://api.github.com/user"
        access_token = self.get_github_access_token(code)

        headers = {
            "Authorization": f"token {access_token}",
            "Accept": "application/vnd.github+json"
        }

        try:
            response = requests.get(user_url, headers=headers)
            print("Fetching user details with access token:", access_token)
            response.raise_for_status()
            
            user_data = response.json()
            
            # Generate access and refresh tokens
            jwt_token = self.generate_jwt_token(str(user_data["id"]))
            refresh_token = self.generate_refresh_token(str(user_data["id"]))
            
            # Store both tokens in Redis
            from redis import set_token_with_expiry
            set_token_with_expiry(f"user_token:{user_data['id']}", jwt_token, 24 * 60 * 60)  # 24 hours
            set_token_with_expiry(f"refresh_token:{user_data['id']}", refresh_token, 30 * 24 * 60 * 60)  # 30 days
            
            return {
                "user": user_data,
                "token": jwt_token,
                "refresh_token": refresh_token
            }
            
        except requests.RequestException as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to fetch GitHub user details: {str(e)}"
            )
        
    def verify_jwt_token(self, token: str) -> Optional[str]:
        SECRET_KEY = os.getenv("JWT_SECRET_KEY")
        if not SECRET_KEY:
            raise ValueError("Missing JWT_SECRET_KEY in environment variables")

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            return payload.get("sub")
        except ExpiredSignatureError:
            raise HTTPException(
                status_code=401,
                detail="Token has expired"
            )
        except JWTError as e:
            raise HTTPException(
                status_code=401,
                detail=f"Invalid token: {str(e)}"
            )
