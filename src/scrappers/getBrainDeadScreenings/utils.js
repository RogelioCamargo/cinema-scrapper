const getScreeningUrls = (SCREENING_URL_SELECTOR, BASE_URL) => {
	// get an array of clickable screening events
	return Array.from(document.querySelectorAll(SCREENING_URL_SELECTOR))
		// get array of just their routing attribute "/screening/,14999"
		.map(screening => screening.getAttribute("ng-reflect-router-link"))
		// remove commas to get valid url
		.map(string => string.replace(/,/g,''))
		// add base and subdirectory to get full screening url
		.map(subdirectory => BASE_URL + subdirectory);
};

const getScreeningDetails = (
	TITLE_SELECTOR, DIRECTOR_SELECTOR, DISCRIPTON_SELECTOR,
	POSTER_SELECTOR, TIME_DATE_SELECTOR, TRAILER_SELECTOR
) => {
	const title = document.querySelector(TITLE_SELECTOR).textContent;
	const director = document.querySelector(DIRECTOR_SELECTOR).textContent;
	const description = document.querySelector(DISCRIPTON_SELECTOR).textContent;
	const showtime = document.querySelector(TIME_DATE_SELECTOR).textContent;
	const poster = document.querySelector(POSTER_SELECTOR).getAttribute("src");
	const trailer = document.querySelector(TRAILER_SELECTOR).getAttribute("href");

	return { title, director, description, showtime, poster, trailer };
};

const updateScreeningDetails = (screeningDetails, screeningUrl) => {
	const { title, description, showtime, poster, trailer } = screeningDetails;

	const [date, time] = showtime.split(",").map(string => string.trim());
	const [day, month, year] = date.split("-");
	const director = screeningDetails.director.slice(10);

	return { 
		title, 
		director, 
		time, 
		links: { 
			trailer, 
			info: screeningUrl 
		}, 
		poster, 
		description,
		date: { 
			day: Number(day), 
			month: Number(month), 
			year: Number(year)
		}, 
		location: "Brain Dead Studios",
		isDoubleFeature: false
	};
};

module.exports = { 
	getScreeningUrls, 
	getScreeningDetails, 
	updateScreeningDetails 
};

