import { api } from "./config";

export function handleGithubAuth() {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI;
    const scope = 'read:user user:email'; // example scopes for basic profile and email

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
    )}&scope=${encodeURIComponent(scope)}`;

    window.location.href = githubAuthUrl;
}

export async function handleAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (!code) {
        console.error('No code found in the URL');
        return;
        console.log('I was called no code')
    }

    try {
        const response = await api.post('/auth/github/callback', { code });
        return response.data;
    } catch(error) {
        console.error('Error during GitHub authentication:', error);
        throw error;
    }
}