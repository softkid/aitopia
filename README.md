# AITOPIA - AI 수익화 플랫폼

한국어 모바일 웹앱으로 구현된 AI 기반 수익 창출 플랫폼입니다.

## 🚀 주요 기능

### 1. 보안 및 인증
- **ZK 알고리즘** 기반 익명 로그인
- **Google OAuth** 소셜 로그인
- **USDT 지갑** 생성 및 연결
- **SafeStorage** 시스템으로 완전한 개인정보 보호

### 2. AI 수익화 서비스 (Bar 형태 대시보드 + Airtable DB 연동)
각 서비스는 progress bar로 수익 현황을 시각화하고, 클릭하면 상세 정보를 확인할 수 있습니다. **NEW 서비스는 상단에 우선 표시됩니다.**

#### 🆕 NFT 자동 생성/판매 (월 159,000원) - **NEW!**
- AI가 트렌드를 분석해 NFT를 자동 생성하고 OpenSea에서 판매
- 월 평균 800 USDT 수익 목표
- 필요 자료: OpenSea 계정, MetaMask 지갑, NFT 컨셉, 창작 자금 200 USDT
- **그라데이션 NEW 배지**와 **특별 UI**로 구분 표시

#### 📱 온라인 판매 자동화 (월 89,000원)
- AI가 24시간 상품 리스팅 및 고객 응답 자동화
- 월 평균 500 USDT 수익 목표
- 필요 자료: 상품 목록, 쇼핑몰 계정, 상품 이미지, 배송업체 정보

#### 💻 앱 개발 자동화 (월 129,000원)
- AI 기반 앱 자동 개발 및 배포
- 월 평균 700 USDT 수익 목표
- 필요 자료: 앱스토어 계정, 사업자등록증, 앱 카테고리, UI/UX 컨셉

#### 💰 밈코인 트레이딩 (월 69,000원)
- AI 트렌드 분석 기반 자동 투자
- 월 평균 400 USDT 수익 목표
- 필요 자료: 거래소 계정, 최소 투자금 500 USDT, KYC 인증

#### 📢 CPC/CPM 광고 (월 49,000원)
- AI 콘텐츠 생성 및 광고 최적화
- 월 평균 300 USDT 수익 목표
- 필요 자료: 구글 애드센스, 웹사이트/블로그, 콘텐츠 카테고리

#### 🎵 음악 생성/등록 (월 39,000원)
- AI 작곡 및 스트리밍 플랫폼 자동 등록
- 월 평균 200 USDT 수익 목표
- 필요 자료: 음원 유통사 계정, 아티스트 등록, 음악 장르, 앨범 커버

### 3. Airtable 데이터베이스 연동 🆕
- **동적 서비스 관리**: 서비스 정보를 Airtable에서 실시간으로 관리
- **NEW 서비스 자동 정렬**: isNew 플래그로 신규 서비스 상단 배치
- **백업 데이터**: Airtable 연결 실패시 안전한 폴백 데이터 제공
- **실시간 업데이트**: 서비스 가격, 설명, 요구사항 실시간 수정 가능

### 4. 결제 시스템
- **Stripe 통합 결제**: 안전한 신용카드 결제
- **동적 가격 지원**: Airtable에서 가격 정보 자동 연동
- **원화(KRW) 결제**: 한국 사용자를 위한 원화 결제 지원
- **자동 갱신**: 월 단위 자동 결제 갱신
- **데모 모드**: 개발 환경에서 결제 오류 시 데모 체험 가능

### 5. 환전 시스템
- **실시간 환율**: USDT ↔ 원화 (5초마다 업데이트)
- **즉시 환전**: USDT를 원화로 즉시 환전 신청
- **은행 계좌 연동**: 주요 한국 은행 지원
- **환전 수수료**: 0.5% 투명한 수수료 구조

### 6. 마이데이터 연동
선택적 데이터 연동으로 AI 분석 정확도 향상:
- 💳 금융데이터: 투자 패턴 분석
- 📱 통신데이터: 활동 패턴 분석
- 🏛️ 공공데이터: 소득별 수익 모델
- 🛍️ 쇼핑데이터: 취향 기반 추천
- 🌐 SNS/웹활동: 콘텐츠 제작 최적화

## 🛠 기술 스택

### Frontend
- **Next.js 14** - React 서버 사이드 렌더링
- **TypeScript** - 타입 안전성
- **TailwindCSS** - 모던 스타일링
- **Framer Motion** - 애니메이션

### Backend & API
- **Next.js API Routes** - 서버리스 API
- **NextAuth.js** - 인증 관리
- **Stripe API** - 결제 처리
- **Airtable API** - 동적 데이터 관리 🆕

### 블록체인 & 암호화
- **ethers.js** - 이더리움 상호작용
- **web3.js** - 웹3 연결
- **crypto-js** - 암호화 유틸리티

### 보안 & 저장소
- **SafeStorage** - 완전 안전한 로컬 저장소
- **ZK Proof** - 영지식 증명 시뮬레이션
- **CSP 정책** - 콘텐츠 보안 정책

## 📱 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd aitopia
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.local` 파일 생성:
```env
NEXTAUTH_SECRET=your-secret-key-here-make-it-random-and-long
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe (테스트 키)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Airtable (새로 추가)
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
```

### 4. Airtable 설정 🆕
Airtable에서 다음 구조로 `AI_Services` 테이블을 생성하세요:

| 필드명 | 타입 | 설명 |
|--------|------|------|
| key | Single line text | 서비스 고유 키 (예: nft-creator) |
| name | Single line text | 서비스 이름 |
| description | Long text | 서비스 설명 |
| currentEarnings | Number | 현재 수익 (USDT) |
| maxEarnings | Number | 최대 수익 목표 (USDT) |
| cost | Single line text | 가격 표시 (예: 월 159,000원) |
| costKrw | Number | 실제 가격 (원화) |
| color | Single line text | 진행바 색상 CSS 클래스 |
| requirements | Long text | 필요 자료 (줄바꿈으로 구분) |
| features | Long text | 서비스 특징 (줄바꿈으로 구분) |
| isNew | Checkbox | 신규 서비스 여부 |
| isActive | Checkbox | 활성화 여부 |
| order | Number | 정렬 순서 |

### 5. 개발 서버 실행
```bash
npm run dev
```

## 🎯 주요 UI/UX 특징

### Bar 형태 대시보드 + NEW 서비스 우선 표시
- **Progress Bar**: 각 서비스의 수익 현황을 시각적으로 표시
- **NEW 배지**: 신규 서비스에 그라데이션 NEW 배지 표시
- **자동 정렬**: NEW 서비스가 최상단에 자동 배치
- **클릭 인터랙션**: 서비스 클릭 시 상세 정보 모달 표시
- **실시간 업데이트**: Airtable에서 수익 데이터 실시간 반영
- **가입 상태 표시**: 가입된 서비스 구분 표시

### 모바일 최적화
- **반응형 디자인**: 모든 화면 크기에 최적화
- **터치 친화적**: 터치 인터페이스 최적화
- **빠른 로딩**: 최적화된 성능
- **PWA 지원**: 앱처럼 설치 가능

### Airtable 연동 장점
- **실시간 관리**: 코드 수정 없이 서비스 정보 업데이트
- **NEW 서비스 간편 추가**: isNew 체크박스로 간단히 NEW 서비스 지정
- **가격 유연성**: 실시간 가격 변경 가능
- **콘텐츠 관리**: 비개발자도 서비스 설명 수정 가능

## 💳 결제 플로우

1. **서비스 선택**: 대시보드에서 원하는 AI 서비스 클릭
2. **NEW 서비스 확인**: NEW 배지가 있는 서비스는 특별 UI로 표시
3. **상세 정보 확인**: 비용, 필요 자료, 서비스 특징 검토
4. **Stripe 결제**: 안전한 신용카드 결제 진행 (동적 가격 연동)
5. **서비스 활성화**: 결제 완료 후 즉시 서비스 시작
6. **수익 추적**: 24시간 내 첫 수익 발생 시작

## 🗄️ 데이터 관리

### Airtable 기반 동적 관리
- **서비스 정보**: 모든 AI 서비스 정보를 Airtable에서 중앙 관리
- **실시간 동기화**: API 호출을 통한 실시간 데이터 동기화
- **백업 시스템**: Airtable 연결 실패시 안전한 폴백 데이터
- **버전 관리**: Airtable의 기록 기능으로 변경 이력 추적

### NEW 서비스 관리
- **자동 정렬**: isNew 필드로 신규 서비스 자동 상단 배치
- **시각적 구분**: 그라데이션 배경과 NEW 배지로 차별화
- **특별 UI**: 신규 서비스에 특별한 색상과 애니메이션 적용

## 🔐 보안 기능

### 다층 보안 시스템
- **ZK 알고리즘**: 개인정보 없는 익명 인증
- **SafeStorage**: 완전 안전한 데이터 저장
- **CSP 정책**: XSS 공격 방지
- **HTTPS**: 모든 통신 암호화

### 개인정보 보호
- **최소 수집**: 필요 최소한의 정보만 수집
- **사용자 제어**: 모든 데이터 연동 사용자 선택
- **투명성**: 데이터 사용 목적 명확히 공개
- **삭제 권리**: 언제든 데이터 삭제 가능

## 🌍 다국어 지원
- **한국어 우선**: 한국 사용자를 위한 완전 한국어 지원
- **모바일 웹**: 별도 앱 설치 없이 브라우저에서 이용
- **PWA**: 홈 화면 추가로 앱처럼 사용 가능

## 📞 지원 및 문의
- **고객센터**: [이메일 주소]
- **카카오톡**: [카카오톡 채널]
- **전화**: [고객센터 전화번호]

---

**AITOPIA** - AI로 만드는 새로운 수익의 세계 🚀 