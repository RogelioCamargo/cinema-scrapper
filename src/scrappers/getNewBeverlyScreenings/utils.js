const getScreeningUrls = (EVENT_CARD_SELECTOR) => {
	return Array.from(document.querySelectorAll(EVENT_CARD_SELECTOR))
		.map(screening => screening.getAttribute("href"));
};

const getScreeningTimes = (TIME_SELECTOR) => {
	return Array.from(document.querySelectorAll(TIME_SELECTOR))
		.map(element => element.textContent
		.trim()
		.replace(/\s/g, '')
		.toUpperCase());
};

const getScreeningDetails = (
	screening, details, selectors
) => {
	const { 
		MONTH, YEAR, TITLE_SELECTOR, 
		DIRECTOR_SELECTOR, DESCRIPTION_SELECTOR, 
		POSTER_SELECTOR, TRAILER_SELECTOR,
		DATE_SELECTOR 
	} = selectors;
	const { screeningUrl, time, isDoubleFeature } = details;

	const date = document.querySelector(DATE_SELECTOR).textContent;
	const indexOfComma = date.indexOf(",");
	const day = Number(date.slice(indexOfComma - 2, indexOfComma));

	const title = screening.querySelector(TITLE_SELECTOR).textContent;
	const director = screening.querySelector(DIRECTOR_SELECTOR).textContent;
	const description = screening.querySelector(DESCRIPTION_SELECTOR).textContent;
	const poster = screening.querySelector(POSTER_SELECTOR).getAttribute("src");
	const trailer = screening.querySelector(TRAILER_SELECTOR).getAttribute("href");

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
			day,
			month: MONTH,
			year: YEAR
		}, 
		location: "New Beverly Cinema",
		isDoubleFeature
	};
};

module.exports = { getScreeningUrls, getScreeningTimes, getScreeningDetails };