const API_KEY = "e5e23a79cad949e9b6e878b8041e7971";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function saveToFavorites(event) {
    event.stopPropagation();
    const heartIcon = event.target;
    const card = heartIcon.closest('.card');
    const article = {
        urlToImage: card.querySelector('#news-img').src,
        title: card.querySelector('#news-title').innerText,
        description: card.querySelector('#news-desc').innerText,
        source: card.querySelector('#news-source').innerText,
        url: card.querySelector('img').closest('.card').getAttribute('data-url') 
    };

    if (heartIcon.classList.contains('saved')) {
        heartIcon.classList.remove('saved');
        favorites = favorites.filter(fav => fav.title !== article.title);
    } else {
        heartIcon.classList.add('saved');
        favorites.push(article);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
}

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");
    const heartIcon = cardClone.querySelector(".heart-icon");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    if (favorites.some(fav => fav.title === article.title)) {
        heartIcon.classList.add('saved');
    }

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });

    cardClone.querySelector('.card').setAttribute('data-url', article.url);
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

function showFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    const cardsContainer = document.getElementById('cards-container');
    favoritesContainer.innerHTML = '';
    favorites.forEach(article => {
        const cardClone = document.getElementById('template-news-card').content.cloneNode(true);
        fillDataInCard(cardClone, article);
        favoritesContainer.appendChild(cardClone);
    });
    favoritesContainer.style.display = 'flex';
    cardsContainer.style.display = 'none';
}
