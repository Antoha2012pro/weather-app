const API_URL = "https://pixabay.com/api";
const API_KEY = "54640967-f174f6139fb35610610a281ef";

const els = {
    forRender: {},
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

const fetchFotosData = async () => {
    toggleLoading(true);
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}&q=rain`);


        if (!response.ok) throw new Error("Фотку не знайдено");

        const data = await response.json();

        renderRandomFotos(data);

    } catch (error) {
        console.error(error);
    } finally {
        toggleLoading(false);
    }
}

const renderRandomFotos = (data) => {
    const { ui } = els;
    const randomNum = Math.floor(Math.random() * (data.hits.length + 1));
    
    ui.weatherFoto.src = `${data.hits[randomNum].largeImageURL}`
}

fetchFotosData();