import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'glow';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'card',
          {
            'glass': variant === 'glass',
            'glow': variant === 'glow',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';