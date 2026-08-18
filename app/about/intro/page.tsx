'use client';
import { useEffect, useState } from 'react';
import { getSiteContent } from '@/lib/local-store';
import ScrollReveal from '@/components/ScrollReveal';

export default function IntroPage() {
  const [text, setText] = useState('');
  const [vision, setVision] = useState('');
  useEffect(() => {
    getSiteContent().then(c => {
      setText(c.aboutIntro);
      setVision(c.aboutVision);
    });
  }, []);

  return (
    <div>
      <ScrollReveal animation="fade-up">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8">총동아리연합회란</h2>
        <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap mb-8">{text}</div>
      </ScrollReveal>
      <ScrollReveal animation="fade-up" delay={150}>
        <div className="bg-blue-50 border-l-4 border-[#003087] p-6 rounded-r-lg">
          <h3 className="font-bold text-[#003087] mb-2 text-lg">총동아리연합회 비전</h3>
          <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">{vision}</p>
        </div>
      </ScrollReveal>
    </div>
  );
}
