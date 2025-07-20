const TMDB_API_KEY = '084dc6efc429c3a4362322cd2023f6f5'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

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

class MovieAPI {
  private apiKey: string
  private baseUrl: string
  private imageBase: string
  private localMovies: Movie[] = []
  private hasValidApiKey: boolean

  constructor() {
    this.apiKey = TMDB_API_KEY
    this.baseUrl = TMDB_BASE_URL
    this.imageBase = TMDB_IMAGE_BASE
    this.hasValidApiKey = Boolean(this.apiKey && this.apiKey.length > 0)
    this.loadLocalMovies()
    
    // Initialize with mock data if no API key
    if (!this.hasValidApiKey && this.localMovies.length === 0) {
      this.localMovies = this.getMockMovies()
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

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.hasValidApiKey) {
      throw new Error('No valid TMDB API key provided')
    }

    try {
      const url = `${this.baseUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${this.apiKey}`
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('TMDB API Error:', error)
      throw error
    }
  }

  private transformTMDBMovie(tmdbMovie: any): Movie {
    const movie: Movie = {
      id: tmdbMovie.id?.toString() || Math.random().toString(36).substr(2, 9),
      title: tmdbMovie.title || tmdbMovie.name || 'Untitled',
      description: tmdbMovie.overview || 'No description available',
      year: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : 
            tmdbMovie.first_air_date ? new Date(tmdbMovie.first_air_date).getFullYear() : 
            new Date().getFullYear(),
      genre: tmdbMovie.genre_ids ? this.getGenreNames(tmdbMovie.genre_ids) : 
             tmdbMovie.genres ? tmdbMovie.genres.map((g: any) => g.name) : ['Unknown'],
      rating: tmdbMovie.vote_average || 0,
      duration: tmdbMovie.runtime ? `${Math.floor(tmdbMovie.runtime / 60)}h ${tmdbMovie.runtime % 60}m` : '2h 0m',
      thumbnail: tmdbMovie.poster_path ? `${this.imageBase}/w500${tmdbMovie.poster_path}` : this.getPlaceholderImage(),
      backdrop: tmdbMovie.backdrop_path ? `${this.imageBase}/w1280${tmdbMovie.backdrop_path}` : this.getPlaceholderImage(true),
      videoUrl: `https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761`,
      cast: [],
      director: 'Unknown Director',
      releaseDate: tmdbMovie.release_date || tmdbMovie.first_air_date,
      language: tmdbMovie.original_language || 'en',
      country: tmdbMovie.production_countries?.[0]?.name || 'USA',
      popularity: tmdbMovie.popularity || 0,
      voteCount: tmdbMovie.vote_count || 0,
      budget: tmdbMovie.budget || 0,
      revenue: tmdbMovie.revenue || 0,
      status: tmdbMovie.status || 'Released',
      tagline: tmdbMovie.tagline || '',
      homepage: tmdbMovie.homepage || '',
      imdbId: tmdbMovie.imdb_id || '',
      originalLanguage: tmdbMovie.original_language || 'en',
      originalTitle: tmdbMovie.original_title || tmdbMovie.original_name || tmdbMovie.title,
      adult: tmdbMovie.adult || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return movie
  }

  private getGenreNames(genreIds: number[]): string[] {
    const genreMap: { [key: number]: string } = {
      28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
      99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
      27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
      10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
    }
    return genreIds.map(id => genreMap[id] || 'Unknown').filter(Boolean)
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
      // Try to get from TMDB first
      const tmdbResponse = await this.makeRequest<any>(`/movie/popular?page=${page}`)
      
      if (tmdbResponse.results && tmdbResponse.results.length > 0) {
        const movies = tmdbResponse.results.map((movie: any) => this.transformTMDBMovie(movie))
        
        // Merge with local movies
        const allMovies = [...this.localMovies, ...movies]
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
      console.warn('TMDB API failed, using local movies only')
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
      // Try TMDB
      const tmdbMovie = await this.makeRequest<any>(`/movie/${id}`)
      const movie = this.transformTMDBMovie(tmdbMovie)
      
      return {
        success: true,
        data: movie
      }
    } catch (error) {
      return {
        success: false,
        data: {} as Movie,
        message: 'Movie not found'
      }
    }
  }

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
      videoUrl: movieData.videoUrl,
      cast: Array.isArray(movieData.cast) ? movieData.cast : [movieData.cast as string].filter(Boolean),
      director: movieData.director || 'Unknown Director',
      language: movieData.language || 'English',
      country: movieData.country || 'USA',
      popularity: movieData.popularity || 0,
      voteCount: movieData.voteCount || 0,
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
      // Search TMDB
      const tmdbResponse = await this.makeRequest<any>(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`)
      
      if (tmdbResponse.results) {
        const tmdbMovies = tmdbResponse.results.map((movie: any) => this.transformTMDBMovie(movie))
        
        // Also search local movies
        const localResults = this.localMovies.filter(movie =>
          movie.title.toLowerCase().includes(query.toLowerCase()) ||
          movie.genre.some(g => g.toLowerCase().includes(query.toLowerCase())) ||
          movie.description.toLowerCase().includes(query.toLowerCase())
        )
        
        const allResults = [...localResults, ...tmdbMovies]
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
      console.warn('TMDB search failed, searching local movies only')
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
      
      return {
        success: true,
        data: filtered,
        total: filtered.length,
        page: 1,
        limit: filtered.length,
        totalPages: 1
      }
    }

    try {
      // Get genre ID for TMDB
      const genreMap: { [key: string]: number } = {
        'action': 28, 'adventure': 12, 'animation': 16, 'comedy': 35, 'crime': 80,
        'documentary': 99, 'drama': 18, 'family': 10751, 'fantasy': 14, 'history': 36,
        'horror': 27, 'music': 10402, 'mystery': 9648, 'romance': 10749, 'science fiction': 878,
        'thriller': 53, 'war': 10752, 'western': 37
      }
      
      const genreId = genreMap[genre.toLowerCase()]
      if (genreId) {
        const tmdbResponse = await this.makeRequest<any>(`/discover/movie?with_genres=${genreId}&page=${page}`)
        
        if (tmdbResponse.results) {
          const movies = tmdbResponse.results.map((movie: any) => this.transformTMDBMovie(movie))
          return {
            success: true,
            data: movies,
            total: tmdbResponse.total_results,
            page,
            limit,
            totalPages: tmdbResponse.total_pages
          }
        }
      }
    } catch (error) {
      console.warn('TMDB genre search failed, using local movies')
    }
    
    // Fallback to local movies
    const filtered = this.localMovies.filter(movie =>
      movie.genre.some(g => g.toLowerCase().includes(genre.toLowerCase()))
    )
    
    return {
      success: true,
      data: filtered,
      total: filtered.length,
      page: 1,
      limit: filtered.length,
      totalPages: 1
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
      .slice(0, 5)
    
    // Calculate rating distribution
    const ratingRanges = ['0-2', '2-4', '4-6', '6-8', '8-10']
    const ratingDistribution = ratingRanges.map(range => {
      const [min, max] = range.split('-').map(Number)
      const count = allMovies.filter(movie => movie.rating >= min && movie.rating < max).length
      return { rating: range, count }
    })
    
    // Mock view data (in real app, this would come from analytics)
    const viewsByMonth = [
      { month: 'Jan', views: 12500 },
      { month: 'Feb', views: 15200 },
      { month: 'Mar', views: 18900 },
      { month: 'Apr', views: 22100 },
      { month: 'May', views: 25800 },
      { month: 'Jun', views: 28400 }
    ]
    
    const stats: MovieStats = {
      totalMovies: allMovies.length,
      totalViews: 892340, // Mock data
      averageRating: allMovies.length > 0 ? 
        allMovies.reduce((sum, movie) => sum + movie.rating, 0) / allMovies.length : 0,
      topGenres,
      recentlyAdded: allMovies
        .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
        .slice(0, 5),
      topRated: allMovies
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5),
      mostPopular: allMovies
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 5),
      viewsByMonth,
      ratingDistribution
    }
    
    return {
      success: true,
      data: stats
    }
  }

  // Bulk operations
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

  async importMoviesFromTMDB(count: number = 50): Promise<ApiResponse<Movie[]>> {
    if (!this.hasValidApiKey) {
      return {
        success: false,
        data: [],
        message: 'No valid TMDB API key provided'
      }
    }

    try {
      const pages = Math.ceil(count / 20)
      const allMovies: Movie[] = []
      
      for (let page = 1; page <= pages; page++) {
        const tmdbResponse = await this.makeRequest<any>(`/movie/popular?page=${page}`)
        
        if (tmdbResponse.results) {
          const movies = tmdbResponse.results.map((movie: any) => this.transformTMDBMovie(movie))
          allMovies.push(...movies)
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
        message: 'Failed to import movies from TMDB'
      }
    }
  }

  // Get mock movies for initial data
  getMockMovies(): Movie[] {
    return [
      {
        id: '1',
        title: "The Quantum Paradox",
        year: 2024,
        genre: ["Sci-Fi", "Thriller"],
        rating: 8.5,
        duration: "2h 15m",
        description: "A brilliant physicist discovers a way to manipulate time, but the consequences threaten the fabric of reality itself.",
        thumbnail: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1200",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Emma Stone", "Ryan Gosling", "John Doe"],
        director: "Christopher Nolan",
        language: "English",
        country: "USA",
        popularity: 95.5,
        voteCount: 1250,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: "Midnight in Paris",
        year: 2023,
        genre: ["Romance", "Comedy", "Drama"],
        rating: 7.8,
        duration: "1h 54m",
        description: "A romantic comedy about a writer who finds himself mysteriously going back to the 1920s every night at midnight.",
        thumbnail: "https://images.pexels.com/photos/3844798/pexels-photo-3844798.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/3844798/pexels-photo-3844798.jpeg?auto=compress&cs=tinysrgb&w=1200",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Owen Wilson", "Rachel McAdams", "Marion Cotillard"],
        director: "Woody Allen",
        language: "English",
        country: "USA",
        popularity: 88.2,
        voteCount: 2150,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        title: "The Digital Frontier",
        year: 2024,
        genre: ["Action", "Sci-Fi"],
        rating: 8.2,
        duration: "2h 8m",
        description: "In a world where reality and virtual reality merge, a hacker must save both worlds from complete destruction.",
        thumbnail: "https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=1200",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Keanu Reeves", "Scarlett Johansson", "Michael Shannon"],
        director: "Denis Villeneuve",
        language: "English",
        country: "USA",
        popularity: 92.7,
        voteCount: 1890,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        title: "Ocean's Mystery",
        year: 2023,
        genre: ["Mystery", "Thriller", "Adventure"],
        rating: 7.6,
        duration: "2h 12m",
        description: "A marine biologist discovers an ancient secret hidden in the deepest parts of the ocean that could change humanity forever.",
        thumbnail: "https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=1200",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Amy Adams", "Oscar Isaac", "Mahershala Ali"],
        director: "Kathryn Bigelow",
        language: "English",
        country: "USA",
        popularity: 85.4,
        voteCount: 1654,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '5',
        title: "The Last Symphony",
        year: 2024,
        genre: ["Drama", "Music", "Biography"],
        rating: 8.9,
        duration: "2h 25m",
        description: "The inspiring true story of a composer who creates his masterpiece while losing his hearing, changing the world of music forever.",
        thumbnail: "https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=1200",
        videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
        cast: ["Benedict Cumberbatch", "Saoirse Ronan", "Ralph Fiennes"],
        director: "Damien Chazelle",
        language: "English",
        country: "USA",
        popularity: 91.8,
        voteCount: 2340,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }
}

export const movieAPI = new MovieAPI()