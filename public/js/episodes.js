var podcastTemplate = '<div class="podcastEpisode col-lg-3 col-sm-4 col-xs-6"><img class="img-fluid" src="IMAGEREPLACE"><audio id="EPISODEID" controls="controls" preload="none" src="EPISODELOCREPLACE">Your browser does not support the HTML5 Audio element.</audio><h2><span>EPISODENAMEREPLACE<span class="spacer"></span><br /><span class="spacer"></span><span class="releaseDate">EPISODERELEASEDATE</span></span></h2></div>'

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
		var limit = 50;
		if(unsrtArray.length < limit) {
			limit = unsrtArray.length;
		}
		for(var k = 0; k < limit; k ++){
			var podcastElement = podcastTemplate;
			podcastElement = podcastElement.replace('IMAGEREPLACE',unsrtArray[k].episode.image);
			podcastElement = podcastElement.replace('EPISODELOCREPLACE',unsrtArray[k].episode.episodeLoc);
			podcastElement = podcastElement.replace('EPISODEID',unsrtArray[k].episode._id);
			podcastElement = podcastElement.replace('EPISODENAMEREPLACE',unsrtArray[k].episode.episodeName);
			podcastElement = podcastElement.replace('EPISODERELEASEDATE',dateConvert(unsrtArray[k].episode.releaseDate));
			$('#episodeDisplay').append(podcastElement);
		}
		$('audio').on('ended', function(event){
			markEpisodeAsPlayed(event.target.id);
			$(this).parent().addClass('hide');
		});
	})
	console.log('...loaded');
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
	$('#newPodcast').on('click',addNewPodcast);
	console.log('also ready');
	loadEpisodeDisplay();
})