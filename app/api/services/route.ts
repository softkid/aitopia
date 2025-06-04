import { NextRequest, NextResponse } from 'next/server'
import Airtable from 'airtable'

// Airtable 설정 확인
console.log('🔧 Airtable 환경 변수 체크:')
console.log('- API Key 존재:', !!process.env.AIRTABLE_API_KEY)
console.log('- Base ID 존재:', !!process.env.AIRTABLE_BASE_ID)
console.log('- API Key 시작:', process.env.AIRTABLE_API_KEY?.substring(0, 8) + '...')
console.log('- Base ID:', process.env.AIRTABLE_BASE_ID)

// Airtable 설정
const base = process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID ? 
  new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY
  }).base(process.env.AIRTABLE_BASE_ID) : null

const SERVICES_TABLE = 'AI_Services'

export async function GET() {
  console.log('📊 서비스 API 호출됨')
  
  // Airtable 설정이 없으면 바로 백업 데이터 사용
  if (!base) {
    console.log('⚠️ Airtable 설정이 없어 백업 데이터 사용')
    return getFallbackData()
  }

  try {
    console.log('🔄 Airtable에서 데이터 조회 시도...')
    
    const records = await base(SERVICES_TABLE).select({
      sort: [
        { field: 'order', direction: 'asc' },
        { field: 'isNew', direction: 'desc' }
      ]
    }).all()

    console.log('✅ Airtable 데이터 조회 성공, 레코드 수:', records.length)

    const services = records.map((record: any) => ({
      id: record.id,
      key: record.fields.key,
      name: record.fields.name,
      description: record.fields.description,
      currentEarnings: record.fields.currentEarnings || 0,
      maxEarnings: record.fields.maxEarnings || 1000,
      cost: record.fields.cost,
      costKrw: record.fields.costKrw || 0,
      color: record.fields.color || 'bg-blue-500',
      lightColor: record.fields.lightColor || 'bg-blue-100',
      textColor: record.fields.textColor || 'text-blue-600',
      requirements: record.fields.requirements ? 
        record.fields.requirements.split('\n').filter((req: string) => req.trim()) : [],
      features: record.fields.features ? 
        record.fields.features.split('\n').filter((feature: string) => feature.trim()) : [],
      isNew: record.fields.isNew || false,
      isActive: record.fields.isActive !== false, // 기본값 true
      category: record.fields.category || 'standard',
      order: record.fields.order || 999
    }))

    // 활성화된 서비스만 반환하고 NEW 서비스를 맨 위로
    const activeServices = services
      .filter((service: any) => service.isActive)
      .sort((a: any, b: any) => {
        if (a.isNew && !b.isNew) return -1
        if (!a.isNew && b.isNew) return 1
        return a.order - b.order
      })

    console.log('📋 활성 서비스 수:', activeServices.length)
    console.log('🆕 NEW 서비스 수:', activeServices.filter(s => s.isNew).length)

    return NextResponse.json({
      success: true,
      services: activeServices
    })
  } catch (error: any) {
    console.error('❌ Airtable 데이터 조회 오류:', error)
    console.error('❌ 오류 상세:', error.message)
    console.error('❌ 상태 코드:', error.statusCode)
    
    return getFallbackData()
  }
}

function getFallbackData() {
  console.log('🔄 백업 데이터 사용 중...')
  
  // 백업 데이터 (Airtable 연결 실패시)
  const fallbackServices = [
    {
      key: 'nft-creator',
      name: 'NFT 자동 생성/판매',
      description: 'AI가 트렌드를 분석해 NFT를 자동 생성하고 OpenSea에서 판매합니다.',
      currentEarnings: 0,
      maxEarnings: 800,
      cost: '월 159,000원',
      costKrw: 159000,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      lightColor: 'bg-gradient-to-r from-purple-100 to-pink-100',
      textColor: 'text-purple-600',
      requirements: [
        'OpenSea 계정 생성',
        'MetaMask 지갑 연결',
        'NFT 컬렉션 컨셉 아이디어',
        '최소 창작 자금 200 USDT'
      ],
      features: [
        'AI 기반 NFT 아트 자동 생성',
        'OpenSea 자동 리스팅',
        '트렌드 분석 기반 테마 선택',
        '로열티 수익 자동 수집',
        '월 평균 800 USDT 수익 예상'
      ],
      isNew: true,
      isActive: true,
      category: 'new',
      order: 1
    },
    {
      key: 'online-sales',
      name: '온라인 판매 자동화',
      description: 'AI가 상품 리스팅부터 고객 응답까지 자동으로 처리하여 24시간 판매를 대행합니다.',
      currentEarnings: 324.50,
      maxEarnings: 500,
      cost: '월 89,000원',
      costKrw: 89000,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      requirements: [
        '판매할 상품 목록 (최소 10개)',
        '온라인 쇼핑몰 계정 (쿠팡, 11번가, 지마켓 등)',
        '상품 이미지 및 설명 자료',
        '배송업체 정보'
      ],
      features: [
        '24시간 자동 상품 등록',
        'AI 기반 고객 문의 응답',
        '실시간 재고 관리',
        '가격 최적화 자동 조정',
        '월 평균 500 USDT 수익 예상'
      ],
      isNew: false,
      isActive: true,
      category: 'standard',
      order: 2
    },
    {
      key: 'app-dev',
      name: '앱 개발 자동화',
      description: 'AI가 고객 요구사항을 분석하여 앱을 자동 개발하고 배포까지 처리합니다.',
      currentEarnings: 456.20,
      maxEarnings: 700,
      cost: '월 129,000원',
      costKrw: 129000,
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      textColor: 'text-green-600',
      requirements: [
        '개발 플랫폼 계정 (App Store, Google Play)',
        '사업자등록증 또는 개인사업자 신고',
        '앱 카테고리 선택 (게임, 유틸리티, 교육 등)',
        '기본 UI/UX 컨셉 아이디어'
      ],
      features: [
        'AI 기반 앱 자동 코딩',
        '실시간 버그 자동 수정',
        '앱스토어 자동 배포',
        '사용자 피드백 자동 분석',
        '월 평균 700 USDT 수익 예상'
      ],
      isNew: false,
      isActive: true,
      category: 'standard',
      order: 3
    },
    {
      key: 'memecoin',
      name: '밈코인 트레이딩',
      description: 'AI가 소셜미디어 트렌드를 분석하여 밈코인 투자를 자동 실행합니다.',
      currentEarnings: 289.15,
      maxEarnings: 400,
      cost: '월 69,000원',
      costKrw: 69000,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      requirements: [
        '암호화폐 거래소 계정 (업비트, 바이낸스 등)',
        '최소 투자금 500 USDT',
        '위험 투자 동의서',
        'KYC 인증 완료'
      ],
      features: [
        'AI 트렌드 실시간 분석',
        '자동 매수/매도 실행',
        '리스크 관리 자동화',
        'SNS 감정 분석 기반 예측',
        '월 평균 400 USDT 수익 예상'
      ],
      isNew: false,
      isActive: true,
      category: 'standard',
      order: 4
    },
    {
      key: 'advertising',
      name: 'CPC/CPM 광고',
      description: 'AI가 최적의 광고 콘텐츠를 생성하고 타겟팅하여 광고 수익을 창출합니다.',
      currentEarnings: 112.30,
      maxEarnings: 300,
      cost: '월 49,000원',
      costKrw: 49000,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      requirements: [
        '구글 애드센스 계정',
        '웹사이트 또는 블로그 (최소 10개 게시물)',
        '콘텐츠 카테고리 선택',
        '타겟 오디언스 정보'
      ],
      features: [
        'AI 콘텐츠 자동 생성',
        '최적 광고 배치 분석',
        '실시간 CTR 최적화',
        'A/B 테스트 자동 실행',
        '월 평균 300 USDT 수익 예상'
      ],
      isNew: false,
      isActive: true,
      category: 'standard',
      order: 5
    },
    {
      key: 'music',
      name: '음악 생성/등록',
      description: 'AI가 트렌드에 맞는 음악을 생성하고 스트리밍 플랫폼에 자동 등록합니다.',
      currentEarnings: 65.70,
      maxEarnings: 200,
      cost: '월 39,000원',
      costKrw: 39000,
      color: 'bg-pink-500',
      lightColor: 'bg-pink-100',
      textColor: 'text-pink-600',
      requirements: [
        '음원 유통사 계정 (벅스, 멜론, 스포티파이)',
        '작곡가 또는 아티스트 등록',
        '음악 장르 선택 (팝, 힙합, 일렉트로닉 등)',
        '앨범 커버 이미지'
      ],
      features: [
        'AI 작곡 및 편곡',
        '자동 음원 등록',
        '스트리밍 수익 최적화',
        '트렌드 기반 장르 선택',
        '월 평균 200 USDT 수익 예상'
      ],
      isNew: false,
      isActive: true,
      category: 'standard',
      order: 6
    }
  ]

  console.log('📋 백업 서비스 제공:', fallbackServices.length + '개')
  console.log('🆕 NEW 서비스 확인:', fallbackServices.filter(s => s.isNew).map(s => s.name))

  return NextResponse.json({
    success: true,
    services: fallbackServices,
    fallback: true
  })
}

export async function POST(req: NextRequest) {
  try {
    const { serviceKey, action } = await req.json()
    
    if (action === 'updateEarnings') {
      // 수익 업데이트 로직 (향후 구현)
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 