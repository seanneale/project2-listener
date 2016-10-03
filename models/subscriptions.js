const mongoose = require('mongoose');
const episode = require('./episodes');

var subscriptionSchema = new mongoose.Schema({
	name: String,
	description: String,
	rssFeedLoc: String,
	episodes: [episode.schema],
	favourited: Boolean
},{
	timestamps: true
});

exports.schema = subscriptionSchema;
var subscription = mongoose.model('Subscriptions',subscriptionSchema);
module.exports = subscription;