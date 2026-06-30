'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getSiteContent, getLogo } from '@/lib/local-store';

const navItems = [
  {
    title: '총동아리연합회',
    href: '/about',
    submenu: [
      { title: '소개', href: '/about/intro' },
      { title: '주요업무', href: '/about/work' },
      { title: '조직도', href: '/about/org' },
      { title: '오시는 길', href: '/about/location' },
      { title: '회칙', href: '/about/rules' },
    ],
  },
  {
    title: '동아리 소개',
    href: '/clubs',
    submenu: [
      { title: '중앙동아리', href: '/clubs/central' },
      { title: '동아리방 위치', href: '/clubs/location' },
    ],
  },
  {
    title: '소식마당',
    href: '/news',
    submenu: [
      { title: '공지사항', href: '/news/notices' },
      { title: '동아리 소식', href: '/news/clubs' },
      { title: '일정', href: '/news/calendar' },
      { title: '회의록', href: '/news/minutes' },
    ],
  },
  {
    title: '정보마당',
    href: '/info',
    submenu: [
      { title: '규칙', href: '/info/rules' },
      { title: '양식', href: '/info/forms' },
      { title: '양식 가이드라인', href: '/info/forms' },
      { title: '활동증명서', href: '/info/activity-cert' },
      { title: '동아리증명서', href: '/info/club-cert' },
      { title: '벌점 현황', href: '/info/penalty' },
    ],
  },
  {
    title: '동아리선거관리위원회',
    href: '/election',
    submenu: [
      { title: '소개', href: '/election/intro' },
      { title: '선거 공고', href: '/election/announce' },
    ],
  },
  {
    title: '문의사항',
    href: '/contact',
    submenu: [
      { title: '자주 묻는 질문', href: '/contact/faq' },
      { title: '질문 있어요', href: '/contact/ask' },
    ],
  },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [instagramUrl, setInstagramUrl] = useState('');
  const [kakaoUrl, setKakaoUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try { return localStorage.getItem('hn_logo') || ''; } catch { return ''; }
  });
  useEffect(() => {
    getSiteContent().then(c => { setInstagramUrl(c.instagramUrl); setKakaoUrl(c.kakaoUrl); });
    getLogo().then(v => setLogoUrl(v || ''));
    const handler = (e: Event) => {
      const { key, value } = (e as CustomEvent).detail;
      if (key === 'hn_logo') setLogoUrl(value || '');
    };
    window.addEventListener('db-str-update', handler);
    return () => window.removeEventListener('db-str-update', handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16">
          {/* Logo: null=SSR(빈박스), ''=기본로고없음(빈박스), 값있으면 표시 */}
          <Link href="/" className="flex-shrink-0 mr-8">
            {logoUrl
              ? <img
                  src={logoUrl}
                  alt="로고"
                  style={{ height: '40px', maxWidth: '160px', objectFit: 'contain' }}
                />
              : <div style={{ width: '120px', height: '40px' }} />
            }
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center h-full flex-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <div key={item.href} className="relative group h-full flex items-center">
                  <Link
                    href={item.href}
                    className={`px-3 xl:px-4 h-full flex items-center text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                      isActive
                        ? 'text-gray-900 border-gray-900'
                        : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    {item.title}
                  </Link>
                  {/* Dropdown */}
                  <div className="absolute top-full left-0 hidden group-hover:block min-w-36 bg-white shadow-lg rounded-b-lg overflow-hidden z-50 border-t-2 border-gray-900">
                    {item.submenu.map((sub) => (
                      <Link
                        key={sub.href + sub.title}
                        href={sub.href}
                        className={`block px-4 py-2.5 text-sm transition-colors ${
                          pathname === sub.href
                            ? 'bg-gray-100 text-gray-900 font-semibold'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Instagram */}
            <a
              href={instagramUrl || '#'}
              target={instagramUrl ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>

            {/* KakaoTalk */}
            <a
              href={kakaoUrl || '#'}
              target={kakaoUrl ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="KakaoTalk"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#3A1D1D">
                <path d="M12 3C6.48 3 2 6.69 2 11.25c0 2.9 1.87 5.45 4.68 6.96L5.5 21l3.9-2.04C10.23 19.31 11.1 19.5 12 19.5c5.52 0 10-3.69 10-8.25S17.52 3 12 3z"/>
              </svg>
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="메뉴"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          {navItems.map((item) => (
            <div key={item.href}>
              <button
                onClick={() => setMobileExpanded(mobileExpanded === item.href ? null : item.href)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-100"
              >
                {item.title}
                <svg
                  className={`w-4 h-4 transition-transform ${mobileExpanded === item.href ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileExpanded === item.href && (
                <div className="bg-gray-50">
                  {item.submenu.map((sub) => (
                    <Link
                      key={sub.href + sub.title}
                      href={sub.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-8 py-3 text-sm text-gray-600 hover:text-gray-900 border-b border-gray-100"
                    >
                      {sub.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
