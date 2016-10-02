const mongoose = require('mongoose');

var subscriptionSchema = new mongoose.Schema({
	name: String,
	description: String,
	rssFeedLoc: String,
	episodes: ['episodes'],
	favourited: Boolean
},{
	timestamps: true
});

exports.schema = subscriptionSchema;
module.exports = mongoose.model('Subscriptions',subscriptionSchema);