'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { title: '규칙', href: '/info/rules' },
  { title: '양식 및 가이드라인', href: '/info/forms' },
  { title: '활동증명서', href: '/info/activity-cert' },
  { title: '동아리증명서', href: '/info/club-cert' },
  { title: '벌점 현황', href: '/info/penalty' },
];

export default function InfoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div>
      <div className="section-header">
        <h1>정보마당</h1>
        <p>동아리 활동에 필요한 정보와 양식을 확인하세요</p>
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
