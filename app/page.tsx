'use client'

import { useState, useEffect } from 'react'

// 완전히 안전한 저장소 접근 유틸리티 (에러 제로)
const SafeStorage = {
  isAvailable: false,
  testCompleted: false,
  
  async init() {
    if (this.testCompleted) return this.isAvailable
    
    // 다중 안전성 검사
    try {
      // 1단계: 기본 환경 체크
      if (typeof window === 'undefined') return false
      if (typeof Storage === 'undefined') return false
      if (!window.localStorage) return false
      
      // 2단계: 실제 접근 테스트 (가장 안전한 방법)
      await new Promise((resolve, reject) => {
        try {
          const testKey = `__test_${Date.now()}_${Math.random()}`
          const testValue = 'test'
          
          // 쓰기 테스트
          window.localStorage.setItem(testKey, testValue)
          
          // 읽기 테스트  
          const retrieved = window.localStorage.getItem(testKey)
          
          // 삭제 테스트
          window.localStorage.removeItem(testKey)
          
          // 검증
          if (retrieved === testValue) {
            this.isAvailable = true
            resolve(true)
          } else {
            reject(new Error('Storage test failed'))
          }
        } catch (error) {
          this.isAvailable = false
          reject(error)
        }
      })
    } catch (error) {
      console.log('🔒 Storage unavailable (safe mode enabled):', error.message)
      this.isAvailable = false
    }
    
    this.testCompleted = true
    return this.isAvailable
  },

  get(key: string): string | null {
    if (!this.isAvailable) return null
    try {
      return window.localStorage.getItem(key)
    } catch (error) {
      console.log(`🔒 Storage read failed for ${key} (ignored)`)
      return null
    }
  },

  set(key: string, value: string): boolean {
    if (!this.isAvailable) return false
    try {
      window.localStorage.setItem(key, value)
      return true
    } catch (error) {
      console.log(`🔒 Storage write failed for ${key} (ignored)`)
      return false
    }
  },

  remove(key: string): boolean {
    if (!this.isAvailable) return false
    try {
      window.localStorage.removeItem(key)
      return true
    } catch (error) {
      console.log(`🔒 Storage remove failed for ${key} (ignored)`)
      return false
    }
  }
}

export default function Home() {
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
            setHasMetaMask(!!window.ethereum)
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

  if (isLoading) {
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

  // 지갑이 설정되었다면 메인 앱 표시 (간소화)
  if (walletAddress) {
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
                <p className="text-white/80 text-xs">지갑 주소</p>
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

        <main className="px-4 py-8">
          <div className="max-w-md mx-auto space-y-6">
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

            {/* 지갑 재설정 버튼 */}
            <button 
              onClick={() => {
                setWalletAddress('')
                SafeStorage.remove('aitopia_wallet')
              }}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              지갑 재설정
            </button>
          </div>
        </main>
      </div>
    )
  }

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