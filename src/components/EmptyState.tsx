
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface EmptyStateProps {
  title: string;
  description: string;
  additionalContent?: React.ReactNode;
}

export function EmptyState({ title, description, additionalContent }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-48 h-48 mx-auto mb-6 flex items-center justify-center">
        <DotLottieReact
          src="https://lottie.host/45bab164-5c01-4dc7-8aee-222644371965/Uumhvz82hk.lottie"
          loop
          autoplay
          className="w-full h-full object-contain"
        />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {additionalContent}
    </div>
  );
}
