# Controls HTML

This is the markup that is rendered for the Plyr controls. The reason it's a seperate option is to allow full customization of markup based on your needs. It's a pet hate of other libraries that use `<a href="#">` or `<span>`s as buttons! 

The default Plyr setup uses a Hogan template, this is to allow for localization at a later date. Check out `controls.html` in `/src/templates` to get an idea of how the default html is structured. Alternatively just use the vanilla HTML below.

## Requirements

The classes and data attributes used in your template should match the `selectors` option. 

You need to add two placeholders to your html template:

- {id} for the dynamically generated ID for the player (for form controls)
- {aria-label} for the dynamically generated play button label for screen readers
- {seek-time} for the seek time specified in options for fast forward and rewind

Currently all buttons and inputs need to be present for Plyr to work but later we'll make it more dynamic so if you omit a button or input, it'll still work. 

## Vanilla HTML template

You can of course, just specify vanilla HTML. Here's an example snippet:

```javascript
var controls = [
'<div class="player-controls">',
	'<div class="player-progress">',
		'<progress class="player-progress-played" max="100" value="0">',
			'<span>0</span>% played',
		'</progress>',
		'<progress class="player-progress-buffer" max="100" value="0">',
			'<span>0</span>% buffered',
		'</progress>',
	'</div>',
	'<span class="player-controls-playback">',
		'<button type="button" data-player="restart">',
			'<span class="icon-restart" aria-hidden="true"></span>',
			'<span class="sr-only">Restart</span>',
		'</button>',
		'<button type="button" data-player="rewind">',
			'<span class="icon-rewind" aria-hidden="true"></span>',
			'<span class="sr-only">Rewind <span class="player-seek-time">{seek_time}</span> seconds</span>',
		'</button>',
		'<button type="button" aria-label="{aria-label}" data-player="play">',
			'<span class="icon-play" aria-hidden="true"></span>',
			'<span class="sr-only">Play</span>',
		'</button>',
		'<button type="button" data-player="pause">',
			'<span class="icon-pause" aria-hidden="true"></span>',
			'<span class="sr-only">Pause</span>',
		'</button>',
		'<button type="button" data-player="fast-forward">',
			'<span class="icon-forward" aria-hidden="true"></span>',
			'<span class="sr-only">Fast forward <span class="player-seek-time">{seek_time}</span> seconds</span>',
		'</button>',
		'<span class="player-time">',
			'<span class="sr-only">Time</span>',
			'<span class="player-duration">00:00</span>',
		'</span>',
	'</span>',
	'<span class="player-controls-sound">',
		'<input class="inverted sr-only" id="mute{id}" type="checkbox" data-player="mute">',
		'<label id="mute{id}" for="mute{id}">',
			'<span class="icon-mute icon-muted" aria-hidden="true"></span>',
			'<span class="icon-volume-up" aria-hidden="true"></span>',
			'<span class="sr-only">Mute</span>',
		'</label>',
		'<label for="volume{id}" class="sr-only">Volume:</label>',
		'<input id="volume{id}" class="player-volume" type="range" min="0" max="10" value="5" data-player="volume">',
		'<input class="sr-only" id="captions{id}" type="checkbox" data-player="captions">',
		'<label for="captions{id}">',
			'<span class="icon-subtitles" aria-hidden="true"></span>',
			'<span class="sr-only">Captions</span>',
		'</label>',
		'<button type="button" data-player="fullscreen">',
			'<span class="icon-resize-small icon-exit-fullscreen" aria-hidden="true"></span>',
			'<span class="icon-resize-full" aria-hidden="true"></span>',
			'<span class="sr-only">Toggle fullscreen</span>',
		'</button>',
	'</span>',
'</div>'
].join("\n");
```