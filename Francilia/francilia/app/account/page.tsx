'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  User, 
  Settings, 
  CreditCard, 
  Bell, 
  Monitor, 
  Shield, 
  LogOut,
  Edit,
  Save,
  X,
  Crown,
  Zap,
  Calendar,
  DollarSign,
  AlertTriangle,
  Check
} from 'lucide-react'
import Logo from '@/components/ui/logo'
import LanguageSelector from '@/components/ui/language-selector'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/hooks/use-i18n'
import { authService, type User as UserType } from '@/lib/auth'

export default function Account() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [editedEmail, setEditedEmail] = useState('')
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { t } = useI18n()

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push('/')
      return
    }
    
    // Redirect admin users to dashboard
    if (currentUser.role === 'admin') {
      router.push('/dashboard')
      return
    }
    
    setUser(currentUser)
    setEditedName(currentUser.name)
    setEditedEmail(currentUser.email)
    setLoading(false)
  }, [router])

  const handleSaveProfile = () => {
    if (!user) return
    
    authService.updateUser({
      name: editedName,
      email: editedEmail
    })
    
    setUser({ ...user, name: editedName, email: editedEmail })
    setIsEditing(false)
  }

  const handlePreferenceChange = (key: keyof UserType['preferences'], value: any) => {
    if (!user) return
    
    const newPreferences = { ...user.preferences, [key]: value }
    authService.updatePreferences(newPreferences)
    setUser({ ...user, preferences: newPreferences })
  }

  const handleCancelSubscription = () => {
    if (!user?.subscription) return
    
    const updatedSubscription = {
      ...user.subscription,
      status: 'cancelled' as const
    }
    
    authService.updateSubscription(updatedSubscription)
    setUser({ ...user, subscription: updatedSubscription })
    setShowCancelDialog(false)
  }

  const handleUpgrade = () => {
    router.push('/subscribe')
  }

  const handleLogout = () => {
    authService.logout()
    router.push('/')
  }

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">{t('common.loading')}</div>
    </div>
  }

  if (!user) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Access denied</div>
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
              <Button 
                variant="ghost" 
                onClick={() => router.push('/browse')}
                className="text-white hover:text-[#a38725] hover:bg-white/5"
              >
                {t('nav.browse')}
              </Button>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageSelector />
            
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

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
          <p className="text-gray-400 text-lg">
            Manage your profile, subscription, and preferences
          </p>
        </div>

        <div className="grid gap-8">
          {/* Profile Information */}
          <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-6 w-6" style={{ color: '#a38725' }} />
                  <CardTitle className="text-white">Profile Information</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                  className="text-gray-400 hover:text-white"
                >
                  {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="bg-gray-800/50 border-gray-700/50 text-white"
                    />
                  ) : (
                    <div className="p-3 bg-gray-800/30 rounded-md text-white">{user.name}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="bg-gray-800/50 border-gray-700/50 text-white"
                    />
                  ) : (
                    <div className="p-3 bg-gray-800/30 rounded-md text-white">{user.email}</div>
                  )}
                </div>
              </div>
              
              {isEditing && (
                <div className="flex gap-3">
                  <Button
                    onClick={handleSaveProfile}
                    className="text-white hover:opacity-90"
                    style={{ backgroundColor: '#a38725' }}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      setEditedName(user.name)
                      setEditedEmail(user.email)
                    }}
                    className="border-gray-700 text-white hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscription Details */}
          {user.subscription && (
            <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6" style={{ color: '#a38725' }} />
                  <CardTitle className="text-white">Subscription</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    {user.subscription.plan === 'premium' ? (
                      <Crown className="h-8 w-8" style={{ color: '#a38725' }} />
                    ) : (
                      <Zap className="h-8 w-8 text-yellow-500" />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-white capitalize">
                        {user.subscription.plan} Plan
                      </h3>
                      <p className="text-gray-400">
                        {user.subscription.plan === 'premium' 
                          ? 'Ultimate experience, no ads' 
                          : 'Great entertainment with ads'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      ${user.subscription.price}/month
                    </div>
                    {user.subscription.isFreeTrial && (
                      <Badge className="bg-green-500 text-white mt-2">
                        Free Trial Active
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Started:</span>
                      <span className="text-white">
                        {new Date(user.subscription.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {user.subscription.trialEndDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-400" />
                        <span className="text-gray-400">Trial ends:</span>
                        <span className="text-green-400">
                          {new Date(user.subscription.trialEndDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Status:</span>
                      <Badge 
                        className={
                          user.subscription.status === 'active' ? 'bg-green-500' :
                          user.subscription.status === 'trial' ? 'bg-blue-500' :
                          'bg-red-500'
                        }
                      >
                        {user.subscription.status}
                      </Badge>
                    </div>
                  </div>

                  {user.subscription.paymentMethod && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">Payment:</span>
                        <span className="text-white">
                          •••• {user.subscription.paymentMethod.last4}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-800">
                  {user.subscription.plan === 'standard' && (
                    <Button
                      onClick={handleUpgrade}
                      className="text-white hover:opacity-90"
                      style={{ backgroundColor: '#a38725' }}
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      Upgrade to Premium
                    </Button>
                  )}
                  
                  {user.subscription.status !== 'cancelled' && (
                    <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10">
                          Cancel Subscription
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-white flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Cancel Subscription
                          </DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Are you sure you want to cancel your subscription? You'll lose access to all premium features.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex gap-3 pt-4">
                          <Button
                            onClick={handleCancelSubscription}
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Yes, Cancel Subscription
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowCancelDialog(false)}
                            className="border-gray-700 text-white hover:bg-gray-800"
                          >
                            Keep Subscription
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preferences */}
          <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Settings className="h-6 w-6" style={{ color: '#a38725' }} />
                <CardTitle className="text-white">Preferences</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-4 w-4 text-gray-400" />
                      <div>
                        <Label className="text-white">Notifications</Label>
                        <p className="text-sm text-gray-400">Receive updates about new content</p>
                      </div>
                    </div>
                    <Switch
                      checked={user.preferences.notifications}
                      onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Monitor className="h-4 w-4 text-gray-400" />
                      <div>
                        <Label className="text-white">Autoplay</Label>
                        <p className="text-sm text-gray-400">Automatically play next episode</p>
                      </div>
                    </div>
                    <Switch
                      checked={user.preferences.autoplay}
                      onCheckedChange={(checked) => handlePreferenceChange('autoplay', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Video Quality</Label>
                    <Select
                      value={user.preferences.quality}
                      onValueChange={(value) => handlePreferenceChange('quality', value)}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="auto" className="text-white">Auto</SelectItem>
                        <SelectItem value="high" className="text-white">High (1080p)</SelectItem>
                        <SelectItem value="medium" className="text-white">Medium (720p)</SelectItem>
                        <SelectItem value="low" className="text-white">Low (480p)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-red-500" />
                <CardTitle className="text-white">Account Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-red-400 font-medium">Delete Account</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="mt-3 bg-red-600 hover:bg-red-700"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}