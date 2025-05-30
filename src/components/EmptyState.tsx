
import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  additionalContent?: React.ReactNode;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-player': any;
    }
  }
}

export function EmptyState({ title, description, additionalContent }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="mx-auto mb-6 flex justify-center">
        <dotlottie-player
          src="https://lottie.host/45bab164-5c01-4dc7-8aee-222644371965/Uumhvz82hk.lottie"
          background="transparent"
          speed="1"
          style={{ width: '300px', height: '300px' }}
          loop
          autoplay
        />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {additionalContent}
    </div>
  );
}
