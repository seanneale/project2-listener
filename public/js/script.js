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

function ajaxPost(input,url){
	var user = {
		username: $(input[0]).val(),
		password: $(input[1]).val()
	};

	$.ajax({
		method: 'POST',
		url: url,
		data: user
	}).done(function(){
		window.location.href = '/episodes';
	})
	return false;
}

function login(e){
	e.preventDefault();
	var input = $('#login input');
	var url = '/login'
	ajaxPost(input,url);
}

function signUp(e){
	e.preventDefault();
	var input = $('#signUp input');
	var url = '/signup';
	ajaxPost(input,url);
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
	$('.switch').on('click',swap);
	$('.waves-effect').removeClass('waves-effect');
	$('.waves-light').removeClass('waves-light');
})