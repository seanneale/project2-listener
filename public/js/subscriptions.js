var subscriptionTemplate = '<div class="col-lg-10 col-lg-offset-1 col-xs-12"><div class="row subscription"><div class="col-lg-4"><img class="img-fluid" src="REPLACEIMAGELOC"></div><div class="col-lg-8"><div class="row"><h1>REPLACEPODCASTNAME</h1><ul></ul></div><div class="row"><div class="col-lg-4 showAllEpisodes"><h3>Show All Episodes</h3></div><div class="col-lg-4 markAllAsListened"><h3>Mark All As Listened</h3></div><div class="col-lg-4 deletePodcast"><h3>Delete Podcast</h3></div></div></div></div></div>'

var showTracker = 1;

function convertDate(c){
	if(c == 1 || c == 21 || c == 31){
		return (c + 'st');
	} else if(c == 2 | c == 22){
		return (c + 'nd');
	} else if(c == 3 | c == 23){
		return (c + 'rd');
	} else {
		return ( c + 'th');
	}
}

function convertMonth(x){
	if(x == 0){
		return 'January';
	} else if (x == 1){
		return 'February';
	} else if (x == 2){
		return 'March';
	} else if (x == 3){
		return 'April';
	} else if (x == 4){
		return 'May';
	} else if (x == 5){
		return 'June';
	} else if (x == 6){
		return 'July';
	} else if (x == 7){
		return 'August';
	} else if (x == 8){
		return 'September';
	} else if (x == 9){
		return 'October';
	} else if (x == 10){
		return 'November';
	} else if (x == 11){
		return 'December';
	}
}

function dateConvert(date){
	var date = new Date(date)
	return convertDate(date.getDate())+' '+convertMonth(date.getMonth());
}

function arraySort(inputArray){
	//sorting the array into alphabetical order
	inputArray.sort(function(a,b){
		if(a.podcast.name < b.podcast.name) return -1;
		if(a.podcast.name > b.podcast.name) return 1;
		return 0;
	});
	console.log('sorted');
}

function sendMarkAllEpisodesAsPlayed(name){
	console.log('sending');
	$.ajax({
		method: 'PUT',
		url: '/playedepisodes',
		data: {name: name}
	})
}

function sendDeleteSubs(name){
	console.log('sending');
	$.ajax({
		method: 'DELETE',
		url: '/removesubs',
		data: {name: name}
	})
}

function buildSubsPage(){
	$.ajax({
		method: 'GET',
		url: '/userpodcasts'
	}).done(function(info){
		userSubsInfo = info;
		//clearing the display
		$('#subsDisplay').html('');
		//sorting the podcast into alphabetical order
		arraySort(userSubsInfo);
		//for each podcast
		for(var i = 0; i < userSubsInfo.length; i++){
			//build it's section
			var a = userSubsInfo[i];
			var subscriptionElement = subscriptionTemplate;
			subscriptionElement = subscriptionElement.replace('REPLACEPODCASTNAME',a.podcast.name);
			subscriptionElement = subscriptionElement.replace('REPLACEIMAGELOC',a.playedEpisodes[0].episode.image);
			//getting the episode info
			$('#subsDisplay').append(subscriptionElement);
			for(var j = 0; j < a.playedEpisodes.length; j++){
				var b = a.playedEpisodes[j];
				var c = $('ul');
				//create the list element 
				var listItem = document.createElement('li');				
				//add the text
				var text = b.episode.episodeName + ', ' + dateConvert(b.episode.releaseDate)
				$(listItem).text(text);
				//add class if neccessary
				//add class if played
				if(b.played == true){
					$(listItem).addClass('played');
				}
				//adding class if not in the five most recent episodes
				if(j >= 5){
					$(listItem).addClass('hide');
				}
				//append the element to the list
				$(c[c.length-1]).append(listItem);
			}
		}
		$('.showAllEpisodes').unbind().click(function(){
			//remove class 'hide' for all episodes of this podcast
			var target = $(this).parent().parent().children().children('ul').children();
			//change name 
			showTracker = (-1)*showTracker;
			for(var k = 5; k < target.length; k++){
				$(target[k]).toggleClass('hide');
			}	
			if(showTracker > 0){
				$(this).html('<h3>Show All Episodes</h3>');
			} else {
				$(this).html('<h3>Hide Episodes</h3>');
			}

		})
		$('.markAllAsListened').unbind().click(function(e){
			console.log('#markAllAsListened');
			var target = $(this).parent().parent().children().children('ul').children();
			for(var k =0; k < target.length; k++){
				$(target).addClass('played');	
			}
			var podcastName = $(this).parent().parent().children().children('h1').text();
			//function to send the data back
			sendMarkAllEpisodesAsPlayed(podcastName);
		})
		$('.deletePodcast').unbind().click(function(){
			$(this).parent().parent().parent().addClass('hide');
			console.log('#deletePodcast');
			var podcastName = $(this).parent().parent().children().children('h1').text();
			sendDeleteSubs(podcastName);
		})	
	})
}

$(document).ready(function(){
	console.log('also ready');
	buildSubsPage();
})