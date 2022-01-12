require('dotenv').config();
const puppeteer = require("puppeteer");
const fs = require("fs-extra");

// CONSTANTS
const {
	INITIAL_URL,
	EVENT_CARD_SELECTOR,
	SCREENING_SELECTOR,
	TIME_SELECTOR,
	SELECTORS
} = require("./constants");
// UTILS
const { 
	getScreeningUrls, 
	getScreeningTimes,
	getScreeningDetails
} = require("./utils");

const getBeverlyCinemaScreenings = async () => {
	try {
		// set up browser
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.setUserAgent(process.env.USER_AGENT);

		// go to calendar page
		await page.goto(INITIAL_URL, { waitUntil: "networkidle0" });

		// get all screening urls
		const screeningUrls = await page.evaluate(
			getScreeningUrls, 
			EVENT_CARD_SELECTOR
		);

		const NEW_BEVERLY_SCREENINGS = [];

		for (let i = 0; i < screeningUrls.length; i++) {
			// go to screening details page
			const screeningUrl = screeningUrls[i];
			await page.goto(screeningUrl, { waitUntil: "networkidle0" });
			
			// get all screenigs for the day
			const screenings = await page.$$(SCREENING_SELECTOR);

			// get time(s) of screening(s)
			const times = await page.evaluate(
				getScreeningTimes, 
				TIME_SELECTOR
			);

			for (let j = 0; j < screenings.length; j++) {
				const screening = screenings[j];
				
				const details = { 
					screeningUrl, 
					time: times[j], 
					isDoubleFeature: screenings.length > 1 
				};

				const screeningDetails = await page.evaluate(
					getScreeningDetails, 
					screening,
					details,
					SELECTORS,
				);

				console.log(screeningDetails.title);
				NEW_BEVERLY_SCREENINGS.push(screeningDetails);
			}
		}

		await fs.writeFile('./data/NEWBEVERLY_SCREENINGS.json', JSON.stringify(NEW_BEVERLY_SCREENINGS, null, 3));
		
		await browser.close();
	} catch (error) {
		console.log(error);
	}

};

module.exports = { getBeverlyCinemaScreenings };