'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Zap, Shield, Star, Gift } from 'lucide-react'
import Logo from '@/components/ui/logo'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/hooks/use-i18n'

export default function Subscribe() {
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'standard' | null>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { t } = useI18n()

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
      name: t('subscription.standard'),
      price: 5.99,
      originalPrice: 5.99,
      description: t('subscription.standardDesc'),
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      features: [
        'HD streaming quality',
        'Watch on 2 devices',
        'Unlimited movies & shows',
        'Ad-supported viewing',
        'Mobile downloads',
        'Standard support',
        '1 month free trial'
      ],
      color: 'border-yellow-500',
      bgColor: 'bg-yellow-500/10',
      freeTrialMonths: 1
    },
    {
      id: 'premium',
      name: t('subscription.premium'),
      price: 10.99,
      originalPrice: 10.99,
      description: t('subscription.premiumDesc'),
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
        'Early access to new releases',
        '1 month free trial'
      ],
      color: 'border-[#a38725]',
      bgColor: 'bg-[#a38725]/10',
      freeTrialMonths: 1
    }
  ]

  if (!user) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">{t('common.loading')}</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800/50 p-6 backdrop-blur-md">
        <div className="mx-auto max-w-7xl">
          <Logo size="md" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#a38725]/20 via-black to-black" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 text-center">
          <div className="mb-6 flex items-center justify-center">
            <Gift className="h-12 w-12 text-green-500 mr-4" />
            <Badge className="bg-green-500 text-white text-lg px-4 py-2">
              {t('subscription.firstMonthFree')}
            </Badge>
          </div>
          <h1 className="mb-4 text-5xl font-bold">
            {t('subscription.choosePlan')}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-300">
            {t('common.welcome')}, <span className="font-semibold" style={{ color: '#a38725' }}>{user.name}</span>! 
            Start with a free month, then select the perfect plan for your entertainment needs. 
            {t('subscription.cancelAnytime')}.
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
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-green-500" />
              <span>1 Month Free</span>
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
              className={`relative overflow-hidden border-2 transition-all duration-300 hover:scale-105 backdrop-blur-sm ${
                selectedPlan === plan.id 
                  ? `${plan.color} bg-gray-900/50` 
                  : 'border-gray-800/50 bg-gray-900/30 hover:border-gray-700/50'
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
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800/50 backdrop-blur-sm">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-white">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {plan.description}
                </CardDescription>
                
                <div className="mt-4 mb-2">
                  <Badge className="bg-green-500 text-white">
                    <Gift className="mr-1 h-3 w-3" />
                    {t('subscription.firstMonthFree')}
                  </Badge>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-bold text-green-500">FREE</span>
                    <span className="text-gray-400">for 1 month</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-lg text-gray-400">then </span>
                    <span className="text-3xl font-bold text-white">
                      ${plan.price}
                    </span>
                    <span className="text-gray-400">/month</span>
                  </div>
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
                  className={`w-full py-6 text-lg font-semibold transition-all duration-300 text-white hover:opacity-90 hover:scale-105 ${
                    plan.id === 'premium'
                      ? ''
                      : 'bg-yellow-600 hover:bg-yellow-700'
                  }`}
                  style={plan.id === 'premium' ? { backgroundColor: '#a38725' } : {}}
                >
                  {t('subscription.startFreeTrial')} - {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center text-gray-400">
          <p className="text-sm mb-4">
            <strong className="text-green-400">{t('subscription.freeTrialDetails')}:</strong> Enjoy 1 month completely free with full access to all features. 
            No payment required upfront. {t('subscription.cancelAnytime')}.
          </p>
          <p className="text-sm">
            After your free trial, your subscription will automatically renew monthly unless cancelled. 
            By subscribing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}