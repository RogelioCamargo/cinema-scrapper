const puppeteer = require("puppeteer");
require('dotenv').config();

const BASE_URL = "https://studios.wearebraindead.com";
const INITIAL_URL = "https://studios.wearebraindead.com/screening/0";
const SCREENING_URL_SELECTOR = ".screening-calendar-ul .screening-calendar-screening-p"; 
const SCREENING_URL_ATTRIBURE = "ng-reflect-router-link";

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

		let screenings = [];
		for (let i = 0; i < screeningUrls.length; i++) {
			const screeningUrl = `${BASE_URL}${screeningUrls[i]}`
			await page.goto(screeningUrl);
			await page.waitForSelector(SCREENING_URL_SELECTOR);

			const filmTitle = await page.$eval("div.movie-detail .movie-detail-info h1", element => element.textContent);
			let filmDirector = await page.$eval("div.movie-detail .movie-detail-info .movie-detail-director > span",
													 element => element.textContent);
			filmDirector = filmDirector.slice(10);
			const filmPosterUrl = await page.$eval("div.movie-detail img.movie-detail-img", element => element.getAttribute("src"));
			const filmTrailerUrl = await page.$eval("div.movie-detail .movie-detail-info a.movie-detail-trailer", element => element.getAttribute("href"));
			const filmDescription = await page.$eval("div.movie-detail .movie-detail-info .movie-detail-description", element => element.textContent);
			const filmTicketsUrl = await page.$eval("div.movie-detail .movie-detail-info .showtimes-li a.showtimes-tickets", element => element.getAttribute("href"));
			// const filmFormat = await page.$eval("div.movie-detail .movie-detail-info .movie-detail-description > span", element => element.textContent);
			let filmDateAndTime = await page.$eval("div.movie-detail .movie-detail-info .showtimes-li > p", element => element.textContent);
			filmDateAndTime = filmDateAndTime.split(",").map(string => string.trim());
			
			const filmDate = filmDateAndTime[0];
			const [dateDay, dateMonth, dateYear] = filmDate.split("-");
			const filmTime = filmDateAndTime[1];

			console.log(filmTitle);
			screenings.push({ 
				title: filmTitle, 
				director: filmDirector,
				trailer: filmTrailerUrl,
				image: filmPosterUrl,
				links: {
					trailer: filmTrailerUrl,
					image: filmPosterUrl,
					tickets: filmTicketsUrl	
				},
				description: filmDescription,
				time: filmTime,
				date: {
					day: Number(dateDay),
					month: Number(dateMonth),
					year: Number(dateYear)
				},
				location: "Brain Dead Studios"
			});
		}

		console.log(JSON.stringify(screenings, null, 3));

		await browser.close();
	} catch (error) {
		console.log(error);
	}
})();

// eventCard: div.screening-calendar > ul > li:nth-child(21)
// clickable-titles: .screening-calendar-screening-p
// title: div.movie-detail .movie-detail-info h1
// date: div.movie-detail .movie-detail-info .showtimes-li p
// photoUrl: div.movie-detail img.movie-detail-img
// trailerUrl: div.movie-detail .movie-detail-info a.movie-detail-trailer
// tickets: div.movie-detail .movie-detail-info .showtimes-li a.showtimes-tickets
// format: div.movie-detail .movie-detail-info .movie-detail-description > span

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