import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-700 text-gray-300 py-6 mt-4">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">홍익대학교 총동아리연합회</p>
          <p className="text-xs mt-1">위치: G동 301-1호 · 이메일: union@hongik.ac.kr</p>
          <p className="text-xs mt-0.5">© 2025 홍익대학교 총동아리연합회. All rights reserved.</p>
        </div>
        <Link href="/admin" className="text-xs text-gray-400 hover:text-white transition-colors">
          관리자 페이지
        </Link>
      </div>
    </footer>
  );
}
