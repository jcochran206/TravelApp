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

function formatQueryParams(params) {
  return Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
}

// function geocodePlaceId(geocoder, map, infowindow) {
//   var placeId = document.getElementById("place-id").value;
//   geocoder.geocode({ placeId: placeId }, function (results, status) {
//     if (status === "OK") {
//       if (results[0]) {
//         map.setZoom(11);
//         map.setCenter(results[0].geometry.location);
//         var marker = new google.maps.Marker({
//           map: map,
//           position: results[0].geometry.location,
//         });
//         infowindow.setContent(results[0].formatted_address);
//         infowindow.open(map, marker);
//       } else {
//         window.alert("No results found");
//       }
//     } else {
//       window.alert("Geocoder failed due to: " + status);
//     }
//   });
// }

//function to build map on screen
function initMap(coords) {
  console.log(coords);
  let lat = coords.lat;
  let lng = coords.lon;

  var options = {
    center: { lat: lat, lng: lng },
    zoom: 8,
  };

  let map = new google.maps.Map(document.getElementById("map"), options);

  let marker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map,
  });

  let infoWindow = new google.maps.InfoWindow({
    content: "<h3> Seattle </h3>",
  });

  marker.addListener("click", function () {
    infoWindow.open(map, marker);
  });
}

function getGeocoding(query) {
  // use google geocoding_api_key here in weatherModule for now
  // until we plug in jonathan Google Maps / Places API from initial search
  const params = {
    address: query,
    key: google_id,
  };

  fetch(geocoding_api_url + "?" + formatQueryParams(params).join("&"))
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => {
      // get first item in results list for now and return lat lon geocoding
      // pass to this.getWeather()
      let geocoding = {
        query: params.query,
        formatted_address: responseJson.results[0].formatted_address,
        lat: responseJson.results[0].geometry.location.lat,
        lon: responseJson.results[0].geometry.location.lng,
      };
      initMap(geocoding);
    })
    .catch((err) => {
      // TODO: display an error here for the user in the DOM if invalid geocoding request
      console.log(err);
    });
}

//display content on screen
function displayResults(responseJson) {
  //console.log(responseJson.results);
  //uses for each jquery function
  $.each(responseJson.results, function (i, val) {
    //console.log(i,val) review functions
    let imageUrl = val.urls.thumb;
    console.log(imageUrl);
    $(".images").append(`<img class="results_img" src="${imageUrl}"/>`);
  });
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
    // initMap(searchterm);
    getGeocoding(searchterm);
  });
}

/* function that contains all forms for app to use*/
function main() {
  watchForm();
}

$(main);
