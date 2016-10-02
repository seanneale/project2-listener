var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


// Init app
var app = express();

// Connect with Mongo DB
mongoose.connect('mongodb://localhost/the-listener');

//linking collections
var userReq = require('./models/user');
var episodesReq = require('./models/episodes');
var subscriptionsReq = require('./models/subscriptions');

// Init middel-ware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// View Engine
app.set( 'views', path.join(__dirname, 'views'));
app.set( 'view engine', 'pug');

// Setup sessions
app.use(session( { secret: 'ullages'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Setup local-strategy
require('./config/passport')(passport);

// Routes
require('./routes/routes')(app, passport);

var server = require('http').Server(app);

// listen
server.listen( 3000, function(){
    console.log('listening on port 3000');
});

//testing collections
var user1 = userReq({
	username: 'seanneale',
	password: 'password',
	lastLogin: new Date(),
	podcasts: [],
	settings: new Object()
})

var user2 = userReq({
	username: 'nealesean',
	password: 'wordpass',
	lastLogin: new Date(),
	podcasts: [],
	settings: new Object()
})

user1.save(function(err){
	if(err) {
		console.log(err);
		return;
	};
	console.log('user1 Created');
});

user2.save(function(err){
	if(err) {
		console.log(err);
		return;
	};
	console.log('user2 Created');
});

var episode1 = episodesReq({
	podcastName: [],
	episodeName: 'A Bugle update',
	episodeInfo: 'An update on the NEW NEW Bugle...',
	episodeLoc: 'http://www.podtrac.com/pts/redirect.mp3/feeds.soundcloud.com/stream/283199168-the-bugle-a-bugle-update.mp3',
	image: 'http://i1.sndcdn.com/avatars-000036816294-7qogzv-original.jpg'
})

episode1.save(function(err){
	if(err) {
		console.log(err);
		return;
	};
	console.log('episode1 Created');
});

var subs1 = subscriptionsReq({
	name: 'The Bugle',
	description: 'John Oliver and Andy Zaltzman, the transatlantic region’s leading bi-continental satirical double-act, leave no hot potato unbuttered in their worldwide-hit weekly topical comedy show.',
	rssFeedLoc: 'http://feeds.feedburner.com/thebuglefeed',
	episodes: [],
	favourited: true
})

var subs2 = subscriptionsReq({
	name: 'Answer Me This',
	description: "Helen Zaltzman and Olly Mann host the award-winning podcast that has been answering the world's questions since 2007. Visit our official website at answermethispodcast.com. Buy classic episodes, albums and apps at answermethisstore.com.",
	rssFeedLoc: 'http://answermethis.libsyn.com/rss',
	episodes: [],
	favourited: true
})

subs1.save(function(err){
	if(err) {
		console.log(err);
		return;
	};
	console.log('subs1 Created');
});

subs2.save(function(err){
	if(err) {
		console.log(err);
		return;
	};
	console.log('subs2 Created');
});
