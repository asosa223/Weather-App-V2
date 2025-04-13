import './style.css'


const apiKey = import.meta.env.VITE_WEATHER_API_KEY



document.getElementById("getWeather").addEventListener("click", async () => {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return;

  const currentRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`
  );
  const forecastRes = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`
  );

  const currentData = await currentRes.json();
  const forecastData = await forecastRes.json();
  const weatherDiv = document.getElementById("weatherResult");

  if (currentData.cod !== 200 || forecastData.cod !== "200") {
    weatherDiv.innerHTML = `<p class="text-red-400">City not found.</p>`;
    return;
  }

  // === Current Weather ===
  const { main, weather, name } = currentData;

  let currentHTML = `
    <p class="text-xl font-semibold">${name}</p>
    <p>${weather[0].main} - ${weather[0].description}</p>
    <p class="text-3xl font-bold">${Math.round(main.temp)}°F</p>
    <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="Weather Icon" class="mx-auto mt-2" />
  `;

  // === Forecast ===
  const forecastList = forecastData.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  ); // Pick forecast for 12:00 PM each day

  const forecastHTML = `
    <h2 class="text-lg font-bold mt-6">5-Day Forecast</h2>
    <div class="flex justify-center gap-4 mt-4 max-w-[700px] mx-auto">
      ${forecastList
        .slice(0, 5)
        .map(day => {
          const date = new Date(day.dt_txt).toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
          return `
            <div class="w-[120px] bg-white/10 backdrop-blur-md p-3 rounded-xl text-center border border-white/20 shadow-md">
              <p class="font-semibold">${date}</p>
              <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" class="mx-auto" />
              <p>${Math.round(day.main.temp)}°F</p>
              <p class="text-sm">${day.weather[0].main}</p>
            </div>
          `;
        })
        .join("")}
    </div>
  `;

  weatherDiv.innerHTML = currentHTML + forecastHTML;
});
