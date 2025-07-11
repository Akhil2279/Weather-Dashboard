// weather.js
const apiKey = "ddf4168070a567141c0d8f3a24bc636b"; // Replace with your API key
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const cityName = document.getElementById("cityName");
const dateTime = document.getElementById("dateTime");
const temperature = document.getElementById("temperature");
const weatherDesc = document.getElementById("weatherDesc");
const weatherIcon = document.getElementById("weatherIcon");
const highLow = document.getElementById("highLow");
const hourlyForecast = document.getElementById("hourlyForecast");
const weeklyForecast = document.getElementById("weeklyForecast");
const weatherDetails = document.getElementById("weatherDetails");

function formatTime(ts, offset = 0) {
  return new Date((ts + offset) * 1000).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

async function fetchWeather(city) {
  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      )
    ]);

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    if (weatherData.cod !== 200) {
      alert("Error: " + weatherData.message);
      return;
    }

    const currentTime = new Date().toLocaleString("en-IN", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    cityName.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
    dateTime.textContent = currentTime;
    temperature.innerHTML = `${Math.round(weatherData.main.temp)}<span class="text-2xl absolute top-2">°C</span>`;
    weatherDesc.textContent = weatherData.weather[0].description;
    weatherIcon.src = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    highLow.textContent = `H: ${Math.round(weatherData.main.temp_max)}° L: ${Math.round(weatherData.main.temp_min)}°`;

    weatherDetails.innerHTML = `
      <div class="weather-detail-card p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded shadow-md">
        <p class="font-semibold mb-1">Humidity</p>
        <p class="text-2xl">${weatherData.main.humidity}%</p>
      </div>
      <div class="weather-detail-card p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded shadow-md">
        <p class="font-semibold mb-1">Pressure</p>
        <p class="text-2xl">${weatherData.main.pressure} hPa</p>
      </div>
      <div class="weather-detail-card p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded shadow-md">
        <p class="font-semibold mb-1">Wind Speed</p>
        <p class="text-2xl">${weatherData.wind.speed} m/s</p>
      </div>
      <div class="weather-detail-card p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded shadow-md">
        <p class="font-semibold mb-1">Sunrise</p>
        <p class="text-2xl">${formatTime(weatherData.sys.sunrise)}</p>
      </div>
    `;

    hourlyForecast.innerHTML = "";
    forecastData.list.slice(0, 6).forEach(hour => {
      hourlyForecast.innerHTML += `
        <div class="forecast-card p-4 min-w-[100px] text-center bg-white/10 backdrop-blur-sm rounded transition-transform duration-300 transform hover:scale-105 shadow-md">
          <p class="font-semibold text-sm">${formatTime(hour.dt)}</p>
          <img src="http://openweathermap.org/img/wn/${hour.weather[0].icon}.png" class="w-10 h-10 mx-auto" />
          <p class="text-lg">${Math.round(hour.main.temp)}°</p>
        </div>
      `;
    });

    const days = {};
    forecastData.list.forEach(item => {
      const day = new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "long" });
      if (!days[day]) days[day] = [];
      days[day].push(item);
    });

    weeklyForecast.innerHTML = "";
    Object.entries(days).slice(0, 7).forEach(([day, values]) => {
      const temps = values.map(v => v.main.temp);
      const min = Math.min(...temps);
      const max = Math.max(...temps);
      const icon = values[Math.floor(values.length / 2)].weather[0].icon;
      weeklyForecast.innerHTML += `
        <div class="forecast-card flex flex-col justify-between items-center p-6 min-w-[160px] bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
          <img src="http://openweathermap.org/img/wn/${icon}.png" class="w-14 h-14 mb-2 animate-bounce" />
          <p class="font-medium text-sm">${day}</p>
          <div class="mt-1 text-center">
            <span class="text-xl font-bold">${Math.round(max)}°</span>
            <span class="text-sm text-gray-300 block">${Math.round(min)}°</span>
          </div>
        </div>
      `;
    });

  } catch (err) {
    console.error("Fetch error:", err);
  }
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city !== "") {
    fetchWeather(city);
  }
});

// Default load
fetchWeather("New York");
