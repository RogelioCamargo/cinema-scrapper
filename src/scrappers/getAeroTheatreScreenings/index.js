const puppeteer = require("puppeteer");
const fs = require("fs-extra");

// CONSTANTS
const { 
	SELECTORS, 
	SCREENING_URLS 
} = require("./constants");
// UTILS
const { getScreeningUrls, getScreeningDetails } = require("./utils");

const getOnlyScreeningUrls = async () => {
	try {
		// set up browser
		const browser = await puppeteer.launch({ 
			defaultViewport: null,
    	headless: true 
		});
		const page = await browser.newPage();
		await page.setUserAgent(process.env.USER_AGENT);

		const screeningUrls = await getScreeningUrls(page);

		console.log(screeningUrls);

	} catch (error) {
		console.log(error);
	}
};

const getAeroTheaterScreenings = async () => {
	try {
		// set up browser
		const browser = await puppeteer.launch({ 
			defaultViewport: null,
    	headless: true 
		});
		const page = await browser.newPage();
		await page.setUserAgent(process.env.USER_AGENT);

		const AERO_THEATRE_SCREENINGS = [];

		for (let i = 0; i < SCREENING_URLS.length; i++) {
			// go to screening details page
			await page.goto(SCREENING_URLS[i], { waitUntil: "networkidle0" });

			// get all screening details
			const screeningDetails = await page.evaluate(
				getScreeningDetails, 
				SCREENING_URLS[i], 
				SELECTORS
			);

			screeningDetails.map(s => console.log(s.title));
			AERO_THEATRE_SCREENINGS.push(...screeningDetails);
		}
		
		await fs.writeFile('./data/AEROTHEATER_SCREENINGS.json', JSON.stringify(AERO_THEATRE_SCREENINGS, null, 3));

		await browser.close();
	} catch (error) {
		console.log(error);
	}
};

module.exports = { getOnlyScreeningUrls, getAeroTheaterScreenings };
