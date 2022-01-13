require("dotenv").config();
const mongoose = require("mongoose");
const { 
	getNewBeverlyScreenings, 
	getBrainDeadScreenings, 
	getOnlyScreeningUrls,
	getAeroTheaterScreeningsUsingFile,
	getAeroTheaterScreenings
} = require("./scrappers");
const Screening = require("./models/screening");

(async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI_TEST);
		console.log("Connected to MongoDB!");

		// clear database
		// await Screening.deleteMany({});
		
		// for debuggging / or easing task of getting aero screenings
		// await getOnlyScreeningUrls();

		// get screenings
		// await getNewBeverlyScreenings();
		// await getBrainDeadScreenings();
		
		// only use one of the two for getting aero screenings
		await getAeroTheaterScreeningsUsingFile();
		// await getAeroTheaterScreenings();
	} catch (error) {
		console.log(error);
	}
})();