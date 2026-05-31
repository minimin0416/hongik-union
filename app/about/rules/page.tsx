'use client';
import { useEffect, useState } from 'react';
import { getSiteContent } from '@/lib/local-store';

export default function RulesPage() {
  const [text, setText] = useState('');
  useEffect(() => { setText(getSiteContent().rules); }, []);

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">회칙</h2>
      <div className="bg-white border border-gray-200 rounded-xl p-6 whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
        {text || '회칙 내용이 없습니다. 관리자 페이지에서 입력해주세요.'}
      </div>
    </div>
  );
}
