'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SectionHeader from '@/components/SectionHeader';

const links = [
  { title: '공지사항', href: '/news/notices' },
  { title: '동아리 소식', href: '/news/clubs' },
  { title: '일정', href: '/news/calendar' },
  { title: '회의록', href: '/news/minutes' },
];

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div>
      <SectionHeader title="소식마당" subtitle="홍익대학교 총동아리연합회 소식을 확인하세요" />
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
