'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProvisionalClubs, getProvisionalClubImages, type ClubData } from '@/lib/local-store';

function snsInfo(url: string): { label: string; icon: string; color: string } {
  if (url.includes('instagram')) return { label: '인스타그램', icon: '📷', color: 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200' };
  if (url.includes('youtube')) return { label: '유튜브', icon: '▶️', color: 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' };
  if (url.includes('naver') || url.includes('cafe')) return { label: '네이버 카페', icon: '🔗', color: 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200' };
  if (url.includes('tistory')) return { label: '블로그', icon: '✏️', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200' };
  return { label: '웹사이트', icon: '🌐', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200' };
}

function SnsLink({ url }: { url: string }) {
  const { label, icon, color } = snsInfo(url);
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${color}`}>
      <span>{icon}</span>{label}
    </a>
  );
}

function SnsButton({ url }: { url: string }) {
  const { label, icon, color } = snsInfo(url);
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${color}`}>
      <span>{icon}</span>{label} 바로가기
    </a>
  );
}

export default function ProvisionalClubDetailPage() {
  const params = useParams();
  const [club, setClub] = useState<ClubData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getProvisionalClubs().then(async (clubs) => {
      const found = clubs.find((c) => c.id === Number(params.id));
      if (!found) { setNotFound(true); return; }
      const id = found.id;
      const imgs = await getProvisionalClubImages(id);
      setClub({ ...found, imageUrls: imgs.length ? imgs : (found.imageUrls ?? []) });
    });
  }, [params.id]);

  if (notFound) return (
    <div className="text-center py-20 text-gray-400">
      <p className="text-lg mb-2">동아리를 찾을 수 없습니다</p>
      <Link href="/clubs/provisional" className="text-sm text-blue-500 hover:underline">목록으로 돌아가기</Link>
    </div>
  );
  if (!club) return <div className="text-center py-20 text-gray-400 text-sm">로딩 중...</div>;

  const infoRows = [
    { label: '회장', value: club.president },
    { label: '동아리방', value: club.room },
    { label: '모집 기간', value: club.recruitPeriod },
    { label: '정기모임', value: club.meetingSchedule },
  ].filter((r) => r.value);

  const snsUrls = club.websites?.length ? club.websites : club.website ? [club.website] : [];

  return (
    <div>
      <Link href="/clubs/provisional" className="inline-flex items-center gap-1.5 text-base text-gray-500 hover:text-gray-800 mb-8 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        가동아리 목록으로
      </Link>

      {/* 기본 정보 + 소개글 (1열) */}
      <div className="flex flex-col gap-6 mb-6">
        {/* 기본 정보 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
          <div className="px-7 pt-7 pb-5 border-b border-gray-100 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <span className="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">{club.category}</span>
              <h1 className="text-3xl font-bold text-gray-900 mt-3">{club.name}</h1>
              {club.desc && <p className="text-gray-500 text-base mt-2 leading-relaxed">{club.desc}</p>}
            </div>
            {club.logoUrl && !club.logoUrl.startsWith('__stored_') && (
              <img src={club.logoUrl} alt={`${club.name} 로고`} className="w-24 h-24 rounded-xl object-contain border border-gray-100 flex-shrink-0" />
            )}
          </div>
          <div className="divide-y divide-gray-100 flex-1">
            {infoRows.map((r) => (
              <div key={r.label} className="flex items-start px-7 py-4">
                <span className="w-28 text-base text-gray-500 font-medium flex-shrink-0 pt-0.5">{r.label}</span>
                <span className="text-base text-gray-800 whitespace-pre-line leading-relaxed">{r.value}</span>
              </div>
            ))}
            {snsUrls.length > 0 && (
              <div className="flex items-start px-7 py-4">
                <span className="w-28 text-base text-gray-500 font-medium flex-shrink-0 pt-0.5">SNS</span>
                <div className="flex flex-wrap gap-2">
                  {snsUrls.map((url, i) => <SnsLink key={i} url={url} />)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 우리 동아리를 소개할게요 */}
        {club.intro && (
          <div className="bg-white rounded-xl border border-gray-200 p-7 flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-amber-500 rounded-full inline-block"></span>
              우리 동아리를 소개할게요
            </h2>
            <p className="text-gray-600 leading-relaxed text-base whitespace-pre-line flex-1">{club.intro}</p>
          </div>
        )}
      </div>

      {/* 활동 사진 — 있을 때만, 풀 와이드 크게 */}
      {(() => {
        const imgs = club.imageUrls?.length ? club.imageUrls : club.imageUrl ? [club.imageUrl] : [];
        if (!imgs.length) return null;
        return (
          <div className={`mb-6 ${imgs.length === 1 ? '' : imgs.length === 2 ? 'grid grid-cols-2 gap-3' : imgs.length === 3 ? 'grid grid-cols-3 gap-3' : 'grid grid-cols-2 gap-3'}`}>
            {imgs.map((src, i) => (
              <img key={i} src={src} alt={`${club.name} 활동사진 ${i + 1}`}
                className="w-full rounded-xl object-cover"
                style={{ maxHeight: imgs.length === 1 ? '480px' : '320px' }} />
            ))}
          </div>
        );
      })()}

      {/* 활동 내용 + 환영 대상 (2열) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {club.activities?.filter(Boolean).length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-7">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-amber-500 rounded-full inline-block"></span>
              활동 내용
            </h2>
            <ul className="space-y-2.5">
              {club.activities.filter(Boolean).map((a, i) => (
                <li key={i} className="flex items-start gap-3 text-base text-gray-600">
                  <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 text-sm flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">{i + 1}</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {club.targets?.filter(Boolean).length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-7">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-amber-500 rounded-full inline-block"></span>
              이런 분을 환영해요
            </h2>
            <ul className="space-y-2.5">
              {club.targets.filter(Boolean).map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-base text-gray-600">
                  <span className="text-amber-500 flex-shrink-0 mt-0.5 text-lg">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* SNS */}
      {snsUrls.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
          <p className="text-base font-medium text-gray-700 mb-3">더 알아보기</p>
          <div className="flex flex-wrap gap-2">
            {snsUrls.map((url, i) => <SnsButton key={i} url={url} />)}
          </div>
        </div>
      )}
    </div>
  );
}
