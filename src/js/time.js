import debounce from "lodash/debounce";
import { watchImagesLoad } from './utils.js';

const API_KEY = "e961f79282fa40b0b20172127261302";
const API_URL = "https://api.weatherapi.com/v1";

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

const checkScrollButtons = () => {
    const list = els.forRender.timeItems;
    const { btnPrev, btnNext } = els.ui;

    if (!list) return;

    // scrollLeft - сколько прокручено слева
    // scrollWidth - полная ширина контента
    // clientWidth - видимая ширина
    const maxScrollLeft = list.scrollWidth - list.clientWidth;

    // Если контента мало и скроллить некуда - скрываем обе
    if (maxScrollLeft <= 0) {
        btnPrev.classList.remove('is-visible');
        btnNext.classList.remove('is-visible');
        return;
    }

    // Левая кнопка: если прокрутили больше 0
    if (list.scrollLeft > 0) {
        btnPrev.classList.add('is-visible');
    } else {
        btnPrev.classList.remove('is-visible');
    }

    // Правая кнопка: если не дошли до конца (с запасом 1px)
    if (list.scrollLeft < maxScrollLeft - 1) {
        btnNext.classList.add('is-visible');
    } else {
        btnNext.classList.remove('is-visible');
    }
};

const initScrollEvents = () => {
    const list = els.forRender.timeItems;
    const { btnPrev, btnNext } = els.ui;

    // Прокрутка по клику (например, на 200px)
    btnPrev.addEventListener('click', () => {
        list.scrollBy({ left: -200, behavior: 'smooth' });
    });

    btnNext.addEventListener('click', () => {
        list.scrollBy({ left: 200, behavior: 'smooth' });
    });

    // Проверка кнопок при скролле (в том числе ручном) и изменении размера окна
    list.addEventListener('scroll', checkScrollButtons);
    window.addEventListener('resize', checkScrollButtons);
};

// Инициализируем слушатели один раз

const fetchAllData = async (city) => {
    // toggleLoading(true);
    try {
        const response = await fetch(`${API_URL}/forecast.json?key=${API_KEY}&q=${city}&days=1&lang=uk`);

        if (!response.ok) throw new Error("Город не знайдено");

        const data = await response.json();

        renderForecast(data);

    } catch (error) {
        console.error(error);
    } finally {
        // toggleLoading(false);
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
                    <img src="${dayInfo.condition.icon}" alt="#" class="weather__time-item-img">
                    <h3 class="weather__time-item-temp">${Math.round(dayInfo.temp_c)}°C</h3>
                </li>
            `;
        })
        .join('');

    timeItems.innerHTML = html;
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