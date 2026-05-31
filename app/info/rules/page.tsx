const rules = [
  { title: '동아리 등록 규정', desc: '신규 동아리 등록 및 등록 갱신 관련 규정', file: true },
  { title: '동아리방 사용 규정', desc: '동아리방 사용 방법, 금지 사항, 청소 의무 등', file: true },
  { title: '활동 지원금 관리 규정', desc: '지원금 신청, 사용, 정산 관련 규정', file: true },
  { title: 'D동 연습실 이용 규정', desc: '연습실 예약, 사용 가능 시간, 주의사항', file: true },
  { title: '벌점 부과 기준', desc: '벌점 부과 사유, 기준, 이의신청 절차', file: false },
];

export default function RulesInfoPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">규칙</h2>
      <div className="space-y-3">
        {rules.map((r, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:border-[#003087] transition-colors">
            <div>
              <h3 className="font-semibold text-gray-800 mb-0.5">{r.title}</h3>
              <p className="text-gray-500 text-sm">{r.desc}</p>
            </div>
            {r.file && (
              <button className="btn-primary flex-shrink-0 ml-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                다운로드
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
