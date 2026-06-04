'use client';

import { useState, useEffect, useRef } from 'react';
import {
  getNotices, saveNotices, getMinutes, saveMinutes,
  getClubNews, saveClubNews, getPenalties, savePenalties,
  getForms, saveForms, getElection, saveElection,
  getInquiries, saveInquiries, getBanners, saveBanners,
  getLogo, saveLogo, getOrgImage, saveOrgImage, getClubs, saveClubs,
  getSiteContent, saveSiteContent,
  readFileAsBase64, downloadFile,
  type Notice, type Minutes, type ClubNews, type Penalty,
  type FormFile, type ElectionAnnouncement, type Inquiry,
  type ClubData, type SiteContent, type Attachment,
} from '@/lib/local-store';

const DEFAULT_PW = 'hongik2025admin';
const getStoredPW = () => (typeof window !== 'undefined' ? localStorage.getItem('hn_admin_pw') || DEFAULT_PW : DEFAULT_PW);
const saveStoredPW = (pw: string) => localStorage.setItem('hn_admin_pw', pw);
const CATEGORIES = ['공연분과', '스포츠분과', '레저분과', '종교분과', '사회분과', '학술분과', '전시분과'];
type Tab = 'about' | 'clubs' | 'news' | 'info' | 'election' | 'contact' | 'images' | 'settings';

/* ── UI helpers ── */
const cls = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(' ');

function Btn({ children, onClick, variant = 'dark', size = 'md', type = 'button', disabled }: any) {
  const v: Record<string, string> = {
    dark:   'bg-gray-800 text-white hover:bg-gray-700',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost:  'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    green:  'bg-green-500 text-white hover:bg-green-600',
    blue:   'bg-blue-600 text-white hover:bg-blue-700',
  };
  const s = size === 'sm' ? 'px-2.5 py-1.5 text-xs' : size === 'xs' ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm';
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={cls(v[variant], s, 'rounded-lg font-medium transition-colors disabled:opacity-40 flex-shrink-0')}>
      {children}
    </button>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-200';

function FileInput({ onUpload, current }: { onUpload: (a: Attachment) => void; current?: Attachment }) {
  const ref = useRef<HTMLInputElement>(null);
  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('파일 크기는 5MB 이하로 해주세요'); return; }
    const result = await readFileAsBase64(file);
    onUpload(result);
    if (ref.current) ref.current.value = '';
  };
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <label className="cursor-pointer px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors">
        📎 파일 첨부
        <input ref={ref} type="file" className="hidden" onChange={handle} />
      </label>
      {current && (
        <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1.5">
          <span className="text-xs text-blue-700 truncate max-w-48">{current.name}</span>
          <button type="button" onClick={() => downloadFile(current.url, current.name)} className="text-xs text-blue-500 hover:underline">다운로드</button>
        </div>
      )}
    </div>
  );
}

function ImageInput({ onUpload, current, onRemove }: { onUpload: (url: string) => void; current?: string; onRemove: () => void }) {
  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const r = await readFileAsBase64(file); onUpload(r.url);
  };
  return (
    <div>
      {current
        ? <div className="flex items-center gap-2">
            <img src={current} alt="" className="h-20 rounded-lg object-cover border border-gray-200" />
            <div className="flex flex-col gap-1">
              <label className="cursor-pointer px-2 py-1 border border-gray-300 rounded text-xs text-gray-600 hover:bg-gray-50">
                교체<input type="file" accept="image/*" className="hidden" onChange={handle} />
              </label>
              <button type="button" onClick={onRemove} className="px-2 py-1 border border-red-300 rounded text-xs text-red-500 hover:bg-red-50">삭제</button>
            </div>
          </div>
        : <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 border-2 border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-gray-400 hover:bg-gray-50 w-fit">
            🖼️ 이미지 업로드
            <input type="file" accept="image/*" className="hidden" onChange={handle} />
          </label>
      }
    </div>
  );
}

function DynList({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  const update = (i: number, v: string) => { const a = [...values]; a[i] = v; onChange(a); };
  const add = () => onChange([...values, '']);
  const remove = (i: number) => onChange(values.length > 1 ? values.filter((_, j) => j !== i) : ['']);
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      {values.map((v, i) => (
        <div key={i} className="flex gap-2 mb-1.5">
          <input value={v} onChange={(e) => update(i, e.target.value)} className={inputCls} />
          <button type="button" onClick={() => remove(i)} className="text-gray-400 hover:text-red-500 text-lg leading-none w-7">×</button>
        </div>
      ))}
      <button type="button" onClick={add} className="text-xs text-blue-600 hover:underline mt-0.5">+ 항목 추가</button>
    </div>
  );
}

function SavedBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return <span className="text-xs text-green-600 font-medium animate-pulse">✓ 저장됨</span>;
}

function EmptyState({ text }: { text: string }) {
  return <div className="text-center py-10 text-gray-400 text-sm">{text}</div>;
}

function ListRow({ title, sub, isPinned, onEdit, onDelete, attachment }:
  { title: string; sub?: string; isPinned?: boolean; onEdit: () => void; onDelete: () => void; attachment?: Attachment }) {
  return (
    <div className="flex items-start gap-3 px-5 py-3.5 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {isPinned && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">고정</span>}
          <span className="text-sm font-medium text-gray-800">{title}</span>
          {attachment && (
            <button onClick={() => downloadFile(attachment.url, attachment.name)} className="text-xs text-blue-500 hover:underline flex items-center gap-0.5">📎{attachment.name}</button>
          )}
        </div>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <div className="flex gap-1">
        <Btn size="sm" variant="ghost" onClick={onEdit}>수정</Btn>
        <Btn size="sm" variant="danger" onClick={onDelete}>삭제</Btn>
      </div>
    </div>
  );
}

function SubNav<T extends string>({ options, value, onChange }: { options: [T, string][]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-1 border border-gray-300 rounded-lg overflow-hidden w-fit mb-5">
      {options.map(([s, l]) => (
        <button key={s} onClick={() => onChange(s)}
          className={cls('px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap', value === s ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-50')}>
          {l}
        </button>
      ))}
    </div>
  );
}

/* ══════════ 탭: 총동아리연합회 ══════════ */
function AboutTab() {
  type Sub = 'intro' | 'work' | 'org' | 'location' | 'rules';
  const [sub, setSub] = useState<Sub>('intro');
  const [content, setContent] = useState<SiteContent | null>(null);
  const [orgImage, setOrgImage] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => { getSiteContent().then(setContent); getOrgImage().then(setOrgImage); }, []);
  if (!content) return null;

  const save = () => { saveSiteContent(content); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">총동아리연합회 관리</h2>
        {sub !== 'org' && <div className="flex items-center gap-3"><SavedBadge show={saved} /><Btn onClick={save}>저장</Btn></div>}
      </div>

      <SubNav<Sub>
        options={[['intro','소개'], ['work','주요업무'], ['org','조직도'], ['location','오시는 길'], ['rules','회칙']]}
        value={sub} onChange={setSub}
      />

      {sub === 'intro' && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <Field label="총동아리연합회 소개 글">
            <textarea value={content.aboutIntro} rows={8} onChange={(e) => setContent({ ...content, aboutIntro: e.target.value })}
              className={inputCls + ' resize-none'} placeholder="총동아리연합회 소개 내용을 입력하세요" />
          </Field>
        </div>
      )}

      {sub === 'work' && (
        <div className="space-y-3">
          {content.workItems.map((w, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex justify-between mb-2">
                <span className="text-xs font-bold text-gray-400">업무 {i + 1}</span>
                <button onClick={() => setContent({ ...content, workItems: content.workItems.filter((_, j) => j !== i) })} className="text-xs text-red-400 hover:text-red-600">삭제</button>
              </div>
              <input value={w.title} placeholder="제목" onChange={(e) => { const a = [...content.workItems]; a[i] = { ...a[i], title: e.target.value }; setContent({ ...content, workItems: a }); }} className={inputCls + ' mb-2'} />
              <input value={w.desc} placeholder="설명" onChange={(e) => { const a = [...content.workItems]; a[i] = { ...a[i], desc: e.target.value }; setContent({ ...content, workItems: a }); }} className={inputCls} />
            </div>
          ))}
          <button onClick={() => setContent({ ...content, workItems: [...content.workItems, { title: '', desc: '' }] })} className="text-xs text-blue-600 hover:underline">+ 업무 추가</button>
        </div>
      )}

      {sub === 'org' && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-1">조직도 이미지</h3>
          <p className="text-xs text-gray-400 mb-4">이미지를 업로드하면 조직도 페이지에 표시됩니다. 없으면 기본 조직도가 표시됩니다.</p>
          <div className="flex items-center gap-4">
            <div className="w-48 h-28 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50">
              {orgImage ? <img src={orgImage} alt="조직도" className="max-h-full max-w-full object-contain" /> : <span className="text-xs text-gray-400">이미지 없음</span>}
            </div>
            <div className="flex gap-2">
              <label className="cursor-pointer px-3 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
                {orgImage ? '교체' : '업로드'}
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0]; if (!file) return;
                  const r = await readFileAsBase64(file); setOrgImage(r.url); saveOrgImage(r.url);
                }} />
              </label>
              {orgImage && <button onClick={() => { setOrgImage(''); saveOrgImage(''); }} className="px-3 py-2 border border-red-300 text-red-500 text-sm rounded-lg hover:bg-red-50">삭제</button>}
            </div>
          </div>
        </div>
      )}

      {sub === 'location' && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          {([['locationAddress', '주소'], ['locationHours', '운영시간'], ['locationPhone', '전화번호'], ['locationEmail', '이메일']] as const).map(([k, l]) => (
            <Field key={k} label={l}>
              <input value={content[k]} onChange={(e) => setContent({ ...content, [k]: e.target.value })} className={inputCls} />
            </Field>
          ))}
        </div>
      )}

      {sub === 'rules' && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <Field label="회칙 내용">
            <textarea value={content.rules} rows={15} onChange={(e) => setContent({ ...content, rules: e.target.value })}
              className={inputCls + ' resize-none font-mono text-xs'} placeholder="회칙 내용을 입력하세요" />
          </Field>
        </div>
      )}

      {sub !== 'org' && (
        <button onClick={save}
          className={cls('w-full py-3 rounded-xl text-sm font-bold transition-all mt-4', saved ? 'bg-green-500 text-white' : 'bg-gray-800 text-white hover:bg-gray-700')}>
          {saved ? '✓ 저장 완료!' : '저장하기'}
        </button>
      )}
    </div>
  );
}

/* ══════════ 탭: 동아리 소개 ══════════ */
const emptyClub = (): Omit<ClubData, 'id'> => ({ name: '', category: '공연분과', room: '', president: '', contact: '', recruitPeriod: '', meetingSchedule: '', intro: '', desc: '', activities: [''], targets: [''], instagram: '', imageUrl: '' });

function ClubsTab() {
  const [clubs, setClubs] = useState<ClubData[]>([]);
  const [form, setForm] = useState(emptyClub());
  const [editId, setEditId] = useState<number | null>(null);
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState('전체');
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { getClubs().then(setClubs); }, []);
  const save = (v: ClubData[]) => { setClubs(v); saveClubs(v); };
  const updArr = (f: 'activities' | 'targets', i: number, v: string) => { const a = [...form[f]]; a[i] = v; setForm({ ...form, [f]: a }); };
  const addArr = (f: 'activities' | 'targets') => setForm({ ...form, [f]: [...form[f], ''] });
  const remArr = (f: 'activities' | 'targets', i: number) => setForm({ ...form, [f]: form[f].length > 1 ? form[f].filter((_, j) => j !== i) : [''] });
  const startEdit = (c: ClubData) => {
    setForm({ name: c.name, category: c.category, room: c.room, president: c.president, contact: c.contact, recruitPeriod: c.recruitPeriod, meetingSchedule: c.meetingSchedule, intro: c.intro, desc: c.desc, activities: c.activities.length ? c.activities : [''], targets: c.targets.length ? c.targets : [''], instagram: c.instagram, imageUrl: c.imageUrl || '' });
    setEditId(c.id); setShow(true); setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) save(clubs.map((c) => c.id === editId ? { ...c, ...form } : c));
    else { const id = clubs.length > 0 ? Math.max(...clubs.map(c => c.id)) + 1 : 1; save([...clubs, { id, ...form }]); }
    setForm(emptyClub()); setEditId(null); setShow(false);
  };

  const filtered = clubs.filter((c) => filter === '전체' || c.category === filter);
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">동아리 관리</h2>
        <Btn onClick={() => { setForm(emptyClub()); setEditId(null); setShow(true); setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth' }), 100); }}>+ 동아리 추가</Btn>
      </div>
      <div className="flex gap-1.5 flex-wrap mb-4">
        {['전체', ...CATEGORIES].map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={cls('px-3 py-1 rounded-full text-xs font-medium border transition-colors', filter === c ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500')}>{c}</button>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        {filtered.length === 0 && <EmptyState text="동아리가 없습니다" />}
        {filtered.map((c) => (
          <div key={c.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 last:border-0">
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-800 mr-2">{c.name}</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{c.category}</span>
              <p className="text-xs text-gray-400 mt-0.5">{c.room} · 회장: {c.president || '미입력'}</p>
            </div>
            <div className="flex gap-1">
              <Btn size="sm" variant="ghost" onClick={() => startEdit(c)}>수정</Btn>
              <Btn size="sm" variant="danger" onClick={() => { if (confirm('삭제?')) save(clubs.filter((x) => x.id !== c.id)); }}>삭제</Btn>
            </div>
          </div>
        ))}
      </div>
      {show && (
        <div ref={ref} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-800 mb-4">{editId !== null ? '동아리 수정' : '동아리 추가'}</h3>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="동아리명" required><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></Field>
              <Field label="분과">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls + ' bg-white'}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="동아리방"><input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} className={inputCls} placeholder="예: A동 101호" /></Field>
              <Field label="회장"><input value={form.president} onChange={(e) => setForm({ ...form, president: e.target.value })} className={inputCls} /></Field>
              <Field label="연락처"><input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className={inputCls} placeholder="010-0000-0000" /></Field>
              <Field label="인스타그램"><input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className={inputCls} placeholder="@계정명" /></Field>
              <Field label="모집 기간"><input value={form.recruitPeriod} onChange={(e) => setForm({ ...form, recruitPeriod: e.target.value })} className={inputCls} placeholder="예: 매 학기 초 모집" /></Field>
              <Field label="정기모임"><input value={form.meetingSchedule} onChange={(e) => setForm({ ...form, meetingSchedule: e.target.value })} className={inputCls} placeholder="예: 매주 화·목 18:00" /></Field>
            </div>
            <Field label="한 줄 소개"><input value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} className={inputCls} /></Field>
            <Field label="상세 소개"><textarea value={form.intro} onChange={(e) => setForm({ ...form, intro: e.target.value })} rows={4} className={inputCls + ' resize-none'} /></Field>
            <DynList label="활동 내용" values={form.activities} onChange={(v) => setForm({ ...form, activities: v })} />
            <DynList label="이런 분을 환영해요" values={form.targets} onChange={(v) => setForm({ ...form, targets: v })} />
            <Field label="소개 이미지">
              <ImageInput current={form.imageUrl} onUpload={(url) => setForm({ ...form, imageUrl: url })} onRemove={() => setForm({ ...form, imageUrl: '' })} />
            </Field>
            <div className="flex gap-2"><Btn type="submit">{editId !== null ? '수정 완료' : '추가 완료'}</Btn><Btn variant="ghost" onClick={() => { setShow(false); setEditId(null); }}>취소</Btn></div>
          </form>
        </div>
      )}
    </div>
  );
}

/* ══════════ 탭: 소식마당 ══════════ */
function NewsTab() {
  type Sub = 'notices' | 'minutes' | 'clubnews';
  const [sub, setSub] = useState<Sub>('notices');

  // 공지사항
  const [notices, setNotices] = useState<Notice[]>([]);
  const [nForm, setNForm] = useState({ title: '', content: '', isPinned: false, attachment: undefined as Attachment | undefined });
  const [nEditId, setNEditId] = useState<string | null>(null);
  const [nShow, setNShow] = useState(false);
  useEffect(() => { getNotices().then(setNotices); }, []);
  const saveN = (v: Notice[]) => { setNotices(v); saveNotices(v); };
  const submitN = (e: React.FormEvent) => {
    e.preventDefault();
    if (nEditId) saveN(notices.map((n) => n.id === nEditId ? { ...n, ...nForm } : n));
    else saveN([{ id: Date.now().toString(), ...nForm, createdAt: new Date().toISOString().slice(0, 10) }, ...notices]);
    setNForm({ title: '', content: '', isPinned: false, attachment: undefined }); setNEditId(null); setNShow(false);
  };

  // 회의록
  const [minutes, setMinutes] = useState<Minutes[]>([]);
  const [mForm, setMForm] = useState({ title: '', date: '', attendees: '', attachment: undefined as Attachment | undefined });
  const [mEditId, setMEditId] = useState<string | null>(null);
  const [mShow, setMShow] = useState(false);
  useEffect(() => { getMinutes().then(setMinutes); }, []);
  const saveM = (v: Minutes[]) => { setMinutes(v); saveMinutes(v); };
  const submitM = (e: React.FormEvent) => {
    e.preventDefault();
    if (mEditId) saveM(minutes.map((m) => m.id === mEditId ? { ...m, ...mForm } : m));
    else saveM([{ id: Date.now().toString(), ...mForm }, ...minutes]);
    setMForm({ title: '', date: '', attendees: '', attachment: undefined }); setMEditId(null); setMShow(false);
  };

  // 동아리 소식
  const [clubNews, setClubNews] = useState<ClubNews[]>([]);
  const [cnForm, setCnForm] = useState({ club: '', category: '공연분과', title: '', content: '', date: new Date().toISOString().slice(0, 10), imageUrl: '' });
  const [cnEditId, setCnEditId] = useState<string | null>(null);
  const [cnShow, setCnShow] = useState(false);
  useEffect(() => { getClubNews().then(setClubNews); }, []);
  const saveCN = (v: ClubNews[]) => { setClubNews(v); saveClubNews(v); };
  const submitCN = (e: React.FormEvent) => {
    e.preventDefault();
    if (cnEditId) saveCN(clubNews.map((n) => n.id === cnEditId ? { ...n, ...cnForm } : n));
    else saveCN([{ id: Date.now().toString(), ...cnForm }, ...clubNews]);
    setCnForm({ club: '', category: '공연분과', title: '', content: '', date: new Date().toISOString().slice(0, 10), imageUrl: '' }); setCnEditId(null); setCnShow(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">소식마당 관리</h2>
      </div>
      <SubNav<Sub>
        options={[['notices','공지사항'], ['minutes','회의록'], ['clubnews','동아리 소식']]}
        value={sub} onChange={setSub}
      />

      {sub === 'notices' && (
        <>
          <div className="flex justify-end mb-3">
            <Btn onClick={() => { setNForm({ title: '', content: '', isPinned: false, attachment: undefined }); setNEditId(null); setNShow(true); }}>+ 새 공지 작성</Btn>
          </div>
          {nShow && (
            <form onSubmit={submitN} className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-4 space-y-3">
              <h3 className="font-semibold text-gray-700">{nEditId ? '공지 수정' : '새 공지 작성'}</h3>
              <Field label="제목" required><input required value={nForm.title} onChange={(e) => setNForm({ ...nForm, title: e.target.value })} className={inputCls} placeholder="공지사항 제목" /></Field>
              <Field label="내용"><textarea value={nForm.content} onChange={(e) => setNForm({ ...nForm, content: e.target.value })} rows={5} className={inputCls + ' resize-none'} /></Field>
              <FileInput current={nForm.attachment} onUpload={(a) => setNForm({ ...nForm, attachment: a })} />
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input type="checkbox" checked={nForm.isPinned} onChange={(e) => setNForm({ ...nForm, isPinned: e.target.checked })} className="w-4 h-4" />
                상단 고정
              </label>
              <div className="flex gap-2"><Btn type="submit">{nEditId ? '수정 완료' : '등록'}</Btn><Btn variant="ghost" onClick={() => setNShow(false)}>취소</Btn></div>
            </form>
          )}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {notices.length === 0 && <EmptyState text="공지사항이 없습니다" />}
            {[...notices.filter(n => n.isPinned), ...notices.filter(n => !n.isPinned)].map((n) => (
              <ListRow key={n.id} title={n.title} sub={n.createdAt} isPinned={n.isPinned} attachment={n.attachment}
                onEdit={() => { setNForm({ title: n.title, content: n.content, isPinned: n.isPinned, attachment: n.attachment }); setNEditId(n.id); setNShow(true); }}
                onDelete={() => { if (confirm('삭제할까요?')) saveN(notices.filter((x) => x.id !== n.id)); }} />
            ))}
          </div>
        </>
      )}

      {sub === 'minutes' && (
        <>
          <div className="flex justify-end mb-3">
            <Btn onClick={() => { setMForm({ title: '', date: '', attendees: '', attachment: undefined }); setMEditId(null); setMShow(true); }}>+ 회의록 추가</Btn>
          </div>
          {mShow && (
            <form onSubmit={submitM} className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-4 space-y-3">
              <h3 className="font-semibold text-gray-700">{mEditId ? '회의록 수정' : '회의록 추가'}</h3>
              <Field label="회의 제목" required><input required value={mForm.title} onChange={(e) => setMForm({ ...mForm, title: e.target.value })} className={inputCls} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="날짜" required><input required type="date" value={mForm.date} onChange={(e) => setMForm({ ...mForm, date: e.target.value })} className={inputCls} /></Field>
                <Field label="참석 인원"><input value={mForm.attendees} onChange={(e) => setMForm({ ...mForm, attendees: e.target.value })} className={inputCls} placeholder="예: 15명" /></Field>
              </div>
              <Field label="회의록 파일 (PDF)"><FileInput current={mForm.attachment} onUpload={(a) => setMForm({ ...mForm, attachment: a })} /></Field>
              <div className="flex gap-2"><Btn type="submit">{mEditId ? '수정 완료' : '등록'}</Btn><Btn variant="ghost" onClick={() => setMShow(false)}>취소</Btn></div>
            </form>
          )}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {minutes.length === 0 && <EmptyState text="등록된 회의록이 없습니다" />}
            {minutes.map((m) => (
              <ListRow key={m.id} title={m.title} sub={`${m.date}${m.attendees ? ' · ' + m.attendees : ''}`} attachment={m.attachment}
                onEdit={() => { setMForm({ title: m.title, date: m.date, attendees: m.attendees, attachment: m.attachment }); setMEditId(m.id); setMShow(true); }}
                onDelete={() => { if (confirm('삭제?')) saveM(minutes.filter((x) => x.id !== m.id)); }} />
            ))}
          </div>
        </>
      )}

      {sub === 'clubnews' && (
        <>
          <div className="flex justify-end mb-3">
            <Btn onClick={() => { setCnForm({ club: '', category: '공연분과', title: '', content: '', date: new Date().toISOString().slice(0, 10), imageUrl: '' }); setCnEditId(null); setCnShow(true); }}>+ 동아리 소식 추가</Btn>
          </div>
          {cnShow && (
            <form onSubmit={submitCN} className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-4 space-y-3">
              <h3 className="font-semibold text-gray-700">{cnEditId ? '소식 수정' : '소식 추가'}</h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="동아리명" required><input required value={cnForm.club} onChange={(e) => setCnForm({ ...cnForm, club: e.target.value })} className={inputCls} /></Field>
                <Field label="분과">
                  <select value={cnForm.category} onChange={(e) => setCnForm({ ...cnForm, category: e.target.value })} className={inputCls + ' bg-white'}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="제목" required><input required value={cnForm.title} onChange={(e) => setCnForm({ ...cnForm, title: e.target.value })} className={inputCls} /></Field>
              <Field label="내용"><textarea value={cnForm.content} onChange={(e) => setCnForm({ ...cnForm, content: e.target.value })} rows={4} className={inputCls + ' resize-none'} /></Field>
              <Field label="날짜"><input type="date" value={cnForm.date} onChange={(e) => setCnForm({ ...cnForm, date: e.target.value })} className={inputCls} /></Field>
              <Field label="사진"><ImageInput current={cnForm.imageUrl} onUpload={(url) => setCnForm({ ...cnForm, imageUrl: url })} onRemove={() => setCnForm({ ...cnForm, imageUrl: '' })} /></Field>
              <div className="flex gap-2"><Btn type="submit">{cnEditId ? '수정 완료' : '등록'}</Btn><Btn variant="ghost" onClick={() => setCnShow(false)}>취소</Btn></div>
            </form>
          )}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {clubNews.length === 0 && <EmptyState text="등록된 동아리 소식이 없습니다" />}
            {clubNews.map((n) => (
              <ListRow key={n.id} title={`[${n.club}] ${n.title}`} sub={`${n.category} · ${n.date}`}
                onEdit={() => { setCnForm({ club: n.club, category: n.category, title: n.title, content: n.content, date: n.date, imageUrl: n.imageUrl || '' }); setCnEditId(n.id); setCnShow(true); }}
                onDelete={() => { if (confirm('삭제?')) saveCN(clubNews.filter((x) => x.id !== n.id)); }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ══════════ 탭: 정보마당 ══════════ */
function InfoTab() {
  type Sub = 'forms' | 'penalty';
  const [sub, setSub] = useState<Sub>('forms');

  const [forms, setForms] = useState<FormFile[]>([]);
  const [fForm, setFForm] = useState({ name: '', description: '', fileType: 'HWP', updatedAt: new Date().toISOString().slice(0, 7), attachment: undefined as Attachment | undefined });
  const [fEditId, setFEditId] = useState<string | null>(null);
  const [fShow, setFShow] = useState(false);
  useEffect(() => { getForms().then(setForms); }, []);
  const saveF = (v: FormFile[]) => { setForms(v); saveForms(v); };
  const submitF = (e: React.FormEvent) => {
    e.preventDefault();
    if (fEditId) saveF(forms.map((f) => f.id === fEditId ? { ...f, ...fForm } : f));
    else saveF([...forms, { id: Date.now().toString(), ...fForm }]);
    setFForm({ name: '', description: '', fileType: 'HWP', updatedAt: new Date().toISOString().slice(0, 7), attachment: undefined }); setFEditId(null); setFShow(false);
  };

  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [pForm, setPForm] = useState({ club: '', reason: '', points: 1, date: new Date().toISOString().slice(0, 10) });
  const [pEditId, setPEditId] = useState<string | null>(null);
  const [pShow, setPShow] = useState(false);
  useEffect(() => { getPenalties().then(setPenalties); }, []);
  const saveP = (v: Penalty[]) => { setPenalties(v); savePenalties(v); };
  const submitP = (e: React.FormEvent) => {
    e.preventDefault();
    if (pEditId) saveP(penalties.map((p) => p.id === pEditId ? { ...p, ...pForm } : p));
    else saveP([{ id: Date.now().toString(), ...pForm }, ...penalties]);
    setPForm({ club: '', reason: '', points: 1, date: new Date().toISOString().slice(0, 10) }); setPEditId(null); setPShow(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">정보마당 관리</h2>
      </div>
      <SubNav<Sub> options={[['forms','양식 파일'], ['penalty','벌점 현황']]} value={sub} onChange={setSub} />

      {sub === 'forms' && (
        <>
          <div className="flex justify-end mb-3"><Btn onClick={() => { setFForm({ name: '', description: '', fileType: 'HWP', updatedAt: new Date().toISOString().slice(0, 7), attachment: undefined }); setFEditId(null); setFShow(true); }}>+ 양식 추가</Btn></div>
          {fShow && (
            <form onSubmit={submitF} className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-4 space-y-3">
              <h3 className="font-semibold text-gray-700">{fEditId ? '양식 수정' : '양식 추가'}</h3>
              <Field label="양식명" required><input required value={fForm.name} onChange={(e) => setFForm({ ...fForm, name: e.target.value })} className={inputCls} /></Field>
              <Field label="설명"><input value={fForm.description} onChange={(e) => setFForm({ ...fForm, description: e.target.value })} className={inputCls} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="파일 형식"><input value={fForm.fileType} onChange={(e) => setFForm({ ...fForm, fileType: e.target.value })} className={inputCls} placeholder="HWP, PDF 등" /></Field>
                <Field label="업데이트 날짜"><input value={fForm.updatedAt} onChange={(e) => setFForm({ ...fForm, updatedAt: e.target.value })} className={inputCls} /></Field>
              </div>
              <Field label="파일 업로드"><FileInput current={fForm.attachment} onUpload={(a) => setFForm({ ...fForm, attachment: a })} /></Field>
              <div className="flex gap-2"><Btn type="submit">{fEditId ? '수정 완료' : '추가'}</Btn><Btn variant="ghost" onClick={() => setFShow(false)}>취소</Btn></div>
            </form>
          )}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {forms.length === 0 && <EmptyState text="양식이 없습니다" />}
            {forms.map((f) => (
              <ListRow key={f.id} title={f.name} sub={`${f.description} · ${f.fileType} · ${f.updatedAt}`} attachment={f.attachment}
                onEdit={() => { setFForm({ name: f.name, description: f.description, fileType: f.fileType, updatedAt: f.updatedAt, attachment: f.attachment }); setFEditId(f.id); setFShow(true); }}
                onDelete={() => { if (confirm('삭제?')) saveF(forms.filter((x) => x.id !== f.id)); }} />
            ))}
          </div>
        </>
      )}

      {sub === 'penalty' && (
        <>
          <div className="flex justify-end mb-3"><Btn onClick={() => { setPForm({ club: '', reason: '', points: 1, date: new Date().toISOString().slice(0, 10) }); setPEditId(null); setPShow(true); }}>+ 벌점 추가</Btn></div>
          {pShow && (
            <form onSubmit={submitP} className="bg-red-50 border border-red-200 rounded-xl p-5 mb-4 space-y-3">
              <h3 className="font-semibold text-gray-700">{pEditId ? '벌점 수정' : '벌점 추가'}</h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="동아리명" required><input required value={pForm.club} onChange={(e) => setPForm({ ...pForm, club: e.target.value })} className={inputCls} /></Field>
                <Field label="점수" required><input required type="number" min={1} value={pForm.points} onChange={(e) => setPForm({ ...pForm, points: Number(e.target.value) })} className={inputCls} /></Field>
              </div>
              <Field label="사유" required><input required value={pForm.reason} onChange={(e) => setPForm({ ...pForm, reason: e.target.value })} className={inputCls} /></Field>
              <Field label="날짜"><input type="date" value={pForm.date} onChange={(e) => setPForm({ ...pForm, date: e.target.value })} className={inputCls} /></Field>
              <div className="flex gap-2"><Btn type="submit">{pEditId ? '수정 완료' : '추가'}</Btn><Btn variant="ghost" onClick={() => setPShow(false)}>취소</Btn></div>
            </form>
          )}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {penalties.length === 0 && <EmptyState text="벌점 내역이 없습니다" />}
            {penalties.map((p) => (
              <ListRow key={p.id} title={`${p.club} — ${p.reason}`} sub={`${p.date} · +${p.points}점`}
                onEdit={() => { setPForm({ club: p.club, reason: p.reason, points: p.points, date: p.date }); setPEditId(p.id); setPShow(true); }}
                onDelete={() => { if (confirm('삭제?')) saveP(penalties.filter((x) => x.id !== p.id)); }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ══════════ 탭: 선거관리위원회 ══════════ */
function ElectionTab() {
  type Sub = 'intro' | 'announce';
  const [sub, setSub] = useState<Sub>('intro');
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => { getSiteContent().then(setContent); }, []);

  const [election, setElection] = useState<ElectionAnnouncement[]>([]);
  const [eForm, setEForm] = useState({ title: '', content: '', date: new Date().toISOString().slice(0, 10), status: '예정' as '예정' | '진행중' | '완료', attachment: undefined as Attachment | undefined });
  const [eEditId, setEEditId] = useState<string | null>(null);
  const [eShow, setEShow] = useState(false);
  useEffect(() => { getElection().then(setElection); }, []);
  const saveE = (v: ElectionAnnouncement[]) => { setElection(v); saveElection(v); };
  const submitE = (e: React.FormEvent) => {
    e.preventDefault();
    if (eEditId) saveE(election.map((x) => x.id === eEditId ? { ...x, ...eForm } : x));
    else saveE([{ id: Date.now().toString(), ...eForm }, ...election]);
    setEForm({ title: '', content: '', date: new Date().toISOString().slice(0, 10), status: '예정', attachment: undefined }); setEEditId(null); setEShow(false);
  };

  if (!content) return null;
  const save = () => { saveSiteContent(content); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">선거관리위원회 관리</h2>
      </div>
      <SubNav<Sub> options={[['intro','소개'], ['announce','선거 공고']]} value={sub} onChange={setSub} />

      {sub === 'intro' && (
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
            <Field label="선거관리위원회 소개 글">
              <textarea value={content.electionIntro} rows={8} onChange={(e) => setContent({ ...content, electionIntro: e.target.value })} className={inputCls + ' resize-none'} />
            </Field>
          </div>
          <div className="flex items-center gap-3">
            <SavedBadge show={saved} />
            <Btn onClick={save}>저장</Btn>
          </div>
        </div>
      )}

      {sub === 'announce' && (
        <>
          <div className="flex justify-end mb-3"><Btn onClick={() => { setEForm({ title: '', content: '', date: new Date().toISOString().slice(0, 10), status: '예정', attachment: undefined }); setEEditId(null); setEShow(true); }}>+ 공고 추가</Btn></div>
          {eShow && (
            <form onSubmit={submitE} className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-4 space-y-3">
              <h3 className="font-semibold text-gray-700">{eEditId ? '공고 수정' : '공고 추가'}</h3>
              <Field label="제목" required><input required value={eForm.title} onChange={(e) => setEForm({ ...eForm, title: e.target.value })} className={inputCls} /></Field>
              <Field label="내용"><textarea value={eForm.content} onChange={(e) => setEForm({ ...eForm, content: e.target.value })} rows={4} className={inputCls + ' resize-none'} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="날짜"><input type="date" value={eForm.date} onChange={(e) => setEForm({ ...eForm, date: e.target.value })} className={inputCls} /></Field>
                <Field label="상태">
                  <select value={eForm.status} onChange={(e) => setEForm({ ...eForm, status: e.target.value as any })} className={inputCls + ' bg-white'}>
                    <option>예정</option><option>진행중</option><option>완료</option>
                  </select>
                </Field>
              </div>
              <Field label="첨부 파일"><FileInput current={eForm.attachment} onUpload={(a) => setEForm({ ...eForm, attachment: a })} /></Field>
              <div className="flex gap-2"><Btn type="submit">{eEditId ? '수정 완료' : '등록'}</Btn><Btn variant="ghost" onClick={() => setEShow(false)}>취소</Btn></div>
            </form>
          )}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {election.length === 0 && <EmptyState text="선거 공고가 없습니다" />}
            {election.map((a) => (
              <ListRow key={a.id} title={a.title} sub={`${a.date} · ${a.status}`} attachment={a.attachment}
                onEdit={() => { setEForm({ title: a.title, content: a.content, date: a.date, status: a.status, attachment: a.attachment }); setEEditId(a.id); setEShow(true); }}
                onDelete={() => { if (confirm('삭제?')) saveE(election.filter((x) => x.id !== a.id)); }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ══════════ 탭: 문의사항 ══════════ */
function ContactTab() {
  type Sub = 'faq' | 'inquiries';
  const [sub, setSub] = useState<Sub>('faq');
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => { getSiteContent().then(setContent); }, []);

  const [list, setList] = useState<Inquiry[]>([]);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
  useEffect(() => { getInquiries().then(setList); }, []);
  const saveI = (v: Inquiry[]) => { setList(v); saveInquiries(v); };
  const confirmI = (id: string) => { const v = list.map((i) => i.id === id ? { ...i, status: 'confirmed' as const } : i); saveI(v); if (selected?.id === id) setSelected({ ...selected, status: 'confirmed' }); };
  const delI = (id: string) => { if (window.confirm('삭제?')) { saveI(list.filter((i) => i.id !== id)); if (selected?.id === id) setSelected(null); } };
  const filtered = list.filter((i) => filter === 'all' || i.status === filter);
  const pending = list.filter((i) => i.status === 'pending').length;

  if (!content) return null;
  const save = () => { saveSiteContent(content); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          문의사항 관리
          {sub === 'inquiries' && pending > 0 && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">미확인 {pending}</span>}
        </h2>
      </div>
      <SubNav<Sub>
        options={[['faq', 'FAQ'], ['inquiries', pending > 0 ? `문의 확인 (${pending})` : '문의 확인']]}
        value={sub} onChange={setSub}
      />

      {sub === 'faq' && (
        <div>
          <div className="space-y-3 mb-4">
            {content.faqs.map((f, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400">Q{i + 1}</span>
                  <button onClick={() => setContent({ ...content, faqs: content.faqs.filter((_, j) => j !== i) })} className="text-xs text-red-400">삭제</button>
                </div>
                <input value={f.q} placeholder="질문" onChange={(e) => { const a = [...content.faqs]; a[i] = { ...a[i], q: e.target.value }; setContent({ ...content, faqs: a }); }} className={inputCls + ' mb-2'} />
                <textarea value={f.a} placeholder="답변" rows={3} onChange={(e) => { const a = [...content.faqs]; a[i] = { ...a[i], a: e.target.value }; setContent({ ...content, faqs: a }); }} className={inputCls + ' resize-none'} />
              </div>
            ))}
          </div>
          <button onClick={() => setContent({ ...content, faqs: [...content.faqs, { q: '', a: '' }] })} className="text-xs text-blue-600 hover:underline mb-4 block">+ FAQ 추가</button>
          <div className="flex items-center gap-3">
            <SavedBadge show={saved} />
            <Btn onClick={save}>저장</Btn>
          </div>
        </div>
      )}

      {sub === 'inquiries' && (
        <div>
          <div className="flex gap-1 mb-4">
            {(['all', 'pending', 'confirmed'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={cls('px-3 py-1.5 text-xs rounded-lg font-medium border transition-colors', filter === f ? 'bg-gray-800 text-white border-gray-800' : 'bg-white border-gray-300 text-gray-600 hover:border-gray-500')}>
                {f === 'all' ? '전체' : f === 'pending' ? '미확인' : '확인완료'}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              {filtered.length === 0 && <div className="bg-white rounded-xl border border-gray-200 text-center py-10 text-gray-400 text-sm">해당하는 문의가 없습니다</div>}
              {filtered.map((inq) => (
                <div key={inq.id} onClick={() => setSelected(inq)}
                  className={cls('bg-white rounded-xl border p-4 cursor-pointer hover:shadow-sm transition-all', selected?.id === inq.id ? 'border-gray-800' : 'border-gray-200')}>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-gray-800 text-sm">{inq.name}</span>
                    <span className={cls('text-xs px-1.5 py-0.5 rounded-full font-medium', inq.status === 'pending' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600')}>{inq.status === 'pending' ? '미확인' : '확인완료'}</span>
                  </div>
                  <p className="text-xs text-gray-500">{inq.category} · {inq.createdAt}</p>
                  <p className="text-xs text-gray-600 mt-1 truncate">{inq.message}</p>
                </div>
              ))}
            </div>
            {selected && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 h-fit">
                <div className="flex justify-between mb-4"><h3 className="font-semibold text-gray-800">문의 상세</h3><button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button></div>
                <div className="space-y-2.5 text-sm mb-4">
                  {[['이름', selected.name], ['이메일', selected.email], ['연락처', selected.contact || '미입력'], ['유형', selected.category], ['접수일', selected.createdAt]].map(([l, v]) => (
                    <div key={l} className="flex gap-3"><span className="text-gray-500 w-14 flex-shrink-0">{l}</span><span className="text-gray-800">{v}</span></div>
                  ))}
                  <div><p className="text-gray-500 mb-1">내용</p><p className="text-gray-800 bg-gray-50 rounded-lg p-3 text-sm leading-relaxed">{selected.message}</p></div>
                </div>
                <div className="flex gap-2">
                  {selected.status === 'pending' && <Btn variant="blue" onClick={() => confirmI(selected.id)}>확인 완료</Btn>}
                  <Btn variant="danger" onClick={() => delI(selected.id)}>삭제</Btn>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════ 탭: 이미지 ══════════ */
function ImagesTab() {
  const [banners, setBanners] = useState(['', '', '']);
  const [logo, setLogo] = useState('');
  useEffect(() => { getBanners().then(setBanners); getLogo().then(setLogo); }, []);
  const handleBanner = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const r = await readFileAsBase64(file); const u = [...banners]; u[idx] = r.url; setBanners(u); saveBanners(u);
  };
  const removeBanner = (idx: number) => { const u = [...banners]; u[idx] = ''; setBanners(u); saveBanners(u); };
  const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const r = await readFileAsBase64(file); setLogo(r.url); saveLogo(r.url);
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-5">이미지 관리</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <h3 className="font-semibold text-gray-700 mb-1">메인 배너 이미지</h3>
        <p className="text-xs text-gray-400 mb-4">권장: 1200×400px 이상 JPG/PNG · 최대 5MB</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {banners.map((b, i) => (
            <div key={i} className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden" style={{ minHeight: '120px' }}>
              {b ? (
                <div className="relative">
                  <img src={b} alt="" className="w-full h-28 object-cover" />
                  <div className="absolute top-1.5 right-1.5 flex gap-1">
                    <label className="bg-white/90 text-gray-700 text-xs px-2 py-1 rounded cursor-pointer">교체<input type="file" accept="image/*" className="hidden" onChange={(e) => handleBanner(i, e)} /></label>
                    <button onClick={() => removeBanner(i)} className="bg-red-500 text-white text-xs px-2 py-1 rounded">삭제</button>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-xs py-1 text-center">배너 {i + 1}</div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-28 cursor-pointer hover:bg-gray-50">
                  <span className="text-2xl mb-1">+</span>
                  <span className="text-xs text-gray-400">배너 {i + 1}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBanner(i, e)} />
                </label>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-700 mb-1">로고</h3>
        <p className="text-xs text-gray-400 mb-4">권장: PNG 투명 배경 · 가로 200px 이상</p>
        <div className="flex items-center gap-4">
          <div className="w-40 h-16 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden">
            {logo ? <img src={logo} alt="로고" className="max-h-12 max-w-full object-contain" /> : <span className="text-xs text-gray-400">로고 없음</span>}
          </div>
          <div className="flex gap-2">
            <label className="cursor-pointer px-3 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
              {logo ? '로고 교체' : '로고 업로드'}<input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
            </label>
            {logo && <button onClick={() => { setLogo(''); saveLogo(''); }} className="px-3 py-2 border border-red-300 text-red-500 text-sm rounded-lg hover:bg-red-50">삭제</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 비밀번호 변경 ── */
function PwChangeForm() {
  const [cur, setCur] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cur !== getStoredPW()) { setMsg({ text: '현재 비밀번호가 올바르지 않습니다.', ok: false }); return; }
    if (next.length < 6) { setMsg({ text: '새 비밀번호는 6자 이상이어야 합니다.', ok: false }); return; }
    if (next !== confirm) { setMsg({ text: '새 비밀번호가 일치하지 않습니다.', ok: false }); return; }
    saveStoredPW(next); setCur(''); setNext(''); setConfirm('');
    setMsg({ text: '✓ 비밀번호가 변경되었습니다.', ok: true });
    setTimeout(() => setMsg(null), 3000);
  };
  return (
    <form onSubmit={submit} className="space-y-3 max-w-sm">
      <Field label="현재 비밀번호"><input type="password" value={cur} onChange={(e) => setCur(e.target.value)} required className={inputCls} placeholder="현재 비밀번호 입력" /></Field>
      <Field label="새 비밀번호"><input type="password" value={next} onChange={(e) => setNext(e.target.value)} required className={inputCls} placeholder="6자 이상" /></Field>
      <Field label="새 비밀번호 확인"><input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className={inputCls} placeholder="동일하게 입력" /></Field>
      {msg && <p className={`text-sm font-medium ${msg.ok ? 'text-green-600' : 'text-red-500'}`}>{msg.text}</p>}
      <Btn type="submit">비밀번호 변경</Btn>
    </form>
  );
}

/* ══════════ 탭: 설정 ══════════ */
function SettingsTab() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => { getSiteContent().then(setContent); }, []);
  if (!content) return null;
  const save = () => { saveSiteContent(content); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-800">설정</h2>
        <div className="flex items-center gap-3"><SavedBadge show={saved} /><Btn onClick={save}>저장</Btn></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <h3 className="font-semibold text-gray-700 border-b border-gray-100 pb-3 mb-4">메인 배너 텍스트</h3>
        {content.bannerSlides.map((s, i) => (
          <div key={i} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-bold text-gray-400 mb-2">배너 {i + 1}</p>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-500">제목</label>
                <input value={s.title} onChange={(e) => { const a = [...content.bannerSlides]; a[i] = { ...a[i], title: e.target.value }; setContent({ ...content, bannerSlides: a }); }} className={inputCls + ' mt-0.5'} />
              </div>
              <div>
                <label className="text-xs text-gray-500">부제목</label>
                <input value={s.subtitle} onChange={(e) => { const a = [...content.bannerSlides]; a[i] = { ...a[i], subtitle: e.target.value }; setContent({ ...content, bannerSlides: a }); }} className={inputCls + ' mt-0.5'} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4 space-y-4">
        <h3 className="font-semibold text-gray-700 border-b border-gray-100 pb-3">소셜 미디어 링크</h3>
        <Field label="인스타그램 URL">
          <input value={content.instagramUrl} onChange={(e) => setContent({ ...content, instagramUrl: e.target.value })} className={inputCls} placeholder="https://instagram.com/계정명" />
          <p className="text-xs text-gray-400 mt-1">헤더의 인스타 아이콘 클릭 시 이동할 주소</p>
        </Field>
        <Field label="카카오톡 채널/오픈채팅 URL">
          <input value={content.kakaoUrl} onChange={(e) => setContent({ ...content, kakaoUrl: e.target.value })} className={inputCls} placeholder="https://open.kakao.com/..." />
          <p className="text-xs text-gray-400 mt-1">헤더의 카카오 아이콘 클릭 시 이동할 주소</p>
        </Field>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-700 border-b border-gray-100 pb-3">관리자 비밀번호 변경</h3>
        <PwChangeForm />
      </div>

      <button onClick={save}
        className={cls('w-full py-3 rounded-xl text-sm font-bold transition-all mt-4', saved ? 'bg-green-500 text-white' : 'bg-gray-800 text-white hover:bg-gray-700')}>
        {saved ? '✓ 저장 완료!' : '전체 저장하기'}
      </button>
    </div>
  );
}

/* ══════════ 메인 ══════════ */
const TIMEOUT_MS = 10 * 60 * 1000; // 10분

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('about');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logout = () => { setLoggedIn(false); localStorage.removeItem('admin_session'); setPassword(''); };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, TIMEOUT_MS);
  };

  useEffect(() => {
    if (localStorage.getItem('admin_session') === 'true') setLoggedIn(true);
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [loggedIn]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === getStoredPW()) { setLoggedIn(true); localStorage.setItem('admin_session', 'true'); }
    else setError('비밀번호가 올바르지 않습니다.');
  };

  if (!loggedIn) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800">관리자 로그인</h1>
          <p className="text-gray-400 text-sm mt-1">총동아리연합회 관리자 페이지</p>
        </div>
        <form onSubmit={login} className="space-y-4">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" required autoFocus className={inputCls} style={{ padding: '0.75rem 1rem' }} />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">로그인</button>
        </form>
      </div>
    </div>
  );

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'about',    label: '총동아리연합회', icon: '🏫' },
    { key: 'clubs',    label: '동아리 소개',    icon: '🎯' },
    { key: 'news',     label: '소식마당',       icon: '📢' },
    { key: 'info',     label: '정보마당',       icon: '📁' },
    { key: 'election', label: '선거관리위원회', icon: '🗳️' },
    { key: 'contact',  label: '문의사항',       icon: '✉️' },
    { key: 'images',   label: '이미지',         icon: '🖼️' },
    { key: 'settings', label: '설정',           icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center"><span className="text-gray-800 font-black text-sm">홍</span></div>
          <div className="text-white"><div className="font-bold text-sm">관리자 페이지</div><div className="text-gray-400 text-xs">총동아리연합회</div></div>
        </div>
        <button onClick={logout} className="text-gray-400 hover:text-white text-sm transition-colors">로그아웃</button>
      </div>

      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex min-w-max px-4">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cls('px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap', tab === t.key ? 'border-gray-800 text-gray-800' : 'border-transparent text-gray-500 hover:text-gray-700')}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {tab === 'about'    && <AboutTab />}
        {tab === 'clubs'    && <ClubsTab />}
        {tab === 'news'     && <NewsTab />}
        {tab === 'info'     && <InfoTab />}
        {tab === 'election' && <ElectionTab />}
        {tab === 'contact'  && <ContactTab />}
        {tab === 'images'   && <ImagesTab />}
        {tab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}
