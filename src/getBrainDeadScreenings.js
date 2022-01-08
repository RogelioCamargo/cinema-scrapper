const puppeteer = require("puppeteer");
require('dotenv').config();

// brain dead studio domains
const BASE_URL = "https://studios.wearebraindead.com";
const INITIAL_URL = "https://studios.wearebraindead.com/screening/0";

// selectors
const SCREENING_URL_SELECTOR = ".screening-calendar-ul .screening-calendar-screening-p"; 
const TITLE_SELECTOR = "div.movie-detail .movie-detail-info h1.movie-detail-title";
const DIRECTOR_SELECTOR = "div.movie-detail .movie-detail-info .movie-detail-director > span";
const POSTER_SELECTOR = "div.movie-detail img.movie-detail-img";
const TRAILER_SELECTOR = "div.movie-detail .movie-detail-info a.movie-detail-trailer";
const DESCRIPTION_SELECTOR = "div.movie-detail .movie-detail-info .movie-detail-description";
const TICKET_SELECTOR = "div.movie-detail .movie-detail-info .showtimes-li a.showtimes-tickets";
const TIME_DATE_SELECTOR = "div.movie-detail .movie-detail-info .showtimes-li > p";

(async () => {
	try {
		// set up brower
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		page.setUserAgent(process.env.USER_AGENT);

		await page.goto(INITIAL_URL);
		await page.waitForSelector(SCREENING_URL_SELECTOR); 

		const screeningUrls = await page.evaluate(() => {
			// get an array of clickable screening events
			return Array.from(document.querySelectorAll(".screening-calendar-ul .screening-calendar-screening-p"))
				// get array of just their routing attribute "/screening/,14999"
				.map(screening => screening.getAttribute("ng-reflect-router-link"))
				// remove commas to get valid url
				.map(routingString => routingString.replace(/,/g,''));
		});

		const BRAIN_DEAD_SCREENINGS = [];
		for (let i = 0; i < screeningUrls.length; i++) {
			const screeningUrl = `${BASE_URL}${screeningUrls[i]}`
			await page.goto(screeningUrl);
			await page.waitForSelector(SCREENING_URL_SELECTOR);

			// screening info
			const title = await page.$eval(TITLE_SELECTOR, element => element.textContent);
			const director = await page.$eval(DIRECTOR_SELECTOR, element => element.textContent); // Director: Martin Scorsese
			const description = await page.$eval(DESCRIPTION_SELECTOR, element => element.textContent);
			const showtime = await page.$eval(TIME_DATE_SELECTOR, element => element.textContent); // 01-09-2022, 8:00PM
			const [date, time] = showtime.split(",").map(string => string.trim());
			const [day, month, year] = date.split("-");
			// screening poster image
			const poster = await page.$eval(POSTER_SELECTOR, element => element.getAttribute("src"));
			// screening links to trailer or buy tickets
			const trailer = await page.$eval(TRAILER_SELECTOR, element => element.getAttribute("href"));
			const tickets = await page.$eval(TICKET_SELECTOR, element => element.getAttribute("href"));

			BRAIN_DEAD_SCREENINGS.push({ 
				title, 
				director: director.slice(10),
				time,
				links: { 
					trailer, 
					tickets, 
					info: screeningUrl 
				},
				poster,
				description,
				date: {
					day: Number(day),
					month: Number(month),
					year: Number(year)
				},
				location: "Brain Dead Studios"
			});
		}

		console.log(JSON.stringify(BRAIN_DEAD_SCREENINGS, null, 3));

		await browser.close();
	} catch (error) {
		console.log(error);
	}
})();
