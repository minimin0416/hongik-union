'use client';
import { useEffect, useState } from 'react';
import { getForms, downloadFile, type FormFile } from '@/lib/local-store';
import ScrollReveal from '@/components/ScrollReveal';

export default function FormsPage() {
  const [forms, setForms] = useState<FormFile[]>([]);
  useEffect(() => setForms(getForms()), []);

  return (
    <div>
      <ScrollReveal animation="fade-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">양식 및 가이드라인</h2>
        <p className="text-gray-500 text-sm mb-6">아래 양식을 다운로드하여 작성 후 제출해주세요.</p>
      </ScrollReveal>
      <ScrollReveal animation="fade-up" delay={100}>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="data-table">
          <thead><tr><th>양식명</th><th className="hidden md:table-cell">설명</th><th className="w-16 text-center">형식</th><th className="w-24 text-center">업데이트</th><th className="w-24 text-center">다운로드</th></tr></thead>
          <tbody>
            {forms.length === 0 && <tr><td colSpan={5} className="text-center text-gray-400 py-10">등록된 양식이 없습니다</td></tr>}
            {forms.map((f) => (
              <tr key={f.id}>
                <td className="font-medium text-gray-800">{f.name}</td>
                <td className="text-gray-500 text-sm hidden md:table-cell">{f.description}</td>
                <td className="text-center"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">{f.fileType}</span></td>
                <td className="text-center text-gray-400 text-sm">{f.updatedAt}</td>
                <td className="text-center">
                  {f.attachment
                    ? <button onClick={() => downloadFile(f.attachment!.url, f.attachment!.name)}
                        className="text-xs text-blue-600 hover:underline font-medium">📎 다운로드</button>
                    : <span className="text-xs text-gray-300">준비 중</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </ScrollReveal>
    </div>
  );
}
