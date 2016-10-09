var subscriptionTemplate = '<div class="col-xs-10 col-xs-offset-1"><div class="row subscription"><div class="col-xs-4"><img class="img-fluid" src="REPLACEIMAGELOC"></div><div class="col-xs-8"><div class="row"><h1>REPLACEPODCASTNAME</h1></div><div class="row"><div class="col-xs-4 showAllEpisodes"><h3>Show All Episodes</h3></div><div class="col-xs-4 markAllAsListened"><h3>Mark All As Listened</h3></div><div class="col-xs-4 deletePodcast"><h3>Delete Podcast</h3></div></div><div class="row"><ul></ul></div></div></div></div>'
// var subscriptionTemplate = '<div class="col-lg-10 col-lg-offset-1 col-xs-12"><div class="row subscription"><div class="col-lg-4"><img class="img-fluid" src="REPLACEIMAGELOC"></div><div class="col-lg-8"><div class="row"><div class="col-lg-4 showAllEpisodes"><h3>Show All Episodes</h3></div><div class="col-lg-4 markAllAsListened"><h3>Mark All As Listened</h3></div><div class="col-lg-4 deletePodcast"><h3>Delete Podcast</h3></div></div><div class="row"><h1>REPLACEPODCASTNAME</h1><ul></ul></div></div></div></div>'

var showTracker = 1;

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


//functions to attach event listner
function showEpisodesEventListener(){
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
}

function markEpisodesEventListener(){
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
}

function deletePodcastsEventListener(){
	$('.deletePodcast').unbind().click(function(){
		$(this).parent().parent().parent().addClass('hide');
		console.log('#deletePodcast');
		var podcastName = $(this).parent().parent().children().children('h1').text();
		sendDeleteSubs(podcastName);
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
				if(b.played === true){
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
		showEpisodesEventListener();
		markEpisodesEventListener();
		deletePodcastsEventListener();
	})
}

$(document).ready(function(){
	console.log('also ready');
	buildSubsPage();
})