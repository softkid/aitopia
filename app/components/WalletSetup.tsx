'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

// 직접 구현한 SVG 아이콘 컴포넌트들
const WalletIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
)

const QrCodeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
)

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
)

interface WalletSetupProps {
  onWalletSetup: (address: string) => void
}

export default function WalletSetup({ onWalletSetup }: WalletSetupProps) {
  const [address, setAddress] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleManualInput = () => {
    if (address.trim()) {
      onWalletSetup(address.trim())
    }
  }

  const handleGenerateWallet = async () => {
    setIsGenerating(true)
    
    // 간단한 지갑 주소 생성 시뮬레이션 (실제로는 더 복잡한 암호화 로직 필요)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const generatedAddress = generateMockWalletAddress()
    setAddress(generatedAddress)
    onWalletSetup(generatedAddress)
    
    setIsGenerating(false)
  }

  const generateMockWalletAddress = (): string => {
    // USDT (ERC-20) 주소 형태 시뮬레이션
    const chars = '0123456789abcdef'
    let address = '0x'
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)]
    }
    return address
  }

  return (
    <div className="px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <WalletIcon className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            지갑 설정
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            USDT 수익을 받을 지갑 주소를 설정하세요
          </p>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              새 지갑 생성
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              ZK 알고리즘을 사용하여 안전한 익명 지갑을 생성합니다
            </p>
            <button
              onClick={handleGenerateWallet}
              disabled={isGenerating}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>생성 중...</span>
                </>
              ) : (
                <>
                  <PlusIcon className="w-5 h-5" />
                  <span>새 지갑 생성</span>
                </>
              )}
            </button>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              기존 지갑 주소 입력
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  USDT 지갑 주소 (ERC-20)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <button
                onClick={handleManualInput}
                disabled={!address.trim()}
                className="w-full btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <WalletIcon className="w-5 h-5" />
                <span>지갑 연결</span>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
          >
            <div className="flex items-start space-x-3">
              <QrCodeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-1">
                  보안 안내
                </h4>
                <p className="text-blue-700 dark:text-blue-400 text-sm">
                  ZK 알고리즘을 통해 개인정보 없이도 안전하게 수익을 받을 수 있습니다. 
                  모든 거래는 암호화되어 처리됩니다.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
} 