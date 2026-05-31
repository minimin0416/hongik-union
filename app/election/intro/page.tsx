'use client';
import { useEffect, useState } from 'react';
import { getSiteContent } from '@/lib/local-store';

export default function ElectionIntroPage() {
  const [text, setText] = useState('');
  useEffect(() => { setText(getSiteContent().electionIntro); }, []);

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">동아리선거관리위원회 소개</h2>
      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-6">{text}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: '공정성', desc: '독립적으로 운영하여 선거의 공정성 보장' },
          { title: '투명성', desc: '모든 선거 과정을 공개하여 투명성 확보' },
          { title: '적법성', desc: '관련 규정에 따라 적법하게 선거 진행' },
        ].map((v) => (
          <div key={v.title} className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <h3 className="font-bold text-[#003087] mb-2">{v.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
