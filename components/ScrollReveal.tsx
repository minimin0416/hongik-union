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
          // 진입 시: 클래스 제거 후 reflow → 다시 추가 (애니메이션 재실행)
          el.classList.remove('sr-visible', `sr-${animation}`);
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          el.offsetHeight; // force reflow
          el.style.animationDelay = `${delay}ms`;
          el.style.animationDuration = `${duration}ms`;
          el.classList.add('sr-visible', `sr-${animation}`);
        } else {
          // 벗어날 시: 클래스 제거 → 다음 진입 때 다시 애니메이션
          el.classList.remove('sr-visible', `sr-${animation}`);
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
