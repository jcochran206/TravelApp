
//api id goes here 
const unsplash_client_id = 'MFxLwucLgtyOgI_LiCObo9cJX-Sn-GUcDPkjQM9ToJ4';

//function gets the photos from unsplash api
function getPhotos(searchterm) {
    const url = `https://api.unsplash.com/search/photos?query=${searchterm}&client_id=${unsplash_client_id}`

    fetch(url)
    .then(response => response.json())
    .then(responseJson => displayResults(responseJson))
    .catch(error => console.log(error));
}

//display content on screen
function displayResults(responseJson) {
    console.log(responseJson.results);
    

    $.each(responseJson.results, function(i,val){
        //console.log(i,val)
        let imageUrl = val.urls.thumb;
        console.log(imageUrl);
        $('.images').append(`<img class="results_img" src="${imageUrl}"/>`);
    })

    

  }


// obtains user input and submit on form
function watchForm(){
    $('.search-bar').submit(e => {
        e.preventDefault();
        let searchterm = $('#search').val();
        console.log(searchterm);
        getPhotos(searchterm);
    })
}

/* function that contains all forms for app to use*/
function main(){
    watchForm();
   //displayResults();
}


$(main);
