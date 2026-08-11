'use client';

const NOTION_URL = 'https://app.notion.com/p/3b9aa25bb02580fb83b9f4dd0490c772';

export default function ReservationPage() {
  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 64px)' }}>
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-sm font-semibold text-gray-800">🏟️ 체육관 · 운동장 예약 현황</h1>
          <p className="text-xs text-gray-400 mt-0.5">예약 문의는 총동아리연합회실(G301-1)로 방문하거나 카카오톡으로 연락해주세요</p>
        </div>
        <a
          href={NOTION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition-colors flex-shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          새 탭에서 열기
        </a>
      </div>

      {/* 노션 임베드 */}
      <div className="relative flex-1" style={{ minHeight: '80vh' }}>
        <iframe
          src={NOTION_URL}
          className="w-full h-full border-0"
          style={{ minHeight: '80vh' }}
          allow="fullscreen"
          title="체육관·운동장 예약 현황"
        />
        {/* iframe 로드 실패 시 폴백 (Notion이 임베드 차단할 경우) */}
        <noscript>
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-3">예약 현황을 보려면 아래 버튼을 클릭하세요</p>
              <a href={NOTION_URL} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700">
                예약 현황 보기
              </a>
            </div>
          </div>
        </noscript>
      </div>

      {/* 안내 메시지 */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">
          화면이 보이지 않으면{' '}
          <a href={NOTION_URL} target="_blank" rel="noopener noreferrer"
            className="text-blue-500 hover:underline">새 탭에서 열기</a>를 클릭하세요
        </p>
      </div>
    </div>
  );
}
