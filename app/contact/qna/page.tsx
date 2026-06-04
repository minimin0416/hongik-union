'use client';
import { useEffect, useState } from 'react';
import { getInquiries, type Inquiry } from '@/lib/local-store';

export default function QnaPage() {
  const [list, setList] = useState<Inquiry[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    getInquiries().then(all => setList(all.filter(i => i.isPublic && i.status === 'confirmed')));
  }, []);

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Q&A 게시판</h2>
      <p className="text-gray-500 text-sm mb-6">답변이 완료된 문의 내용을 공개합니다.</p>
      {list.length === 0 && (
        <p className="text-center text-gray-400 py-12 text-sm">등록된 Q&A가 없습니다.</p>
      )}
      <div className="space-y-3">
        {list.map((inq, i) => (
          <div key={inq.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => setOpen(open === inq.id ? null : inq.id)}
              className="w-full flex items-start justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5">Q</span>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{inq.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{inq.category} · {inq.createdAt}</p>
                </div>
              </div>
              <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-2 mt-0.5 transition-transform ${open === inq.id ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open === inq.id && inq.answer && (
              <div className="px-5 pb-4 flex gap-3 border-t border-gray-100 pt-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5">A</span>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{inq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
