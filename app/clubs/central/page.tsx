'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getClubs, type ClubData } from '@/lib/local-store';
import ScrollReveal from '@/components/ScrollReveal';

const categories = ['전체', '공연분과', '스포츠분과', '레저분과', '종교분과', '사회분과', '학술분과', '전시분과'];

function ClubsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '전체';
  const [selected, setSelected] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const [clubs, setClubs] = useState<ClubData[]>([]);
  useEffect(() => { getClubs().then(setClubs); }, []);

  const filtered = clubs
    .filter(
      (c) => (selected === '전체' || c.category === selected) &&
        (search === '' || c.name.includes(search) || c.desc.includes(search))
    )
    .sort((a, b) => a.name.localeCompare(b.name, 'ko'));

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="동아리명 또는 설명 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-500 bg-white"
        />
      </div>

      {/* 분과 탭 */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              selected === cat
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500 hover:text-gray-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 동아리 리스트 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.map((club, idx) => (
          <ScrollReveal key={club.id} animation="fade-up" delay={Math.min(idx, 10) * 30}>
            <Link href={`/clubs/central/${club.id}`}>
              <div className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${idx !== 0 ? 'border-t border-gray-100' : ''}`}>
                {/* 로고 */}
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {club.logoUrl
                    ? <img src={club.logoUrl} alt={club.name} className="w-full h-full object-cover" />
                    : <span className="text-gray-500 font-bold text-xs">{club.name.slice(0, 2)}</span>
                  }
                </div>
                {/* 이름 + 분과 */}
                <div className="w-44 flex-shrink-0">
                  <div className="font-semibold text-gray-800 text-sm leading-tight">{club.name}</div>
                  <span className="text-xs text-gray-400 mt-0.5 inline-block">{club.category}</span>
                </div>
                {/* 설명 */}
                <p className="flex-1 text-sm text-gray-500 truncate hidden sm:block">{club.desc}</p>
                {/* 동아리방 */}
                {club.room && (
                  <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0 hidden md:flex">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {club.room}
                  </div>
                )}
                {/* 화살표 */}
                <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-1">검색 결과가 없습니다</p>
          <p className="text-sm">다른 검색어나 분과를 선택해보세요</p>
        </div>
      )}
    </div>
  );
}

export default function CentralPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">중앙동아리</h2>
      <Suspense fallback={<div className="text-gray-400 text-sm">로딩 중...</div>}>
        <ClubsContent />
      </Suspense>
    </div>
  );
}
