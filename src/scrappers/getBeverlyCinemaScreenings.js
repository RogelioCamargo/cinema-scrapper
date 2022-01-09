const puppeteer = require("puppeteer");
require('dotenv').config();
const fs = require("fs-extra");

const MONTH = 1;
const YEAR = 2022;

// new beverly cinema domains
const INITIAL_URL = "https://thenewbev.com/schedule/";

// selectors
const EVENT_CARD_SELECTOR = "section.events .event-card";
const SCREENING_SELECTOR = "section.movies .movie";
const TITLE_SELECTOR = ".movie__content h2.movie__title";
const DIRECTOR_SELECTOR = ".movie__content .movie__details dd";
const POSTER_SELECTOR = ".movie__img figure.movie__poster > img";
const TRAILER_SELECTOR = ".movie__content .movie__ctas a:nth-child(1)";
const DESCRIPTION_SELECTOR = ".movie__content > p:last-of-type";
const DATE_SELECTOR = "div.movie-mast__posters .movie-mast__dates";

const getBeverlyCinemaScreenings = async () => {
	try {
		// set up browser
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		page.setUserAgent(process.env.USER_AGENT);

		await page.goto(INITIAL_URL);
		await page.waitForSelector(EVENT_CARD_SELECTOR);

		const screeningUrls = await page.evaluate(() => {
			return Array.from(document.querySelectorAll("section.events .event-card > a"))
				.map(screening => screening.getAttribute("href"));
		});

		// console.log(screeningUrls.length);

		const NEW_BEVERLY_SCREENINGS = [];

		for (let i = 0; i < screeningUrls.length; i++) {
			await page.goto(screeningUrls[i]);
			await page.waitForSelector(SCREENING_SELECTOR);
			
			// for double features, get both movies
			const screenings = await page.$$(SCREENING_SELECTOR);
			// get date for screening(s)
			const date = await page.$eval(DATE_SELECTOR, element => element.textContent); // January 08, 2022
			const index = date.indexOf(",");
			const day = Number(date.slice(index - 2, index));
			// get times for screening(s)
			const times = await page.evaluate(() => {
				return Array.from(document.querySelectorAll("div.movie-mast__titles .movie-mast__times"))
					.map(element => element.textContent.trim().replace(/\s/g, '').toUpperCase());
			});

			let j = 0;
			for (const screening of screenings) {
				const title = await screening.$eval(TITLE_SELECTOR, element => element.textContent);
				const director = await screening.$eval(DIRECTOR_SELECTOR, element => element.textContent);
				const description = await screening.$eval(DESCRIPTION_SELECTOR, element => element.textContent);
				const poster = await screening.$eval(POSTER_SELECTOR, element => element.getAttribute("src"));
				const trailer = await screening.$eval(TRAILER_SELECTOR, element => element.getAttribute("href"));
				// console.log(title);

				NEW_BEVERLY_SCREENINGS.push({
					title, 
					director,
					time: times[j],
					links: {
						trailer, 
						tickets: screeningUrls[i],
						info: screeningUrls[i]
					},
					poster,
					description,
					date: {
						day,
						month: MONTH,
						year: YEAR
					},
					location: "New Beverly Cinema",
					isDoubleFeature: screenings.length > 1 ? true : false
				});

				j++;
			}
		}

		await fs.writeFile('./data/BEVERLY_SCREENINGS.json', JSON.stringify(NEW_BEVERLY_SCREENINGS, null, 3));
		console.log("FINISHED");
		await browser.close();
	} catch (error) {
		console.log(error);
	}

};

module.exports = { getBeverlyCinemaScreenings };