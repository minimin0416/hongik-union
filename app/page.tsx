'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getNotices, getSiteContent, getBanners, type Notice, type BannerSlide } from '@/lib/local-store';
import ScrollReveal from '@/components/ScrollReveal';

function SimpleCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  const dayNames = ['일','월','화','수','목','금','토'];
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);
  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 transition-colors text-gray-500 text-sm">
          ‹
        </button>
        <span className="text-sm font-semibold text-gray-700">{year}년 {monthNames[month]}</span>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 transition-colors text-gray-500 text-sm">
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {dayNames.map((d, i) => (
          <div key={d} className={`text-center text-xs font-medium py-1 ${i===0?'text-red-500':i===6?'text-blue-500':'text-gray-500'}`}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => (
          <div key={idx} className={`aspect-square flex items-center justify-center text-xs rounded transition-colors ${
            day===null ? '' :
            isToday(day) ? 'bg-gray-800 text-white font-bold rounded-full' :
            idx%7===0 ? 'text-red-400 hover:bg-red-50 cursor-pointer' :
            idx%7===6 ? 'text-blue-400 hover:bg-blue-50 cursor-pointer' :
            'text-gray-600 hover:bg-gray-100 cursor-pointer'
          }`}>
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [bannerImgs, setBannerImgs] = useState<string[]>([]);

  useEffect(() => {
    setNotices(getNotices());
    setSlides(getSiteContent().bannerSlides);
    setBannerImgs(getBanners());
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % 3), 5000);
    return () => clearInterval(timer);
  }, []);

  const slideCount = slides.length || 3;
  const currentBg = bannerImgs[currentSlide] || '';
  const currentSlideData = slides[currentSlide];

  return (
    <div style={{ background: '#e8e8e8', minHeight: '100vh' }}>

      {/* Hero 배너 슬라이더 */}
      <div className="relative w-full overflow-hidden" style={{ height: '320px' }}>
        {/* 배경: 이미지 또는 기본 회색 */}
        {currentBg
          ? <img src={currentBg} alt="배너" className="absolute inset-0 w-full h-full object-cover" />
          : <div className="absolute inset-0 bg-[#b0bec5]" />
        }
        {/* 텍스트 오버레이 */}
        {currentSlideData && (currentSlideData.title || currentSlideData.subtitle) && (
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center px-6">
            {currentSlideData.title && <h1 className="text-2xl md:text-4xl font-black mb-2 drop-shadow">{currentSlideData.title}</h1>}
            {currentSlideData.subtitle && <p className="text-base md:text-lg text-white/90 drop-shadow">{currentSlideData.subtitle}</p>}
          </div>
        )}

        {/* 왼쪽 화살표 */}
        <button
          onClick={() => setCurrentSlide((p) => (p - 1 + slideCount) % slideCount)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 hover:bg-black/50 flex items-center justify-center text-white text-lg transition-colors rounded-sm"
        >
          ◄
        </button>

        {/* 오른쪽 화살표 */}
        <button
          onClick={() => setCurrentSlide((p) => (p + 1) % slideCount)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 hover:bg-black/50 flex items-center justify-center text-white text-lg transition-colors rounded-sm"
        >
          ►
        </button>

        {/* 슬라이드 점 */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {Array.from({ length: slideCount }).map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-white' : 'bg-white/40'}`} />
          ))}
        </div>
      </div>

      {/* 달력 + 공지사항 */}
      <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 달력 */}
        <ScrollReveal animation="fade-right" delay={0}>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">달력</h2>
          <div className="bg-white rounded p-4 shadow-sm" style={{ minHeight: '220px' }}>
            <SimpleCalendar />
          </div>
        </ScrollReveal>

        {/* 공지사항 */}
        <ScrollReveal animation="fade-left" delay={100}>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">공지사항</h2>
          <div className="bg-white rounded shadow-sm overflow-hidden" style={{ minHeight: '220px' }}>
            {notices.map((n, idx) => (
              <Link key={n.id} href="/news/notices"
                className={`flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${idx < notices.length - 1 ? 'border-b border-gray-100' : ''}`}>
                {n.isNew && <span className="text-xs bg-red-500 text-white px-1 py-0.5 rounded font-bold flex-shrink-0">N</span>}
                <span className="flex-1 text-gray-700 truncate">{n.title}</span>
                <span className="text-xs text-gray-400 flex-shrink-0">{n.date}</span>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* 총동아리연합회실 오시는 길 */}
      <ScrollReveal animation="fade-up" delay={0} className="max-w-5xl mx-auto px-6 pb-10">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">총동아리연합회실(G301-1) 오시는 길</h2>
        <div className="bg-white rounded shadow-sm overflow-hidden" style={{ height: '200px' }}>
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            <div className="text-center">
              <p>지도 이미지를 업로드해주세요</p>
              <Link href="/about/location" className="text-blue-500 text-xs hover:underline mt-1 block">
                오시는 길 자세히 보기 →
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
