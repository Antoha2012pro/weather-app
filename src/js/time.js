import debounce from "lodash/debounce";
import { API_KEY, API_URL, toggleLoading } from "./utils.js";
import { initScrollButtons } from './scrollButtons.js';

const options = {
    content: document.querySelector('.weather__time-items'),
    btnPrev: document.querySelector('.weather__time-btn-prev'),
    btnNext: document.querySelector('.weather__time-btn-next'),
    scrollDirection: 'horizontal', // Или 'vertical'
    scrollAmount: 200, // Amount to scroll
};


const searchInputEl = document.querySelector(".weather__widget-search-input");

const els = {
    forRender: {
        timeItems: document.querySelector(".weather__time-items"),
    },
    ui: {
        btnPrev: document.querySelector(".weather__time-btn-prev"),
        btnNext: document.querySelector(".weather__time-btn-next"),
    },
};

const formatCustomTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    return [`${hours}:00`, Number(hours)];
};

const fetchAllData = async (city) => {
    toggleLoading(true, els);
    try {
        const response = await fetch(`${API_URL}/forecast.json?key=${API_KEY}&q=${city}&days=1&lang=uk`);

        if (!response.ok) throw new Error("Город не знайдено");

        const data = await response.json();

        renderForecast(data);

    } catch (error) {
        console.error(error);
    } finally {
        toggleLoading(false, els);
    }
}

const renderForecast = (data) => {
    const { timeItems } = els.forRender;
    timeItems.innerHTML = "";

    const hours = data.forecast.forecastday[0].hour;
    const currentHour = formatCustomTime(data.location.localtime)[1];

    const html = hours
        .filter(dayInfo => {
            const dayHour = formatCustomTime(dayInfo.time)[1];
            return dayHour > currentHour;
        })
        .slice(0, 6)
        .map(dayInfo => {
            return `
                <li class="weather__time-item">
                    <p class="weather__time-item-time">${formatCustomTime(dayInfo.time)[0]}</p>
                    <img src="https:${dayInfo.condition.icon}" alt="#" class="weather__time-item-img">
                    <h3 class="weather__time-item-temp">${Math.round(dayInfo.temp_c)}°C</h3>
                </li>
            `;
        })
        .join('');

    timeItems.innerHTML = html;
    initScrollButtons(options);
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