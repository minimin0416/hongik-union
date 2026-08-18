'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getNotices, getSiteContent, getBanners, getCalendarEvents, getLocationImage, getMinutes, getClubMapImage, getHeroLogo, defaultContent, type Notice, type BannerSlide, type CalendarEvent, type Minutes, type ClubBuilding } from '@/lib/local-store';
import { getHoliday } from '@/lib/holidays';
import ScrollReveal from '@/components/ScrollReveal';

/* ─── 로딩 화면 ─── */
function LoaderScreen({ exiting, logoUrl }: { exiting: boolean; logoUrl?: string }) {
  const letters = ['U','N','I','O','N'];
  return (
    <div className={`loader-screen${exiting ? ' loader-exiting' : ''}`}>
      {/* 배경 오브 */}
      <div className="loader-orb loader-orb-1" />
      <div className="loader-orb loader-orb-2" />
      <div className="loader-orb loader-orb-3" />

      {/* 펄스 링 */}
      <div style={{ position:'absolute', top:'50%', left:'50%' }}>
        <div className="loader-ring" />
        <div className="loader-ring" />
      </div>

      {/* 중앙 콘텐츠 */}
      <div className="loader-center">
        {/* 학생회 로고 or UNION 텍스트 */}
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="총동아리연합회 로고"
            style={{
              maxHeight: '120px',
              maxWidth: '260px',
              objectFit: 'contain',
              filter: 'brightness(0) invert(1)',
              animation: 'loader-logo-in 0.6s cubic-bezier(0.22,1,0.36,1) both',
              marginBottom: '8px',
            }}
          />
        ) : (
          <div className="loader-union" style={{ perspective:'700px' }}>
            {letters.map((l, i) => (
              <span key={l} className="loader-letter" style={{ animationDelay:`${0.08 * i}s` }}>{l}</span>
            ))}
          </div>
        )}

        {/* 서브타이틀 */}
        <div className="loader-name">홍익대학교 총동아리연합회</div>

        {/* 구분선 */}
        <div className="loader-divider" />

        {/* 프로그레스 바 */}
        <div className="loader-bar-wrap">
          <div className="loader-bar-inner" />
        </div>

        {/* 도트 */}
        <div className="loader-dots">
          <div className="loader-dot" />
          <div className="loader-dot" />
          <div className="loader-dot" />
        </div>
      </div>
    </div>
  );
}

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function getEventsForDay(events: CalendarEvent[], date: string) {
  return events.filter(e => e.startDate <= date && e.endDate >= date);
}

// localStorage 동기 읽기 헬퍼 (SSR + 프라이버시 차단 안전)
function syncGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) as T : fallback;
  } catch { return fallback; }
}
function syncGetStr(key: string): string {
  if (typeof window === 'undefined') return '';
  try { return localStorage.getItem(key) || ''; } catch { return ''; }
}
function syncHasCache(...keys: string[]): boolean {
  if (typeof window === 'undefined') return false;
  try { return keys.some(k => !!localStorage.getItem(k)); } catch { return false; }
}

function SimpleCalendar({ events }: { events: CalendarEvent[] }) {
  const today = new Date();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 transition-colors text-gray-500 text-sm">‹</button>
        <span className="text-sm font-semibold text-gray-700">{year}년 {month + 1}월</span>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 transition-colors text-gray-500 text-sm">›</button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d, i) => (
          <div key={d} className={`text-center text-xs font-medium py-1 ${i===0?'text-red-500':i===6?'text-blue-500':'text-gray-500'}`}>{d}</div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 border-b border-gray-100 last:border-0">
          {week.map((day, di) => {
            if (!day) return <div key={di} className="min-h-14 border-r border-gray-100 last:border-0 bg-gray-50/30" />;
            const dateStr = toDateStr(year, month, day);
            const holiday = getHoliday(dateStr);
            const isToday = dateStr === todayStr;
            const dayEvents = getEventsForDay(events, dateStr);
            const isSun = di === 0;
            const isSat = di === 6;
            const isRed = isSun || !!holiday;
            return (
              <div key={di} className="min-h-14 border-r border-gray-100 last:border-0 p-1">
                <span className={`inline-flex w-5 h-5 items-center justify-center rounded-full text-xs font-semibold
                  ${isToday ? 'bg-gray-800 text-white' : isRed ? 'text-red-500' : isSat ? 'text-blue-500' : 'text-gray-700'}`}>
                  {day}
                </span>
                {holiday && <div className="text-red-500 text-[9px] leading-tight font-medium truncate">{holiday}</div>}
                <div className="space-y-0.5 mt-0.5">
                  {dayEvents.map((ev) => {
                    const isStart = ev.startDate === dateStr;
                    const isEnd = ev.endDate === dateStr;
                    const isSingle = isStart && isEnd;
                    return (
                      <div key={ev.id} style={{ backgroundColor: ev.color || '#3B82F6' }}
                        className={`text-white text-[9px] leading-3.5 px-1 py-0.5 overflow-hidden
                          ${isSingle ? 'rounded' : isStart ? 'rounded-l' : isEnd ? 'rounded-r' : ''}`}>
                        {isStart && <span className="truncate block">{ev.title}</span>}
                        {!isStart && <span className="invisible text-[9px]">.</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // localStorage에서 즉시 동기 읽기 → 캐시 있으면 첫 렌더부터 데이터 표시 (플리커 없음)
  const [notices, setNotices] = useState<Notice[]>(() => syncGet('hn_notices', []));
  const [slides, setSlides] = useState<BannerSlide[]>(() => {
    const c = syncGet<Partial<typeof defaultContent>>('hn_content', {});
    return c.bannerSlides || defaultContent.bannerSlides;
  });
  const [bannerImgs, setBannerImgs] = useState<string[]>(() => syncGet('hn_banners', []));
  const [locationImg, setLocationImg] = useState(() => syncGetStr('hn_location_image'));
  const [calEvents, setCalEvents] = useState<CalendarEvent[]>(() => syncGet('hn_calendar_events', []));
  const [mainIntroEnabled, setMainIntroEnabled] = useState(() => {
    const c = syncGet<Partial<typeof defaultContent>>('hn_content', {});
    return c.mainIntroEnabled ?? false;
  });
  const [mainIntroText, setMainIntroText] = useState(() => {
    const c = syncGet<Partial<typeof defaultContent>>('hn_content', {});
    return c.mainIntroText ?? '';
  });
  const [minutes, setMinutes] = useState<Minutes[]>(() => syncGet('hn_minutes', []));
  const [clubBuildings, setClubBuildings] = useState<ClubBuilding[]>(() => {
    const c = syncGet<Partial<typeof defaultContent>>('hn_content', {});
    return c.clubBuildings ?? [];
  });
  const [clubMapImage, setClubMapImage] = useState(() => syncGetStr('hn_club_map_image'));
  const [heroLogoUrl, setHeroLogoUrl] = useState(() => syncGetStr('hn_hero_logo'));

  // 로더 상태
  const startTimeRef = useRef(Date.now());
  const hasCache = syncHasCache('hn_banners', 'hn_content');
  const [ready, setReady] = useState(() => hasCache);
  const [showLoader, setShowLoader] = useState(() => !hasCache);
  const [loaderExiting, setLoaderExiting] = useState(false);

  useEffect(() => {
    Promise.all([
      getNotices().then(setNotices),
      getSiteContent().then(c => {
        setSlides(c.bannerSlides);
        setMainIntroEnabled(c.mainIntroEnabled ?? false);
        setMainIntroText(c.mainIntroText ?? '');
        setClubBuildings(c.clubBuildings ?? []);
      }),
      getBanners().then(setBannerImgs),
      getLocationImage().then(setLocationImg),
      getCalendarEvents().then(setCalEvents),
      getMinutes().then(setMinutes),
      getClubMapImage().then(setClubMapImage),
      getHeroLogo().then(v => { if (v) setHeroLogoUrl(v); }),
    ]).then(() => {
      setReady(true);
      if (!hasCache) {
        // 최소 2.2초 표시 후 슬라이드업 퇴장
        const elapsed = Date.now() - startTimeRef.current;
        const wait = Math.max(0, 2200 - elapsed);
        setTimeout(() => {
          setLoaderExiting(true);
          setTimeout(() => setShowLoader(false), 780);
        }, wait);
      }
    });

    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % 3), 5000);
    return () => clearInterval(timer);
  }, []);

  const slideCount = slides.length || 3;
  const currentBg = bannerImgs[currentSlide] || '';
  const currentSlideData = slides[currentSlide];

  // 처음 방문 (캐시 없음) → 로딩 화면만 표시
  if (!ready) {
    return <LoaderScreen exiting={false} logoUrl={heroLogoUrl || undefined} />;
  }

  return (
    <>
      {/* 로딩 화면 퇴장 오버레이 */}
      {showLoader && <LoaderScreen exiting={loaderExiting} logoUrl={heroLogoUrl || undefined} />}

      <div style={{ background: '#EDE8F5', minHeight: '100vh', animation: 'sr-fade-in 0.5s ease both' }}>

        {/* ── Hero 배너 슬라이더 (크게) ── */}
        <div className="relative w-full overflow-hidden" style={{ height: 'clamp(520px, 72vh, 860px)' }}>

          {/* 배경 이미지 — key로 슬라이드 전환 시 재애니메이션 */}
          {currentBg
            ? <img key={`bg-${currentSlide}`} src={currentBg} alt="배너"
                className="absolute inset-0 w-full h-full object-cover hero-img-bg" />
            : <div className="absolute inset-0 bg-gradient-to-br from-[#2D1B6E] via-[#5B3FA8] to-[#8B6BC9]" />
          }

          {/* 오버레이 없음 — 원본 이미지 그대로 */}

          {/* 히어로 중앙 — 로고 + 텍스트 함께 */}
          <div key={`text-${currentSlide}`}
            className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6 gap-4 pointer-events-none">
            {heroLogoUrl && (
              <img
                src={heroLogoUrl}
                alt="로고"
                className="hero-badge"
                style={{
                  maxHeight: 'clamp(60px, 14vw, 160px)',
                  maxWidth: 'clamp(160px, 42vw, 500px)',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.3))',
                }}
              />
            )}
            {currentSlideData && currentSlideData.title && (
              <h1 className="hero-title font-black leading-tight w-full text-center px-4"
                style={{ fontSize: 'clamp(1.25rem, 4.5vw, 3.75rem)', color: '#111827', textShadow: '0 1px 8px rgba(255,255,255,0.4)' }}>
                {currentSlideData.title}
              </h1>
            )}
            {currentSlideData && currentSlideData.subtitle && (
              <p className="hero-sub text-base md:text-xl max-w-2xl"
                style={{ color: '#374151', textShadow: '0 1px 6px rgba(255,255,255,0.4)' }}>
                {currentSlideData.subtitle}
              </p>
            )}
          </div>

          {/* 이전/다음 버튼 — 모던 원형 */}
          <button onClick={() => setCurrentSlide((p) => (p - 1 + slideCount) % slideCount)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/15 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all rounded-full border border-white/25 hover:scale-110 active:scale-95">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button onClick={() => setCurrentSlide((p) => (p + 1) % slideCount)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/15 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all rounded-full border border-white/25 hover:scale-110 active:scale-95">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          {/* 슬라이드 인디케이터 — 필 스타일 */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 items-center">
            {Array.from({ length: slideCount }).map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? 'w-7 h-2.5 bg-white hero-active-dot'
                    : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                }`} />
            ))}
          </div>

          {/* 스크롤 힌트 */}
          <div className="absolute bottom-5 left-1/2"
            style={{ animation: 'hero-scroll-bounce 1.8s 1.5s ease infinite', transform: 'translateX(-50%)', opacity: 0, animationFillMode: 'forwards', animationDelay: '1.5s' }}>
          </div>
        </div>

        {/* ── 메인 소개글 ── */}
        {mainIntroEnabled && mainIntroText && (
          <ScrollReveal animation="fade-up" delay={0}>
            <div className="w-full bg-white border-b border-gray-200 px-8 lg:px-14 py-10">
              <div className="max-w-3xl">
                <div className="w-10 h-1 bg-[#7C5CBF] rounded mb-4" />
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{mainIntroText}</p>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* ── 달력 + 공지사항 ── */}
        <div className="w-full px-8 lg:px-14 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <ScrollReveal animation="fade-right" delay={0} className="flex flex-col">
            <h2 className="text-base font-bold text-gray-700 mb-3">달력</h2>
            <div className="bg-white rounded-lg p-5 shadow-sm flex-1">
              <SimpleCalendar events={calEvents} />
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-left" delay={100} className="flex flex-col">
            <h2 className="text-base font-bold text-gray-700 mb-3">공지사항</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden flex-1 flex flex-col">
              {notices.length > 0 ? notices.map((n, idx) => (
                <Link key={n.id} href="/news/notices"
                  className={`flex items-center gap-3 px-5 py-3.5 text-base hover:bg-purple-50 hover:translate-x-0.5 transition-all ${idx < notices.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  {n.isPinned && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold flex-shrink-0">고정</span>}
                  <span className="flex-1 text-gray-700 truncate">{n.title}</span>
                  <span className="text-sm text-gray-400 flex-shrink-0">{n.createdAt}</span>
                </Link>
              )) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">등록된 공지사항이 없습니다</div>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* ── 동아리방 위치 + 회의록 ── */}
        <div className="w-full px-8 lg:px-14 pb-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* 동아리방 위치 — 이미지 */}
          <ScrollReveal animation="fade-right" delay={0} className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-700">동아리방 위치</h2>
              <Link href="/clubs/location" className="text-sm text-[#7C5CBF] hover:underline">자세히 보기 →</Link>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden flex-1" style={{ minHeight: '200px' }}>
              {clubMapImage
                ? <img src={clubMapImage} alt="동아리방 위치" className="w-full h-full object-contain" />
                : <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    <div className="text-center">
                      <p>지도 이미지를 업로드해주세요</p>
                      <Link href="/clubs/location" className="text-[#7C5CBF] text-xs hover:underline mt-1 block">동아리방 위치 자세히 보기 →</Link>
                    </div>
                  </div>
              }
            </div>
          </ScrollReveal>

          {/* 회의록 */}
          <ScrollReveal animation="fade-left" delay={100} className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-700">회의록</h2>
              <Link href="/news/minutes" className="text-sm text-[#7C5CBF] hover:underline">전체 보기 →</Link>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden flex-1 flex flex-col">
              {minutes.length > 0 ? minutes.slice(0, 5).map((m, idx) => (
                <Link key={m.id} href="/news/minutes"
                  className={`flex items-center gap-3 px-5 py-3.5 text-base hover:bg-purple-50 hover:translate-x-0.5 transition-all ${idx < Math.min(minutes.length, 5) - 1 ? 'border-b border-gray-100' : ''}`}>
                  <svg className="w-4 h-4 text-[#9B7DD4] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="flex-1 text-gray-700 truncate">{m.title}</span>
                  <span className="text-sm text-gray-400 flex-shrink-0">{m.date}</span>
                </Link>
              )) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">등록된 회의록이 없습니다</div>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* ── 오시는 길 ── */}
        <ScrollReveal animation="fade-up" delay={0} className="w-full px-8 lg:px-14 pb-10">
          <h2 className="text-base font-bold text-gray-700 mb-3">총동아리연합회실(G301-1) 오시는 길</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ height: '240px' }}>
            {locationImg
              ? <img src={locationImg} alt="오시는 길" className="w-full h-full object-contain" />
              : <div className="w-full h-full flex items-center justify-center text-gray-400 text-base">
                  <div className="text-center">
                    <p>지도 이미지를 업로드해주세요</p>
                    <Link href="/about/location" className="text-[#7C5CBF] text-sm hover:underline mt-1 block">오시는 길 자세히 보기 →</Link>
                  </div>
                </div>
            }
          </div>
          <Link href="/about/location" className="text-sm text-gray-400 hover:text-gray-600 mt-2 block text-right">오시는 길 자세히 보기 →</Link>
        </ScrollReveal>

        {/* ── 빠른 링크 카드 3개 (맨 아래) ── */}
        <div className="w-full px-8 lg:px-14 pb-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              href: '/about/intro',
              title: '총동아리연합회 소개',
              desc: '홍익대학교 총동아리연합회를 소개합니다.',
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C5CBF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                  <rect x="9" y="3" width="6" height="4" rx="1"/>
                  <line x1="9" y1="12" x2="15" y2="12"/>
                  <line x1="9" y1="16" x2="13" y2="16"/>
                </svg>
              ),
              delay: 0,
            },
            {
              href: '/contact/faq',
              title: 'FAQ',
              desc: '동아리 관련 질문을 답변드립니다.',
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C5CBF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  <line x1="9" y1="10" x2="15" y2="10"/>
                  <line x1="9" y1="14" x2="13" y2="14"/>
                </svg>
              ),
              delay: 80,
            },
            {
              href: '/info/activity-cert',
              title: '활동증명서 신청',
              desc: '활동증명서 발급을 도와드립니다.',
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C5CBF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
              ),
              delay: 160,
            },
          ].map(({ href, title, desc, icon, delay }) => (
            <ScrollReveal key={href} animation="fade-up" delay={delay}>
              <Link href={href}
                className="flex items-center justify-between gap-4 bg-white rounded-2xl px-7 py-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <div>
                  <p className="text-lg font-bold text-gray-900 group-hover:text-[#7C5CBF] transition-colors">{title}</p>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{desc}</p>
                </div>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F4F0FB' }}>
                  {icon}
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </>
  );
}
