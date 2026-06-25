'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getNotices, getSiteContent, getBanners, getCalendarEvents, getLocationImage, defaultContent, type Notice, type BannerSlide, type CalendarEvent } from '@/lib/local-store';
import { getHoliday } from '@/lib/holidays';
import ScrollReveal from '@/components/ScrollReveal';

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

  // 캐시가 있으면 즉시 ready, 없으면 fetch 완료 후 ready (localStorage 차단 시 fetch로 폴백)
  const [ready, setReady] = useState(() => syncHasCache('hn_banners', 'hn_content'));

  useEffect(() => {
    Promise.all([
      getNotices().then(setNotices),
      getSiteContent().then(c => setSlides(c.bannerSlides)),
      getBanners().then(setBannerImgs),
      getLocationImage().then(setLocationImg),
      getCalendarEvents().then(setCalEvents),
    ]).then(() => setReady(true));

    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % 3), 5000);
    return () => clearInterval(timer);
  }, []);

  const slideCount = slides.length || 3;
  const currentBg = bannerImgs[currentSlide] || '';
  const currentSlideData = slides[currentSlide];

  // 데이터 준비 안 됐으면 빈 화면 (첫 방문)
  if (!ready) {
    return <div className="min-h-screen bg-[#e8e8e8]" />;
  }

  return (
    <div style={{ background: '#e8e8e8', minHeight: '100vh', animation: 'sr-fade-in 0.4s ease both' }}>

      {/* Hero 배너 슬라이더 */}
      <div className="relative w-full overflow-hidden" style={{ height: '320px' }}>
        {currentBg
          ? <img src={currentBg} alt="배너" className="absolute inset-0 w-full h-full object-cover" />
          : <div className="absolute inset-0 bg-[#b0bec5]" />
        }
        {currentSlideData && (currentSlideData.title || currentSlideData.subtitle) && (
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center px-6">
            {currentSlideData.title && <h1 className="text-2xl md:text-4xl font-black mb-2 drop-shadow">{currentSlideData.title}</h1>}
            {currentSlideData.subtitle && <p className="text-base md:text-lg text-white/90 drop-shadow">{currentSlideData.subtitle}</p>}
          </div>
        )}
        <button onClick={() => setCurrentSlide((p) => (p - 1 + slideCount) % slideCount)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 hover:bg-black/50 flex items-center justify-center text-white text-lg transition-colors rounded-sm">◄</button>
        <button onClick={() => setCurrentSlide((p) => (p + 1) % slideCount)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 hover:bg-black/50 flex items-center justify-center text-white text-lg transition-colors rounded-sm">►</button>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {Array.from({ length: slideCount }).map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-white' : 'bg-white/40'}`} />
          ))}
        </div>
      </div>

      {/* 달력 + 공지사항 */}
      <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className={`flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${idx < notices.length - 1 ? 'border-b border-gray-100' : ''}`}>
                {n.isPinned && <span className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded font-bold flex-shrink-0">고정</span>}
                <span className="flex-1 text-gray-700 truncate">{n.title}</span>
                <span className="text-xs text-gray-400 flex-shrink-0">{n.createdAt}</span>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* 총동아리연합회실 오시는 길 */}
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
  );
}
