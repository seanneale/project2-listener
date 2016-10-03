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
		res.render('whoops', {title: 'res vs app render'});
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
		res.render('logout'); //Can fire before session is destroyed?
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