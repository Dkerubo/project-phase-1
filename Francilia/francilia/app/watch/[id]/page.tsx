'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  SkipBack,
  SkipForward,
  ArrowLeft,
  Star,
  Heart,
  Share2,
  Settings,
  Loader2
} from 'lucide-react'
import { movieAPI, type Movie } from '@/lib/muvi-api'
import { useRouter, useParams } from 'next/navigation'
import { useI18n } from '@/hooks/use-i18n'
import AIChat from '@/components/ui/ai-chat'

export default function WatchMovie() {
  const [user, setUser] = useState<any>(null)
  const [movie, setMovie] = useState<Movie | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [showAds, setShowAds] = useState(false)
  const [loading, setLoading] = useState(true)
  const [videoLoading, setVideoLoading] = useState(true)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [buffered, setBuffered] = useState(0)
  const [isClient, setIsClient] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()
  
  const router = useRouter()
  const params = useParams()
  const movieId = params?.id as string
  const { t } = useI18n()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    
    const userData = localStorage.getItem('francilia_user')
    if (!userData) {
      router.push('/')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    if (!parsedUser.subscription) {
      router.push('/subscribe')
      return
    }
    
    setUser(parsedUser)
    loadMovie()
    
    if (parsedUser.subscription.plan === 'standard') {
      setShowAds(true)
      setTimeout(() => setShowAds(false), 5000)
    }
  }, [router, movieId, isClient])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setVideoLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      
      // Update buffered progress
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const bufferedPercent = (bufferedEnd / video.duration) * 100
        setBuffered(bufferedPercent)
      }
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleVolumeChange = () => {
      setVolume(video.volume)
      setIsMuted(video.muted)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleError = (e: Event) => {
      console.error('Video error:', e)
      setVideoLoading(false)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('volumechange', handleVolumeChange)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('volumechange', handleVolumeChange)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
    }
  }, [movie])

  // Auto-hide controls
  useEffect(() => {
    if (showControls && isPlaying) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [showControls, isPlaying])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current) return

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          handlePlayPause()
          break
        case 'ArrowLeft':
          e.preventDefault()
          handleSeek(-10)
          break
        case 'ArrowRight':
          e.preventDefault()
          handleSeek(10)
          break
        case 'ArrowUp':
          e.preventDefault()
          handleVolumeChange(Math.min(volume + 0.1, 1))
          break
        case 'ArrowDown':
          e.preventDefault()
          handleVolumeChange(Math.max(volume - 0.1, 0))
          break
        case 'KeyM':
          e.preventDefault()
          handleMute()
          break
        case 'KeyF':
          e.preventDefault()
          handleFullscreen()
          break
      }
    }

    if (isClient) {
      document.addEventListener('keydown', handleKeyPress)
      return () => document.removeEventListener('keydown', handleKeyPress)
    }
  }, [volume, isClient])

  const loadMovie = async () => {
    if (!movieId) return
    
    setLoading(true)
    try {
      const response = await movieAPI.getMovie(movieId)
      
      if (response.success && response.data) {
        setMovie(response.data)
      } else {
        router.push('/browse')
      }
    } catch (error) {
      console.error('Error loading movie:', error)
      router.push('/browse')
    } finally {
      setLoading(false)
    }
  }

  const handlePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play().catch(console.error)
    }
    setShowControls(true)
  }

  const handleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setShowControls(true)
  }

  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current
    if (!video) return

    video.volume = newVolume
    video.muted = newVolume === 0
    setShowControls(true)
  }

  const handleSeek = (seconds: number) => {
    const video = videoRef.current
    if (!video) return

    const newTime = Math.max(0, Math.min(video.currentTime + seconds, duration))
    video.currentTime = newTime
    setShowControls(true)
  }

  const handleTimeSeek = (newTime: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleFullscreen = async () => {
    const container = containerRef.current
    if (!container) return

    try {
      if (!isFullscreen) {
        if (container.requestFullscreen) {
          await container.requestFullscreen()
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen()
        } else if ((container as any).msRequestFullscreen) {
          await (container as any).msRequestFullscreen()
        }
        setIsFullscreen(true)
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen()
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen()
        }
        setIsFullscreen(false)
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
    }
    setShowControls(true)
  }

  const handlePlaybackRateChange = (rate: number) => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = rate
    setPlaybackRate(rate)
    setShowControls(true)
  }

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00'
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>{t('common.loading')}</span>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-2">Movie not found</h1>
          <Button onClick={() => router.push('/browse')} className="text-white" style={{ backgroundColor: '#a38725' }}>
            Back to Browse
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Video Player */}
      <div 
        ref={containerRef}
        className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'}`}
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* Ad Overlay for Standard Plan */}
        {showAds && user.subscription.plan === 'standard' && (
          <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-sm flex items-center justify-center">
            <Card className="bg-gray-900/90 border-gray-700 max-w-md backdrop-blur-md">
              <CardHeader className="text-center">
                <CardTitle className="text-white">{t('watch.advertisement')}</CardTitle>
                <CardDescription className="text-gray-400">
                  {t('watch.upgradeMessage')}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4 text-sm text-gray-400">
                  This ad will end in 5 seconds...
                </div>
                <Button
                  onClick={() => router.push('/subscribe')}
                  className="text-white hover:opacity-90"
                  style={{ backgroundColor: '#a38725' }}
                >
                  {t('watch.upgradeNow')}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Video Element */}
        <video
          ref={videoRef}
          className="h-full w-full object-cover bg-black"
          poster={movie.backdrop}
          preload="metadata"
          playsInline
          crossOrigin="anonymous"
        >
          <source 
            src={movie.videoUrl || "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761"} 
            type="video/mp4" 
          />
          <track kind="captions" src="" srcLang="en" label="English" />
        </video>

        {/* Loading Overlay */}
        {videoLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="flex items-center gap-3 text-white">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-lg">Loading video...</span>
            </div>
          </div>
        )}

        {/* Video Controls */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/browse')}
              className="text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('watch.backToBrowse')}
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={handlePlayPause}
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full p-6 transition-all hover:scale-110"
            >
              {isPlaying ? <Pause className="h-12 w-12" /> : <Play className="h-12 w-12" />}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-sm">
            {/* Progress Bar */}
            <div className="mb-4 relative">
              {/* Buffered Progress */}
              <div 
                className="absolute top-0 left-0 h-1 bg-gray-600 rounded-lg"
                style={{ width: `${buffered}%` }}
              />
              
              {/* Main Progress Bar */}
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => handleTimeSeek(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #a38725 0%, #a38725 ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`
                }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSeek(-10)}
                  className="text-white hover:bg-white/20"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                
                <Button
                  onClick={handlePlayPause}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSeek(10)}
                  className="text-white hover:bg-white/20"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
                
                <Button
                  onClick={handleMute}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                
                {/* Volume Slider */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                
                <span className="text-sm text-white min-w-[80px]">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Playback Speed */}
                <select
                  value={playbackRate}
                  onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                  className="bg-transparent text-white text-sm border border-gray-600 rounded px-2 py-1"
                >
                  <option value={0.5} className="bg-gray-800">0.5x</option>
                  <option value={0.75} className="bg-gray-800">0.75x</option>
                  <option value={1} className="bg-gray-800">1x</option>
                  <option value={1.25} className="bg-gray-800">1.25x</option>
                  <option value={1.5} className="bg-gray-800">1.5x</option>
                  <option value={2} className="bg-gray-800">2x</option>
                </select>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <Settings className="h-5 w-5" />
                </Button>
                
                <Button
                  onClick={handleFullscreen}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Information */}
      {!isFullscreen && (
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h1 className="mb-4 text-4xl font-bold">{movie.title}</h1>
              <div className="mb-6 flex items-center gap-4 text-sm flex-wrap">
                <Badge variant="outline" className="text-yellow-400 border-yellow-400 bg-yellow-400/10">
                  <Star className="mr-1 h-3 w-3" />
                  {movie.rating}
                </Badge>
                <span className="text-gray-300">{movie.year}</span>
                <span className="text-gray-300">{movie.duration}</span>
                <span className="text-gray-300">{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</span>
              </div>
              <p className="mb-8 text-lg text-gray-300 leading-relaxed">{movie.description}</p>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Cast</h3>
                  <div className="space-y-2">
                    {movie.cast?.map((actor: string, index: number) => (
                      <p key={index} className="text-gray-300">{actor}</p>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Director</h3>
                  <p className="text-gray-300">{movie.director}</p>
                  
                  <h3 className="mb-3 text-lg font-semibold mt-6">Language</h3>
                  <p className="text-gray-300">{movie.language}</p>
                  
                  <h3 className="mb-3 text-lg font-semibold mt-6">Country</h3>
                  <p className="text-gray-300">{movie.country}</p>
                </div>
              </div>
            </div>
            
            <div>
              <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">{t('watch.yourPlan')}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {user.subscription.plan === 'premium' ? 'Premium - No Ads' : 'Standard - With Ads'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Monthly Cost</span>
                      <span className="font-semibold text-white">${user.subscription.price}</span>
                    </div>
                    
                    {user.subscription.plan === 'standard' && (
                      <div className="rounded-lg bg-yellow-500/10 p-4 border border-yellow-500/20">
                        <p className="text-sm text-yellow-400 mb-2">
                          {t('watch.adFreeViewing')}
                        </p>
                        <Button
                          onClick={() => router.push('/subscribe')}
                          size="sm"
                          className="bg-yellow-600 hover:bg-yellow-700 text-white"
                        >
                          {t('watch.upgradeNow')}
                        </Button>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-gray-800">
                      <h4 className="text-sm font-semibold text-white mb-2">Keyboard Shortcuts</h4>
                      <div className="space-y-1 text-xs text-gray-400">
                        <div className="flex justify-between">
                          <span>Play/Pause</span>
                          <span>Space</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Seek ±10s</span>
                          <span>← →</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Volume</span>
                          <span>↑ ↓</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mute</span>
                          <span>M</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fullscreen</span>
                          <span>F</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Assistant */}
      <AIChat />
    </div>
  )
}