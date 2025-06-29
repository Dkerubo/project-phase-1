'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  WifiOff
} from 'lucide-react'
import Logo from '@/components/ui/logo'
import LanguageSelector from '@/components/ui/language-selector'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/hooks/use-i18n'
import { muviAPI, type Movie } from '@/lib/muvi-api'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')
  const [movies, setMovies] = useState<Movie[]>([])
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [showAddMovie, setShowAddMovie] = useState(false)
  const [showApiSettings, setShowApiSettings] = useState(false)
  const [apiKey, setApiKey] = useState('17502009686851f288856ff120251848')
  const [newApiKey, setNewApiKey] = useState('')
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'testing'>('disconnected')
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
    const userData = localStorage.getItem('francilia_user')
    if (!userData) {
      router.push('/')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    loadMovies()
    testApiConnection()
  }, [router])

  const loadMovies = async () => {
    try {
      const response = await muviAPI.getMovies(1, 50)
      if (response.success && response.data) {
        setMovies(response.data)
      }
    } catch (error) {
      console.error('Error loading movies:', error)
    }
  }

  const testApiConnection = async () => {
    setApiStatus('testing')
    try {
      const response = await muviAPI.getMovies(1, 1)
      setApiStatus(response.success ? 'connected' : 'disconnected')
    } catch (error) {
      setApiStatus('disconnected')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('francilia_user')
    router.push('/')
  }

  const handleAddMovie = async () => {
    if (!newMovie.title || !newMovie.description) return
    
    const movieToAdd: Movie = {
      id: Math.random().toString(36).substr(2, 9),
      title: newMovie.title || '',
      description: newMovie.description || '',
      year: newMovie.year || new Date().getFullYear(),
      genre: Array.isArray(newMovie.genre) ? newMovie.genre : [newMovie.genre as string].filter(Boolean),
      rating: newMovie.rating || 0,
      duration: newMovie.duration || '2h 0m',
      thumbnail: newMovie.thumbnail || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500',
      backdrop: newMovie.backdrop || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1200',
      videoUrl: newMovie.videoUrl,
      cast: Array.isArray(newMovie.cast) ? newMovie.cast : [newMovie.cast as string].filter(Boolean),
      director: newMovie.director || 'Unknown Director',
      language: newMovie.language || 'English',
      country: newMovie.country || 'USA'
    }
    
    setMovies([movieToAdd, ...movies])
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
  }

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie)
  }

  const handleUpdateMovie = () => {
    if (!editingMovie) return
    
    setMovies(movies.map(m => m.id === editingMovie.id ? editingMovie : m))
    setEditingMovie(null)
  }

  const handleDeleteMovie = (movieId: string) => {
    setMovies(movies.filter(m => m.id !== movieId))
  }

  const handleUpdateApiKey = () => {
    if (newApiKey.trim()) {
      setApiKey(newApiKey)
      setNewApiKey('')
      setShowApiSettings(false)
      testApiConnection()
    }
  }

  // Mock dashboard data
  const dashboardStats = {
    totalUsers: 45672,
    activeSubscriptions: 38945,
    totalRevenue: 425680,
    contentViews: 892340,
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

  if (!user) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">{t('common.loading')}</div>
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
                placeholder="Search dashboard..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700/50 text-white w-64 backdrop-blur-sm"
              />
            </div>
            
            <LanguageSelector />
            
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
            {t('dashboard.happeningToday')}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex items-center gap-4">
          <Dialog open={showAddMovie} onOpenChange={setShowAddMovie}>
            <DialogTrigger asChild>
              <Button 
                className="text-white hover:opacity-90"
                style={{ backgroundColor: '#a38725' }}
              >
                <Plus className="mr-2 h-4 w-4" />
                {t('dashboard.addNewMovie')}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">{t('dashboard.addNewMovie')}</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Add a new movie to your content library
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-white">{t('dashboard.movieTitle')}</Label>
                    <Input
                      id="title"
                      value={newMovie.title}
                      onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="year" className="text-white">{t('dashboard.movieYear')}</Label>
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
                  <Label htmlFor="description" className="text-white">{t('dashboard.movieDescription')}</Label>
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
                    <Label htmlFor="rating" className="text-white">{t('dashboard.movieRating')}</Label>
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
                    <Label htmlFor="duration" className="text-white">{t('dashboard.movieDuration')}</Label>
                    <Input
                      id="duration"
                      value={newMovie.duration}
                      onChange={(e) => setNewMovie({...newMovie, duration: e.target.value})}
                      placeholder="2h 30m"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="director" className="text-white">{t('dashboard.director')}</Label>
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
                    <Label htmlFor="thumbnail" className="text-white">{t('dashboard.thumbnailUrl')}</Label>
                    <Input
                      id="thumbnail"
                      value={newMovie.thumbnail}
                      onChange={(e) => setNewMovie({...newMovie, thumbnail: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="videoUrl" className="text-white">{t('dashboard.videoUrl')}</Label>
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
                  className="text-white hover:opacity-90"
                  style={{ backgroundColor: '#a38725' }}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {t('dashboard.saveChanges')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showApiSettings} onOpenChange={setShowApiSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                <Settings className="mr-2 h-4 w-4" />
                {t('dashboard.apiSettings')}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">{t('dashboard.apiSettings')}</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Manage your Muvi API configuration
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {apiStatus === 'connected' ? (
                      <Wifi className="h-4 w-4 text-green-500" />
                    ) : apiStatus === 'testing' ? (
                      <TestTube className="h-4 w-4 text-yellow-500 animate-pulse" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-400">
                      {t('dashboard.connectionStatus')}: {
                        apiStatus === 'connected' ? t('dashboard.connected') :
                        apiStatus === 'testing' ? 'Testing...' :
                        t('dashboard.disconnected')
                      }
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={testApiConnection}
                    className="border-gray-700 text-white hover:bg-gray-800"
                  >
                    {t('dashboard.testConnection')}
                  </Button>
                </div>
                <div>
                  <Label htmlFor="currentApiKey" className="text-white">{t('dashboard.currentApiKey')}</Label>
                  <Input
                    id="currentApiKey"
                    value={apiKey}
                    readOnly
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="newApiKey" className="text-white">{t('dashboard.newApiKey')}</Label>
                  <Input
                    id="newApiKey"
                    value={newApiKey}
                    onChange={(e) => setNewApiKey(e.target.value)}
                    placeholder="Enter new API key"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <Button 
                  onClick={handleUpdateApiKey}
                  className="text-white hover:opacity-90"
                  style={{ backgroundColor: '#a38725' }}
                >
                  {t('dashboard.updateApiKey')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">{t('dashboard.totalUsers')}</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardStats.totalUsers.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-500 mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.5% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">{t('dashboard.activeSubscriptions')}</CardTitle>
              <Crown className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardStats.activeSubscriptions.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-500 mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8.2% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">{t('dashboard.monthlyRevenue')}</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${dashboardStats.totalRevenue.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-500 mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +15.3% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">{t('dashboard.contentViews')}</CardTitle>
              <Eye className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardStats.contentViews.toLocaleString()}</div>
              <div className="flex items-center text-xs text-red-500 mt-1">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -2.1% from last month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Management */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Play className="h-5 w-5" style={{ color: '#a38725' }} />
                {t('dashboard.contentManagement')}
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your movie library
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {movies.slice(0, 5).map((movie) => (
                  <div key={movie.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                    <img
                      src={movie.thumbnail}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded"
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
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PieChart className="h-5 w-5" style={{ color: '#a38725' }} />
                {t('dashboard.subscriptionPlans')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4" style={{ color: '#a38725' }} />
                  <span className="text-white">Premium</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{dashboardStats.premiumUsers.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">73.1%</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-white">Standard</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{dashboardStats.standardUsers.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">26.9%</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">New Signups (7d)</span>
                  <span className="text-green-500 font-semibold">+{dashboardStats.newSignups}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-400">Churn Rate</span>
                  <span className="text-red-500 font-semibold">{dashboardStats.churnRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                {t('dashboard.recentUsers')}
              </CardTitle>
              <CardDescription className="text-gray-400">
                Latest user registrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ background: 'linear-gradient(135deg, #a38725, #d4af37)' }}
                      >
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        style={{ 
                          backgroundColor: user.plan === 'premium' ? '#a38725' : '#ca8a04',
                          color: 'white'
                        }}
                      >
                        {user.plan}
                      </Badge>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                {t('dashboard.systemHealth')}
              </CardTitle>
              <CardDescription className="text-gray-400">
                Platform performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Server Uptime</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-white font-semibold">99.9%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">API Response Time</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-white font-semibold">145ms</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">CDN Performance</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-white font-semibold">Good</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Muvi API Status</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      apiStatus === 'connected' ? 'bg-green-500' : 
                      apiStatus === 'testing' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-white font-semibold">
                      {apiStatus === 'connected' ? t('dashboard.connected') :
                       apiStatus === 'testing' ? 'Testing...' :
                       t('dashboard.disconnected')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-800">
                <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white">
                  View Detailed Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Movie Dialog */}
      {editingMovie && (
        <Dialog open={!!editingMovie} onOpenChange={() => setEditingMovie(null)}>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">{t('dashboard.editMovie')}</DialogTitle>
              <DialogDescription className="text-gray-400">
                Edit movie details
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title" className="text-white">{t('dashboard.movieTitle')}</Label>
                  <Input
                    id="edit-title"
                    value={editingMovie.title}
                    onChange={(e) => setEditingMovie({...editingMovie, title: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-year" className="text-white">{t('dashboard.movieYear')}</Label>
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
                <Label htmlFor="edit-description" className="text-white">{t('dashboard.movieDescription')}</Label>
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
                  <Label htmlFor="edit-rating" className="text-white">{t('dashboard.movieRating')}</Label>
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
                  <Label htmlFor="edit-duration" className="text-white">{t('dashboard.movieDuration')}</Label>
                  <Input
                    id="edit-duration"
                    value={editingMovie.duration}
                    onChange={(e) => setEditingMovie({...editingMovie, duration: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-director" className="text-white">{t('dashboard.director')}</Label>
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
                className="text-white hover:opacity-90"
                style={{ backgroundColor: '#a38725' }}
              >
                <Save className="mr-2 h-4 w-4" />
                {t('dashboard.saveChanges')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}