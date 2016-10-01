module.exports = function(app, passport){

	//testing the server
	app.get('/', function(req, res){
		res.render('test', {title: 'res vs app render'});
	});

	app.get('/login', function(req,res){
		res.render('login', {title: 'res vs app render'});
	});

	app.get('/logout', function(req,res){
		res.render('logout', {title: 'res vs app render'});
	});

	app.get('/episodes', function(req,res){
		res.render('episodes', {title: 'res vs app render'});
	});

	app.get('/subscriptions', function(req,res){
		res.render('subscriptions', {title: 'res vs app render'});
	});

	app.get('/settings', function(req,res){
		res.render('settings', {title: 'res vs app render'});
	});

};