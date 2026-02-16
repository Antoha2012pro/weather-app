import debounce from "lodash/debounce";

const scrollContent = (element, direction, scrollAmount) => {
    if (direction === 'up') {
        element.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
    } else if (direction === 'down') {
        element.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    } else if (direction === 'left') {
        element.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else if (direction === 'right') {
        element.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
};

const checkButtonsVisibility = (options) => {
    const { content, btnPrev, btnNext, scrollDirection } = options;

    if (!content || !btnPrev || !btnNext) return;

    let maxScrollValue;
    let scrollValue;

    if (scrollDirection === 'vertical') {
        maxScrollValue = content.scrollHeight - content.clientHeight;
        scrollValue = content.scrollTop;
    } else {
        maxScrollValue = content.scrollWidth - content.clientWidth;
        scrollValue = content.scrollLeft;
    }

    if (maxScrollValue <= 0) {
        btnPrev.classList.remove('is-visible');
        btnNext.classList.remove('is-visible');
        return;
    }

    const tolerance = 5; // Adjust as needed

    if (scrollValue > tolerance) {
        btnPrev.classList.add('is-visible');
    } else {
        btnPrev.classList.remove('is-visible');
    }

    if (scrollValue < maxScrollValue - tolerance) {
        btnNext.classList.add('is-visible');
    } else {
        btnNext.classList.remove('is-visible');
    }
};

const initScrollButtons = (options) => {
    const { content, btnPrev, btnNext, scrollDirection, scrollAmount } = options;

    if (!content || !btnPrev || !btnNext) return;

    const scrollOptions = { behavior: 'smooth' };

    btnPrev.addEventListener('click', () => {
        const direction = scrollDirection === 'vertical' ? 'up' : 'left';
        scrollContent(content, direction, scrollAmount);
    });

    btnNext.addEventListener('click', () => {
        const direction = scrollDirection === 'vertical' ? 'down' : 'right';
        scrollContent(content, direction, scrollAmount);
    });

    const debouncedCheckButtons = debounce(() => {
        checkButtonsVisibility(options);
    }, 50);

    content.addEventListener('scroll', debouncedCheckButtons);
    window.addEventListener('resize', debouncedCheckButtons);

    checkButtonsVisibility(options);
};

export { initScrollButtons };


/*
Пример использования:

HTML:
<div class="scrollable-container">
  <div class="scroll-btn scroll-btn-prev">Prev</div>
  <div class="scroll-btn scroll-btn-next">Next</div>
  <div class="scrollable-content">
    [Content Here]
  </div>
</div>

JavaScript:
import { initScrollButtons } from './scrollButtons.js';

const options = {
  content: document.querySelector('.scrollable-content'),
  btnPrev: document.querySelector('.scroll-btn-prev'),
  btnNext: document.querySelector('.scroll-btn-next'),
  scrollDirection: 'horizontal', // Или 'vertical'
  scrollAmount: 200, // Amount to scroll
};

initScrollButtons(options);
*/