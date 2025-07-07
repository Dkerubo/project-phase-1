'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Play, Sparkles, TrendingUp, Heart, RefreshCw } from 'lucide-react'
import { aiService, type AIRecommendation } from '@/lib/ai-service'
import { type Movie } from '@/lib/muvi-api'

interface AIRecommendationsProps {
  userId: string
  viewingHistory: Movie[]
  preferences: any
  onMovieSelect: (movieId: string) => void
}

export default function AIRecommendations({ 
  userId, 
  viewingHistory, 
  preferences, 
  onMovieSelect 
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadRecommendations()
  }, [userId, viewingHistory, preferences])

  const loadRecommendations = async () => {
    try {
      setLoading(true)
      const recs = await aiService.getPersonalizedRecommendations(userId, viewingHistory, preferences)
      setRecommendations(recs)
    } catch (error) {
      console.error('Error loading AI recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadRecommendations()
    setRefreshing(false)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400'
    if (confidence >= 0.6) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'Perfect Match'
    if (confidence >= 0.6) return 'Great Match'
    return 'Good Match'
  }

  if (loading) {
    return (
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-6 w-6 text-[#a38725]" />
          <h2 className="text-2xl font-bold text-white">AI Recommendations</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-800/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-[#a38725]" />
          <h2 className="text-2xl font-bold text-white">AI Recommendations</h2>
          <Badge className="bg-[#a38725]/20 text-[#a38725] border-[#a38725]/30">
            Powered by AI
          </Badge>
        </div>
        
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={refreshing}
          className="border-gray-700 text-white hover:bg-gray-800"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {recommendations.map((rec, index) => (
          <Card
            key={rec.movie.id}
            className="group relative overflow-hidden border-0 bg-gray-900/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer flex-shrink-0 w-48"
            onClick={() => onMovieSelect(rec.movie.id)}
          >
            <div className="aspect-[2/3] relative">
              <img
                src={rec.movie.thumbnail}
                alt={rec.movie.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500'
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300" />
              
              {/* AI Confidence Badge */}
              <div className="absolute top-2 left-2">
                <Badge className="bg-black/80 text-white backdrop-blur-sm text-xs">
                  <Sparkles className="mr-1 h-2 w-2" />
                  {Math.round(rec.confidence * 100)}%
                </Badge>
              </div>

              {/* Rating Badge */}
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-black/80 text-white backdrop-blur-sm">
                  <Star className="mr-1 h-3 w-3 text-yellow-400" />
                  {rec.movie.rating}
                </Badge>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-gray-200 shadow-lg"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Play
                </Button>
              </div>
            </div>
            
            <CardContent className="p-3">
              <h3 className="font-semibold text-white group-hover:text-gray-200 transition-colors line-clamp-1 text-sm mb-1">
                {rec.movie.title}
              </h3>
              
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>{rec.movie.year}</span>
                <span className={getConfidenceColor(rec.confidence)}>
                  {getConfidenceLabel(rec.confidence)}
                </span>
              </div>
              
              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                {rec.reason}
              </p>
              
              <div className="mt-2 flex items-center gap-1">
                {rec.movie.genre.slice(0, 2).map((genre, i) => (
                  <Badge 
                    key={i} 
                    variant="outline" 
                    className="text-xs px-1 py-0 border-gray-600 text-gray-300"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-white">Trending for You</span>
            </div>
            <p className="text-xs text-gray-400">
              Based on your viewing patterns, {recommendations.filter(r => r.confidence >= 0.8).length} movies are perfect matches
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium text-white">Your Taste</span>
            </div>
            <p className="text-xs text-gray-400">
              You seem to enjoy {viewingHistory.length > 0 ? 
                viewingHistory[0]?.genre?.[0] || 'diverse content' : 
                'exploring different genres'
              }
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-[#a38725]" />
              <span className="text-sm font-medium text-white">AI Powered</span>
            </div>
            <p className="text-xs text-gray-400">
              Recommendations improve as you watch more content
            </p>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}