const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	lastLogin: Date,
	// podcasts: [{
	// 	podcast: 'Subscription',
	// 	episodes: [{	episode: 'Episode',
	// 					played: Boolean
	// 				}]
	// }],
	settings: Object
},{
	timestamps: true
});

module.exports = mongoose.model('User',userSchema);