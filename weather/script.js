document.addEventListener('DOMContentLoaded', () => {
  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log(
            'ServiceWorker registration successful with scope: ',
            registration.scope,
          );
        })
        .catch((err) => {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }

  const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
  const cityInput = document.getElementById('city-input');
  const searchButton = document.getElementById('search-button');
  const refreshButton = document.getElementById('refresh-button');
  const weatherDisplay = document.getElementById('weather-display');
  const errorMessage = document.getElementById('error-message');

  let currentCity = ''; // To store the last searched city

  // Function to fetch weather data
  async function getWeatherData(city) {
    if (!city) {
      errorMessage.textContent = 'Please enter a city name.';
      weatherDisplay.innerHTML =
        '<p class="message">Enter a city to get weather information.</p>';
      return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; // units=metric for Celsius

    try {
      errorMessage.textContent = ''; // Clear previous errors
      weatherDisplay.innerHTML = '<p class="message">Loading...</p>'; // Show loading state

      const response = await fetch(apiUrl);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found. Please check the spelling.');
        } else if (response.status === 401) {
          throw new Error(
            'Unauthorized. Please check your API key for OpenWeatherMap.',
          );
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      displayWeather(data);
      currentCity = city; // Store the successful city
    } catch (error) {
      console.error('Error fetching weather data:', error);
      errorMessage.textContent = `Error: ${error.message}`;
      weatherDisplay.innerHTML =
        '<p class="message">Could not load weather data.</p>';
    }
  }

  // Function to display weather data
  function displayWeather(data) {
    const { name, main, weather, wind, sys } = data;
    const weatherDescription = weather[0].description;
    const iconCode = weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherDisplay.innerHTML = `
            <h2>${name}, ${sys.country}</h2>
            <img src="${iconUrl}" alt="${weatherDescription}" class="weather-icon">
            <p class="temperature">${Math.round(main.temp)}°C</p>
            <p class="description">${weatherDescription}</p>
            <div class="details">
                <div class="detail-item">
                    <strong>Feels Like</strong>
                    <span>${Math.round(main.feels_like)}°C</span>
                </div>
                <div class="detail-item">
                    <strong>Humidity</strong>
                    <span>${main.humidity}%</span>
                </div>
                <div class="detail-item">
                    <strong>Wind Speed</strong>
                    <span>${wind.speed} m/s</span>
                </div>
                <div class="detail-item">
                    <strong>Min Temp</strong>
                    <span>${Math.round(main.temp_min)}°C</span>
                </div>
                <div class="detail-item">
                    <strong>Max Temp</strong>
                    <span>${Math.round(main.temp_max)}°C</span>
                </div>
                <div class="detail-item">
                    <strong>Pressure</strong>
                    <span>${main.pressure} hPa</span>
                </div>
            </div>
        `;
  }

  // Event Listeners
  searchButton.addEventListener('click', () => {
    getWeatherData(cityInput.value.trim());
  });

  cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      getWeatherData(cityInput.value.trim());
    }
  });

  refreshButton.addEventListener('click', () => {
    if (currentCity) {
      getWeatherData(currentCity); // Refresh data for the last searched city
    } else {
      errorMessage.textContent = 'No city to refresh. Please search first.';
    }
  });
});
