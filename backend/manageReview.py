import os
import requests
import time
from dotenv import load_dotenv
from fastapi import HTTPException
from google import genai
from google.genai import types
from system_prompt import system_prompt

load_dotenv()

class GitHubCommenter:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("Missing GEMINI_API_KEY environment variable. Please set it in your environment.")
        
        self.token = os.environ.get("TOKEN")
        self.model = "gemini-2.0-flash"

        self.headers = {
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {self.token}",
            "X-GitHub-Api-Version": "2022-11-28",
        }

    def generate(self, changes: str):
        client = genai.Client(api_key=self.api_key)

        contents = [
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=changes)],
            )
        ]

        generate_config = types.GenerateContentConfig(
            response_mime_type="text/plain",
            system_instruction=[types.Part.from_text(text=system_prompt)],
        )

        response = client.models.generate_content(
            model=self.model,
            contents=contents,
            config=generate_config,
        )

        return response.text

    @staticmethod
    def extract_owner_repo(url: str):
        parts = url.rstrip('/').split('/')
        owner = parts[-2]
        repo = parts[-1].replace('.git', '')
        return owner, repo

    def get_comment(self, url: str, number: int):

        owner, repo = self.extract_owner_repo(url)
        files_url = f"https://api.github.com/repos/{owner}/{repo}/pulls/{number}/files"

        response = requests.get(files_url, headers=self.headers)
        
        if response.status_code == 200:
            print('Changes fetched. Generating comment...')

            return self.generate(str(response.json()))
        else:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch PR files.")

    def post_comment(self, comment: str, number: int, url: str):
        owner, repo = self.extract_owner_repo(url)
        comment_url = f"https://api.github.com/repos/{owner}/{repo}/issues/{number}/comments"

        data = {"body": comment}
        response = requests.post(comment_url, headers=self.headers, json=data)
        
        if response.status_code == 201:
            return {"comment": "Comment posted successfully."}
        else:
            raise HTTPException(status_code=response.status_code, detail="Failed to post comment.")

if __name__ == "__main__":
    commenter = GitHubCommenter()
    url = "https://github.com/Enejivk/axes-neo-interface.git"
    number = 1
    print(commenter.get_comment(url, number))
