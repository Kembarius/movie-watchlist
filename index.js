let watchlist = JSON.parse(localStorage.getItem('watchlist')) || []

document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const input = document.getElementById('search-input')
    const movieSearch = input.value.toLowerCase().replace(' ', '+')
    input.value = ''
    getMovies(movieSearch)
})

function getMovies(movieSearch) {
    fetch(`https://www.omdbapi.com/?s=${movieSearch}&apikey=55abcec3`)
    .then(res => {
        if (!res.ok) {
            throw new Error('Movie search data not available')
        }
        return res.json()
    })
    .then(data => {
        if(!data.Search) {
            throw new Error("Unable to find what you're looking for")
        }
/*         htmlText = ''
        searchedMovieArr = [] */
        const arrayOfMovies = data.Search.slice(0, 5)
        document.querySelector('.main-placeholder').style.display = 'none'

        if(arrayOfMovies.length > 2) {
            document.body.style.height = 'auto'
        } else { document.body.style.height = '100vh' }
        
        document.getElementById('main').style.justifyContent = 'start' 

        // drugacen approach z promise.All in map 
        const promiseArr = arrayOfMovies.map((movie => {
            return fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=55abcec3`)
                .then(res => res.json())
        }))

        Promise.all(promiseArr)
            .then(movies => {
                renderMovie(movies)
            })
            .catch(error => {
                console.error("Error fetching movies:", error)
                document.body.style.height = '100vh'
                document.getElementById('main').style.justifyContent = 'center'
                document.getElementById('film-results').innerHTML = `
                    <div class="main-placeholder">
                        <p class="watchlist-text-gray">Unable to find what you’re looking for. Please try another search.</p>
                    </div>`
            })
    })
    .catch(err => {
        console.error(err)
        /* dodaj kodo za placeholder error text = Unable to find what you’re looking for. Please try another search. */
        document.querySelector('.main-placeholder').style.display = 'none'
        document.body.style.height = '100vh'
        document.getElementById('main').style.justifyContent = 'center'
        document.getElementById('film-results').innerHTML = `
            <div class="main-placeholder">
                <p class="watchlist-text-gray">Unable to find what you’re looking for. Please try another search.</p>
            </div>`
    })
}

function renderMovie(arr) {


    const html = arr.map(movie => {
        let icon 
        let text 
    
        if (!watchlist.some(film => film.Id === movie.imdbID)) {
            icon = 'icon-plus'
            text = 'Watchlist'
        } else {
            icon = 'icon-minus'
            text = 'Remove'
        }

        return `
            <div class="movie-container">
                <div class="poster-movie-info-wrapper">
                    <img class="poster" src="${movie.Poster}" alt="">
                    <div class="movie-info-wrapper">
                        <div class="h2-rating-flex">
                            <h2>${movie.Title}</h2>
                            <img class="star-icon" src="./images/star-icon.png" alt="Star icon">
                            <span class="rating-number">${movie.Ratings[0].Value}</span>
                        </div>
                        <div class="moive-details-flex">
                            <p>${movie.Runtime}</p>
                            <p>${movie.Genre}</p>
                            <a data-id="${movie.imdbID}" class="white-text-wrapper watchlist-action">
                                <img class="icon-white" src="./images/${icon}.png" alt="Plus icon">
                                <p class="watchlist-text-white">${text}</p>
                            </a>
                        </div>
                        <p class="movie-plot">${movie.Plot}</p>
                    </div>
                </div>
                <hr>
            </div>`
    }).join('')

    renderMovieFeed(html)

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-id]')

        if (link) {
            saveToWatchlist(link.dataset.id, arr)
        }
    })
}

function renderMovieFeed(htmlText) {
    document.getElementById('film-results').innerHTML = htmlText
}

function saveToWatchlist(movieId, arr) {
    const findMovieObj = arr.filter(movie => {
        return movie.imdbID === movieId
    })[0] 
    const newMovieObj = {
        Title: findMovieObj.Title,
        Poster: findMovieObj.Poster,
        Runtime: findMovieObj.Runtime,
        Genre: findMovieObj.Genre,
        imdbRating: findMovieObj.Ratings[0].Value,
        Plot: findMovieObj.Plot,
        Id: findMovieObj.imdbID
    }
    
    if (!watchlist.some(movie => movie.Id === newMovieObj.Id)) {
        watchlist.push(newMovieObj)
        const element = document.querySelector(`[data-id=${newMovieObj.Id}]`)
        element.innerHTML = `
            <img class="icon-white" src="./images/icon-minus.png" alt="Plus icon">
            <p class="watchlist-text-white">Remove</p>`
    } else {
        const index = watchlist.findIndex(movie => movie.Id === newMovieObj.Id)
        watchlist.splice(index, 1)
        const element = document.querySelector(`[data-id=${newMovieObj.Id}]`)
        element.innerHTML = `
            <img class="icon-white" src="./images/icon-plus.png" alt="Plus icon">
            <p class="watchlist-text-white">Watchlist</p>`
    }
    
    localStorage.setItem('watchlist', JSON.stringify(watchlist))
}