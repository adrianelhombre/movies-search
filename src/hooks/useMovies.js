import { useState, useRef, useCallback, useMemo } from 'react'
import { searchMovies } from '../services/movies'

export function useMovies ({ search, sort }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const previousSearch = useRef(search)

  const getMovies = useCallback (async ({ search }) => {
    if (search === previousSearch.current) return

    try{
      setLoading(true)
      setError(null)
      previousSearch.current = search
      const newMovies = await searchMovies({ search })
      setMovies(newMovies)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const sortedMovies = useMemo(() => {
    return sort
    ? [...movies].sort((a, b) => b.year.localeCompare(a.year))  // Se podria usar year
    : movies
  }, [sort, movies]) 

  return { movies: sortedMovies, getMovies, loading }
}
