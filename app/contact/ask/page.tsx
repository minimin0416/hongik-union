'use client';

import { useState } from 'react';
import { getInquiries, saveInquiries, type Inquiry } from '@/lib/local-store';

export default function AskPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '', email: '', category: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newInquiry: Inquiry = {
      id: Date.now().toString(),
      ...form,
      status: 'pending',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    const existing = await getInquiries();
    await saveInquiries([newInquiry, ...existing]);
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
        <h3 className="text-xl font-bold text-gray-800 mb-2">문의가 접수되었습니다</h3>
        <p className="text-gray-500 text-sm mb-6">빠른 시일 내에 답변드리겠습니다.</p>
        <button onClick={() => { setSubmitted(false); setForm({ name: '', contact: '', email: '', category: '', message: '' }); }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          다시 문의하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">질문 있어요</h2>
      <p className="text-gray-500 text-sm mb-6">궁금한 점을 남겨주시면 확인 후 답변드리겠습니다.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름 <span className="text-red-500">*</span></label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="이름" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
            <input type="tel" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })}
              placeholder="010-0000-0000" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">이메일 <span className="text-red-500">*</span></label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="email@example.com" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">문의 유형 <span className="text-red-500">*</span></label>
          <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-500 bg-white">
            <option value="">선택하세요</option>
            <option>동아리 등록 관련</option>
            <option>동아리방 관련</option>
            <option>지원금 관련</option>
            <option>증명서 발급 관련</option>
            <option>벌점 관련</option>
            <option>기타</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">문의 내용 <span className="text-red-500">*</span></label>
          <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="문의 내용을 자세히 작성해주세요" rows={5}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-500 resize-none" />
        </div>
        <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
          문의 제출하기
        </button>
      </form>
    </div>
  );
}
