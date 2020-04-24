"use strict";

let weatherModule = (function () {
  const weather_api_key = "8407b23e689e4645d068ec0b30bc1d1c";
  const weather_api_url = "https://api.openweathermap.org/data/2.5/onecall";

  // TODO: figure out how to do this without exposing key
  const geocoding_api_key = "AIzaSyDnheQzD7-Rb9KZ109TrdN2xyqgdFi5GbM";
  const geocoding_api_url = "https://maps.googleapis.com/maps/api/geocode/json";

  function formatDate(res, locale = "en-US") {
    let date = new Date(res.date * 1000);
    let day = new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
      date
    );
    let time = date.toLocaleTimeString(locale, {
      timeZone: res.timezone,
      timeStyle: "medium",
    });

    return `${day}, ${time.replace(/\:\d+\s/, " ")}`;
  }

  function formatQueryParams(params) {
    return Object.keys(params).map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    );
  }

  function displayResults(res, address) {
    $(".js-weather").find(".container").html(resultsTmpl(res, address));
  }

  function displayError(msg, address) {
    $(".js-weather").find(".container").html(errorTmpl(msg, address));
  }

  function resultsTmpl(res, place) {
    let current = {
      dayTime: formatDate({ date: res.current.dt, timezone: res.timezone }),
      temp: Math.round(res.current.temp),
      humidity: Math.round(res.current.humidity),
      wind_speed: Math.round(res.current.wind_speed),
      weatherIconSrc: "http://openweathermap.org/img/wn/" + res.current.weather[0].icon + ".png",
      weatherDesc: res.current.weather[0].description,
    };

    let forecast = res.daily.map((data) => {
      let weatherIconSrc = "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";
      return `
        <li class="forecast__item">
          <div class="forecast__day">
            ${formatDate({ date: data.dt, timezone: res.timezone }).split(",")[0] }
          </div>
          <div class="forecast__icon">
            <img src="${weatherIconSrc}" alt="${data.weather[0].description}" />
          </div>
          <div class="forecast__max">${Math.round(data.temp.max)}°</div>
          <div class="forecast__min">${Math.round(data.temp.min)}°</div>
        </li>
      `;
    });

    return `
      <div class="container__inner">
        <div >
          <h3 class="current__location">${place}</h3>
          <div class="current__time">${current.dayTime}, ${current.weatherDesc}</div>
        </div>
        <div class="weather__current">
          <div class="weather__current-temp">
            <img
              src="${current.weatherIconSrc}" 
              alt="${current.weatherDesc}" 
              class="weather__icon" />
            <span class="weather__temp">${current.temp}</span>
            <span class="weather__unit">℉</span>
          </div>
          <ul class="weather__current-details">
            <li>Humidity: ${current.humidity}%</li>
            <li>Wind: ${current.wind_speed} mph</li>
          </ul>
        </div>
        <div class="weather__forecast">
          <ul>${forecast.join("")}</ul>
        </div>
      </div>
    `;
  }

  function errorTmpl(msg, query) {
    return `
      <div class="container__inner">
        <div class="weather__error">
          <h1>${msg}</h1>
          <div>Weather not found for ${query}</div>
        </div>
      </div>
    `;
  }

  return {
    getGeocoding: function (query) {
      // use google geocoding_api_key here in weatherModule for now
      // until we plug in jonathan Google Maps / Places API from initial search
      const params = {
        address: query,
        key: geocoding_api_key,
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

          this.getWeather(geocoding);
        })
        .catch((err) => {
          // TODO: display an error here for the user in the DOM if invalid geocoding request
          console.log(err);
        });
    },

    getWeather: function (coords) {
      const params = {
        lat: coords.lat,
        lon: coords.lon,
        units: "imperial",
        appid: weather_api_key,
      };

      fetch(weather_api_url + "?" + formatQueryParams(params).join("&"))
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then((responseJson) => {
          displayResults(responseJson, coords.formatted_address);
        })
        .catch((err) => displayError(err.message, coords.query));
    },

    // watchForm: function () {
    //   $("form.search-bar").submit((event) => {
    //     event.preventDefault();
    //     let val = $(event.currentTarget).find("input#search").val();

    //     // call getGeocoding with query value which will use returned lat lon to get the weather data
    //     this.getGeocoding(val);
    //   });
    // },
  };
})();

// $(weatherModule.watchForm());
