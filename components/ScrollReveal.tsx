'use client';

import { useEffect, useRef, ReactNode } from 'react';

type Animation = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'fade-in' | 'zoom-in';

interface Props {
  children: ReactNode;
  animation?: Animation;
  delay?: number;   // ms
  duration?: number; // ms
  className?: string;
  threshold?: number; // 0~1
}

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  className = '',
  threshold = 0.15,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.animationDelay = `${delay}ms`;
          el.style.animationDuration = `${duration}ms`;
          el.classList.add('sr-visible', `sr-${animation}`);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animation, delay, duration, threshold]);

  return (
    <div ref={ref} className={`sr-base ${className}`}>
      {children}
    </div>
  );
}
