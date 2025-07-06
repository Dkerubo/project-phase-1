'use client';
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CreditCard, Shield, Lock, Check, Gift } from 'lucide-react'
import Logo from '@/components/ui/logo'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Payment() {
  const [user, setUser] = useState<any>(null)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const planType = searchParams?.get('plan')

  useEffect(() => {
    const userData = localStorage.getItem('francilia_user')
    if (!userData) {
      router.push('/')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    if (parsedUser.subscription) {
      router.push('/browse')
      return
    }
    
    setUser(parsedUser)
    
    // Set selected plan based on URL parameter
    const plans = {
      premium: {
        id: 'premium',
        name: 'Premium',
        price: 10.99,
        description: 'Ultimate experience, no ads',
        features: ['4K Ultra HD streaming', 'Watch on 4 devices', 'No ads, ever', 'Premium content access', '1 month free trial'],
        freeTrialMonths: 1
      },
      standard: {
        id: 'standard',
        name: 'Standard',
        price: 5.99,
        description: 'Great entertainment with ads',
        features: ['HD streaming quality', 'Watch on 2 devices', 'Ad-supported viewing', 'Mobile downloads', '1 month free trial'],
        freeTrialMonths: 1
      }
    }
    
    if (planType && plans[planType as keyof typeof plans]) {
      setSelectedPlan(plans[planType as keyof typeof plans])
    } else {
      router.push('/subscribe')
    }
  }, [router, planType])

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.length <= 19) {
      setCardNumber(formatted)
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    if (formatted.length <= 5) {
      setExpiryDate(formatted)
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      const trialEndDate = new Date()
      trialEndDate.setMonth(trialEndDate.getMonth() + selectedPlan.freeTrialMonths)
      
      const updatedUser = {
        ...user,
        subscription: {
          plan: selectedPlan.id,
          price: selectedPlan.price,
          startDate: new Date().toISOString(),
          trialEndDate: trialEndDate.toISOString(),
          status: 'trial', // Start with trial status
          paymentMethod: {
            last4: cardNumber.slice(-4),
            type: 'card'
          },
          isFreeTrial: true,
          freeTrialMonths: selectedPlan.freeTrialMonths
        }
      }
      
      localStorage.setItem('francilia_user', JSON.stringify(updatedUser))
      router.push('/browse')
    }, 3000)
  }

  if (!user || !selectedPlan) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Logo size="md" />
          <Button
            variant="ghost"
            onClick={() => router.push('/subscribe')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Plans
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Payment Form */}
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Gift className="h-8 w-8 text-green-500" />
                <h1 className="text-4xl font-bold">Start Your Free Trial</h1>
              </div>
              <p className="text-gray-400">
                No payment required for your first month. We'll only charge your card after your free trial ends.
              </p>
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
              {/* Payment Method */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Required for verification. You won't be charged during your free trial.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-white">Card Number</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-white">Expiry Date</Label>
                      <Input
                        id="expiry"
                        type="text"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={handleExpiryChange}
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-white">CVV</Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardName" className="text-white">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      type="text"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Billing Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street" className="text-white">Street Address</Label>
                    <Input
                      id="street"
                      type="text"
                      placeholder="123 Main Street"
                      value={billingAddress.street}
                      onChange={(e) => setBillingAddress({...billingAddress, street: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-white">City</Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="New York"
                        value={billingAddress.city}
                        onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-white">State</Label>
                      <Input
                        id="state"
                        type="text"
                        placeholder="NY"
                        value={billingAddress.state}
                        onChange={(e) => setBillingAddress({...billingAddress, state: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-white">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      type="text"
                      placeholder="10001"
                      value={billingAddress.zipCode}
                      onChange={(e) => setBillingAddress({...billingAddress, zipCode: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <div className="flex items-center gap-3 rounded-lg bg-green-500/10 p-4 border border-green-500/20">
                <Shield className="h-5 w-5 text-green-500" />
                <div className="text-sm">
                  <p className="text-green-400 font-medium">Secure & Free Trial</p>
                  <p className="text-gray-400">Your payment information is encrypted. No charges for 1 month.</p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full py-6 text-lg font-semibold text-white hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#a38725' }}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Starting Free Trial...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    Start 1 Month Free Trial
                  </div>
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-gray-900 border-gray-800 sticky top-6">
              <CardHeader>
                <CardTitle className="text-white">Trial Summary</CardTitle>
                <CardDescription className="text-gray-400">
                  Your free trial details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{selectedPlan.name} Plan</h3>
                      <p className="text-sm text-gray-400">{selectedPlan.description}</p>
                    </div>
                    <Badge 
                      style={{ 
                        backgroundColor: selectedPlan.id === 'premium' ? '#a38725' : '#ca8a04',
                        color: 'white'
                      }}
                    >
                      {selectedPlan.id === 'premium' ? 'Premium' : 'Standard'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {selectedPlan.features.slice(0, 4).map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-gray-800 pt-4">
                  <div className="flex items-center justify-between text-lg mb-2">
                    <span className="text-white">First Month</span>
                    <div className="flex items-center gap-2">
                      <span className="line-through text-gray-500">${selectedPlan.price}</span>
                      <span className="font-bold text-green-500">FREE</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>After trial</span>
                    <span>${selectedPlan.price}/month</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Cancel anytime during your free trial
                  </p>
                </div>
                
                <div className="rounded-lg bg-green-500/10 p-4 border border-green-500/20">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-500 p-1">
                      <Gift className="h-3 w-3 text-white" />
                    </div>
                    <div className="text-sm">
                      <p className="text-green-400 font-medium">1 Month Completely Free</p>
                      <p className="text-gray-400">Full access to all features. Cancel anytime with no charges.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}