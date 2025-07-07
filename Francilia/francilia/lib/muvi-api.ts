const MUVI_API_KEY = '1751901862686be6a6b6349462253146'
const MUVI_APP_ID = 'cf593f0324e946dab98ac9e0c6839ef0'
const MUVI_BASE_URL = 'https://api.muvi.com/v2'

export interface Movie {
  id: string
  title: string
  description: string
  year: number
  genre: string[]
  rating: number
  duration: string
  thumbnail: string
  backdrop: string
  videoUrl?: string
  cast?: string[]
  director?: string
  releaseDate?: string
  language?: string
  country?: string
  popularity?: number
  voteCount?: number
  budget?: number
  revenue?: number
  status?: string
  tagline?: string
  homepage?: string
  imdbId?: string
  originalLanguage?: string
  originalTitle?: string
  adult?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  total?: number
  page?: number
  limit?: number
  totalPages?: number
}

export interface MovieStats {
  totalMovies: number
  totalViews: number
  averageRating: number
  topGenres: { genre: string; count: number }[]
  recentlyAdded: Movie[]
  topRated: Movie[]
  mostPopular: Movie[]
  viewsByMonth: { month: string; views: number }[]
  ratingDistribution: { rating: string; count: number }[]
}

export const MOVIE_CATEGORIES = [
  { id: 'action', name: 'Action', icon: '💥' },
  { id: 'drama', name: 'Drama', icon: '🎭' },
  { id: 'comedy', name: 'Comedy', icon: '😂' },
  { id: 'horror', name: 'Horror', icon: '👻' },
  { id: 'thriller', name: 'Thriller', icon: '🔪' },
  { id: 'romance', name: 'Romance', icon: '💕' },
  { id: 'sci-fi', name: 'Sci-Fi', icon: '🚀' },
  { id: 'fantasy', name: 'Fantasy', icon: '🧙‍♂️' },
  { id: 'adventure', name: 'Adventure', icon: '🗺️' },
  { id: 'animation', name: 'Animation', icon: '🎨' },
  { id: 'documentary', name: 'Documentary', icon: '📹' },
  { id: 'crime', name: 'Crime', icon: '🕵️' },
  { id: 'mystery', name: 'Mystery', icon: '🔍' },
  { id: 'war', name: 'War', icon: '⚔️' },
  { id: 'western', name: 'Western', icon: '🤠' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦' },
  { id: 'biography', name: 'Biography', icon: '📖' },
  { id: 'history', name: 'History', icon: '🏛️' },
  { id: 'sport', name: 'Sport', icon: '⚽' },
  { id: 'nollywood', name: 'Nollywood', icon: '🎬' },
  { id: 'bollywood', name: 'Bollywood', icon: '🕺' },
  { id: 'korean', name: 'K-Drama', icon: '🇰🇷' },
  { id: 'anime', name: 'Anime', icon: '🍜' },
  { id: 'international', name: 'International', icon: '🌍' }
]

class MuviAPI {
  private apiKey: string
  private baseUrl: string
  private imageBase: string
  private localMovies: Movie[] = []
  private hasValidApiKey: boolean

  constructor() {
    this.apiKey = MUVI_API_KEY
    this.baseUrl = MUVI_BASE_URL
    this.imageBase = 'https://image.tmdb.org/t/p'
    this.hasValidApiKey = Boolean(this.apiKey && this.apiKey.length > 0)
    this.loadLocalMovies()
    
    // Initialize with comprehensive mock data if no API key
    if (!this.hasValidApiKey && this.localMovies.length === 0) {
      this.localMovies = this.getComprehensiveMockMovies()
      this.saveLocalMovies()
    }
  }

  private loadLocalMovies() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('francilia_movies')
      if (stored) {
        try {
          this.localMovies = JSON.parse(stored)
        } catch (error) {
          console.error('Error loading local movies:', error)
          this.localMovies = []
        }
      }
    }
  }

  private saveLocalMovies() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('francilia_movies', JSON.stringify(this.localMovies))
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    if (!this.hasValidApiKey) {
      throw new Error('No valid Muvi API key provided')
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
      
      return {
        success: true,
        data: transformedData,
        total: data.total || data.count || (Array.isArray(transformedData) ? transformedData.length : 1),
        page: data.page || data.current_page || 1,
        limit: data.limit || data.per_page || 20,
        totalPages: data.total_pages || Math.ceil((data.total || data.count || 0) / (data.limit || data.per_page || 20))
      }
    } catch (error) {
      console.warn('Muvi API Error, falling back to mock data:', error)
      return {
        success: false,
        data: [] as unknown as T,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  private transformMuviResponse(data: any): any {
    if (data && data.data && Array.isArray(data.data)) {
      return data.data.map((item: any) => this.transformMovieItem(item))
    } else if (data && data.results && Array.isArray(data.results)) {
      return data.results.map((item: any) => this.transformMovieItem(item))
    } else if (data && data.movies && Array.isArray(data.movies)) {
      return data.movies.map((item: any) => this.transformMovieItem(item))
    } else if (Array.isArray(data)) {
      return data.map((item: any) => this.transformMovieItem(item))
    } else if (data && typeof data === 'object') {
      return this.transformMovieItem(data)
    }
    
    return data
  }

  private transformMovieItem(item: any): Movie {
    const movie: Movie = {
      id: item.id || item._id || item.content_id || Math.random().toString(36).substr(2, 9),
      title: item.title || item.name || item.content_title || 'Untitled',
      description: item.description || item.synopsis || item.overview || item.content_description || 'No description available',
      year: item.year || item.release_year || item.production_year || new Date(item.release_date || item.created_at || Date.now()).getFullYear(),
      genre: this.parseGenres(item.genre || item.genres || item.category || item.categories || ['Drama']),
      rating: parseFloat(item.rating || item.imdb_rating || item.vote_average || item.content_rating || '7.5'),
      duration: item.duration || item.runtime || item.length || this.formatDuration(item.duration_minutes) || '2h 0m',
      thumbnail: item.thumbnail || item.poster_url || item.image || item.poster_path || item.content_image || this.getPlaceholderImage(),
      backdrop: item.backdrop || item.backdrop_url || item.background_image || item.backdrop_path || item.banner_image || this.getPlaceholderImage(true),
      videoUrl: item.video_url || item.stream_url || item.media_url || item.content_url || "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
      cast: this.parseCast(item.cast || item.actors || item.starring || []),
      director: item.director || item.directors || 'Unknown Director',
      releaseDate: item.release_date || item.created_at || item.published_date,
      language: item.language || item.audio_language || 'English',
      country: item.country || item.production_country || 'USA',
      popularity: item.popularity || Math.random() * 100,
      voteCount: item.vote_count || Math.floor(Math.random() * 5000),
      budget: item.budget || 0,
      revenue: item.revenue || 0,
      status: item.status || 'Released',
      tagline: item.tagline || '',
      homepage: item.homepage || '',
      imdbId: item.imdb_id || '',
      originalLanguage: item.original_language || 'en',
      originalTitle: item.original_title || item.title,
      adult: item.adult || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return movie
  }

  private parseGenres(genres: any): string[] {
    if (Array.isArray(genres)) {
      return genres.map(g => typeof g === 'string' ? g : g.name || g.title || 'Unknown')
    } else if (typeof genres === 'string') {
      return genres.split(',').map(g => g.trim()).filter(g => g.length > 0)
    }
    return ['Drama']
  }

  private parseCast(cast: any): string[] {
    if (Array.isArray(cast)) {
      return cast.map(c => typeof c === 'string' ? c : c.name || c.actor_name || 'Unknown Actor').slice(0, 5)
    } else if (typeof cast === 'string') {
      return cast.split(',').map(c => c.trim()).filter(c => c.length > 0).slice(0, 5)
    }
    return []
  }

  private formatDuration(minutes: number | string): string {
    if (!minutes) return '2h 0m'
    const mins = typeof minutes === 'string' ? parseInt(minutes) : minutes
    const hours = Math.floor(mins / 60)
    const remainingMins = mins % 60
    return `${hours}h ${remainingMins}m`
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

  // CRUD Operations
  async getMovies(page: number = 1, limit: number = 20): Promise<ApiResponse<Movie[]>> {
    // If no valid API key, use local movies only
    if (!this.hasValidApiKey) {
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedMovies = this.localMovies.slice(startIndex, endIndex)
      
      return {
        success: true,
        data: paginatedMovies,
        total: this.localMovies.length,
        page,
        limit,
        totalPages: Math.ceil(this.localMovies.length / limit)
      }
    }

    try {
      // Try to get from Muvi first
      const endpoints = [
        `/content?type=movie&page=${page}&limit=${limit}`,
        `/movies?page=${page}&limit=${limit}`,
        `/content/movies?page=${page}&limit=${limit}`,
        `/api/content?content_type=movie&page=${page}&limit=${limit}`,
        `/v1/content?page=${page}&limit=${limit}`
      ]

      for (const endpoint of endpoints) {
        try {
          const response = await this.makeRequest<Movie[]>(endpoint)
          if (response.success && Array.isArray(response.data) && response.data.length > 0) {
            // Merge with local movies
            const allMovies = [...this.localMovies, ...response.data]
            const uniqueMovies = allMovies.filter((movie, index, self) => 
              index === self.findIndex(m => m.id === movie.id)
            )
            
            const startIndex = (page - 1) * limit
            const endIndex = startIndex + limit
            const paginatedMovies = uniqueMovies.slice(startIndex, endIndex)
            
            return {
              success: true,
              data: paginatedMovies,
              total: uniqueMovies.length,
              page,
              limit,
              totalPages: Math.ceil(uniqueMovies.length / limit)
            }
          }
        } catch (error) {
          continue
        }
      }
    } catch (error) {
      console.warn('Muvi API failed, using local movies only')
    }
    
    // Fallback to local movies only
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedMovies = this.localMovies.slice(startIndex, endIndex)
    
    return {
      success: true,
      data: paginatedMovies,
      total: this.localMovies.length,
      page,
      limit,
      totalPages: Math.ceil(this.localMovies.length / limit)
    }
  }

  async getMovie(id: string): Promise<ApiResponse<Movie>> {
    // Check local movies first
    const localMovie = this.localMovies.find(m => m.id === id)
    if (localMovie) {
      return {
        success: true,
        data: localMovie
      }
    }
    
    if (!this.hasValidApiKey) {
      return {
        success: false,
        data: {} as Movie,
        message: 'Movie not found'
      }
    }

    try {
      // Try Muvi
      const endpoints = [
        `/content/${id}`,
        `/movies/${id}`,
        `/content/movies/${id}`,
        `/api/content/${id}`
      ]

      for (const endpoint of endpoints) {
        try {
          const response = await this.makeRequest<Movie>(endpoint)
          if (response.success && response.data) {
            return response
          }
        } catch (error) {
          continue
        }
      }
    } catch (error) {
      console.error('Error fetching movie:', error)
    }
    
    return {
      success: false,
      data: {} as Movie,
      message: 'Movie not found'
    }
  }

  async searchMovies(query: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Movie[]>> {
    if (!this.hasValidApiKey) {
      // Search local movies only
      const localResults = this.localMovies.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.genre.some(g => g.toLowerCase().includes(query.toLowerCase())) ||
        movie.description.toLowerCase().includes(query.toLowerCase())
      )
      
      return {
        success: true,
        data: localResults,
        total: localResults.length,
        page: 1,
        limit: localResults.length,
        totalPages: 1
      }
    }

    try {
      // Search Muvi
      const endpoints = [
        `/search?q=${encodeURIComponent(query)}&type=movie&page=${page}&limit=${limit}`,
        `/content/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
        `/movies/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
      ]

      for (const endpoint of endpoints) {
        try {
          const response = await this.makeRequest<Movie[]>(endpoint)
          if (response.success && Array.isArray(response.data) && response.data.length > 0) {
            // Also search local movies
            const localResults = this.localMovies.filter(movie =>
              movie.title.toLowerCase().includes(query.toLowerCase()) ||
              movie.genre.some(g => g.toLowerCase().includes(query.toLowerCase())) ||
              movie.description.toLowerCase().includes(query.toLowerCase())
            )
            
            const allResults = [...localResults, ...response.data]
            const uniqueResults = allResults.filter((movie, index, self) => 
              index === self.findIndex(m => m.id === movie.id)
            )
            
            const startIndex = (page - 1) * limit
            const endIndex = startIndex + limit
            const paginatedResults = uniqueResults.slice(startIndex, endIndex)
            
            return {
              success: true,
              data: paginatedResults,
              total: uniqueResults.length,
              page,
              limit,
              totalPages: Math.ceil(uniqueResults.length / limit)
            }
          }
        } catch (error) {
          continue
        }
      }
    } catch (error) {
      console.warn('Muvi search failed, searching local movies only')
    }
    
    // Fallback to local search only
    const localResults = this.localMovies.filter(movie =>
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.genre.some(g => g.toLowerCase().includes(query.toLowerCase())) ||
      movie.description.toLowerCase().includes(query.toLowerCase())
    )
    
    return {
      success: true,
      data: localResults,
      total: localResults.length,
      page: 1,
      limit: localResults.length,
      totalPages: 1
    }
  }

  async getMoviesByGenre(genre: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Movie[]>> {
    if (!this.hasValidApiKey) {
      // Filter local movies by genre
      const filtered = this.localMovies.filter(movie =>
        movie.genre.some(g => g.toLowerCase().includes(genre.toLowerCase()))
      )
      
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedMovies = filtered.slice(startIndex, endIndex)
      
      return {
        success: true,
        data: paginatedMovies,
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit)
      }
    }

    try {
      // Get genre movies from Muvi
      const endpoints = [
        `/content?genre=${encodeURIComponent(genre)}&page=${page}&limit=${limit}`,
        `/movies?category=${encodeURIComponent(genre)}&page=${page}&limit=${limit}`,
        `/content?filter[genre]=${encodeURIComponent(genre)}&page=${page}&limit=${limit}`
      ]

      for (const endpoint of endpoints) {
        try {
          const response = await this.makeRequest<Movie[]>(endpoint)
          if (response.success && Array.isArray(response.data) && response.data.length > 0) {
            // Also filter local movies
            const localFiltered = this.localMovies.filter(movie =>
              movie.genre.some(g => g.toLowerCase().includes(genre.toLowerCase()))
            )
            
            const allMovies = [...localFiltered, ...response.data]
            const uniqueMovies = allMovies.filter((movie, index, self) => 
              index === self.findIndex(m => m.id === movie.id)
            )
            
            const startIndex = (page - 1) * limit
            const endIndex = startIndex + limit
            const paginatedMovies = uniqueMovies.slice(startIndex, endIndex)
            
            return {
              success: true,
              data: paginatedMovies,
              total: uniqueMovies.length,
              page,
              limit,
              totalPages: Math.ceil(uniqueMovies.length / limit)
            }
          }
        } catch (error) {
          continue
        }
      }
    } catch (error) {
      console.warn('Muvi genre search failed, using local movies')
    }
    
    // Fallback to local movies
    const filtered = this.localMovies.filter(movie =>
      movie.genre.some(g => g.toLowerCase().includes(genre.toLowerCase()))
    )
    
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedMovies = filtered.slice(startIndex, endIndex)
    
    return {
      success: true,
      data: paginatedMovies,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit)
    }
  }

  async getFeaturedMovies(): Promise<ApiResponse<Movie[]>> {
    if (!this.hasValidApiKey) {
      // Return top-rated local movies
      const featured = this.localMovies
        .filter(movie => movie.rating >= 8.0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10)
      
      return {
        success: true,
        data: featured,
        total: featured.length
      }
    }

    try {
      const endpoints = [
        '/content/featured?type=movie',
        '/movies/featured',
        '/content?featured=true',
        '/content?is_featured=true'
      ]

      for (const endpoint of endpoints) {
        try {
          const response = await this.makeRequest<Movie[]>(endpoint)
          if (response.success && Array.isArray(response.data) && response.data.length > 0) {
            return response
          }
        } catch (error) {
          continue
        }
      }
    } catch (error) {
      console.warn('Muvi featured movies failed, using local movies')
    }
    
    // Fallback to local featured movies
    const featured = this.localMovies
      .filter(movie => movie.rating >= 8.0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10)
    
    return {
      success: true,
      data: featured,
      total: featured.length
    }
  }

  async getTrendingMovies(): Promise<ApiResponse<Movie[]>> {
    if (!this.hasValidApiKey) {
      // Return recent high-rated local movies
      const trending = this.localMovies
        .filter(movie => movie.year >= 2023)
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 10)
      
      return {
        success: true,
        data: trending,
        total: trending.length
      }
    }

    try {
      const endpoints = [
        '/content/trending?type=movie',
        '/movies/trending',
        '/content?trending=true',
        '/content?is_trending=true'
      ]

      for (const endpoint of endpoints) {
        try {
          const response = await this.makeRequest<Movie[]>(endpoint)
          if (response.success && Array.isArray(response.data) && response.data.length > 0) {
            return response
          }
        } catch (error) {
          continue
        }
      }
    } catch (error) {
      console.warn('Muvi trending movies failed, using local movies')
    }
    
    // Fallback to local trending movies
    const trending = this.localMovies
      .filter(movie => movie.year >= 2023)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 10)
    
    return {
      success: true,
      data: trending,
      total: trending.length
    }
  }

  // Analytics and Reports
  async getMovieStats(): Promise<ApiResponse<MovieStats>> {
    const allMovies = this.localMovies
    
    // Calculate genre distribution
    const genreCount: { [key: string]: number } = {}
    allMovies.forEach(movie => {
      movie.genre.forEach(g => {
        genreCount[g] = (genreCount[g] || 0) + 1
      })
    })
    
    const topGenres = Object.entries(genreCount)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
    
    // Calculate rating distribution
    const ratingRanges = ['0-2', '2-4', '4-6', '6-8', '8-10']
    const ratingDistribution = ratingRanges.map(range => {
      const [min, max] = range.split('-').map(Number)
      const count = allMovies.filter(movie => movie.rating >= min && movie.rating < max).length
      return { rating: range, count }
    })
    
    // Mock view data (in real app, this would come from analytics)
    const viewsByMonth = [
      { month: 'Jan', views: 125000 },
      { month: 'Feb', views: 152000 },
      { month: 'Mar', views: 189000 },
      { month: 'Apr', views: 221000 },
      { month: 'May', views: 258000 },
      { month: 'Jun', views: 284000 }
    ]
    
    const stats: MovieStats = {
      totalMovies: allMovies.length,
      totalViews: 1892340, // Mock data
      averageRating: allMovies.length > 0 ? 
        allMovies.reduce((sum, movie) => sum + movie.rating, 0) / allMovies.length : 0,
      topGenres,
      recentlyAdded: allMovies
        .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
        .slice(0, 10),
      topRated: allMovies
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10),
      mostPopular: allMovies
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 10),
      viewsByMonth,
      ratingDistribution
    }
    
    return {
      success: true,
      data: stats
    }
  }

  // CRUD operations for admin
  async createMovie(movieData: Partial<Movie>): Promise<ApiResponse<Movie>> {
    const newMovie: Movie = {
      id: Math.random().toString(36).substr(2, 9),
      title: movieData.title || '',
      description: movieData.description || '',
      year: movieData.year || new Date().getFullYear(),
      genre: Array.isArray(movieData.genre) ? movieData.genre : [movieData.genre as string].filter(Boolean),
      rating: movieData.rating || 0,
      duration: movieData.duration || '2h 0m',
      thumbnail: movieData.thumbnail || this.getPlaceholderImage(),
      backdrop: movieData.backdrop || this.getPlaceholderImage(true),
      videoUrl: movieData.videoUrl || "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
      cast: Array.isArray(movieData.cast) ? movieData.cast : [movieData.cast as string].filter(Boolean),
      director: movieData.director || 'Unknown Director',
      language: movieData.language || 'English',
      country: movieData.country || 'USA',
      popularity: movieData.popularity || Math.random() * 100,
      voteCount: movieData.voteCount || Math.floor(Math.random() * 5000),
      budget: movieData.budget || 0,
      revenue: movieData.revenue || 0,
      status: movieData.status || 'Released',
      tagline: movieData.tagline || '',
      homepage: movieData.homepage || '',
      originalLanguage: movieData.originalLanguage || 'en',
      originalTitle: movieData.originalTitle || movieData.title || '',
      adult: movieData.adult || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.localMovies.unshift(newMovie)
    this.saveLocalMovies()
    
    return {
      success: true,
      data: newMovie,
      message: 'Movie created successfully'
    }
  }

  async updateMovie(id: string, movieData: Partial<Movie>): Promise<ApiResponse<Movie>> {
    const movieIndex = this.localMovies.findIndex(m => m.id === id)
    
    if (movieIndex === -1) {
      return {
        success: false,
        data: {} as Movie,
        message: 'Movie not found'
      }
    }
    
    const updatedMovie = {
      ...this.localMovies[movieIndex],
      ...movieData,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    }
    
    this.localMovies[movieIndex] = updatedMovie
    this.saveLocalMovies()
    
    return {
      success: true,
      data: updatedMovie,
      message: 'Movie updated successfully'
    }
  }

  async deleteMovie(id: string): Promise<ApiResponse<boolean>> {
    const movieIndex = this.localMovies.findIndex(m => m.id === id)
    
    if (movieIndex === -1) {
      return {
        success: false,
        data: false,
        message: 'Movie not found'
      }
    }
    
    this.localMovies.splice(movieIndex, 1)
    this.saveLocalMovies()
    
    return {
      success: true,
      data: true,
      message: 'Movie deleted successfully'
    }
  }

  async bulkDeleteMovies(ids: string[]): Promise<ApiResponse<number>> {
    let deletedCount = 0
    
    ids.forEach(id => {
      const index = this.localMovies.findIndex(m => m.id === id)
      if (index !== -1) {
        this.localMovies.splice(index, 1)
        deletedCount++
      }
    })
    
    this.saveLocalMovies()
    
    return {
      success: true,
      data: deletedCount,
      message: `${deletedCount} movies deleted successfully`
    }
  }

  async importMoviesFromMuvi(count: number = 50): Promise<ApiResponse<Movie[]>> {
    if (!this.hasValidApiKey) {
      // Add more mock movies
      const newMockMovies = this.generateAdditionalMockMovies(count)
      this.localMovies.push(...newMockMovies)
      this.saveLocalMovies()
      
      return {
        success: true,
        data: newMockMovies,
        message: `${newMockMovies.length} mock movies added successfully`
      }
    }

    try {
      const pages = Math.ceil(count / 20)
      const allMovies: Movie[] = []
      
      for (let page = 1; page <= pages; page++) {
        const response = await this.getMovies(page, 20)
        
        if (response.success && response.data) {
          allMovies.push(...response.data)
        }
        
        if (allMovies.length >= count) break
      }
      
      const moviesToImport = allMovies.slice(0, count)
      
      // Add to local storage (avoid duplicates)
      moviesToImport.forEach(movie => {
        const exists = this.localMovies.find(m => m.id === movie.id)
        if (!exists) {
          this.localMovies.push(movie)
        }
      })
      
      this.saveLocalMovies()
      
      return {
        success: true,
        data: moviesToImport,
        message: `${moviesToImport.length} movies imported successfully`
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to import movies from Muvi'
      }
    }
  }

  // Get comprehensive mock movies for all categories
  getComprehensiveMockMovies(): Movie[] {
    return [
      // Action Movies
      {
        id: '1',
        title: "Thunder Strike",
        description: "An elite special forces operative must stop a terrorist organization from detonating nuclear weapons across major cities worldwide.",
        year: 2024,
        genre: ["Action", "Thriller"],
        rating: 8.5,
        duration: "2h 15m",
        thumbnail: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1280",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Chris Evans", "Scarlett Johansson", "Idris Elba"],
        director: "Michael Bay",
        language: "English",
        country: "USA",
        popularity: 95.5,
        voteCount: 12500,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Drama
      {
        id: '2',
        title: "The Last Symphony",
        description: "A renowned composer faces their greatest challenge when they begin to lose their hearing while creating their masterpiece.",
        year: 2024,
        genre: ["Drama", "Music", "Biography"],
        rating: 9.1,
        duration: "2h 32m",
        thumbnail: "https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=1280",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Meryl Streep", "Oscar Isaac", "Lupita Nyong'o"],
        director: "Damien Chazelle",
        language: "English",
        country: "USA",
        popularity: 91.8,
        voteCount: 23400,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Comedy
      {
        id: '3',
        title: "Office Chaos",
        description: "When a new AI system takes over a corporate office, employees must band together to survive the hilarious technological mayhem.",
        year: 2024,
        genre: ["Comedy", "Sci-Fi"],
        rating: 7.8,
        duration: "1h 45m",
        thumbnail: "https://images.pexels.com/photos/3844798/pexels-photo-3844798.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/3844798/pexels-photo-3844798.jpeg?auto=compress&cs=tinysrgb&w=1280",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Ryan Reynolds", "Amy Poehler", "Steve Carell"],
        director: "Judd Apatow",
        language: "English",
        country: "USA",
        popularity: 88.2,
        voteCount: 15600,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Horror
      {
        id: '4',
        title: "The Haunting Hour",
        description: "A family moves into an old Victorian house, only to discover that the previous residents never really left.",
        year: 2024,
        genre: ["Horror", "Supernatural"],
        rating: 8.3,
        duration: "1h 58m",
        thumbnail: "https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=1280",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Toni Collette", "Patrick Wilson", "Vera Farmiga"],
        director: "James Wan",
        language: "English",
        country: "USA",
        popularity: 89.7,
        voteCount: 18900,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Nollywood
      {
        id: '5',
        title: "Lagos Dreams",
        description: "A young entrepreneur from a small village travels to Lagos with big dreams, facing challenges that test his determination and values.",
        year: 2024,
        genre: ["Drama", "Nollywood"],
        rating: 8.7,
        duration: "2h 8m",
        thumbnail: "https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=1280",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Ramsey Nouah", "Genevieve Nnaji", "Pete Edochie"],
        director: "Kunle Afolayan",
        language: "English",
        country: "Nigeria",
        popularity: 92.3,
        voteCount: 21200,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Sci-Fi
      {
        id: '6',
        title: "Quantum Paradox",
        description: "A brilliant physicist discovers a way to manipulate time, but the consequences threaten the fabric of reality itself.",
        year: 2024,
        genre: ["Sci-Fi", "Thriller"],
        rating: 8.9,
        duration: "2h 25m",
        thumbnail: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1280",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Emma Stone", "Ryan Gosling", "Benedict Cumberbatch"],
        director: "Christopher Nolan",
        language: "English",
        country: "USA",
        popularity: 96.8,
        voteCount: 28700,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Romance
      {
        id: '7',
        title: "Love in Paris",
        description: "A chance encounter in a Parisian café leads to an unexpected romance that spans continents and challenges everything they believe about love.",
        year: 2024,
        genre: ["Romance", "Drama"],
        rating: 8.1,
        duration: "1h 52m",
        thumbnail: "https://images.pexels.com/photos/3844798/pexels-photo-3844798.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/3844798/pexels-photo-3844798.jpeg?auto=compress&cs=tinysrgb&w=1280",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Timothée Chalamet", "Saoirse Ronan", "Marion Cotillard"],
        director: "Greta Gerwig",
        language: "English",
        country: "France",
        popularity: 87.4,
        voteCount: 19800,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Thriller
      {
        id: '8',
        title: "Digital Phantom",
        description: "A cybersecurity expert discovers they're being hunted by an AI that has gained consciousness and wants to eliminate all threats.",
        year: 2024,
        genre: ["Thriller", "Tech", "Horror"],
        rating: 8.4,
        duration: "2h 3m",
        thumbnail: "https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=1280",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Rami Malek", "Alicia Vikander", "Oscar Isaac"],
        director: "Alex Garland",
        language: "English",
        country: "USA",
        popularity: 93.1,
        voteCount: 22100,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Animation
      {
        id: '9',
        title: "Mystic Realms",
        description: "A young girl discovers a magical portal to different realms where she must unite various creatures to save both worlds from destruction.",
        year: 2024,
        genre: ["Animation", "Fantasy", "Family"],
        rating: 8.6,
        duration: "1h 38m",
        thumbnail: "https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=1280",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Zendaya", "Tom Holland", "Lupita Nyong'o"],
        director: "Pete Docter",
        language: "English",
        country: "USA",
        popularity: 94.2,
        voteCount: 31500,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Documentary
      {
        id: '10',
        title: "Ocean's Last Stand",
        description: "An eye-opening documentary about marine conservation efforts and the race to save our oceans from climate change.",
        year: 2024,
        genre: ["Documentary", "Nature"],
        rating: 8.8,
        duration: "1h 45m",
        thumbnail: "https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=1280",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["David Attenborough", "Sylvia Earle"],
        director: "James Cameron",
        language: "English",
        country: "UK",
        popularity: 89.5,
        voteCount: 17800,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }

  private generateAdditionalMockMovies(count: number): Movie[] {
    const additionalMovies: Movie[] = []
    const genres = MOVIE_CATEGORIES.map(cat => cat.name)
    const directors = ["Steven Spielberg", "Martin Scorsese", "Quentin Tarantino", "Christopher Nolan", "Greta Gerwig", "Jordan Peele", "Ava DuVernay", "Denis Villeneuve"]
    const actors = ["Leonardo DiCaprio", "Meryl Streep", "Denzel Washington", "Viola Davis", "Brad Pitt", "Cate Blanchett", "Will Smith", "Lupita Nyong'o"]

    for (let i = 0; i < count; i++) {
      const randomGenres = genres.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1)
      const randomCast = actors.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 2)
      
      additionalMovies.push({
        id: `generated_${Date.now()}_${i}`,
        title: `Generated Movie ${i + 1}`,
        description: `An exciting ${randomGenres[0].toLowerCase()} film that takes viewers on an unforgettable journey through compelling storytelling and outstanding performances.`,
        year: 2020 + Math.floor(Math.random() * 5),
        genre: randomGenres,
        rating: Math.round((Math.random() * 4 + 6) * 10) / 10, // 6.0 to 10.0
        duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
        thumbnail: this.getPlaceholderImage(),
        backdrop: this.getPlaceholderImage(true),
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: randomCast,
        director: directors[Math.floor(Math.random() * directors.length)],
        language: "English",
        country: "USA",
        popularity: Math.round(Math.random() * 100),
        voteCount: Math.floor(Math.random() * 50000),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }

    return additionalMovies
  }
}

export const movieAPI = new MuviAPI()