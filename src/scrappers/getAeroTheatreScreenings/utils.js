require("dotenv").config();
const { 
	END_DAY, 
	START_DAY, 
	SELECTORS,
	EVENT_LIST_CARD_SELECTOR 
} = require("./constants");

const getUrl = (DAY) => {
	const { MONTH, YEAR } = SELECTORS;
	return "https://www.americancinematheque.com/now-showing/?event_location=54&event_location=55&event_location=102" +
	`&start=${YEAR}.${MONTH}.${DAY}&end=${YEAR}.${MONTH}.${DAY}&view_type=list`;
};

const getScreeningUrls = async (page) => {	
	const screeningsUrls = [];
	// get screening urls for each day
	for (let day = START_DAY; day <= END_DAY; day++) {
		await page.goto(
			getUrl(day),
			{ waitUntil: "networkidle0" }
		);	
		// get screenings for the day
		const dayScreeningUrls = await page.$$eval(
			EVENT_LIST_CARD_SELECTOR,
			elements => elements.map(anchor => anchor.getAttribute("href"))
		);
		console.log(dayScreeningUrls);
		screeningsUrls.push(...dayScreeningUrls);
	}
	
	return screeningsUrls;
};

const getScreeningDetails = (screeningUrl, selectors) => {
	const {
		MONTH, YEAR, TITLE_SELECTOR, POSTER_SELECTOR,
		LOCATION_SELECTOR, DATE_SELECTOR,
		TIME_SELECTOR, SINGLE_DESCRIPTION_SELECTOR,
		SINGLE_DIRECTOR_SELECTOR, DOUBLE_FIRST_SELECTOR,
		DOUBLE_SECOND_SELECTOR
	} = selectors;

	const title = document.querySelector(TITLE_SELECTOR).textContent;
	const time = document.querySelector(TIME_SELECTOR).textContent.replace(/\s/g, '');
	const poster = document.querySelector(POSTER_SELECTOR).getAttribute("src");
	// get day
	const date = document.querySelector(DATE_SELECTOR).textContent;
	const indexOfComma = date.indexOf(","); // SUN JANUARY 9, 2022
	const day = Number(date.slice(indexOfComma - 2, indexOfComma)); 
	// get location
	const theater = document.querySelector(LOCATION_SELECTOR).textContent; // Los Feliz 3 | New Restoration
	const location = theater.slice(0, theater.indexOf("|")).trim();

	const createScreeningEvent = (screeningTitle, director, isDoubleFeature = true, screeningDescription = null) => {
		return {
			title: screeningTitle,
			director,
			time,
			links: {
				trailer: screeningUrl,
				info: screeningUrl,
			},
			poster,
			description: screeningDescription ? screeningDescription : "This is a double feature, check screening page for more details!",
			date: {
				day,
				month: MONTH,
				year: YEAR
			},
			location,
			isDoubleFeature
		};
	};
	
	if (title.includes("/")) {
		// i. e. BILLIE EILISH: THE WORLD’S A LITTLE BLURRY, 2021, Apple TV+, 140 min. Dir. R. J. Cutler.  
		const firstFeatureElement = document.querySelector(DOUBLE_FIRST_SELECTOR);
		const secondFeatureElement = document.querySelector(DOUBLE_SECOND_SELECTOR);

		if (!firstFeatureElement || !secondFeatureElement) {
			const [firstTitle, secondTitle] = title.split("/").map(item => item.trim());
			const firstScreening = createScreeningEvent(firstTitle, "_");
			const secondScreening = createScreeningEvent(secondTitle, "_");
			return [firstScreening, secondScreening];
		}
		// extract text contents
		const firstFeature = firstFeatureElement.textContent;
		const secondFeature = secondFeatureElement.textContent;

		// extract titles
		const firstFeatureTitle = firstFeature.slice(0, firstFeature.indexOf(","));
		const secondFeatureTitle = secondFeature.slice(0, secondFeature.indexOf(","));
		// extra directors
		const firstFeatureDirector = firstFeature.slice(firstFeature.indexOf("Dir") + 4).trim();
		const secondFeatureDirector = secondFeature.slice(secondFeature.indexOf("Dir") + 4).trim();

		const firstScreening = createScreeningEvent(firstFeatureTitle, firstFeatureDirector);
		const secondScreening = createScreeningEvent(secondFeatureTitle, secondFeatureDirector);

		return [firstScreening, secondScreening];
	}
	else {
		const description = document.querySelector(SINGLE_DESCRIPTION_SELECTOR).textContent;
		let director = document.querySelector(SINGLE_DIRECTOR_SELECTOR).textContent;

		if (director.includes(":"))
			director = director.slice(director.indexOf(":") + 2);
		if (director.includes(","))
			director = director.slice(director.indexOf(",") + 2);

		return [createScreeningEvent(title, director, false, description)];
	}
};

module.exports = { getScreeningUrls, getScreeningDetails };