/* globals APIKEY */

const movieDataBaseURL = "https://api.themoviedb.org/3/";
let imageURL = null;
let imageSizes = [];

document.addEventListener("DOMContentLoaded", init);

function init() {
   // console.log(APIKEY);
    addEventListeners();
    getLocalStorageData()
}

function addEventListeners() {

}

function getLocalStorageData() {
    // load image sizes and base url from local storage
    
    // doesn't exist
    // the data is there but stale (1 hour old)
    
    getPosterSizesAndURL()
    
    // else it does exist and is less than 1 hour old
    // load from local storage
}

function getPosterSizesAndURL(){
    
    let url = `${movieDataBaseURL}configuration?api_key=${APIKEY}`
    
    fetch(url)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        imageURL = data.images.secure_base_url;
        imageSizes = data.images.poster_sizes;
        
        console.log(imageURL);
        console.log(imageSizes);
    })
    .catch(function(error){
        alert(error);
    });
    
}
