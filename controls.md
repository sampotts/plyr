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
    played:             "played",
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
["<div class='player-controls'>",
    "<div class='player-progress'>",
        "<label for='seek{id}' class='sr-only'>Seek</label>",
        "<input id='seek{id}' class='player-progress-seek' type='range' min='0' max='100' step='0.5' value='0' data-player='seek'>",
        "<progress class='player-progress-played' max='100' value='0'>",
            "<span>0</span>% played",
        "</progress>",
        "<progress class='player-progress-buffer' max='100' value='0'>",
            "<span>0</span>% buffered",
        "</progress>",
    "</div>",
    "<span class='player-controls-left'>",
        "<button type='button' data-player='restart'>",
            "<svg><use xlink:href='#icon-restart'></use></svg>",
            "<span class='sr-only'>Restart</span>",
        "</button>",
        "<button type='button' data-player='rewind'>",
            "<svg><use xlink:href='#icon-rewind'></use></svg>",
            "<span class='sr-only'>Rewind {seektime} secs</span>",
        "</button>",
        "<button type='button' data-player='play'>",
            "<svg><use xlink:href='#icon-play'></use></svg>",
            "<span class='sr-only'>Play</span>",
        "</button>",
        "<button type='button' data-player='pause'>",
            "<svg><use xlink:href='#icon-pause'></use></svg>",
            "<span class='sr-only'>Pause</span>",
        "</button>",
        "<button type='button' data-player='fast-forward'>",
            "<svg><use xlink:href='#icon-fast-forward'></use></svg>",
            "<span class='sr-only'>Forward {seektime} secs</span>",
        "</button>",
        "<span class='player-time'>",
            "<span class='sr-only'>Current time</span>",
            "<span class='player-current-time'>00:00</span>",
        "</span>",
        "<span class='player-time'>",
            "<span class='sr-only'>Duration</span>",
            "<span class='player-duration'>00:00</span>",
        "</span>",
    "</span>",
    "<span class='player-controls-right'>",
        "<button type='button' data-player='mute'>",
            "<svg class='icon-muted'><use xlink:href='#icon-muted'></use></svg>",
            "<svg><use xlink:href='#icon-volume'></use></svg>",
            "<span class='sr-only'>Toggle Mute</span>",
        "</button>",
        "<label for='volume{id}' class='sr-only'>Volume</label>",
        "<input id='volume{id}' class='player-volume' type='range' min='0' max='10' value='5' data-player='volume'>",
        "<button type='button' data-player='captions'>",
            "<svg class='icon-captions-on'><use xlink:href='#icon-captions-on'></use></svg>",
            "<svg><use xlink:href='#icon-captions-off'></use></svg>",
            "<span class='sr-only'>Toggle Captions</span>",
        "</button>",
        "<button type='button' data-player='fullscreen'>",
            "<svg class='icon-exit-fullscreen'><use xlink:href='#icon-exit-fullscreen'></use></svg>",
            "<svg><use xlink:href='#icon-enter-fullscreen'></use></svg>",
            "<span class='sr-only'>Toggle Fullscreen</span>",
        "</button>",
    "</span>",
"</div>"].join("\n");
```
