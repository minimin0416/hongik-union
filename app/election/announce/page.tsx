'use client';
import { useEffect, useState } from 'react';
import { getElection, downloadFile, type ElectionAnnouncement } from '@/lib/local-store';

export default function ElectionAnnouncePage() {
  const [list, setList] = useState<ElectionAnnouncement[]>([]);
  const [selected, setSelected] = useState<ElectionAnnouncement | null>(null);
  useEffect(() => { getElection().then(setList); }, []);

  const statusColor: Record<string, string> = { 예정: 'bg-blue-100 text-blue-700', 진행중: 'bg-green-100 text-green-700', 완료: 'bg-gray-100 text-gray-500' };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">공고</h2>
      {selected ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <button onClick={() => setSelected(null)} className="text-sm text-gray-500 hover:text-gray-800 mb-4 flex items-center gap-1">← 목록으로</button>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[selected.status]}`}>{selected.status}</span>
            <h3 className="text-xl font-bold text-gray-800">{selected.title}</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4">{selected.date}</p>
          {selected.attachment && (
            <button onClick={() => downloadFile(selected.attachment!.url, selected.attachment!.name)}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline mb-4">
              📎 {selected.attachment.name}
            </button>
          )}
          <div className="border-t border-gray-100 pt-4 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {selected.content || '내용이 없습니다.'}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="data-table">
            <thead><tr><th>공고 제목</th><th className="w-20 text-center">상태</th><th className="w-28 text-center hidden md:table-cell">날짜</th></tr></thead>
            <tbody>
              {list.length === 0 && <tr><td colSpan={3} className="text-center text-gray-400 py-10">등록된 공고가 없습니다</td></tr>}
              {list.map((a) => (
                <tr key={a.id} className="cursor-pointer hover:bg-blue-50" onClick={() => setSelected(a)}>
                  <td className="font-medium text-gray-800">
                    {a.title}
                    {a.attachment && <span className="ml-2 text-xs text-blue-400">📎</span>}
                  </td>
                  <td className="text-center"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[a.status]}`}>{a.status}</span></td>
                  <td className="text-center text-gray-400 text-xs hidden md:table-cell">{a.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
