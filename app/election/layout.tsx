'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SectionHeader from '@/components/SectionHeader';

const links = [
  { title: '소개', href: '/election/intro' },
  { title: '공고', href: '/election/announce' },
];

export default function ElectionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div>
      <SectionHeader title="동아리선거관리위원회" subtitle="공정하고 투명한 선거를 위해 운영됩니다" />
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
