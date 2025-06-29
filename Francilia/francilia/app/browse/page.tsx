'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Play, Info, LogOut, User, Settings, Star } from 'lucide-react'
import Logo from '@/components/ui/logo'
import LanguageSelector from '@/components/ui/language-selector'
import { muviAPI, type Movie } from '@/lib/muvi-api'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/hooks/use-i18n'

export default function Browse() {
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [loading, setLoading] = useState(true)
  const [apiStatus, setApiStatus] = useState<string>('')
  const router = useRouter()
  const { t } = useI18n()

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
    loadMovies()
  }, [router])

  const loadMovies = async () => {
    setLoading(true)
    setApiStatus('Connecting to Muvi API...')
    
    try {
      console.log('Starting to load movies from Muvi API...')
      
      const response = await muviAPI.getMovies(1, 20)
      console.log('Muvi API response:', response)
      
      if (response.success && response.data && response.data.length > 0) {
        console.log('Successfully loaded movies from Muvi API:', response.data.length)
        setApiStatus('Connected to Muvi API ✓')
        setMovies(response.data)
        setFeaturedMovie(response.data[0])
      } else {
        console.log('Muvi API returned no data, using mock data')
        setApiStatus('Using demo content (Muvi API unavailable)')
        const mockMovies = muviAPI.getMockMovies()
        setMovies(mockMovies)
        setFeaturedMovie(mockMovies[0])
      }
    } catch (error) {
      console.error('Error loading movies:', error)
      setApiStatus('Using demo content (API error)')
      const mockMovies = muviAPI.getMockMovies()
      setMovies(mockMovies)
      setFeaturedMovie(mockMovies[0])
    } finally {
      setLoading(false)
      setTimeout(() => setApiStatus(''), 3000)
    }
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadMovies()
      return
    }

    setLoading(true)
    try {
      const response = await muviAPI.searchMovies(query)
      
      if (response.success && response.data.length > 0) {
        setMovies(response.data)
      } else {
        const mockMovies = muviAPI.getMockMovies()
        const filtered = mockMovies.filter(movie =>
          movie.title.toLowerCase().includes(query.toLowerCase()) ||
          movie.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
        )
        setMovies(filtered)
      }
    } catch (error) {
      console.error('Error searching movies:', error)
      const mockMovies = muviAPI.getMockMovies()
      const filtered = mockMovies.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
      )
      setMovies(filtered)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('francilia_user')
    router.push('/')
  }

  const handlePlayMovie = (movieId: string) => {
    router.push(`/watch/${movieId}`)
  }

  const filteredMovies = searchQuery 
    ? movies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : movies

  if (!user) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">{t('common.loading')}</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-gray-800/50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Logo size="sm" />
          
          <div className="flex items-center gap-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t('browse.searchMovies')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  handleSearch(e.target.value)
                }}
                className="pl-10 bg-gray-800/50 border-gray-700/50 text-white w-80 backdrop-blur-sm focus:bg-gray-800/80 transition-all"
              />
            </div>
            
            <LanguageSelector />
            
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 text-white hover:bg-white/10 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>{user.name}</span>
              </Button>
              
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl z-50">
                    <div className="p-2">
                      <div className="px-3 py-2 text-sm text-gray-400 border-b border-gray-700 mb-2">
                        {user.subscription.plan === 'premium' ? 'Premium' : 'Standard'} Plan
                        {user.subscription.isFreeTrial && (
                          <div className="text-green-400 text-xs mt-1">Free Trial Active</div>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="flex items-center gap-2 w-full justify-start text-white hover:bg-gray-800/50"
                      >
                        <Settings className="h-4 w-4" />
                        {t('nav.settings')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full justify-start text-red-400 hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        {t('nav.logout')}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* API Status */}
      {apiStatus && (
        <div className="fixed top-20 right-6 z-40 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2 text-sm text-white shadow-lg">
          {apiStatus}
        </div>
      )}

      {/* Featured Movie Hero */}
      {featuredMovie && (
        <div className="relative h-screen">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${featuredMovie.backdrop})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          
          <div className="relative h-full flex items-center">
            <div className="mx-auto max-w-7xl px-6 py-20">
              <div className="max-w-2xl">
                <h1 className="mb-4 text-6xl font-bold leading-tight">{featuredMovie.title}</h1>
                <div className="mb-4 flex items-center gap-4 text-sm">
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400 bg-yellow-400/10">
                    <Star className="mr-1 h-3 w-3" />
                    {featuredMovie.rating}
                  </Badge>
                  <span className="text-gray-300">{featuredMovie.year}</span>
                  <span className="text-gray-300">{featuredMovie.duration}</span>
                  <span className="text-gray-300">{Array.isArray(featuredMovie.genre) ? featuredMovie.genre.join(', ') : featuredMovie.genre}</span>
                </div>
                <p className="mb-8 text-lg text-gray-300 leading-relaxed">{featuredMovie.description}</p>
                
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => handlePlayMovie(featuredMovie.id)}
                    size="lg"
                    className="bg-white text-black hover:bg-gray-200 px-8 py-4 text-lg font-semibold transition-all hover:scale-105"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    {t('browse.playNow')}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/50 text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all hover:scale-105"
                  >
                    <Info className="mr-2 h-5 w-5" />
                    {t('browse.moreInfo')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movie Grid */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">
            {searchQuery ? t('browse.searchResults') : t('browse.latestMovies')}
          </h2>
          <div className="text-sm text-gray-400">
            {movies.length} {t('browse.moviesAvailable')}
          </div>
        </div>
        
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredMovies.map((movie) => (
              <Card
                key={movie.id}
                className="group relative overflow-hidden border-0 bg-gray-900/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-900/50 cursor-pointer"
                onClick={() => handlePlayMovie(movie.id)}
              >
                <div className="aspect-[2/3] relative">
                  <img
                    src={movie.thumbnail}
                    alt={movie.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300" />
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      className="bg-white text-black hover:bg-gray-200 shadow-lg"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      {t('browse.play')}
                    </Button>
                  </div>
                  
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-black/80 text-white backdrop-blur-sm">
                      <Star className="mr-1 h-3 w-3 text-yellow-400" />
                      {movie.rating}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white group-hover:text-gray-200 transition-colors line-clamp-1">
                    {movie.title}
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-400">
                    <span>{movie.year}</span>
                    <span>{Array.isArray(movie.genre) ? movie.genre[0] : movie.genre}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {filteredMovies.length === 0 && searchQuery && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">{t('browse.noMoviesFound')} "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  )
}