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


function getSubsDataFromRSSFeed (rssFeed){
	var FeedParser = require('feedparser')
	  , request = require('request');

	var req = request(rssFeed)
	  , feedparser = new FeedParser();

	req.on('error', function (error) {
	  // handle any request errors
	});
	req.on('response', function (res) {
	  var stream = this;

	  if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

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

	  while (item = stream.read()) {
	  	console.log(item);
	  	var wantedInfo = {name: item.meta.title, description: item.meta.description, link: item.meta.link}
	    console.log(wantedInfo);
	    return wantedInfo;
	  }
	});
}

function getEpisodeDataFromRSSFeed (rssFeed, res){
	var episodeArray = [];
	var subInfo = {};
	var FeedParser = require('feedparser')
	  , request = require('request');

	var req = request(rssFeed)
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
	  	var wantedInfo = {episodeName: item.title,	episodeInfo: item.description, episodeLoc: item.link, image: image};
	  	episodeArray.push(wantedInfo);
		subInfo = {name: item.meta.title, description: item.meta.description, link: item.meta.link}
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
	            } else {
	            	console.log('else');
	            	var newSub = new subscriptionsReq();
	            	newSub.episodes = [];
	            	newSub.name = subInfo.name;
	            	newSub.description = subInfo.description;
	            	newSub.link = subInfo.link;
	            	newSub.favourited = false;
	            	//console.log(newSub);
	            	process.nextTick(function(){
	            		//mkaing the episodes
	            		for(var i = 0; i < episodeArray.length; i++){
            				var newEp = new episodesReq();
            				newEp.episodeName = episodeArray[i].episodeName;
            				newEp.episodeInfo = episodeArray[i].episodeInfo;
            				newEp.episodeLoc = episodeArray[i].episodeLoc;
            				newEp.image =episodeArray[i].image;
            				newSub.episodes[i] = newEp;
            				newEp.save(function(err){
            					if(err){
            						console.log(err);
            					}
            					console.log('episode created');            					
            				})
		            	}
    					console.log(newSub)
    					newSub.save(function(err){
		            		if(err){
		            			console.log(err);
		            		}
		            		console.log('podcast created');
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

// getEpisodeDataFromRSSFeed(letsTalkAboutTech);
// getEpisodeDataFromRSSFeed(dannyBaker);
// getEpisodeDataFromRSSFeed(theBugle);
// getEpisodeDataFromRSSFeed(answerMeThis);

function test (rssFeed){
	var b = getEpisodeDataFromRSSFeed(rssFeed, res);
	console.log(b);
}

// test(dannyBaker);

module.exports = function(app, passport){

	//router middleware
	function isLoggedIn(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		}
		res.redirect('/')
	}

	//testing the server
	app.get('/', function(req, res){
		getEpisodeDataFromRSSFeed(letsTalkAboutTech, res)
		// res.render('whoops', {title: 'res vs app render'});
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