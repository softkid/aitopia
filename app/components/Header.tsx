'use client'

import { motion } from 'framer-motion'

// 직접 구현한 SVG 아이콘 컴포넌트들
const WalletIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
)

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const BoltIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

interface HeaderProps {
  walletAddress: string
  zkProof: string
}

export default function Header({ walletAddress, zkProof }: HeaderProps) {
  const formatAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="gradient-bg safe-area-top"
    >
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <BoltIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AITOPIA</h1>
              <p className="text-white/80 text-sm">AI 수익화 플랫폼</p>
            </div>
          </motion.div>

          {walletAddress && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center space-x-2">
                <WalletIcon className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-mono">
                  {formatAddress(walletAddress)}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {zkProof && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">ZK 증명 활성화</p>
              <p className="text-white/60 text-xs font-mono">
                {zkProof.slice(0, 20)}...
              </p>
            </div>
            <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
          </motion.div>
        )}
      </div>
    </motion.header>
  )
} 