import { useEffect, useState, useRef, useCallback } from 'react'
import './App.css'
import { Movies } from './components/Movies.jsx'
import { useMovies } from './hooks/useMovies.js'
import debounce from 'just-debounce-it'

function useSearch () {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true)

  useEffect(() => {
    if(isFirstInput.current) {
      isFirstInput.current = search === ''
      return
    }

    if(search === ''){
    setError('No se puede buscaar una pelicula vacia')
      return
    }
  
    if(search.match(/^\d+$/)){
      setError('No se puede buscar una pelicula por un numero')
      return
    }
  
    if(search.length < 3){
      setError('No se puede buscar una pelicula con menos de 3 caracteres')
      return
    }
  
    setError(null)
  },[search])

  return {search, updateSearch, error }
}

function App() {
  const [sort, setSort] = useState(false)
  const { search, updateSearch, error  } = useSearch()
  const { movies, loading, getMovies } = useMovies({ search, sort })

  const debouncedGetMovies = useCallback(
    debounce(search => {
     getMovies({ search })
  }, 300), [getMovies])

  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({ search })
  }

  const handleSort = () => {
    setSort(!sort)
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    updateSearch(event.target.value)
    debouncedGetMovies(newSearch)
  }

  return (
    <div className="page">

      <header>
        <h1>Buscador de peliculas</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input 
          style={{ 
            border: '1px solid transparent', 
            borderColor:  error ? 'red' : 'transparent' }} 
          onChange={handleChange} value={search} name='query' placeholder="Harry Potter, El Señor de los anillos, Cars..."/>
          <button type="submit">Buscar</button>
          <input type="checkbox" onChange={handleSort} checked={sort} />
        </form>
        {error && <p style={{color:'red'}}>{error}</p>}
      </header>

      <main>
        {
          loading ? <p>Cargando...</p> : <Movies movies={movies} />
        }     
      </main>
    </div>
  )
}

export default App
