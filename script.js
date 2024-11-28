const searchBtn = document.querySelector(".search-icon");
const inputvalue = document.querySelector("#search-input");
const place = document.querySelector(".location");
const time = document.querySelector(".time");
const tempBtn = document.querySelector(".temp-btn");
const weatherImg = document.querySelector(".weather-img");
const temp = document.querySelector(".temp");
const mintemp = document.querySelector(".mintemp");
const maxtemp = document.querySelector(".maxtemp");

const feelslike = document.querySelector(".feelslike");
const humidity = document.querySelector(".humidity");
const windSpeed = document.querySelector(".windSpeed");
const pressure = document.querySelector(".pressure");

const riseTime = document.querySelector(".riseTime");
const setTime = document.querySelector(".setTime");

function formatTime(unixTimestamp) {
  // Create a new Date object from the Unix timestamp
  const date = new Date(unixTimestamp * 1000);

  // Extract hours and minutes
  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Format hours and minutes to ensure two digits
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Determine AM or PM
  const period = hours >= 12 ? "pm" : "am";

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  return `${hours}:${minutes}${period}`;
}

function getCountryName(countryCode, locale = "en") {
  try {
    const countryName = new Intl.DisplayNames([locale], { type: "region" });
    return countryName.of(countryCode) || "Unknown country code";
  } catch (error) {
    console.error("Error:", error);
    return "Error in fetching country name";
  }
}
function formatWeatherTime(timestampInSeconds) {
  const date = new Date(timestampInSeconds * 1000);

  const options = {
    weekday: "long", // e.g., "Thursday"
    year: "numeric", // e.g., "2024"
    month: "long", // e.g., "November"
    day: "2-digit", // e.g., "28"
    hour: "2-digit", // e.g., "1"
    minute: "2-digit", // e.g., "22"
    hour12: true, // Use 12-hour time format
  };

  // Format the date using Intl.DateTimeFormat
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  // Construct the final formatted string
  return `${formattedDate}`;
}

async function getWeatherData(city) {
  city = city || "kolkata";

  const apiKey = "cf9f9f9cd02ed5f30e01ee90a1f1c98c"; // Replace with your API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.cod === 200) {
      console.log(data);
      updateContent(data);
    } else {
      console.error(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
  }
}

function kelvinToCelcius(kelvin) {
  return (kelvin - 273.15).toFixed(2); // Fixed the formula and added 2 decimal places
}

const updateContent = (data) => {
  const { weather, main, wind, sys, name, dt } = data;
  place.innerText = `${name}, ${getCountryName(sys.country)}`;
  time.innerText = formatWeatherTime(dt);
  tempBtn.innerText = `${weather[0].main}`;
  weatherImg.src = `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;

  temp.innerHTML = `${kelvinToCelcius(main.temp)}&#176;`;
  mintemp.innerHTML = `Min: ${kelvinToCelcius(main.temp_min)}&#176;`; // Corrected assignment
  maxtemp.innerHTML = `Max: ${kelvinToCelcius(main.temp_max)}&#176;`; // Corrected assignment
  feelslike.innerHTML = `${kelvinToCelcius(main.feels_like)}&#176;`;
  humidity.innerText = `${main.humidity}%`;
  pressure.innerText = `${main.pressure} hPa`;
  windSpeed.innerText = `${wind.speed} m/s`;
  riseTime.innerText = `${formatTime(sys.sunrise)}`;
  setTime.innerText = `${formatTime(sys.sunset)}`;
};

searchBtn.addEventListener("click", () => {
  const city = inputvalue.value.trim().toLowerCase();
  console.log(city);
  getWeatherData(city);
});

getWeatherData();
