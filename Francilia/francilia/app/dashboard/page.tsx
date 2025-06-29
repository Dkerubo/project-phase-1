'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Users, 
  Play, 
  DollarSign, 
  TrendingUp, 
  Search,
  MoreHorizontal,
  Eye,
  Star,
  Crown,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Settings,
  Bell,
  LogOut,
  BarChart3,
  PieChart,
  Activity,
  Plus,
  Edit,
  Trash2,
  Save,
  TestTube,
  Wifi,
  WifiOff,
  Shield,
  AlertTriangle,
  Upload,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  RefreshCw,
  Database,
  Trash,
  Import
} from 'lucide-react'
import Logo from '@/components/ui/logo'
import LanguageSelector from '@/components/ui/language-selector'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/hooks/use-i18n'
import { movieAPI, type Movie, type MovieStats } from '@/lib/movie-api'
import { authService, type User } from '@/lib/auth'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')
  const [movies, setMovies] = useState<Movie[]>([])
  const [movieStats, setMovieStats] = useState<MovieStats | null>(null)
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [showAddMovie, setShowAddMovie] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [selectedMovies, setSelectedMovies] = useState<string[]>([])
  const [apiKey, setApiKey] = useState('17502009686851f288856ff120251848')
  const [newApiKey, setNewApiKey] = useState('')
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'testing'>('connected')
  const [loading, setLoading] = useState(true)
  const [operationLoading, setOperationLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [newMovie, setNewMovie] = useState<Partial<Movie>>({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    genre: [],
    rating: 0,
    duration: '',
    thumbnail: '',
    backdrop: '',
    videoUrl: '',
    cast: [],
    director: '',
    language: 'English',
    country: 'USA'
  })
  const router = useRouter()
  const { t } = useI18n()

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push('/')
      return
    }
    
    // Only allow admin access
    if (currentUser.role !== 'admin') {
      router.push('/account')
      return
    }
    
    setUser(currentUser)
    loadMovies()
    loadMovieStats()
    testApiConnection()
    setLoading(false)
  }, [router])

  const loadMovies = async (page: number = 1) => {
    setOperationLoading(true)
    try {
      const response = await movieAPI.getMovies(page, 20)
      if (response.success) {
        setMovies(response.data)
        setCurrentPage(page)
        setTotalPages(response.totalPages || 1)
      }
    } catch (error) {
      console.error('Error loading movies:', error)
    } finally {
      setOperationLoading(false)
    }
  }

  const loadMovieStats = async () => {
    try {
      const response = await movieAPI.getMovieStats()
      if (response.success) {
        setMovieStats(response.data)
      }
    } catch (error) {
      console.error('Error loading movie stats:', error)
    }
  }

  const testApiConnection = async () => {
    setApiStatus('testing')
    try {
      const response = await movieAPI.getMovies(1, 1)
      setApiStatus(response.success ? 'connected' : 'disconnected')
    } catch (error) {
      setApiStatus('disconnected')
    }
  }

  const handleLogout = () => {
    authService.logout()
    router.push('/')
  }

  const handleAddMovie = async () => {
    if (!newMovie.title || !newMovie.description) return
    
    setOperationLoading(true)
    try {
      const response = await movieAPI.createMovie(newMovie)
      if (response.success) {
        setMovies([response.data, ...movies])
        setNewMovie({
          title: '',
          description: '',
          year: new Date().getFullYear(),
          genre: [],
          rating: 0,
          duration: '',
          thumbnail: '',
          backdrop: '',
          videoUrl: '',
          cast: [],
          director: '',
          language: 'English',
          country: 'USA'
        })
        setShowAddMovie(false)
        loadMovieStats()
      }
    } catch (error) {
      console.error('Error adding movie:', error)
    } finally {
      setOperationLoading(false)
    }
  }

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie)
  }

  const handleUpdateMovie = async () => {
    if (!editingMovie) return
    
    setOperationLoading(true)
    try {
      const response = await movieAPI.updateMovie(editingMovie.id, editingMovie)
      if (response.success) {
        setMovies(movies.map(m => m.id === editingMovie.id ? response.data : m))
        setEditingMovie(null)
        loadMovieStats()
      }
    } catch (error) {
      console.error('Error updating movie:', error)
    } finally {
      setOperationLoading(false)
    }
  }

  const handleDeleteMovie = async (movieId: string) => {
    if (!confirm('Are you sure you want to delete this movie?')) return
    
    setOperationLoading(true)
    try {
      const response = await movieAPI.deleteMovie(movieId)
      if (response.success) {
        setMovies(movies.filter(m => m.id !== movieId))
        loadMovieStats()
      }
    } catch (error) {
      console.error('Error deleting movie:', error)
    } finally {
      setOperationLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedMovies.length === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedMovies.length} movies?`)) return
    
    setOperationLoading(true)
    try {
      const response = await movieAPI.bulkDeleteMovies(selectedMovies)
      if (response.success) {
        setMovies(movies.filter(m => !selectedMovies.includes(m.id)))
        setSelectedMovies([])
        setShowBulkActions(false)
        loadMovieStats()
      }
    } catch (error) {
      console.error('Error bulk deleting movies:', error)
    } finally {
      setOperationLoading(false)
    }
  }

  const handleImportMovies = async (count: number) => {
    setOperationLoading(true)
    try {
      const response = await movieAPI.importMoviesFromTMDB(count)
      if (response.success) {
        loadMovies()
        loadMovieStats()
        setShowImportDialog(false)
      }
    } catch (error) {
      console.error('Error importing movies:', error)
    } finally {
      setOperationLoading(false)
    }
  }

  const handleUpdateApiKey = () => {
    if (newApiKey.trim()) {
      setApiKey(newApiKey)
      setNewApiKey('')
      testApiConnection()
    }
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadMovies()
      return
    }
    
    setOperationLoading(true)
    try {
      const response = await movieAPI.searchMovies(query)
      if (response.success) {
        setMovies(response.data)
      }
    } catch (error) {
      console.error('Error searching movies:', error)
    } finally {
      setOperationLoading(false)
    }
  }

  // Mock dashboard data
  const dashboardStats = {
    totalUsers: 45672,
    activeSubscriptions: 38945,
    totalRevenue: 425680,
    contentViews: movieStats?.totalViews || 892340,
    premiumUsers: 28456,
    standardUsers: 10489,
    newSignups: 1234,
    churnRate: 2.3
  }

  const recentUsers = [
    { name: "John Smith", email: "john@example.com", plan: "premium", joinDate: "2024-01-15", status: "active" },
    { name: "Sarah Johnson", email: "sarah@example.com", plan: "standard", joinDate: "2024-01-14", status: "active" },
    { name: "Mike Wilson", email: "mike@example.com", plan: "premium", joinDate: "2024-01-13", status: "cancelled" },
    { name: "Emma Davis", email: "emma@example.com", plan: "standard", joinDate: "2024-01-12", status: "active" }
  ]

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">{t('common.loading')}</div>
    </div>
  }

  if (!user || user.role !== 'admin') {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center text-white">
        <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-4">You don't have permission to access this page.</p>
        <Button onClick={() => router.push('/browse')} className="text-white" style={{ backgroundColor: '#a38725' }}>
          Go to Browse
        </Button>
      </div>
    </div>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-gray-900/30 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo size="sm" />
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" className="text-white hover:text-[#a38725] hover:bg-white/5">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
              <Button variant="ghost" className="text-white hover:text-[#a38725] hover:bg-white/5">
                <Users className="mr-2 h-4 w-4" />
                Users
              </Button>
              <Button variant="ghost" className="text-white hover:text-[#a38725] hover:bg-white/5">
                <Play className="mr-2 h-4 w-4" />
                Content
              </Button>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  handleSearch(e.target.value)
                }}
                className="pl-10 bg-gray-800/50 border-gray-700/50 text-white w-64 backdrop-blur-sm"
              />
            </div>
            
            <LanguageSelector />
            
            <Badge className="bg-green-500 text-white">
              <Crown className="mr-1 h-3 w-3" />
              Admin
            </Badge>
            
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Bell className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {t('dashboard.welcomeBack')}, <span style={{ color: '#a38725' }}>{user.name}</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Complete platform control and analytics dashboard
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Badge className="bg-red-500 text-white">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Admin Access
            </Badge>
            <div className="flex items-center gap-2">
              {apiStatus === 'connected' ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : apiStatus === 'testing' ? (
                <TestTube className="h-4 w-4 text-yellow-500 animate-pulse" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm text-gray-400">
                API Status: {apiStatus === 'connected' ? 'Connected' : apiStatus === 'testing' ? 'Testing...' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex items-center gap-4 flex-wrap">
          <Dialog open={showAddMovie} onOpenChange={setShowAddMovie}>
            <DialogTrigger asChild>
              <Button 
                className="text-white hover:opacity-90"
                style={{ backgroundColor: '#a38725' }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Movie
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Movie</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Add a new movie to your content library
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-white">Movie Title</Label>
                    <Input
                      id="title"
                      value={newMovie.title}
                      onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="year" className="text-white">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={newMovie.year}
                      onChange={(e) => setNewMovie({...newMovie, year: parseInt(e.target.value)})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={newMovie.description}
                    onChange={(e) => setNewMovie({...newMovie, description: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="rating" className="text-white">Rating</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      max="10"
                      value={newMovie.rating}
                      onChange={(e) => setNewMovie({...newMovie, rating: parseFloat(e.target.value)})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration" className="text-white">Duration</Label>
                    <Input
                      id="duration"
                      value={newMovie.duration}
                      onChange={(e) => setNewMovie({...newMovie, duration: e.target.value})}
                      placeholder="2h 30m"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="director" className="text-white">Director</Label>
                    <Input
                      id="director"
                      value={newMovie.director}
                      onChange={(e) => setNewMovie({...newMovie, director: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="thumbnail" className="text-white">Thumbnail URL</Label>
                    <Input
                      id="thumbnail"
                      value={newMovie.thumbnail}
                      onChange={(e) => setNewMovie({...newMovie, thumbnail: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="videoUrl" className="text-white">Video URL</Label>
                    <Input
                      id="videoUrl"
                      value={newMovie.videoUrl}
                      onChange={(e) => setNewMovie({...newMovie, videoUrl: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleAddMovie}
                  disabled={operationLoading}
                  className="text-white hover:opacity-90"
                  style={{ backgroundColor: '#a38725' }}
                >
                  {operationLoading ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Movie
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                <Import className="mr-2 h-4 w-4" />
                Import from TMDB
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Import Movies from TMDB</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Import popular movies from The Movie Database
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex gap-4">
                  <Button
                    onClick={() => handleImportMovies(20)}
                    disabled={operationLoading}
                    className="flex-1 text-white hover:opacity-90"
                    style={{ backgroundColor: '#a38725' }}
                  >
                    {operationLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    Import 20 Movies
                  </Button>
                  <Button
                    onClick={() => handleImportMovies(50)}
                    disabled={operationLoading}
                    className="flex-1 text-white hover:opacity-90"
                    style={{ backgroundColor: '#a38725' }}
                  >
                    {operationLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    Import 50 Movies
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {selectedMovies.length > 0 && (
            <Button
              onClick={handleBulkDelete}
              variant="destructive"
              disabled={operationLoading}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Selected ({selectedMovies.length})
            </Button>
          )}

          <Button
            onClick={() => loadMovies()}
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
            disabled={operationLoading}
          >
            {operationLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Movies</CardTitle>
              <Play className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{movieStats?.totalMovies || 0}</div>
              <div className="flex items-center text-xs text-green-500 mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +{movies.filter(m => m.createdAt && new Date(m.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} this week
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardStats.contentViews.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-500 mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +15.3% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{movieStats?.averageRating?.toFixed(1) || '0.0'}</div>
              <div className="flex items-center text-xs text-green-500 mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +0.2 from last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Users</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardStats.activeSubscriptions.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-500 mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8.2% from last month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Management */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2">
            <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Database className="h-5 w-5" style={{ color: '#a38725' }} />
                    Movie Library ({movies.length})
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMovies(selectedMovies.length === movies.length ? [] : movies.map(m => m.id))}
                      className="text-gray-400 hover:text-white"
                    >
                      {selectedMovies.length === movies.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {movies.map((movie) => (
                    <div key={movie.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedMovies.includes(movie.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMovies([...selectedMovies, movie.id])
                          } else {
                            setSelectedMovies(selectedMovies.filter(id => id !== movie.id))
                          }
                        }}
                        className="rounded border-gray-600 bg-gray-700 text-[#a38725]"
                      />
                      <img
                        src={movie.thumbnail}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500'
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-sm">{movie.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                          <span>{movie.year}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            {movie.rating}
                          </div>
                          <span>•</span>
                          <span>{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditMovie(movie)}
                          className="text-gray-400 hover:text-white h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMovie(movie.id)}
                          className="text-red-400 hover:text-red-300 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadMovies(currentPage - 1)}
                      disabled={currentPage === 1 || operationLoading}
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadMovies(currentPage + 1)}
                      disabled={currentPage === totalPages || operationLoading}
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Top Genres */}
            <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <PieChart className="h-5 w-5" style={{ color: '#a38725' }} />
                  Top Genres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {movieStats?.topGenres.map((genre, index) => (
                  <div key={genre.genre} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                      />
                      <span className="text-white">{genre.genre}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">{genre.count}</div>
                      <div className="text-xs text-gray-400">
                        {((genre.count / (movieStats?.totalMovies || 1)) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">API Connection</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        apiStatus === 'connected' ? 'bg-green-500' : 
                        apiStatus === 'testing' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-white font-semibold">
                        {apiStatus === 'connected' ? 'Connected' :
                         apiStatus === 'testing' ? 'Testing...' :
                         'Disconnected'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Database</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-white font-semibold">Operational</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Content Delivery</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-white font-semibold">Optimal</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-800">
                  <Button 
                    onClick={testApiConnection}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white"
                    disabled={apiStatus === 'testing'}
                  >
                    {apiStatus === 'testing' ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <TestTube className="mr-2 h-4 w-4" />
                    )}
                    Test All Systems
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Analytics Charts */}
        {movieStats && (
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Views by Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {movieStats.viewsByMonth.map((item, index) => (
                    <div key={item.month} className="flex items-center justify-between">
                      <span className="text-gray-300">{item.month}</span>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-2 bg-[#a38725] rounded"
                          style={{ width: `${(item.views / Math.max(...movieStats.viewsByMonth.map(v => v.views))) * 100}px` }}
                        />
                        <span className="text-white font-semibold w-16 text-right">
                          {item.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {movieStats.ratingDistribution.map((item, index) => (
                    <div key={item.rating} className="flex items-center justify-between">
                      <span className="text-gray-300">{item.rating} stars</span>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-2 bg-yellow-500 rounded"
                          style={{ width: `${(item.count / Math.max(...movieStats.ratingDistribution.map(r => r.count))) * 100}px` }}
                        />
                        <span className="text-white font-semibold w-12 text-right">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Edit Movie Dialog */}
      {editingMovie && (
        <Dialog open={!!editingMovie} onOpenChange={() => setEditingMovie(null)}>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Movie</DialogTitle>
              <DialogDescription className="text-gray-400">
                Edit movie details
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title" className="text-white">Movie Title</Label>
                  <Input
                    id="edit-title"
                    value={editingMovie.title}
                    onChange={(e) => setEditingMovie({...editingMovie, title: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-year" className="text-white">Year</Label>
                  <Input
                    id="edit-year"
                    type="number"
                    value={editingMovie.year}
                    onChange={(e) => setEditingMovie({...editingMovie, year: parseInt(e.target.value)})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description" className="text-white">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingMovie.description}
                  onChange={(e) => setEditingMovie({...editingMovie, description: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-rating" className="text-white">Rating</Label>
                  <Input
                    id="edit-rating"
                    type="number"
                    step="0.1"
                    max="10"
                    value={editingMovie.rating}
                    onChange={(e) => setEditingMovie({...editingMovie, rating: parseFloat(e.target.value)})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-duration" className="text-white">Duration</Label>
                  <Input
                    id="edit-duration"
                    value={editingMovie.duration}
                    onChange={(e) => setEditingMovie({...editingMovie, duration: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-director" className="text-white">Director</Label>
                  <Input
                    id="edit-director"
                    value={editingMovie.director}
                    onChange={(e) => setEditingMovie({...editingMovie, director: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <Button 
                onClick={handleUpdateMovie}
                disabled={operationLoading}
                className="text-white hover:opacity-90"
                style={{ backgroundColor: '#a38725' }}
              >
                {operationLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}