'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

// 직접 구현한 SVG 아이콘 컴포넌트들
const ShoppingBagIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
)

const CodeBracketIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
)

const CurrencyDollarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
)

const SpeakerWaveIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 9v6l4-2.5L9 9z" />
  </svg>
)

const MegaphoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
  </svg>
)

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M13 16h-1.586a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-.707-.293H7m6 4V8" />
  </svg>
)

const PauseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const Cog6ToothIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
)

interface AIServicesProps {
  walletAddress: string
}

interface AIService {
  id: string
  name: string
  description: string
  icon: any
  isActive: boolean
  revenue: number
  status: 'running' | 'paused' | 'stopped'
  color: string
}

export default function AIServices({ walletAddress }: AIServicesProps) {
  const [services, setServices] = useState<AIService[]>([
    {
      id: 'online-sales',
      name: '온라인 상품판매 자동화',
      description: 'AI가 상품을 자동으로 판매하고 마케팅합니다',
      icon: ShoppingBagIcon,
      isActive: true,
      revenue: 145.67,
      status: 'running',
      color: 'bg-blue-500'
    },
    {
      id: 'app-dev',
      name: '앱 개발 자동화',
      description: 'AI가 앱을 자동으로 개발하고 배포합니다',
      icon: CodeBracketIcon,
      isActive: false,
      revenue: 0,
      status: 'stopped',
      color: 'bg-purple-500'
    },
    {
      id: 'meme-coin',
      name: '밈코인 투자 자동화',
      description: 'AI가 시장을 분석하여 자동으로 투자합니다',
      icon: CurrencyDollarIcon,
      isActive: false,
      revenue: 0,
      status: 'stopped',
      color: 'bg-green-500'
    },
    {
      id: 'cpc-ads',
      name: 'CPC/CPM 광고 연동',
      description: '광고 수익을 자동으로 최적화합니다',
      icon: MegaphoneIcon,
      isActive: true,
      revenue: 89.23,
      status: 'running',
      color: 'bg-orange-500'
    },
    {
      id: 'music-gen',
      name: '음악생성 및 등록 자동화',
      description: 'AI가 음악을 생성하고 스트리밍 플랫폼에 등록합니다',
      icon: SpeakerWaveIcon,
      isActive: true,
      revenue: 67.45,
      status: 'running',
      color: 'bg-pink-500'
    }
  ])

  const toggleService = (serviceId: string) => {
    setServices(prev => prev.map(service => {
      if (service.id === serviceId) {
        const newStatus = service.status === 'running' ? 'paused' : 'running'
        return {
          ...service,
          status: newStatus,
          isActive: newStatus === 'running'
        }
      }
      return service
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-600 dark:text-green-400'
      case 'paused': return 'text-orange-600 dark:text-orange-400'
      case 'stopped': return 'text-gray-600 dark:text-gray-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return '실행 중'
      case 'paused': return '일시정지'
      case 'stopped': return '중지'
      default: return '알 수 없음'
    }
  }

  return (
    <div className="px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI 서비스 관리
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              자동화된 수익 창출 서비스들을 관리하세요
            </p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <PlusIcon className="w-4 h-4" />
            <span>새 서비스</span>
          </button>
        </div>

        {/* 서비스 리스트 */}
        <div className="space-y-4">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {service.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleService(service.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      service.status === 'running' 
                        ? 'bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/30' 
                        : 'bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/30'
                    }`}
                  >
                    {service.status === 'running' ? (
                      <PauseIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                    ) : (
                      <PlayIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                  </button>
                  <button className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg">
                    <Cog6ToothIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">상태: </span>
                    <span className={`font-medium ${getStatusColor(service.status)}`}>
                      {getStatusText(service.status)}
                    </span>
                  </div>
                  {service.status === 'running' && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 dark:text-green-400">실시간 동작</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ${service.revenue.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">이번 달 수익</p>
                </div>
              </div>

              {service.status === 'running' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">진행률</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {Math.floor(Math.random() * 40 + 60)}%
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-2 rounded-full ${service.color}`}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* 추천 서비스 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="card bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <PlusIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                새로운 AI 서비스 추가
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                더 많은 수익 기회를 발견하세요
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">NFT 자동 거래</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">준비 중</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">AI 번역 서비스</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">준비 중</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
} 