const { 
	getNewBeverlyScreenings, 
	getBrainDeadScreenings, 
	getAeroTheaterScreeningsUsingFile,
	getAeroTheaterScreenings
} = require("./scrappers");

(async () => {
	try {
		// await getNewBeverlyScreenings();
		// await getBrainDeadScreenings();
		// only use one of the two for getting aero screenings
		// await getAeroTheaterScreeningsUsingFile();
		await getAeroTheaterScreenings();
	} catch (error) {
		console.log(error);
	}
})();