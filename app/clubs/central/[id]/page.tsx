'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getClubs, type ClubData } from '@/lib/local-store';

export default function ClubDetailPage() {
  const params = useParams();
  const [club, setClub] = useState<ClubData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getClubs().then(clubs => {
    const found = clubs.find((c) => c.id === Number(params.id));
    if (found) setClub(found);
    else setNotFound(true);
    });
  }, [params.id]);

  if (notFound) return (
    <div className="text-center py-20 text-gray-400">
      <p className="text-lg mb-2">동아리를 찾을 수 없습니다</p>
      <Link href="/clubs/central" className="text-sm text-blue-500 hover:underline">목록으로 돌아가기</Link>
    </div>
  );
  if (!club) return <div className="text-center py-20 text-gray-400 text-sm">로딩 중...</div>;

  const infoRows = [
    { label: '회장', value: club.president },
    { label: '동아리방', value: club.room },
    { label: '모집 기간', value: club.recruitPeriod },
    { label: '정기모임', value: club.meetingSchedule },
  ].filter((r) => r.value);

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/clubs/central" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        동아리 목록으로
      </Link>

      {/* 기본 정보 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">{club.category}</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">{club.name}</h1>
            {club.desc && <p className="text-gray-500 text-sm mt-1">{club.desc}</p>}
          </div>
          {club.logoUrl && (
            <img src={club.logoUrl} alt={`${club.name} 로고`} className="w-20 h-20 rounded-xl object-contain border border-gray-100 flex-shrink-0" />
          )}
        </div>
        <div className="divide-y divide-gray-100">
          {infoRows.map((r) => (
            <div key={r.label} className="flex items-center px-6 py-3.5">
              <span className="w-24 text-sm text-gray-500 font-medium flex-shrink-0">{r.label}</span>
              <span className="text-sm text-gray-800">{r.value}</span>
            </div>
          ))}
          {club.website && (
            <div className="flex items-center px-6 py-3.5">
              <span className="w-24 text-sm text-gray-500 font-medium flex-shrink-0">홈페이지</span>
              <a href={club.website} target="_blank" rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline truncate">{club.website}</a>
            </div>
          )}
        </div>
      </div>

      {/* 활동 사진 */}
      {(() => {
        const imgs = club.imageUrls?.length ? club.imageUrls : club.imageUrl ? [club.imageUrl] : [];
        if (!imgs.length) return null;
        return (
          <div className={`mb-6 ${imgs.length > 1 ? 'grid grid-cols-2 gap-2' : ''}`}>
            {imgs.map((src, i) => (
              <img key={i} src={src} alt={`${club.name} 활동사진 ${i + 1}`}
                className="w-full rounded-xl object-cover"
                style={{ maxHeight: imgs.length === 1 ? '280px' : '200px' }} />
            ))}
          </div>
        );
      })()}

      {/* 동아리 소개 */}
      {club.intro && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-gray-800 rounded-full inline-block"></span>
            우리 동아리를 소개할게요
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm">{club.intro}</p>
        </div>
      )}

      {/* 활동 내용 */}
      {club.activities?.filter(Boolean).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-gray-800 rounded-full inline-block"></span>
            활동 내용
          </h2>
          <ul className="space-y-2">
            {club.activities.filter(Boolean).map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">{i + 1}</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 환영 대상 */}
      {club.targets?.filter(Boolean).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-gray-800 rounded-full inline-block"></span>
            이런 분을 환영해요
          </h2>
          <ul className="space-y-2">
            {club.targets.filter(Boolean).map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 홈페이지 바로가기 */}
      {club.website && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">더 궁금한 점이 있으신가요?</p>
            <p className="text-xs text-gray-500 mt-0.5">홈페이지에서 자세한 정보를 확인하세요</p>
          </div>
          <a href={club.website} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg font-medium hover:bg-gray-700 transition-colors">
            홈페이지 바로가기
          </a>
        </div>
      )}
    </div>
  );
}
