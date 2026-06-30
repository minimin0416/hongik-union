'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { title: '자주 묻는 질문', href: '/contact/faq' },
  { title: '질문 있어요', href: '/contact/ask' },
];

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div>
      <div className="section-header">
        <h1>문의사항</h1>
        <p>궁금한 점이 있으시면 언제든지 문의해주세요</p>
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
