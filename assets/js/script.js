var locApiUrl = "http://api.openweathermap.org/data/2.5/weather?q="
var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?";
var city = "";

var apiKey = "587e6a88adff4eb1878a93d9f751bd59";
var previousCities = JSON.parse(localStorage.getItem('cities')); //check syntax

if (previousCities) {
    for (var i = 0; i < previousCities.length; i++) {
        var city = document.createElement('li');
        city.textContent = previousCities[i];
    }
}

/* 
api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}   **&units=metric  **&exclude=minutely,hourly,alerts

var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
var iconcode = data.current.weather.icon;

*/

// variables in place of fetch() call
var weatherObject = {
    city: "Toronto",
    date: "1/14/21",
    tempC: "10",
    humid: "40%",
    windSpeed: "20 KPH",
    uvIndex: "8.0",
}

var weatherItems = ["Temperature",  "Humidity", "Wind Speed", "UV Index"];
var objKeys = ["tempC", "humid", "windSpeed", "uvIndex"];



var fiveDay = [
    {date: "1/15/21", icon: "sun", temp: "12", humid: "44%"},
    {date: "1/16/21", icon: "sun", temp: "13", humid: "45%"},
    {date: "1/17/21", icon: "sun", temp: "14", humid: "46%"},
    {date: "1/18/21", icon: "sun", temp: "15", humid: "47%"},
    {date: "1/19/21", icon: "sun", temp: "16", humid: "48%"}
    ];


// creates the curent weather section from returned JSON object(s)
// uv index info: https://19january2017snapshot.epa.gov/sunsafety/uv-index-scale-1_.html
var createCurrentEl = function(Obj) {
    var results = document.querySelector('.results');
    
    var currentWeatherEl = document.createElement('div');
    currentWeatherEl.className = 'current-weather';
    
    var city = document.createElement('h2');
    city.textContent = Obj.city + " (" + Obj.date + ")";
    console.log(city);
    
    currentWeatherEl.appendChild(city);
    results.appendChild(currentWeatherEl);
    console.log(results);
    
    
    for (var i = 0; i < 4; i++) {
        let item = document.createElement('p');
        console.log(item);
        item.textContent = weatherItems[i] + ": " + Obj[objKeys[i]];
        console.log(item);
        currentWeatherEl.appendChild(item);
    }
    
    
    
};

// creates the five day forcast section from returned JSON object(s)
var createFiveDayEl = function (fiveDay) {
    var results = document.querySelector('.results');
    var fiveDayForecast = document.createElement('div');
    fiveDayForecast.className = 'five-day'
    fiveDayForecast.innerHTML = "<h2>5-Day Forecast:</h2><div class='card-container'><div>"
    results.appendChild(fiveDayForecast);
    var cardContainer = document.querySelector('.card-container');
    
    for (var i = 0; i < 5; i++) {
        let card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = "<h3>" + fiveDay[i].date + "</h3><p>" + fiveDay[i].icon + "</p><p>Temp: " + fiveDay[i].temp + "°C</p><p>Humidity: " + fiveDay[i].humid + "</p>";
        cardContainer.appendChild(card);
    }
}

// search function which calls the api
var search = function (location) {
    
};


var getWeather = function (city) {
    var firstUrl = locApiUrl + city + '&units=metric&appid=' + apiKey;
    console.log(firstUrl);
    fetch(firstUrl)
        .then(function(res) {
            return res.json();
        })
        .then(function (res){
            var long = res.coord.lon;
            console.log(long);
            var lat = res.coord.lat;
            console.log(lat);
            var nextUrl = oneCallUrl + "lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly,alerts&appid=" + apiKey;
            console.log(nextUrl);
            return fetch(nextUrl)
        })
        .then(function(data) {
            return data.json();
        })
        .then(function(data) {
            // createCurrentEl(data);
            // createFiveDayEl(data);
            var currentTemp = (data.current.temp - 273.15);
            var temp = currentTemp.toFixed(1);
            console.log(city);
            console.log(data.current.dt);
            console.log(temp);
            console.log(data.current.humidity);
            console.log(data.current.wind_speed);
            console.log(data.current.uvi);
        })
}

var  searchHandler = function(event) {
    event.preventDefault();
    var cityInput = document.querySelector('#search-input').value;
    city = cityInput.toLowerCase().trim();
    console.log(city);
    
    //fetch call
    getWeather(city);
}

document.querySelector('.search').addEventListener('click', searchHandler);