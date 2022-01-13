const { getNewBeverlyScreenings } = require("./getNewBeverlyScreenings");
const { getBrainDeadScreenings } = require("./getBrainDeadScreenings");
const { 
	getOnlyScreeningUrls,
	getAeroTheaterScreenings, 
	getAeroTheaterScreeningsUsingFile 
} = require("./getAeroTheatreScreenings");

module.exports = { 
	getNewBeverlyScreenings, 
	getBrainDeadScreenings,
	getOnlyScreeningUrls,
	getAeroTheaterScreenings,
	getAeroTheaterScreeningsUsingFile
};