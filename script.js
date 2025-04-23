const BASE_URL = "https://rickandmortyapi.com/api";
const api = {
  async getFromApi(query) {
    try {
      const url = `${query}`;
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
  },
};
let query = `${BASE_URL}/character`;
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

async function createModal(character) {
  const episode = await loadEpisode(character.episode[0]);
  const newModal = document.createElement("dialog");
  newModal.style.width = "20rem";
  //newModal.classList.add("modal");
  newModal.setAttribute("id", `${character.id}-modal`);
  newModal.innerHTML = `
         <div class="modal-content">
             <h5 class="modal-title"> ${character.name}</h5>
             <h6 class="dialog-title"> ${character.species} ${
    character.type ? `/ ${character.type}` : ""
  }</h6>            
             <img src="${character.image}" class="dialog-img-top" alt="${
    character.name
  }">
             <p>Status: ${character.status}</p>
             <p>First Appearance: ${episode.name} aired on ${
    episode.air_date
  }</p>
             <p>Status: ${character.status}</p>
         </div>`;
  characterContainer.appendChild(newModal);
}
function showCard(character) {
  const newCard = document.createElement("article");
  newCard.classList.add("card");
  newCard.style.width = "15rem";
  newCard.innerHTML = `
        <div class="card-body" id="${character.id}Card">
            <h5 class="card-title"> ${character.name}</h5>
            <h6 class="card-title"> ${character.species} ${
    character.type ? `/ ${character.type}` : ""
  }</h6>            
            <img src="${character.image}" class="card-img-top" alt="${
    character.name
  }">
            <p>Status: ${character.status}</p>
        </div>
        `;
  characterContainer.appendChild(newCard);
  newCard.addEventListener("click", () => {
    const modal = document.getElementById(`${character.id}-modal`);
    modal.showModal();
  });
}
async function loadCharacters() {
  characterContainer.innerHTML = "";
  const characterPage = await api.getFromApi(query);
  await characterPage.results.forEach((character) => showCard(character));
  await characterPage.results.forEach((character) => createModal(character));
  activePage.innerText = page;
  maxPage.innerText = characterPage.info.pages;
}
async function loadEpisode(query) {
  const episode = await api.getFromApi(query);
  console.log(episode);
  return episode
}
aliveFilter.addEventListener("click", async () => {
  filter = `&status=alive`;
  query = `${BASE_URL}/character?page=${page}${filter}`;
  await loadCharacters();
});
deadFilter.addEventListener("click", async () => {
  filter = `&status=dead`;
  query = `${BASE_URL}/character?page=${page}${filter}`;
  await loadCharacters();
});
unknownFilter.addEventListener("click", async () => {
  filter = `&status=unknown`;
  query = `${BASE_URL}/character?page=${page}${filter}`;
  await loadCharacters();
});
noFilter.addEventListener("click", async () => {
  filter = ``;
  query = `${BASE_URL}/character?page=${page}${filter}`;
  await loadCharacters();
});
nextButton.addEventListener("click", async () => {
  if (page === 1) {
    prevButton.toggleAttribute("disabled");
  }
  if (page < parseInt(maxPage.innerText)) {
    page++;
    query = `${BASE_URL}/character?page=${page}${filter}`;
    await loadCharacters();
  }
});
prevButton.addEventListener("click", async () => {
  if (page === 2) {
    prevButton.toggleAttribute("disabled");
  }
  if (page < parseInt(maxPage.innerText) && page > 1) {
    page--;
    query = `${BASE_URL}/character?page=${page}${filter}`;
    await loadCharacters();
  }
});
