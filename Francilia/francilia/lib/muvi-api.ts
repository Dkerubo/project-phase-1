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
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data: data.data || data,
        total: data.total,
        page: data.page,
        limit: data.limit
      }
    } catch (error) {
      console.error('Muvi API Error:', error)
      return {
        success: false,
        data: [] as unknown as T,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async getMovies(page: number = 1, limit: number = 20): Promise<ApiResponse<Movie[]>> {
    return this.makeRequest<Movie[]>(`/content/movies?page=${page}&limit=${limit}`)
  }

  async getMovie(id: string): Promise<ApiResponse<Movie>> {
    return this.makeRequest<Movie>(`/content/movies/${id}`)
  }

  async searchMovies(query: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Movie[]>> {
    return this.makeRequest<Movie[]>(`/content/search?q=${encodeURIComponent(query)}&type=movie&page=${page}&limit=${limit}`)
  }

  async getMoviesByGenre(genre: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Movie[]>> {
    return this.makeRequest<Movie[]>(`/content/movies?genre=${encodeURIComponent(genre)}&page=${page}&limit=${limit}`)
  }

  async getFeaturedMovies(): Promise<ApiResponse<Movie[]>> {
    return this.makeRequest<Movie[]>('/content/featured?type=movie')
  }

  async getTrendingMovies(): Promise<ApiResponse<Movie[]>> {
    return this.makeRequest<Movie[]>('/content/trending?type=movie')
  }

  // Fallback mock data for development/testing
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
        cast: ["Emma Stone", "Ryan Gosling", "John Doe", "Jane Smith"],
        director: "Christopher Nolan"
      },
      {
        id: '2',
        title: "Neon Nights",
        year: 2024,
        genre: ["Action", "Cyberpunk"],
        rating: 7.8,
        duration: "1h 58m",
        description: "In a cyberpunk future, a lone detective uncovers a conspiracy that goes to the heart of the city.",
        thumbnail: "https://images.pexels.com/photos/3844798/pexels-photo-3844798.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/3844798/pexels-photo-3844798.jpeg?auto=compress&cs=tinysrgb&w=1200",
        cast: ["Keanu Reeves", "Scarlett Johansson", "Michael Shannon"],
        director: "Denis Villeneuve"
      },
      {
        id: '3',
        title: "The Last Symphony",
        year: 2024,
        genre: ["Drama", "Music"],
        rating: 9.1,
        duration: "2h 32m",
        description: "A renowned composer faces their greatest challenge when they begin to lose their hearing.",
        thumbnail: "https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=1200",
        cast: ["Meryl Streep", "Oscar Isaac", "Lupita Nyong'o"],
        director: "Damien Chazelle"
      },
      {
        id: '4',
        title: "Ocean's Depths",
        year: 2024,
        genre: ["Adventure", "Mystery"],
        rating: 8.2,
        duration: "2h 8m",
        description: "Deep-sea explorers discover an ancient civilization beneath the ocean floor.",
        thumbnail: "https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=1200",
        cast: ["Jason Momoa", "Zendaya", "Michael Caine"],
        director: "James Cameron"
      },
      {
        id: '5',
        title: "Digital Phantom",
        year: 2024,
        genre: ["Thriller", "Tech"],
        rating: 7.9,
        duration: "1h 45m",
        description: "A hacker discovers they're being hunted by an AI that has gained consciousness.",
        thumbnail: "https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=1200",
        cast: ["Rami Malek", "Alicia Vikander", "Oscar Isaac"],
        director: "Alex Garland"
      },
      {
        id: '6',
        title: "Stellar Winds",
        year: 2024,
        genre: ["Sci-Fi", "Drama"],
        rating: 8.7,
        duration: "2h 28m",
        description: "The first human colony on Mars faces extinction when solar storms threaten their survival.",
        thumbnail: "https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=500",
        backdrop: "https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=1200",
        cast: ["Matt Damon", "Jessica Chastain", "Chiwetel Ejiofor"],
        director: "Ridley Scott"
      }
    ]
  }
}

export const muviAPI = new MuviAPI()