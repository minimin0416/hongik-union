'use client';
import { useEffect, useState } from 'react';
import { getPenalties, type Penalty } from '@/lib/local-store';

export default function PenaltyPage() {
  const [list, setList] = useState<Penalty[]>([]);
  useEffect(() => setList(getPenalties()), []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">벌점 현황</h2>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="data-table">
          <thead><tr><th>동아리</th><th>사유</th><th className="w-16 text-center">점수</th><th className="w-28 text-center hidden md:table-cell">날짜</th></tr></thead>
          <tbody>
            {list.length === 0 && <tr><td colSpan={4} className="text-center text-gray-400 py-10">벌점 내역이 없습니다</td></tr>}
            {list.map((p) => (
              <tr key={p.id}>
                <td className="font-medium text-gray-800">{p.club}</td>
                <td className="text-gray-600 text-sm">{p.reason}</td>
                <td className="text-center font-bold text-red-500">+{p.points}</td>
                <td className="text-center text-gray-400 text-xs hidden md:table-cell">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-gray-400 text-xs mt-4">※ 이의신청은 총동아리연합회실(G301-1)로 문의하세요.</p>
    </div>
  );
}
