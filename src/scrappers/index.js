const { getNewBeverlyScreenings } = require("./getNewBeverlyScreenings");
const { getBrainDeadScreenings } = require("./getBrainDeadScreenings");
const { 
	getAeroTheaterScreenings, 
	getAeroTheaterScreeningsUsingFile 
} = require("./getAeroTheatreScreenings");

module.exports = { 
	getNewBeverlyScreenings, 
	getBrainDeadScreenings,
	getAeroTheaterScreenings,
	getAeroTheaterScreeningsUsingFile
};