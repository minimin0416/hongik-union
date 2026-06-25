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

  const isPdf = file?.type === 'application/pdf' || file?.name.toLowerCase().endsWith('.pdf');

  const openInTab = () => {
    if (!file) return;
    const win = window.open();
    if (win) { win.document.write(`<iframe src="${file.url}" style="width:100%;height:100vh;border:none;"></iframe>`); }
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">회칙</h2>
      {file ? (
        <>
          {/* 데스크탑: iframe 미리보기 */}
          {isPdf && (
            <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden mb-3">
              <iframe src={file.url} className="w-full" style={{ height: '800px', border: 'none' }} />
            </div>
          )}
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-3.5 flex-wrap gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm text-gray-700 font-medium truncate">{file.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* 모바일: 새 탭에서 열기 */}
              {isPdf && (
                <button onClick={openInTab}
                  className="md:hidden flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  열기
                </button>
              )}
              <button onClick={download}
                className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                다운로드
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 flex items-center justify-center">
          <p className="text-gray-400 text-sm">등록된 회칙 파일이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
