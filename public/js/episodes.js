podcastTemplate = '<div class="podcastEpisode col-lg-3 col-sm-4 col-xs-6"><img class="img-fluid" src="IMAGEREPLACE"><audio id="EPISODEID" controls="controls" preload="none" src="EPISODELOCREPLACE">Your browser does not support the HTML5 Audio element.</audio></div>'
//<audio src="EPISODELOCREPLACE" preload="auto" />


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
		if(unsrtArray.length < 50) {
			limit = unsrtArray.length;
		}
		for(var i = 0; i < limit; i ++){
			var podcastElement = podcastTemplate;
			podcastElement = podcastElement.replace('IMAGEREPLACE',unsrtArray[i].episode.image);
			podcastElement = podcastElement.replace('EPISODELOCREPLACE',unsrtArray[i].episode.episodeLoc);
			podcastElement = podcastElement.replace('EPISODEID',unsrtArray[i].episode._id);
			$('#episodeDisplay').append(podcastElement);
		}
		$('audio').on('ended', function(event){
			markEpisodeAsPlayed(event.target.id);
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