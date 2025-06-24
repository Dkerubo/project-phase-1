'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Zap, Shield, Star } from 'lucide-react'
import Logo from '@/components/ui/logo'
import { useRouter } from 'next/navigation'

export default function Subscribe() {
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'standard' | null>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('francilia_user')
    if (!userData) {
      router.push('/')
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleSelectPlan = (plan: 'premium' | 'standard') => {
    if (!user) return
    router.push(`/payment?plan=${plan}`)
  }

  const plans = [
    {
      id: 'standard',
      name: 'Standard',
      price: 5.99,
      description: 'Great entertainment with ads',
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      features: [
        'HD streaming quality',
        'Watch on 2 devices',
        'Unlimited movies & shows',
        'Ad-supported viewing',
        'Mobile downloads',
        'Standard support'
      ],
      color: 'border-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 10.99,
      description: 'Ultimate experience, no ads',
      icon: <Crown className="h-8 w-8" style={{ color: '#a38725' }} />,
      popular: true,
      features: [
        '4K Ultra HD streaming',
        'Watch on 4 devices',
        'Unlimited movies & shows',
        'No ads, ever',
        'Premium content access',
        'Offline downloads',
        'Priority support',
        'Early access to new releases'
      ],
      color: 'border-[#a38725]',
      bgColor: 'bg-[#a38725]/10'
    }
  ]

  if (!user) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <div className="mx-auto max-w-7xl">
          <Logo size="md" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#a38725]/20 via-black to-black" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 text-center">
          <h1 className="mb-4 text-5xl font-bold">
            Choose Your <span style={{ color: '#a38725' }}>Experience</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-300">
            Welcome, <span className="font-semibold" style={{ color: '#a38725' }}>{user.name}</span>! 
            Select the perfect plan for your entertainment needs. 
            Cancel anytime, no commitments.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Premium Content</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-blue-500" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                selectedPlan === plan.id 
                  ? `${plan.color} bg-gray-900/50` 
                  : 'border-gray-800 bg-gray-900/30 hover:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute right-4 top-4">
                  <Badge style={{ backgroundColor: '#a38725', color: 'white' }}>
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-white">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {plan.description}
                </CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-400">/month</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button
                  onClick={() => handleSelectPlan(plan.id as 'premium' | 'standard')}
                  className={`w-full py-6 text-lg font-semibold transition-all duration-300 text-white hover:opacity-90 ${
                    plan.id === 'premium'
                      ? ''
                      : 'bg-yellow-600 hover:bg-yellow-700'
                  }`}
                  style={plan.id === 'premium' ? { backgroundColor: '#a38725' } : {}}
                >
                  Select {plan.name} Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center text-gray-400">
          <p className="text-sm">
            By subscribing, you agree to our Terms of Service and Privacy Policy. 
            Your subscription will automatically renew monthly unless cancelled.
          </p>
        </div>
      </div>
    </div>
  )
}