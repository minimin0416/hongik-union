# 홍익대학교 총동아리연합회 홈페이지 프로젝트

## 기본 정보
- 학교: 홍익대학교
- 단체: 제39대 총동아리연합회 Union
- 프레임워크: Next.js 16 + Tailwind CSS
- 색상: 파란색 계열 → 확정 후 globals.css에서 수정

## 개발 서버 실행
```
cd c:\Users\hkm17\Desktop\code\landingpage\hongik-union
npm run dev
```
→ http://localhost:3000

## 관리자 페이지
- URL: http://localhost:3000/admin
- 기본 비밀번호: hongik2025admin
- 비밀번호는 관리자 페이지 → ⚙️ 설정 탭에서 변경 가능
- 비밀번호 분실 시: 브라우저 개발자도구 → Application → localStorage → hn_admin_pw 삭제

## 관리자 탭 기능
| 탭 | 기능 |
|---|---|
| 📢 공지사항 | 작성/수정/삭제 + 파일 첨부 + 고정 |
| 📰 소식마당 | 회의록(PDF첨부) + 동아리소식(사진) |
| 📁 정보마당 | 양식파일 업로드 + 벌점 + 선거 공고 |
| 🏫 동아리 | 동아리 전체 정보 + 사진 |
| ✏️ 페이지 내용 | 배너텍스트, 소개글, 회칙, FAQ 등 |
| 🖼️ 이미지 | 배너 3장 + 로고 |
| ⚙️ 설정 | 인스타·카카오 링크, 비밀번호 변경 |
| ✉️ 문의 | 접수된 문의 확인 |

## 완성된 페이지 (26개)
- / 메인 (배너 슬라이더, 달력, 공지, 오시는 길)
- /about/intro, /work, /org, /location, /rules
- /clubs/central (분과 필터+검색), /clubs/location
- /clubs/central/[id] (동아리 상세 페이지)
- /news/notices, /news/minutes, /news/clubs
- /info/rules, /forms, /activity-cert, /club-cert, /penalty
- /election/intro, /election/announce
- /contact/faq, /contact/ask
- /admin

## 데이터 저장 방식 (현재)
- localStorage 기반 (같은 브라우저에서만 유지)
- 파일 첨부: base64로 저장, 최대 5MB
- 추후 Supabase 연결하면 어디서든 접근 가능

## 남은 할 일
- [ ] 배너/로고 실제 이미지 업로드 (관리자 → 이미지)
- [ ] 인스타·카카오 링크 설정 (관리자 → 설정)
- [ ] 동아리 정보 실제로 입력 (관리자 → 동아리)
- [ ] Supabase 연동 (데이터 영구 저장, 여러 기기 접근)
- [ ] GitHub → Vercel 배포 (웹에서 접속 가능하게)
- [ ] 학교 도메인 연결

## 배포 순서 (나중에)
1. GitHub 저장소 생성 → URL 알려주기
2. Vercel 배포 (vercel.com → GitHub 연결)
3. Supabase 연동 (선택)
4. 학교 도메인 연결

## 다음 대화 시작할 때
"이 프로젝트 이어서 작업해줘" 라고 하면
Claude가 이 파일 + 코드 읽고 맥락 파악함
