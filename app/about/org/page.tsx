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
        <div className="flex flex-col items-center gap-4">
          <div className="bg-[#003087] text-white px-8 py-3 rounded-xl font-bold text-center min-w-40">총회</div>
          <div className="w-0.5 h-6 bg-gray-300"></div>
          <div className="bg-[#0052A5] text-white px-8 py-3 rounded-xl font-semibold text-center min-w-40">총동아리연합회장</div>
          <div className="w-0.5 h-6 bg-gray-300"></div>
          <div className="flex gap-6 flex-wrap justify-center">
            {['부회장', '총무'].map((role) => (
              <div key={role}>
                <div className="w-0.5 h-4 bg-gray-300 mx-auto"></div>
                <div className="bg-blue-100 border border-blue-300 text-[#003087] px-6 py-2.5 rounded-lg font-medium text-center text-sm min-w-32">{role}</div>
              </div>
            ))}
          </div>
          <div className="w-0.5 h-6 bg-gray-300"></div>
          <p className="text-sm text-gray-500 mb-2">각 분과 대표</p>
          <div className="flex gap-3 flex-wrap justify-center">
            {['공연분과','스포츠분과','레저분과','종교분과','사회분과','학술분과','전시분과'].map((cat) => (
              <div key={cat} className="bg-gray-100 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm text-center">{cat}</div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm mt-4">※ 관리자 페이지 → 총동아리연합회 → 조직도에서 이미지 업로드 가능</p>
        </div>
      )}
    </div>
  );
}
