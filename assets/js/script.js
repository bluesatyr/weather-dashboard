var locApiUrl = "http://api.openweathermap.org/data/2.5/weather?q="
var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?";
var city = "";

var apiKey = "587e6a88adff4eb1878a93d9f751bd59";
var previousCities = ["toronto", "london", "sydney", "tokyo"];
    
var getPreviousCities = function () {
    // city list ul element
    var cityList = document.querySelector('.city-list');
    // get cities as array from localStorage
    var citiesArray = localStorage.getItem('cities');
    previousCities = JSON.parse(citiesArray);
    
    // creates a list of previous cities: most recent first
    for (var i = previousCities.length - 1; i > -1 ; i--) {
        console.log(previousCities[i])
        var city = document.createElement('li');
        city.textContent = previousCities[i];
        cityList.appendChild(city);
    }; 
};

var saveCities = function(cities){
    if (cities.length > 10) {
        citiesities.shift();
    };
    localStorage.setItem('cities', JSON.stringify(cities));      
}





/* 

var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
var iconcode = data.current.weather.icon;

*/



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

/* var createCurrentEl = function(Obj) {
    var results = document.querySelector('.results');
    
    var currentWeatherEl = document.createElement('div');
    currentWeatherEl.className = 'current-weather';
    
    var city = document.createElement('h2'); // use text-transform: capitalize; in css
    city.className = 'capitalize'
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
};  */
 
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
    currentWeatherEl.innerHTML = "<h2 class='capitalize'>" + Obj.city + " (" + Obj.date + ")</h2><img src='http://openweathermap.org/img/w/" + Obj.iconcode + ".png' class='weather-icon' /><p>Temperature: " + Obj.tempC + "°C</p><p>Humidity :" + Obj.humid + "%</p><p>Wind Speed: " + Obj.windSpeed + "kph</p><p>UV Index : <span id='uvi'>" + Obj.uvIndex + "</span></p>";
    results.appendChild(currentWeatherEl);
    
    uvColor(Obj.uvIndex);
    
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
            var currentTime = data.current.dt * 1000;
            var timeZone = data.timezone_offset * 1000;
            console.log(currentTime);
            console.log(timeZone);
            var currentDate = moment(currentTime + timeZone);
            var formattedDate = currentDate.format('M/DD/YYYY');
            var wIcon = data.current.weather[0].icon;
            console.log(wIcon);
        
                                
            var weatherObj = {
                city: city,
                date: formattedDate,
                iconcode: wIcon,
                tempC: temp,
                humid: data.current.humidity,
                windSpeed: data.current.wind_speed,
                uvIndex: data.current.uvi
            };
        
            console.log(weatherObj);
            createCurrentEl(weatherObj);
        })
}





var searchHandler = function(event) {
    event.preventDefault();
    var cityInput = document.querySelector('#search-input').value;
    city = cityInput.toLowerCase().trim();
    console.log(city);
    previousCities.push(city);
    saveCities(previousCities);
    getWeather(city);
    cityInput.textContent = "";
}

document.querySelector('#search-btn').addEventListener('click', searchHandler);