import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Github, 
  Hash, 
  AlertCircle,
  Loader,
  History
} from 'lucide-react';

import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAppStore, Review } from '../lib/store';
import { formatDate, parseGitHubUrl } from '../lib/utils';

// Mock review data for the demo
const MOCK_REVIEW: Review = {
  id: 'review-1',
  repoUrl: 'https://github.com/facebook/react',
  prNumber: 42,
  createdAt: new Date(),
  summary: "This PR implements a new hook for managing form state. The implementation is clean and follows React best practices. There are a few areas where error handling could be improved.",
  strengths: [
    "Good use of TypeScript for type safety",
    "Comprehensive test coverage",
    "Well-documented functions with examples"
  ],
  concerns: [
    "Missing error handling in async operations",
    "Some functions could be optimized for performance"
  ],
  suggestions: [
    "Consider adding more robust error handling, especially for network operations",
    "The FormProvider component could benefit from memoization",
    "Add more explicit typing for the form values object"
  ]
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, reviews, addReview } = useAppStore();
  const [repoUrl, setRepoUrl] = useState('');
  const [prNumber, setPrNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReview = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate URL
    const parsedRepo = parseGitHubUrl(repoUrl);
    if (!parsedRepo) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }

    // Validate PR number
    const prNum = parseInt(prNumber);
    if (isNaN(prNum) || prNum <= 0) {
      setError('Please enter a valid PR number');
      return;
    }

    // Simulate loading
    setIsLoading(true);
    
    // For demo: add review after delay
    setTimeout(() => {
      const newReview = {
        ...MOCK_REVIEW,
        id: `review-${Date.now()}`,
        repoUrl,
        prNumber: prNum,
        createdAt: new Date()
      };
      
      addReview(newReview);
      setIsLoading(false);
      navigate(`/review/${newReview.id}`);
    }, 2000);
  };

  if (!user) {
    // return <Navigate to="/login\" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">PR Review Dashboard</h1>
          <p className="text-muted-foreground">
            Submit a GitHub pull request for an instant AI-powered code review
          </p>
        </div>

        <Card className="mb-12">
          <form onSubmit={handleGenerateReview}>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Generate a New Review</h2>
              </div>
              <div className="space-y-4">
                <Input
                  label="GitHub Repository URL"
                  placeholder="https://github.com/user/repo"
                  icon={<Github size={18} />}
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  required
                  error={error && error.includes('repository') ? error : undefined}
                />

                <Input
                  label="Pull Request Number"
                  placeholder="42"
                  icon={<Hash size={18} />}
                  type="number"
                  value={prNumber}
                  onChange={(e) => setPrNumber(e.target.value)}
                  required
                  min="1"
                  error={error && error.includes('PR number') ? error : undefined}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Generating Review...' : 'Generate Review'}
              </Button>
              
              {error && !error.includes('repository') && !error.includes('PR number') && (
                <div className="flex items-center gap-2 text-error text-sm mt-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </form>
        </Card>

        <div className="mb-6 flex items-center gap-2">
          <History size={18} />
          <h2 className="text-xl font-semibold">Recent Reviews</h2>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Link key={review.id} to={`/review/${review.id}`}>
                <Card className="p-4 hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">
                        {review.repoUrl.split('/').slice(-2).join('/')} #{review.prNumber}
                      </h3>
                      <p className="text-muted-foreground line-clamp-1 mt-1">
                        {review.summary}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(new Date(review.createdAt))}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-6 flex flex-col items-center justify-center text-center">
            <div className="text-muted-foreground mb-2">
              <History size={48} strokeWidth={1.5} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
              <p className="mb-4">Submit your first PR to get started</p>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
};