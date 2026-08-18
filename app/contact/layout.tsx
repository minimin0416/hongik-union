'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SectionHeader from '@/components/SectionHeader';

const links = [
  { title: '자주 묻는 질문', href: '/contact/faq' },
  { title: '질문 있어요', href: '/contact/ask' },
];

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div>
      <SectionHeader title="문의사항" subtitle="궁금한 점이 있으시면 언제든지 문의해주세요" />
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
