// DOM Elements
const poster_conteiner = document.getElementById("poster");
const title = document.getElementById("title");
const cast = document.getElementById("cast");
const plotElement = document.getElementById("plot");
const castElement = document.getElementById("cast");
const genreElement = document.getElementById("genre");
const directorElement = document.getElementById("director");

const FILMLIST = ["Breaking Bad", "Game of Thrones", "The Umbrella Academy", "Gravity Falls", "Black Mirror", "Love, Death & Robots", "Dark", "The Boys", "Invincible", "Rick and Morty", "The Walking Dead", "Stranger Things", "Arcane", "House", "The Big Bang Theory", "How I Met Your Mother", "Friends", "The Good Doctor", "The Office", "Avatar: The Last Airbender", "Adventure Time", "Better Call Saul", "Vikings", "House of Cards", "House of the Dragon", "Brooklyn Nine-Nine", "Sherlock", "The Queen's Gambit", "Beastars", "Moon Knight", "Andor", "The Mandalorian", "Alice in Borderland", "Cyberpunk: Edgerunners", "Narcos", "The Last of Us", "Neon Genesis Evangelion", "Squid Game", "Peaky Blinders", "Lost in Space", "Wednesday", "Regular Show", "The End of the F***ing World", "How to Sell Drugs Online (Fast)", "Sweet Tooth", "Scott Pilgrim Takes Off", "Helluva Boss", "BNA", "Phineas and Ferb", "South Park", "Family Guy", "The Simpsons", "Solar Opposites", "The Owl House"]

const API_KEY = "6ff55c56";

let FILM = {};
let guesses = 0;
let guessedPlotArray = [];

// Add film-list to dropdown
const list = document.getElementById("filmlist");
FILMLIST.forEach(function (item) {
    var option = document.createElement("option");
    option.value = item;
    list.appendChild(option);
});

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

    const url = `http://www.omdbapi.com/?apikey=${API_KEY}&t=${FILMLIST[Math.floor(Math.random() * FILMLIST.length)]}&plot=full`;
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
        title.innerHTML = `${FILM.Title}`;
    } catch (error) {
        return false;
    }
}

await init();

async function submitGuess() {
    const url = `http://www.omdbapi.com/?apikey=${API_KEY}&t=${document.getElementById("search").value}&plot=full`;
    try {
        // daten von der API laden
        const response = await fetch(url);
        const data = await response.json();

        console.log(data);
        const poster_img = document.querySelector("#poster_img");
        poster_img.style.filter = `blur(${25 - guesses * 2.5}px) grayscale(${100 - guesses * 10}%)`;
        if (FILM.Title == data.Title) poster_img.style.filter = `blur(0px) grayscale(0%)`;
        guesses++;

        // Check Genre-Chips
        const genreArray = data.Genre.split(", ");
        genreArray.forEach(function (item) {
            if (FILM.Genre.includes(item)) {
                genreElement.querySelectorAll(".chip")[FILM.Genre.split(", ").indexOf(item)].innerHTML = `
                ${item}
            `;
                genreElement.querySelectorAll(".chip")[FILM.Genre.split(", ").indexOf(item)].classList.add("success");
            }
        });

        // Check Director-Chips
        const directorArray = data.Writer.split(", ");
        directorArray.forEach(function (item) {
            if (FILM.Writer.includes(item)) {
                directorElement.querySelectorAll(".chip")[FILM.Writer.split(", ").indexOf(item)].innerHTML = `
                ${item}
            `;
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
        console.log(guessedYear, actualYear);

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

        document.getElementById("search-container").classList.remove("wrong");
        document.getElementById("search-container").offsetWidth;
        document.getElementById("search-container").classList.add("wrong");
        document.getElementById("search").value = "";
        document.getElementById("guesses-left").innerHTML = `${10 - guesses} guesses left`;
    } catch (error) {
        return false;
    }
}

function playBounceAnimation(elementId) {
    document.getElementById(elementId).classList.remove("bounce");
    document.getElementById(elementId).offsetWidth;
    document.getElementById(elementId).classList.add("bounce");
}
