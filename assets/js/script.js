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



var weatherToday = function(Obj) {
    debugger;
    var results = document.querySelector('.results');
    console.log(results);
    var currentWeatherEl = document.createElement('div');
    currentWeatherEl.className = 'current-weather';
    console.log(currentWeatherEl);
    
    var city = document.createElement('h2');
    city.textContent = Obj.city + " (" + Obj.date + ")";
    console.log(city);
    
    currentWeatherEl.appendChild(city);
    results.appendChild(currentWeatherEl);
    console.log(results);
    
    // for loop not working
    for (var i = 0; i < 4; i++) {
        debugger;
        let item = document.createElement('p');
        console.log(item);
        item.textContent = weatherItems[i] + ": " + Obj[objKeys[i]];
        console.log(item);
        currentWeatherEl.appendChild(item);
    }
    
};

var  searchHandler = function(event) {
    
}

document.querySelector('.search').addEventListener('click', searchHandler);