import debounce from "lodash/debounce";
import { initScrollButtons } from './scrollButtons.js';

const options = {
    content: document.querySelector('.weather__content'),
    btnPrev: document.querySelector('.weather__scroll-btn-up'),
    btnNext: document.querySelector('.weather__scroll-btn-down'),
    scrollDirection: 'vertical',
    scrollAmount: 200,
};
const checkVerticalButtons = () => {
    initScrollButtons(options);
}

const els = {
    content: document.querySelector('.weather__content'),
    btnUp: document.querySelector('.weather__scroll-btn-up'),
    btnDown: document.querySelector('.weather__scroll-btn-down'),
};

// // Функция скролла
// const scrollContent = (direction) => {
//     const { content } = els;
//     const scrollAmount = 300; // На сколько пикселей скроллить за раз

//     if (direction === 'up') {
//         content.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
//     } else {
//         content.scrollBy({ top: scrollAmount, behavior: 'smooth' });
//     }
// };

// // Проверка видимости кнопок
// const checkVerticalButtons = () => {
//     const { content, btnUp, btnDown } = els;
//     if (!content) return;

//     // scrollTop - сколько прокручено сверху
//     // scrollHeight - полная высота контента
//     // clientHeight - видимая высота
//     const maxScrollTop = content.scrollHeight - content.clientHeight;

//     // Если скроллить некуда (контент влез целиком)
//     if (maxScrollTop <= 0) {
//         btnUp.classList.remove('is-visible');
//         btnDown.classList.remove('is-visible');
//         return;
//     }

//     // Кнопка ВВЕРХ
//     if (content.scrollTop > 10) {
//         btnUp.classList.add('is-visible');
//     } else {
//         btnUp.classList.remove('is-visible');
//     }

//     // Кнопка ВНИЗ
//     // tolerance 5px для точности
//     if (content.scrollTop < maxScrollTop - 5) {
//         btnDown.classList.add('is-visible');
//     } else {
//         btnDown.classList.remove('is-visible');
//     }
// };

// const initVerticalScroll = () => {
//     const { content, btnUp, btnDown } = els;
//     if (!content) return;

//     btnUp.addEventListener('click', () => scrollContent('up'));
//     btnDown.addEventListener('click', () => scrollContent('down'));

//     content.addEventListener('scroll', debounce(checkVerticalButtons, 50));
//     window.addEventListener('resize', checkVerticalButtons);

//     // Проверяем сразу при старте
//     checkVerticalButtons();
// };

// Запускаем
// initVerticalScroll();

// Экспортируем функцию обновления, чтобы вызывать её после загрузки данных API
export { checkVerticalButtons };