import debounce from "lodash/debounce";

const API_KEY = "e961f79282fa40b0b20172127261302";
const API_URL = "http://api.weatherapi.com/v1";

let city;
let days;

const searchInputEl = document.querySelector(".weather__widget-search-input");
const weatherImgEl = document.querySelector(".weather__widget-weather-img");
const weatherTitleEl = document.querySelector(".weather__widget-weather-location-title");
const weatherTempEl = document.querySelector(".weather__widget-weather-temp");
const weatherTimeEl = document.querySelector(".weather__widget-weather-time");

const uiElements = {
    weatherImg: document.querySelector(".weather__widget-weather-img"),
    weatherLocationTitle: document.querySelector(".weather__widget-weather-location-title"),
    weatherTemp: document.querySelector(".weather__widget-weather-temp"),
    weatherTime: document.querySelector(".weather__widget-weather-time"),
    futureBox: document.querySelector(".weather__widget-future-box"),
};

searchInputEl.addEventListener("input", debounce(inputSearch, 500));

function inputSearch(event) {
    const query = event.target.value.trim();

    if (query.length < 3) return;

    getWeatherData(query);
    getForecastData(query);
}

const toggleLoading = (isLoading) => {
    Object.values(uiElements).forEach(el => {
        if (isLoading) {
            el.textContent = "";
            el.classList.add("skeleton");
        } else {
            el.classList.remove("skeleton");
        }
    });
};

const getWeatherData = async (city) => {
    toggleLoading(true);

    try {
        const response = await fetch(`${API_URL}/current.json?key=${API_KEY}&q=${city}`);

        if (!response.ok) {
            throw new Error("Город не найден");
        }

        const data = await response.json();
        console.log(data);
        renderWeather(data);

        toggleLoading(false);
    } catch (error) {
        console.error(error);
    }
}

const renderWeather = async (object) => {
    uiElements.weatherImg.src = object.current.condition.icon;
    uiElements.weatherLocationTitle.textContent = `${object.location.name}, ${object.location.country}`;
    uiElements.weatherTemp.textContent = `${object.current.temp_c}°C`;
    uiElements.weatherTime.textContent = object.location.localtime;
}



const getForecastData = async (city) => {
    toggleLoading(true);

    try {
        const response = await fetch(`${API_URL}/forecast.json?key=${API_KEY}&q=${city}&days=3`);

        if (!response.ok) {
            throw new Error("Город не знайдено");
        }

        const data = await response.json();
        console.log(data);
        renderFutureWeather(data);

        toggleLoading(false);
    } catch (error) {
        console.error(error);
    };
}

const renderFutureWeather = (data) => {
    uiElements.futureBox.innerHTML = "";

    const nextDays = data.forecast.forecastday.slice(1);

    nextDays.forEach((dayInfo) => {
        const dateObj = new Date(dayInfo.date);
        const dateString = dateObj.toLocaleDateString('en-US', { 
            weekday: 'short', 
            day: 'numeric' 
        });

        const html = `
            <div class="weather__widget-future-box-cart">
                <img src="https:${dayInfo.day.condition.icon}" alt="icon" class="weather__widget-future-box-cart-img">
                
                <div class="weather__widget-future-box-cart-desc">
                    <h3 class="weather__widget-future-box-cart-time">${dateString}</h3>
                    <p class="weather__widget-future-box-cart-weather">${dayInfo.day.condition.text}</p>
                </div>
            </div>
        `;

        uiElements.futureBox.insertAdjacentHTML("beforeend", html);
    });
}