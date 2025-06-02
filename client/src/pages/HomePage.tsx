import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { 
  Github, 
  Code, 
  Zap, 
  Bot, 
  Shield, 
  ChevronRight, 
  Terminal,
  CheckCircle 
} from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 bg-hero-pattern opacity-5"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary opacity-5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-accent opacity-5 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-3 py-1 mb-6 text-xs font-medium rounded-full bg-accent/10 text-accent">
                AI-Powered GitHub Reviews
              </span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              AI-Powered Pull Request<br />Reviews in Seconds
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Paste your GitHub repo and PR number — we'll do the rest.
              Get comprehensive, context-aware code reviews powered by AI.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/dashboard">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="animate-glow"
                  icon={<Terminal size={20} />}
                >
                  Use the App
                </Button>
              </Link>
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="lg"
                  icon={<Github size={20} />}
                >
                  Sign in with GitHub
                </Button>
              </Link>
            </motion.div>

            {/* Hero Image/Visual */}
            <motion.div
              className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <img
                src="https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="PR Sensei Dashboard Preview"
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-radial from-background to-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              PR Sensei delivers powerful, developer-focused code reviews with features designed to improve your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Code className="text-primary\" size={28} />,
                title: 'Context-aware Feedback',
                description: 'Analyzes code with full repository context for smarter, more relevant insights.',
              },
              {
                icon: <Zap className="text-accent" size={28} />,
                title: 'Instant, Reliable Reviews',
                description: 'Get comprehensive code reviews in seconds, not hours or days.',
              },
              {
                icon: <Bot className="text-secondary\" size={28} />,
                title: 'AI-Powered Analysis',
                description: 'Leverages advanced AI models trained on millions of code repositories.',
              },
              {
                icon: <Shield className="text-success" size={28} />,
                title: 'No Setup Required',
                description: 'Simply paste your PR URL — no complex integrations or configurations needed.',
              },
            ].map((feature, index) => (
              <Card 
                key={index}
                className="relative overflow-hidden group hover:border-primary/50 transition-colors"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full -mr-16 -mt-16 group-hover:from-primary/10 group-hover:to-secondary/10 transition-colors"></div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative z-10"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in seconds with our simple three-step process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Authenticate with GitHub',
                description: 'Sign in with your GitHub account to enable PR Sensei to access your repositories.',
                icon: <Github size={28} />,
              },
              {
                step: '02',
                title: 'Paste Repo & PR Number',
                description: 'Enter your repository URL and pull request number in the dashboard.',
                icon: <Terminal size={28} />,
              },
              {
                step: '03',
                title: 'Get AI Review',
                description: 'Receive a comprehensive code review with actionable insights and suggestions.',
                icon: <CheckCircle size={28} />,
              },
            ].map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-6 relative">
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
                    {step.step}
                  </span>
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-16">
            <Link to="/dashboard">
              <Button 
                variant="primary"
                size="lg"
                className="animate-glow"
                icon={<ChevronRight size={20} />}
                iconPosition="right"
              >
                Try It Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-background to-card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-30"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to see your first AI review?
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Join thousands of developers who use PR Sensei to ship better code faster.
            </p>
            <Link to="/dashboard">
              <Button 
                variant="primary" 
                size="lg"
                className="animate-glow"
                icon={<Terminal size={20} />}
              >
                Use the App Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};