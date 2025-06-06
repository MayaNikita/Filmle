const levelContainer = document.getElementById("levels-container");
let FILMLIST = [];
let SHOWLIST = [];
const COMPLETED_FILMS = JSON.parse(localStorage.getItem("completedFilms")) ?? [];
const STARTED_FILMS = JSON.parse(localStorage.getItem("startedFilms")) ?? [];
const COMPLETED_SHOWS = JSON.parse(localStorage.getItem("completedShows")) ?? [];
const STARTED_SHOWS = JSON.parse(localStorage.getItem("startedShows")) ?? [];

const movieButton = document.getElementById("movie-levels")
const showButton = document.getElementById("show-levels")
movieButton.addEventListener("click", () => {
    switchLevelType("films")
})
showButton.addEventListener("click", () => {
    switchLevelType("shows")
})

function addMovieLevel(level, index) {
    const newChild = document.createElement("a");
    newChild.href = "../movie.html?level=" + (index+1);
    let className = "";
    if (COMPLETED_FILMS.find((film) => film.name == level)) className = "completed";
    else if (STARTED_FILMS.find((film) => film.name == level)) className = "started";
    newChild.innerHTML = `<div class="level ${className}">${index+1}</div>`;
    levelContainer.appendChild(newChild);
}

function addShowLevel(level, index) {
    const newChild = document.createElement("a");
    newChild.href = "../show.html?level=" + (index+1);
    let className = "";
    if (COMPLETED_SHOWS.find((film) => film.name == level)) className = "completed";
    else if (STARTED_SHOWS.find((film) => film.name == level)) className = "started";
    newChild.innerHTML = `<div class="level ${className}">${index+1}</div>`;
    levelContainer.appendChild(newChild);
}

function switchLevelType(type) {
    if (type == "films") {
        movieButton.classList.add("active")
        showButton.classList.remove("active")
        FILMLIST = [];
        levelContainer.innerHTML = "";

        fetch("../lists/movies.txt")
            .then((res) => res.text())
            .then((text) => {
                FILMLIST = text.split(/\r?\n/);
                FILMLIST.forEach(addMovieLevel)
            })
            .catch((e) => console.error(e));
    } else if (type == "shows") {
        movieButton.classList.remove("active")
        showButton.classList.add("active")
        FILMLIST = [];
        levelContainer.innerHTML = "";

        fetch("../lists/shows.txt")
            .then((res) => res.text())
            .then((text) => {
                FILMLIST = text.split(/\r?\n/);
                FILMLIST.forEach(addShowLevel)
            })
            .catch((e) => console.error(e));
    }
}

// Add blur to scrollable container
levelContainer.addEventListener("scroll", (event) => {
    if (levelContainer.scrollTop < 1) levelContainer.style = "-webkit-mask: linear-gradient(180deg,#000,#000 10% 90%,#0000)";
    else if (levelContainer.scrollHeight - levelContainer.scrollTop - levelContainer.clientHeight < 1) levelContainer.style = "-webkit-mask: linear-gradient(180deg,#0000,#000 10% 90%,#000)";
    else levelContainer.style = "-webkit-mask: linear-gradient(180deg,#0000,#000 10% 90%,#0000)";
  });

const urlParams = new URLSearchParams(window.location.search);
let type = urlParams.get('t');
if (type == "films" || type == "shows") switchLevelType(type);
else switchLevelType("films");

console.log(type);
