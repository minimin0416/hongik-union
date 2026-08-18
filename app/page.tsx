'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getNotices, getSiteContent, getBanners, getCalendarEvents, getLocationImage, defaultContent, type Notice, type BannerSlide, type CalendarEvent } from '@/lib/local-store';
import { getHoliday } from '@/lib/holidays';
import ScrollReveal from '@/components/ScrollReveal';

/* ─── 로딩 화면 ─── */
function LoaderScreen({ exiting }: { exiting: boolean }) {
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
        {/* UNION 글자 하나씩 */}
        <div className="loader-union" style={{ perspective:'700px' }}>
          {letters.map((l, i) => (
            <span key={l} className="loader-letter" style={{ animationDelay:`${0.08 * i}s` }}>{l}</span>
          ))}
        </div>

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

  // 로더 상태
  const startTimeRef = useRef(Date.now());
  const hasCache = syncHasCache('hn_banners', 'hn_content');
  const [ready, setReady] = useState(() => hasCache);
  const [showLoader, setShowLoader] = useState(() => !hasCache);
  const [loaderExiting, setLoaderExiting] = useState(false);

  useEffect(() => {
    Promise.all([
      getNotices().then(setNotices),
      getSiteContent().then(c => setSlides(c.bannerSlides)),
      getBanners().then(setBannerImgs),
      getLocationImage().then(setLocationImg),
      getCalendarEvents().then(setCalEvents),
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
    return <LoaderScreen exiting={false} />;
  }

  return (
    <>
      {/* 로딩 화면 퇴장 오버레이 */}
      {showLoader && <LoaderScreen exiting={loaderExiting} />}

      <div style={{ background: '#e8e8e8', minHeight: '100vh', animation: 'sr-fade-in 0.5s ease both' }}>

        {/* ── Hero 배너 슬라이더 (크게) ── */}
        <div className="relative w-full overflow-hidden" style={{ height: 'clamp(340px, 52vw, 560px)' }}>

          {/* 배경 이미지 — key로 슬라이드 전환 시 재애니메이션 */}
          {currentBg
            ? <img key={`bg-${currentSlide}`} src={currentBg} alt="배너"
                className="absolute inset-0 w-full h-full object-cover hero-img-bg" />
            : <div className="absolute inset-0 bg-gradient-to-br from-[#001a52] via-[#003087] to-[#0052a5]" />
          }

          {/* 그라디언트 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10" />

          {/* 슬라이드 텍스트 — key로 재애니메이션 */}
          {currentSlideData && (currentSlideData.title || currentSlideData.subtitle) && (
            <div key={`text-${currentSlide}`}
              className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6 gap-3 pointer-events-none">
              {currentSlideData.title && (
                <h1 className="hero-title text-3xl md:text-5xl lg:text-6xl font-black drop-shadow-lg leading-tight max-w-3xl">
                  {currentSlideData.title}
                </h1>
              )}
              {currentSlideData.subtitle && (
                <p className="hero-sub text-base md:text-xl text-white/85 drop-shadow max-w-2xl">
                  {currentSlideData.subtitle}
                </p>
              )}
            </div>
          )}

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

        {/* ── 달력 + 공지사항 ── */}
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScrollReveal animation="fade-right" delay={0}>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">달력</h2>
            <div className="bg-white rounded p-4 shadow-sm">
              <SimpleCalendar events={calEvents} />
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-left" delay={100}>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">공지사항</h2>
            <div className="bg-white rounded shadow-sm overflow-hidden" style={{ minHeight: '220px' }}>
              {notices.map((n, idx) => (
                <Link key={n.id} href="/news/notices"
                  className={`flex items-center gap-2 px-4 py-3 text-sm hover:bg-blue-50 hover:translate-x-0.5 transition-all ${idx < notices.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  {n.isPinned && <span className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded font-bold flex-shrink-0">고정</span>}
                  <span className="flex-1 text-gray-700 truncate">{n.title}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0">{n.createdAt}</span>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* ── 오시는 길 ── */}
        <ScrollReveal animation="fade-up" delay={0} className="max-w-5xl mx-auto px-6 pb-10">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">총동아리연합회실(G301-1) 오시는 길</h2>
          <div className="bg-white rounded shadow-sm overflow-hidden" style={{ height: '200px' }}>
            {locationImg
              ? <img src={locationImg} alt="오시는 길" className="w-full h-full object-contain" />
              : <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  <div className="text-center">
                    <p>지도 이미지를 업로드해주세요</p>
                    <Link href="/about/location" className="text-blue-500 text-xs hover:underline mt-1 block">오시는 길 자세히 보기 →</Link>
                  </div>
                </div>
            }
          </div>
          <Link href="/about/location" className="text-xs text-gray-400 hover:text-gray-600 mt-1 block text-right">오시는 길 자세히 보기 →</Link>
        </ScrollReveal>
      </div>
    </>
  );
}
