var searchButton = document.querySelector('#searchbtn');
var searchText = document.querySelector('#textinput');
var localHistory = document.querySelector('#history');
var currentWeather = document.querySelector('#today');
var fivedayWeather = document.querySelector('#fiveday');
var apiKey = '7930060f49cd53c05bdb6d2aa062b86d';
var city = '';
var lat;
var lon;
var cities;

function getTodayWeather(event) {
    var forecast = {};
  
    if (city === '' && searchText.value !== '') {
      event.preventDefault();
  
      city = searchText.value;
    }
      
    var todayLink = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&units=imperial';
  
    fetch(todayLink)
      .then(function (response) {
        if(response.status === 200) {
          return response.json();
        }
      })
      .then(function (data) {
        forecast['date'] = dayjs.unix(data.dt).format(' MMM DD, YYYY');
        forecast['icon'] = data.weather[0].icon;
        forecast['temp'] = data.main.temp;
        forecast['wind'] = data.wind.speed;
        forecast['humidity'] = data.main.humidity;
  
        lat = data.coord.lat;
        lon = data.coord.lon;
        
        displayCurrentForecast(forecast);
        
        cityStorage();
        getFiveDayForecast();
      });
  }

function displayCurrentForecast(weatherData) {
  currentWeather.innerHTML = '';
  
  var temp = weatherData.temp;
  var wind = weatherData.wind;
  var humidity = weatherData.humidity;
  var date = weatherData.date;
  var icon = weatherData.icon;

  var cityTitle = document.createElement('h2');
  var img = document.createElement('img');
  var tempEl = document.createElement('h5');
  var windEl = document.createElement('h5');
  var humidityEl = document.createElement('h5');

  cityTitle.textContent = city + date;
  img.setAttribute('src', 'http://openweathermap.org/img/wn/' + icon + '.png');
  tempEl.textContent = 'Temperature: ' + temp + '°F';
  windEl.textContent = 'Wind: ' + wind + ' MPH';
  humidityEl.textContent = 'Humidity: ' + humidity + '%';

  cityTitle.appendChild(img);
  currentWeather.appendChild(cityTitle);
  currentWeather.appendChild(tempEl);
  currentWeather.appendChild(windEl);
  currentWeather.appendChild(humidityEl);
}

function getFiveDayForecast() {
    var fivedayLink = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';
  
    fetch(fivedayLink)
      .then(function (response) {
        if(response.status === 200) {
          return response.json();
        }
      })
      .then(function (data) {
        displayFiveDay(data.list);
        city = '';
      });
  }

function displayFiveDay(forecastData) {
  fivedayWeather.innerHTML = '';

  for (var i = 7; i < forecastData.length; i += 8) {
    var temp = forecastData[i].main.temp;
    var wind = forecastData[i].wind.speed;
    var humidity = forecastData[i].main.humidity;
    var date = dayjs.unix(forecastData[i].dt).format(' MMM DD, YYYY');
    var icon = forecastData[i].weather[0].icon;

    var li = document.createElement('li');
    var newdate = document.createElement('h3');
    var img = document.createElement('img');
    var pTemp = document.createElement('h5');
    var pWind = document.createElement('h5');
    var pHumidity = document.createElement('h5');

    newdate.textContent = date;
    img.setAttribute('src', 'http://openweathermap.org/img/wn/' + icon + '.png');
    pTemp.textContent = 'Temp: ' + temp + '°F';
    pWind.textContent = 'Wind: ' + wind + ' MPH';
    pHumidity.textContent = 'Humidity: ' + humidity + '%';

    li.appendChild(newdate);
    li.appendChild(img);
    li.appendChild(pTemp);
    li.appendChild(pWind);
    li.appendChild(pHumidity);
    fivedayWeather.appendChild(li);
  }
}

function setCity() {
    cities = JSON.parse(localStorage.getItem('cities'));
  }
  function cityStorage() {
    var cityData = {
      name: city,
      latitude: lat,
      longitude: lon
    }
  
    if (!cities.some(el => el.name === city)) {
      cities.push(cityData);
  
      localStorage.setItem('cities', JSON.stringify(cities));
  
      showHistory()
    }
  }
  
function showHistory() {
    localHistory.innerHTML = '';
  
    if (cities) {
      cities.forEach(cityInfo => {
        var li = document.createElement('li');
        
        li.setAttribute('class', 'btn');
        li.setAttribute('data-name', cityInfo.name);
  
        li.textContent = cityInfo.name;
        localHistory.appendChild(li);
      });
    }
  }

function getCity(event) {
  city = event.target.dataset.name;
  lat = event.target.dataset.latitude;
  lon = event.target.dataset.longitude;

  getTodayWeather(event);
}

setCity();
showHistory();

searchButton.addEventListener('click', getTodayWeather);
localHistory.addEventListener('click', getCity);