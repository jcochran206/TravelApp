
//api id goes here 
const unsplash_client_id = 'MFxLwucLgtyOgI_LiCObo9cJX-Sn-GUcDPkjQM9ToJ4';
const google_id = 'AIzaSyBgn6LAdcnAavmT1BAsiSMczJjQWRWbUOg'; 

//function gets the photos from unsplash api
function getPhotos(searchterm) {
    const url = `https://api.unsplash.com/search/photos?query=${searchterm}&client_id=${unsplash_client_id}`

    fetch(url)
    .then(response => response.json())
    .then(responseJson => displayResults(responseJson))
    .catch(error => console.log(error));
}

//function to build map on screen
function initMap() {
    var options = {
        center: {lat: 47.6062, lng: -122.3321},
        zoom: 8
    };

   let map = new google.maps.Map(document.getElementById('map'), options);

   let marker = new google.maps.Marker({
       position: {lat: 47.6062, lng: -122.3321},
       map:map
   });

   let infoWindow = new google.maps.InfoWindow({
       content: '<h3> Seattle </h3>'
   });

   marker.addListener('click', function(){
       infoWindow.open(map, marker);
   })
}


//display content on screen
function displayResults(responseJson) {
    //console.log(responseJson.results);
    //uses for each jquery function 
    $.each(responseJson.results, function(i,val){
        //console.log(i,val) review functions
        let imageUrl = val.urls.thumb;
        console.log(imageUrl);
        $('.images').append(`<img class="results_img" src="${imageUrl}"/>`);
    })
  }


// obtains user input and submit on form
function watchForm(){
    //watchs for form submission 
    $('.search-bar').submit(e => {
        e.preventDefault();
        let searchterm = $('#search').val();
        console.log(searchterm);
        //calls get photos function 
        getPhotos(searchterm);
    })
}

/* function that contains all forms for app to use*/
function main(){
    watchForm();
}


$(main);
