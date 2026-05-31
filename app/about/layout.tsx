'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { title: '총동아리연합회란', href: '/about/intro' },
  { title: '주요업무', href: '/about/work' },
  { title: '조직도', href: '/about/org' },
  { title: '오시는 길', href: '/about/location' },
  { title: '회칙', href: '/about/rules' },
];

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div>
      <div className="section-header">
        <h1>총동아리연합회</h1>
        <p>홍익대학교 제39대 총동아리연합회 Union</p>
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
