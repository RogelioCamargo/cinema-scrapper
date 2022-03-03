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

	let title = screening.querySelector(TITLE_SELECTOR);
	title = title ? title.textContent : "TITLE NOT FOUND";

	let director = screening.querySelector(DIRECTOR_SELECTOR);
	director = director ? director.textContent : "DIRECTOR NOT FOUND";

	let description = screening.querySelector(DESCRIPTION_SELECTOR)
	description = description ? description.textContent : "DESCRIPTION NOT FOUND";

	let poster = screening.querySelector(POSTER_SELECTOR).getAttribute("src");
	let trailer = screening.querySelector(TRAILER_SELECTOR);
	if (trailer) trailer = trailer.getAttribute("href");

	return { 
		title, 
		director: director ? director : "", 
		time,
		links: {
			trailer: trailer ? trailer : "",
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