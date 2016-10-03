const mongoose = require('mongoose');

var episodeSchema = new mongoose.Schema({
	episodeName: String,
	episodeInfo: String,
	episodeLoc: String,
	image: String
},{
	timestamps: true
});

exports.schema = episodeSchema;
var episode = mongoose.model('Episodes',episodeSchema);
module.exports = episode;