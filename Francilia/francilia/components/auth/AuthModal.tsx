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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate login
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
    // Simulate registration
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
      <DialogContent className="sm:max-w-md bg-black/95 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-center">
            <Logo size="md" />
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900">
            <TabsTrigger 
              value="login" 
              className="text-white"
              style={{ 
                backgroundColor: activeTab === 'login' ? '#a38725' : 'transparent',
                color: activeTab === 'login' ? 'white' : 'inherit'
              }}
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="text-white"
              style={{ 
                backgroundColor: activeTab === 'register' ? '#a38725' : 'transparent',
                color: activeTab === 'register' ? 'white' : 'inherit'
              }}
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader className="space-y-1">
                <CardTitle className="text-white">Welcome back</CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full text-white hover:opacity-90"
                    style={{ backgroundColor: '#a38725' }}
                  >
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader className="space-y-1">
                <CardTitle className="text-white">Create Account</CardTitle>
                <CardDescription className="text-gray-400">
                  Join thousands of viewers worldwide
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-white">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full text-white hover:opacity-90"
                    style={{ backgroundColor: '#a38725' }}
                  >
                    Create Account
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