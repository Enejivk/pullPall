from fastapi import FastAPI, HTTPException, Response, Cookie
from manageReview import GitHubCommenter
from auth import Auth
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import asyncio
from typing import Optional

load_dotenv()
class PostComment(BaseModel):
    text: str
    pr_number: int
    repo_url: str

class GetComment(BaseModel):
    pr_number: int
    repo_url: str

class GithubAuthCode(BaseModel):
    code: str

class TokenResponse(BaseModel):
    access_token: str
    user_id: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

commenter = GitHubCommenter()
auth = Auth()

@app.post('/get_comment')
async def get_comment(value: GetComment):
    comment = commenter.get_comment(value.repo_url, value.pr_number)
    if comment:
        return {'comment': comment}
    raise HTTPException(detail="failed to generate comment", status_code=500)

@app.post('/post_comment')
async def post_comment(comment: PostComment):
    response = commenter.post_comment(comment.text, comment.pr_number, comment.repo_url)
    return response

@app.post('/auth/refresh')
async def refresh_token(response: Response, refresh_token: Optional[str] = Cookie(None)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token provided")
    
    try:
        # Get new access token
        token_data = auth.refresh_access_token(refresh_token)
        
        # Set new access token in cookie
        response.set_cookie(
            key="auth_token",
            value=token_data["access_token"],
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=24 * 60 * 60
        )
        
        return token_data
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@app.post('/auth/github/callback')
async def handle_github_auth_code(github_auth_code: GithubAuthCode, response: Response):
    try:
        # Get user details and tokens
        auth_result = auth.get_github_user_details(github_auth_code.code)
        
        # Set access token in HTTP-only cookie
        response.set_cookie(
            key="auth_token",
            value=auth_result["token"],
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=24 * 60 * 60
        )
        
        # Set refresh token in HTTP-only cookie
        response.set_cookie(
            key="refresh_token",
            value=auth_result["refresh_token"],
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=30 * 24 * 60 * 60
        )
        
        return auth_result["user"]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
        
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)