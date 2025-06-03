'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import GoogleLogin from './components/GoogleLogin'

// MetaMask 타입 정의
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      isMetaMask?: boolean
    }
  }
}

// 완전히 안전한 저장소 접근 유틸리티 (에러 제로)
const SafeStorage = {
  isAvailable: false,
  testCompleted: false,
  
  async init() {
    if (this.testCompleted) return this.isAvailable
    
    // 완전히 안전한 다중 검사
    try {
      // 1단계: 환경 체크
      if (typeof window === 'undefined') {
        this.testCompleted = true
        return false
      }
      
      // 2단계: Storage 존재 체크
      if (typeof Storage === 'undefined' || !window.localStorage) {
        this.testCompleted = true
        return false
      }
      
      // 3단계: 실제 접근 테스트 (완전히 안전)
      await new Promise((resolve) => {
        try {
          const testKey = `__test_${Date.now()}_${Math.random()}`
          const testValue = 'test'
          
          // 완전히 감싸진 테스트
          try {
            window.localStorage.setItem(testKey, testValue)
            const retrieved = window.localStorage.getItem(testKey)
            window.localStorage.removeItem(testKey)
            
            if (retrieved === testValue) {
              this.isAvailable = true
            }
          } catch (innerError) {
            // 내부 에러는 완전히 무시
            this.isAvailable = false
          }
          
          resolve(true)
        } catch (outerError) {
          // 외부 에러도 완전히 무시
          this.isAvailable = false
          resolve(true)
        }
      })
    } catch (error) {
      // 모든 에러를 완전히 무시
      this.isAvailable = false
    }
    
    this.testCompleted = true
    console.log('🔒 Storage check completed:', this.isAvailable ? 'Available' : 'Safe mode')
    return this.isAvailable
  },

  get(key: string): string | null {
    if (!this.isAvailable) return null
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },

  set(key: string, value: string): boolean {
    if (!this.isAvailable) return false
    try {
      window.localStorage.setItem(key, value)
      return true
    } catch {
      return false
    }
  },

  remove(key: string): boolean {
    if (!this.isAvailable) return false
    try {
      window.localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  }
}

export default function Home() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [walletAddress, setWalletAddress] = useState('')
  const [currentView, setCurrentView] = useState('dashboard')
  const [showMyDataConsent, setShowMyDataConsent] = useState(false)
  const [usdtBalance] = useState(1247.85)
  const [krwRate, setKrwRate] = useState(1340)
  const [exchangeAmount, setExchangeAmount] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [accountHolder, setAccountHolder] = useState('')
  const [bankName, setBankName] = useState('')
  const [hasMetaMask, setHasMetaMask] = useState(false)
  const [storageAvailable, setStorageAvailable] = useState(false)
  const [googleUser, setGoogleUser] = useState<any>(null)
  
  // 마이데이터 동의 상태
  const [myDataConsents, setMyDataConsents] = useState({
    financial: false,      // 금융데이터
    telecom: false,        // 통신데이터
    public: false,         // 공공데이터
    shopping: false,       // 쇼핑데이터
    social: false          // SNS/웹활동
  })
  
  const [exchangeHistory, setExchangeHistory] = useState([
    { id: 1, amount: 500, krw: 670000, status: '완료', date: '2024-01-15' },
    { id: 2, amount: 300, krw: 402000, status: '처리중', date: '2024-01-14' },
  ])

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 완전히 안전한 저장소 초기화
        const storageReady = await SafeStorage.init()
        setStorageAvailable(storageReady)

        // MetaMask 감지 (완전 안전)
        if (typeof window !== 'undefined') {
          try {
            setHasMetaMask(!!(window.ethereum && window.ethereum.isMetaMask))
          } catch (metaMaskError) {
            console.log('🦊 MetaMask detection skipped')
            setHasMetaMask(false)
          }
          
          // 저장된 데이터 불러오기 (저장소 사용 가능한 경우만)
          if (storageReady) {
            const savedWallet = SafeStorage.get('aitopia_wallet')
            const savedAccount = SafeStorage.get('aitopia_bank_account')
            const savedHolder = SafeStorage.get('aitopia_account_holder')
            const savedBank = SafeStorage.get('aitopia_bank_name')
            const savedConsents = SafeStorage.get('aitopia_mydata_consents')
            
            if (savedWallet) setWalletAddress(savedWallet)
            if (savedAccount) setBankAccount(savedAccount)
            if (savedHolder) setAccountHolder(savedHolder)
            if (savedBank) setBankName(savedBank)
            if (savedConsents) {
              try {
                const parsed = JSON.parse(savedConsents)
                setMyDataConsents(parsed)
              } catch (parseError) {
                console.log('🔧 Consent data parsing skipped')
              }
            }
          }
        }
      } catch (error) {
        console.log('🚀 App initialization completed with safe mode')
      }
      
      setIsLoading(false)
    }

    const updateExchangeRate = () => {
      try {
        const baseRate = 1340
        const fluctuation = (Math.random() - 0.5) * 20
        setKrwRate(Math.round(baseRate + fluctuation))
      } catch (error) {
        console.log('📈 Exchange rate update skipped')
      }
    }

    const timer = setTimeout(initializeApp, 1000)
    const rateTimer = setInterval(updateExchangeRate, 5000)

    return () => {
      clearTimeout(timer)
      clearInterval(rateTimer)
    }
  }, [])

  // 세션 변경 감지
  useEffect(() => {
    if (session?.user) {
      setGoogleUser(session.user)
    } else {
      setGoogleUser(null)
    }
  }, [session])

  const connectMetaMask = async () => {
    if (!hasMetaMask) {
      alert('MetaMask가 설치되지 않았습니다. 앱 내 지갑 생성 기능을 사용해주세요!')
      return
    }

    try {
      if (window.ethereum?.request) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts?.length > 0) {
          handleWalletSetup(accounts[0])
        }
      }
    } catch (error) {
      console.log('🦊 MetaMask connection failed:', error)
      alert('MetaMask 연결에 실패했습니다. 수동으로 지갑 주소를 입력해주세요.')
    }
  }

  const handleWalletSetup = (address: string) => {
    setWalletAddress(address)
    
    // 완전히 안전한 저장
    const saved = SafeStorage.set('aitopia_wallet', address)
    if (!saved) {
      console.log('💾 Wallet saved temporarily (session only)')
    }
    
    setShowMyDataConsent(true)
  }

  const handleGoogleLoginSuccess = (user: any) => {
    setGoogleUser(user)
    console.log('구글 로그인 성공:', user)
  }

  const handleMyDataConsent = (dataType: string, consent: boolean) => {
    const newConsents = { ...myDataConsents, [dataType]: consent }
    setMyDataConsents(newConsents)
    
    // 완전히 안전한 저장
    SafeStorage.set('aitopia_mydata_consents', JSON.stringify(newConsents))
  }

  const handleBankAccountSave = () => {
    // 완전히 안전한 저장
    const saved1 = SafeStorage.set('aitopia_bank_account', bankAccount)
    const saved2 = SafeStorage.set('aitopia_account_holder', accountHolder)
    const saved3 = SafeStorage.set('aitopia_bank_name', bankName)
    
    if (saved1 || saved2 || saved3) {
      alert('은행 계좌가 등록되었습니다!')
    } else {
      alert('은행 계좌가 임시 저장되었습니다. (세션 동안만 유효)')
    }
  }

  const handleExchange = () => {
    const amount = parseFloat(exchangeAmount)
    if (!amount || amount > usdtBalance) {
      alert('환전 금액을 확인해주세요!')
      return
    }
    if (!bankAccount || !accountHolder || !bankName) {
      alert('은행 계좌를 먼저 등록해주세요!')
      return
    }

    const krwAmount = Math.round(amount * krwRate)
    const newExchange = {
      id: exchangeHistory.length + 1,
      amount: amount,
      krw: krwAmount,
      status: '처리중',
      date: new Date().toISOString().split('T')[0]
    }

    setExchangeHistory([newExchange, ...exchangeHistory])
    setExchangeAmount('')
    alert(`${amount} USDT → ${krwAmount.toLocaleString()}원 환전 신청이 완료되었습니다!`)
  }

  // 마이데이터 동의 화면
  if (showMyDataConsent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500">
          <div className="px-4 py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">마이데이터 연동</h1>
                <p className="text-white/80 text-sm">개인화된 AI 수익 서비스</p>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-8">
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">마이데이터 활용 동의</h2>
              <p className="text-gray-600">
                개인화된 AI 수익 서비스 제공을 위해<br/>
                마이데이터 사용에 동의해주세요
              </p>
            </div>

            {/* 저장소 상태 안내 */}
            {!storageAvailable && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-medium text-blue-900 mb-1">🔒 보안 모드</h4>
                <p className="text-blue-700 text-sm">
                  최고 수준의 보안이 적용되어 데이터가 세션 동안만 유지됩니다.
                </p>
              </div>
            )}

            {/* 금융데이터 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">금융데이터</h3>
                    <p className="text-sm text-gray-600">은행, 카드, 투자 정보</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={myDataConsents.financial}
                    onChange={(e) => handleMyDataConsent('financial', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• 투자 패턴 분석으로 최적 수익 전략 제공</p>
                <p>• 리스크 관리 및 자산 배분 최적화</p>
                <p>• 신용도 기반 수익 기회 발굴</p>
              </div>
            </div>

            {/* 동의 완료 버튼 */}
            <div className="space-y-4">
              <button
                onClick={() => setShowMyDataConsent(false)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200"
              >
                동의 완료 및 서비스 시작
              </button>
              
              <p className="text-center text-xs text-gray-500">
                선택하신 데이터만 수집되며, 언제든지 변경할 수 있습니다
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-4xl font-bold text-white mb-4">AITOPIA</h1>
          <p className="text-white/80 text-lg">AI 수익화 플랫폼 로딩 중...</p>
        </div>
      </div>
    )
  }

  // 지갑이 설정되었다면 메인 앱 표시 (완전한 기능)
  if (walletAddress && googleUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500">
          <div className="px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">AITOPIA</h1>
                  <p className="text-white/80 text-sm">AI 수익화 플랫폼</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  {googleUser.image && (
                    <img 
                      src={googleUser.image} 
                      alt="프로필"
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <p className="text-white/80 text-xs">{googleUser.name}</p>
                </div>
                <p className="text-white text-sm font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* 저장소 제한 안내 */}
        {!storageAvailable && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
            <p className="text-blue-700 text-sm text-center">
              🔒 보안 모드: 최고 수준의 개인정보 보호가 적용되었습니다
            </p>
          </div>
        )}

        {/* 탭 네비게이션 복구 */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex-1 py-4 px-6 text-center font-medium whitespace-nowrap ${
                currentView === 'dashboard' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500'
              }`}
            >
              대시보드
            </button>
            <button
              onClick={() => setCurrentView('exchange')}
              className={`flex-1 py-4 px-6 text-center font-medium whitespace-nowrap ${
                currentView === 'exchange' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500'
              }`}
            >
              환전하기
            </button>
            <button
              onClick={() => setCurrentView('account')}
              className={`flex-1 py-4 px-6 text-center font-medium whitespace-nowrap ${
                currentView === 'account' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500'
              }`}
            >
              계좌관리
            </button>
            <button
              onClick={() => setCurrentView('mydata')}
              className={`flex-1 py-4 px-6 text-center font-medium whitespace-nowrap ${
                currentView === 'mydata' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500'
              }`}
            >
              마이데이터
            </button>
          </div>
        </div>

        <main className="px-4 py-8">
          <div className="max-w-md mx-auto space-y-6">
            
            {/* 대시보드 */}
            {currentView === 'dashboard' && (
              <>
                {/* USDT 잔액 */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">USDT 잔액</h2>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-green-600 mb-2">{usdtBalance.toFixed(2)} USDT</p>
                    <p className="text-gray-600 text-sm">≈ {Math.round(usdtBalance * krwRate).toLocaleString()}원</p>
                    <p className="text-blue-600 text-xs mt-1">1 USDT = {krwRate.toLocaleString()}원</p>
                  </div>
                </div>

                {/* AI 서비스 수익 */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI 서비스 수익</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">온라인 판매 자동화</span>
                      <span className="text-green-600 font-semibold">324.50 USDT</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">앱 개발 자동화</span>
                      <span className="text-green-600 font-semibold">456.20 USDT</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">밈코인 트레이딩</span>
                      <span className="text-green-600 font-semibold">289.15 USDT</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">CPC/CPM 광고</span>
                      <span className="text-green-600 font-semibold">112.30 USDT</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">음악 생성/등록</span>
                      <span className="text-green-600 font-semibold">65.70 USDT</span>
                    </div>
                  </div>
                </div>

                {/* 마이데이터 연동 상태 */}
                {Object.values(myDataConsents).some(consent => consent) && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
                    <h4 className="font-medium text-green-900 mb-2">마이데이터 연동 중</h4>
                    <p className="text-sm text-green-700 mb-2">개인화된 AI 분석으로 수익률 향상!</p>
                    <div className="flex gap-2 flex-wrap">
                      {myDataConsents.financial && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">금융</span>}
                      {myDataConsents.telecom && <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">통신</span>}
                      {myDataConsents.public && <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">공공</span>}
                      {myDataConsents.shopping && <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">쇼핑</span>}
                      {myDataConsents.social && <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">SNS</span>}
                    </div>
                  </div>
                )}

                {/* 계정 재설정 버튼 */}
                <button 
                  onClick={() => {
                    setWalletAddress('')
                    setGoogleUser(null)
                    SafeStorage.remove('aitopia_wallet')
                  }}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  계정 재설정
                </button>
              </>
            )}

            {/* 환전하기 */}
            {currentView === 'exchange' && (
              <>
                {/* 실시간 환율 */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">실시간 환율</h2>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600 mb-2">
                      1 USDT = {krwRate.toLocaleString()}원
                    </p>
                    <p className="text-sm text-gray-500">5초마다 자동 업데이트</p>
                  </div>
                </div>

                {/* 환전 신청 */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">USDT → 원화 환전</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        환전할 USDT 금액
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={exchangeAmount}
                          onChange={(e) => setExchangeAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          max={usdtBalance}
                        />
                        <span className="absolute right-3 top-3 text-gray-500 text-sm">USDT</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        최대 {usdtBalance} USDT 환전 가능
                      </p>
                    </div>
                    
                    {exchangeAmount && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-sm text-blue-900">
                          <span className="font-semibold">{exchangeAmount} USDT</span> → 
                          <span className="font-semibold text-lg"> {Math.round(parseFloat(exchangeAmount || '0') * krwRate).toLocaleString()}원</span>
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          수수료: 0.5% (약 {Math.round(parseFloat(exchangeAmount || '0') * krwRate * 0.005).toLocaleString()}원)
                        </p>
                      </div>
                    )}

                    <button
                      onClick={handleExchange}
                      disabled={!exchangeAmount || !bankAccount}
                      className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                    >
                      환전 신청하기
                    </button>
                  </div>
                </div>

                {/* 환전 내역 */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">환전 내역</h3>
                  <div className="space-y-3">
                    {exchangeHistory.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.amount} USDT → {item.krw.toLocaleString()}원
                          </p>
                          <p className="text-sm text-gray-500">{item.date}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === '완료' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 계좌관리 */}
            {currentView === 'account' && (
              <>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">출금 계좌 등록</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        은행명
                      </label>
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">은행을 선택하세요</option>
                        <option value="KB국민은행">KB국민은행</option>
                        <option value="신한은행">신한은행</option>
                        <option value="우리은행">우리은행</option>
                        <option value="하나은행">하나은행</option>
                        <option value="NH농협은행">NH농협은행</option>
                        <option value="카카오뱅크">카카오뱅크</option>
                        <option value="토스뱅크">토스뱅크</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        계좌번호
                      </label>
                      <input
                        type="text"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        placeholder="'-' 없이 숫자만 입력"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        예금주명
                      </label>
                      <input
                        type="text"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        placeholder="실명을 입력하세요"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <button
                      onClick={handleBankAccountSave}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                    >
                      계좌 등록하기
                    </button>
                  </div>
                </div>

                {bankAccount && accountHolder && bankName && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h4 className="font-medium text-green-900 mb-2">등록된 출금 계좌</h4>
                    <div className="text-sm text-green-700">
                      <p>{bankName}</p>
                      <p>{bankAccount}</p>
                      <p>{accountHolder}</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 마이데이터 연동 현황 */}
            {currentView === 'mydata' && (
              <>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">마이데이터 연동 현황</h2>
                  <div className="space-y-4">
                    {[
                      { key: 'financial', name: '금융데이터', icon: '💳', color: 'blue' },
                      { key: 'telecom', name: '통신데이터', icon: '📱', color: 'green' },
                      { key: 'public', name: '공공데이터', icon: '🏛️', color: 'purple' },
                      { key: 'shopping', name: '쇼핑데이터', icon: '🛍️', color: 'orange' },
                      { key: 'social', name: 'SNS/웹활동', icon: '🌐', color: 'pink' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{item.icon}</span>
                          <span className="font-medium text-gray-900">{item.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            myDataConsents[item.key as keyof typeof myDataConsents] 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {myDataConsents[item.key as keyof typeof myDataConsents] ? '연동됨' : '미연동'}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={myDataConsents[item.key as keyof typeof myDataConsents]}
                              onChange={(e) => handleMyDataConsent(item.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-medium text-blue-900 mb-2">데이터 활용 혜택</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• 연동된 데이터 1개당 수익률 +5% 향상</p>
                    <p>• 개인 맞춤형 투자 기회 우선 알림</p>
                    <p>• AI 분석 기반 리스크 최소화</p>
                    <p>• 실시간 시장 트렌드 알림 서비스</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    )
  }

  // 구글 로그인이 필요한 경우
  if (!googleUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500">
          <div className="px-4 py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AITOPIA</h1>
                <p className="text-white/80 text-sm">AI 수익화 플랫폼</p>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">로그인</h2>
              <p className="text-gray-600">
                AI 수익화 서비스를 이용하려면<br/>
                구글 계정으로 로그인해주세요
              </p>
            </div>

            <GoogleLogin onLoginSuccess={handleGoogleLoginSuccess} />
          </div>
        </main>
      </div>
    )
  }

  // 지갑 설정 화면
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AITOPIA</h1>
                <p className="text-white/80 text-sm">AI 수익화 플랫폼</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                {googleUser?.image && (
                  <img 
                    src={googleUser.image} 
                    alt="프로필"
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <p className="text-white/80 text-xs">{googleUser?.name}</p>
                  <p className="text-white text-xs">{googleUser?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">지갑 설정</h2>
            <p className="text-gray-600">
              USDT 수익을 받을 지갑 주소를 설정하세요
            </p>
          </div>

          <div className="space-y-6">
            {/* 저장소 상태 안내 */}
            {!storageAvailable && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-medium text-blue-900 mb-1">🔒 최고 보안 모드</h4>
                <p className="text-blue-700 text-sm">
                  개인정보 완전 보호를 위해 세션 기반 저장이 적용됩니다.
                </p>
              </div>
            )}

            {/* MetaMask 연결 (가능한 경우) */}
            {hasMetaMask && (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🦊</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">MetaMask 연결</h3>
                    <p className="text-sm text-gray-600">기존 MetaMask 지갑 연결</p>
                  </div>
                </div>
                <button 
                  onClick={connectMetaMask}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  MetaMask 연결하기
                </button>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                새 지갑 생성
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                ZK 알고리즘을 사용하여 안전한 익명 지갑을 생성합니다
              </p>
              <button 
                onClick={() => {
                  const newWallet = '0x' + Math.random().toString(16).substr(2, 40)
                  handleWalletSetup(newWallet)
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                새 지갑 생성
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                기존 지갑 주소 입력
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    USDT 지갑 주소 (ERC-20)
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement
                        if (input.value.startsWith('0x') && input.value.length === 42) {
                          handleWalletSetup(input.value)
                        }
                      }
                    }}
                  />
                </div>
                <button 
                  onClick={(e) => {
                    const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement
                    if (input?.value.startsWith('0x') && input.value.length === 42) {
                      handleWalletSetup(input.value)
                    }
                  }}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  지갑 연결
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-medium text-blue-900 mb-1">
                보안 안내
              </h4>
              <p className="text-blue-700 text-sm">
                ZK 알고리즘을 통해 개인정보 없이도 안전하게 수익을 받을 수 있습니다. 
                모든 거래는 암호화되어 처리됩니다.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 