'use client';
import { useState } from 'react';

export default function ClubCertPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ clubName: '', presidentName: '', studentId: '', purpose: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">신청이 완료되었습니다</h3>
        <p className="text-gray-500 text-sm mb-6">확인 후 발급까지 1~2 영업일이 소요됩니다.</p>
        <button onClick={() => { setSubmitted(false); setForm({ clubName:'',presidentName:'',studentId:'',purpose:'' }); }}
          className="btn-secondary">다시 신청하기</button>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">동아리증명서 발급 신청</h2>
      <p className="text-gray-500 text-sm mb-6">동아리가 등록된 단체임을 증명하는 서류입니다.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: '동아리명', name: 'clubName', placeholder: '예: 홍익밴드', required: true },
          { label: '동아리 회장 이름', name: 'presidentName', placeholder: '이름을 입력하세요', required: true },
          { label: '회장 학번', name: 'studentId', placeholder: '예: 2021XXXX', required: true },
          { label: '발급 목적', name: 'purpose', placeholder: '예: 외부 공연 신청용', required: false },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={form[field.name as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
              placeholder={field.placeholder}
              required={field.required}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003087] focus:ring-2 focus:ring-blue-100"
            />
          </div>
        ))}
        <button type="submit" className="btn-primary w-full justify-center">발급 신청하기</button>
      </form>
    </div>
  );
}
