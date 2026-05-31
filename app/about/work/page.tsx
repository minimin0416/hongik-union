'use client';
import { useEffect, useState } from 'react';
import { getSiteContent, type WorkItem } from '@/lib/local-store';
import ScrollReveal from '@/components/ScrollReveal';

export default function WorkPage() {
  const [items, setItems] = useState<WorkItem[]>([]);
  useEffect(() => { setItems(getSiteContent().workItems); }, []);

  return (
    <div>
      <ScrollReveal animation="fade-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">주요업무</h2>
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((w, i) => (
          <ScrollReveal key={i} animation="fade-up" delay={i * 80}>
            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-400 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-gray-800 text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{w.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{w.desc}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
