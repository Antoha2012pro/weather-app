import debounce from "lodash/debounce";

const API_KEY = "e961f79282fa40b0b20172127261302";
const API_URL = "https://api.weatherapi.com/v1";

let city;
let days;

const searchInputEl = document.querySelector(".weather__widget-search-input");

const renderUiElementsObj = {
    weatherImg: document.querySelector(".weather__widget-weather-img"),
    weatherLocationTitle: document.querySelector(".weather__widget-weather-location-title"),
    weatherLocationSpan: document.querySelector(".weather__widget-weather-location-span"),
    weatherTemp: document.querySelector(".weather__widget-weather-temp"),
    weatherTime: document.querySelector(".weather__widget-weather-time"),
    futureBox: document.querySelector(".weather__widget-future-box"),
};

const elements = {
    widget: document.querySelector('.weather__widget'),
    widgetBtnUp: document.querySelector('.weather__widget-btn-up'),
    widgetBtnDown: document.querySelector('.weather__widget-btn-down'),
    weatherLocation: document.querySelector(".weather__widget-weather-location"),
    weatherLocationImg: document.querySelector(".weather__widget-weather-location-img"),
}

const checkScroll = () => {
    if (!elements.widget || !elements.widgetBtnUp || !elements.widgetBtnDown) return;
    const scrollTop = elements.widget.scrollTop;
    const isScrollable = elements.widget.scrollHeight > elements.widget.clientHeight;
    const isAtBottom = Math.ceil(scrollTop + elements.widget.clientHeight) >= elements.widget.scrollHeight - 5;

    // ЛОГИКА КНОПКИ ВВЕРХ
    // Показываем, если прокрутили вниз больше чем на 20px
    if (scrollTop > 20) {
        elements.widgetBtnUp.classList.add('is-visible');
    } else {
        elements.widgetBtnUp.classList.remove('is-visible');
    }

    // ЛОГИКА КНОПКИ ВНИЗ
    // Показываем, если контент длинный И мы еще не внизу
    if (isScrollable && !isAtBottom) {
        elements.widgetBtnDown.classList.add('is-visible');
    } else {
        elements.widgetBtnDown.classList.remove('is-visible');
    }
};

function initScrollButtons() {
    if (!elements.widget || !elements.widgetBtnUp || !elements.widgetBtnDown) return;

    // Клик ВВЕРХ
    elements.widgetBtnUp.onclick = () => {
        elements.widget.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Клик ВНИЗ
    elements.widgetBtnDown.onclick = () => {
        elements.widget.scrollBy({ top: 150, behavior: 'smooth' });
    };

    // Слушаем скролл и изменение размера окна
    elements.widget.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    
    // Первая проверка при запуске
    checkScroll();
}

// Запускаем слушатели кнопок сразу
initScrollButtons();

searchInputEl.addEventListener("input", debounce(inputSearch, 500));

const formatCustomTime = (dateString) => {
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    return `${dayName}, ${hours}:${minutes} ${ampm}`;
}

function inputSearch(event) {
    const query = event.target.value.trim();

    if (query.length < 3) return;

    getWeatherData(query);
    getForecastData(query);
}

const toggleLoading = (isLoading) => {
    Object.values(renderUiElementsObj).forEach(el => {
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
    elements.weatherLocation.style.cursor = "help";
    renderUiElementsObj.weatherImg.src = object.current.condition.icon;
    renderUiElementsObj.weatherImg.style.opacity = "1";
    elements.weatherLocationImg.style.display = "block";
    renderUiElementsObj.weatherLocationTitle.textContent = `${object.location.name}, ${object.location.country}`;
    renderUiElementsObj.weatherLocationSpan.textContent = `${object.location.name}, ${object.location.country}`;
    renderUiElementsObj.weatherTemp.textContent = `${object.current.temp_c}°C`;
    renderUiElementsObj.weatherTime.textContent = formatCustomTime(object.location.localtime);
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
    renderUiElementsObj.futureBox.innerHTML = "";

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

        renderUiElementsObj.futureBox.insertAdjacentHTML("beforeend", html);
    });
    
    setTimeout(checkScroll, 100);
}