/* =========================
   OPENWEATHERMAP API
========================= */

// =====================================================
// PASTE YOUR API KEY BETWEEN THE QUOTATION MARKS
// =====================================================
const API_KEY = "3f1a90247878a9784f006b42d39c1838";
// =====================================================


/* =========================
   HTML ELEMENTS
========================= */

const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

const weatherResult = document.getElementById("weatherResult");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");


/* =========================
   SEARCH BUTTON
========================= */

searchButton.addEventListener("click", getWeather);


/* =========================
   ENTER KEY
========================= */

cityInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        getWeather();
    }

});


/* =========================
   GET WEATHER
========================= */

async function getWeather() {

    const city = cityInput.value.trim();


    // Check city
    if (city === "") {

        showError("Please enter a city name.");

        return;
    }


    // Check API key
    if (
        API_KEY === "" ||
        API_KEY === "PASTE_YOUR_API_KEY_HERE"
    ) {

        showError("Please add your OpenWeatherMap API key in script.js.");

        return;
    }


    // Show loading
    loading.classList.remove("hidden");

    errorMessage.classList.add("hidden");

    weatherResult.classList.add("hidden");


    try {

        /* =========================
           CREATE API URL
        ========================= */

        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;


        /* =========================
           FETCH API
        ========================= */

        const response = await fetch(url);


        /* =========================
           CONVERT TO JSON
        ========================= */

        const data = await response.json();


        /* =========================
           CHECK FOR ERRORS
        ========================= */

        if (!response.ok) {

            console.log("OpenWeather response:", data);

            if (response.status === 401) {

                throw new Error(
                    "API key is invalid or not activated yet."
                );

            }


            if (response.status === 404) {

                throw new Error(
                    "City not found. Please check the city name."
                );

            }


            throw new Error(
                data.message || "Unable to get weather data."
            );

        }


        /* =========================
           DISPLAY WEATHER
        ========================= */

        displayWeather(data);


    } catch (error) {

        console.error("Weather Error:", error);

        showError(error.message);

    } finally {

        loading.classList.add("hidden");

    }

}


/* =========================
   DISPLAY WEATHER
========================= */

function displayWeather(data) {

    // City
    document.getElementById("cityName").textContent =
        data.name;


    // Country
    document.getElementById("countryName").textContent =
        data.sys.country;


    // Temperature
    document.getElementById("temperature").textContent =
        `${Math.round(data.main.temp)}°C`;


    // Weather condition
    document.getElementById("condition").textContent =
        data.weather[0].description;


    // Humidity
    document.getElementById("humidity").textContent =
        `${data.main.humidity}%`;


    // Feels like
    document.getElementById("feelsLike").textContent =
        `${Math.round(data.main.feels_like)}°C`;


    // Wind speed
    document.getElementById("windSpeed").textContent =
        `${data.wind.speed} m/s`;


    // Weather icon
    const iconCode = data.weather[0].icon;

    const iconURL =
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const weatherIcon =
        document.getElementById("weatherIcon");

    weatherIcon.src = iconURL;

    weatherIcon.alt =
        data.weather[0].description;


    // Show weather result
    weatherResult.classList.remove("hidden");

}


/* =========================
   SHOW ERROR
========================= */

function showError(message) {

    errorMessage.textContent = message;

    errorMessage.classList.remove("hidden");

    weatherResult.classList.add("hidden");

}