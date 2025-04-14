const BASE_URL = "https://rickandmortyapi.com/api";
const api = {
  async getFromApi(query) {
    try {
      const url = `${BASE_URL}/${query}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP Error. Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
      return { error: true, status: err.status, message: err.message };
    }
  }
};
let query = "character";
let page = 1;
let filter = "";
const characterContainer = document.getElementById(`charactersContainer`);
const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");
const aliveFilter = document.getElementById("aliveFilter");
const deadFilter = document.getElementById("deadFilter");
const unknownFilter = document.getElementById("unknownFilter");
const noFilter = document.getElementById("noFilter");
const activePage = document.getElementById("activePage");
const maxPage = document.getElementById("maxPage");
prevButton.toggleAttribute("disabled");
await loadCharacters();
function showCard(character) {
  const newCard = document.createElement("article");
  newCard.classList.add("card");
  newCard.style.width = "15rem";
  newCard.innerHTML = `
        <div class="card-body">
            <h5 class="card-title"> ${character.name}</h5>
            <h6 class="card-title"> ${character.species}${
    character.type ? `/ ${character.type}` : ""
  }</h6>
            <img src="${character.image}" class="card-img-top" alt="${
    character.name
  }">
            <p class="card-text">Location: ${character.location.name}</p>
            <p>Status: ${character.status}</p>
        </div>
        `;
  characterContainer.appendChild(newCard);
};
async function loadCharacters() {
  characterContainer.innerHTML = "";
  const characterPage = await api.getFromApi(query);
  await characterPage.results.forEach((character) => showCard(character));
  activePage.innerText = page;
  maxPage.innerText = characterPage.info.pages;
};
aliveFilter.addEventListener("click", async () => {
  filter = `&status=alive`;
  query = `character?page=${page}${filter}`;
  await loadCharacters();
});
deadFilter.addEventListener("click", async () => {
  filter = `&status=dead`;
  query = `character?page=${page}${filter}`;
  await loadCharacters();
});
unknownFilter.addEventListener("click", async () => {
  filter = `&status=unknown`;
  query = `character?page=${page}${filter}`;
  await loadCharacters();
});
noFilter.addEventListener("click", async () => {
  filter = ``;
  query = `character?page=${page}`;
  await loadCharacters();
});
nextButton.addEventListener("click", async () => {
  if (page === 1) {
    prevButton.toggleAttribute("disabled");
  }
  if (page < parseInt(maxPage.innerText)) {
    page++;
    query = `character?page=${page}${filter}`;
    await loadCharacters();
  }
});
prevButton.addEventListener("click", async () => {
  if (page === 2) {
    prevButton.toggleAttribute("disabled");
  }
  if (page < parseInt(maxPage.innerText) && page > 1) {
    page--;
    query = `character?page=${page}${filter}`;
    await loadCharacters();
  }
});