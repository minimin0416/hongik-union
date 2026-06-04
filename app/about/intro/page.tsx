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
    <div className="max-w-3xl">
      <ScrollReveal animation="fade-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">총동아리연합회란</h2>
        <div className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-6">{text}</div>
      </ScrollReveal>
      <ScrollReveal animation="fade-up" delay={150}>
        <div className="bg-blue-50 border-l-4 border-[#003087] p-5 rounded-r-lg">
          <h3 className="font-semibold text-[#003087] mb-2">총동아리연합회 비전</h3>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{vision}</p>
        </div>
      </ScrollReveal>
    </div>
  );
}
