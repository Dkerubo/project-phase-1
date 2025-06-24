'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Play, Plus, Info, LogOut, User, Settings, Star } from 'lucide-react'
import Logo from '@/components/ui/logo'
import { muviAPI, type Movie } from '@/lib/muvi-api'
import { useRouter } from 'next/navigation'

export default function Browse() {
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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
    try {
      // Try to fetch from Muvi API first
      const response = await muviAPI.getMovies(1, 20)
      
      if (response.success && response.data.length > 0) {
        setMovies(response.data)
        setFeaturedMovie(response.data[0])
      } else {
        // Fallback to mock data if API fails
        const mockMovies = muviAPI.getMockMovies()
        setMovies(mockMovies)
        setFeaturedMovie(mockMovies[0])
      }
    } catch (error) {
      console.error('Error loading movies:', error)
      // Use mock data as fallback
      const mockMovies = muviAPI.getMockMovies()
      setMovies(mockMovies)
      setFeaturedMovie(mockMovies[0])
    } finally {
      setLoading(false)
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
        // Filter mock data for search
        const mockMovies = muviAPI.getMockMovies()
        const filtered = mockMovies.filter(movie =>
          movie.title.toLowerCase().includes(query.toLowerCase()) ||
          movie.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
        )
        setMovies(filtered)
      }
    } catch (error) {
      console.error('Error searching movies:', error)
      // Filter mock data as fallback
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
      <div className="text-white">Loading...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Logo size="sm" />
          
          <div className="flex items-center gap-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  handleSearch(e.target.value)
                }}
                className="pl-10 bg-gray-800 border-gray-700 text-white w-80"
              />
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-full bg-gray-800 px-4 py-2 hover:bg-gray-700 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>{user.name}</span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-md shadow-lg">
                  <div className="p-2">
                    <div className="px-3 py-2 text-sm text-gray-400">
                      {user.subscription.plan === 'premium' ? 'Premium' : 'Standard'} Plan
                    </div>
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-800 rounded">
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-800 rounded text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Featured Movie Hero */}
      {featuredMovie && (
        <div className="relative h-screen">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${featuredMovie.backdrop})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
          
          <div className="relative h-full flex items-center">
            <div className="mx-auto max-w-7xl px-6 py-20">
              <div className="max-w-2xl">
                <h1 className="mb-4 text-6xl font-bold">{featuredMovie.title}</h1>
                <div className="mb-4 flex items-center gap-4 text-sm">
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                    <Star className="mr-1 h-3 w-3" />
                    {featuredMovie.rating}
                  </Badge>
                  <span>{featuredMovie.year}</span>
                  <span>{featuredMovie.duration}</span>
                  <span>{Array.isArray(featuredMovie.genre) ? featuredMovie.genre.join(', ') : featuredMovie.genre}</span>
                </div>
                <p className="mb-8 text-lg text-gray-300">{featuredMovie.description}</p>
                
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => handlePlayMovie(featuredMovie.id)}
                    size="lg"
                    className="bg-white text-black hover:bg-gray-200 px-8 py-4 text-lg font-semibold"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Play Now
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold"
                  >
                    <Info className="mr-2 h-5 w-5" />
                    More Info
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movie Grid */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-8 text-3xl font-bold">
          {searchQuery ? 'Search Results' : 'Latest Movies'}
        </h2>
        
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredMovies.map((movie) => (
              <Card
                key={movie.id}
                className="group relative overflow-hidden border-0 bg-gray-900/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                onClick={() => handlePlayMovie(movie.id)}
              >
                <div className="aspect-[2/3] relative">
                  <img
                    src={movie.thumbnail}
                    alt={movie.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300" />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      className="bg-white text-black hover:bg-gray-200"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Play
                    </Button>
                  </div>
                  
                  {/* Rating badge */}
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-black/80 text-white">
                      <Star className="mr-1 h-3 w-3 text-yellow-400" />
                      {movie.rating}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white group-hover:transition-colors">
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
            <p className="text-gray-400 text-lg">No movies found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  )
}