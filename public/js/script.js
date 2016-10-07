function login(e){
	e.preventDefault();
	var input = $('#login input');
	var username = $(input[0]).val();
	var password = $(input[1]).val();

	var user = {
		username: username,
		password: password
	};

	$.ajax({
		method: 'POST',
		url: '/login',
		data: user
	}).done(function(){
		window.location.href = '/episodes';
	})
}

function signUp(e){
	e.preventDefault();
	var input = $('#signUp input');
	var username = $(input[0]).val();
	var password = $(input[1]).val();

	var newUser = {
		username: username,
		password: password
	};

	$.ajax({
		method: 'POST',
		url: '/signup',
		data: newUser
	}).done(function(){
		window.location.href = '/episodes'
	})
}

function addNewPodcast(e){
	e.preventDefault();
	var newPodcastUrl = $('#newPodcastEntry').val();
	console.log(typeof(newPodcastUrl));

	$.ajax({
		method: 'POST',
		url: '/',
		data: {newPodcastUrl: newPodcastUrl}
	}).done(function(){
		window.location.href = '/episodes'
	})
}

function swap(e){
	e.preventDefault();
	$('#login').toggleClass('hide');
	$('#signUp').toggleClass('hide');
}


$(document).ready(function(){
	console.log('ready');
	$('#loginSubmitBtn').on('click',login);
	$('#signUpSubmitBtn').on('click',signUp);
	$('#newPodcast').on('click',addNewPodcast);
	$('.switch').on('click',swap);
	$('.waves-effect').removeClass('waves-effect');
	$('.waves-light').removeClass('waves-light');
})