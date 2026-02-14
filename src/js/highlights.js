import debounce from "lodash/debounce";

const API_KEY = "e961f79282fa40b0b20172127261302";
const API_URL = "https://api.weatherapi.com/v1";

const F_API_URL = "https://pixabay.com/api";
const F_API_KEY = "54640967-f174f6139fb35610610a281ef";

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
    ui: {
        weatherFoto: document.querySelector(".weather__foto"),
    }
};

const toggleLoading = (isLoading) => {
    Object.values(els.forRender).forEach(el => {
        if (!el) return;

        if (isLoading) {
            if (el.tagName !== 'IMG') {
                el.textContent = "";
            }
            el.classList.add("skeleton");
        } else {
            el.classList.remove("skeleton");
        }
    });
};

const fetchAllData = async (city) => {
    toggleLoading(true);
    try {
        const response = await fetch(`${API_URL}/forecast.json?key=${API_KEY}&q=${city}&days=1&aqi=yes&lang=uk`);

        if (!response.ok) throw new Error("Город не знайдено");

        const data = await response.json();

        renderCurrentWeather(data);

    } catch (error) {
        console.error(error);
    } finally {
        toggleLoading(false);
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

// setTimeout(() => {
//     fetchAllData("Kyiv");
// }, 50);

const fetchFotosData = async () => {
    try {
        const response = await fetch(`${F_API_URL}?key=${F_API_KEY}&q=rain`);


        if (!response.ok) throw new Error("Фотку не знайдено");

        const data = await response.json();

        renderRandomFotos(data);

    } catch (error) {
        console.error(error);
    } finally {
        toggleLoading(false);
    }
}

// const renderRandomFotos = (data) => {
//     const { ui } = els;
//     const randomNum = Math.floor(Math.random() * (data.hits.length + 1));
    
//     ui.weatherFoto.src = `${data.hits[randomNum].largeImageURL}`
// }

fetchFotosData();