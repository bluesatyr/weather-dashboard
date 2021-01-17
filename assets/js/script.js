// global variables
var locApiUrl = "http://api.openweathermap.org/data/2.5/weather?q="
var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?";
var city = "";
var apiKey = "587e6a88adff4eb1878a93d9f751bd59";
var previousCities = [];
  
var getPreviousCities = function () {
    // city list ul element
    var cityList = document.querySelector('.city-list');
    cityList.innerHTML = "";
    // get cities as array from localStorage
    var citiesArray = localStorage.getItem('cities');
    if (!citiesArray) {
        previousCities = ["london", "sydney", "tokyo", "toronto"];
    } else {
        previousCities = JSON.parse(citiesArray);
    };
    
    // creates a list of previous cities: most recent first
    for (var i = previousCities.length - 1; i > -1 ; i--) {
        console.log(previousCities[i])
        var city = document.createElement('li');
        city.classList = 'previous capitalize'
        city.textContent = previousCities[i];
        cityList.appendChild(city);
    }; 
};

var saveCities = function(cities){
    if (cities.length > 10) {
        cities.shift();
    };
    localStorage.setItem('cities', JSON.stringify(cities));      
}

var weatherItems = ["Temperature",  "Humidity", "Wind Speed", "UV Index"];
var objKeys = ["tempC", "humid", "windSpeed", "uvIndex"];



var createFiveDayArray = function (data) {
    var forecastArray = [];
    for (var i = 1; i < 6; i++) {
        var maxTemp = (data.daily[i].temp.max - 273.15);
        var temp = maxTemp.toFixed(1);
        var dayTime = data.daily[i].dt * 1000;
        var timeZone = data.timezone_offset * 1000;
        var dayDate = moment(dayTime + timeZone);
        var formattedDate = dayDate.format('M/DD/YYYY');
        var day = {
            date: formattedDate,
            icon: data.daily[i].weather[0].icon,
            temp: temp,
            humid: data.daily[i].humidity
        };
        
        forecastArray.push(day);
    };
    return forecastArray;
}


 
var uvColor = function(uvi) {
    var uviEl = document.querySelector('#uvi');
    if (uvi > 0 && uvi < 3) {
        uviEl.className = 'uv-low';
    } else if (uvi >= 3 && uvi < 6) {
        uviEl.className = 'uv-mod';
    } else if (uvi >= 6 && uvi < 8) {
        uviEl.className = 'uv-high';
    } else if (uvi >= 8 && uvi < 11) {
        uviEl.className = 'uv-very-high';
    } else if (uvi > 11) {
        uviEl.className = 'uv-extreme';
    }
};


// remember to create iconcode in weather object
var createCurrentEl = function(Obj) {
    var results = document.querySelector('.results');
    results.innerHTML = "";
    
    var currentWeatherEl = document.createElement('div');
    currentWeatherEl.className = 'current-weather';
    currentWeatherEl.innerHTML = "<div class='title'><h2 class='capitalize'>" + Obj.city + " (" + Obj.date + ")</h2><img src='http://openweathermap.org/img/w/" + Obj.iconcode + ".png' class='weather-icon' /></div><p>Temperature: " + Obj.tempC + "°C</p><p>Humidity :" + Obj.humid + "%</p><p>Wind Speed: " + Obj.windSpeed + "kph</p><p>UV Index : <span id='uvi'>" + Obj.uvIndex + "</span></p>";
    results.appendChild(currentWeatherEl);
    
    uvColor(Obj.uvIndex);
};

// creates the five day forcast section from returned JSON object(s)
var createFiveDayEl = function (fiveDay) {
    var results = document.querySelector('.results');
    var fiveDayForecast = document.createElement('div');
    fiveDayForecast.className = 'five-day'
    fiveDayForecast.innerHTML = "<h2>5-Day Forecast:</h2><div class='card-container'></div>"
    results.appendChild(fiveDayForecast);
    var cardContainer = document.querySelector('.card-container');
    
    for (var i = 0; i < 5; i++) {
        let card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = "<h3>" + fiveDay[i].date + "</h3><p><img src='http://openweathermap.org/img/w/" + fiveDay[i].icon + ".png' class='weather-icon' /></p><p>Temp: " + fiveDay[i].temp + "°C</p><p>Humidity: " + fiveDay[i].humid + "%</p>";
        cardContainer.appendChild(card);
    }
};

// search function which calls the api
var search = function (location) {
    
};

// mainapi calls
var getWeather = function (city) {
    // to get latitude and longitude for 2nd api call
    var firstUrl = locApiUrl + city + '&units=metric&appid=' + apiKey;
    console.log(firstUrl);
    fetch(firstUrl)
        .then(function(res) {
            return res.json();
        })
        .then(function (res){
            var long = res.coord.lon;
            var lat = res.coord.lat;
            // 2nd api call to get all weather and forecast data
            var nextUrl = oneCallUrl + "lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly,alerts&appid=" + apiKey;
            console.log(nextUrl);
            return fetch(nextUrl)
        })
        .then(function(data) {
            return data.json();
        })
        .then(function(data) {
            // adjust returned data to be in the correct formats
            var currentTemp = (data.current.temp - 273.15);
            var temp = currentTemp.toFixed(1);
            var currentTime = data.current.dt * 1000;
            var timeZone = data.timezone_offset * 1000;
            var currentDate = moment(currentTime + timeZone);
            var formattedDate = currentDate.format('M/DD/YYYY');
            
            var wIcon = data.current.weather[0].icon;
            // creates single object to be passed to createCurrentEl function       
            var weatherObj = {
                city: city,
                date: formattedDate,
                iconcode: wIcon,
                tempC: temp,
                humid: data.current.humidity,
                windSpeed: data.current.wind_speed,
                uvIndex: data.current.uvi
            };
            // creates an array to be passed to the createFiveDayEl function
            var forecastArray = createFiveDayArray(data);
            // function calls to render current weather and forecast elements
            createCurrentEl(weatherObj);
            createFiveDayEl(forecastArray);
            getPreviousCities();
        }).catch(function(error) {
            alert('Request failed:', error.message);
        });
}

// submit user input to fetch and render City's weather and forecast
var searchHandler = function(event) {
    event.preventDefault();
    var searchForm = document.querySelector('.search');
    var cityInput = document.querySelector('#search-input').value;
    city = cityInput.toLowerCase().trim();
    previousCities.push(city);
    saveCities(previousCities);
    getWeather(city);
    searchForm.reset();
};

// search by clicking on previous/popular cities item
var previousSearch = function(event){
    var cityEl = event.target.closest('li');
    var city = cityEl.textContent;
    getWeather(city);
}

getPreviousCities();

// event handlers
document.querySelector('.city-list').addEventListener('click', previousSearch);
document.querySelector('.search').addEventListener('submit', searchHandler);