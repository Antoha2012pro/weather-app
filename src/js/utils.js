export const API_KEY = "e961f79282fa40b0b20172127261302";
export const API_URL = "https://api.weatherapi.com/v1";

export const toggleLoading = (isLoading, elementsObj) => {
    Object.values(elementsObj.forRender).forEach(el => {
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

export const watchImagesLoad = (container, callback) => {
    if (!container) return;
    
    // 1. Вызываем проверку сразу (для текста)
    callback();

    const images = container.querySelectorAll('img');
    
    images.forEach(img => {
        if (img.complete) {
            callback();
        } else {
            img.addEventListener('load', callback);
            img.addEventListener('error', callback);
        }
    });
};