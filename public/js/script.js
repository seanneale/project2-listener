function convertDate(c){
	if(c === 1 || c === 21 || c === 31){
		return (c + 'st');
	} else if(c === 2 | c === 22){
		return (c + 'nd');
	} else if(c === 3 | c === 23){
		return (c + 'rd');
	} else {
		return ( c + 'th');
	}
}

function convertMonth(x){
	var months = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
	return months[x];
}

function dateConvert(date){
	var targetDate = new Date(date)
	return convertDate(targetDate.getDate())+' '+convertMonth(targetDate.getMonth());
}

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