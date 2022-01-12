const { 
	getBeverlyCinemaScreenings, 
	getBrainDeadScreenings 
} = require("./scrappers");

(async () => {
	try {
		await getBeverlyCinemaScreenings();
		// await getBrainDeadScreenings();
	} catch (error) {
		console.log(error);
	}
})();
