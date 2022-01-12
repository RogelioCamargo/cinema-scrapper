const puppeteer = require("puppeteer");
require("dotenv").config();
const fs = require("fs-extra");

const YEAR = 2022;
const MONTH = 1;
const FIRST_DAY = 10;
const LAST_DAY = 31

// areo theatre domains
const INITIAL_URL = "https://www.americancinematheque.com/now-showing/?event_access_type=56";
const INITIAL_URL_LIST = "https://www.americancinematheque.com/now-showing/?event_access_type=56&event_location=54&event_location=55&event_location=102&event_location=68&start=2022.1.10&end=2022.4.10&view_type=list";

// selectors
const EVENT_CARD_SELECTOR = "div.v-calendar-weekly__day .v-event";
// const EVENT_PREVIEW_SELECTOR = ".eventPreviewCard";
const OPEN_PREVIEW_BUTTON_SELECTOR = ".eventPreview__button";
const TITLE_SELECTOR = "section.eventHero h1.eventHero__title";
const DIRECTOR_SELECTOR = "section.eventDetailBar ul.eventDetailBar__list > li:nth-child(3)";
const DATE_SELECTOR = "section.eventHero span.eventHero__date";
const TIME_SELECTOR = "section.eventHero span.eventHero__time";
const POSTER_SELECTOR = "section.eventHero figure.eventHero__image > img";
const DESCRIPTION_SELECTOR = "div.eventMain__body > h3 + p";
const LOCATION_SELECTOR = "section.eventHero > div > article > div.eventHero__intro > p:nth-child(1)";
const EVENT_LIST_CARD_SELECTOR = ".seriesEventCardModule__target";

const SCREENING_URLS = [
  'https://www.americancinematheque.com/now-showing/the-perfume-of-the-lady-in-black/',
  'https://www.americancinematheque.com/now-showing/out-of-the-blue-5/',
  'https://www.americancinematheque.com/now-showing/billie-eilish-the-worlds-a-little-blurry-the-september-issue/',
  'https://www.americancinematheque.com/now-showing/out-of-the-blue-6/',
  'https://www.americancinematheque.com/now-showing/rivers-edge-2/',
  'https://www.americancinematheque.com/now-showing/spencer-the-shining/',
  'https://www.americancinematheque.com/now-showing/gummo-2/',
  'https://www.americancinematheque.com/now-showing/out-of-the-blue-7/',
  'https://www.americancinematheque.com/now-showing/west-side-story-aero-1-13-730pm/',
  'https://www.americancinematheque.com/now-showing/spencer/',
  'https://www.americancinematheque.com/now-showing/a-woman-under-the-influence/',
  'https://www.americancinematheque.com/now-showing/last-and-first-men-6/',
  'https://www.americancinematheque.com/now-showing/out-of-the-blue-8/',
  'https://www.americancinematheque.com/now-showing/malcolm-x-2/',
  'https://www.americancinematheque.com/now-showing/last-and-first-men-5/',
  'https://www.americancinematheque.com/now-showing/friday-night-frights-presents-mandy/',
  'https://www.americancinematheque.com/now-showing/miracle-mile/',
  'https://www.americancinematheque.com/now-showing/vertigo/',
  'https://www.americancinematheque.com/now-showing/last-and-first-men-4/',
  'https://www.americancinematheque.com/now-showing/last-and-first-men-los-feliz-1-16-7pm/',
  'https://www.americancinematheque.com/now-showing/lawrence-of-arabia-4/',
  'https://www.americancinematheque.com/now-showing/girl-in-room-2a/',
  'https://www.americancinematheque.com/now-showing/out-of-the-blue-9/',
  'https://www.americancinematheque.com/now-showing/munich/',
  'https://www.americancinematheque.com/now-showing/last-and-first-men-3/',
  'https://www.americancinematheque.com/now-showing/last-and-first-men-2/',
  'https://www.americancinematheque.com/now-showing/lincoln/',
  'https://www.americancinematheque.com/now-showing/last-and-first-men/',
  'https://www.americancinematheque.com/now-showing/last-and-first-men-los-feliz-1-21-1-30pm/',
  'https://www.americancinematheque.com/now-showing/out-of-the-blue-10/',
  'https://www.americancinematheque.com/now-showing/nightmare-alley-bw-1/',
  'https://www.americancinematheque.com/now-showing/volcano/',
  'https://www.americancinematheque.com/now-showing/nightmare-alley-bw-2/',
  'https://www.americancinematheque.com/now-showing/the-game/',
  'https://www.americancinematheque.com/now-showing/ace-in-the-hole/',
  'https://www.americancinematheque.com/now-showing/chess-of-the-wind-3/',
  'https://www.americancinematheque.com/now-showing/nightmare-alley-bw-3/',
  'https://www.americancinematheque.com/now-showing/days-of-heaven-2/',
  'https://www.americancinematheque.com/now-showing/the-corruption-of-chris-miller/',
  'https://www.americancinematheque.com/now-showing/out-of-the-blue-lf3-1-24-1000pm/',
  'https://www.americancinematheque.com/now-showing/the-400-blows/',
  'https://www.americancinematheque.com/now-showing/last-and-first-men-los-feliz-1-28-1-30pm/',
  'https://www.americancinematheque.com/now-showing/out-of-the-blue-lf3-1-28-400pm/',
  'https://www.americancinematheque.com/now-showing/them/',
  'https://www.americancinematheque.com/now-showing/chess-of-the-wind-4/',
  'https://www.americancinematheque.com/now-showing/something-creeping-in-the-dark/'
];

// const getOnlyDirector = (string) => {
// 	if (string.includes("DIRECTED BY")) {

// 	}
// }

(async () => {
	try {
		// set up browser
		const browser = await puppeteer.launch({ 
			defaultViewport: null,
    	headless: true 
		});

		const page = await browser.newPage();

		// const getScreeningUrls = async () => {
		// 	const page = await browser.newPage();
		// 	await page.setUserAgent(process.env.USER_AGENT);
			
		// 	let ALL_SCREENING_URLS = [];
		// 	for (let i = FIRST_DAY; i <= LAST_DAY; i += 2) {
		// 		await page.goto(
		// 			`https://www.americancinematheque.com/now-showing/?start=${YEAR}.${MONTH}.${i}&end=${YEAR}.${MONTH}.${i + 1}&view_type=list`,
		// 			{ waitUntil: "networkidle0" }
		// 		);	
		// 		const urls = await page.$$eval(
		// 			EVENT_LIST_CARD_SELECTOR,
		// 			elements => elements.map(a => a.getAttribute("href"))
		// 		);
		// 		ALL_SCREENING_URLS = ALL_SCREENING_URLS.concat(urls);
		// 	}
			
		// 	return ALL_SCREENING_URLS;
		// };

		const AERO_THEATRE_SCREENINGS = [];

		for (let i = 0; i < SCREENING_URLS.length; i++) {
			await page.goto(SCREENING_URLS[i], { waitUntil: "networkidle0" });

			const time = await page.$eval(TIME_SELECTOR, element => element.textContent.replace(/\s/g, ''));
			const poster = await page.$eval(POSTER_SELECTOR, element => element.getAttribute("src"))
			const url = page.url();
			let location = await page.$eval(LOCATION_SELECTOR, element => element.textContent);
			location = location.slice(0, location.indexOf("|")).trim();
			const date = await page.$eval(DATE_SELECTOR, element => element.textContent);
			const day = date.slice(date.indexOf(",") - 2, date.indexOf(","));
			const title = await page.$eval(TITLE_SELECTOR, element => element.textContent);

			if (title.includes("/")) {
				const firstFilm = await page.$eval("section.eventMain div.eventMain__body > p span:first-child", element => element.textContent);
				let secondFilm = await page.$eval("section.eventMain div.eventMain__body > hr + p > span:first-child", element => element.textContent);
				
				const firstTitle = firstFilm.slice(0, firstFilm.indexOf(","));
				const secondTitle = secondFilm.slice(0, secondFilm.indexOf(","));

				const firstDirector = firstFilm.slice(firstFilm.indexOf("Dir") + 4).trim();
				const secondDirector = secondFilm.slice(secondFilm.indexOf("Dir") + 4).trim();

				console.log(firstTitle);
				console.log(secondTitle);
				AERO_THEATRE_SCREENINGS.push({
					title: firstTitle,
					director: firstDirector,
					time,
					links: {
						trailer: url,
						tickets: url,
						info: url
					},
					poster,
					date: {
						day: Number(day),
						month: MONTH,
						year: YEAR
					},
					location,
					isDoubleFeature: true
				});

				AERO_THEATRE_SCREENINGS.push({
					title: secondTitle,
					director: secondDirector,
					time,
					links: {
						trailer: url,
						tickets: url,
						info: url
					},
					date: {
						day: Number(day),
						month: MONTH,
						year: YEAR
					},
					poster,
					location,
					isDoubleFeature: true
				});
			}
			else {
				const description = await page.$eval(DESCRIPTION_SELECTOR, element => element.textContent);
				let director = await page.$eval(DIRECTOR_SELECTOR, element => element.textContent);
				if (director.includes(":"))
					director = director.slice(director.indexOf(":") + 2);
				if (director.includes(","))
					director = director.slice(director.indexOf(",") + 2);
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
					date: {
						day: Number(day),
						month: MONTH,
						year: YEAR
					},
					poster,
					description,
					location,
					isDoubleFeature: false
				});
			}
		}
		
		await fs.writeFile('./data/AERO_SCREENINGS.json', JSON.stringify(AERO_THEATRE_SCREENINGS, null, 3));

		await browser.close();
	} catch (error) {
		console.log(error);
	}

})();
