const mongoose = require("mongoose");

const RequiredString = {
	type: String,
	required: true
};

const RequiredNumber = {
	type: Number,
	required: true
}

const ScreeningSchema = new mongoose.Schema({
	title: RequiredString,
	director: String,
	time: RequiredString,
	links: {
		trailer: RequiredString,
		info: RequiredString
	},
	poster: RequiredString,
	description: String,
	date: {
		day: RequiredNumber,
		month: RequiredNumber,
		year: RequiredNumber
	},
	location: RequiredString,
	isDoubleFeature: Boolean
});

module.exports = mongoose.model("Screening", ScreeningSchema);

