// Initialize Firebase
var config = {
  apiKey: "AIzaSyCvpTUzbU9prXZLDP9BtwBE1viuztTbt0k",
  authDomain: "audiosauce-6eb52.firebaseapp.com",
  databaseURL: "https://audiosauce-6eb52.firebaseio.com",
  projectId: "audiosauce-6eb52",
  storageBucket: "",
  messagingSenderId: "266026610182"
};
firebase.initializeApp(config);

// Variable for Firebase
var database = firebase.database();

// Initialize global variable
var weatherCondition;
var geolocationAllowed = false;
var userLatitude;
var userLongitude;
var weatherSearchString;
var userCity = "";
var userZipcode = "";
var cityName; // Retrieved from API
var queryParams = parseQueryString(window.location.search.substr(1));
var spotifyAccessToken = queryParams.access_token;
var currentPlaylist;
var currentPlaylistID;
var spotifyLoaded = false;
var weatherLoaded = false;
// Running on page load
$(document).ready(function(){
  if (!spotifyAccessToken && window.location.href.includes("github.io")) {
    window.location = "https://polar-headland-83144.herokuapp.com/login?callback=" + window.location.href;
  } else {
    getLocation();
  }
});

// Get location data ----------------------------
function getLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  } else {
    alert("Geolocation is not supported by this browser");
  }
}

// Location success
function geoSuccess(position) {
  userLatitude = position.coords.latitude;
  userLongitude = position.coords.longitude;
  geolocationAllowed = true;
  $("#location-input-container").hide();
  console.log("Latitude: " + userLatitude + " Longitude: " + userLongitude);
  weatherSearchString = "?lat=" + userLatitude + "&lon=" + userLongitude;
  getWeather();
}

// Location error
function geoError() {
  // If location access is denied
  $("#location-input-container").show();
  // alert("Geocoder failed.");
}
// End location --------------------------------------------


// Wrapper for API call --------------------------------------------
function getWeather() {
// Setup for weather API call
var weatherAPIKey = "&APPID=4aa09d0ed51ac90ebeb79c63e62ba521";
var weatherSiteString = "http://api.openweathermap.org/data/2.5/weather";
var weatherQueryURL = weatherSiteString + weatherSearchString + weatherAPIKey;

// Weather API call
$.ajax({
  url: weatherQueryURL,
  method: "GET"
}).then(function(response) {
  // console.log(response);
  cityName = response.name;
  $("#city-name").text(cityName);
  weatherCondition = response.weather[0].main;
  pickMedia(weatherCondition);
}); // End ajax
} // End getWeather ------------------------------------------------------

// Button event for name and/or location ---------------------------
$("#submit-button").on("click", function(event) {
  event.preventDefault();
  // Test for username input
  var usernameInput = $("#username-input").val().trim();

  if (usernameInput === "") {
    $("#username-input").addClass("error");
    // Materialize.toast(message, displayLength, className, completeCallback);
    Materialize.toast('You must enter your name.', 4000); // 4000 is the duration of the toast
    return;
  }

  if (!geolocationAllowed) {
    // Test for user location input
    userCity = $("#city-input").val().trim();
    userZipcode = $("#zipcode-input").val().trim();
    if ((userCity !== "") || (userZipcode !== "")) {
      if (userZipcode !== ""){
        weatherSearchString = "?zip=" + $("#zipcode-input").val().trim();
      } else {
        weatherSearchString = "?q=" + $("#city-input").val().trim();
      }
    } else {
      $("#city-input").addClass("error");
      $("#zipcode-input").addClass("error");
      alert("You must enter a location.");
      // Materialize.toast(message, displayLength, className, completeCallback);
      Materialize.toast('You must enter your location.', 100000); // 4000 is the duration of the toast
      return;
    }
  }

  // Successfull! close opening screen and get weather
  $(".information-input").addClass("scale-out");
  getWeather();

}); // End submit ----------------------------------------------------------------

// Display messages
function displayMessages(messages) {
  $("#messages").text(message);
}

// Check database and display comments -----------------------------------------
database.ref().on("value", function(dataSnapshot) {
  var username = dataSnapshot.user.val();
  var comment = dataSnapshot.comment.val();
  console.log(username);
  var commentDiv = $("<div>");
  var commentParagraph = $("<p>" + username + ": " + comment + "</p>");
  commentDiv.append(commentParagraph);
  // $("#comment-container").prepend(commentDiv);
}); //End display comments --------------------------------------------------

// Submit comment -------------------------------------------------------------
$("#submit-comment").on("click", function(event) {
  event.preventDefault();
  database.ref().push({
    username: usernameInput,
    comment: userComment
  });
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
}); // End submit comment -----------------------------------------------------

// Function to set media to weather condition --------------------------------------
function pickMedia(weatherCondition) {
  // Variable for the image
  var backgroundImage;

  // Switch to choose the right image based on weather
  switch (weatherCondition) {
    case "Thunderstorm":
      backgroundImage = "https://media.giphy.com/media/CIYF0RVOmd2qQ/giphy.gif";
      currentPlaylistID = "7KYAAVLORZyMbmEAvSEoYw?si=6Wks1rNLSQekG5BtFu_A2Q";
      break;
    case "Rain":
      backgroundImage = "https://media.giphy.com/media/Il9f7ZhytEiI0/giphy.gif";
      currentPlaylistID ="5PQEIdCn3ezxTbC0ZbwxRq?si=0RLlni-oSdK0JMtBZlPv4g";
      break;
    case "Snow":
      backgroundImage = "https://media.giphy.com/media/Xi2Xu0MejhsUo/giphy.gif";
      currentPlaylistID = "1nbwrUKXkXyQ5Lvk0lSgM8?si=n79tuNZvSKKItDgptyvcmA";
      break;
    case "Clear":
      backgroundImage = "http://78.media.tumblr.com/tumblr_m6ltvk2pHg1r9bkeao1_500.gif";
      currentPlaylistID = "1QZ6eQbSRBy2HR9arAk9Ns?si=3CSbeDwVR0ybT3GkMaEK6w";
      break;
    case "Clouds":
      backgroundImage = "https://media.giphy.com/media/qq5gwamAHVofm/giphy.gif";
      currentPlaylistID = "4m19bZbDAZ0PBCvDkBDgvn?si=RODK3XlBRG2DTGW33vyqog";
      break;
    case "Extreme":
      backgroundImage = "https://media.giphy.com/media/QksV5jdMsPYK4/giphy.gif";
      currentPlaylistID = "747OCIB1gpl2xnq5M0DTLJ?si=M7FWvr_BRKCm54QF6773oQ";
      break;
    case "Drizzle":
      backgroundImage = "https://media.giphy.com/media/QPsEnRasf0Vfa/giphy.gif";
      currentPlaylistID = "1klpyzcS6vqNCGA6npx637?si=EvIgWhLYTtO19tJaUQvKjQ";
      break;
    case "Additional":
      backgroundImage = "https://media.giphy.com/media/tMf9OezQLRxRu/giphy.gif";
      currentPlaylistID = "5V68XWbxzLnM7uKL1tI24t?si=pfXLQpUISH-pgvpF2Xc8RA";
      break;
    case "Atmosphere":
      backgroundImage = "https://media.giphy.com/media/McDhCoTyRyLiE/giphy.gif";
      currentPlaylistID = "1X7fnHaJuMOAioCyMJz3Mg?si=vYuX0St7RsGHPqR2Secg-w";
      break;
    }

    weatherLoaded = true;

  // Set the background image
  var htmlBackground = "url(" + backgroundImage + ") no-repeat center center fixed";
  $("html").css({
    "background" : htmlBackground,
    "-webkit-background-size": "cover",
    "-moz-background-size": "cover",
    "-o-background-size": "cover",
    "background-size": "cover"
  });
} // End pickMedia -----------------------------------------------------------------


function parseQueryString( queryString ) {
    var params = {}, queries, temp, i, l;
    // Split into key/value pairs
    queries = queryString.split("&");
    // Convert the array of strings into an object
    for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }
    return params;
};
