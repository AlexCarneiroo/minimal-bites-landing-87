
import { useEffect, useRef, useState } from 'react';

interface ScrollAnimationWrapperProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'zoomIn';
  delay?: number;
  threshold?: number;
}

const ScrollAnimationWrapper = ({ 
  children, 
  className = '', 
  animation = 'fadeInUp',
  delay = 0,
  threshold = 0.1
}: ScrollAnimationWrapperProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay, threshold]);

  const getAnimationClass = () => {
    switch (animation) {
      case 'fadeInUp':
        return isVisible 
          ? 'opacity-100 translate-y-0 transform' 
          : 'opacity-0 translate-y-8 transform';
      case 'fadeInLeft':
        return isVisible 
          ? 'opacity-100 translate-x-0 transform' 
          : 'opacity-0 -translate-x-8 transform';
      case 'fadeInRight':
        return isVisible 
          ? 'opacity-100 translate-x-0 transform' 
          : 'opacity-0 translate-x-8 transform';
      case 'zoomIn':
        return isVisible 
          ? 'opacity-100 scale-100 transform' 
          : 'opacity-0 scale-95 transform';
      default:
        return '';
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${getAnimationClass()} ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollAnimationWrapper;
