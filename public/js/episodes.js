podcastTemplate = '<div class="podcastEpisode col-lg-3 col-sm-4 col-xs-6"><div class="image"><img class="img-fluid" src="IMAGEREPLACE"><div class="podcastText"><h2><span>EPISODENAMEREPLACE<span class="spacer"></span><br /><span class="spacer"></span>EPISODERELEASEDATE</span></h2></div></div><audio id="EPISODEID" controls="controls" preload="none" src="EPISODELOCREPLACE">Your browser does not support the HTML5 Audio element.</audio></div>'
//<audio src="EPISODELOCREPLACE" preload="auto" />

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


//.col-lg-3.col-sm-4.col-xs-6
function arraySort(inputArray){
	inputArray.sort(function(a,b){
		return new Date(b.episode.releaseDate) - new Date(a.episode.releaseDate);
	});
	console.log('sorted');
}

function loadEpisodeDisplay(){
	console.log('loading...')
	$.ajax({
		method: 'GET',
		url: '/userpodcasts'
	}).done(function(info){
		unsrtArray = [];
		$('#episodeDisplay').html('');
		//building an array of all unplayed episodes
		for(var i = 0; i < info.length; i++){
			// console.log(info[i].playedEpisodes);
			for(var j = 0; j < info[i].playedEpisodes.length; j++){
				if(!info[i].playedEpisodes[j].played){
					unsrtArray.push(info[i].playedEpisodes[j]);
				}
				// console.log(info[i].playedEpisodes[j].played);
			}
		}
		//sorting the array into date order from most recently to least recently released
		arraySort(unsrtArray);
		//updating the episode display
		var limit = 12;
		if(unsrtArray.length < limit) {
			limit = unsrtArray.length;
		}
		for(var i = 0; i < limit; i ++){
			var podcastElement = podcastTemplate;
			podcastElement = podcastElement.replace('IMAGEREPLACE',unsrtArray[i].episode.image);
			podcastElement = podcastElement.replace('EPISODELOCREPLACE',unsrtArray[i].episode.episodeLoc);
			podcastElement = podcastElement.replace('EPISODEID',unsrtArray[i].episode._id);
			podcastElement = podcastElement.replace('EPISODENAMEREPLACE',unsrtArray[i].episode.episodeName);
			podcastElement = podcastElement.replace('EPISODERELEASEDATE',dateConvert(unsrtArray[i].episode.releaseDate));
			$('#episodeDisplay').append(podcastElement);
		}
		$('audio').on('ended', function(event){
			markEpisodeAsPlayed(event.target.id);
			$(this).parent().addClass('hide');
		});
	})
	console.log('...loaded');
}

function markEpisodeAsPlayed (id) {
	$.ajax({
		method: 'PUT',
		url: '/playedepisode',
		data: {episodeID: id}
	}).done(function(){
		window.location.href = '/episodes'
	})
}

$(document).ready(function(){
	console.log('also ready');
	loadEpisodeDisplay();
})