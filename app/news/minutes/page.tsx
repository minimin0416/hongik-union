'use client';
import { useEffect, useState } from 'react';
import { getMinutes, downloadFile, type Minutes } from '@/lib/local-store';

export default function MinutesPage() {
  const [list, setList] = useState<Minutes[]>([]);
  useEffect(() => { getMinutes().then(setList); }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">회의록</h2>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="data-table">
          <thead><tr><th>회의 제목</th><th className="w-28 text-center">날짜</th><th className="w-20 text-center hidden sm:table-cell">참석</th><th className="w-24 text-center">파일</th></tr></thead>
          <tbody>
            {list.length === 0 && <tr><td colSpan={4} className="text-center text-gray-400 py-10">등록된 회의록이 없습니다</td></tr>}
            {list.map((m) => (
              <tr key={m.id}>
                <td className="font-medium text-gray-800">{m.title}</td>
                <td className="text-center text-gray-400 text-xs">{m.date}</td>
                <td className="text-center text-gray-500 text-sm hidden sm:table-cell">{m.attendees}</td>
                <td className="text-center">
                  {m.attachment
                    ? <button onClick={() => downloadFile(m.attachment!.url, m.attachment!.name)}
                        className="text-xs text-blue-600 hover:underline font-medium">📎 다운로드</button>
                    : <span className="text-xs text-gray-300">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
