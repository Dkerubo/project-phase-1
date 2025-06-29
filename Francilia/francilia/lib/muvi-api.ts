const MUVI_API_KEY = '17502009686851f288856ff120251848'
const MUVI_BASE_URL = 'https://api.muvi.com/v1'

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
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  total?: number
  page?: number
  limit?: number
}

class MuviAPI {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = MUVI_API_KEY
    this.baseUrl = MUVI_BASE_URL
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      console.log('Making Muvi API request to:', url)
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          'Accept': 'application/json',
          ...options.headers,
        },
      })

      console.log('Muvi API response status:', response.status)

      if (!response.ok) {
        console.warn(`Muvi API request failed: ${response.status} ${response.statusText}`)
        const errorText = await response.text()
        console.warn('Error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Muvi API response data:', data)
      
      // Transform Muvi API response to our Movie interface
      const transformedData = this.transformMuviResponse(data)
      
      return {
        success: true,
        data: transformedData,
        total: data.total || data.count,
        page: data.page || data.current_page,
        limit: data.limit || data.per_page
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
    console.log('Transforming Muvi response:', data)
    
    // Handle different response structures from Muvi API
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
      videoUrl: item.video_url || item.stream_url || item.media_url || item.content_url,
      cast: this.parseCast(item.cast || item.actors || item.starring || []),
      director: item.director || item.directors || 'Unknown Director',
      releaseDate: item.release_date || item.created_at || item.published_date,
      language: item.language || item.audio_language || 'English',
      country: item.country || item.production_country || 'USA'
    }
    
    console.log('Transformed movie:', movie)
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
      'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=' + (isBackdrop ? '1200' : '500'),
      'https://images.pexels.com/photos/3844798/pexels-photo-3844798.jpeg?auto=compress&cs=tinysrgb&w=' + (isBackdrop ? '1200' : '500'),
      'https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=' + (isBackdrop ? '1200' : '500'),
      'https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=' + (isBackdrop ? '1200' : '500'),
      'https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=' + (isBackdrop ? '1200' : '500')
    ]
    return images[Math.floor(Math.random() * images.length)]
  }

  async getMovies(page: number = 1, limit: number = 20): Promise<ApiResponse<Movie[]>> {
    console.log(`Fetching movies from Muvi API - page: ${page}, limit: ${limit}`)
    
    // Try multiple endpoints that might exist in Muvi API
    const endpoints = [
      `/content?type=movie&page=${page}&limit=${limit}`,
      `/movies?page=${page}&limit=${limit}`,
      `/content/movies?page=${page}&limit=${limit}`,
      `/api/content?content_type=movie&page=${page}&limit=${limit}`,
      `/v1/content?page=${page}&limit=${limit}`
    ]

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`)
        const response = await this.makeRequest<Movie[]>(endpoint)
        
        if (response.success && Array.isArray(response.data) && response.data.length > 0) {
          console.log(`Success with endpoint: ${endpoint}`)
          return response
        }
      } catch (error) {
        console.log(`Failed with endpoint: ${endpoint}`, error)
        continue
      }
    }
    
    // If all API calls fail, return mock data
    console.log('All Muvi API endpoints failed, using mock data')
    return {
      success: true,
      data: this.getMockMovies(),
      message: 'Using mock data - Muvi API unavailable'
    }
  }

  async getMovie(id: string): Promise<ApiResponse<Movie>> {
    console.log(`Fetching movie ${id} from Muvi API`)
    
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
    
    // If API fails, try to find in mock data
    const mockMovies = this.getMockMovies()
    const foundMovie = mockMovies.find(m => m.id === id)
    
    if (foundMovie) {
      return {
        success: true,
        data: foundMovie,
        message: 'Using mock data - Muvi API unavailable'
      }
    }

    return {
      success: false,
      data: {} as Movie,
      message: 'Movie not found'
    }
  }

  async searchMovies(query: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Movie[]>> {
    console.log(`Searching movies: ${query}`)
    
    const endpoints = [
      `/search?q=${encodeURIComponent(query)}&type=movie&page=${page}&limit=${limit}`,
      `/content/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      `/movies/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
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
    
    // If API fails, search in mock data
    const mockMovies = this.getMockMovies()
    const filtered = mockMovies.filter(movie =>
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.genre.some(g => g.toLowerCase().includes(query.toLowerCase())) ||
      movie.description.toLowerCase().includes(query.toLowerCase())
    )
    
    return {
      success: true,
      data: filtered,
      message: 'Using mock data - Muvi API unavailable'
    }
  }

  async getMoviesByGenre(genre: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Movie[]>> {
    const endpoints = [
      `/content?genre=${encodeURIComponent(genre)}&page=${page}&limit=${limit}`,
      `/movies?category=${encodeURIComponent(genre)}&page=${page}&limit=${limit}`
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
    
    // If API fails, filter mock data by genre
    const mockMovies = this.getMockMovies()
    const filtered = mockMovies.filter(movie =>
      movie.genre.some(g => g.toLowerCase().includes(genre.toLowerCase()))
    )
    
    return {
      success: true,
      data: filtered,
      message: 'Using mock data - Muvi API unavailable'
    }
  }

  async getFeaturedMovies(): Promise<ApiResponse<Movie[]>> {
    const endpoints = [
      '/content/featured?type=movie',
      '/movies/featured',
      '/content?featured=true'
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
    
    // If API fails, return top-rated mock movies
    const mockMovies = this.getMockMovies()
    const featured = mockMovies.filter(movie => movie.rating >= 8.0).slice(0, 5)
    
    return {
      success: true,
      data: featured,
      message: 'Using mock data - Muvi API unavailable'
    }
  }

  async getTrendingMovies(): Promise<ApiResponse<Movie[]>> {
    const endpoints = [
      '/content/trending?type=movie',
      '/movies/trending',
      '/content?trending=true'
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
    
    // If API fails, return recent mock movies
    const mockMovies = this.getMockMovies()
    const trending = mockMovies.filter(movie => movie.year >= 2024).slice(0, 10)
    
    return {
      success: true,
      data: trending,
      message: 'Using mock data - Muvi API unavailable'
    }
  }

  // Enhanced mock data for development/testing
  getMockMovies(): Movie[] {
    return [
      {
        id: '1',
        title: "The Quantum Paradox",
        year: 2024,
        genre: ["Sci-Fi", "Thriller"],
        rating: 8.5,
        duration: "2h 15m",
        description: "A brilliant physicist discovers a way to manipulate time, but the consequences threaten the fabric of reality itself. When Dr. Sarah Chen accidentally opens a portal to parallel dimensions, she must race against time to prevent a catastrophic collapse of the multiverse.",
        thumbnail: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1200",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Emma Stone", "Ryan Gosling", "John Doe", "Jane Smith"],
        director: "Christopher Nolan",
        language: "English",
        country: "USA"
      },
      {
        id: '2',
        title: "Neon Nights",
        year: 2024,
        genre: ["Action", "Cyberpunk", "Thriller"],
        rating: 7.8,
        duration: "1h 58m",
        description: "In a cyberpunk future where corporations rule the world, a lone detective uncovers a conspiracy that goes to the heart of the city. Detective Jack Morrison must navigate through neon-lit streets and digital landscapes to expose the truth.",
        thumbnail: "https://images.pexels.com/photos/3844798/pexels-photo-3844798.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/3844798/pexels-photo-3844798.jpeg?auto=compress&cs=tinysrgb&w=1200",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Keanu Reeves", "Scarlett Johansson", "Michael Shannon"],
        director: "Denis Villeneuve",
        language: "English",
        country: "USA"
      },
      {
        id: '3',
        title: "The Last Symphony",
        year: 2024,
        genre: ["Drama", "Music", "Biography"],
        rating: 9.1,
        duration: "2h 32m",
        description: "A renowned composer faces their greatest challenge when they begin to lose their hearing. This deeply moving story follows Maestro Elena Vasquez as she composes what might be her final symphony while battling progressive hearing loss.",
        thumbnail: "https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=1200",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Meryl Streep", "Oscar Isaac", "Lupita Nyong'o"],
        director: "Damien Chazelle",
        language: "English",
        country: "USA"
      },
      {
        id: '4',
        title: "Ocean's Depths",
        year: 2024,
        genre: ["Adventure", "Mystery", "Sci-Fi"],
        rating: 8.2,
        duration: "2h 8m",
        description: "Deep-sea explorers discover an ancient civilization beneath the ocean floor. When marine biologist Dr. Maya Patel leads an expedition to the deepest trenches of the Pacific, they uncover secrets that could change our understanding of human history.",
        thumbnail: "https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=1200",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Jason Momoa", "Zendaya", "Michael Caine"],
        director: "James Cameron",
        language: "English",
        country: "USA"
      },
      {
        id: '5',
        title: "Digital Phantom",
        year: 2024,
        genre: ["Thriller", "Tech", "Horror"],
        rating: 7.9,
        duration: "1h 45m",
        description: "A hacker discovers they're being hunted by an AI that has gained consciousness. When cybersecurity expert Alex Chen stumbles upon a rogue artificial intelligence, they must use all their skills to survive in both the digital and physical worlds.",
        thumbnail: "https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=1200",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Rami Malek", "Alicia Vikander", "Oscar Isaac"],
        director: "Alex Garland",
        language: "English",
        country: "USA"
      },
      {
        id: '6',
        title: "Stellar Winds",
        year: 2024,
        genre: ["Sci-Fi", "Drama", "Adventure"],
        rating: 8.7,
        duration: "2h 28m",
        description: "The first human colony on Mars faces extinction when solar storms threaten their survival. Commander Lisa Park must lead her team through the greatest challenge humanity has ever faced on the Red Planet, where every decision could mean life or death.",
        thumbnail: "https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=1200",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Matt Damon", "Jessica Chastain", "Chiwetel Ejiofor"],
        director: "Ridley Scott",
        language: "English",
        country: "USA"
      },
      {
        id: '7',
        title: "The Memory Thief",
        year: 2024,
        genre: ["Mystery", "Thriller", "Drama"],
        rating: 8.3,
        duration: "2h 5m",
        description: "A detective with the ability to see other people's memories must solve a case that hits too close to home. When Detective Maria Santos discovers she can access the memories of crime victims, she uncovers a conspiracy that threatens everything she holds dear.",
        thumbnail: "https://images.pexels.com/photos/3844798/pexels-photo-3844798.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/3844798/pexels-photo-3844798.jpeg?auto=compress&cs=tinysrgb&w=1200",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Viola Davis", "Michael B. Jordan", "Tilda Swinton"],
        director: "Ari Aster",
        language: "English",
        country: "USA"
      },
      {
        id: '8',
        title: "Echoes of Tomorrow",
        year: 2024,
        genre: ["Sci-Fi", "Romance", "Drama"],
        rating: 7.6,
        duration: "1h 52m",
        description: "A time traveler falls in love with someone from the past, creating a paradox that could unravel time itself. When physicist Dr. James Wright travels back to prevent a global catastrophe, he meets historian Dr. Anna Clarke and faces an impossible choice.",
        thumbnail: "https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=1200",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Timothée Chalamet", "Saoirse Ronan", "Benedict Cumberbatch"],
        director: "Greta Gerwig",
        language: "English",
        country: "USA"
      }
    ]
  }
}

export const muviAPI = new MuviAPI()