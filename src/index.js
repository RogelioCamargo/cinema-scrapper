const { 
	getNewBeverlyScreenings, 
	getBrainDeadScreenings, 
	getAeroTheaterScreenings
} = require("./scrappers");

(async () => {
	try {
		await getNewBeverlyScreenings();
		await getBrainDeadScreenings();
		await getAeroTheaterScreenings();
	} catch (error) {
		console.log(error);
	}
})();
