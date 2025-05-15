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
fetch("lists/movies.txt")
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
        const directorArray = FILM.Director.split(", ");
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
        setGuessesLeft();

        let completedFilms = JSON.parse(localStorage.getItem("completedFilms")) ?? [];
        if (!RANDOM_MODE && completedFilms.find((item) => item.name == FILM_NAME)) {
            guesses = completedFilms.find((item) => item.name == FILM_NAME).guesses-1;
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

        const poster_img = document.querySelector("#poster_img");
        poster_img.style.filter = `blur(${25 - guesses * 2.5}px) grayscale(${100 - guesses * 10}%)`;
        if (FILM.Title == data.Title) {
            poster_img.style.filter = `blur(0px) grayscale(0%)`;
        }
        guesses++;

        // Check Genre-Chips
        const genreArray = data.Genre.split(", ");
        genreArray.forEach(function (item) {
            if (FILM.Genre.includes(item)) {
                genreElement.querySelectorAll(".chip")[FILM.Genre.split(", ").indexOf(item)].innerHTML = `${item}`;
                genreElement.querySelectorAll(".chip")[FILM.Genre.split(", ").indexOf(item)].classList.add("success");
            }
        });

        // Check Director-Chips
        const directorArray = data.Director.split(", ");
        directorArray.forEach(function (item) {
            if (FILM.Director.includes(item)) {
                directorElement.querySelectorAll(".chip")[FILM.Director.split(", ").indexOf(item)].innerHTML = `${item}`;
                directorElement.querySelectorAll(".chip")[FILM.Director.split(", ").indexOf(item)].classList.add("success");
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
        if (FILM.Year == data.Year) {
            document.getElementById("year").innerHTML = `${FILM.Year}`;
            document.getElementById("year").classList.add("success");
            document.getElementById("year-lower-than").innerHTML = ``;
            document.getElementById("year-higher-than").innerHTML = ``;
        }
        if (FILM.Year < data.Year) {
            if (document.getElementById("year-lower-than").innerHTML.includes("????") || document.getElementById("year-lower-than").innerHTML.split(" ")[1] > data.Year) {
                document.getElementById("year-lower-than").innerHTML = `↓ ${data.Year}`;
                if (data.Year - FILM.Year <= 5) document.getElementById("year-lower-than").classList.add("close-range");
                playBounceAnimation("year-lower-than");
            }
        }
        if (FILM.Year > data.Year) {
            if (document.getElementById("year-higher-than").innerHTML.includes("????") || document.getElementById("year-higher-than").innerHTML.split(" ")[1] < data.Year) {
                document.getElementById("year-higher-than").innerHTML = `↑ ${data.Year}`;
                if (FILM.Year - data.Year <= 5) document.getElementById("year-higher-than").classList.add("close-range");
                playBounceAnimation("year-higher-than");
            }
        }

        // Check Runtime
        const guessedRuntime = Number(data.Runtime.split(" ")[0]);
        const actualRuntime = Number(FILM.Runtime.split(" ")[0]);

        if (actualRuntime == guessedRuntime) {
            document.getElementById("runtime").innerHTML = `${FILM.Runtime}`;
            document.getElementById("runtime").classList.add("success");
            document.getElementById("runtime-lower-than").innerHTML = ``;
            document.getElementById("runtime-higher-than").innerHTML = ``;
        }
        if (actualRuntime < guessedRuntime) {
            if (document.getElementById("runtime-lower-than").innerHTML.includes("????") || Number(document.getElementById("runtime-lower-than").innerHTML.split(" ")[1]) > guessedRuntime) {
                document.getElementById("runtime-lower-than").innerHTML = `↓ ${data.Runtime}`;
                if (guessedRuntime - actualRuntime <= 15) document.getElementById("runtime-lower-than").classList.add("close-range");
                playBounceAnimation("runtime-lower-than");
            }
        }
        if (actualRuntime > guessedRuntime) {
            if (document.getElementById("runtime-higher-than").innerHTML.includes("????") || Number(document.getElementById("runtime-higher-than").innerHTML.split(" ")[1]) < guessedRuntime) {
                document.getElementById("runtime-higher-than").innerHTML = `↑ ${data.Runtime}`;
                if (guessedRuntime - actualRuntime <= 15) document.getElementById("runtime-higher-than").classList.add("close-range");
                playBounceAnimation("runtime-higher-than");
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
            let completedFilms = JSON.parse(localStorage.getItem("completedFilms")) ?? [];
            if (!completedFilms.find((item) => item.name == FILM_NAME)) completedFilms.push({name: FILM_NAME, guesses: guesses});
            localStorage.setItem("completedFilms", JSON.stringify(completedFilms));
        }

        document.getElementById("answer-container").innerHTML = `<p>The movie was <b>${FILM.Title}</b>!</p>`;
        playBounceAnimation("answer-container");
        if (RANDOM_MODE) document.getElementById("search-container").innerHTML = `<button class="play-next" onclick="window.location.reload()">Play next</button>`;
        else document.getElementById("search-container").innerHTML = `<a href="/movie.html?level=${LEVEL+1}"><button class="play-next">Play next</button></a>`;
    } else if (guesses > 0) {
        document.getElementById("search-container").classList.remove("wrong");
        document.getElementById("search-container").offsetWidth;
        document.getElementById("search-container").classList.add("wrong");
    }
}