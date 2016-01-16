// ==========================================================================
// Docs example
// ==========================================================================

/*global plyr, shr*/

// Setup the player
plyr.setup('.js-media-player', {
	debug: 		true,
	title: 		'Video demo',
	tooltips: 	true,
	captions: {
		defaultActive: true
	},
	onSetup: function() {
		console.log('✓ Setup done');
	}
});

// Setup shr
shr.setup({
	count: {
		classname: 'btn__count'
	}
});

// General functions
(function() {
	var buttons = document.querySelectorAll('[data-source]'),
		types = {
			video: 0,
			audio: 1,
			youtube: 2,
			vimeo: 3
		},
		currentType = window.location.hash.replace('#', ''),
		historySupport = (window.history && window.history.pushState);

	// Bind to each button
	for (var i = buttons.length - 1; i >= 0; i--) {
		buttons[i].addEventListener('click', function() {
			var type = this.getAttribute('data-source');

			newSource(type);

			if (historySupport) {
				history.pushState({ 'type': type }, '', '#' + type);
			}
		});
	}

	// List for backwards/forwards
	window.addEventListener('popstate', function(event) {
		if(event.state && 'type' in event.state) {
			newSource(event.state.type);
		}
	});

	// On load
	if(historySupport) {
		var video = !currentType.length;
		if(video) {
			currentType = 'video';
		}
		if(currentType in types) {
			history.replaceState({ 'type': currentType }, '', (video ? '' : '#' + currentType));
		}
		if(!video) {
			newSource(currentType);
		}
	}

	function toggleClass(element, className, state) {
        if (element) {
            if (element.classList) {
                element.classList[state ? 'add' : 'remove'](className);
            }
            else {
                var name = (' ' + element.className + ' ').replace(/\s+/g, ' ').replace(' ' + className + ' ', '');
                element.className = name + (state ? ' ' + className : '');
            }
        }
    }

	// Set a new source
	function newSource(type) {
		if(!(type in types)) {
			return;
		}

		var player = document.querySelector('.js-media-player').plyr;

		switch(type) {
			case 'video':
				player.source({
					type:       'video',
					title: 		'View From A Blue Moon',
					sources: [{
						src:    'https://cdn.selz.com/plyr/1.5/View_From_A_Blue_Moon_Trailer-HD.mp4',
						type:   'video/mp4'
					},
					{
						src:    'https://cdn.selz.com/plyr/1.5/View_From_A_Blue_Moon_Trailer-HD.webm',
						type:   'video/webm'
					}],
					poster:     'https://cdn.selz.com/plyr/1.5/View_From_A_Blue_Moon_Trailer-HD.jpg',
					tracks:     [{
						kind:   'captions',
						label:  'English',
						srclang:'en',
						src:    'https://cdn.selz.com/plyr/1.0/example_captions_en.vtt',
						default: true
					}]
				});
				break;

			case 'audio':
				player.source({
					type:       'audio',
					title: 		'Kishi Bashi &ndash; &ldquo;It All Began With A Burst&rdquo;',
					sources: [{
						src:    'https://cdn.selz.com/plyr/1.5/Kishi_Bashi_-_It_All_Began_With_a_Burst.mp3',
						type:   'audio/mp3'
					},
					{
						src:    'https://cdn.selz.com/plyr/1.5/Kishi_Bashi_-_It_All_Began_With_a_Burst.ogg',
						type:   'audio/ogg'
					}]
				});
				break;

			case 'youtube':
				player.source({
					type:       'video',
					title: 		'View From A Blue Moon',
					sources: [{
				        src:    'bTqVqk7FSmY',
				        type:   'youtube'
				    }]
				});
				break;

			case 'vimeo':
				player.source({
					type:       'video',
					title: 		'View From A Blue Moon',
					sources: [{
				        src:    '143418951',
				        type:   'vimeo'
				    }]
				});
				break;
		}

		currentType = type;

		for (var x = buttons.length - 1; x >= 0; x--) {
			toggleClass(buttons[x].parentElement, 'active', false);
		}

		toggleClass(document.querySelector('[data-source="'+ type +'"]').parentElement, 'active', true);
	}
})();

// Google analytics
// For demo site (http://[www.]plyr.io) only
if(document.domain.indexOf('plyr.io') > -1) {
	(function(i,s,o,g,r,a,m){i.GoogleAnalyticsObject=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	ga('create', 'UA-40881672-11', 'auto');
	ga('send', 'pageview');
}
