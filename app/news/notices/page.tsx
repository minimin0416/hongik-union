'use client';

import { useEffect, useState } from 'react';
import { getNotices, downloadFile, type Notice } from '@/lib/local-store';
import ScrollReveal from '@/components/ScrollReveal';

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selected, setSelected] = useState<Notice | null>(null);

  useEffect(() => { getNotices().then(setNotices); }, []);

  const pinned = notices.filter((n) => n.isPinned);
  const normal = notices.filter((n) => !n.isPinned);
  const ordered = [...pinned, ...normal];

  return (
    <div>
      <ScrollReveal animation="fade-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">공지사항</h2>
          <span className="text-sm text-gray-400">총 {notices.length}건</span>
        </div>
      </ScrollReveal>

      {selected ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <button onClick={() => setSelected(null)}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            목록으로
          </button>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {selected.isPinned && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">고정</span>}
            <h3 className="text-xl font-bold text-gray-800">{selected.title}</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4">{selected.createdAt}</p>

          {/* 첨부파일 */}
          {selected.attachment && (
            <div className="mb-5">
              <button
                onClick={() => downloadFile(selected.attachment!.url, selected.attachment!.name)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700"
              >
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span className="font-medium">{selected.attachment.name}</span>
                <span className="text-xs text-blue-500 ml-1">다운로드</span>
              </button>
            </div>
          )}

          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm border-t border-gray-100 pt-5">
            {selected.content || '내용이 없습니다.'}
          </div>
        </div>
      ) : (
        <ScrollReveal animation="fade-up" delay={80}>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-12 text-center">번호</th>
                <th>제목</th>
                <th className="w-28 hidden md:table-cell text-center">날짜</th>
              </tr>
            </thead>
            <tbody>
              {ordered.length === 0 && (
                <tr><td colSpan={3} className="text-center text-gray-400 py-10">등록된 공지사항이 없습니다</td></tr>
              )}
              {ordered.map((n, idx) => (
                <tr key={n.id} className="cursor-pointer hover:bg-blue-50" onClick={() => setSelected(n)}>
                  <td className="text-center text-gray-400 text-sm">
                    {n.isPinned ? '📌' : ordered.length - idx}
                  </td>
                  <td>
                    <div className="flex items-center gap-2 flex-wrap">
                      {n.isPinned && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">고정</span>}
                      <span className="font-medium text-gray-800 text-sm">{n.title}</span>
                      {n.attachment && <span className="text-xs text-blue-400">📎</span>}
                    </div>
                  </td>
                  <td className="text-center text-gray-400 text-xs hidden md:table-cell">{n.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </ScrollReveal>
      )}
    </div>
  );
}
