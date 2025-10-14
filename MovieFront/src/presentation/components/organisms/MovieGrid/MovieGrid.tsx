import { MovieList } from '@components/domains'
import type { BaseMovieItem } from '@types-movie/movie.types'
import React from 'react'

export interface MovieGridProps {
  title: string
  movies: Array<{
    title: string
    type: 'Movie' | 'TV Show'
    rating: string
    imageUrl: string
    ratingColor?: 'purple' | 'red' | 'white' | 'default'
  }>
  showMoreLink?: boolean
  className?: string
}

const MovieGrid: React.FC<MovieGridProps> = ({
  title,
  movies,
  showMoreLink = true,
  className,
}) => {
  // 转换MovieGrid的movie格式到BaseMovieItem格式
  const convertedMovies: BaseMovieItem[] = movies.map((movie, index) => ({
    id: movie.title + index,
    title: movie.title,
    type: movie.type,
    rating: movie.rating,
    imageUrl: movie.imageUrl,
    ratingColor: movie.ratingColor || 'default',
    quality: undefined,
  }))

  return (
    <MovieList
      title={title}
      movies={convertedMovies}
      showMoreLink={showMoreLink}
      variant="grid"
      className={className}
    />
  )
}

export { MovieGrid }
