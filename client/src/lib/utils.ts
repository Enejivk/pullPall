import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getGitHubAvatarUrl(username: string): string {
  return `https://github.com/${username}.png`;
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const urlObj = new URL(url);
    
    if (!urlObj.hostname.includes('github.com')) {
      return null;
    }
    
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    
    if (pathSegments.length < 2) {
      return null;
    }
    
    return {
      owner: pathSegments[0],
      repo: pathSegments[1],
    };
  } catch (error) {
    return null;
  }
}