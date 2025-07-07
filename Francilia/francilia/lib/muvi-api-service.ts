const MUVI_API_KEY = process.env.NEXT_PUBLIC_MUVI_API_KEY || '1751901862686be6a6b6349462253146'
const MUVI_APP_ID = 'cf593f0324e946dab98ac9e0c6839ef0'
const MUVI_BASE_URL = 'https://api.muvi.com/v2'

export interface MuviContent {
  id: string
  title: string
  description: string
  type: 'movie' | 'series' | 'episode'
  genre: string[]
  year: number
  rating: number
  duration: number
  thumbnail_url: string
  backdrop_url: string
  trailer_url?: string
  video_url?: string
  cast: string[]
  director?: string
  language: string
  country: string
  imdb_id?: string
  tmdb_id?: string
  muvi_id: string
  is_premium: boolean
  view_count: number
  like_count: number
  metadata?: Record<string, any>
}

export interface MuviApiResponse<T> {
  success: boolean
  data: T
  message?: string
  total?: number
  page?: number
  limit?: number
  totalPages?: number
}

export interface MuviStats {
  totalContent: number
  totalViews: number
  averageRating: number
  topGenres: { genre: string; count: number }[]
  recentlyAdded: MuviContent[]
  topRated: MuviContent[]
  mostPopular: MuviContent[]
  viewsByMonth: { month: string; views: number }[]
  ratingDistribution: { rating: string; count: number }[]
}

class MuviAPIService {
  private apiKey: string
  private baseUrl: string
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.apiKey = MUVI_API_KEY
    this.baseUrl = MUVI_BASE_URL
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<MuviApiResponse<T>> {
    const cacheKey = `${endpoint}_${JSON.stringify(options)}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    try {
      const url = `${this.baseUrl}${endpoint}`
      console.log('Making Muvi API request to:', url)
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Key': this.apiKey,
          'X-App-ID': MUVI_APP_ID,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      })

      console.log('Muvi API response status:', response.status)

      if (!response.ok) {
        console.warn(`Muvi API request failed: ${response.status} ${response.statusText}`)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Muvi API response data:', data)
      
      const transformedData = this.transformMuviResponse(data)
      const result = {
        success: true,
        data: transformedData,
        total: data.total || data.count || (Array.isArray(transformedData) ? transformedData.length : 1),
        page: data.page || data.current_page || 1,
        limit: data.limit || data.per_page || 20,
        totalPages: data.total_pages || Math.ceil((data.total || data.count || 0) / (data.limit || data.per_page || 20))
      }

      // Cache the result
      this.cache.set(cacheKey, { data: result, timestamp: Date.now() })
      
      return result
    } catch (error) {
      console.warn('Muvi API Error, falling back to mock data:', error)
      
      // Return mock data as fallback
      const mockData = this.getMockContent()
      return {
        success: false,
        data: mockData as unknown as T,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  private transformMuviResponse(data: any): any {
    console.log('Transforming Muvi response:', data)
    
    if (data && data.data && Array.isArray(data.data)) {
      return data.data.map((item: any) => this.transformContentItem(item))
    } else if (data && data.results && Array.isArray(data.results)) {
      return data.results.map((item: any) => this.transformContentItem(item))
    } else if (data && data.content && Array.isArray(data.content)) {
      return data.content.map((item: any) => this.transformContentItem(item))
    } else if (Array.isArray(data)) {
      return data.map((item: any) => this.transformContentItem(item))
    } else if (data && typeof data === 'object') {
      return this.transformContentItem(data)
    }
    
    return data
  }

  private transformContentItem(item: any): MuviContent {
    const content: MuviContent = {
      id: item.id || item._id || item.content_id || Math.random().toString(36).substr(2, 9),
      title: item.title || item.name || item.content_title || 'Untitled',
      description: item.description || item.synopsis || item.overview || item.content_description || 'No description available',
      type: this.determineContentType(item),
      genre: this.parseGenres(item.genre || item.genres || item.category || item.categories || ['Drama']),
      year: item.year || item.release_year || item.production_year || new Date(item.release_date || item.created_at || Date.now()).getFullYear(),
      rating: parseFloat(item.rating || item.imdb_rating || item.vote_average || item.content_rating || '7.5'),
      duration: this.parseDuration(item.duration || item.runtime || item.length || item.duration_minutes || 120),
      thumbnail_url: item.thumbnail || item.poster_url || item.image || item.poster_path || item.content_image || this.getPlaceholderImage(),
      backdrop_url: item.backdrop || item.backdrop_url || item.background_image || item.backdrop_path || item.banner_image || this.getPlaceholderImage(true),
      trailer_url: item.trailer_url || item.preview_url || item.teaser_url,
      video_url: item.video_url || item.stream_url || item.media_url || item.content_url || item.playback_url,
      cast: this.parseCast(item.cast || item.actors || item.starring || []),
      director: item.director || item.directors || 'Unknown Director',
      language: item.language || item.audio_language || 'English',
      country: item.country || item.production_country || 'USA',
      imdb_id: item.imdb_id || item.external_ids?.imdb_id,
      tmdb_id: item.tmdb_id || item.external_ids?.tmdb_id,
      muvi_id: item.muvi_id || item.id || item._id,
      is_premium: item.is_premium || item.premium || item.subscription_required || false,
      view_count: item.view_count || item.views || item.play_count || 0,
      like_count: item.like_count || item.likes || item.favorites || 0,
      metadata: item.metadata || item.extra_data || {}
    }
    
    console.log('Transformed content:', content)
    return content
  }

  private determineContentType(item: any): 'movie' | 'series' | 'episode' {
    const type = item.type || item.content_type || item.category_type
    if (type) {
      if (type.toLowerCase().includes('movie') || type.toLowerCase().includes('film')) return 'movie'
      if (type.toLowerCase().includes('series') || type.toLowerCase().includes('show')) return 'series'
      if (type.toLowerCase().includes('episode')) return 'episode'
    }
    
    // Default to movie if duration suggests it's a feature-length content
    const duration = this.parseDuration(item.duration || item.runtime || 120)
    return duration > 60 ? 'movie' : 'series'
  }

  private parseGenres(genres: any): string[] {
    if (Array.isArray(genres)) {
      return genres.map(g => typeof g === 'string' ? g : g.name || g.title || 'Unknown').filter(Boolean)
    } else if (typeof genres === 'string') {
      return genres.split(',').map(g => g.trim()).filter(g => g.length > 0)
    }
    return ['Drama']
  }

  private parseCast(cast: any): string[] {
    if (Array.isArray(cast)) {
      return cast.map(c => typeof c === 'string' ? c : c.name || c.actor_name || 'Unknown Actor').slice(0, 10)
    } else if (typeof cast === 'string') {
      return cast.split(',').map(c => c.trim()).filter(c => c.length > 0).slice(0, 10)
    }
    return []
  }

  private parseDuration(duration: any): number {
    if (typeof duration === 'number') return duration
    if (typeof duration === 'string') {
      const match = duration.match(/(\d+)/)
      return match ? parseInt(match[1]) : 120
    }
    return 120
  }

  private getPlaceholderImage(isBackdrop: boolean = false): string {
    const images = [
      'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=' + (isBackdrop ? '1280' : '500'),
      'https://images.pexels.com/photos/3844798/pexels-photo-3844798.jpeg?auto=compress&cs=tinysrgb&w=' + (isBackdrop ? '1280' : '500'),
      'https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=' + (isBackdrop ? '1280' : '500'),
      'https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=' + (isBackdrop ? '1280' : '500'),
      'https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=' + (isBackdrop ? '1280' : '500')
    ]
    return images[Math.floor(Math.random() * images.length)]
  }

  // Public API methods
  async getContent(page: number = 1, limit: number = 20, type?: 'movie' | 'series'): Promise<MuviApiResponse<MuviContent[]>> {
    const typeParam = type ? `&type=${type}` : ''
    return this.makeRequest<MuviContent[]>(`/content?page=${page}&limit=${limit}${typeParam}`)
  }

  async getContentById(id: string): Promise<MuviApiResponse<MuviContent>> {
    return this.makeRequest<MuviContent>(`/content/${id}`)
  }

  async searchContent(query: string, page: number = 1, limit: number = 20): Promise<MuviApiResponse<MuviContent[]>> {
    return this.makeRequest<MuviContent[]>(`/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`)
  }

  async getContentByGenre(genre: string, page: number = 1, limit: number = 20): Promise<MuviApiResponse<MuviContent[]>> {
    return this.makeRequest<MuviContent[]>(`/content?genre=${encodeURIComponent(genre)}&page=${page}&limit=${limit}`)
  }

  async getFeaturedContent(): Promise<MuviApiResponse<MuviContent[]>> {
    return this.makeRequest<MuviContent[]>('/content/featured')
  }

  async getTrendingContent(): Promise<MuviApiResponse<MuviContent[]>> {
    return this.makeRequest<MuviContent[]>('/content/trending')
  }

  async getPopularContent(): Promise<MuviApiResponse<MuviContent[]>> {
    return this.makeRequest<MuviContent[]>('/content/popular')
  }

  async getRecentContent(): Promise<MuviApiResponse<MuviContent[]>> {
    return this.makeRequest<MuviContent[]>('/content/recent')
  }

  async createContent(contentData: Partial<MuviContent>): Promise<MuviApiResponse<MuviContent>> {
    return this.makeRequest<MuviContent>('/content', {
      method: 'POST',
      body: JSON.stringify(contentData)
    })
  }

  async updateContent(id: string, contentData: Partial<MuviContent>): Promise<MuviApiResponse<MuviContent>> {
    return this.makeRequest<MuviContent>(`/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contentData)
    })
  }

  async deleteContent(id: string): Promise<MuviApiResponse<boolean>> {
    return this.makeRequest<boolean>(`/content/${id}`, {
      method: 'DELETE'
    })
  }

  async getContentStats(): Promise<MuviApiResponse<MuviStats>> {
    try {
      const response = await this.makeRequest<any>('/analytics/content')
      return response
    } catch (error) {
      // Return mock stats if API fails
      const mockStats: MuviStats = {
        totalContent: 1250,
        totalViews: 892340,
        averageRating: 7.8,
        topGenres: [
          { genre: 'Action', count: 245 },
          { genre: 'Drama', count: 198 },
          { genre: 'Comedy', count: 156 },
          { genre: 'Thriller', count: 134 },
          { genre: 'Sci-Fi', count: 98 }
        ],
        recentlyAdded: this.getMockContent().slice(0, 5),
        topRated: this.getMockContent().filter(c => c.rating >= 8.0).slice(0, 5),
        mostPopular: this.getMockContent().sort((a, b) => b.view_count - a.view_count).slice(0, 5),
        viewsByMonth: [
          { month: 'Jan', views: 65000 },
          { month: 'Feb', views: 72000 },
          { month: 'Mar', views: 78000 },
          { month: 'Apr', views: 85000 },
          { month: 'May', views: 92000 },
          { month: 'Jun', views: 98000 }
        ],
        ratingDistribution: [
          { rating: '0-2', count: 45 },
          { rating: '2-4', count: 123 },
          { rating: '4-6', count: 298 },
          { rating: '6-8', count: 456 },
          { rating: '8-10', count: 328 }
        ]
      }
      
      return {
        success: true,
        data: mockStats
      }
    }
  }

  // Mock data for development/fallback
  getMockContent(): MuviContent[] {
    return [
      {
        id: '1',
        title: "The Quantum Paradox",
        description: "A brilliant physicist discovers a way to manipulate time, but the consequences threaten the fabric of reality itself.",
        type: 'movie',
        genre: ["Sci-Fi", "Thriller"],
        year: 2024,
        rating: 8.5,
        duration: 135,
        thumbnail_url: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop_url: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1280",
        video_url: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Emma Stone", "Ryan Gosling", "John Doe"],
        director: "Christopher Nolan",
        language: "English",
        country: "USA",
        muvi_id: "muvi_1",
        is_premium: true,
        view_count: 125000,
        like_count: 8500
      },
      {
        id: '2',
        title: "Neon Nights",
        description: "In a cyberpunk future, a detective uncovers a conspiracy that threatens the city.",
        type: 'movie',
        genre: ["Action", "Cyberpunk", "Thriller"],
        year: 2024,
        rating: 7.8,
        duration: 118,
        thumbnail_url: "https://images.pexels.com/photos/3844798/pexels-photo-3844798.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop_url: "https://images.pexels.com/photos/3844798/pexels-photo-3844798.jpeg?auto=compress&cs=tinysrgb&w=1280",
        video_url: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Keanu Reeves", "Scarlett Johansson", "Michael Shannon"],
        director: "Denis Villeneuve",
        language: "English",
        country: "USA",
        muvi_id: "muvi_2",
        is_premium: false,
        view_count: 98000,
        like_count: 6200
      },
      {
        id: '3',
        title: "The Last Symphony",
        description: "A renowned composer faces their greatest challenge when they begin to lose their hearing.",
        type: 'movie',
        genre: ["Drama", "Music", "Biography"],
        year: 2024,
        rating: 9.1,
        duration: 152,
        thumbnail_url: "https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop_url: "https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=1280",
        video_url: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Meryl Streep", "Oscar Isaac", "Lupita Nyong'o"],
        director: "Damien Chazelle",
        language: "English",
        country: "USA",
        muvi_id: "muvi_3",
        is_premium: true,
        view_count: 156000,
        like_count: 12400
      }
    ]
  }

  clearCache() {
    this.cache.clear()
  }
}

export const muviAPIService = new MuviAPIService()