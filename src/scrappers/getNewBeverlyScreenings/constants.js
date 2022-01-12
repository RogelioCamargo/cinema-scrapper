module.exports = { 
	INITIAL_URL: "https://thenewbev.com/schedule/",
	SELECTORS : {
		EVENT_CARD: "section.events .event-card",
		SCREENING: "section.movies .movie",
		TITLE: ".movie__content h2.movie__title",
		DIRECTOR: ".movie__content .movie__details dd",
		POSTER: ".movie__img figure.movie__poster > img",
		TRAILER: ".movie__content .movie__ctas a:nth-child(1)",
		DESCRIPTION: ".movie__content > p:last-of-type",
		DATE: "div.movie-mast__posters .movie-mast__dates"
	}
};