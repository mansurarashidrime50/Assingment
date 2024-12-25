const countryGrid = document.getElementById("countryGrid");
const searchBox = document.getElementById("searchBox");
const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", () => {
  const countryName = searchBox.value.trim();

  if (!countryName) {
    countryGrid.innerHTML = "";
    return;
  }

  const countryAPI = `https://restcountries.com/v3.1/name/${countryName}`;
  fetch(countryAPI)
    .then(response => response.json())
    .then(data => {
      if (!data || data.status === 404) {
        countryGrid.innerHTML = `<p>No country data found.</p>`;
        return;
      }
      displayCountries(data);
    })
    .catch(error => {
      console.error("Error fetching country data:", error);
      countryGrid.innerHTML = `<p>Error fetching data. Please try again.</p>`;
    });
});

function displayCountries(countries) {
  countryGrid.innerHTML = "";
  countryGrid.classList.add("d-flex", "justify-content-center", "flex-wrap");

  countries.forEach(country => {
    const card = document.createElement("div");
    card.classList.add("country-card", "m-3", "p-3", "rounded");

    const currency = country.currencies
      ? Object.values(country.currencies)[0]
      : { name: "N/A", symbol: "N/A" };

    card.innerHTML = `
      <img src="${country.flags.png}" alt="${country.name.common}" class="rounded">
      <h5 class="mt-2">${country.name.common}</h5>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
      <p><strong>Currency:</strong> ${currency.name} (${currency.symbol})</p>
      <button class="btn weather-btn mt-2" onclick="getWeather('${country.latlng[0]}', '${country.latlng[1]}', this)">More Details</button>
      <div class="weather-info mt-2 d-none">
        <p><strong>Temperature:</strong> <span class="temperature">Loading...</span></p>
        <p><strong>Wind Speed:</strong> <span class="windspeed">Loading...</span></p>
        <p><strong>Condition:</strong> <span class="condition">Loading...</span></p>
      </div>
    `;

    countryGrid.appendChild(card);
  });
}

function getWeather(lat, lon, button) {
  const weatherAPI = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  const card = button.closest(".country-card");
  const weatherInfo = card.querySelector(".weather-info");
  const temperature = card.querySelector(".temperature");
  const windspeed = card.querySelector(".windspeed");
  const condition = card.querySelector(".condition");

  weatherInfo.classList.remove("d-none");
  temperature.textContent = "Loading...";
  windspeed.textContent = "Loading...";
  condition.textContent = "Loading...";

  fetch(weatherAPI)
    .then(response => response.json())
    .then(data => {
      const weather = data.current_weather;

      if (!weather) {
        temperature.textContent = "No data";
        windspeed.textContent = "No data";
        condition.textContent = "No data";
      } else {
        temperature.textContent = `${weather.temperature}°C`;
        windspeed.textContent = `${weather.windspeed} km/h`;
        condition.textContent = weather.weathercode || "N/A";
      }
    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
      temperature.textContent = "Error";
      windspeed.textContent = "Error";
      condition.textContent = "Error";
    });
}

