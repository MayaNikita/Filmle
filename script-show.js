// DOM Elements
const poster_conteiner = document.getElementById("poster");
const cast = document.getElementById("cast");
const plotElement = document.getElementById("plot");
const castElement = document.getElementById("cast");
const genreElement = document.getElementById("genre");
const directorElement = document.getElementById("director");

const LEVEL = Number(new URLSearchParams(window.location.search).get('level'));
const RANDOM_MODE = LEVEL ? false : true;

let FILMLIST = [];
// Fetch film-list
fetch("lists/shows.txt")
  .then((res) => res.text())
  .then((text) => {
    FILMLIST = text.split(/\r?\n/);
    chooseFilm();
    init();
    fillDropdown();
   })
  .catch((e) => console.error(e));
const API_KEY = "6ff55c56";

let FILM = {};
let FILM_NAME = "";
let guesses = 0;
let guessedPlotArray = [];

document.oncontextmenu = new Function("return false;");

function fillDropdown() {
    const list = document.getElementById("filmlist");
    let sortedList = [...FILMLIST].sort();
    sortedList.forEach(function (item) {
        var option = document.createElement("option");
        option.value = item;
        list.appendChild(option);
    });
}

function chooseFilm() {
    if (RANDOM_MODE) FILM_NAME = FILMLIST[Math.floor(Math.random() * FILMLIST.length)];
    else FILM_NAME = FILMLIST[LEVEL - 1];
}

async function init() {
    // Trigger submit on button click
    const button = document.getElementById("myCheck");
    button.addEventListener("click", (event) => {
        submitGuess();
    });

    // Trigger submit on enter pressed
    document.getElementById("search").addEventListener("keyup", (event) => {
        event.preventDefault();
        if (event.keyCode === 13) submitGuess();
    });

    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&t=${FILM_NAME}&plot=full`;
    try {
        const response = await fetch(url);
        FILM = await response.json();

        // Add Genre-Chips
        const genreArray = FILM.Genre.split(", ");
        genreArray.forEach(function (item) {
            const newChild = document.createElement("div");
            newChild.innerHTML = `<p class="chip">???</p>`;
            genreElement.appendChild(newChild);
        });

        // Add Genre-Chips
        const directorArray = FILM.Writer.split(", ");
        directorArray.forEach(function (item) {
            const newChild = document.createElement("div");
            newChild.innerHTML = `<p class="chip">???</p>`;
            directorElement.appendChild(newChild);
        });

        // Add Cast-Chips
        const castArray = FILM.Actors.split(", ");
        castArray.forEach(function (item) {
            const newChild = document.createElement("div");
            newChild.innerHTML = `<p class="chip">???</p>`;
            castElement.appendChild(newChild);
        });

        // Add Plot
        const plotArray = FILM.Plot.split(" ");
        let plotString = "";
        plotArray.forEach(function (item) {
            plotString += `<span class="hidden-word">${item}</span>`;
            plotString += ` `;
        });

        plotElement.innerHTML = plotString;

        poster_conteiner.innerHTML = `<img id="poster_img" src="${FILM.Poster}">`;
        loadLevelProgress();
        setGuessesLeft();

        let completedShows = JSON.parse(localStorage.getItem("completedShows")) ?? [];
        if (!RANDOM_MODE && completedShows.find((item) => item.name == FILM_NAME)) {
            guesses = completedShows.find((item) => item.name == FILM_NAME).guesses-1;
            document.getElementById("search").value = FILM_NAME;
            submitGuess();
        };
    } catch (error) {
        return false;
    }
}

async function submitGuess() {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&t=${document.getElementById("search").value}&plot=full`;
    try {
        // daten von der API laden
        const response = await fetch(url);
        const data = await response.json();

        guesses++;
        const poster_img = document.querySelector("#poster_img");
        poster_img.style.filter = `blur(${25 - guesses * 2.5}px) grayscale(${100 - guesses * 10}%)`;
        if (FILM.Title == data.Title) poster_img.style.filter = `blur(0px) grayscale(0%)`;

        // Check Genre-Chips
        const genreArray = data.Genre.split(", ");
        genreArray.forEach(function (item) {
            if (FILM.Genre.includes(item)) {
                genreElement.querySelectorAll(".chip")[FILM.Genre.split(", ").indexOf(item)].innerHTML = `${item}`;
                genreElement.querySelectorAll(".chip")[FILM.Genre.split(", ").indexOf(item)].classList.add("success");
            }
        });

        // Check Director-Chips
        const directorArray = data.Writer.split(", ");
        directorArray.forEach(function (item) {
            if (FILM.Writer.includes(item)) {
                directorElement.querySelectorAll(".chip")[FILM.Writer.split(", ").indexOf(item)].innerHTML = `${item}`;
                directorElement.querySelectorAll(".chip")[FILM.Writer.split(", ").indexOf(item)].classList.add("success");
            }
        });
    

        // Check Cast-Chips
        const castArray = data.Actors.split(", ");
        castArray.forEach(function (item) {
            if (FILM.Actors.includes(item)) {
                castElement.querySelectorAll(".chip")[FILM.Actors.split(", ").indexOf(item)].innerHTML = `${item}`;
                castElement.querySelectorAll(".chip")[FILM.Actors.split(", ").indexOf(item)].classList.add("success");
            }
        });


        // Check Year
        const guessedYear = Number(data.Year.split("–")[0]);
        const actualYear = Number(FILM.Year.split("–")[0]);

        if (guessedYear == actualYear) {
            document.getElementById("year").innerHTML = `${actualYear}`;
            document.getElementById("year").classList.add("success");
            document.getElementById("year-lower-than").innerHTML = ``;
            document.getElementById("year-higher-than").innerHTML = ``;
        }
        if (actualYear < guessedYear) {
            if (document.getElementById("year-lower-than").innerHTML.includes("????") || document.getElementById("year-lower-than").innerHTML.split(" ")[1] > data.Year) {
                document.getElementById("year-lower-than").innerHTML = `↓ ${guessedYear}`;
                if (guessedYear - actualYear <= 5) document.getElementById("year-lower-than").classList.add("close-range");
                playBounceAnimation("year-lower-than");
            }
        }
        if (actualYear > guessedYear) {
            if (document.getElementById("year-higher-than").innerHTML.includes("????") || document.getElementById("year-higher-than").innerHTML.split(" ")[1] < data.Year) {
                document.getElementById("year-higher-than").innerHTML = `↑ ${guessedYear}`;
                if (actualYear - guessedYear <= 5) document.getElementById("year-higher-than").classList.add("close-range");
                playBounceAnimation("year-higher-than");
            }
        }

        // Check Seasons
        const guessedSeasons = Number(data.totalSeasons.split(" ")[0]);
        const actualSeasons = Number(FILM.totalSeasons.split(" ")[0]);

        if (actualSeasons == guessedSeasons) {
            document.getElementById("seasons").innerHTML = `${FILM.totalSeasons}`;
            document.getElementById("seasons").classList.add("success");
            document.getElementById("seasons-lower-than").innerHTML = ``;
            document.getElementById("seasons-higher-than").innerHTML = ``;
        }
        if (actualSeasons < guessedSeasons) {
            if (document.getElementById("seasons-lower-than").innerHTML.includes("????") || Number(document.getElementById("seasons-lower-than").innerHTML.split(" ")[1]) > guessedSeasons) {
                document.getElementById("seasons-lower-than").innerHTML = `↓ ${data.totalSeasons}`;
                if (guessedSeasons - actualSeasons <= 2) document.getElementById("seasons-lower-than").classList.add("close-range");
                playBounceAnimation("seasons-lower-than");
            }
        }
        if (actualSeasons > guessedSeasons) {
            if (document.getElementById("seasons-higher-than").innerHTML.includes("????") || Number(document.getElementById("seasons-higher-than").innerHTML.split(" ")[1]) < guessedSeasons) {
                document.getElementById("seasons-higher-than").innerHTML = `↑ ${data.totalSeasons}`;
                if (guessedSeasons - actualSeasons <= 2) document.getElementById("seasons-higher-than").classList.add("close-range");
                playBounceAnimation("seasons-higher-than");
            }
        }

        // Check Rating
        if (FILM.imdbRating == data.imdbRating) {
            document.getElementById("rating").innerHTML = `${FILM.imdbRating}`;
            document.getElementById("rating").classList.add("success");
            document.getElementById("rating-lower-than").innerHTML = ``;
            document.getElementById("rating-higher-than").innerHTML = ``;
        }
        if (FILM.imdbRating < data.imdbRating) {
            if (document.getElementById("rating-lower-than").innerHTML.includes("????") || document.getElementById("rating-lower-than").innerHTML.split(" ")[1] > data.imdbRating) {
                document.getElementById("rating-lower-than").innerHTML = `↓ ${data.imdbRating}`;
                if (FILM.imdbRating - data.imdbRating <= 0.5) document.getElementById("rating-lower-than").classList.add("close-range");
                playBounceAnimation("rating-lower-than");
            }
        }
        if (FILM.imdbRating > data.imdbRating) {
            if (document.getElementById("rating-higher-than").innerHTML.includes("????") || document.getElementById("rating-higher-than").innerHTML.split(" ")[1] < data.imdbRating) {
                document.getElementById("rating-higher-than").innerHTML = `↑ ${data.imdbRating}`;
                if (FILM.imdbRating - data.imdbRating <= 0.5) document.getElementById("rating-higher-than").classList.add("close-range");
                playBounceAnimation("rating-higher-than");
            }
        }

        // Check Plot
        data.Plot.split(" ").forEach(function (item, i) {
            if (!guessedPlotArray.includes(item)) guessedPlotArray.push(item.toLocaleLowerCase());
        });
        let plotString = "";

        FILM.Plot.split(" ").forEach(function (item, i) {
            if (guessedPlotArray.includes(item.toLocaleLowerCase())) plotString += `${item}`;
            else plotString += `<span class="hidden-word">${item}</span>`;
            plotString += ` `;
        });

        plotElement.innerHTML = plotString;

        setGuessesLeft(FILM.Title == data.Title);

        document.getElementById("search").value = "";

        document.querySelectorAll(".x")[guesses - 1].classList.remove("bounce");
        document.querySelectorAll(".x")[guesses - 1].offsetWidth;
        document.querySelectorAll(".x")[guesses - 1].classList.add("bounce");

        storeLevelProgress();

    } catch (error) {
        return false;
    }
}

function playBounceAnimation(elementId) {
    document.getElementById(elementId).classList.remove("bounce");
    document.getElementById(elementId).offsetWidth;
    document.getElementById(elementId).classList.add("bounce");
}

function setGuessesLeft(win = false) {
    let guessesLeftSting = "";
    for (let i = 0; i < guesses; i++) {
        if (win && i == guesses-1) guessesLeftSting += `<div class="check-mark"></div>`;
        else guessesLeftSting += `<div class="x"></div>`;
    }
    for (let i = 0; i < 10 - guesses; i++) {
        guessesLeftSting += `<div class="dot"></div>`;
    }
    document.getElementById("guesses-left").innerHTML = guessesLeftSting;

    if (win) {
        if (!RANDOM_MODE) {
            let completedShows = JSON.parse(localStorage.getItem("completedShows")) ?? [];            
            if (!completedShows.find((item) => item.name == FILM_NAME)) completedShows.push({name: FILM_NAME, guesses: guesses});
            localStorage.setItem("completedShows", JSON.stringify(completedShows));

            let startedLevels = JSON.parse(localStorage.getItem("startedShows")) ?? [];
            if (startedLevels.find((item) => item.name == FILM_NAME)) {
                startedLevels = startedLevels.filter((item) => item.name != FILM_NAME);
                localStorage.setItem("startedShows", JSON.stringify(startedLevels));
            }
        }

        document.getElementById("answer-container").innerHTML = `<p>The show was <b>${FILM.Title}</b>!</p>`;
        playBounceAnimation("answer-container");
        if (RANDOM_MODE) document.getElementById("search-container").innerHTML = `<button class="play-next" onclick="window.location.reload()">Play next</button>`;
        else document.getElementById("search-container").innerHTML = `<a href="/show.html?level=${LEVEL+1}"><button class="play-next">Play next</button></a>`;
    } else if (guesses > 0) {
        document.getElementById("search-container").classList.remove("wrong");
        document.getElementById("search-container").offsetWidth;
        document.getElementById("search-container").classList.add("wrong");
    }
}

function storeLevelProgress() {
    let startedLevels = JSON.parse(localStorage.getItem("startedShows")) ?? [];

    let levelProgress = {
        name: FILM_NAME,
        guesses: guesses,
        data: {
            genreElement: genreElement.innerHTML,
            directorElement: directorElement.innerHTML,
            castElement: castElement.innerHTML,
            plotElement: plotElement.innerHTML,
            yearElement: document.getElementById("year-container").innerHTML,
            seasonsElement: document.getElementById("seasons-container").innerHTML,
            ratingElement: document.getElementById("rating-container").innerHTML,
        }
    };

    if (startedLevels.find((item) => item.name == FILM_NAME)) startedLevels = startedLevels.filter((item) => item.name != FILM_NAME);
    startedLevels.push(levelProgress);

    localStorage.setItem("startedShows", JSON.stringify(startedLevels));
}

function loadLevelProgress() {
    let startedLevels = JSON.parse(localStorage.getItem("startedShows")) ?? [];
    let levelProgress = startedLevels.find((item) => item.name == FILM_NAME);
    if (levelProgress) {
        guesses = levelProgress.guesses;

        genreElement.innerHTML = levelProgress.data.genreElement;
        directorElement.innerHTML = levelProgress.data.directorElement;
        castElement.innerHTML = levelProgress.data.castElement;
        plotElement.innerHTML = levelProgress.data.plotElement;
        document.getElementById("year-container").innerHTML = levelProgress.data.yearElement;
        document.getElementById("seasons-container").innerHTML = levelProgress.data.seasonsElement;
        document.getElementById("rating-container").innerHTML = levelProgress.data.ratingElement;
        
        const poster_img = document.querySelector("#poster_img");        
        poster_img.style.filter = `blur(${25 - guesses * 2.5}px) grayscale(${100 - guesses * 10}%)`;
    }
}