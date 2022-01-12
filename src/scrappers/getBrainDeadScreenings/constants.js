module.exports = { 
	BASE_URL: "https://studios.wearebraindead.com",
	INITIAL_URL: "https://studios.wearebraindead.com/screening/0",
	SCREENING_URL_SELECTOR: ".screening-calendar-ul .screening-calendar-screening-p", 
	DETAILS: [
		"div.movie-detail .movie-detail-info h1.movie-detail-title", 				 // TITLE_SELECTOR
		"div.movie-detail .movie-detail-info .movie-detail-director > span", // DIRECTOR_SELECTOR
		"div.movie-detail .movie-detail-info .movie-detail-description", 		 // DESCRIPTION_SELECTOR
		"div.movie-detail img.movie-detail-img", 														 // POSTER_SELECTOR
		"div.movie-detail .movie-detail-info .showtimes-li > p", 						 // TIME_DATE_SELECTOR
		"div.movie-detail .movie-detail-info a.movie-detail-trailer" 				 // TRAILER_SELECTOR
	]
};