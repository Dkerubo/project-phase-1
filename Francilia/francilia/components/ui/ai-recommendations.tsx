'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Play, Sparkles, TrendingUp, Heart, Clock } from 'lucide-react'
import { aiService, type AIRecommendation } from '@/lib/ai-service'
import { type Movie } from '@/lib/muvi-api'
import { cn } from '@/lib/utils'

interface AIRecommendationsProps {
  userId: string
  viewingHistory: Movie[]
  preferences: any
  onMovieSelect: (movieId: string) => void
  className?: string
}

export default function AIRecommendations({ 
  userId, 
  viewingHistory, 
  preferences, 
  onMovieSelect,
  className 
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'trending' | 'similar' | 'new'>('all')

  useEffect(() => {
    loadRecommendations()
  }, [userId, viewingHistory])

  const loadRecommendations = async () => {
    setLoading(true)
    try {
      const recs = await aiService.getPersonalizedRecommendations(userId, viewingHistory, preferences)
      setRecommendations(recs)
    } catch (error) {
      console.error('Error loading recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'all', label: 'For You', icon: Sparkles },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'similar', label: 'Similar', icon: Heart },
    { id: 'new', label: 'New', icon: Clock }
  ]

  const filteredRecommendations = recommendations.filter(rec => {
    switch (selectedCategory) {
      case 'trending':
        return rec.movie.popularity && rec.movie.popularity > 80
      case 'similar':
        return rec.reason.includes('you enjoy')
      case 'new':
        return rec.movie.year >= 2023
      default:
        return true
    }
  })

  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-[#a38725]" />
          <h2 className="text-2xl font-bold text-white">AI Recommendations</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-800/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-[#a38725]" />
          <h2 className="text-2xl font-bold text-white">AI Recommendations</h2>
        </div>
        <Card className="bg-gray-900/50 border-gray-800/50">
          <CardContent className="p-8 text-center">
            <Sparkles className="h-12 w-12 text-[#a38725] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Building Your Profile</h3>
            <p className="text-gray-400">
              Watch a few movies to get personalized AI recommendations tailored just for you!
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-[#a38725]" />
          <h2 className="text-2xl font-bold text-white">AI Recommendations</h2>
          <Badge className="bg-[#a38725] text-white">
            Powered by AI
          </Badge>
        </div>
        
        <Button
          onClick={loadRecommendations}
          variant="outline"
          size="sm"
          className="border-gray-700 text-white hover:bg-gray-800"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id as any)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap",
              selectedCategory === category.id
                ? "bg-[#a38725] text-white"
                : "border-gray-700 text-gray-300 hover:bg-gray-800"
            )}
          >
            <category.icon className="h-4 w-4" />
            {category.label}
          </Button>
        ))}
      </div>

      {/* Recommendations Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRecommendations.map((recommendation) => (
          <Card
            key={recommendation.movie.id}
            className="group relative overflow-hidden border-0 bg-gray-900/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
            onClick={() => onMovieSelect(recommendation.movie.id)}
          >
            <div className="aspect-[2/3] relative">
              <img
                src={recommendation.movie.thumbnail}
                alt={recommendation.movie.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500'
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300" />
              
              {/* AI Badge */}
              <div className="absolute top-3 left-3">
                <Badge className="bg-[#a38725] text-white text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Pick
                </Badge>
              </div>
              
              {/* Confidence Score */}
              <div className="absolute top-3 right-3">
                <Badge 
                  variant="secondary" 
                  className="bg-black/80 text-white backdrop-blur-sm"
                >
                  <Star className="mr-1 h-3 w-3 text-yellow-400" />
                  {recommendation.movie.rating}
                </Badge>
              </div>
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-gray-200 shadow-lg"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Play Now
                </Button>
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-white group-hover:text-gray-200 transition-colors line-clamp-1 mb-2">
                {recommendation.movie.title}
              </h3>
              
              {/* AI Reason */}
              <div className="mb-3">
                <p className="text-xs text-[#a38725] font-medium mb-1">
                  Why we recommend this:
                </p>
                <p className="text-xs text-gray-400 line-clamp-2">
                  {recommendation.reason}
                </p>
              </div>
              
              {/* Movie Details */}
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{recommendation.movie.year}</span>
                <div className="flex items-center gap-1">
                  {Array.isArray(recommendation.movie.genre) 
                    ? recommendation.movie.genre.slice(0, 2).map((genre, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-400">
                          {genre}
                        </Badge>
                      ))
                    : <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                        {recommendation.movie.genre}
                      </Badge>
                  }
                </div>
              </div>
              
              {/* Confidence Indicator */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Match Score</span>
                  <span>{Math.round(recommendation.confidence * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div 
                    className="bg-[#a38725] h-1 rounded-full transition-all duration-500"
                    style={{ width: `${recommendation.confidence * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecommendations.length === 0 && (
        <Card className="bg-gray-900/50 border-gray-800/50">
          <CardContent className="p-8 text-center">
            <TrendingUp className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No {selectedCategory} recommendations</h3>
            <p className="text-gray-400">
              Try selecting a different category or watch more content to improve recommendations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}