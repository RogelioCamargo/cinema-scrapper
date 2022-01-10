const puppeteer = require("puppeteer");
require("dotenv").config();

// areo theatre domains
const INITIAL_URL = "https://www.americancinematheque.com/now-showing/?event_access_type=56";

// selectors
const EVENT_CARD_SELECTOR = "div.v-calendar-weekly__day .v-event";
// const EVENT_PREVIEW_SELECTOR = ".eventPreviewCard";
const OPEN_PREVIEW_BUTTON_SELECTOR = ".eventPreview__button";
// const VIEW_EVENT_DETAILS_SELECTOR = ".textCta";
const TITLE_SELECTOR = "section.eventHero h1.eventHero__title";
const DIRECTOR_SELECTOR = "section.eventDetailBar ul.eventDetailBar__list > li:nth-child(3)";
const TIME_SELECTOR = "section.eventHero span.eventHero__time";
const POSTER_SELECTOR = "section.eventHero figure.eventHero__image > img";
const DESCRIPTION_SELECTOR = "div.eventMain__body > h3 + p";
const LOCATION_SELECTOR = ".eventMain__location > h5";

(async () => {
	try {
		// set up browser
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.setUserAgent(process.env.USER_AGENT);

		await page.goto(INITIAL_URL);
		await page.waitForSelector(EVENT_CARD_SELECTOR);

		const numberOfScreenings = await page.evaluate(() => {
			return Array.from(document.querySelectorAll("div.v-calendar-weekly__day .v-event")).length;
		});

		const AERO_THEATRE_SCREENINGS = [];

		for (let i = 0; i < numberOfScreenings; i++) {
			await page.goto(INITIAL_URL);
			await page.waitForSelector(EVENT_CARD_SELECTOR);
	
			const events = await page.$$(EVENT_CARD_SELECTOR);
			const dates = await page.$$eval(EVENT_CARD_SELECTOR, 
				dates => dates.map(date => date.getAttribute("data-date")));

			const event = events[i];
			const openPreviewButton = await event.$(OPEN_PREVIEW_BUTTON_SELECTOR);

			await page.evaluate((button) => {
				button.click();
				const openEventDetailsButton = document.querySelector(".textCta");
				openEventDetailsButton.click();
			}, openPreviewButton);

			await page.waitForSelector(TITLE_SELECTOR);
			const time = await page.$eval(TIME_SELECTOR, element => element.textContent.replace(/\s/g, ''));
			const poster = await page.$eval(POSTER_SELECTOR, element => element.getAttribute(""))
			const url = page.url();
			const date = dates[i].split("-"); // YY-MM-DD
			const location = await page.$eval(LOCATION_SELECTOR, element => element.textContent);
			
			// let title, description, director;
			const title = await page.$eval(TITLE_SELECTOR, element => element.textContent);
			if (title.includes("/")) {
				const items = await page.evaluate(() => {
					return Array.from(document.querySelectorAll("section.eventMain div.eventMain__body > p span:first-child"))
						.map(element => element.textContent);
				});
				const titles = items.map(item => item.slice(0, item.indexOf(",")));
				const directors = items.map(item => item.slice(item.indexOf("Dir") + 4).trim());

				for (let j = 0; j < 2; j++) {
					console.log(titles[j]);
					AERO_THEATRE_SCREENINGS.push({
						title: titles[j],
						directors: directors[j],
						time,
						links: {
							trailer: url,
							tickets: url,
							info: url
						},
						poster,
						date: {
							day: Number(date[2]),
							month: Number(date[1]),
							year: Number(date[0])
						},
						location,
						isDoubleFeature: true
					})
				}
			}
			else {
				const description = await page.$eval(DESCRIPTION_SELECTOR, element => element.textContent);
				const director = await page.$eval(DIRECTOR_SELECTOR, element => element.textContent);
				console.log(title);

				AERO_THEATRE_SCREENINGS.push({
					title, 
					director,
					time,
					links: {
						trailer: url,
						tickets: url,
						info: url,
					},
					poster,
					description,
					date: {
						day: Number(date[2]),
						month: Number(date[1]),
						year: Number(date[0])
					},
					location,
					isDoubleFeature: false
				});
			}
		}
		
		console.log(JSON.stringify(AERO_THEATRE_SCREENINGS, null, 3));

		await browser.close();
	} catch (error) {
		console.log(error);
	}

})();