// DOM Elements
const poster_conteiner = document.getElementById("poster");
const title = document.getElementById("title");
const cast = document.getElementById("cast");
const plotElement = document.getElementById("plot");
const castElement = document.getElementById("cast");
const genreElement = document.getElementById("genre");
const directorElement = document.getElementById("director");

const FILMLIST = ["How to Train Your Dragon", "Interstellar", "A Minecraft Movie", "The Boy and the Heron", "Dune: Part One", "Barbie", "Oppenheimer", "Back to the Future", "Star Wars", "My Neighbor Totoro", "Pretty Woman", "La La Land", "Toy Story", "Home Alone", "Jurassic Park", "The Lion King", "Titanic", "Princess Mononoke", "American Psycho", "Spirited Away", "Shrek", "The Lord of the Rings: The Fellowship of the Ring", "Ice Age", "Finding Nemo", "Pirates of the Caribbean: The Curse of the Black Pearl", "Madagascar", "Howl's Moving Castle", "Ratatouille", "Iron Man", "Raiders of the Lost Ark", "Up", "Shutter Island", "Avatar", "Tangled", "The Hunger Games", "Skyfall", "The Wolf of Wallstreet", "Frozen", "Inside Out", "The Martian", "Dunkirk", "Blade Runner 2049", "Spider-Man: Into the Spider-Verse", "Joker", "Tenet", "Encanto", "All Quiet on the Western Front", "The Super Mario Bros. Movie", "Alien", "The Godfather", "Marriage Story", "The Prestige", "The Truman Show", "Beauty and the Beast", "The Dark Knight", "Zootopia", "Deadpool", "Pulp Fiction", "Fight Club", "The Silence of the Lambs", "Jaws", "Ghostbusters", "Gladiator", "The Shining", "Avengers: Endgame", "Inception", 1917, "8 Mile", "A Clockwork Orange", "Arrival", "Casino Royale", "Catch Me If You Can", "No Country for Old Men", "Drive", "Die Hard", "Good Will Hunting", "Trainspotting", "In Time", "Lucy", "The Da Vinci Code", "Whiplash", "Split", "John Wick", "Schindler's List", "Saw", "Society of the Snow", "It", "Braveheart", "Brave", "Scarface", "Blade Runner", "Memento", "Her", "Psycho", "Casablanca", "The Pianist", "2001: A Space Odyssey", "Saving Private Ryan", "Vertigo", "The Green Mile", "The Terminator", "The Shawshank Redemption", "E.T. the Extra-Terrestrial", "Breakfast at Tiffany's", "Rocky", "Dirty Dancing", "Groundhog Day", "Snatch", "Bullet Train", "Mission: Impossible", "Moana", "Glass Onion", "Don't Look Up", "Jumanji", "The Polar Express", "Ghost in the Shell", "Valerian and the City of a Thousand Planets", "A Man Called Otto", "Suicide Squad", "The Platform", "Grave of the Fireflies", "Army of Thieves", "The Ballad of Buster Scruggs", "Brother Bear", "Night at the Museum", "The Maze Runner", "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe", "The Greatest Showman", "Mary Poppins"];

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
        const directorArray = data.Director.split(", ");
        directorArray.forEach(function (item) {
            if (FILM.Director.includes(item)) {
                directorElement.querySelectorAll(".chip")[FILM.Director.split(", ").indexOf(item)].innerHTML = `
                ${item}
            `;
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
