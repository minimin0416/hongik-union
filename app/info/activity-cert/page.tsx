'use client';

import { useEffect, useState } from 'react';
import { getActivityCertFile, downloadFile, type Attachment } from '@/lib/local-store';

export default function ActivityCertPage() {
  const [file, setFile] = useState<Attachment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivityCertFile().then(f => { setFile(f); setLoading(false); });
  }, []);

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">활동증명서</h2>
      <p className="text-gray-500 text-sm mb-8">
        아래 양식 파일을 다운로드 후 작성하여 총동아리연합회실(G301-1)에 제출하거나 카카오톡으로 전달해주세요.
      </p>

      {loading ? (
        <div className="h-24 flex items-center justify-center text-gray-400 text-sm">불러오는 중...</div>
      ) : file ? (
        <div className="border border-gray-200 rounded-xl p-5 bg-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
          </div>
          <button
            onClick={() => downloadFile(file.url, file.name)}
            className="btn-primary flex-shrink-0"
          >
            다운로드
          </button>
        </div>
      ) : (
        <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-400 text-sm">
          등록된 양식 파일이 없습니다.
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-600 space-y-1">
        <p className="font-semibold text-gray-700 mb-2">제출 방법</p>
        <p>• 파일 작성 후 총동아리연합회실 G301-1 직접 제출</p>
        <p>• 또는 카카오톡 플러스친구로 파일 전달</p>
      </div>
    </div>
  );
}
