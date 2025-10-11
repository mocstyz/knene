import { Movie } from '@domain/entities/Movie'

export interface MovieRepository {
  create(movie: Movie): Promise<Movie>
  findById(id: string): Promise<Movie | null>
  findAll(filters?: {
    genre?: string
    year?: number
    rating?: number
    search?: string
  }): Promise<Movie[]>
  findFeatured(): Promise<Movie[]>
  findByGenre(genre: string): Promise<Movie[]>
  search(query: string): Promise<Movie[]>
  update(movie: Movie): Promise<Movie>
  delete(id: string): Promise<boolean>
  getMovieStats(): Promise<{
    total: number
    byGenre: Record<string, number>
    byYear: Record<string, number>
  }>
}
