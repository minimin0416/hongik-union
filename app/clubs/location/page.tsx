const buildings = [
  { building: 'A동', clubs: ['홍익극회 (101호)', '홍익뮤지컬 (102호)'] },
  { building: 'B동', clubs: ['홍익등산 (302호)', '홍익사이클 (303호)'] },
  { building: 'D동', clubs: ['홍익밴드 (205호)', '홍익재즈 (206호)', 'D동 연습실 (207호)'] },
  { building: 'E동', clubs: ['홍익영어토론 (401호)', '홍익법학 (402호)'] },
  { building: 'F동', clubs: ['홍익사진 (503호)', '홍익미술 (504호)'] },
  { building: 'G동', clubs: ['총동아리연합회실 (301-1호)', '홍익봉사 (105호)', '홍익CCC (201호)'] },
];

export default function ClubLocationPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">동아리방 위치</h2>
      <div className="bg-gray-100 rounded-xl overflow-hidden mb-8" style={{ height: '250px' }}>
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          <div className="text-center">
            <svg className="w-10 h-10 text-[#003087] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="text-[#003087] font-semibold text-sm">캠퍼스 지도 이미지 영역</p>
            <p className="text-gray-400 text-xs mt-1">관리자 페이지에서 지도를 업로드할 수 있습니다</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buildings.map((b) => (
          <div key={b.building} className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-[#003087] mb-3 text-lg">{b.building}</h3>
            <ul className="space-y-1.5">
              {b.clubs.map((club) => (
                <li key={club} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#003087] flex-shrink-0"></span>
                  {club}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
