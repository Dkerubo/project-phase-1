'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Play, 
  DollarSign, 
  TrendingUp, 
  Search,
  MoreHorizontal,
  Eye,
  Calendar,
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
  Activity
} from 'lucide-react'
import Logo from '@/components/ui/logo'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('francilia_user')
    if (!userData) {
      router.push('/')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('francilia_user')
    router.push('/')
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

  const recentMovies = [
    {
      id: 1,
      title: "The Quantum Paradox",
      views: 15420,
      rating: 8.5,
      revenue: 12340,
      thumbnail: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300"
    },
    {
      id: 2,
      title: "Neon Nights",
      views: 12890,
      rating: 7.8,
      revenue: 9870,
      thumbnail: "https://images.pexels.com/photos/3844798/pexels-photo-3844798.jpeg?auto=compress&cs=tinysrgb&w=300"
    },
    {
      id: 3,
      title: "The Last Symphony",
      views: 18750,
      rating: 9.1,
      revenue: 15600,
      thumbnail: "https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=300"
    }
  ]

  const recentUsers = [
    { name: "John Smith", email: "john@example.com", plan: "premium", joinDate: "2024-01-15", status: "active" },
    { name: "Sarah Johnson", email: "sarah@example.com", plan: "standard", joinDate: "2024-01-14", status: "active" },
    { name: "Mike Wilson", email: "mike@example.com", plan: "premium", joinDate: "2024-01-13", status: "cancelled" },
    { name: "Emma Davis", email: "emma@example.com", plan: "standard", joinDate: "2024-01-12", status: "active" }
  ]

  if (!user) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo size="sm" />
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" className="text-white hover:text-[#a38725]">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
              <Button variant="ghost" className="text-white hover:text-[#a38725]">
                <Users className="mr-2 h-4 w-4" />
                Users
              </Button>
              <Button variant="ghost" className="text-white hover:text-[#a38725]">
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
                className="pl-10 bg-gray-800 border-gray-700 text-white w-64"
              />
            </div>
            
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
              <Bell className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
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
            Welcome back, <span style={{ color: '#a38725' }}>{user.name}</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Here's what's happening with Francilia Films today
          </p>
        </div>

        {/* Time Filter */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={selectedTimeframe === '24h' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe('24h')}
              className={selectedTimeframe === '24h' ? 'text-white hover:opacity-90' : 'border-gray-700 text-white hover:bg-gray-800'}
              style={selectedTimeframe === '24h' ? { backgroundColor: '#a38725' } : {}}
            >
              24h
            </Button>
            <Button
              variant={selectedTimeframe === '7d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe('7d')}
              className={selectedTimeframe === '7d' ? 'text-white hover:opacity-90' : 'border-gray-700 text-white hover:bg-gray-800'}
              style={selectedTimeframe === '7d' ? { backgroundColor: '#a38725' } : {}}
            >
              7d
            </Button>
            <Button
              variant={selectedTimeframe === '30d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe('30d')}
              className={selectedTimeframe === '30d' ? 'text-white hover:opacity-90' : 'border-gray-700 text-white hover:bg-gray-800'}
              style={selectedTimeframe === '30d' ? { backgroundColor: '#a38725' } : {}}
            >
              30d
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-800">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-800">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
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

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Subscriptions</CardTitle>
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

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Monthly Revenue</CardTitle>
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

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Content Views</CardTitle>
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

        {/* Charts and Analytics */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* Subscription Breakdown */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PieChart className="h-5 w-5" style={{ color: '#a38725' }} />
                Subscription Plans
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

          {/* Top Performing Content */}
          <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Top Performing Content
              </CardTitle>
              <CardDescription className="text-gray-400">
                Most watched movies this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMovies.map((movie, index) => (
                  <div key={movie.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                    <div className="text-lg font-bold text-gray-400 w-6">
                      #{index + 1}
                    </div>
                    <img
                      src={movie.thumbnail}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{movie.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {movie.views.toLocaleString()} views
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          {movie.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-green-500" />
                          ${movie.revenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Users */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Recent Users
              </CardTitle>
              <CardDescription className="text-gray-400">
                Latest user registrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
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

          {/* System Health */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                System Health
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
                  <span className="text-gray-300">Database Health</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-white font-semibold">Optimal</span>
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
    </div>
  )
}