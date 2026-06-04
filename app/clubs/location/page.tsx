'use client';
import { useEffect, useState } from 'react';
import { getSiteContent, getClubMapImage, type ClubBuilding } from '@/lib/local-store';

export default function ClubLocationPage() {
  const [buildings, setBuildings] = useState<ClubBuilding[]>([]);
  const [mapImage, setMapImage] = useState('');

  useEffect(() => {
    getSiteContent().then(c => setBuildings(c.clubBuildings ?? []));
    getClubMapImage().then(setMapImage);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">동아리방 위치</h2>
      <div className="rounded-xl overflow-hidden mb-8" style={{ minHeight: '250px' }}>
        {mapImage ? (
          <img src={mapImage} alt="캠퍼스 지도" className="w-full object-cover rounded-xl" />
        ) : (
          <div className="bg-gray-100 flex items-center justify-center rounded-xl" style={{ height: '250px' }}>
            <div className="text-center text-gray-400">
              <svg className="w-10 h-10 text-[#003087] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-[#003087] font-semibold text-sm">캠퍼스 지도 이미지 영역</p>
              <p className="text-gray-400 text-xs mt-1">관리자 페이지 → 동아리 소개 → 동아리방 위치에서 업로드</p>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buildings.map((b, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-[#003087] mb-3 text-lg">{b.building}</h3>
            <ul className="space-y-1.5">
              {b.clubs.map((club, j) => (
                <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#003087] flex-shrink-0"></span>
                  {club}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
