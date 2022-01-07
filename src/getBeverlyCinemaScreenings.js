const puppeteer = require("puppeteer");

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto("https://thenewbev.com/schedule/");

	const BEVERLY_CINEMA_SCREENINGS = await page.evaluate(() => {
		const eventCards = Array.from(document.querySelectorAll(".event-card"));

		const screenings = eventCards.map((eventCard) => {
			const showDay = eventCard.querySelector(".event-card__date .event-card__numb").textContent;
			const showTitle = eventCard.querySelector(".event-card__info .event-card__title").textContent.trim();
			const showUrl = eventCard.querySelector(".event-card a").getAttribute("href");
			const showTimes = Array.from(eventCard.querySelectorAll(".event-card__info .event-card__time")).map(time => time.textContent);
			const showImage = document.querySelector(".event-card .event-card__img img").src

			// showTitle may contain more than one title, "/" is the seperating character
			const showTitles = showTitle.split("/").map(item => item.trim());
			// create ojbect events of type { title, time }
			const showEvents = showTitles.map((showTitle, index) => ({ title: showTitle, time: showTimes[index]}));

			return {
				date: {
					year: 2022,
					month: 1,
					day: Number(showDay)
				},
				shows: showEvents,
				location: "New Beverly Cinema",
				url: showUrl,
				image: showImage,
			};
		});

		return screenings;
	});

	console.log(JSON.stringify(BEVERLY_CINEMA_SCREENINGS, null, 3));

	await browser.close();
})();