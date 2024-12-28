const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const weatherInfoSection = document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');

const countryTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const longitudeValueTxt = document.querySelector('.longitude-value-txt');
const sunriseValueTxt = document.querySelector('.sunrise-value-txt');
const sunsetValueTxt = document.querySelector('.sunset-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDateTxt = document.querySelector('.current-date-txt');
const forecastItemsContainer = document.querySelector('.forecast-items-container');

const apiKey = '350757ea7cce4a51781e7c60df5e0f99';

searchBtn.addEventListener('click', () => {
  if (cityInput.value.trim() !== '') {
    updateWeatherInfo(cityInput.value);
    cityInput.value = '';
    cityInput.blur();
  }
});

cityInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && cityInput.value.trim() !== '') {
    updateWeatherInfo(cityInput.value);
    cityInput.value = '';
    cityInput.blur();
  }
});

async function getFetchData(endpoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error('City not found');
  return await response.json();
}

async function updateWeatherInfo(city) {
  try {
    const weatherData = await getFetchData('weather', city);
    const forecastData = await getFetchData('forecast', city);
    showWeatherInfo(weatherData, forecastData);
  } catch (error) {
    showErrorSection();
  }
}

function showWeatherInfo(weatherData, forecastData) {
  searchCitySection.style.display = 'none';
  notFoundSection.style.display = 'none';
  weatherInfoSection.style.display = 'block';

  const currentDate = new Date(weatherData.dt * 1000);
  currentDateTxt.textContent = currentDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  countryTxt.textContent = weatherData.name;
  tempTxt.textContent = `${Math.round(weatherData.main.temp)} °C`;
  conditionTxt.textContent = weatherData.weather[0].main;
  humidityValueTxt.textContent = `${weatherData.main.humidity}%`;
  windValueTxt.textContent = `${weatherData.wind.speed} m/s`;
  longitudeValueTxt.textContent = `${weatherData.coord.lon}`;
  sunriseValueTxt.textContent = formatTime(weatherData.sys.sunrise, weatherData.timezone);
  sunsetValueTxt.textContent = formatTime(weatherData.sys.sunset, weatherData.timezone);
  weatherSummaryImg.src = getWeatherIcon(weatherData.weather[0].main);

  forecastItemsContainer.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const forecast = forecastData.list[i * 8];
    const forecastDate = new Date(forecast.dt * 1000);
    const forecastItem = document.createElement('div');
    forecastItem.className = 'forecast-item';

    forecastItem.innerHTML = `
      <h5 class="forecast-item-date regular-txt">${forecastDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</h5>
      <img src="${getWeatherIcon(forecast.weather[0].main)}" class="forecast-item-img">
      <h5 class="forecast-item-temp">${Math.round(forecast.main.temp)} °C</h5>
    `;
    forecastItemsContainer.appendChild(forecastItem);
  }
}

function getWeatherIcon(weather) {
  switch (weather) {
    case 'Clear':
      return 'assets/weather/clear.svg';
    case 'Clouds':
      return 'assets/weather/clouds.svg';
    case 'Rain':
      return 'assets/weather/rain.svg';
    case 'Snow':
      return 'assets/weather/snow.svg';
    case 'Thunderstorm':
      return 'assets/weather/thunderstorm.svg';
    case 'Drizzle':
      return 'assets/weather/drizzle.svg';
    default:
      return 'assets/weather/clouds.svg';
  }
}

function formatTime(unixTime, timezone) {
  const date = new Date((unixTime + timezone) * 1000);
  return date.toUTCString().slice(-12, -7) + (date.getUTCHours() >= 12 ? ' PM' : ' AM');
}

function showErrorSection() {
  searchCitySection.style.display = 'none';
  weatherInfoSection.style.display = 'none';
  notFoundSection.style.display = 'flex';
}
