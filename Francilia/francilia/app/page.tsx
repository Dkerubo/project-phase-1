'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Volume2, VolumeX } from 'lucide-react'
import AuthModal from '@/components/auth/AuthModal'
import Logo from '@/components/ui/logo'
import { useRouter } from 'next/navigation'
import AIChat from '@/components/ui/ai-chat'

export default function Home() {
  const [showVideo, setShowVideo] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Check if user is logged in but still show intro video
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('francilia_user')
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          setIsLoggedIn(true)
        } catch (error) {
          console.error('Error parsing user data:', error)
        }
      }
    }
  }, [])

  useEffect(() => {
    // Auto-advance after 8 seconds
    const timer = setTimeout(() => {
      handleVideoEnd()
    }, 8000)

    return () => clearTimeout(timer)
  }, [])

  const handleVideoEnd = () => {
    setShowVideo(false)
    
    // If user is logged in and has subscription, go to browse
    if (isLoggedIn && user?.subscription) {
      router.push('/browse')
    } else if (isLoggedIn && !user?.subscription) {
      // If logged in but no subscription, go to subscribe
      router.push('/subscribe')
    } else {
      // If not logged in, show auth modal
      setShowAuth(true)
    }
  }

  const handleGetStarted = () => {
    setShowVideo(false)
    
    // Same logic as video end
    if (isLoggedIn && user?.subscription) {
      router.push('/browse')
    } else if (isLoggedIn && !user?.subscription) {
      router.push('/subscribe')
    } else {
      setShowAuth(true)
    }
  }

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading Francilia Films...</div>
      </div>
    )
  }

  // Always show video first, regardless of login status
  if (showVideo) {
    return (
      <div className="relative h-screen w-full overflow-hidden bg-black">
        {/* Intro Video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted={isMuted}
            className="h-full w-full object-cover"
            onEnded={handleVideoEnd}
          >
            <source src="https://franciliafilms.com/PoliticalVendettaNoGunshots.mp4" type="video/mp4" />
          </video>
          
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Logo and controls */}
          <div className="absolute inset-0 flex flex-col">
            {/* Top section with logo */}
            <div className="flex items-center justify-between p-8">
              <Logo size="lg" />
              
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="rounded-full bg-black/50 p-3 text-white hover:bg-black/70 transition-colors"
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
            </div>

            {/* Bottom section with CTA */}
            <div className="mt-auto p-8 pb-16">
              <div className="max-w-2xl">
                <h1 className="mb-4 text-6xl font-bold text-white">
                  {isLoggedIn ? `Welcome back, ${user?.name || 'User'}!` : 'Welcome to the Future of Entertainment'}
                </h1>
                <p className="mb-8 text-xl text-gray-300">
                  {isLoggedIn 
                    ? 'Ready to continue your streaming journey? Discover new content and pick up where you left off.'
                    : 'Experience premium streaming with exclusive content, ad-free viewing, and unlimited access to thousands of movies and shows.'
                  }
                </p>
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="text-white hover:opacity-90 px-8 py-4 text-lg font-semibold transition-all hover:scale-105"
                  style={{ backgroundColor: '#a38725' }}
                >
                  <Play className="mr-2 h-5 w-5" />
                  {isLoggedIn 
                    ? (user?.subscription ? 'Continue Watching' : 'Choose Your Plan')
                    : 'Get Started'
                  }
                </Button>
                
                {/* Skip button for returning users */}
                {isLoggedIn && (
                  <Button
                    onClick={handleGetStarted}
                    variant="ghost"
                    className="ml-4 text-white hover:bg-white/10"
                  >
                    Skip Intro
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fallback content (only shown if not logged in and video ended)
  return (
    <div className="min-h-screen bg-black">
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      
      {/* Hero Section */}
      <div className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPHN0eWxlPgouY2xzLTEgeyBmaWxsOiAjMTExODI3OyB9Ci5jbHMtMiB7IGZpbGw6ICNhMzg3MjU7IG9wYWNpdHk6IDAuMTsgfQo8L3N0eWxlPgo8L2RlZnM+CjxyZWN0IGNsYXNzPSJjbHMtMSIgd2lkdGg9IjE5MjAiIGhlaWdodD0iMTA4MCIvPgo8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0wLDAgTDE5MjAsNTQwIEwxOTIwLDEwODAgTDAsNTQwIFoiLz4KPHN2Zz4K)' 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black">
          <div className="flex h-full flex-col items-center justify-center text-center text-white">
            <div className="mb-8">
              <Logo size="xl" />
            </div>
            <h2 className="mb-6 text-5xl font-bold leading-tight max-w-4xl">
              Unlimited movies, TV shows, and more
            </h2>
            <p className="mb-8 max-w-2xl text-xl text-gray-300">
              Watch anywhere. Cancel anytime. Ready to watch? Enter your email to create or restart your membership.
            </p>
            <Button
              onClick={() => setShowAuth(true)}
              size="lg"
              className="text-white hover:opacity-90 px-12 py-6 text-xl font-semibold rounded-md transition-all hover:scale-105"
              style={{ backgroundColor: '#a38725' }}
            >
              Start Your Journey
            </Button>
            <p className="mt-4 text-sm text-gray-400">
              Ready to watch? Enter your email to create or restart your membership.
            </p>
          </div>
        </div>
      </div>

      {/* AI Chat Assistant */}
      <AIChat />
    </div>
  )
}