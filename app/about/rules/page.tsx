'use client';
import { useEffect, useState } from 'react';
import { getSiteContent, type Attachment } from '@/lib/local-store';

export default function RulesPage() {
  const [file, setFile] = useState<Attachment | null>(null);

  useEffect(() => {
    getSiteContent().then(c => setFile(c.rulesFile ?? null));
  }, []);

  const download = () => {
    if (!file) return;
    const a = document.createElement('a');
    a.href = file.url;
    a.download = file.name;
    a.click();
  };

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">회칙</h2>
      <div className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center gap-4 min-h-48">
        {file ? (
          <>
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium text-sm">{file.name}</p>
            <button onClick={download}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              다운로드
            </button>
          </>
        ) : (
          <p className="text-gray-400 text-sm">등록된 회칙 파일이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
