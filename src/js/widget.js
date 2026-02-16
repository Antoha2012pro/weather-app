import debounce from "lodash/debounce";
import { checkVerticalButtons } from './contentScroll.js';

const API_KEY = "e961f79282fa40b0b20172127261302";
const API_URL = "https://api.weatherapi.com/v1";

const searchInputEl = document.querySelector(".weather__widget-search-input");

const els = {
    forRender: {
        weatherImg: document.querySelector(".weather__widget-weather-img"),
        weatherLocationTitle: document.querySelector(".weather__widget-weather-location-title"),
        weatherLocationSpan: document.querySelector(".weather__widget-weather-location-span"),
        weatherTemp: document.querySelector(".weather__widget-weather-temp"),
        weatherTime: document.querySelector(".weather__widget-weather-time"),
        futureBox: document.querySelector(".weather__widget-future-box"),
    },
    ui: {
        widget: document.querySelector('.weather__widget'),
        widgetBtnUp: document.querySelector('.weather__widget-btn-up'),
        widgetBtnDown: document.querySelector('.weather__widget-btn-down'),
        weatherLocation: document.querySelector(".weather__widget-weather-location"),
        weatherLocationImg: document.querySelector(".weather__widget-weather-location-img"),
    }
};

const formatCustomTime = (dateString) => {
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${dayName}, ${hours}:${minutes} ${ampm}`;
};

const checkScroll = () => {
    const { widget, widgetBtnUp, widgetBtnDown } = els.ui;
    if (!widget || !widgetBtnUp || !widgetBtnDown) return;

    const scrollTop = widget.scrollTop;
    const isScrollable = widget.scrollHeight > widget.clientHeight;
    const isAtBottom = Math.ceil(scrollTop + widget.clientHeight) >= widget.scrollHeight - 5;

    if (scrollTop > 20) {
        widgetBtnUp.classList.add('is-visible');
    } else {
        widgetBtnUp.classList.remove('is-visible');
    }

    if (isScrollable && !isAtBottom) {
        widgetBtnDown.classList.add('is-visible');
    } else {
        widgetBtnDown.classList.remove('is-visible');
    }
};

function initScrollButtons() {
    const { widget, widgetBtnUp, widgetBtnDown } = els.ui;
    if (!widget) return;

    widgetBtnUp.onclick = () => widget.scrollTo({ top: 0, behavior: 'smooth' });
    widgetBtnDown.onclick = () => widget.scrollBy({ top: 150, behavior: 'smooth' });

    widget.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    checkScroll();
}

initScrollButtons();

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
        const [currentRes, forecastRes] = await Promise.all([
            fetch(`${API_URL}/current.json?key=${API_KEY}&q=${city}&lang=uk`),
            fetch(`${API_URL}/forecast.json?key=${API_KEY}&q=${city}&days=3&lang=uk`)
        ]);

        if (!currentRes.ok || !forecastRes.ok) throw new Error("Город не знайдено");

        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        renderCurrentWeather(currentData);
        renderForecast(forecastData);
    } catch (error) {
        console.error(error);
    } finally {
        toggleLoading(false);
    }
}

const renderCurrentWeather = (data) => {
    const { forRender, ui } = els;

    Object.values(forRender).forEach(el => el?.classList.remove("skeleton"));

    if (ui.weatherLocation) ui.weatherLocation.style.cursor = "help";
    if (ui.weatherLocationImg) ui.weatherLocationImg.style.display = "block";

    forRender.weatherImg.src = data.current?.condition?.icon
        ? data.current.condition.icon
        : "img/default-weather.png";
    forRender.weatherImg.style.opacity = data.current?.condition?.icon ? "1" : "0.5";

    const locationName = data.location?.name && data.location?.country
        ? `${data.location.name}, ${data.location.country}`
        : "Location not found";

    forRender.weatherLocationTitle.textContent = locationName;
    forRender.weatherLocationSpan.textContent = locationName;

    forRender.weatherTemp.textContent = data.current?.temp_c !== undefined
        ? `${data.current.temp_c}°C`
        : "N/A";

    forRender.weatherTime.textContent = data.location?.localtime
        ? formatCustomTime(data.location.localtime)
        : "Time not found";
};


const renderForecast = (data) => {
    const { futureBox } = els.forRender;
    futureBox.innerHTML = "";

    const nextDays = data.forecast.forecastday.slice(1);

    const html = nextDays.map(dayInfo => {
        const dateString = new Date(dayInfo.date).toLocaleDateString('en-US', {
            weekday: 'short', day: 'numeric'
        });

        return `
            <div class="weather__widget-future-box-cart">
                <img src="https:${dayInfo.day.condition.icon}" alt="icon" class="weather__widget-future-box-cart-img">
                <div class="weather__widget-future-box-cart-desc">
                    <h3 class="weather__widget-future-box-cart-time">${dateString}</h3>
                    <p class="weather__widget-future-box-cart-weather">${dayInfo.day.condition.text}</p>
                </div>
            </div>
        `;
    }).join('');

    futureBox.innerHTML = html;
    setTimeout(checkScroll, 100);
    setTimeout(checkVerticalButtons, 100); 
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