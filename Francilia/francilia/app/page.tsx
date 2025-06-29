'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Volume2, VolumeX } from 'lucide-react'
import AuthModal from '@/components/auth/AuthModal'
import Logo from '@/components/ui/logo'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [showVideo, setShowVideo] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('francilia_user')
    if (user) {
      setIsLoggedIn(true)
      router.push('/browse')
    }
  }, [router])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(false)
      setShowAuth(true)
    }, 8000) // Show intro for 8 seconds

    return () => clearTimeout(timer)
  }, [])

  const handleGetStarted = () => {
    setShowVideo(false)
    setShowAuth(true)
  }

  if (showVideo) {
    return (
      <div className="relative h-screen w-full overflow-hidden bg-black">
        {/* Intro Video */}
        <div className="absolute inset-0">
          {isClient && (
            <video
              autoPlay
              muted={isMuted}
              className="h-full w-full object-cover"
              onEnded={() => {
                setShowVideo(false)
                setShowAuth(true)
              }}
            >
              <source src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761" type="video/mp4" />
            </video>
          )}
          
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Logo and controls */}
          <div className="absolute inset-0 flex flex-col">
            {/* Top section with logo */}
            <div className="flex items-center justify-between p-8">
              <Logo size="lg" />
              
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
            </div>
            
            {/* Bottom section with CTA */}
            <div className="mt-auto p-8 pb-16">
              <div className="max-w-2xl">
                <h1 className="mb-4 text-6xl font-bold text-white">
                  Welcome to the Future of Entertainment
                </h1>
                <p className="mb-8 text-xl text-gray-300">
                  Experience premium streaming with exclusive content, ad-free viewing, and unlimited access to thousands of movies and shows.
                </p>
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="text-white hover:opacity-90 px-8 py-4 text-lg font-semibold"
                  style={{ backgroundColor: '#a38725' }}
                >
                  <Play className="mr-2" size={20} />
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black">
          <div className="flex h-full flex-col items-center justify-center text-center text-white">
            <div className="mb-8">
              <Logo size="xl" />
            </div>
            <h2 className="mb-6 text-3xl font-semibold">Premium Streaming Experience</h2>
            <p className="mb-8 max-w-2xl text-xl text-gray-300">
              Unlimited movies, TV shows, and exclusive content. Watch anywhere, anytime.
            </p>
            <Button
              onClick={() => setShowAuth(true)}
              size="lg"
              className="text-white hover:opacity-90 px-8 py-4 text-lg font-semibold"
              style={{ backgroundColor: '#a38725' }}
            >
              Start Your Journey
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}