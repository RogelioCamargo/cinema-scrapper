const puppeteer = require("puppeteer");

const START = 0;
const END = 31;
const BASE_URL = "https://studios.wearebraindead.com";
const INITIAL_URL = "https://studios.wearebraindead.com/screening/0";
const SCREENING_URL_SELECTOR = ".screening-calendar-ul .screening-calendar-screening-p"; 
const SCREENING_URL_ATTRIBURE = "ng-reflect-router-link";

// {
// 	title: "",
// 	director: "",
// 	trailer: "",
// 	screenings: [],
// 	description: "",
// 	date: {
// 		year: 1,
// 		month: 1,
// 		day: 1
// 	},
// 	location: "Brain Dead Studios",
// 	ticketsUrl: "",
// 	infoUrl: ""
// }

(async () => {
	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		page.setUserAgent(process.env.USER_AGENT);

		await page.goto(INITIAL_URL);
		await page.waitForSelector(SCREENING_URL_SELECTOR); 

		// const screeningButtons = await page.$$(SCREENING_URL_SELECTOR);
		const screeningUrls = await page.evaluate(() => {
			const routingAttributes = Array.from(document.querySelectorAll(".screening-calendar-ul .screening-calendar-screening-p"))
																		 .map(screening => screening.getAttribute("ng-reflect-router-link"));
			return routingAttributes.map(routingString => routingString.replace(/,/g,''));
		});

		await browser.close();
	} catch (error) {
		console.log(error);
	}
})();

// eventCard: document.querySelector("div.screening-calendar > ul > li:nth-child(21)")
// clickable-titles: document.querySelectorAll(".screening-calendar-screening-p")
// title: document.querySelector("div.movie-detail .movie-detail-info h1")
// date: document.querySelector("div.movie-detail .movie-detail-info .showtimes-li p")
// url: document.querySelector("div.movie-detail .movie-detail-info .showtimes-li a")

