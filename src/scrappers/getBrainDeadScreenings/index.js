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
	formatScreeningDetails 
} = require("./utils");
const Screening = require("../../models/screening");

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

		// get all screening urls
		const SCREENING_URLS = await page.evaluate(
			getScreeningUrls, 
			SCREENING_URL_SELECTOR, BASE_URL
		);

		const BRAIN_DEAD_SCREENINGS = [];

		for (let i = 0; i < SCREENING_URLS.length; i++) {
			// go to screening details page
			await page.goto(SCREENING_URLS[i], { waitUntil: "networkidle0" });

			// get screening details
			const screeningDetails = await page.evaluate(
				getScreeningDetails, 
				...DETAILS
			);
			// properly format details
			const formattedScreeningDetails = formatScreeningDetails(
				screeningDetails, 
				SCREENING_URLS[i]
			);
			
			const newScreening = new Screening(formattedScreeningDetails);
			await newScreening.save();
			console.log(formattedScreeningDetails.title);

			BRAIN_DEAD_SCREENINGS.push(formattedScreeningDetails);
		}
		
		console.log("FINISHED");
		
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
