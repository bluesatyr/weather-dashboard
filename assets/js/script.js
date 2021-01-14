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


// creates the curent weather section from returned JSON objects
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

var  searchHandler = function(event) {
    
}

document.querySelector('.search').addEventListener('click', searchHandler);