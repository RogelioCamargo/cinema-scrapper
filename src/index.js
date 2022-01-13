require("dotenv").config();
const mongoose = require("mongoose");
const { 
	getNewBeverlyScreenings, 
	getBrainDeadScreenings, 
	getAeroTheaterScreeningsUsingFile,
	getAeroTheaterScreenings
} = require("./scrappers");

(async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI_TEST);
		console.log("Connected to MongoDB!");
		
		// await getNewBeverlyScreenings();
		// await getBrainDeadScreenings();
		// only use one of the two for getting aero screenings
		// await getAeroTheaterScreeningsUsingFile();
		// await getAeroTheaterScreenings();
	} catch (error) {
		console.log(error);
	}
})();