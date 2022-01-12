module.exports = { 
	INITIAL_URL: "https://thenewbev.com/schedule/",
	EVENT_CARD_SELECTOR: "section.events .event-card > a",
	SCREENING_SELECTOR: "section.movies .movie",
	TIME_SELECTOR: "div.movie-mast__titles .movie-mast__times",
	SELECTORS: {
		MONTH: 1,
		YEAR: 2022,
		TITLE_SELECTOR: ".movie__content h2.movie__title", 							
		DIRECTOR_SELECTOR: ".movie__content .movie__details dd",						
		DESCRIPTION_SELECTOR: ".movie__content > p:last-of-type",					
		POSTER_SELECTOR: ".movie__img figure.movie__poster > img",				
		TRAILER_SELECTOR: ".movie__content .movie__ctas a:nth-child(1)",	
		DATE_SELECTOR: "div.movie-mast__posters .movie-mast__dates",
	}
};