const mongoose = require('mongoose');

var episodeSchema = new mongoose.Schema({
	podcastName: ['Subscriptions'],
	episodeName: String,
	episodeInfo: String,
	episodeLoc: String,
	image: String
},{
	timestamps: true
});

exports.schema = episodeSchema;
module.exports = mongoose.model('Episodes',episodeSchema);