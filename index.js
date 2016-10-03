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

//adding controller
require('./controller/controller');

// Routes
require('./routes/routes')(app, passport);

var server = require('http').Server(app);

// listen
server.listen( 3000, function(){
    console.log('listening on port 3000');
});

var userDelete = function(query){
	userReq.findOneAndRemove({username: query}, function(err){
		if(err){
			console.log(err);
		}
		console.log('User Removed')
	})
}

var addPodcastToUser = function(username,newPod){
	userReq.findOneAndUpdate({username: username},{podcast: newPod, episodes: []}, function(err){
		if(err){
			console.log(err);
		}
		//function to push all the existing episodes to the user and flag played: false
		console.log(user);
	})
}

var subs1 = subscriptionsReq({
	name: 'The Bugle',
	description: 'John Oliver and Andy Zaltzman, the transatlantic region’s leading bi-continental satirical double-act, leave no hot potato unbuttered in their worldwide-hit weekly topical comedy show.',
	rssFeedLoc: 'http://feeds.feedburner.com/thebuglefeed',
	episodes: [],
	favourited: true
})

addPodcastToUser('11111111',subs1);


//testing collections
// var user1 = userReq({
// 	username: 'seanneale',
// 	password: 'password',
// 	lastLogin: new Date(),
// 	podcasts: [],
// 	settings: new Object()
// })

// var user2 = userReq({
// 	username: 'nealesean',
// 	password: 'wordpass',
// 	lastLogin: new Date(),
// 	podcasts: [],
// 	settings: new Object()
// })

// var episode1 = episodesReq({
// //	podcastName: [],
// 	episodeName: 'A Bugle update',
// 	episodeInfo: 'An update on the NEW NEW Bugle...',
// 	episodeLoc: 'http://www.podtrac.com/pts/redirect.mp3/feeds.soundcloud.com/stream/283199168-the-bugle-a-bugle-update.mp3',
// 	image: 'http://i1.sndcdn.com/avatars-000036816294-7qogzv-original.jpg'
// })

// var episode2 = episodesReq({
// //	podcastsName
// 	episodeName: "AMT340: Fitbits, Whale Poo and Mushy Peas",
// 	episodeInfo:"Listeners, how terribly remiss of us to make it through three quarters of 2016 without marking the fact that it has been designated by the UN as the International Year of Pulses. But thankfully there's still three months of it in which to celebrate, starting with a pulverised pea party in AMT340. Find out more about the episode at http://answermethispodcast.com/episode340.  Tweet us http://twitter.com/helenandolly Be our Facebook friend at http://facebook.com/answermethis Subscribe on iTunes http://iTunes.com/AnswerMeThis Buy old episodes and albums at http://answermethisstore.com",
// 	episodeLoc: 'http://www.podtrac.com/pts/redirect.mp3/traffic.libsyn.com/answermethis/Answer_Me_This_Episode_340.mp3',
// 	image: "http://static.libsyn.com/p/assets/9/1/b/9/91b92836b7bd137c/cover-art-2015ii.jpg"
// })

// var subs1 = subscriptionsReq({
// 	name: 'The Bugle',
// 	description: 'John Oliver and Andy Zaltzman, the transatlantic region’s leading bi-continental satirical double-act, leave no hot potato unbuttered in their worldwide-hit weekly topical comedy show.',
// 	rssFeedLoc: 'http://feeds.feedburner.com/thebuglefeed',
// 	episodes: [],
// 	favourited: true
// })

// var subs2 = subscriptionsReq({
// 	name: 'Answer Me This',
// 	description: "Helen Zaltzman and Olly Mann host the award-winning podcast that has been answering the world's questions since 2007. Visit our official website at answermethispodcast.com. Buy classic episodes, albums and apps at answermethisstore.com.",
// 	rssFeedLoc: 'http://answermethis.libsyn.com/rss',
// 	episodes: [],
// 	favourited: true
// })

// episode1.save(function(err){
// 	if(err) {
// 		console.log(err);
// 		return;
// 	};
// 	console.log('episode1 Created');
// 	episode2.save(function(err){
// 		if(err) {
// 			console.log(err);
// 			return;
// 		}
// 		console.log('episode2 Created');
// 		subs1.save(function(err){
// 			if(err) {
// 				console.log(err);
// 				return;
// 			};
// 			console.log('subs1 Created');
// 			subs2.save(function(err){
// 				if(err) {
// 					console.log(err);
// 					return;
// 				};
// 				console.log('subs2 Created');
// 				user1.save(function(err){
// 					if(err) {
// 						console.log(err);
// 						return;
// 					};
// 					console.log('user1 Created');
// 					user2.save(function(err){
// 						if(err) {
// 							console.log(err);
// 							return;
// 						};
// 						console.log('user2 Created');
// 						userReq.find({},function(err,users){
// 							if(err){
// 								console.log('DB error', err);
// 								return;
// 							}
// 							users[0].podcasts.push({podcast: subs1, episodes: [{'episode': episode1, 'played': false}] });
// 							users[1].podcasts.push({podcast: subs2, episodes: [{'episode': episode2, 'played': false}] });
// 							console.log(users);
// 							console.log(users[0].podcasts);
// 							console.log(users[0].podcasts[0].episodes);
// 						})
// 						subscriptionsReq.find({},function(err,subscriptions){
// 							if(err){
// 								console.log('DB error', err);
// 								return;
// 							}
// 							subscriptions[0].episodes.push(episode1);
// 							subscriptions[1].episodes.push(episode2);
// 							console.log(1);
// 							console.log(subscriptions);
// 							console.log(1);
// 							console.log(subscriptions[0].episodes);
// 							console.log(1);
// 							console.log(subscriptions[0].episodes[0]);
// 						})
// 					});
// 				});
// 			});
// 		});
// 	})
// });


