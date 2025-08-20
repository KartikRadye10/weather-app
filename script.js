const weatherList = document.getElementById("weatherList");
const message = document.getElementById("message");

async function searchCity() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    message.textContent = "⚠️ Please enter a city name";
    return;
  }

  weatherList.innerHTML = "";
  message.textContent = "⏳ Searching...";

  try {
    
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found");
    }

    message.textContent = "";

    for (let place of geoData.results.slice(0, 10)) {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current_weather=true&timezone=auto`
      );

      if (!response.ok) throw new Error("Weather fetch failed");

      const data = await response.json();
      const weather = data.current_weather;

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h2>${place.name}, ${place.country}</h2>
        <p>🌡 Temperature: <b>${weather.temperature} °C</b></p>
        <p>🌬 Wind: ${weather.windspeed} km/h</p>
        <p>🕒 Time: ${new Date(weather.time).toLocaleString()}</p>
      `;
      weatherList.appendChild(card);
    }
  } catch (error) {
    message.textContent = "❌ Error: " + error.message;
  }
}
