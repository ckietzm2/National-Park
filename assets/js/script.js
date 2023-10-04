// var weatherURL = "https://api.openweathermap.org"

// var apiKeyWeather = "2deeb2a69137fff43aae291e7205b285"
var apiKeyParks = "1yYLC0tdepLh30737lZ2VQ3b8bkBAXVnX1RJ6UHX"

// var parksURL = 'https://developer.nps.gov/api/v1/parks?stateCode=me&api_key=1yYLC0tdepLh30737lZ2VQ3b8bkBAXVnX1RJ6UHX'
// var requestURL = "http://api.openweathermap.org/data/2.5/forecast?appid=c04c273159790588c5d89056e8655cce&units=imperial&q=chicago"
document.addEventListener("DOMContentLoaded", function () {

  var state = ""
  var parkList = $("#park-list")
  var savedStates = [];
  var parkList = $("#park-list");
  var parkSelected = document.querySelector(".park-selected")
  var searchResults = document.querySelector(".search-results")
  var lat = 0
  var lon = 0
  console.log(lat);
  var checkBtn = 0

  $("#search-btn").on("click", function (event) {
    event.preventDefault()
    state = $("#state-name").val().trim().toLowerCase();
    // state = state.toLowerCase()

    if (state === "") {
      alert("Please enter valid state initials")
    }
    else if (state != "") {
      getDataAPI()
    }
  })

  function getDataAPI() {
    parksURL = 'https://developer.nps.gov/api/v1/parks?stateCode=' + state + '&api_key=' + apiKeyParks

    fetch(parksURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        parkList.empty();
        if (data.total === 0) {
          parkList.append("<p>No parks fouund for this state.</p>");
        } else {
          for (let i = 0; i < data.total; i++) {
            var parkNames = data.data[i].fullName
            var button = $("<button>");
            button.text(parkNames);
            button.attr("type", "button");
            button.addClass("park-btn");
            checkBtn = i
            lat = data.data[i].latitude
            lon = data.data[i].longitude
            lat = parseFloat(lat)
            lat = lat.toFixed(4)
            lon = parseFloat(lon)
            lon = lon.toFixed(4)
            console.log(lat)
            console.log(lon)    
            button.val()

            var listItem = $("<li>").append(button);

            parkList.append(listItem);
          }

          $(".park-btn").on("click", function (event) {
            searchResults.style.display = "none";
            parkSelected.style.display = "block";
            event.preventDefault() 

            selectedParkLat = data.data[$(this).index()].latitude;
            selectedParkLon = data.data[$(this).index()].longitude;
        
            // Now you can use selectedParkLat and selectedParkLon as needed
            console.log(selectedParkLat);
            console.log(selectedParkLon);
        
            // Call the function to fetch weather data with these values
      
            fetchForecastData()
          })
        }
      });

  }

  function fetchForecastData() {
    var apiKey = "a10bc788276a7c7ca6f89df126f2779a";
    // var cityName = document.getElementById("city-input").value;
    var fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

    fetch(fiveDayUrl)
      .then(function (response) {
        if (!response.ok) {

        }
        return response.json();
      })
      .then(function (data) {
        forecastContainer.innerHTML = "";

        var filteredObjects = data.list.filter(function (item) {
          return item.dt_txt.endsWith("15:00:00");
          console.log(filteredObjects);
        });

        var firstFiveObjects = filteredObjects.slice(0, 5);

        firstFiveObjects.forEach(function (targetObject, index) {

          var forecastDiv = document.createElement("div");
          var forecastList = document.createElement("ul");
          var forecastListItem1 = document.createElement("li");
          var forecastListItem2 = document.createElement("li");
          var forecastListItem3 = document.createElement("li");

          var weatherIcon = document.createElement("img")
          var forecastIcon = targetObject.weather[0].icon;

          forecastDiv.classList.add("card-column");
          forecastList.classList.add('five-day-details');
          forecastListItem1.classList.add("five-day-item");
          forecastListItem2.classList.add("five-day-item");
          forecastListItem3.classList.add("five-day-item");

          var timestamp = targetObject.dt;
          var formattedDate = dayjs.unix(timestamp).format("MMM DD, YYYY");

          forecastListItem1.textContent = "Date: " + formattedDate;
          var iconUrl = "https://openweathermap.org/img/wn/" + forecastIcon + ".png"
          forecastListItem3.textContent = "Temp: " + ((targetObject.main.temp * 9) / 5 - 459.67).toFixed(2) + "°F";
          weatherIcon.setAttribute("src", iconUrl)
          forecastListItem2.append(weatherIcon);

          forecastList.append(forecastListItem1);
          forecastList.append(forecastListItem2);
          forecastList.append(forecastListItem3);
          forecastDiv.append(forecastList)
          forecastContainer.append(forecastDiv);
        });
      });
  }

  // favorite buttons
  var input = document.querySelector("#state-name");
  var fav1 = document.getElementById("fav-1")



  function saveSearchHistory() {
    console.log(input.value);
    // searchHistory.push(search);
    var searchTerm = input.value.trim();
    savedStates.push(searchTerm);
    localStorage.setItem('search-history', JSON.stringify(savedStates));

  }
  fav1.addEventListener("click", saveSearchHistory);
})


