let watchlist = JSON.parse(localStorage.getItem('watchlist')) || []

if (watchlist.length > 0) {
    renderFeed()
}

function renderFeed() {
    const placeholderEl = document.querySelector('.main-placeholder')
    placeholderEl.style.display = 'none'
    document.getElementById('main').style.justifyContent = 'start'
    
    if(watchlist.length > 2) {
        document.body.style.height = 'auto'
    } 
    else if (watchlist.length === 0) {
        placeholderEl.style.display = 'flex'
    } else {document.body.style.height = '100vh'}
    

    const watchlistMoviesDisplay = watchlist.map(movie => {
        return `
            <div class="movie-container">
                <div class="poster-movie-info-wrapper">
                    <img class="poster" src="${movie.Poster}" alt="Movie Poster">
                    <div class="movie-info-wrapper">
                        <div class="h2-rating-flex">
                            <h2>${movie.Title}</h2>
                            <img class="star-icon" src="./images/star-icon.png" alt="Star icon">
                            <span class="rating-number">${movie.imdbRating}</span>
                        </div>
                        <div class="moive-details-flex">
                            <p>${movie.Runtime}</p>
                            <p>${movie.Genre}</p>
                            <a data-id="${movie.Id}" class="white-text-wrapper watchlist-action">
                                <img class="icon-white" src="./images/icon-minus.png" alt="Plus icon">
                                <p class="watchlist-text-white">Remove</p>
                            </a>
                        </div>
                        <p class="movie-plot">${movie.Plot}</p>
                    </div>
                </div>
                <hr class="watchlist-hr">
            </div>`
    }).join('')
    document.getElementById('film-results').innerHTML = watchlistMoviesDisplay

    document.addEventListener('click', e => {
        const element = e.target.closest('a[data-id]')

        if (element) {
            removeFmWatchlist(element.dataset.id)
        } 
    })
}

function removeFmWatchlist(dataId) {
    const findObj = watchlist.filter(item => {
        return item.Id === dataId
    })[0]
    const index = watchlist.findIndex(item => {
        return item.Id === findObj.Id
    })
    watchlist.splice(index, 1)
    localStorage.setItem('watchlist', JSON.stringify(watchlist))
    renderFeed()
}