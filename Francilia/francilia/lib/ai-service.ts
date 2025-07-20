import { movieAPI, type Movie } from './movie-api'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'text' | 'recommendations' | 'search_results'
  data?: any
}

export interface AIRecommendation {
  movie: Movie
  reason: string
  confidence: number
}

export class AIService {
  private static instance: AIService
  private apiKey: string = process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
  private baseUrl: string = 'https://api.openai.com/v1'

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  // Chat functionality
  async sendMessage(message: string, context?: any): Promise<ChatMessage> {
    try {
      // If no API key, use mock responses
      if (!this.apiKey) {
        return this.getMockResponse(message, context)
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt()
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error('AI service unavailable')
      }

      const data = await response.json()
      const aiResponse = data.choices[0]?.message?.content || 'I apologize, but I cannot process your request right now.'

      return {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        type: 'text'
      }
    } catch (error) {
      console.error('AI Service Error:', error)
      return this.getMockResponse(message, context)
    }
  }

  private getSystemPrompt(): string {
    return `You are Francilia AI, a helpful assistant for the Francilia Films streaming platform. You help users with:

1. Movie and TV show recommendations
2. Account and subscription questions
3. Technical support
4. Content discovery
5. Platform navigation

Guidelines:
- Be friendly, helpful, and concise
- Focus on movies and entertainment
- Suggest specific titles when possible
- Help with account issues
- Provide clear, actionable advice
- Keep responses under 150 words
- Use emojis sparingly but effectively

You have access to a large library of movies across genres like Action, Drama, Comedy, Horror, Thriller, Romance, Sci-Fi, Nollywood, Bollywood, and more.`
  }

  private getMockResponse(message: string, context?: any): ChatMessage {
    const lowerMessage = message.toLowerCase()
    
    // Movie recommendation requests
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('what should i watch')) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: this.getRecommendationResponse(lowerMessage),
        timestamp: new Date(),
        type: 'text'
      }
    }
    
    // Account/subscription questions
    if (lowerMessage.includes('subscription') || lowerMessage.includes('account') || lowerMessage.includes('billing')) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: "I can help with your account! 💳 You can manage your subscription in Account Settings. For billing issues, check your payment method or contact support. Need help with a specific account feature?",
        timestamp: new Date(),
        type: 'text'
      }
    }
    
    // Technical support
    if (lowerMessage.includes('not working') || lowerMessage.includes('error') || lowerMessage.includes('problem') || lowerMessage.includes('buffering')) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: "Sorry you're having technical issues! 🔧 Try refreshing the page, checking your internet connection, or clearing your browser cache. For persistent problems, try switching to a different device or contact our support team.",
        timestamp: new Date(),
        type: 'text'
      }
    }
    
    // Search/discovery
    if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('looking for')) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: "I can help you find content! 🔍 Use the search bar to find specific titles, or browse by genre. Try searching for actors, directors, or keywords. What type of content are you looking for?",
        timestamp: new Date(),
        type: 'text'
      }
    }

    // Video player help
    if (lowerMessage.includes('player') || lowerMessage.includes('video') || lowerMessage.includes('controls')) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: "Here are some video player tips! 🎬 Use spacebar to play/pause, arrow keys to seek, M to mute, and F for fullscreen. You can also adjust playback speed and quality in the settings menu. Having trouble with a specific feature?",
        timestamp: new Date(),
        type: 'text'
      }
    }

    // Quality/streaming issues
    if (lowerMessage.includes('quality') || lowerMessage.includes('streaming') || lowerMessage.includes('slow')) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: "For better streaming quality: 📺 Check your internet speed (we recommend 25+ Mbps for 4K), try lowering video quality in player settings, close other apps using bandwidth, or restart your router. Premium users get priority streaming!",
        timestamp: new Date(),
        type: 'text'
      }
    }
    
    // Default response
    return {
      id: Math.random().toString(36).substr(2, 9),
      role: 'assistant',
      content: "Hello! I'm Francilia AI, your streaming assistant. 🎬 I can help you find great movies and shows, answer account questions, or provide technical support. What can I help you with today?",
      timestamp: new Date(),
      type: 'text'
    }
  }

  private getRecommendationResponse(message: string): string {
    if (message.includes('action')) {
      return "For action fans, I recommend 'Thunder Strike' - an intense special forces thriller, or 'Digital Phantom' - a cyberpunk action film. Both are highly rated! 💥 Want more action recommendations?"
    }
    
    if (message.includes('comedy')) {
      return "Looking for laughs? Try 'Office Chaos' - a hilarious sci-fi comedy about AI taking over an office. It's got great reviews and will definitely make you smile! 😂"
    }
    
    if (message.includes('horror')) {
      return "For a good scare, check out 'The Haunting Hour' - a supernatural horror about a family in a Victorian house. It's genuinely creepy! 👻 Want more horror suggestions?"
    }
    
    if (message.includes('drama')) {
      return "For powerful drama, I highly recommend 'The Last Symphony' - about a composer losing their hearing. It's emotionally gripping with outstanding performances! 🎭"
    }
    
    if (message.includes('nollywood')) {
      return "For Nollywood content, 'Lagos Dreams' is excellent - follows a young entrepreneur's journey in Lagos. Great storytelling and authentic Nigerian culture! 🇳🇬"
    }
    
    return "Based on popular picks, I recommend 'Quantum Paradox' (sci-fi thriller), 'Love in Paris' (romance), or 'Mystic Realms' (animated fantasy). What genre interests you most? 🎬"
  }

  // Recommendation engine
  async getPersonalizedRecommendations(userId: string, viewingHistory: Movie[], preferences: any): Promise<AIRecommendation[]> {
    try {
      // Get all available movies
      const moviesResponse = await movieAPI.getMovies(1, 50)
      const allMovies = moviesResponse.data || []
      
      // Simple recommendation algorithm
      const recommendations = this.generateRecommendations(allMovies, viewingHistory, preferences)
      
      return recommendations.slice(0, 6) // Return top 6 recommendations
    } catch (error) {
      console.error('Error generating recommendations:', error)
      return []
    }
  }

  private generateRecommendations(allMovies: Movie[], viewingHistory: Movie[], preferences: any): AIRecommendation[] {
    const recommendations: AIRecommendation[] = []
    
    // Get user's favorite genres from viewing history
    const genrePreferences = this.analyzeGenrePreferences(viewingHistory)
    
    // Score each movie
    allMovies.forEach(movie => {
      // Skip if already watched
      if (viewingHistory.some(watched => watched.id === movie.id)) {
        return
      }
      
      let score = 0
      let reasons: string[] = []
      
      // Genre matching
      movie.genre.forEach(genre => {
        if (genrePreferences[genre.toLowerCase()]) {
          score += genrePreferences[genre.toLowerCase()] * 10
          reasons.push(`you enjoy ${genre} movies`)
        }
      })
      
      // Rating boost
      if (movie.rating >= 8.0) {
        score += 5
        reasons.push('highly rated')
      }
      
      // Recent movies
      if (movie.year >= 2023) {
        score += 3
        reasons.push('recent release')
      }
      
      // Popular movies
      if (movie.popularity && movie.popularity > 80) {
        score += 2
        reasons.push('trending now')
      }
      
      if (score > 0) {
        recommendations.push({
          movie,
          reason: reasons.length > 0 ? `Because ${reasons.slice(0, 2).join(' and ')}` : 'Popular choice',
          confidence: Math.min(score / 20, 1) // Normalize to 0-1
        })
      }
    })
    
    // Sort by score and return
    return recommendations.sort((a, b) => b.confidence - a.confidence)
  }

  private analyzeGenrePreferences(viewingHistory: Movie[]): { [genre: string]: number } {
    const genreCount: { [genre: string]: number } = {}
    const totalMovies = viewingHistory.length
    
    if (totalMovies === 0) {
      // Default preferences for new users
      return {
        'action': 0.3,
        'drama': 0.3,
        'comedy': 0.2,
        'thriller': 0.2
      }
    }
    
    viewingHistory.forEach(movie => {
      movie.genre.forEach(genre => {
        const lowerGenre = genre.toLowerCase()
        genreCount[lowerGenre] = (genreCount[lowerGenre] || 0) + 1
      })
    })
    
    // Convert to preferences (0-1 scale)
    const preferences: { [genre: string]: number } = {}
    Object.entries(genreCount).forEach(([genre, count]) => {
      preferences[genre] = count / totalMovies
    })
    
    return preferences
  }

  // Smart search
  async smartSearch(query: string): Promise<Movie[]> {
    try {
      // Use existing search but enhance with AI understanding
      const searchResponse = await movieAPI.searchMovies(query)
      return searchResponse.data || []
    } catch (error) {
      console.error('Smart search error:', error)
      return []
    }
  }

  // Content analysis
  analyzeUserBehavior(viewingHistory: Movie[], watchTime: number[]): any {
    const analysis = {
      favoriteGenres: this.analyzeGenrePreferences(viewingHistory),
      averageRating: viewingHistory.length > 0 ? 
        viewingHistory.reduce((sum, movie) => sum + movie.rating, 0) / viewingHistory.length : 0,
      preferredDecade: this.getPreferredDecade(viewingHistory),
      watchingPatterns: this.analyzeWatchingPatterns(watchTime),
      recommendations: []
    }
    
    return analysis
  }

  private getPreferredDecade(movies: Movie[]): string {
    if (movies.length === 0) return '2020s'
    
    const decades: { [decade: string]: number } = {}
    
    movies.forEach(movie => {
      const decade = Math.floor(movie.year / 10) * 10
      const decadeStr = `${decade}s`
      decades[decadeStr] = (decades[decadeStr] || 0) + 1
    })
    
    return Object.entries(decades).sort(([,a], [,b]) => b - a)[0]?.[0] || '2020s'
  }

  private analyzeWatchingPatterns(watchTimes: number[]): any {
    if (watchTimes.length === 0) return { averageWatchTime: 0, completionRate: 0 }
    
    const averageWatchTime = watchTimes.reduce((sum, time) => sum + time, 0) / watchTimes.length
    const completionRate = watchTimes.filter(time => time > 0.8).length / watchTimes.length
    
    return {
      averageWatchTime: Math.round(averageWatchTime * 100),
      completionRate: Math.round(completionRate * 100)
    }
  }
}

export const aiService = AIService.getInstance()