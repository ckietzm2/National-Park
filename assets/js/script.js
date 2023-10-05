
document.addEventListener("DOMContentLoaded", function () {

  var apiKeyParks = "1yYLC0tdepLh30737lZ2VQ3b8bkBAXVnX1RJ6UHX";
  var selectedParkNameEl = document.getElementById("selectedParkName");
  var forecastContainer = document.querySelector(".five-day-forecast");
  var state = "";
  var parkList = $("#park-list");
  var savedStates = [];
  var parkSelected = document.querySelector(".park-selected");
  var searchResults = document.querySelector(".container");
  var favList = $("#fav");

  var lat = 0
  var lon = 0
  var descriptionPark = ""
  var parkWebsite = ""
  var parkFees = ""
  var parkHours = ""
  var parkHoursLength = 0
  var parkFeesLength = 0
  var parkImage = ""
  var parkImageCredit = ""
  var parkImageTitle = ''

  $("#search-btn").on("click", function (event) {
    event.preventDefault();
    state = $("#state-name").val().trim().toLowerCase();

    if (state === "") {
      showModal();
    } else {
      getDataAPI();
    }
  });

  $(document).on('keypress', function (e) {
    if (e.which == 13) {
      state = $("#state-name").val().trim().toLowerCase();
      if (state === "") {
        showModal();
       }else {
        getDataAPI();
      }

    }
  });

  function showModal(modal) {
    var modal = document.getElementById("my-modal");
    modal.style.display = "block";

    document.getElementById('ok-btn').addEventListener("click", function () {
      modal.style.display = "none";
    });
  }

  function showModalSave() {
    var modal = document.getElementById("my-modal-save");
    modal.style.display = "block";

    document.getElementById('ok-btn-save').addEventListener("click", function () {
      modal.style.display = "none";
    });
  }
  
  function getDataAPI() {
    parksURL = 'https://developer.nps.gov/api/v1/parks?stateCode=' + state + '&api_key=' + apiKeyParks;

    fetch(parksURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        parkList.empty();
        if (data.total === 0) {
          parkList.append("<p>No parks found for this state.</p>");
        } else {
          for (let i = 0; i < data.total; i++) {
            var parkNames = data.data[i].fullName;
            var button = $("<button>");

            button.text(parkNames);
            button.attr("type", "button");
            button.attr("data-parkcode", data.data[i].parkCode);
            button.addClass("park-btn");

            var listItem = $("<li>").append(button);

            parkList.append(listItem);
          }

         

          // check if there is a selected park in local storage
          var storedSelectedPark = localStorage.getItem('selectedPark');
          if (storedSelectedPark) {
            // display selected park name on the page
            selectedParkNameEl.textContent = storedSelectedPark;

            // Fetch forecast data

          }
        }
      });
  }

  $("#park-list").on("click",".park-btn", function (event) {
    event.preventDefault();
    console.log($(this).text(), $(this).attr("data-parkcode"));
    var urlByParkCode = "https://developer.nps.gov/api/v1/parks?parkCode=" + $(this).attr("data-parkcode") + "&api_key=" + apiKeyParks;

    fetch(urlByParkCode)
    .then(function(res){
      return res.json();
    })
    .then(function(data){
      console.log(data);
  
    var selectedParkName = $(this).text();
    // store in local storage
    localStorage.setItem('selectedPark', selectedParkName);



    var selectedParkData = data.data[0];

    var addToFavBtn = $("#save-park-btn");
    addToFavBtn.attr("data-name", selectedParkData.fullName);
    addToFavBtn.attr("data-parkcode", selectedParkData.parkCode);


      descriptionPark = selectedParkData.description
      parkWebsite = selectedParkData.url
      
      parkHoursLength = selectedParkData.operatingHours.length
      parkFeesLength = selectedParkData.entranceFees.length
      parkImage = selectedParkData.images[0].url
      parkImageCredit = selectedParkData.images[0].credit
      parkImageTitle = selectedParkData.images[0].title

      console.log(parkImage)
      
      if (parkHoursLength===0) {
        
        $("#park-hours").text("Park Hours: No Hours Listed")

      }
      if (parkHoursLength>0) {
        parkHours = selectedParkData.operatingHours[0].description
        $("#park-hours").text("Park Hours: " +parkHours)
      }

      if (parkFeesLength===0) {
        
        $("#entrance-fee").text("Entrance Fees: No Fees Listed")

      }
      if (parkFeesLength>0) {
        parkFees = selectedParkData.entranceFees[0].cost
        $("#entrance-fee").text("Entrance Fees: " +parkFees)
      }
      


      parkFullName = selectedParkData.fullName
      
      $("#park-image").attr("src", selectedParkData.images[0].url);
      $("#image-info").text(parkImageCredit + parkImageTitle);
      $("#desc").text(descriptionPark)
      $("#park-url").attr("href", selectedParkData.url);
      $("#park-url").text("Park Website: " + parkWebsite);
      $(".text-2xl").text(parkFullName)
      lat = selectedParkData.latitude;
      lon = selectedParkData.longitude;
      lat = parseFloat(lat)
      lon = parseFloat(lon)
      lat = lat.toFixed(4)
      lon = lon.toFixed(4)
 

  // display the selected park name on page
  selectedParkNameEl.textContent = selectedParkName;

  // Fetch forecast data
  fetchForecastData();
  console.log(lat);
  searchResults.style.display = "none";
  parkSelected.style.display = "block";

})

});


function displayOnePark(parkcode) {
  var urlByParkCode = "https://developer.nps.gov/api/v1/parks?parkCode=" + parkcode + "&api_key=" + apiKeyParks;

  fetch(urlByParkCode)
  .then(function(res){
    return res.json();
  })
  .then(function(data){
    console.log(data);

  var selectedParkName = $(this).text();
  // store in local storage
  localStorage.setItem('selectedPark', selectedParkName);

 

  var selectedParkData = data.data[0];

  var addToFavBtn = $("#save-park-btn");
  addToFavBtn.attr("data-name", selectedParkData.fullName);
  addToFavBtn.attr("data-parkcode", selectedParkData.parkCode);


    descriptionPark = selectedParkData.description
    parkWebsite = selectedParkData.url
    
    parkHoursLength = selectedParkData.operatingHours.length
    parkFeesLength = selectedParkData.entranceFees.length
    parkImage = selectedParkData.images[0].url
    parkImageCredit = selectedParkData.images[0].credit
    parkImageTitle = selectedParkData.images[0].title


    
    if (parkHoursLength===0) {
      
      $("#park-hours").text("Park Hours: No Hours Listed")

    }
    if (parkHoursLength>0) {
      parkHours = selectedParkData.operatingHours[0].description
      $("#park-hours").text("Park Hours: " +parkHours)
    }

    if (parkFeesLength===0) {
      
      $("#entrance-fee").text("Entrance Fees: No Fees Listed")

    }
    if (parkFeesLength>0) {
      parkFees = selectedParkData.entranceFees[0].cost
      $("#entrance-fee").text("Entrance Fees: " +parkFees)
    }
    


    parkFullName = selectedParkData.fullName
    
    $("#park-image").attr("src", selectedParkData.images[0].url);
    $("#image-info").text(parkImageCredit + parkImageTitle);
    $("#desc").text(descriptionPark)
    $("#park-url").attr("href", selectedParkData.url);
    $("#park-url").text("Park Website: " + parkWebsite);
    $(".text-2xl").text(parkFullName)
    lat = selectedParkData.latitude;
    lon = selectedParkData.longitude;
    lat = parseFloat(lat)
    lon = parseFloat(lon)
    lat = lat.toFixed(4)
    lon = lon.toFixed(4)

// display the selected park name on page
selectedParkNameEl.textContent = selectedParkName;

// Fetch forecast data
fetchForecastData();
console.log(lat);
searchResults.style.display = "none";
parkSelected.style.display = "block";

})
}

  function fetchForecastData() {
.

    var apiKey = "a10bc788276a7c7ca6f89df126f2779a";
    var fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

    fetch(fiveDayUrl)
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(function (data) {
        forecastContainer.innerHTML = "";


        var filteredObjects = data.list.filter(function (item) {
          return item.dt_txt.endsWith("15:00:00");
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
      })
      .catch(function (error) {
        // console.error('There was a problem with the fetch operation:', error);
      });
  }

  $("#save-park-btn").on("click", function (e) {
    var selectedParkName = $(this).attr("data-name");
    var selectedParkCode = $(this).attr("data-parkcode");
  
    var savedParks = JSON.parse(localStorage.getItem('savedParks')) || [];
  
    // Check if the park is already in favorites
    var isParkAlreadySaved = savedParks.some(function (park) {
      return park.name === selectedParkName;
    });
  
    if (!isParkAlreadySaved) {
      var parkInfo = {
        name: selectedParkName,
        parkcode: selectedParkCode
      };
      savedParks.push(parkInfo);
  
      // Store the updated favorites list in local storage
      localStorage.setItem('savedParks', JSON.stringify(savedParks));
  
      // Render the saved park buttons
      renderSavedParks();
    } else {
      showModalSave();
    }
  });
  

  // Render the saved park buttons
  function renderSavedParks() {
    favList.empty();
    var savedParks = JSON.parse(localStorage.getItem('savedParks')) || [];

    savedParks.forEach(function (parkInfo) {
      var button = $("<button>");
      button.text(parkInfo.name);
      button.attr("type", "button");
      button.attr("data-parkcode", parkInfo.parkcode);
      button.addClass("saved-park-btn");

      var listItem = $("<li>").append(button);

      favList.append(listItem);
    });

    // Add click event for saved park buttons
  
  }

  $("#fav").on("click",".saved-park-btn", function () {
    console.log($(this));
    displayOnePark($(this).attr("data-parkcode"))

    fetchForecastData();

    searchResults.style.display = "none";
    parkSelected.style.display = "block";
  });

  // Render saved parks on page load
  renderSavedParks();
});
