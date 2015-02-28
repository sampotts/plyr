# Controls HTML

This is the markup that is rendered for the Plyr controls. The reason it's a seperate option is to allow full customization of markup based on your needs. It's a pet hate of other libraries that use `<a href="#">` or `<span>`s as buttons! 

The default Plyr setup uses a Hogan template. The reason being to allow for localization at a later date. Check out `controls.html` in `/src/templates` to get an idea of how the default html is structured. Alternatively just use the vanilla HTML below.

## Requirements

The classes and data attributes used in your template should match the `selectors` option. 

You need to add several placeholders to your html template that are replaced when rendering:

- `{id}` - the dynamically generated ID for the player (for form controls)
- `{seektime}` - the seek time specified in options for fast forward and rewind

Currently all buttons and inputs need to be present for Plyr to work but later we'll make it more dynamic so if you omit a button or input, it'll still work. 

## Vanilla HTML template

You can of course, just specify vanilla HTML. Here's an example snippet:

```html
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
			'<svg><use xlink:href="#icon-refresh"></use></svg>',
			'<span class="sr-only">Restart</span>',
		'</button>',
		'<button type="button" data-player="rewind">',
			'<svg><use xlink:href="#icon-rewind"></use></svg>',
			'<span class="sr-only">Rewind <span class="player-seek-time">{seektime}</span> seconds</span>',
		'</button>',
		'<button type="button" data-player="play">',
			'<svg><use xlink:href="#icon-play"></use></svg>',
			'<span class="sr-only">Play</span>',
		'</button>',
		'<button type="button" data-player="pause">',
			'<svg><use xlink:href="#icon-pause"></use></svg>',
			'<span class="sr-only">Pause</span>',
		'</button>',
		'<button type="button" data-player="fast-forward">',
			'<svg><use xlink:href="#icon-fast-forward"></use></svg>',
			'<span class="sr-only">Fast forward <span class="player-seek-time">{seektime}</span> seconds</span>',
		'</button>',
		'<span class="player-time">',
			'<span class="sr-only">Time</span>',
			'<span class="player-duration">00:00</span>',
		'</span>',
	'</span>',
	'<span class="player-controls-sound">',
		'<input class="inverted sr-only" id="mute{id}" type="checkbox" data-player="mute">',
		'<label id="mute{id}" for="mute{id}">',
			'<svg class="icon-muted"><use xlink:href="#icon-muted"></use></svg>',
			'<svg><use xlink:href="#icon-sound"></use></svg>',
			'<span class="sr-only">Mute</span>',
		'</label>',
		'<label for="volume{id}" class="sr-only">Volume</label>',
		'<input id="volume{id}" class="player-volume" type="range" min="0" max="10" value="5" data-player="volume">',
		'<input class="sr-only" id="captions{id}" type="checkbox" data-player="captions">',
		'<label for="captions{id}">',
			'<svg><use xlink:href="#icon-bubble"></use></svg>',
			'<span class="sr-only">Captions</span>',
		'</label>',
		'<button type="button" data-player="fullscreen">',
			'<svg class="icon-exit-fullscreen"><use xlink:href="#icon-collapse"></use></svg>',
			'<svg><use xlink:href="#icon-expand"></use></svg>',
			'<span class="sr-only">Toggle fullscreen</span>',
		'</button>',
	'</span>',
'</div>'
].join("\n");
```