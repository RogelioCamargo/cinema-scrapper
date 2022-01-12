require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs-extra");

// CONSTANTS
const { 
	BASE_URL, 
	INITIAL_URL, 
	SCREENING_URL_SELECTOR,
	DETAILS
} = require("./constants");
// UTILS
const { 
	getScreeningUrls, 
	getScreeningDetails, 
	updateScreeningDetails 
} = require("./utils");

const getBrainDeadScreenings = async () => {
	try {
		// set up brower
		const browser = await puppeteer.launch({ 
			defaultViewport: null,
    	headless: true 
		});
		const page = await browser.newPage();
		await page.setUserAgent(process.env.USER_AGENT);

		// go to calander page
		await page.goto(INITIAL_URL, { waitUntil: "networkidle0" });

		const SCREENING_URLS = await page.evaluate(
			getScreeningUrls, 
			SCREENING_URL_SELECTOR, BASE_URL
		);

		const BRAIN_DEAD_SCREENINGS = [];

		for (let i = 0; i < SCREENING_URLS.length; i++) {
			// go to screening info page
			await page.goto(SCREENING_URLS[i], { waitUntil: "networkidle0" });

			// get screening details
			const screeningDetails = await page.evaluate(
				getScreeningDetails, 
				...DETAILS
			);
			// properly format details
			const formattedScreeningDetails = updateScreeningDetails(
				screeningDetails, SCREENING_URLS[i]
			);
			
			// console.log(formattedScreeningDetails.title);

			BRAIN_DEAD_SCREENINGS.push(formattedScreeningDetails);
		}
		
		// save data to json file
		await fs.writeFile(
			"./data/BRAINDEAD_SCREENINGS.json", 
			JSON.stringify(BRAIN_DEAD_SCREENINGS, null, 3)
		);

		// close browser
		await browser.close();
	} catch (error) {
		console.log(error);
	}
};

module.exports = { getBrainDeadScreenings };