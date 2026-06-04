'use client';
import { useEffect, useState } from 'react';
import { getSiteContent, type InfoRule } from '@/lib/local-store';

export default function RulesInfoPage() {
  const [rules, setRules] = useState<InfoRule[]>([]);
  useEffect(() => { getSiteContent().then(c => setRules(c.infoRules ?? [])); }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">규칙</h2>
      <div className="space-y-3">
        {rules.map((r, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#003087] transition-colors">
            <div>
              <h3 className="font-semibold text-gray-800 mb-0.5">{r.title}</h3>
              <p className="text-gray-500 text-sm">{r.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
