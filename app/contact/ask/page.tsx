'use client';

import { useEffect, useState } from 'react';
import { getSiteContent } from '@/lib/local-store';

export default function AskPage() {
  const [kakaoUrl, setKakaoUrl] = useState('');

  useEffect(() => {
    getSiteContent().then(c => setKakaoUrl(c.kakaoUrl || ''));
  }, []);

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">질문 있어요</h2>
      <p className="text-gray-500 text-sm mb-8">카카오톡 플러스친구로 문의해주세요. 빠르게 답변드리겠습니다.</p>
      <a
        href={kakaoUrl || '#'}
        target={kakaoUrl ? '_blank' : undefined}
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-semibold text-base transition-all"
        style={{ backgroundColor: '#FEE500', color: '#3A1D1D' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0D800')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FEE500')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#3A1D1D">
          <path d="M12 3C6.48 3 2 6.69 2 11.25c0 2.9 1.87 5.45 4.68 6.96L5.5 21l3.9-2.04C10.23 19.31 11.1 19.5 12 19.5c5.52 0 10-3.69 10-8.25S17.52 3 12 3z"/>
        </svg>
        카카오톡 플러스친구로 문의하기
      </a>
      <p className="text-xs text-gray-400 text-center mt-4">클릭 시 카카오톡 채팅으로 연결됩니다</p>
    </div>
  );
}
