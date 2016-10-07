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
	userReq.findOneAndUpdate({username: username},{podcasts: [{podcast: newPod, playedEpisodes: [{}]}]}, function(err,user){
		if(err){
			console.log(err);
		}
		//function to push all the existing episodes to the user and flag played: false
		console.log(user.podcasts[0].playedEpisodes);
		addEpisodesToUser(user,newPod);
		console.log(user.podcasts[0].playedEpisodes);
	})
}

var addEpisodesToUser = function(user,newPod){
	//only use this function to when adding a new subscription to the user
	//find the podcast in the users array of podcast
	for(var i = 0; i < user.podcasts.length; i++){
		if(newPod.name == user.podcasts[i].podcast.name){
			for(var j = 0; j < newPod.episodes.length; j++){
				user.podcasts[i].playedEpisodes[j] = {episode: newPod.episodes[j], played: false};
			}
		}
	}
}

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
// 	episodes: [episode1,episode2],
// 	favourited: true
// })

//console.log(subs1)

// addPodcastToUser('becky',subs1);


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
// 							users[0].podcasts.push({podcast: subs1, playedEpisodes: [{'episode': episode1, 'played': false}] });
// 							users[1].podcasts.push({podcast: subs2, playedEpisodes: [{'episode': episode2, 'played': false}] });
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


// var theBugle = 'http://feeds.feedburner.com/thebuglefeed';
// var answerMeThis = 'http://answermethis.libsyn.com/rss';
// var briefingRoom = 'http://www.bbc.co.uk/programmes/b07cblx9/episodes/downloads.rss';
// var dannyBaker = 'http://www.bbc.co.uk/programmes/b00mjjxr/episodes/downloads.rss';
// var letsTalkAboutTech = 'http://www.bbc.co.uk/programmes/p02nrxgq/episodes/downloads.rss';


// // function getSubsDataFromRSSFeed (rssFeed){
// // 	var FeedParser = require('feedparser')
// // 	  , request = require('request');

// // 	var req = request(rssFeed)
// // 	  , feedparser = new FeedParser();

// // 	req.on('error', function (error) {
// // 	  // handle any request errors
// // 	});
// // 	req.on('response', function (res) {
// // 	  var stream = this;

// // 	  if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

// // 	  stream.pipe(feedparser);
// // 	});


// // 	feedparser.on('error', function(error) {
// // 	  // always handle errors
// // 	});
// // 	feedparser.on('readable', function() {
// // 	  // This is where the action is!
// // 	  var stream = this
// // 	    , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
// // 	    , item;

// // 	  while (item = stream.read()) {
// // 	  	console.log(item);
// // 	  	var wantedInfo = {name: item.meta.title, description: item.meta.description, link: item.meta.link}
// // 	    console.log(wantedInfo);
// // 	    return wantedInfo;
// // 	  }
// // 	});
// // }

// function getEpisodeDataFromRSSFeed (rssFeed){
// 	var episodeArray = [];
// 	var FeedParser = require('feedparser')
// 	  , request = require('request');

// 	var req = request(rssFeed)
// 	  , feedparser = new FeedParser();

// 	req.on('error', function (error) {
// 	  // handle any request errors
// 	});
// 	req.on('response', function (res) {
// 	  var stream = this;

// 	  if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

// 	  stream.pipe(feedparser);
// 	});


// 	feedparser.on('error', function(error) {
// 	  // always handle errors
// 	});
// 	feedparser.on('readable', function() {
// 	  // This is where the action is!
// 	  var stream = this
// 	    , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
// 	    , item;	    
// 	  if (item = stream.read()) {
// 	  	// console.log(item);
// 	  	if(item.image = {}){
// 	  		var image = item.meta.image.url;
// 	  	} else {
// 	  		var image = item.image;
// 	  	}
// 	  	// console.log(item.meta);
// 	  	console.log(item.enclosures[0].url);
// 	  	var wantedInfo = {episodeName: item.title,	episodeInfo: item.description, episodeLoc: item.link, image: image, releaseDate: item.date};
// 	  	episodeArray.push(wantedInfo);
// 	  	// console.log(episodeArray.length);
// 	    // console.log(wantedInfo);
// 	    // return wantedInfo;
// 	  }
// 	});
// 	feedparser.on('finish',function(){
// 		// console.log(episodeArray);
// 		return episodeArray.length;
// 	});
// //	console.log(episodeArray);
// }

// getEpisodeDataFromRSSFeed(letsTalkAboutTech);
// // getEpisodeDataFromRSSFeed(dannyBaker);
// getEpisodeDataFromRSSFeed(theBugle);
// getEpisodeDataFromRSSFeed(answerMeThis);

// // // // function test (rssFeed){
// // // // 	getEpisodeDataFromRSSFeed(rssFeed);
// // // // }

// // // // test(dannyBaker);

///////////////////////////////////////////////////
// Refresh Code Below
////////////////////////////////////////////////////

// function episodeCompare(sub,user,loc){
// 	console.log('arrow');
// 	var userEpID = user.podcasts[loc].playedEpisodes[0].episode._id;
// 	var i = 0;
// 	var flag = false;

// 	while(!flag){
// 		console.log(i);
// 		console.log(user.podcasts[loc].playedEpisodes[0].episode._id == sub.episodes[i]._id)
// 		console.log(sub.episodes[i]._id);
// 		console.log(user.podcasts[loc].playedEpisodes[0].episode._id);
// 		if(userEpID == sub.episodes[i]._id){
			
// 			console.log(userEpID);
// 			console.log(sub.episodes[i]._id);
// 			flag = true;

// 		}
// 		if(i ==  sub.episodes.length-1){
// 			break;

// 		} else {
// 			i++;
// 		}
// 	}
// }

// function feedCompare(sub, user, loc){
// 	var subID = sub.episodes[0]._id;
// 	var userEpID = user.podcasts[loc].playedEpisodes[0].episode._id;
// 	if(subID != userEpID){
// 		console.log('no match');
// 		episodeCompare(sub,user,loc);
// 	}
// }

// function subsMatch(){
// 	userReq.find({}, function(err, users) {
// 		if(err){
// 			console.log(err);
// 		}
// 		subscriptionsReq.find({}, function(err, subs){
// 			if(err){
// 				console.log(err);
// 			}
// 			for(var i = 0; i < users.length; i++){
// 			// console.log(users[i].podcasts);
// 				for(var j = 0; j < 1; j++){
// 				// for(var j = 0; j < users[i].podcasts.length; j++){
// 					for(var k = 0; k < subs.length; k++){
// 						if(subs[k].name == users[i].podcasts[j].podcast.name){
// 							console.log('Fuck Yeah');
// 							feedCompare(subs[k],users[i],j)
// 						}
// 					}
// 				}	
// 			}
// 		})
// 	});
// }

// subsMatch();

// function creatingNewEpisodes(object){
// 	subscriptionsReq.findById(object.id,function(err,subs){
// 		for(var i = object.newEpisodes.length - 1; i >= 0; i--){
// 			// console.log(object.newEpisodes[i]);
// 			var newEp = new episodesReq();
// 			newEp.episodeName = object.newEpisodes[i].episodeName;
// 			newEp.episodeInfo = object.newEpisodes[i].episodeInfo;
// 			newEp.episodeLoc = object.newEpisodes[i].episodeLoc;
// 			newEp.image = object.newEpisodes[i].image;
// 			newEp.releaseDate = object.newEpisodes[i].releaseDate;
// 			// console.log(newEp);
// 			subs.episodes.unshift(newEp);
// 			newEp.save(function(err){
// 				if(err){
// 					console.log(err);
// 				}
// 				console.log('episode created'); 
// 			})
// 			subs.save(function(err){
// 				if(err){
// 					console.log(err);
// 				}
// 				console.log('episode added')
// 			})
// 		}
// 	})

// };

// function checkForUpdates(object,res){
// 	var rssFeedLoc = object.feed;
// 	var FeedParser = require('feedparser')
// 	, request = require('request');
// 	var req = request(rssFeedLoc)
// 	, feedparser = new FeedParser();
// 	req.on('error', function (error) {
// 		// handle any request errors
// 	});
// 	req.on('response', function (resp) {
// 		var stream = this;
// 		if (resp.statusCode != 200) return this.emit('error', new Error('Bad status code'));
// 		stream.pipe(feedparser);
// 	});
// 	feedparser.on('error', function(error) {
// 		// always handle errors
// 	});
// 	feedparser.on('readable', function() {
// 		// This is where the action is!
// 		var stream = this
// 		, meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
// 		, item;	    
// 		if (item = stream.read()) {
// 			// console.log(object.date - item.meta.date);
// 			if(object.date - item.meta.date < 0){
// 				// object.updated = true;
// 				if(object.date - item.date < 0){
// 				  	if(item.image = {}){
// 				  		var image = item.meta.image.url;
// 				  	} else {
// 				  		var image = item.image;
// 				  	}
// 				  	var wantedInfo = {episodeName: item.title,	episodeInfo: item.description, episodeLoc: item.enclosures[0].url, image: image, releaseDate: item.date};
// 				  	object.newEpisodes.push(wantedInfo);
// 				  	creatingNewEpisodes(object);
// 		  		}
// 			}
// 		}
// 	});
// 	// feedparser.on('finish',function(){
// 	// 	console.log(object.updated);
// 	// 	if(object.updated){
// 	// 		console.log('hey');
// 	// 		//start functions here
// 	// 		//find episodes published since last update
// 	// 		// addingEpisodesAfterUpdate(object);
// 	// 		//find the users subscribed to the podcast
// 	// 		//rebuild the episode array to include the new episodes
// 	// 		//add the new episode to each subscriber with played set to false (unshift() will put it at the start of the array not the end)
// 	// 	} else {
// 	// 		console.log('hey-yo');
// 	// 	}
// 	// })
// }

// function refreshSubscriptions(){
// 	var subsArray = []
// 	//find ALL podcasts and save required info
// 	subscriptionsReq.find({}, function(err, subs) {
// 		if (err) throw err;
// 		// object of all the users
// 		for(var i = 0; i < subs.length; i++){
// 			subsArray.push({date: subs[i].lastUpdate, feed: subs[i].rssFeedLoc, id: subs[i]._id, updated: false, newEpisodes: []})
// 		}
// 		// console.log(subsArray);
// 		for(var i = 0; i < 1; i++){
// 			checkForUpdates(subsArray[i]);	
// 		}		
// 	});

// }

// function refreshMonitor(){
// 	// setTimeout(function(){
// 	// 	console.log('Looking for updates...');
// 	// 	refreshSubscriptions();
// 	//  create a function that updates the last update time for each sub based on latest update time of an episode
// 	// 	refreshMonitor();
// 	// },60000);
// 	refreshSubscriptions();
// }

// refreshMonitor();