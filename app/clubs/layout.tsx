'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { title: '중앙동아리', href: '/clubs/central' },
  { title: '동아리방 위치', href: '/clubs/location' },
];

export default function ClubsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div>
      <div className="section-header">
        <h1>동아리 소개</h1>
        <p>홍익대학교 제39대 총동아리연합회 Union</p>
      </div>
      <div className="sub-nav">
        <div className="sub-nav-inner">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`sub-nav-link ${pathname.startsWith(l.href) ? 'active' : ''}`}>
              {l.title}
            </Link>
          ))}
        </div>
      </div>
      <div className="page-content">{children}</div>
    </div>
  );
}
