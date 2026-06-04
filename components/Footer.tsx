'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSiteContent } from '@/lib/local-store';

export default function Footer() {
  const [address, setAddress] = useState('G동 301-1호');
  const [email, setEmail] = useState('union@hongik.ac.kr');

  useEffect(() => {
    getSiteContent().then(c => {
      if (c.locationAddress) setAddress(c.locationAddress);
      if (c.locationEmail) setEmail(c.locationEmail);
    });
  }, []);

  return (
    <footer className="bg-gray-700 text-gray-300 py-6 mt-4">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">홍익대학교 총동아리연합회</p>
          <p className="text-xs mt-1">위치: {address} · 이메일: {email}</p>
          <p className="text-xs mt-0.5">© 2025 홍익대학교 총동아리연합회. All rights reserved.</p>
        </div>
        <Link href="/admin" className="text-xs text-gray-400 hover:text-white transition-colors">
          관리자 페이지
        </Link>
      </div>
    </footer>
  );
}
