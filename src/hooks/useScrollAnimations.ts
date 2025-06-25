
import { useEffect, useState } from 'react';

export const useScrollAnimations = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxTransform = (speed: number = 0.5) => ({
    transform: `translateY(${scrollY * speed}px)`,
  });

  const fadeInUp = (delay: number = 0) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
    transition: `all 0.8s ease-out ${delay}ms`,
  });

  return {
    scrollY,
    isVisible,
    parallaxTransform,
    fadeInUp,
  };
};
