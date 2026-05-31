'use client';
import { useState, useEffect } from 'react';
import { getSiteContent, type FaqItem } from '@/lib/local-store';
import ScrollReveal from '@/components/ScrollReveal';

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => { setFaqs(getSiteContent().faqs); }, []);

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">자주 묻는 질문</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <ScrollReveal key={i} animation="fade-up" delay={i * 70}>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
              <span className="font-medium text-gray-800 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center flex-shrink-0 font-bold">Q</span>
                {faq.q}
              </span>
              <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-2 transition-transform ${open === i ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open === i && (
              <div className="px-5 pb-4 flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5">A</span>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
          </ScrollReveal>
        ))}
        {faqs.length === 0 && <p className="text-gray-400 text-sm text-center py-8">FAQ가 없습니다. 관리자 페이지에서 추가해주세요.</p>}
      </div>
    </div>
  );
}
