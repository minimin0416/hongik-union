import { clubs as defaultClubs } from './clubs-data';


/* ── 유틸 ── */
export const readFileAsBase64 = (file: File): Promise<{ url: string; name: string; type: string }> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve({ url: e.target?.result as string, name: file.name, type: file.type });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const downloadFile = (url: string, name: string) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
};

/* ── 타입 정의 ── */
export type Attachment = { url: string; name: string; type: string };
export type Notice = { id: string; title: string; content: string; isPinned: boolean; createdAt: string; attachment?: Attachment };
export type ClubData = { id: number; name: string; category: string; room: string; president: string; contact: string; recruitPeriod: string; meetingSchedule: string; intro: string; desc: string; activities: string[]; targets: string[]; instagram: string; imageUrl?: string };
export type Minutes = { id: string; title: string; date: string; attendees: string; attachment?: Attachment };
export type ClubNews = { id: string; club: string; category: string; title: string; content: string; date: string; imageUrl?: string };
export type Penalty = { id: string; club: string; reason: string; points: number; date: string };
export type FormFile = { id: string; name: string; description: string; fileType: string; updatedAt: string; attachment?: Attachment };
export type ElectionAnnouncement = { id: string; title: string; content: string; date: string; status: '예정' | '진행중' | '완료'; attachment?: Attachment };
export type Inquiry = { id: string; name: string; email: string; contact: string; category: string; message: string; status: 'pending' | 'confirmed'; createdAt: string };
export type BannerSlide = { title: string; subtitle: string };
export type WorkItem   = { title: string; desc: string };
export type FaqItem    = { q: string; a: string };
export type SiteContent = {
  bannerSlides: BannerSlide[]; aboutIntro: string; aboutVision: string; workItems: WorkItem[];
  locationAddress: string; locationHours: string; locationPhone: string; locationEmail: string;
  rules: string; faqs: FaqItem[]; electionIntro: string; instagramUrl: string; kakaoUrl: string;
};

/* ── 기본값 ── */
const defaultNotices: Notice[] = [
  { id: '1', title: '[공지] 2025년 1학기 동아리 활동 보고서 제출 안내', content: '자세한 내용은 추후 공지 예정입니다.', isPinned: true, createdAt: '2025-05-28' },
  { id: '2', title: '[공지] 동아리방 청소 및 점검 일정 안내', content: '', isPinned: false, createdAt: '2025-05-25' },
  { id: '3', title: '[공지] 총동아리연합회 정기총회 개최 안내', content: '', isPinned: false, createdAt: '2025-05-20' },
];
const defaultMinutes: Minutes[] = [
  { id: '1', title: '2025년 1학기 제5차 정기회의', date: '2025-05-20', attendees: '15명' },
  { id: '2', title: '2025년 1학기 제4차 정기회의', date: '2025-05-06', attendees: '13명' },
];
const defaultForms: FormFile[] = [
  { id: '1', name: '동아리 등록 신청서', description: '신규 동아리 등록 시 제출', fileType: 'HWP', updatedAt: '2025.03' },
  { id: '2', name: '동아리 등록 갱신 신청서', description: '매 학기 갱신 시 제출', fileType: 'HWP', updatedAt: '2025.03' },
  { id: '3', name: '활동 지원금 신청서', description: '활동 지원금 신청 시 제출', fileType: 'HWP', updatedAt: '2025.03' },
  { id: '4', name: '활동 보고서 양식', description: '학기 말 제출 필수', fileType: 'HWP', updatedAt: '2025.03' },
];
const defaultElectionAnnouncements: ElectionAnnouncement[] = [
  { id: '1', title: '[공고] 제40대 총동아리연합회 임원 선거 일정 공고', content: '', date: '2025-11-01', status: '예정' },
  { id: '2', title: '[공고] 제39대 총동아리연합회 임원 선거 당선자 발표', content: '', date: '2024-11-20', status: '완료' },
];
export const defaultContent: SiteContent = {
  bannerSlides: [
    { title: '홍익대학교 총동아리연합회', subtitle: '우리 모두가 함께 만들어가는 동아리 문화' },
    { title: '2025년 동아리 활동', subtitle: '다양한 분야에서 꿈을 펼치세요' },
    { title: '동아리 신규 가입 안내', subtitle: '나에게 맞는 동아리를 찾아보세요' },
  ],
  aboutIntro: '홍익대학교 총동아리연합회(이하 총동아리연합회)는 홍익대학교 내 모든 중앙동아리를 대표하는 학생 자치 기구입니다.\n\n총동아리연합회는 동아리들의 권익을 대변하고, 동아리 활동을 지원하며, 학교와 동아리 간의 원활한 소통을 담당합니다.',
  aboutVision: '모든 동아리가 자유롭게 활동하고 성장할 수 있는 환경을 만들어, 홍익대학교 내 동아리 문화를 더욱 풍성하게 발전시킵니다.',
  workItems: [
    { title: '동아리 등록 및 관리', desc: '신규 동아리 등록 심사, 기존 동아리 활동 현황 관리 및 지원' },
    { title: '활동 지원금 배분', desc: '학교로부터 지원받은 활동비를 각 동아리에 공정하게 배분' },
    { title: '동아리방 관리', desc: '동아리방 배정, 청소 점검, 시설 개선 요청 등 관리 업무' },
    { title: '공연 및 행사 기획', desc: '전체 동아리 연합 행사, 공연 일정 조율 및 진행 지원' },
    { title: '학교-동아리 간 소통', desc: '학교 측과 동아리 간의 원활한 소통 및 의견 전달 창구 역할' },
    { title: '정기총회 운영', desc: '매 학기 정기총회 개최, 주요 안건 심의 및 의결' },
  ],
  locationAddress: '홍익대학교 G동 301-1호 총동아리연합회실',
  locationHours: '평일 10:00 ~ 17:00',
  locationPhone: '02-320-XXXX',
  locationEmail: 'union@hongik.ac.kr',
  rules: '제1장 총칙\n제1조 본 회의 명칭은 홍익대학교 총동아리연합회라 한다.\n\n(관리자 페이지에서 전체 회칙을 입력해주세요)',
  faqs: [
    { q: '동아리를 새로 만들고 싶은데 어떻게 하나요?', a: '매 학기 초에 신규 동아리 등록 신청을 받습니다.' },
    { q: '동아리방은 어떻게 신청하나요?', a: '동아리방은 학기 초에 선착순 또는 추첨으로 배정됩니다.' },
    { q: '활동 지원금은 언제 받을 수 있나요?', a: '활동 지원금은 학기 초에 신청을 받아 배분합니다.' },
    { q: '총동아리연합회 운영시간은 언제인가요?', a: '평일 오전 10시부터 오후 5시까지 운영합니다. G동 301-1호에 위치합니다.' },
  ],
  electionIntro: '동아리선거관리위원회(이하 선관위)는 총동아리연합회 임원 선거를 공정하고 투명하게 관리하기 위해 구성된 독립적인 기구입니다.',
  instagramUrl: '',
  kakaoUrl: '',
};

/* ── DB 헬퍼 (캐시 우선 + 백그라운드 갱신) ── */
async function dbGet<T>(key: string, def: T): Promise<T> {
  if (typeof window === 'undefined') return def;
  const cached = localStorage.getItem(key);
  if (cached) {
    // 캐시 즉시 반환, 백그라운드에서 Supabase 갱신
    fetch(`/api/data?key=${encodeURIComponent(key)}`)
      .then(r => r.json())
      .then(v => { if (v !== null) localStorage.setItem(key, v); })
      .catch(() => {});
    return JSON.parse(cached) as T;
  }
  try {
    const res = await fetch(`/api/data?key=${encodeURIComponent(key)}`);
    const value = await res.json();
    if (value !== null) { localStorage.setItem(key, value); return JSON.parse(value) as T; }
    return def;
  } catch { return def; }
}

async function dbSet(key: string, value: unknown): Promise<void> {
  if (typeof window === 'undefined') return;
  const serialized = JSON.stringify(value);
  localStorage.setItem(key, serialized); // 즉시 캐시 업데이트
  try {
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: serialized }),
    });
  } catch {}
}

async function dbGetStr(key: string): Promise<string> {
  if (typeof window === 'undefined') return '';
  const cached = localStorage.getItem(key);
  if (cached) {
    fetch(`/api/data?key=${encodeURIComponent(key)}`)
      .then(r => r.json())
      .then(v => { if (v !== null) localStorage.setItem(key, v); })
      .catch(() => {});
    return cached;
  }
  try {
    const res = await fetch(`/api/data?key=${encodeURIComponent(key)}`);
    const value = await res.json();
    if (value !== null) { localStorage.setItem(key, value); return value; }
    return '';
  } catch { return ''; }
}

async function dbSetStr(key: string, value: string): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value); // 즉시 캐시 업데이트
  try {
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
  } catch {}
}

/* ── getter / setter ── */
export const getNotices    = (): Promise<Notice[]>               => dbGet('hn_notices',   defaultNotices);
export const saveNotices   = (v: Notice[])                       => dbSet('hn_notices',   v);
export const getMinutes    = (): Promise<Minutes[]>              => dbGet('hn_minutes',   defaultMinutes);
export const saveMinutes   = (v: Minutes[])                      => dbSet('hn_minutes',   v);
export const getClubNews   = (): Promise<ClubNews[]>             => dbGet('hn_club_news', []);
export const saveClubNews  = (v: ClubNews[])                     => dbSet('hn_club_news', v);
export const getPenalties  = (): Promise<Penalty[]>              => dbGet('hn_penalties', []);
export const savePenalties = (v: Penalty[])                      => dbSet('hn_penalties', v);
export const getForms      = (): Promise<FormFile[]>             => dbGet('hn_forms',     defaultForms);
export const saveForms     = (v: FormFile[])                     => dbSet('hn_forms',     v);
export const getElection   = (): Promise<ElectionAnnouncement[]> => dbGet('hn_election',  defaultElectionAnnouncements);
export const saveElection  = (v: ElectionAnnouncement[])         => dbSet('hn_election',  v);
export const getInquiries  = (): Promise<Inquiry[]>              => dbGet('hn_inquiries', []);
export const saveInquiries = (v: Inquiry[])                      => dbSet('hn_inquiries', v);
export const getBanners    = (): Promise<string[]>               => dbGet('hn_banners',   ['', '', '']);
export const saveBanners   = (v: string[])                       => dbSet('hn_banners',   v);
export const getLogo       = (): Promise<string>                 => dbGetStr('hn_logo');
export const saveLogo      = (v: string)                         => dbSetStr('hn_logo',      v);
export const getOrgImage      = (): Promise<string> => dbGetStr('hn_org_image');
export const saveOrgImage     = (v: string)         => dbSetStr('hn_org_image', v);
export const getLocationImage = (): Promise<string> => dbGetStr('hn_location_image');
export const saveLocationImage= (v: string)         => dbSetStr('hn_location_image', v);

export const getClubs = async (): Promise<ClubData[]> => {
  const data = await dbGet<ClubData[]>('hn_clubs', []);
  if (data.length === 0) {
    const seeded = (defaultClubs as any[]).map((c) => ({ ...c, instagram: c.instagram ?? '', imageUrl: '' })) as ClubData[];
    await dbSet('hn_clubs', seeded);
    return seeded;
  }
  return data;
};
export const saveClubs = (v: ClubData[]) => dbSet('hn_clubs', v);

export const getSiteContent = async (): Promise<SiteContent> => {
  const data = await dbGet<Partial<SiteContent>>('hn_content', {});
  return { ...defaultContent, ...data };
};
export const saveSiteContent = (v: SiteContent) => dbSet('hn_content', v);
