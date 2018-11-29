/* globals APIKEY */

const movieDataBaseURL = "https://api.themoviedb.org/3/";
let imageURL = null;
let imageSizes = [];

let pages = [];

let searchString = "";

let pageResults = document.getElementById("search-results");
let pageRecommend = document.getElementById("recommend-results");

document.addEventListener("DOMContentLoaded", init);

function init() {

    pages = document.querySelectorAll(".page");
    console.log(pages);

    // console.log(APIKEY);
    addEventListeners();
    getLocalStorageData()
}

function addEventListeners() {
    let searchButton = document.querySelector(".searchButtonDiv");
    searchButton.addEventListener("click", startSearch);
    
    document.querySelector(".searchButtonDiv").addEventListener("click", switchPageSearch);
}

function getLocalStorageData() {
    // load image sizes and base url from local storage

    // doesn't exist
    // the data is there but stale (1 hour old)

    getPosterSizesAndURL()

    // else it does exist and is less than 1 hour old
    // load from local storage
}

function getPosterSizesAndURL() {

    let url = `${movieDataBaseURL}configuration?api_key=${APIKEY}`

    fetch(url)
        .then(response => response.json())
        .then(function (data) {
            console.log(data);
            imageURL = data.images.secure_base_url;
            imageSizes = data.images.poster_sizes;

            console.log(imageURL);
            console.log(imageSizes);
        })
        .catch((error) => console.log(error));

}

function startSearch() {
    console.log("start search");
    searchString = document.getElementById("search-input").value;
    if (!searchString) {
        alert("Please enter search data");
        return;

        // this is a new search so you should reset any existing page data

    }
    getSearchResults();
}

function getSearchResults() {

    // https://developers.themoviedb.org/3/search/search-movies  look up search movie (also TV Shows)

    let url = `${movieDataBaseURL}search/movie?api_key=${APIKEY}&query=${searchString}`;

    fetch(url)
        .then(response => response.json())
        .then((data) => {
            console.log(data);

            //  create the page from data
            createPage(data);

            //  navigate to "results";

        })
        .catch((error) => console.log(error));
}

function createPage(data) {
    let content = document.querySelector("#search-results>.content");
    let title = document.querySelector("#search-results>.title");

    let message = document.createElement("h2");
    content.innerHTML = "";
    title.innerHTML = "";

    if (data.total_results == 0) {
        message.innerHTML = `No results found for ${searchString}`;
    } else {
        message.innerHTML = `Total results = ${data.total_results} for ${searchString}`;
    }

    title.appendChild(message);

    let documentFragment = new DocumentFragment();

    documentFragment.appendChild(createMovieCards(data.results));

    content.appendChild(documentFragment);

    let cardList = document.querySelectorAll(".content>div");

    cardList.forEach(function (item) {
        item.addEventListener("click", getRecommendations);
    });

}

function createRecommendPage(data) {
    let content = document.querySelector("#recommend-results>.content");
    let title = document.querySelector("#recommend-results>.title");

    let message = document.createElement("h2");
    content.innerHTML = "";
    title.innerHTML = "";

    if (data.total_results == 0) {
        message.innerHTML = `No results found for ${searchString}`;
    } else {
        message.innerHTML = `Total results = ${data.total_results} for ${searchString}`;
    }

    title.appendChild(message);

    let documentFragment = new DocumentFragment();

    documentFragment.appendChild(createMovieCards(data.results));

    content.appendChild(documentFragment);

    let cardList = document.querySelectorAll(".content>div");

    cardList.forEach(function (item) {
        item.addEventListener("click", getRecommendations);
        
        item.addEventListener("click", switchPageRecommend);
    });

}

function createMovieCards(results) {

    let documentFragment = new DocumentFragment(); // use a documentFragment for performance

    results.forEach(function (movie) {

        let movieCard = document.createElement("div");
        let section = document.createElement("section");
        let image = document.createElement("img");
        let videoTitle = document.createElement("p");
        let videoDate = document.createElement("p");
        let videoRating = document.createElement("p");
        let videoOverview = document.createElement("p");

        // set up the content
        videoTitle.textContent = movie.title;
        videoDate.textContent = movie.release_date;
        videoRating.textContent = movie.vote_average;
        videoOverview.textContent = movie.overview;

        // set up image source URL
        image.src = `${imageURL}${imageSizes[2]}${movie.poster_path}`;

        // set up movie data attributes
        movieCard.setAttribute("data-title", movie.title);
        movieCard.setAttribute("data-id", movie.id);

        // set up class names
        movieCard.className = "movieCard";
        section.className = "imageSection";

        // append elements
        section.appendChild(image);
        movieCard.appendChild(section);
        movieCard.appendChild(videoTitle);
        movieCard.appendChild(videoDate);
        movieCard.appendChild(videoRating);
        movieCard.appendChild(videoOverview);

        documentFragment.appendChild(movieCard);

    });

    return documentFragment;

}

function getRecommendations() {
    //console.log(this);
    let movieTitle = this.getAttribute("data-title");

    searchString = movieTitle;

    let movieID = this.getAttribute("data-id");
    console.log("you clicked: " + movieTitle + " " + movieID);

    let url = `${movieDataBaseURL}movie/${movieID}/recommendations?api_key=${APIKEY}`;
    fetch(url)
        .then(response => response.json())
        .then((data) => {
            console.log(data);

            //  create the page from data
            createRecommendPage(data);

            //  navigate to "results";

        })
        .catch((error) => console.log(error));
}

function switchPageSearch() {
    if (pageResults.className.indexOf("active") == -1) {
        pageResults.classList.add("active");
        pageRecommend.classList.remove("active");
    }
}

function switchPageRecommend() {
    if (pageRecommend.className.indexOf("active") == -1) {
        pageRecommend.classList.add("active");
        pageResults.classList.remove("active");
    }
}
