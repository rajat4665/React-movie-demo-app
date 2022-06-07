import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import SearchBox from './components/SearchBox';
import AddFavourites from './components/AddToFavourites';
import RemoveFavourites from './components/RemoveFavourites';

const App = () => {
	const [movies, setMovies] = useState([]);
	const [searchValue, setSearchValue] = useState('');
  const [favourites, setFavourites] = useState([]);

	// movie api call by defaul i pass iron man for home page
	const getMovieRequest = async (searchValue) => {
		if (!searchValue) {
			searchValue = 'iron man'
		}
		const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=2e99ce84`;

		const response = await fetch(url);
		const responseJson = await response.json();

		if (responseJson.Search) {
			setMovies(responseJson.Search);
		}
	};


  // for movie search
	useEffect(() => {
		getMovieRequest(searchValue);
	}, [searchValue]);

  // for local storage
  useEffect(() => {
    try {
        var movieFavourites = JSON.parse(
          localStorage.getItem('final-movie-app')
        );
        if (!movieFavourites) {
          localStorage.setItem('final-movie-app', []);
        }
    } catch(err) {
        localStorage.setItem('final-movie-app', []);
        var movieFavourites = JSON.parse(
          localStorage.getItem('final-movie-app')
        );
    }
    setFavourites(movieFavourites);
  }, []);
	// method for saving add to favourite in local db.
  const saveToLocalStorage = (items) => {
		localStorage.setItem('final-movie-app', JSON.stringify(items));
  };

  const addFavouriteMovie = (movie) => {
		var movie_exist = favourites.filter((favourite) => favourite.imdbID == movie.imdbID)
		if (movie_exist.length == 0 ) {
			const newFavouriteList = [...favourites, movie];
			setFavourites(newFavouriteList);
	    saveToLocalStorage(newFavouriteList);
	} else {
		alert("This movie already in your favourite list.");

	}

	};

  const removeFavouriteMovie = (movie) => {
		const newFavouriteList = favourites.filter(
			(favourite) => favourite.imdbID !== movie.imdbID
		);

		setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
	};

	return (
		<div className='container-fluid movie-app'>
			<div className='row d-flex align-items-center mt-4 mb-4'>
				<MovieListHeading heading='Movies' />
				<SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
			</div>
			<div className='row'>
				<MovieList
					movies={movies}
					favouriteComponent={AddFavourites}
					handleFavouritesClick={addFavouriteMovie}
				/>
			</div>
			<div className='row d-flex align-items-center mt-4 mb-4'>
				<MovieListHeading heading='Favourites' />
			</div>
			<div className='row'>
				<MovieList movies={favourites}
        handleFavouritesClick={removeFavouriteMovie}
        favouriteComponent={RemoveFavourites}/>
			</div>
		</div>
	);
};

export default App;
