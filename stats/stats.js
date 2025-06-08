const COMPLETED_FILMS = JSON.parse(localStorage.getItem("completedFilms")) ?? [];
const COMPLETED_SHOWS = JSON.parse(localStorage.getItem("completedShows")) ?? [];

let totalFilmLevels = 0;
let totalShowLevels = 0;
const filmsPlayedElement = document.getElementById("films-played")
const showsPlayedElement = document.getElementById("shows-played")
const filmsAverageGuesses = document.getElementById("films-average-guesses")
const showsAverageGuesses = document.getElementById("shows-average-guesses")

fetch("../lists/movies.txt")
  .then((res) => res.text())
  .then((text) => {    
    totalFilmLevels = text.split(/\r?\n/).length;
    setFilmStats();
   })
  .catch((e) => console.error(e));

fetch("../lists/shows.txt")
  .then((res) => res.text())
  .then((text) => {    
    totalShowLevels = text.split(/\r?\n/).length;
    setShowStats();
   })
  .catch((e) => console.error(e));

function setFilmStats() {  
    filmsPlayedElement.innerHTML = `${COMPLETED_FILMS.length}/${totalFilmLevels} (${rouundToTwoDecimals((100/totalFilmLevels)*COMPLETED_FILMS.length)}%)`;
    filmsAverageGuesses.innerHTML = `${rouundToTwoDecimals(COMPLETED_FILMS.reduce((acc, film) => acc + film.guesses, 0) / COMPLETED_FILMS.length)}`
    prepareGraph("film-graph", COMPLETED_FILMS);
}

function setShowStats() {  
    showsPlayedElement.innerHTML = `${COMPLETED_SHOWS.length}/${totalShowLevels} (${rouundToTwoDecimals((100/totalShowLevels)*COMPLETED_SHOWS.length)}%)`;
    showsAverageGuesses.innerHTML = `${rouundToTwoDecimals(COMPLETED_SHOWS.reduce((acc, show) => acc + show.guesses, 0) / COMPLETED_SHOWS.length)}`
	prepareGraph("show-graph", COMPLETED_SHOWS);
}

function prepareGraph(graphElementId, list) {
    const graph = document.getElementById(graphElementId);
	  const graphBars = graph.querySelector(".graph-bars");
   	const graphLegend = graph.querySelector(".graph-legend");

   	let guessCounter = [{1:0}, {2:0}, {3:0}, {4:0}, {5:0}, {6:0}, {7:0}, {8:0}, {9:0}, {10:0}];
	   list.forEach(film => {
        guessCounter[film.guesses-1][film.guesses] += 1;
    });
    let maxCount = Math.max(...guessCounter.map(obj => Object.values(obj)[0]));
    
   for (let i = 0; i < 10; i++) {    
       const bar = document.createElement("div");
       bar.classList.add("bar");
       let countGuesses = list.filter(film => film.guesses === i+1).length;
       bar.style.height = `${(100/maxCount)*countGuesses}%`;
       graphBars.appendChild(bar);

       const legend = document.createElement("div");
       legend.classList.add("legend");
       legend.innerText = i+1;
       graphLegend.appendChild(legend);
   }
}

function rouundToTwoDecimals(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}