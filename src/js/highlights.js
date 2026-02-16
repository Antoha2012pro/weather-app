import debounce from "lodash/debounce";
import { API_KEY, API_URL, toggleLoading } from "./utils.js";

const searchInputEl = document.querySelector(".weather__widget-search-input");

const els = {
    forRender: {
        uvIndex: document.getElementById("uvIndex"),
        windSpeed: document.getElementById("windSpeed"),
        sunrise: document.getElementById("sunrise"),
        sunset: document.getElementById("sunset"),

        humidity: document.getElementById("humidity"),
        visibility: document.getElementById("visibility"),
        airQuality: document.getElementById("airQuality"),
    },
    ui: {}
};

const fetchAllData = async (city) => {
    toggleLoading(true, els);
    try {
        const response = await fetch(`${API_URL}/forecast.json?key=${API_KEY}&q=${city}&days=1&aqi=yes&lang=uk`);

        if (!response.ok) throw new Error("Город не знайдено");

        const data = await response.json();

        renderCurrentWeather(data);

    } catch (error) {
        console.error(error);
    } finally {
        toggleLoading(false, els);
    }
}

const renderCurrentWeather = (data) => {
    const { forRender } = els;

    Object.values(forRender).forEach(el => el?.classList.remove("skeleton"));

    forRender.uvIndex.textContent = `${data.current.uv}`;
    forRender.windSpeed.textContent = `${data.current.wind_kph} Km/h`;
    forRender.sunrise.textContent = `${data.forecast.forecastday[0].astro.sunrise}`;
    forRender.sunset.textContent = `${data.forecast.forecastday[0].astro.sunset}`;
    forRender.humidity.textContent = `${data.current.humidity}%`;
    forRender.visibility.textContent = `${data.current.vis_km}`;
    forRender.airQuality.textContent = `${data.current.air_quality.pm10}`;

};

searchInputEl.addEventListener("input", debounce((event) => {
    const query = event.target.value.trim();
    if (query.length > 2) {
        fetchAllData(query);
    }
}, 500));

setTimeout(() => {
    fetchAllData("Berlin");
}, 50);
