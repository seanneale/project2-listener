//linking collections
var userReq = require('../models/user');
var episodesReq = require('../models/episodes');
var subscriptionsReq = require('../models/subscriptions');

//rss feeds for testing
var theBugle = 'http://feeds.feedburner.com/thebuglefeed';
var answerMeThis = 'http://answermethis.libsyn.com/rss';
var briefingRoom = 'http://www.bbc.co.uk/programmes/b07cblx9/episodes/downloads.rss';
var dannyBaker = 'http://www.bbc.co.uk/programmes/b00mjjxr/episodes/downloads.rss';
var letsTalkAboutTech = 'http://www.bbc.co.uk/programmes/p02nrxgq/episodes/downloads.rss';

function removeSubsFromUser(req,res){
	var targetSub = req.body.name;
	var username = req.user.username;
	userReq.findOne({username: username}, function(err,user){
		if(err){
			console.log(err);
		}
		//find the targetted subscription
		for(var i = 0; i < user.podcasts.length; i++){
			if(targetSub == user.podcasts[i].podcast.name){
				console.log(targetSub);
				//remove from the array
				user.podcasts.splice(i,1);
			}
		}
		//save the changes to the user
		user.save(function(){
			if(err){
				console.log(err);
			}
			console.log(targetSub + " deleted");	
		})
	})
}

function markAllEpisodesAsPlayed(req,res){
	var targetSub = req.body.name;
	var username = req.user.username;
	userReq.findOne({username: username}, function(err,user){
		if(err){
			console.log(err);
		}
		//search user podcasts
		//for the target podcast
		for(var i = 0; i < user.podcasts.length; i++){
			if(targetSub == user.podcasts[i].podcast.name){
				for(var j = 0; j < user.podcasts[i].playedEpisodes.length; j++){
					user.podcasts[i].playedEpisodes[j].played = true;
					console.log(user.podcasts[i].playedEpisodes[j].played);
				}
			}
		}
		user.save(function(){
			if(err){
				console.log(err);
			}
			console.log('episode marked as played');	
		})
	})
}

function markEpisodeAsPlayed(req,res){
	var episode = req.body.episodeID;
	var user = req.user.username;
	userReq.findOne({username: user},function(err,user){
		if(err){
			console.log(err);
		}
		//console.log(user.podcasts);
		for(var i = 0; i < user.podcasts.length; i++){
			for(var j = 0; j < user.podcasts[i].playedEpisodes.length;j++){
				if(episode == user.podcasts[i].playedEpisodes[j].episode._id){
					user.podcasts[i].playedEpisodes[j].played = true;
				}
			}
			
		}
		user.save(function(){
			if(err){
				console.log(err);
			}
			console.log('episode marked as played');	
		})
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

var addPodcastToUser = function(username,newPod){
	userReq.findOne({'username': username}, function(err,user){
		if(err){
			console.log(err);
		}
		//function to push all the existing episodes to the user and flag played: false
		
		user.podcasts.push({'podcast': newPod, playedEpisodes: [{}]});
		addEpisodesToUser(user,newPod);
		// Remember to save the user
		user.save(function(){
			if(err){
				console.log(err);
			}
			console.log('podcasts and episodes added to user');	
		})
	})
}

function getEpisodeDataFromRSSFeed (req, res){
	var username = req.user.username;
	var episodeArray = [];
	var subInfo = {};
	var rssFeedLoc = req.body.newPodcastUrl;
	var FeedParser = require('feedparser')
	  , request = require('request');

	var req = request(req.body.newPodcastUrl)
	  , feedparser = new FeedParser();

	req.on('error', function (error) {
	  // handle any request errors
	});
	req.on('response', function (resp) {
	  var stream = this;

	  if (resp.statusCode != 200) return this.emit('error', new Error('Bad status code'));

	  stream.pipe(feedparser);
	});


	feedparser.on('error', function(error) {
	  // always handle errors
	});
	feedparser.on('readable', function() {
	  // This is where the action is!
	  var stream = this
	    , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
	    , item;	    
	  if (item = stream.read()) {
	  	// console.log(item);
	  	if(item.image = {}){
	  		var image = item.meta.image.url;
	  	} else {
	  		var image = item.image;
	  	}
	  	var wantedInfo = {episodeName: item.title,	episodeInfo: item.description, episodeLoc: item.enclosures[0].url, image: image, releaseDate: item.date};
	  	episodeArray.push(wantedInfo);
		subInfo = {name: item.meta.title, description: item.meta.description, link: rssFeedLoc, lastUpdate: item.meta.date}
	  	// console.log(episodeArray.length);
	    // console.log(wantedInfo);
	    // return wantedInfo;
	  }
	});
	feedparser.on('finish',function(){
		process.nextTick(function(){
			// console.log(episodeArray);
			//console.log(subInfo);
			//'make' the new episode in here
			//lookfor the new episode
			subscriptionsReq.findOne({ 'name': subInfo.name}, function(err,subs){
				if(err){
					return done(err);
				}
				if(subs){
					console.log('podcast already exists')
					addPodcastToUser(username,subs);
	            } else {
	            	var newSub = new subscriptionsReq();
	            	newSub.rssFeedLoc = rssFeedLoc
	            	newSub.episodes = [];
	            	newSub.name = subInfo.name;
	            	newSub.description = subInfo.description;
	            	newSub.link = subInfo.link;
	            	newSub.favourited = false;
	            	newSub.lastUpdate = subInfo.lastUpdate // check for date format
	            	//console.log(newSub);
	            	process.nextTick(function(){
	            		//mkaing the episodes
	            		for(var i = 0; i < episodeArray.length; i++){
            				var newEp = new episodesReq();
            				newEp.episodeName = episodeArray[i].episodeName;
            				newEp.episodeInfo = episodeArray[i].episodeInfo;
            				newEp.episodeLoc = episodeArray[i].episodeLoc;
            				newEp.image =episodeArray[i].image;
            				newEp.releaseDate = episodeArray[i].releaseDate;
            				newSub.episodes[i] = newEp;
            				newEp.save(function(err){
            					if(err){
            						console.log(err);
            					}
            					console.log('episode created');            					
            				})
		            	}
    					newSub.save(function(err){
		            		if(err){
		            			console.log(err);
		            		}
		            		console.log('podcast created');
		            		addPodcastToUser(username,newSub);
		            	})
	            	})
	            }
			})
			//if found 
				//add the podcast to the user
			//else create the new podcast and episodes
				//and add to the user
			res.send(subInfo);
		})
	});
}

module.exports = function(app, passport){

	//router middleware
	function isLoggedIn(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		}
		res.redirect('/')
	}

	app.delete('/removesubs', function(req,res){
		removeSubsFromUser(req,res);
	})

	app.put('/playedepisode', function(req,res){
		markEpisodeAsPlayed(req,res);
	})

	app.put('/playedepisodes', function(req,res){
		markAllEpisodesAsPlayed(req,res);
	})

	app.get('/userpodcasts', function(req,res){
		res.json(req.user.podcasts);
	})

	//testing the server
	app.get('/', function(req, res){
		//console.log(req.user);
		// getEpisodeDataFromRSSFeed(letsTalkAboutTech, res);
		res.render('whoops', {title: 'res vs app render'});
	});

	app.post('/',function(req,res){
		//console.log(req);
		getEpisodeDataFromRSSFeed(req, res);
	});

	// load login page
	app.get('/login', function(req,res){
		res.render('login', {title: 'res vs app render'});
	});

	//sign up user
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/episodes',
		failureRedirect: '/login',
		failureFlash: true
	}));

	//login user
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/episodes',
		failureRedirect: '/login',
		failureFlash: true
	}));

	//show logout page
	app.get('/logout', function(req, res){
		req.logout();
		res.render('logout');
	});

	//show episodes page
	app.get('/episodes', isLoggedIn, function(req,res){
		res.render('episodes', {title: 'res vs app render'});
	});

	//show subs page
	app.get('/subscriptions', isLoggedIn, function(req,res){
		res.render('subscriptions', {title: 'res vs app render'});
	});

	//show settings page
	app.get('/settings', isLoggedIn, function(req,res){
		res.render('settings', {title: 'res vs app render'});
	});

	//find and remove a user
};