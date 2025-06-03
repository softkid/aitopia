'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// 간단한 SVG 아이콘 컴포넌트들로 대체
const CurrencyDollarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
)

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const ChartBarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const BoltIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

interface DashboardProps {
  walletAddress: string
}

interface RevenueData {
  total: number
  today: number
  thisWeek: number
  activeServices: number
}

export default function Dashboard({ walletAddress }: DashboardProps) {
  const [revenueData, setRevenueData] = useState<RevenueData>({
    total: 0,
    today: 0,
    thisWeek: 0,
    activeServices: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 수익 데이터 시뮬레이션
    const loadRevenueData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setRevenueData({
        total: 1247.85,
        today: 23.45,
        thisWeek: 156.78,
        activeServices: 3
      })
      setIsLoading(false)
    }

    loadRevenueData()
  }, [])

  const recentActivities = [
    {
      id: 1,
      type: '온라인 상품판매',
      amount: 12.34,
      time: '2분 전',
      status: 'completed'
    },
    {
      id: 2,
      type: 'CPC 광고',
      amount: 5.67,
      time: '15분 전',
      status: 'completed'
    },
    {
      id: 3,
      type: '음악 생성',
      amount: 8.90,
      time: '1시간 전',
      status: 'processing'
    },
    {
      id: 4,
      type: '밈코인 투자',
      amount: 15.23,
      time: '3시간 전',
      status: 'completed'
    }
  ]

  if (isLoading) {
    return (
      <div className="px-4 py-8">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* 총 수익 카드 */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="card gradient-bg text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm">총 누적 수익</p>
              <p className="text-3xl font-bold">${revenueData.total.toFixed(2)}</p>
              <p className="text-white/60 text-xs mt-1">USDT</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <TrendingUpIcon className="w-4 h-4 text-accent-300" />
              <span className="text-accent-300 text-sm font-medium">+12.5%</span>
            </div>
            <span className="text-white/60 text-sm">지난 주 대비</span>
          </div>
        </motion.div>

        {/* 수익 통계 */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="card"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-xs">오늘</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  ${revenueData.today.toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="card"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center">
                <TrendingUpIcon className="w-4 h-4 text-secondary-600" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-xs">이번 주</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  ${revenueData.thisWeek.toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 활성 서비스 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              활성 AI 서비스
            </h3>
            <div className="flex items-center space-x-2">
              <BoltIcon className="w-4 h-4 text-accent-500" />
              <span className="text-accent-600 font-medium">{revenueData.activeServices}개</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 px-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-sm text-green-700 dark:text-green-300">온라인 상품판매 자동화</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-sm text-green-700 dark:text-green-300">CPC 광고 연동</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-sm text-green-700 dark:text-green-300">음악 생성 자동화</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </motion.div>

        {/* 최근 수익 활동 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            최근 수익 활동
          </h3>
          
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activity.status === 'completed' 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-orange-100 dark:bg-orange-900/30'
                  }`}>
                    {activity.status === 'completed' ? (
                      <CurrencyDollarIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <ClockIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.type}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    +${activity.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">USDT</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
} 