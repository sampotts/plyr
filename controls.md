# Controls

This is the markup that is rendered for the Plyr controls. You can use the default controls or provide a customized version of markup based on your needs.

## Internationalization using default controls

You can provide an `i18n` object as one of your options when initialising the plugin which we be used when rendering the controls.

### Example

```javascript
i18n: {
    restart:            "Restart",
    rewind:             "Rewind {seektime} secs",
    play:               "Play",
    pause:              "Pause",
    forward:            "Forward {seektime} secs",
    buffered:           "buffered",
    currentTime:        "Current time",
    duration:           "Duration",
    volume:             "Volume",
    toggleMute:         "Toggle Mute",
    toggleCaptions:     "Toggle Captions",
    toggleFullscreen:   "Toggle Fullscreen"
}
```

Note: `{seektime}` will be replaced with your configured seek time or the default. For example "Forward {seektime} secs" would render as "Forward 10 secs".

## Using custom HTML

You can specify the HTML for the controls using the `html` option.

The classes and data attributes used in your template should match the `selectors` option.

You need to add several placeholders to your html template that are replaced when rendering:

- `{id}` - the dynamically generated ID for the player (for form controls)
- `{seektime}` - the seek time specified in options for fast forward and rewind

You can include only the controls you need when specifying custom html.

### Example

This is an example `html` option with all controls.

```javascript
var controls = ["<div class='plyr__controls'>",
    "<button type='button' data-plyr='restart'>",
        "<svg><use xlink:href='#icon-restart'></use></svg>",
        "<span class='plyr__sr-only'>Restart</span>",
    "</button>",
    "<button type='button' data-plyr='rewind'>",
        "<svg><use xlink:href='#icon-rewind'></use></svg>",
        "<span class='plyr__sr-only'>Rewind {seektime} secs</span>",
    "</button>",
    "<button type='button' data-plyr='play'>",
        "<svg><use xlink:href='#icon-play'></use></svg>",
        "<span class='plyr__sr-only'>Play</span>",
    "</button>",
    "<button type='button' data-plyr='pause'>",
        "<svg><use xlink:href='#icon-pause'></use></svg>",
        "<span class='plyr__sr-only'>Pause</span>",
    "</button>",
    "<button type='button' data-plyr='fast-forward'>",
        "<svg><use xlink:href='#icon-fast-forward'></use></svg>",
        "<span class='plyr__sr-only'>Forward {seektime} secs</span>",
    "</button>",
    "<span class='plyr__progress'>",
        "<label for='seek{id}' class='plyr__sr-only'>Seek</label>",
        "<input id='seek{id}' class='plyr__progress--seek' type='range' min='0' max='100' step='0.1' value='0' data-plyr='seek'>",
        "<progress class='plyr__progress--played' max='100' value='0' role='presentation'></progress>",
        "<progress class='plyr__progress--buffer' max='100' value='0'>",
            "<span>0</span>% buffered",
        "</progress>",
        "<span class='plyr__tooltip'>00:00</span>",
    "</span>",
    "<span class='plyr__time'>",
        "<span class='plyr__sr-only'>Current time</span>",
        "<span class='plyr__time--current'>00:00</span>",
    "</span>",
    "<span class='plyr__time'>",
        "<span class='plyr__sr-only'>Duration</span>",
        "<span class='plyr__time--duration'>00:00</span>",
    "</span>",
    "<button type='button' data-plyr='mute'>",
        "<svg class='icon--muted'><use xlink:href='#icon-muted'></use></svg>",
        "<svg><use xlink:href='#icon-volume'></use></svg>",
        "<span class='plyr__sr-only'>Toggle Mute</span>",
    "</button>",
    "<span class='plyr__volume'>",
        "<label for='volume{id}' class='plyr__sr-only'>Volume</label>",
        "<input id='volume{id}' class='plyr__volume--input' type='range' min='0' max='10' value='5' data-plyr='volume'>",
        "<progress class='plyr__volume--display' max='10' value='0' role='presentation'></progress>",
    "</span>",
    "<button type='button' data-plyr='captions'>",
        "<svg class='icon--captions-on'><use xlink:href='#icon-captions-on'></use></svg>",
        "<svg><use xlink:href='#icon-captions-off'></use></svg>",
        "<span class='plyr__sr-only'>Toggle Captions</span>",
    "</button>",
    "<button type='button' data-plyr='fullscreen'>",
        "<svg class='icon--exit-fullscreen'><use xlink:href='#icon-exit-fullscreen'></use></svg>",
        "<svg><use xlink:href='#icon-enter-fullscreen'></use></svg>",
        "<span class='plyr__sr-only'>Toggle Fullscreen</span>",
    "</button>",
"</div>"].join("");

// Setup the player
plyr.setup('.js-player', {
    html: controls
});
```
