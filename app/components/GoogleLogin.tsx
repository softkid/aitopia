'use client'

import { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

interface GoogleLoginProps {
  onLoginSuccess: (user: any) => void
}

export default function GoogleLogin({ onLoginSuccess }: GoogleLoginProps) {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [showDemo, setShowDemo] = useState(false)

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      const result = await signIn('google', { 
        redirect: false,
        callbackUrl: '/' 
      })
      
      if (result?.error) {
        console.log('구글 OAuth 에러 (데모 모드로 전환):', result.error)
        setShowDemo(true)
      } else if (result?.ok && session?.user) {
        onLoginSuccess(session.user)
      }
    } catch (error) {
      console.log('구글 로그인 에러 (데모 모드 활성화):', error)
      setShowDemo(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = () => {
    const demoUser = {
      name: '데모 사용자',
      email: 'demo@aitopia.kr', 
      image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">👤</text></svg>'
    }
    onLoginSuccess(demoUser)
  }

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
    } catch (error) {
      console.log('로그아웃 에러 (무시됨):', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">로그인 상태 확인 중...</span>
      </div>
    )
  }

  if (session?.user) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center space-x-3 mb-3">
          {session.user.image && (
            <img 
              src={session.user.image} 
              alt="프로필"
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <h4 className="font-medium text-green-900">{session.user.name}</h4>
            <p className="text-sm text-green-700">{session.user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
        >
          로그아웃
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-medium text-blue-900 mb-2">🔐 보안 인증</h4>
        <p className="text-sm text-blue-700 mb-3">
          구글 계정으로 안전하게 로그인하여 AI 수익화 서비스를 이용하세요.
        </p>
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span>로그인 중...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>구글로 로그인</span>
          </>
        )}
      </button>

      {showDemo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h4 className="font-medium text-yellow-900 mb-2">🚀 데모 모드</h4>
          <p className="text-sm text-yellow-700 mb-3">
            구글 OAuth 설정이 필요합니다. 데모 계정으로 앱을 체험해보세요!
          </p>
          <button
            onClick={handleDemoLogin}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
          >
            데모 계정으로 체험하기
          </button>
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">
        로그인하면 <span className="text-blue-600">이용약관</span> 및 <span className="text-blue-600">개인정보처리방침</span>에 동의하는 것으로 간주됩니다.
      </p>
    </div>
  )
} 