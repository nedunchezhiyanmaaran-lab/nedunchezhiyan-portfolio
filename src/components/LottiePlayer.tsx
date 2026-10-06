import React, { useState } from 'react';
import { Lottie } from 'lottie-react';

interface LottiePlayerProps {
  src?: string;
  animationData?: object;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  fallbackIcon?: React.ReactNode;
}

export const LottiePlayer: React.FC<LottiePlayerProps> = ({
  src,
  animationData,
  loop = true,
  autoplay = true,
  className = 'w-full h-full',
  fallbackIcon,
}) => {
  const [hasError, setHasError] = useState(false);
  const targetSrc = animationData || src;

  if (!targetSrc || hasError) {
    return fallbackIcon ? (
      <div className={`flex items-center justify-center ${className}`}>{fallbackIcon}</div>
    ) : null;
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Lottie
        src={targetSrc}
        loop={loop}
        autoplay={autoplay}
        className="w-full h-full"
        subscriptions={{
          error: () => setHasError(true),
        }}
      />
    </div>
  );
};
