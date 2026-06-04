'use client';
import { useEffect, useState } from 'react';
import { getSiteContent, type ElectionValue } from '@/lib/local-store';

export default function ElectionIntroPage() {
  const [text, setText] = useState('');
  const [values, setValues] = useState<ElectionValue[]>([]);
  useEffect(() => {
    getSiteContent().then(c => {
      setText(c.electionIntro);
      setValues(c.electionValues ?? []);
    });
  }, []);

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">동아리선거관리위원회 소개</h2>
      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-6">{text}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {values.map((v, i) => (
          <div key={i} className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <h3 className="font-bold text-[#003087] mb-2">{v.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
