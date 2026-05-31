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
    { label: '연락처', value: club.contact },
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
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">{club.category}</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">{club.name}</h1>
          {club.desc && <p className="text-gray-500 text-sm mt-1">{club.desc}</p>}
        </div>
        <div className="divide-y divide-gray-100">
          {infoRows.map((r) => (
            <div key={r.label} className="flex items-center px-6 py-3.5">
              <span className="w-24 text-sm text-gray-500 font-medium flex-shrink-0">{r.label}</span>
              <span className="text-sm text-gray-800">{r.value}</span>
            </div>
          ))}
          {club.instagram && (
            <div className="flex items-center px-6 py-3.5">
              <span className="w-24 text-sm text-gray-500 font-medium flex-shrink-0">인스타그램</span>
              <a href={`https://instagram.com/${club.instagram.replace('@', '')}`}
                target="_blank" rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline">{club.instagram}</a>
            </div>
          )}
        </div>
      </div>

      {/* 소개 이미지 */}
      {club.imageUrl ? (
        <img src={club.imageUrl} alt={`${club.name} 소개`} className="w-full rounded-xl object-cover mb-6" style={{ maxHeight: '280px' }} />
      ) : (
        <div className="bg-gray-200 rounded-xl flex items-center justify-center mb-6 text-gray-400" style={{ height: '200px' }}>
          <div className="text-center">
            <svg className="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">소개 이미지 없음</p>
            <p className="text-xs mt-0.5">관리자 페이지에서 업로드</p>
          </div>
        </div>
      )}

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

      {/* 인스타 문의 */}
      {club.instagram && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">더 궁금한 점이 있으신가요?</p>
            <p className="text-xs text-gray-500 mt-0.5">인스타그램 DM으로 문의해주세요</p>
          </div>
          <a href={`https://instagram.com/${club.instagram.replace('@', '')}`}
            target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg font-medium hover:bg-gray-700 transition-colors">
            인스타 바로가기
          </a>
        </div>
      )}
    </div>
  );
}
