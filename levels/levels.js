const levelContainer = document.getElementById("levels-container");
// const NOW = new Date();
// Date when the first level was released
// const STARTING_DATE = new Date(2025, 2, 1)
let FILMLIST = [];
let SHOWLIST = [];
const COMPLETED_LEVELS = JSON.parse(localStorage.getItem("completetdLevels")) ?? [];

const movieButton = document.getElementById("movie-levels")
const showButton = document.getElementById("show-levels")
movieButton.addEventListener("click", () => {
    switchLevelType("movie")
})
showButton.addEventListener("click", () => {
    switchLevelType("show")
})

function addMovieLevel(level, index) {
    const newChild = document.createElement("a");
    newChild.href = "../movie.html?level=" + (index+1);
    // let levelDate = new Date(STARTING_DATE)
    // levelDate.setDate(levelDate.getDate() + index);
    // let dateString = levelDate.getDate() + "/" + (levelDate.getMonth()+1) + "/" + levelDate.getFullYear()
    // newChild.innerHTML = `<div class="level ${COMPLETED_LEVELS.includes(level) ? 'completed' : ''}">Level ${index+1} - ${dateString}</div>`;
    newChild.innerHTML = `<div class="level ${COMPLETED_LEVELS.includes(level) ? 'completed' : ''}">${index+1}</div>`;
    // if (levelDate > NOW) newChild.classList.add("disabled");
    levelContainer.appendChild(newChild);
}

function addShowLevel(level, index) {
    const newChild = document.createElement("a");
    newChild.href = "../show.html?level=" + (index+1);
    newChild.innerHTML = `<div class="level ${COMPLETED_LEVELS.includes(level) ? 'completed' : ''}">${index+1}</div>`;
    levelContainer.appendChild(newChild);
}

function switchLevelType(type) {
    if (type == "movie") {
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
    } else if (type == "show") {
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

switchLevelType("movie")