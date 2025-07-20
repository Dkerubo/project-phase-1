'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Play, Info, LogOut, User, Settings, Star, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { useI18n } from '@/hooks/use-i18n'

// Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Logo from '@/components/ui/logo'
import LanguageSelector from '@/components/ui/language-selector'
import AIChat from '@/components/ui/ai-chat'
import AIRecommendations from '@/components/ui/ai-recommendations'

// Services and Types
import { movieAPI, type Movie, MOVIE_CATEGORIES } from '@/lib/movie-api'
import { authService, type User as UserType } from '@/lib/auth'

export default function Browse() {
  // State
  const [user, setUser] = useState<UserType | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [movies, setMovies] = useState<Movie[]>([])
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([])
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [moviesByCategory, setMoviesByCategory] = useState<{ [key: string]: Movie[] }>({})
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0)
  const [apiStatus, setApiStatus] = useState<string>('')
  const [showAIRecommendations, setShowAIRecommendations] = useState(false)

  // Hooks
  const router = useRouter()
  const { t } = useI18n()

  // Effects
  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push('/')
      return
    }
    
    if (!currentUser.subscription) {
      router.push('/subscribe')
      return
    }
    
    setUser(currentUser)
    loadContent()
  }, [router])

  useEffect(() => {
    if (featuredMovies.length > 1) {
      const interval = setInterval(() => {
        setCurrentFeaturedIndex((prev) => (prev + 1) % featuredMovies.length)
      }, 8000)
      
      return () => clearInterval(interval)
    }
  }, [featuredMovies.length])

  useEffect(() => {
    if (featuredMovies.length > 0) {
      setFeaturedMovie(featuredMovies[currentFeaturedIndex])
    }
  }, [currentFeaturedIndex, featuredMovies])

  // Handlers
  const loadContent = async () => {
    setLoading(true)
    setApiStatus('Loading content...')
    
    try {
      // Load featured movies
      const featuredResponse = await movieAPI.getFeaturedMovies()
      if (featuredResponse.success && featuredResponse.data.length > 0) {
        setFeaturedMovies(featuredResponse.data)
        setFeaturedMovie(featuredResponse.data[0])
      }

      // Load trending movies
      const trendingResponse = await movieAPI.getTrendingMovies()
      if (trendingResponse.success && trendingResponse.data.length > 0) {
        setTrendingMovies(trendingResponse.data)
      }

      // Load movies by category
      const categoryMovies: { [key: string]: Movie[] } = {}
      
      for (const category of MOVIE_CATEGORIES.slice(0, 8)) {
        try {
          const categoryResponse = await movieAPI.getMoviesByGenre(category.name, 1, 10)
          if (categoryResponse.success && categoryResponse.data.length > 0) {
            categoryMovies[category.id] = categoryResponse.data
          }
        } catch (error) {
          console.warn(`Failed to load ${category.name} movies:`, error)
        }
      }
      
      setMoviesByCategory(categoryMovies)

      // Load all movies for search
      const allMoviesResponse = await movieAPI.getMovies(1, 50)
      if (allMoviesResponse.success) {
        setMovies(allMoviesResponse.data)
        setApiStatus('Content loaded successfully ✓')
      } else {
        setApiStatus('Using demo content')
      }
    } catch (error) {
      console.error('Error loading content:', error)
      setApiStatus('Using demo content (API error)')
    } finally {
      setLoading(false)
      setTimeout(() => setApiStatus(''), 3000)
    }
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      const response = await movieAPI.getMovies(1, 50)
      if (response.success) {
        setMovies(response.data)
      }
      return
    }

    setLoading(true)
    try {
      const response = await movieAPI.searchMovies(query)
      
      if (response.success) {
        setMovies(response.data)
      } else {
        setMovies([])
      }
    } catch (error) {
      console.error('Error searching movies:', error)
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  const handleGenreFilter = async (genre: string) => {
    setSelectedGenre(genre)
    
    if (genre === 'all') {
      const response = await movieAPI.getMovies(1, 50)
      if (response.success) {
        setMovies(response.data)
      }
      return
    }

    setLoading(true)
    try {
      const response = await movieAPI.getMoviesByGenre(genre)
      
      if (response.success) {
        setMovies(response.data)
      } else {
        setMovies([])
      }
    } catch (error) {
      console.error('Error filtering by genre:', error)
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
    router.push('/')
  }

  const handlePlayMovie = (movieId: string) => {
    router.push(`/watch/${movieId}`)
  }

  const handleMovieSelect = (movieId: string) => {
    router.push(`/watch/${movieId}`)
  }

  const handleAccountSettings = () => {
    if (user?.role === 'admin') {
      router.push('/dashboard')
    } else {
      router.push('/account')
    }
  }

  const nextFeatured = () => {
    setCurrentFeaturedIndex((prev) => (prev + 1) % featuredMovies.length)
  }

  const prevFeatured = () => {
    setCurrentFeaturedIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)
  }

  // Derived state
  const filteredMovies = searchQuery 
    ? movies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : movies

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">{t('common.loading')}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-gray-800/50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo size="sm" />
            
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" className="text-white hover:text-[#a38725] hover:bg-white/5">
                Home
              </Button>
              <Button variant="ghost" className="text-white hover:text-[#a38725] hover:bg-white/5">
                Movies
              </Button>
              <Button variant="ghost" className="text-white hover:text-[#a38725] hover:bg-white/5">
                TV Shows
              </Button>
              <Button variant="ghost" className="text-white hover:text-[#a38725] hover:bg-white/5">
                My List
              </Button>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
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
                <span className="hidden md:inline">{user.name}</span>
                {user.role === 'admin' && (
                  <Badge className="bg-red-500 text-white text-xs">Admin</Badge>
                )}
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
                        {user.subscription?.plan === 'premium' ? 'Premium' : 'Standard'} Plan
                        {user.subscription?.isFreeTrial && (
                          <div className="text-green-400 text-xs mt-1">Free Trial Active</div>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleAccountSettings}
                        className="flex items-center gap-2 w-full justify-start text-white hover:bg-gray-800/50"
                      >
                        <Settings className="h-4 w-4" />
                        {user.role === 'admin' ? 'Dashboard' : 'Account Settings'}
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
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
            style={{ backgroundImage: `url(${featuredMovie.backdrop})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          
          <div className="relative h-full flex items-center">
            <div className="mx-auto max-w-7xl px-6 py-20">
              <div className="max-w-2xl">
                <h1 className="mb-4 text-6xl font-bold leading-tight animate-fade-in">{featuredMovie.title}</h1>
                <div className="mb-4 flex items-center gap-4 text-sm">
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400 bg-yellow-400/10">
                    <Star className="mr-1 h-3 w-3" />
                    {featuredMovie.rating}
                  </Badge>
                  <span className="text-gray-300">{featuredMovie.year}</span>
                  <span className="text-gray-300">{featuredMovie.duration}</span>
                  <span className="text-gray-300">{Array.isArray(featuredMovie.genre) ? featuredMovie.genre.join(', ') : featuredMovie.genre}</span>
                </div>
                <p className="mb-8 text-lg text-gray-300 leading-relaxed line-clamp-3">{featuredMovie.description}</p>
                
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

          {/* Featured Navigation */}
          {featuredMovies.length > 1 && (
            <>
              <Button
                onClick={prevFeatured}
                variant="ghost"
                size="sm"
                className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                onClick={nextFeatured}
                variant="ghost"
                size="sm"
                className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              {/* Dots indicator */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
                {featuredMovies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeaturedIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentFeaturedIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl px-6 py-12 space-y-12">
        {/* AI Recommendations Section */}
        {user && (
          <AIRecommendations
            userId={user.email}
            viewingHistory={[]}
            preferences={user.preferences}
            onMovieSelect={handleMovieSelect}
          />
        )}

        {/* Genre Filter */}
        <div className="flex items-center gap-4 mb-8">
          <Filter className="h-5 w-5 text-gray-400" />
          <Select value={selectedGenre} onValueChange={handleGenreFilter}>
            <SelectTrigger className="w-48 bg-gray-800/50 border-gray-700/50 text-white">
              <SelectValue placeholder="Filter by genre" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all" className="text-white">All Genres</SelectItem>
              {MOVIE_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.name} className="text-white">
                  {category.icon} {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Trending Now */}
        {trendingMovies.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              🔥 Trending Now
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {trendingMovies.map((movie) => (
                <Card
                  key={movie.id}
                  className="group relative overflow-hidden border-0 bg-gray-900/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer flex-shrink-0 w-64"
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
          </section>
        )}

        {/* Movie Categories */}
        {Object.entries(moviesByCategory).map(([categoryId, categoryMovies]) => {
          const category = MOVIE_CATEGORIES.find(cat => cat.id === categoryId)
          if (!category || categoryMovies.length === 0) return null

          return (
            <section key={categoryId}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                {category.icon} {category.name}
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {categoryMovies.map((movie) => (
                  <Card
                    key={movie.id}
                    className="group relative overflow-hidden border-0 bg-gray-900/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer flex-shrink-0 w-48"
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
                    
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-white group-hover:text-gray-200 transition-colors line-clamp-1 text-sm">
                        {movie.title}
                      </h3>
                      <div className="mt-1 text-xs text-gray-400">
                        {movie.year}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )
        })}

        {/* Search Results or All Movies */}
        {(searchQuery || selectedGenre !== 'all') && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                {searchQuery ? `Search Results for "${searchQuery}"` : `${selectedGenre} Movies`}
              </h2>
              <div className="text-sm text-gray-400">
                {filteredMovies.length} {t('browse.moviesAvailable')}
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
            
            {filteredMovies.length === 0 && (searchQuery || selectedGenre !== 'all') && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  {searchQuery 
                    ? `${t('browse.noMoviesFound')} "${searchQuery}"` 
                    : `No ${selectedGenre} movies found`
                  }
                </p>
              </div>
            )}
          </section>
        )}
      </div>

      {/* AI Chat Assistant */}
      <AIChat />

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  )
}