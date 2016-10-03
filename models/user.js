const mongoose = require('mongoose');
const episode = require('./episodes');
const subs = require('./subscriptions');

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	lastLogin: Date,
	podcasts: [{
		podcast: subs.schema,
		episodes: [{	episode: episode.schema,
						played: Boolean
					}]
	}],
	settings: Object
},{
	timestamps: true
});

module.exports = mongoose.model('User',userSchema);