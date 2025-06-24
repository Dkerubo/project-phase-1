'use client'

import { useState, useEffect } from 'react'
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
  Share2
} from 'lucide-react'
import { muviAPI, type Movie } from '@/lib/muvi-api'
import { useRouter, useParams } from 'next/navigation'

export async function generateStaticParams() {
  // Generate static params for all possible movie IDs
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' }
  ]
}

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
  const router = useRouter()
  const params = useParams()
  const movieId = params?.id as string

  useEffect(() => {
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
    
    // Show ads for standard plan
    if (parsedUser.subscription.plan === 'standard') {
      setShowAds(true)
      setTimeout(() => setShowAds(false), 5000) // Hide ads after 5 seconds
    }
  }, [router, movieId])

  const loadMovie = async () => {
    setLoading(true)
    try {
      // Try to fetch from Muvi API first
      const response = await muviAPI.getMovie(movieId)
      
      if (response.success && response.data) {
        setMovie(response.data)
        setDuration(135 * 60) // Default duration in seconds
      } else {
        // Fallback to mock data
        const mockMovies = muviAPI.getMockMovies()
        const foundMovie = mockMovies.find(m => m.id === movieId)
        if (foundMovie) {
          setMovie(foundMovie)
          setDuration(135 * 60) // 2h 15m in seconds
        } else {
          router.push('/browse')
        }
      }
    } catch (error) {
      console.error('Error loading movie:', error)
      // Use mock data as fallback
      const mockMovies = muviAPI.getMockMovies()
      const foundMovie = mockMovies.find(m => m.id === movieId)
      if (foundMovie) {
        setMovie(foundMovie)
        setDuration(135 * 60)
      } else {
        router.push('/browse')
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleTimeUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value)
    setCurrentTime(newTime)
  }

  if (!user || loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  }

  if (!movie) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Movie not found</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Video Player */}
      <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'}`}>
        {/* Ad Overlay for Standard Plan */}
        {showAds && user.subscription.plan === 'standard' && (
          <div className="absolute inset-0 z-40 bg-black/90 flex items-center justify-center">
            <Card className="bg-gray-900 border-gray-700 max-w-md">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Advertisement</CardTitle>
                <CardDescription className="text-gray-400">
                  Upgrade to Premium to enjoy ad-free viewing
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
                  Upgrade to Premium
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Video Element */}
        <video
          className="h-full w-full object-cover"
          poster={movie.thumbnail}
          onTimeUpdate={(e) => setCurrentTime((e.target as HTMLVideoElement).currentTime)}
          onLoadedMetadata={(e) => setDuration((e.target as HTMLVideoElement).duration)}
        >
          <source src={movie.videoUrl || "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761"} type="video/mp4" />
        </video>

        {/* Video Controls */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/browse')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Browse
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
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
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full p-4"
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {/* Progress Bar */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleTimeUpdate}
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
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                
                <span className="text-sm text-white">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
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
              <div className="mb-6 flex items-center gap-4 text-sm">
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                  <Star className="mr-1 h-3 w-3" />
                  {movie.rating}
                </Badge>
                <span>{movie.year}</span>
                <span>{movie.duration}</span>
                <span>{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</span>
              </div>
              <p className="mb-8 text-lg text-gray-300">{movie.description}</p>
              
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
                </div>
              </div>
            </div>
            
            <div>
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Your Plan</CardTitle>
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
                      <div className="rounded-lg bg-yellow-500/10 p-4">
                        <p className="text-sm text-yellow-400">
                          Upgrade to Premium for ad-free viewing and 4K quality
                        </p>
                        <Button
                          onClick={() => router.push('/subscribe')}
                          size="sm"
                          className="mt-2 bg-yellow-600 hover:bg-yellow-700"
                        >
                          Upgrade Now
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}