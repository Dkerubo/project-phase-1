'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react'
import Logo from '@/components/ui/logo'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/hooks/use-i18n'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [activeTab, setActiveTab] = useState('login')
  const router = useRouter()
  const { t } = useI18n()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const userData = {
      email,
      name: email.split('@')[0],
      subscription: null,
      loginTime: new Date().toISOString()
    }
    localStorage.setItem('francilia_user', JSON.stringify(userData))
    router.push('/subscribe')
    onClose()
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const userData = {
      email,
      name,
      subscription: null,
      loginTime: new Date().toISOString()
    }
    localStorage.setItem('francilia_user', JSON.stringify(userData))
    router.push('/subscribe')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-black/95 border-gray-800 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <Logo size="md" />
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900/50">
            <TabsTrigger 
              value="login" 
              className="text-white data-[state=active]:bg-[#a38725] data-[state=active]:text-white"
            >
              {t('auth.signIn')}
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="text-white data-[state=active]:bg-[#a38725] data-[state=active]:text-white"
            >
              {t('auth.signUp')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-white">{t('auth.welcomeBack')}</CardTitle>
                <CardDescription className="text-gray-400">
                  {t('auth.enterCredentials')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">{t('auth.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('auth.email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-gray-800/50 border-gray-700/50 text-white backdrop-blur-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">{t('auth.password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('auth.password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-gray-800/50 border-gray-700/50 text-white backdrop-blur-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full text-white hover:opacity-90 transition-all hover:scale-105"
                    style={{ backgroundColor: '#a38725' }}
                  >
                    {t('auth.signIn')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-white">{t('auth.createAccount')}</CardTitle>
                <CardDescription className="text-gray-400">
                  {t('auth.joinViewers')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">{t('auth.fullName')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder={t('auth.fullName')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 bg-gray-800/50 border-gray-700/50 text-white backdrop-blur-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-white">{t('auth.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder={t('auth.email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-gray-800/50 border-gray-700/50 text-white backdrop-blur-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-white">{t('auth.password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('auth.password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-gray-800/50 border-gray-700/50 text-white backdrop-blur-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full text-white hover:opacity-90 transition-all hover:scale-105"
                    style={{ backgroundColor: '#a38725' }}
                  >
                    {t('auth.createAccount')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}