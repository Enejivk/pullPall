import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Copy, 
  Check,
  Github,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  FileText,
  Edit2,
  Save,
  Send
} from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ReactMarkdown from 'react-markdown';

import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useAppStore, Review } from '../lib/store';
import { formatDate } from '../lib/utils';

export const ReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { reviews, updateReview, postToGitHub } = useAppStore();
  const [review, setReview] = useState<Review | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedReview, setEditedReview] = useState<Review | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const foundReview = reviews.find(r => r.id === id);
      if (foundReview) {
        setReview(foundReview);
        setEditedReview(foundReview);
      }
    }
  }, [id, reviews]);

  if (!review || !editedReview) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Review Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The review you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedReview(review);
    }
  };

  const handleSave = () => {
    if (editedReview) {
      updateReview(review.id, editedReview);
      setReview(editedReview);
      setIsEditing(false);
    }
  };

  const handlePostToGitHub = async () => {
    setIsPosting(true);
    setPostError(null);
    
    try {
      const commentId = await postToGitHub(review);
      if (commentId) {
        updateReview(review.id, { githubCommentId: commentId });
        setPostError(null);
      } else {
        setPostError('Failed to post review to GitHub. Please check your permissions and try again.');
      }
    } catch (error) {
      setPostError('An error occurred while posting to GitHub.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleCopyReview = () => {
    navigator.clipboard.writeText(getReviewText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getReviewText = () => {
    return `# PR Review for ${review.repoUrl} #${review.prNumber}
Generated on ${formatDate(new Date(review.createdAt))}

## Summary
${review.summary}

## Strengths
${review.strengths.map(s => `- ${s}`).join('\n')}

## Concerns
${review.concerns.map(c => `- ${c}`).join('\n')}

## Suggestions
${review.suggestions.map(s => `- ${s}`).join('\n')}

Generated by PR Sensei`;
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />}>
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">
              PR Review: {review.repoUrl.split('/').slice(-2).join('/')} #{review.prNumber}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <Github size={16} />
              <a 
                href={`${review.repoUrl}/pull/${review.prNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary hover:underline transition-colors"
              >
                View on GitHub
              </a>
              <span className="text-muted-foreground">•</span>
              <span>{formatDate(new Date(review.createdAt))}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleEditToggle}
              icon={isEditing ? <Save size={16} /> : <Edit2 size={16} />}
            >
              {isEditing ? 'Cancel Edit' : 'Edit Review'}
            </Button>
            {isEditing ? (
              <Button 
                variant="primary"
                onClick={handleSave}
                icon={<Save size={16} />}
              >
                Save Changes
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleCopyReview}
                  icon={copied ? <Check size={16} /> : <Copy size={16} />}
                >
                  {copied ? 'Copied!' : 'Copy Review'}
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePostToGitHub}
                  icon={<Send size={16} />}
                  isLoading={isPosting}
                  disabled={isPosting || !!review.githubCommentId}
                >
                  {review.githubCommentId ? 'Posted to GitHub' : 'Post to GitHub'}
                </Button>
              </>
            )}
          </div>
        </div>

        {postError && (
          <Card className="mb-8 border-error/20 p-4">
            <div className="flex items-center gap-2 text-error">
              <AlertTriangle size={16} />
              <p>{postError}</p>
            </div>
          </Card>
        )}

        {/* Summary Section */}
        <Card className="mb-8 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={20} className="text-primary" />
            <h2 className="text-xl font-semibold">Summary</h2>
          </div>
          {isEditing ? (
            <textarea
              className="w-full h-32 p-3 bg-muted rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={editedReview.summary}
              onChange={(e) => setEditedReview({ ...editedReview, summary: e.target.value })}
            />
          ) : (
            <ReactMarkdown className="prose prose-invert max-w-none">
              {review.summary}
            </ReactMarkdown>
          )}
        </Card>

        {/* Strengths Section */}
        <Card className="mb-8 border-success/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={20} className="text-success" />
            <h2 className="text-xl font-semibold">Strengths</h2>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              {editedReview.strengths.map((strength, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={strength}
                    onChange={(e) => {
                      const newStrengths = [...editedReview.strengths];
                      newStrengths[index] = e.target.value;
                      setEditedReview({ ...editedReview, strengths: newStrengths });
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newStrengths = editedReview.strengths.filter((_, i) => i !== index);
                      setEditedReview({ ...editedReview, strengths: newStrengths });
                    }}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditedReview({
                    ...editedReview,
                    strengths: [...editedReview.strengths, '']
                  });
                }}
              >
                Add Strength
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {review.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1 text-success">•</span>
                  <ReactMarkdown className="prose prose-invert max-w-none">
                    {strength}
                  </ReactMarkdown>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Concerns Section */}
        <Card className="mb-8 border-warning/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-warning" />
            <h2 className="text-xl font-semibold">Concerns</h2>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              {editedReview.concerns.map((concern, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={concern}
                    onChange={(e) => {
                      const newConcerns = [...editedReview.concerns];
                      newConcerns[index] = e.target.value;
                      setEditedReview({ ...editedReview, concerns: newConcerns });
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newConcerns = editedReview.concerns.filter((_, i) => i !== index);
                      setEditedReview({ ...editedReview, concerns: newConcerns });
                    }}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditedReview({
                    ...editedReview,
                    concerns: [...editedReview.concerns, '']
                  });
                }}
              >
                Add Concern
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {review.concerns.map((concern, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1 text-warning">•</span>
                  <ReactMarkdown className="prose prose-invert max-w-none">
                    {concern}
                  </ReactMarkdown>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Suggestions Section */}
        <Card className="mb-8 border-accent/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={20} className="text-accent" />
            <h2 className="text-xl font-semibold">Suggestions</h2>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              {editedReview.suggestions.map((suggestion, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={suggestion}
                    onChange={(e) => {
                      const newSuggestions = [...editedReview.suggestions];
                      newSuggestions[index] = e.target.value;
                      setEditedReview({ ...editedReview, suggestions: newSuggestions });
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newSuggestions = editedReview.suggestions.filter((_, i) => i !== index);
                      setEditedReview({ ...editedReview, suggestions: newSuggestions });
                    }}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditedReview({
                    ...editedReview,
                    suggestions: [...editedReview.suggestions, '']
                  });
                }}
              >
                Add Suggestion
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {review.suggestions.map((suggestion, index) => (
                <li key={index} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <ReactMarkdown className="prose prose-invert max-w-none">
                      {suggestion}
                    </ReactMarkdown>
                  </div>
                  {index === 0 && (
                    <div className="ml-5 mt-2">
                      <SyntaxHighlighter
                        language="typescript"
                        style={atomOneDark}
                        customStyle={{
                          borderRadius: '0.5rem',
                          padding: '1rem',
                          fontSize: '0.875rem',
                        }}
                      >
                        {`// Before
async function fetchData() {
  const response = await api.get('/endpoint');
  return response.data;
}

// After
async function fetchData() {
  try {
    const response = await api.get('/endpoint');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw new Error('Failed to fetch data');
  }
}`}
                      </SyntaxHighlighter>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Actions Section */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
          
          <div className="flex gap-3">
            <a 
              href={`${review.repoUrl}/pull/${review.prNumber}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                variant="ghost" 
                icon={<Github size={16} />}
              >
                View PR on GitHub
              </Button>
            </a>
            
            {!isEditing && (
              <>
                <Button 
                  variant="outline"
                  onClick={handleCopyReview}
                  icon={copied ? <Check size={16} /> : <Copy size={16} />}
                >
                  {copied ? 'Copied!' : 'Copy Review'}
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePostToGitHub}
                  icon={<Send size={16} />}
                  isLoading={isPosting}
                  disabled={isPosting || !!review.githubCommentId}
                >
                  {review.githubCommentId ? 'Posted to GitHub' : 'Post to GitHub'}
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};