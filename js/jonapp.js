const geocoding_api_url = "https://maps.googleapis.com/maps/api/geocode/json";

//api id goes here
const unsplash_client_id = "MFxLwucLgtyOgI_LiCObo9cJX-Sn-GUcDPkjQM9ToJ4";
const google_id = "AIzaSyBgn6LAdcnAavmT1BAsiSMczJjQWRWbUOg";

//function gets the photos from unsplash api
function getPhotos(searchterm) {
  const url = `https://api.unsplash.com/search/photos?query=${searchterm}&client_id=${unsplash_client_id}`;

  fetch(url)
    .then((response) => response.json())
    .then((responseJson) => displayResults(responseJson))
    .catch((error) => console.log(error));
}


function buildNav(){
    let pgSections = $('section');
    for(section of pgSections){ 
        let nav = document.querySelector('.navlist');
        // create link
        const navLink = document.createElement('li');
        navLink.classList.add('hide-display');
        //create  anchor tags
        const anchorTag = document.createElement('a');
        //get section attribute
        const pgSectionName = section.getAttribute('data-nav');
        //set attribute 
        anchorTag.setAttribute('href', '#'+section.id);
        //set
        anchorTag.textContent = pgSectionName;
        navLink.appendChild(anchorTag);
        nav.appendChild(navLink);
    }
}

function navToggle() {
  $("#js-nav__hamburger").on("click", function() {
    $(".navlist").toggleClass("nav__height");
    $(".navlist li").toggleClass("hide-display");
  });
}

function formatQueryParams(params) {
  return Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
}

//function to build map on screen
function initMap(query="seattle") {
  let geocoder = new google.maps.Geocoder();
  let infowindow = new google.maps.InfoWindow();

  getGeocoding(query, geocoder, infowindow);
  weatherModule.getGeocoding(query);
}

function geocodeLatLng(geocoder, infowindow, geo) {
  let options = {
    center: { lat: geo.lat, lng: geo.lng },
    zoom: 8,
  };

  let map = new google.maps.Map(document.getElementById("map"), options);
  let latlng = {lat: parseFloat(geo.lat), lng: parseFloat(geo.lng)};
  
  geocoder.geocode({ location: latlng }, function (results, status) {
    if (status === "OK") {
      if (results[0]) {
        map.setZoom(11);
        var marker = new google.maps.Marker({
          position: latlng,
          map: map,
        });
        infowindow.setContent(results[0].formatted_address);
        infowindow.open(map, marker);
      } else {
        window.alert("No results found");
      }
    } else {
      window.alert("Geocoder failed due to: " + status);
    }
  });
}

function getGeocoding (query, geocoder, infowindow) {
  // use google geocoding_api_key here in weatherModule for now
  // until we plug in jonathan Google Maps / Places API from initial search
  const params = {
    address: query,
    key: google_id
  };

  fetch(geocoding_api_url + "?" + formatQueryParams(params).join("&"))
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => {    
      
      // remove error msg for good search
      toggleError(200);

      let geocoding = {
        query: params.query,
        lat: responseJson.results[0].geometry.location.lat,
        lng: responseJson.results[0].geometry.location.lng,
      };

      geocodeLatLng(geocoder, infowindow, geocoding)
    })
    .catch((err) => {
      // TODO: display an error here for the user in the DOM if invalid geocoding request
      console.log(err);
      // add error msg for bad search
      toggleError(400);
    });
}

//display content on screen
function displayResults(responseJson) {
  //console.log(responseJson.results);
  //uses for each jquery function
  $(".images").html("");
  $.each(responseJson.results, function (i, val) {
    //console.log(i,val) review functions
    let imageUrl = val.urls.thumb;
    console.log(imageUrl);
    $(".images").append(`<div class="thumbs">
    <img class="results_img" src="${imageUrl}"/></div>`);
  });
}

function toggleError(err) {
  // show error for bad search terms
  if (err === 400) {
    $("#js-search__error")
      .html("Search not found. Check spelling and try again.")
      .removeClass("hidden");

    return false;
  }

  $("#js-search__error").html("").removeClass("hidden");
}

// obtains user input and submit on form
function watchForm() {
  //watchs for form submission
  $(".search-bar").submit((e) => {
    e.preventDefault();
    let searchterm = $("#search").val();
    console.log(searchterm);
    //calls get photos function
    getPhotos(searchterm);
    initMap(searchterm);
    // getGeocoding(searchterm);
  });
}

/* function that contains all forms for app to use*/
function main() {
    buildNav();
    navToggle();
    watchForm();
}

$(main);
