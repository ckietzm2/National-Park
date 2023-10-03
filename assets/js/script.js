var weatherURL = "https://api.openweathermap.org"

var apiKeyWeather = "2deeb2a69137fff43aae291e7205b285"
var apiKeyParks = "1yYLC0tdepLh30737lZ2VQ3b8bkBAXVnX1RJ6UHX"

var parksURL = 'https://developer.nps.gov/api/v1/parks?stateCode=me&api_key=1yYLC0tdepLh30737lZ2VQ3b8bkBAXVnX1RJ6UHX'
var requestURL = "http://api.openweathermap.org/data/2.5/forecast?appid=c04c273159790588c5d89056e8655cce&units=imperial&q=chicago"

var state = ""
var parkList = $("#park-list")



$("#search").on("click", function (event) {
  event.preventDefault()

  state = $("#state-name").val()


  state = state.toLowerCase()



  if (state === "") {
    alert("Please enter valid state")
  }
  else if (state != "") {

    getDataAPI()
  }


})



function getDataAPI() {

  parksURL = 'https://developer.nps.gov/api/v1/parks?stateCode=' + state + '&api_key=1yYLC0tdepLh30737lZ2VQ3b8bkBAXVnX1RJ6UHX'

  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)

    })

  fetch(parksURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data2) {
      console.log(data2)

     






      for(let i=0;i<data2.total;i++) {
var parkNames = data2.data[i].fullName


parkList=parkList.append('<li>'+parkNames)

$("#clear").on("click", function (event) {
  event.preventDefault()
  var parkNames = data2.data[0].fullName
  parkNames = ""
  parkList=parkList.append('<li>'+parkNames)


})  

      }


})

}