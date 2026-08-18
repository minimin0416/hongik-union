'use client';
import { useEffect, useState } from 'react';
import { getOrgImage } from '@/lib/local-store';

export default function OrgPage() {
  const [orgImage, setOrgImage] = useState('');
  useEffect(() => { getOrgImage().then(setOrgImage); }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">조직도</h2>
      {orgImage ? (
        <div className="flex justify-center">
          <img src={orgImage} alt="조직도" className="max-w-full rounded-xl border border-gray-200 shadow-sm" />
        </div>
      ) : (
        <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
          조직도 이미지가 없습니다
        </div>
      )}
    </div>
  );
}
