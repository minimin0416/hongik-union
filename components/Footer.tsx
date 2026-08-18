'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSiteContent } from '@/lib/local-store';

export default function Footer() {
  const [title, setTitle] = useState('홍익대학교 총동아리연합회');
  const [address, setAddress] = useState('G동 301-1호');
  const [email, setEmail] = useState('union@hongik.ac.kr');
  const [copyright, setCopyright] = useState('© 2026 홍익대학교 총동아리연합회 Union. All rights reserved.');

  useEffect(() => {
    getSiteContent().then(c => {
      if (c.footerTitle) setTitle(c.footerTitle);
      if (c.locationAddress) setAddress(c.locationAddress);
      if (c.locationEmail) setEmail(c.locationEmail);
      if (c.footerCopyright) setCopyright(c.footerCopyright);
    });
  }, []);

  return (
    <footer className="bg-gray-700 text-gray-300 py-8 mt-4">
      <div className="w-full px-8 lg:px-14 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-white">{title}</p>
          <p className="text-sm mt-1">위치: {address} · 이메일: {email}</p>
          <p className="text-sm mt-0.5">{copyright}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Link href="/admin" className="text-sm text-gray-400 hover:text-white transition-colors">
            관리자 페이지
          </Link>
          <a href="https://www.hongik.ac.kr/kr/etc/privacy-policy.do" target="_blank" rel="noopener noreferrer"
            className="text-sm text-gray-300 hover:text-white underline underline-offset-2 inline-block transition-colors">
            개인정보 처리방침
          </a>
        </div>
      </div>
    </footer>
  );
}
