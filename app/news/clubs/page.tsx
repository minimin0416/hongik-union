'use client';
import { useEffect, useState } from 'react';
import { getClubNews, type ClubNews } from '@/lib/local-store';

export default function ClubNewsPage() {
  const [news, setNews] = useState<ClubNews[]>([]);
  useEffect(() => setNews(getClubNews()), []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">동아리 소식</h2>
      {news.length === 0 && <p className="text-gray-400 text-sm text-center py-12">등록된 소식이 없습니다. 관리자 페이지에서 추가해주세요.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {news.map((n) => (
          <div key={n.id} className="card p-5">
            {n.imageUrl && <img src={n.imageUrl} alt="" className="w-full h-40 object-cover rounded-lg mb-3" />}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{n.category}</span>
              <span className="text-xs text-gray-400">{n.date}</span>
            </div>
            <p className="text-xs text-gray-400 mb-1">[{n.club}]</p>
            <h3 className="font-semibold text-gray-800 mb-1">{n.title}</h3>
            {n.content && <p className="text-gray-500 text-sm leading-relaxed">{n.content}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
