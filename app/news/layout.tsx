'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { title: '공지사항', href: '/news/notices' },
  { title: '회의록', href: '/news/minutes' },
  { title: '동아리 소식', href: '/news/clubs' },
];

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div>
      <div className="section-header">
        <h1>소식마당</h1>
        <p>홍익대학교 총동아리연합회 소식을 확인하세요</p>
      </div>
      <div className="sub-nav">
        <div className="sub-nav-inner">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`sub-nav-link ${pathname === l.href ? 'active' : ''}`}>
              {l.title}
            </Link>
          ))}
        </div>
      </div>
      <div className="page-content">{children}</div>
    </div>
  );
}
