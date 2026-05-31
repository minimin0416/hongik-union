'use client';
import { useEffect, useState } from 'react';
import { getSiteContent } from '@/lib/local-store';

export default function LocationPage() {
  const [c, setC] = useState({ locationAddress: '', locationHours: '', locationPhone: '', locationEmail: '' });
  useEffect(() => {
    const s = getSiteContent();
    setC({ locationAddress: s.locationAddress, locationHours: s.locationHours, locationPhone: s.locationPhone, locationEmail: s.locationEmail });
  }, []);

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">오시는 길</h2>
      <div className="bg-gray-100 rounded-xl overflow-hidden mb-6 flex items-center justify-center" style={{ height: '280px' }}>
        <div className="text-center text-gray-400">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <p className="text-sm">지도 이미지</p>
          <p className="text-xs mt-1">관리자 페이지 → 이미지 관리에서 업로드</p>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">위치 정보</h3>
        <ul className="space-y-3">
          {[
            { icon: '📍', label: '주소', value: c.locationAddress },
            { icon: '🕐', label: '운영시간', value: c.locationHours },
            { icon: '📞', label: '연락처', value: c.locationPhone },
            { icon: '✉️', label: '이메일', value: c.locationEmail },
          ].map((item) => (
            <li key={item.label} className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div>
                <span className="text-xs text-gray-500 block">{item.label}</span>
                <span className="text-gray-800 font-medium">{item.value}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
