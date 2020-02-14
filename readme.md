Plyr is a simple, lightweight, accessible and customizable HTML5, YouTube and Vimeo media player that supports [_modern_](#browser-support) browsers.

[Checkout the demo](https://plyr.io) - [Donate](#donate) - [Slack](https://bit.ly/plyr--chat) - [![npm version](https://badge.fury.io/js/plyr.svg)](https://badge.fury.io/js/plyr)

[![Image of Plyr](https://cdn.plyr.io/static/demo/screenshot.png?v=3)](https://plyr.io)

# Features

-   📼 **HTML Video & Audio, YouTube & Vimeo** - support for the major formats
-   💪 **Accessible** - full support for VTT captions and screen readers
-   🔧 **[Customizable](#html)** - make the player look how you want with the markup you want
-   😎 **Clean HTML** - uses the _right_ elements. `<input type="range">` for volume and `<progress>` for progress and well, `<button>`s for buttons. There's no
    `<span>` or `<a href="#">` button hacks
-   📱 **Responsive** - works with any screen size
-   💵 **[Monetization](#ads)** - make money from your videos
-   📹 **[Streaming](#demos)** - support for hls.js, Shaka and dash.js streaming playback
-   🎛 **[API](#api)** - toggle playback, volume, seeking, and more through a standardized API
-   🎤 **[Events](#events)** - no messing around with Vimeo and YouTube APIs, all events are standardized across formats
-   🔎 **[Fullscreen](#fullscreen)** - supports native fullscreen with fallback to "full window" modes
-   ⌨️ **[Shortcuts](#shortcuts)** - supports keyboard shortcuts
-   🖥 **Picture-in-Picture** - supports picture-in-picture mode
-   📱 **Playsinline** - supports the `playsinline` attribute
-   🏎 **Speed controls** - adjust speed on the fly
-   📖 **Multiple captions** - support for multiple caption tracks
-   🌎 **i18n support** - support for internationalization of controls
-   👌 **[Preview thumbnails](#preview-thumbnails)** - support for displaying preview thumbnails
-   🤟 **No frameworks** - written in "vanilla" ES6 JavaScript, no jQuery required
-   💁‍♀️ **SASS** - to include in your build processes

### Demos

You can try Plyr in Codepen using our minimal templates: [HTML5 video](https://codepen.io/pen?template=bKeqpr), [HTML5 audio](https://codepen.io/pen?template=rKLywR), [YouTube](https://codepen.io/pen?template=GGqbbJ), [Vimeo](https://codepen.io/pen?template=bKeXNq). For Streaming we also have example integrations with: [Dash.js](https://codepen.io/pen?template=zaBgBy), [Hls.js](https://codepen.io/pen?template=oyLKQb) and [Shaka Player](https://codepen.io/pen?template=ZRpzZO)

# Quick setup

## HTML

Plyr extends upon the standard [HTML5 media element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) markup so that's all you need for those types.

### HTML5 Video

```html
<video poster="/path/to/poster.jpg" id="player" playsinline controls>
    <source src="/path/to/video.mp4" type="video/mp4" />
    <source src="/path/to/video.webm" type="video/webm" />

    <!-- Captions are optional -->
    <track kind="captions" label="English captions" src="/path/to/captions.vtt" srclang="en" default />
</video>
```

### HTML5 Audio

```html
<audio id="player" controls>
    <source src="/path/to/audio.mp3" type="audio/mp3" />
    <source src="/path/to/audio.ogg" type="audio/ogg" />
</audio>
```

For YouTube and Vimeo players, Plyr uses progressive enhancement to enhance the default `<iframe>` embeds. Below are some examples. The `plyr__video-embed` classname will make the embed responsive. You can add the `autoplay`, `loop`, `hl` (YouTube only) and `playsinline` (YouTube only) query parameters to the URL and they will be set as config options automatically. For YouTube, the `origin` should be updated to reflect the domain you're hosting the embed on, or you can opt to omit it.

### YouTube

We recommend [progressive enhancement](https://www.smashingmagazine.com/2009/04/progressive-enhancement-what-it-is-and-how-to-use-it/) with the embedded players. You can elect to use an `<iframe>` as the source element (which Plyr will progressively enhance) or a bog standard `<div>` with two essential data attributes - `data-plyr-provider` and `data-plyr-embed-id`.

```html
<div class="plyr__video-embed" id="player">
    <iframe
        src="https://www.youtube.com/embed/bTqVqk7FSmY?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1"
        allowfullscreen
        allowtransparency
        allow="autoplay"
    ></iframe>
</div>
```

_Note_: The `plyr__video-embed` classname will make the player a responsive 16:9 (most common) iframe embed. When plyr itself kicks in, your custom `ratio` config option will be used.

Or the `<div>` non progressively enhanced method:

```html
<div id="player" data-plyr-provider="youtube" data-plyr-embed-id="bTqVqk7FSmY"></div>
```

_Note_: The `data-plyr-embed-id` can either be the video ID or URL for the media.

### Vimeo

Much the same as YouTube above.

```html
<div class="plyr__video-embed" id="player">
    <iframe
        src="https://player.vimeo.com/video/76979871?loop=false&amp;byline=false&amp;portrait=false&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media"
        allowfullscreen
        allowtransparency
        allow="autoplay"
    ></iframe>
</div>
```

Or the `<div>` non progressively enhanced method:

```html
<div id="player" data-plyr-provider="vimeo" data-plyr-embed-id="76979871"></div>
```

## JavaScript

You can use Plyr as an ES6 module as follows:

```javascript
import Plyr from 'plyr';

const player = new Plyr('#player');
```

Alternatively you can include the `plyr.js` script before the closing `</body>` tag and then in your JS create a new instance of Plyr as below.

```html
<script src="path/to/plyr.js"></script>
<script>
    const player = new Plyr('#player');
</script>
```

See [initialising](#initialising) for more information on advanced setups.

You can use our CDN (provided by [Fastly](https://www.fastly.com/)) for the JavaScript. There's 2 versions; one with and one without [polyfills](#polyfills). My recommendation would be to manage polyfills seperately as part of your application but to make life easier you can use the polyfilled build.

```html
<script src="https://cdn.plyr.io/3.5.10/plyr.js"></script>
```

...or...

```html
<script src="https://cdn.plyr.io/3.5.10/plyr.polyfilled.js"></script>
```

## CSS

Include the `plyr.css` stylsheet into your `<head>`.

```html
<link rel="stylesheet" href="path/to/plyr.css" />
```

If you want to use our CDN (provided by [Fastly](https://www.fastly.com/)) for the default CSS, you can use the following:

```html
<link rel="stylesheet" href="https://cdn.plyr.io/3.5.10/plyr.css" />
```

## SVG Sprite

The SVG sprite is loaded automatically from our CDN (provided by [Fastly](https://www.fastly.com/)). To change this, see the [options](#options) below. For
reference, the CDN hosted SVG sprite can be found at `https://cdn.plyr.io/3.5.10/plyr.svg`.

# Ads

Plyr has partnered up with [vi.ai](https://vi.ai/publisher-video-monetization/?aid=plyrio) to offer monetization options for your videos. Getting setup is easy:

-   [Sign up for a vi.ai account](https://vi.ai/publisher-video-monetization/?aid=plyrio)
-   Grab your publisher ID from the code snippet
-   Enable ads in the [config options](#options) and enter your publisher ID

Any questions regarding the ads can be sent straight to vi.ai and any issues with rendering raised through GitHub issues.

# Advanced

## SASS

You can use `bundle.scss` file included in `/src` as part of your build and change variables to suit your design. The SASS require you to
use the [autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer) plugin (you should be already!) as all declarations use the W3C definitions.

The HTML markup uses the BEM methodology with `plyr` as the block, e.g. `.plyr__controls`. You can change the class hooks in the options to match any custom CSS
you write. Check out the JavaScript source for more on this.

## SVG

The icons used in the Plyr controls are loaded in an SVG sprite. The sprite is automatically loaded from our CDN by default. If you already have an icon build
system in place, you can include the source plyr icons (see `/src/sprite` for source icons).

### Using the `iconUrl` option

You can however specify your own `iconUrl` option and Plyr will determine if the url is absolute and requires loading by AJAX/CORS due to current browser
limitations or if it's a relative path, just use the path directly.

If you're using the `<base>` tag on your site, you may need to use something like this: [svgfixer.js](https://gist.github.com/leonderijke/c5cf7c5b2e424c0061d2)

More info on SVG sprites here: [http://css-tricks.com/svg-sprites-use-better-icon-fonts/](http://css-tricks.com/svg-sprites-use-better-icon-fonts/) and the AJAX
technique here: [http://css-tricks.com/ajaxing-svg-sprite/](http://css-tricks.com/ajaxing-svg-sprite/)

## Cross Origin (CORS)

You'll notice the `crossorigin` attribute on the example `<video>` elements. This is because the TextTrack captions are loaded from another domain. If your
TextTrack captions are also hosted on another domain, you will need to add this attribute and make sure your host has the correct headers setup. For more info
on CORS checkout the MDN docs:
[https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)

## Captions

WebVTT captions are supported. To add a caption track, check the HTML example above and look for the `<track>` element. Be sure to
[validate your caption files](https://quuz.org/webvtt/).

## JavaScript

### Initialising

You can specify a range of arguments for the constructor to use:

-   A [CSS string selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)
-   A [`HTMLElement`](https://developer.mozilla.org/en/docs/Web/API/HTMLElement)
-   A [jQuery](https://jquery.com) object

_Note_: If a `NodeList`, `Array`, or jQuery object are passed, the first element will be used for setup. To setup multiple players, see [multiple players](#multiple-players) below.

#### Single player

Passing a CSS string selector that's compatible with [`querySelector`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector):

```javascript
const player = new Plyr('#player');
```

Passing a [HTMLElement](https://developer.mozilla.org/en/docs/Web/API/HTMLElement):

```javascript
const player = new Plyr(document.getElementById('player'));
```

```javascript
const player = new Plyr(document.querySelector('.js-player'));
```

The HTMLElement or string selector can be the target `<video>`, `<audio>`, or `<div>` wrapper for embeds.

#### Multiple players

You have two choices here. You can either use a simple array loop to map the constructor:

```javascript
const players = Array.from(document.querySelectorAll('.js-player')).map(p => new Plyr(p));
```

...or use a static method where you can pass a [CSS string selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors), a [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList), an [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) of [HTMLElement](https://developer.mozilla.org/en/docs/Web/API/HTMLElement), or a [JQuery](https://jquery.com) object:

```javascript
const players = Plyr.setup('.js-player');
```

Both options will also return an array of instances in the order of they were in the DOM for the string selector or the source NodeList or Array.

#### Options

The second argument for the constructor is the [options](#options) object:

```javascript
const player = new Plyr('#player', {
    title: 'Example Title',
});
```

Options can be passed as an object to the constructor as above or as JSON in `data-plyr-config` attribute on each of your target elements:

```html
<video src="/path/to/video.mp4" id="player" controls data-plyr-config='{ "title": "Example Title" }'></video>
```

Note the single quotes encapsulating the JSON and double quotes on the object keys. Only string values need double quotes.

| Option               | Type                       | Default                                                                                                                        | Description                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enabled`            | Boolean                    | `true`                                                                                                                         | Completely disable Plyr. This would allow you to do a User Agent check or similar to programmatically enable or disable Plyr for a certain UA. Example below.                                                                                                                                                                                                                                           |
| `debug`              | Boolean                    | `false`                                                                                                                        | Display debugging information in the console                                                                                                                                                                                                                                                                                                                                                            |
| `controls`           | Array, Function or Element | `['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen']` | If a function is passed, it is assumed your method will return either an element or HTML string for the controls. Three arguments will be passed to your function; `id` (the unique id for the player), `seektime` (the seektime step in seconds), and `title` (the media title). See [controls.md](controls.md) for more info on how the html needs to be structured.                                  |
| `settings`           | Array                      | `['captions', 'quality', 'speed', 'loop']`                                                                                     | If the default controls are used, you can specify which settings to show in the menu                                                                                                                                                                                                                                                                                                                    |
| `i18n`               | Object                     | See [defaults.js](/src/js/config/defaults.js)                                                                                  | Used for internationalization (i18n) of the text within the UI.                                                                                                                                                                                                                                                                                                                                         |
| `loadSprite`         | Boolean                    | `true`                                                                                                                         | Load the SVG sprite specified as the `iconUrl` option (if a URL). If `false`, it is assumed you are handling sprite loading yourself.                                                                                                                                                                                                                                                                   |
| `iconUrl`            | String                     | `null`                                                                                                                         | Specify a URL or path to the SVG sprite. See the [SVG section](#svg) for more info.                                                                                                                                                                                                                                                                                                                     |
| `iconPrefix`         | String                     | `plyr`                                                                                                                         | Specify the id prefix for the icons used in the default controls (e.g. "plyr-play" would be "plyr"). This is to prevent clashes if you're using your own SVG sprite but with the default controls. Most people can ignore this option.                                                                                                                                                                  |
| `blankVideo`         | String                     | `https://cdn.plyr.io/static/blank.mp4`                                                                                         | Specify a URL or path to a blank video file used to properly cancel network requests.                                                                                                                                                                                                                                                                                                                   |
| `autoplay`&sup2;     | Boolean                    | `false`                                                                                                                        | Autoplay the media on load. If the `autoplay` attribute is present on a `<video>` or `<audio>` element, this will be automatically set to true.                                                                                                                                                                                                                                                         |
| `autopause`&sup1;    | Boolean                    | `true`                                                                                                                         | Only allow one player playing at once.                                                                                                                                                                                                                                                                                                                                                                  |
| `seekTime`           | Number                     | `10`                                                                                                                           | The time, in seconds, to seek when a user hits fast forward or rewind.                                                                                                                                                                                                                                                                                                                                  |
| `volume`             | Number                     | `1`                                                                                                                            | A number, between 0 and 1, representing the initial volume of the player.                                                                                                                                                                                                                                                                                                                               |
| `muted`              | Boolean                    | `false`                                                                                                                        | Whether to start playback muted. If the `muted` attribute is present on a `<video>` or `<audio>` element, this will be automatically set to true.                                                                                                                                                                                                                                                       |
| `clickToPlay`        | Boolean                    | `true`                                                                                                                         | Click (or tap) of the video container will toggle play/pause.                                                                                                                                                                                                                                                                                                                                           |
| `disableContextMenu` | Boolean                    | `true`                                                                                                                         | Disable right click menu on video to <em>help</em> as very primitive obfuscation to prevent downloads of content.                                                                                                                                                                                                                                                                                       |
| `hideControls`       | Boolean                    | `true`                                                                                                                         | Hide video controls automatically after 2s of no mouse or focus movement, on control element blur (tab out), on playback start or entering fullscreen. As soon as the mouse is moved, a control element is focused or playback is paused, the controls reappear instantly.                                                                                                                              |
| `resetOnEnd`         | Boolean                    | false                                                                                                                          | Reset the playback to the start once playback is complete.                                                                                                                                                                                                                                                                                                                                              |
| `keyboard`           | Object                     | `{ focused: true, global: false }`                                                                                             | Enable [keyboard shortcuts](#shortcuts) for focused players only or globally                                                                                                                                                                                                                                                                                                                            |
| `tooltips`           | Object                     | `{ controls: false, seek: true }`                                                                                              | `controls`: Display control labels as tooltips on `:hover` & `:focus` (by default, the labels are screen reader only). `seek`: Display a seek tooltip to indicate on click where the media would seek to.                                                                                                                                                                                               |
| `duration`           | Number                     | `null`                                                                                                                         | Specify a custom duration for media.                                                                                                                                                                                                                                                                                                                                                                    |
| `displayDuration`    | Boolean                    | `true`                                                                                                                         | Displays the duration of the media on the "metadataloaded" event (on startup) in the current time display. This will only work if the `preload` attribute is not set to `none` (or is not set at all) and you choose not to display the duration (see `controls` option).                                                                                                                               |
| `invertTime`         | Boolean                    | `true`                                                                                                                         | Display the current time as a countdown rather than an incremental counter.                                                                                                                                                                                                                                                                                                                             |
| `toggleInvert`       | Boolean                    | `true`                                                                                                                         | Allow users to click to toggle the above.                                                                                                                                                                                                                                                                                                                                                               |
| `listeners`          | Object                     | `null`                                                                                                                         | Allows binding of event listeners to the controls before the default handlers. See the `defaults.js` for available listeners. If your handler prevents default on the event (`event.preventDefault()`), the default handler will not fire.                                                                                                                                                              |
| `captions`           | Object                     | `{ active: false, language: 'auto', update: false }`                                                                           | `active`: Toggles if captions should be active by default. `language`: Sets the default language to load (if available). 'auto' uses the browser language. `update`: Listen to changes to tracks and update menu. This is needed for some streaming libraries, but can result in unselectable language options).                                                                                        |
| `fullscreen`         | Object                     | `{ enabled: true, fallback: true, iosNative: false }`                                                                          | `enabled`: Toggles whether fullscreen should be enabled. `fallback`: Allow fallback to a full-window solution (`true`/`false`/`'force'`). `iosNative`: whether to use native iOS fullscreen when entering fullscreen (no custom controls)                                                                                                                                                               |
| `ratio`              | String                     | `null`                                                                                                                         | Force an aspect ratio for all videos. The format is `'w:h'` - e.g. `'16:9'` or `'4:3'`. If this is not specified then the default for HTML5 and Vimeo is to use the native resolution of the video. As dimensions are not available from YouTube via SDK, 16:9 is forced as a sensible default.                                                                                                         |
| `storage`            | Object                     | `{ enabled: true, key: 'plyr' }`                                                                                               | `enabled`: Allow use of local storage to store user settings. `key`: The key name to use.                                                                                                                                                                                                                                                                                                               |
| `speed`              | Object                     | `{ selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] }`                                                                 | `selected`: The default speed for playback. `options`: The speed options to display in the UI. YouTube and Vimeo will ignore any options outside of the 0.5-2 range, so options outside of this range will be hidden automatically.                                                                                                                                                                     |
| `quality`            | Object                     | `{ default: 576, options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240] }`                                           | `default` is the default quality level (if it exists in your sources). `options` are the options to display. This is used to filter the available sources.                                                                                                                                                                                                                                              |
| `loop`               | Object                     | `{ active: false }`                                                                                                            | `active`: Whether to loop the current video. If the `loop` attribute is present on a `<video>` or `<audio>` element, this will be automatically set to true This is an object to support future functionality.                                                                                                                                                                                          |
| `ads`                | Object                     | `{ enabled: false, publisherId: '' }`                                                                                          | `enabled`: Whether to enable advertisements. `publisherId`: Your unique [vi.ai](https://vi.ai/publisher-video-monetization/?aid=plyrio) publisher ID.                                                                                                                                                                                                                                                   |
| `urls`               | Object                     | See source.                                                                                                                    | If you wish to override any API URLs then you can do so here. You can also set a custom download URL for the download button.                                                                                                                                                                                                                                                                           |
| `vimeo`              | Object                     | `{ byline: false, portrait: false, title: false, speed: true, transparent: false }`                                            | See [Vimeo embed options](https://github.com/vimeo/player.js/#embed-options). Some are set automatically based on other config options, namely: `loop`, `autoplay`, `muted`, `gesture`, `playsinline`                                                                                                                                                                                                   |
| `youtube`            | Object                     | `{ noCookie: false, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1 }`                                               | See [YouTube embed options](https://developers.google.com/youtube/player_parameters#Parameters). The only custom option is `noCookie` to use an alternative to YouTube that doesn't use cookies (useful for GDPR, etc). Some are set automatically based on other config options, namely: `autoplay`, `hl`, `controls`, `disablekb`, `playsinline`, `cc_load_policy`, `cc_lang_pref`, `widget_referrer` |
| `previewThumbnails`  | Object                     | `{ enabled: false, src: '' }`                                                                                                  | `enabled`: Whether to enable the preview thumbnails (they must be generated by you). `src` must be either a string or an array of strings representing URLs for the VTT files containing the image URL(s). Learn more about [preview thumbnails](#preview-thumbnails) below.                                                                                                                            |

1.  Vimeo only
2.  Autoplay is generally not recommended as it is seen as a negative user experience. It is also disabled in many browsers. Before raising issues, do your homework. More info can be found here:

-   https://webkit.org/blog/6784/new-video-policies-for-ios/
-   https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
-   https://hacks.mozilla.org/2019/02/firefox-66-to-block-automatically-playing-audible-video-and-audio/

# API

There are methods, setters and getters on a Plyr object.

## Object

The easiest way to access the Plyr object is to set the return value from your call to the constructor to a variable. For example:

```javascript
const player = new Plyr('#player', {
    /* options */
});
```

You can also access the object through any events:

```javascript
element.addEventListener('ready', event => {
    const player = event.detail.plyr;
});
```

## Methods

Example method use:

```javascript
player.play(); // Start playback
player.fullscreen.enter(); // Enter fullscreen
```

| Method                   | Parameters       | Description                                                                                                |
| ------------------------ | ---------------- | ---------------------------------------------------------------------------------------------------------- |
| `play()`&sup1;           | -                | Start playback.                                                                                            |
| `pause()`                | -                | Pause playback.                                                                                            |
| `togglePlay(toggle)`     | Boolean          | Toggle playback, if no parameters are passed, it will toggle based on current status.                      |
| `stop()`                 | -                | Stop playback and reset to start.                                                                          |
| `restart()`              | -                | Restart playback.                                                                                          |
| `rewind(seekTime)`       | Number           | Rewind playback by the specified seek time. If no parameter is passed, the default seek time will be used. |
| `forward(seekTime)`      | Number           | Fast forward by the specified seek time. If no parameter is passed, the default seek time will be used.    |
| `increaseVolume(step)`   | Number           | Increase volume by the specified step. If no parameter is passed, the default step will be used.           |
| `decreaseVolume(step)`   | Number           | Increase volume by the specified step. If no parameter is passed, the default step will be used.           |
| `toggleCaptions(toggle)` | Boolean          | Toggle captions display. If no parameter is passed, it will toggle based on current status.                |
| `fullscreen.enter()`     | -                | Enter fullscreen. If fullscreen is not supported, a fallback "full window/viewport" is used instead.       |
| `fullscreen.exit()`      | -                | Exit fullscreen.                                                                                           |
| `fullscreen.toggle()`    | -                | Toggle fullscreen.                                                                                         |
| `airplay()`              | -                | Trigger the airplay dialog on supported devices.                                                           |
| `toggleControls(toggle)` | Boolean          | Toggle the controls (video only). Takes optional truthy value to force it on/off.                          |
| `on(event, function)`    | String, Function | Add an event listener for the specified event.                                                             |
| `once(event, function)`  | String, Function | Add an event listener for the specified event once.                                                        |
| `off(event, function)`   | String, Function | Remove an event listener for the specified event.                                                          |
| `supports(type)`         | String           | Check support for a mime type.                                                                             |
| `destroy()`              | -                | Destroy the instance and garbage collect any elements.                                                     |

1.  For HTML5 players, `play()` will return a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) in _some_ browsers - WebKit and Mozilla [according to MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) at time of writing.

## Getters and Setters

Example setters:

```javascript
player.volume = 0.5; // Sets volume at 50%
player.currentTime = 10; // Seeks to 10 seconds
```

Example getters:

```javascript
player.volume; // 0.5;
player.currentTime; // 10
player.fullscreen.active; // false;
```

| Property             | Getter | Setter | Description                                                                                                                                                                                                                                                                                                                            |
| -------------------- | ------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isHTML5`            | ✓      | -      | Returns a boolean indicating if the current player is HTML5.                                                                                                                                                                                                                                                                           |
| `isEmbed`            | ✓      | -      | Returns a boolean indicating if the current player is an embedded player.                                                                                                                                                                                                                                                              |
| `playing`            | ✓      | -      | Returns a boolean indicating if the current player is playing.                                                                                                                                                                                                                                                                         |
| `paused`             | ✓      | -      | Returns a boolean indicating if the current player is paused.                                                                                                                                                                                                                                                                          |
| `stopped`            | ✓      | -      | Returns a boolean indicating if the current player is stopped.                                                                                                                                                                                                                                                                         |
| `ended`              | ✓      | -      | Returns a boolean indicating if the current player has finished playback.                                                                                                                                                                                                                                                              |
| `buffered`           | ✓      | -      | Returns a float between 0 and 1 indicating how much of the media is buffered                                                                                                                                                                                                                                                           |
| `currentTime`        | ✓      | ✓      | Gets or sets the currentTime for the player. The setter accepts a float in seconds.                                                                                                                                                                                                                                                    |
| `seeking`            | ✓      | -      | Returns a boolean indicating if the current player is seeking.                                                                                                                                                                                                                                                                         |
| `duration`           | ✓      | -      | Returns the duration for the current media.                                                                                                                                                                                                                                                                                            |
| `volume`             | ✓      | ✓      | Gets or sets the volume for the player. The setter accepts a float between 0 and 1.                                                                                                                                                                                                                                                    |
| `muted`              | ✓      | ✓      | Gets or sets the muted state of the player. The setter accepts a boolean.                                                                                                                                                                                                                                                              |
| `hasAudio`           | ✓      | -      | Returns a boolean indicating if the current media has an audio track.                                                                                                                                                                                                                                                                  |
| `speed`              | ✓      | ✓      | Gets or sets the speed for the player. The setter accepts a value in the options specified in your config. Generally the minimum should be 0.5.                                                                                                                                                                                        |
| `quality`&sup1;      | ✓      | ✓      | Gets or sets the quality for the player. The setter accepts a value from the options specified in your config.                                                                                                                                                                                                                         |
| `loop`               | ✓      | ✓      | Gets or sets the current loop state of the player. The setter accepts a boolean.                                                                                                                                                                                                                                                       |
| `source`             | ✓      | ✓      | Gets or sets the current source for the player. The setter accepts an object. See [source setter](#the-source-setter) below for examples.                                                                                                                                                                                              |
| `poster`             | ✓      | ✓      | Gets or sets the current poster image for the player. The setter accepts a string; the URL for the updated poster image.                                                                                                                                                                                                               |
| `autoplay`           | ✓      | ✓      | Gets or sets the autoplay state of the player. The setter accepts a boolean.                                                                                                                                                                                                                                                           |
| `currentTrack`       | ✓      | ✓      | Gets or sets the caption track by index. `-1` means the track is missing or captions is not active                                                                                                                                                                                                                                     |
| `language`           | ✓      | ✓      | Gets or sets the preferred captions language for the player. The setter accepts an ISO two-letter language code. Support for the languages is dependent on the captions you include. If your captions don't have any language data, or if you have multiple tracks with the same language, you may want to use `currentTrack` instead. |
| `fullscreen.active`  | ✓      | -      | Returns a boolean indicating if the current player is in fullscreen mode.                                                                                                                                                                                                                                                              |
| `fullscreen.enabled` | ✓      | -      | Returns a boolean indicating if the current player has fullscreen enabled.                                                                                                                                                                                                                                                             |
| `pip`&sup1;          | ✓      | ✓      | Gets or sets the picture-in-picture state of the player. The setter accepts a boolean. This currently only supported on Safari 10+ (on MacOS Sierra+ and iOS 10+) and Chrome 70+.                                                                                                                                                      |
| `ratio`              | ✓      | ✓      | Gets or sets the video aspect ratio. The setter accepts a string in the same format as the `ratio` option.                                                                                                                                                                                                                             |
| `download`           | ✓      | ✓      | Gets or sets the URL for the download button. The setter accepts a string containing a valid absolute URL.                                                                                                                                                                                                                             |

1.  HTML5 only

### The `.source` setter

This allows changing the player source and type on the fly.

Video example:

```javascript
player.source = {
    type: 'video',
    title: 'Example title',
    sources: [
        {
            src: '/path/to/movie.mp4',
            type: 'video/mp4',
            size: 720,
        },
        {
            src: '/path/to/movie.webm',
            type: 'video/webm',
            size: 1080,
        },
    ],
    poster: '/path/to/poster.jpg',
    previewThumbnails: {
        src: '/path/to/thumbnails.vtt'
    },
    tracks: [
        {
            kind: 'captions',
            label: 'English',
            srclang: 'en',
            src: '/path/to/captions.en.vtt',
            default: true,
        },
        {
            kind: 'captions',
            label: 'French',
            srclang: 'fr',
            src: '/path/to/captions.fr.vtt',
        },
    ],
};
```

Audio example:

```javascript
player.source = {
    type: 'audio',
    title: 'Example title',
    sources: [
        {
            src: '/path/to/audio.mp3',
            type: 'audio/mp3',
        },
        {
            src: '/path/to/audio.ogg',
            type: 'audio/ogg',
        },
    ],
};
```

YouTube example:

```javascript
player.source = {
    type: 'video',
    sources: [
        {
            src: 'bTqVqk7FSmY',
            provider: 'youtube',
        },
    ],
};
```

_Note_: `src` can be the video ID or URL

Vimeo example

```javascript
player.source = {
    type: 'video',
    sources: [
        {
            src: '143418951',
            provider: 'vimeo',
        },
    ],
};
```

_Note:_ `src` property for YouTube and Vimeo can either be the video ID or the whole URL.

| Property                  | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                    | String | Either `video` or `audio`. _Note:_ YouTube and Vimeo are currently not supported as audio sources.                                                                                                                                                                                                                                                                                                             |
| `title`                   | String | _Optional._ Title of the new media. Used for the `aria-label` attribute on the play button, and outer container. YouTube and Vimeo are populated automatically.                                                                                                                                                                                                                                                |
| `sources`                 | Array  | This is an array of sources. For HTML5 media, the properties of this object are mapped directly to HTML attributes so more can be added to the object if required.                                                                                                                                                                                                                                             |
| `poster`&sup1;            | String | The URL for the poster image (HTML5 video only).                                                                                                                                                                                                                                                                                                                                                               |
| `tracks`&sup1;            | String | An array of track objects. Each element in the array is mapped directly to a track element and any keys mapped directly to HTML attributes so as in the example above, it will render as `<track kind="captions" label="English" srclang="en" src="https://cdn.selz.com/plyr/1.0/example_captions_en.vtt" default>` and similar for the French version. Booleans are converted to HTML5 value-less attributes. |
| `previewThumbnails`&sup1; | Object | The same object like in the `previewThumbnails` constructor option. This means you can either change the thumbnails vtt via the `src` key or disable the thumbnails plugin for the next video by passing `{ enabled: false }`.                                                                                                                                                                                 |

1.  HTML5 only

# Events

You can listen for events on the target element you setup Plyr on (see example under the table). Some events only apply to HTML5 audio and video. Using your
reference to the instance, you can use the `on()` API method or `addEventListener()`. Access to the API can be obtained this way through the `event.detail.plyr`
property. Here's an example:

```javascript
player.on('ready', event => {
    const instance = event.detail.plyr;
});
```

## Standard Media Events

| Event Type         | Description                                                                                                                                                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `progress`         | Sent periodically to inform interested parties of progress downloading the media. Information about the current amount of the media that has been downloaded is available in the media element's `buffered` attribute. |
| `playing`          | Sent when the media begins to play (either for the first time, after having been paused, or after ending and then restarting).                                                                                         |
| `play`             | Sent when playback of the media starts after having been paused; that is, when playback is resumed after a prior `pause` event.                                                                                        |
| `pause`            | Sent when playback is paused.                                                                                                                                                                                          |
| `timeupdate`       | The time indicated by the element's `currentTime` attribute has changed.                                                                                                                                               |
| `volumechange`     | Sent when the audio volume changes (both when the volume is set and when the `muted` state is changed).                                                                                                                |
| `seeking`          | Sent when a seek operation begins.                                                                                                                                                                                     |
| `seeked`           | Sent when a seek operation completes.                                                                                                                                                                                  |
| `ratechange`       | Sent when the playback speed changes.                                                                                                                                                                                  |
| `ended`            | Sent when playback completes. _Note:_ This does not fire if `autoplay` is true.                                                                                                                                        |
| `enterfullscreen`  | Sent when the player enters fullscreen mode (either the proper fullscreen or full-window fallback for older browsers).                                                                                                 |
| `exitfullscreen`   | Sent when the player exits fullscreen mode.                                                                                                                                                                            |
| `captionsenabled`  | Sent when captions are enabled.                                                                                                                                                                                        |
| `captionsdisabled` | Sent when captions are disabled.                                                                                                                                                                                       |
| `languagechange`   | Sent when the caption language is changed.                                                                                                                                                                             |
| `controlshidden`   | Sent when the controls are hidden.                                                                                                                                                                                     |
| `controlsshown`    | Sent when the controls are shown.                                                                                                                                                                                      |
| `ready`            | Triggered when the instance is ready for API calls.                                                                                                                                                                    |

### HTML5 only

| Event Type       | Description                                                                                                                                                                                                                                                                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `loadstart`      | Sent when loading of the media begins.                                                                                                                                                                                                                                                                                                         |
| `loadeddata`     | The first frame of the media has finished loading.                                                                                                                                                                                                                                                                                             |
| `loadedmetadata` | The media's metadata has finished loading; all attributes now contain as much useful information as they're going to.                                                                                                                                                                                                                          |
| `qualitychange`  | The quality of playback has changed.                                                                                                                                                                                                                                                                                                           |
| `canplay`        | Sent when enough data is available that the media can be played, at least for a couple of frames. This corresponds to the `HAVE_ENOUGH_DATA` `readyState`.                                                                                                                                                                                     |
| `canplaythrough` | Sent when the ready state changes to `CAN_PLAY_THROUGH`, indicating that the entire media can be played without interruption, assuming the download rate remains at least at the current level. _Note:_ Manually setting the `currentTime` will eventually fire a `canplaythrough` event in firefox. Other browsers might not fire this event. |
| `stalled`        | Sent when the user agent is trying to fetch media data, but data is unexpectedly not forthcoming.                                                                                                                                                                                                                                              |
| `waiting`        | Sent when the requested operation (such as playback) is delayed pending the completion of another operation (such as a seek).                                                                                                                                                                                                                  |
| `emptied`        | he media has become empty; for example, this event is sent if the media has already been loaded (or partially loaded), and the `load()` method is called to reload it.                                                                                                                                                                         |
| `cuechange`      | Sent when a `TextTrack` has changed the currently displaying cues.                                                                                                                                                                                                                                                                             |
| `error`          | Sent when an error occurs. The element's `error` attribute contains more information.                                                                                                                                                                                                                                                          |

### YouTube only

| Event Type    | Description                                                                                                                                                                                                                                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `statechange` | The state of the player has changed. The code can be accessed via `event.detail.code`. Possible values are `-1`: Unstarted, `0`: Ended, `1`: Playing, `2`: Paused, `3`: Buffering, `5`: Video cued. See the [YouTube Docs](https://developers.google.com/youtube/iframe_api_reference#onStateChange) for more information. |

_Note:_ These events also bubble up the DOM. The event target will be the container element.

Some event details borrowed from [MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events).

# Embeds

YouTube and Vimeo are currently supported and function much like a HTML5 video. Similar events and API methods are available for all types. However if you wish
to access the API's directly. You can do so via the `embed` property of your player object - e.g. `player.embed`. You can then use the relevant methods from the
third party APIs. More info on the respective API's here:

-   [YouTube iframe API Reference](https://developers.google.com/youtube/iframe_api_reference)
-   [Vimeo player.js Reference](https://github.com/vimeo/player.js)

_Note_: Not all API methods may work 100%. Your mileage may vary. It's better to use the Plyr API where possible.

# Shortcuts

By default, a player will bind the following keyboard shortcuts when it has focus. If you have the `global` option to `true` and there's only one player in the
document then the shortcuts will work when any element has focus, apart from an element that requires input.

| Key        | Action                                 |
| ---------- | -------------------------------------- |
| `0` to `9` | Seek from 0 to 90% respectively        |
| `space`    | Toggle playback                        |
| `K`        | Toggle playback                        |
| &larr;     | Seek backward by the `seekTime` option |
| &rarr;     | Seek forward by the `seekTime` option  |
| &uarr;     | Increase volume                        |
| &darr;     | Decrease volume                        |
| `M`        | Toggle mute                            |
| `F`        | Toggle fullscreen                      |
| `C`        | Toggle captions                        |
| `L`        | Toggle loop                            |

# Preview thumbnails

It's possible to display preview thumbnails as per the demo when you hover over the scrubber or while you are scrubbing in the main video area. This can be used for all video types but is easiest with HTML5 of course. You will need to generate the sprite or images yourself. This is possible using something like AWS transcoder to generate the frames and then combine them into a sprite image. Sprites are recommended for performance reasons - they will be much faster to download and easier to compress into a small file size making them load faster.

You can see the example VTT files [here](https://cdn.plyr.io/static/demo/thumbs/100p.vtt) and [here](https://cdn.plyr.io/static/demo/thumbs/240p.vtt) for how the sprites are done. The coordinates are set as the `xywh` hash on the URL in the order X Offset, Y Offset, Width, Height (e.g. `240p-00001.jpg#xywh=1708,480,427,240` is offset `1708px` from the left, `480px` from the top and is `427x240px`. If you want to include images per frame, this is also possible but will be slower, resulting in a degraded experience.

# Fullscreen

Fullscreen in Plyr is supported by all browsers that [currently support it](http://caniuse.com/#feat=fullscreen).

# Browser support

Plyr supports the last 2 versions of most _modern_ browsers.

| Browser       | Supported       |
| ------------- | --------------- |
| Safari        | ✓               |
| Mobile Safari | ✓&sup1;         |
| Firefox       | ✓               |
| Chrome        | ✓               |
| Opera         | ✓               |
| Edge          | ✓               |
| IE11          | ✓&sup3;         |
| IE10          | ✓<sup>2,3</sup> |

1.  Mobile Safari on the iPhone forces the native player for `<video>` unless the `playsinline` attribute is present. Volume controls are also disabled as they are handled device wide.
2.  Native player used (no support for `<progress>` or `<input type="range">`) but the API is supported. No native fullscreen support, fallback can be used (see [options](#options)).
3.  Polyfills required. See below.

## Polyfills

Plyr uses ES6 which isn't supported in all browsers quite yet. This means some features will need to be polyfilled to be available otherwise you'll run into issues. We've elected to not burden the ~90% of users that do support these features with extra JS and instead leave polyfilling to you to work out based on your needs. The easiest method I've found is to use [polyfill.io](https://polyfill.io) which provides polyfills based on user agent. This is the method the demo uses.

## Checking for support

You can use the static method to check for support. For example

```javascript
const supported = Plyr.supported('video', 'html5', true);
```

The arguments are:

-   Media type (`audio` or `video`)
-   Provider (`html5`, `youtube` or `vimeo`)
-   Whether the player has the `playsinline` attribute (only applicable to iOS 10+)

## Disable support programmatically

The `enabled` option can be used to disable certain User Agents. For example, if you don't want to use Plyr for smartphones, you could use:

```javascript
{
    enabled: /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
}
```

If a User Agent is disabled but supports `<video>` and `<audio>` natively, it will use the native player.

# Plugins & Components

Some awesome folks have made plugins for CMSs and Components for JavaScript frameworks:

| Type      | Maintainer                                                                | Link                                                                                         |
| --------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| WordPress | Brandon Lavigne ([@drrobotnik](https://github.com/drrobotnik))            | [https://wordpress.org/plugins/plyr/](https://wordpress.org/plugins/plyr/)                   |
| Angular   | Simon Bobrov ([@smnbbrv](https://github.com/smnbbrv))                     | [https://github.com/smnbbrv/ngx-plyr](https://github.com/smnbbrv/ngx-plyr)                   |
| React     | Chintan Prajapati ([@chintan9](https://github.com/chintan9))              | [https://github.com/chintan9/plyr-react](https://github.com/chintan9/plyr-react)             |
| Vue       | Gabe Dunn ([@redxtech](https://github.com/redxtech))                      | [https://github.com/redxtech/vue-plyr](https://github.com/redxtech/vue-plyr)                 |
| Neos      | Jon Uhlmann ([@jonnitto](https://github.com/jonnitto))                    | [https://packagist.org/packages/jonnitto/plyr](https://packagist.org/packages/jonnitto/plyr) |
| Kirby     | Dominik Pschenitschni ([@dpschen](https://github.com/dpschen))            | [https://github.com/dpschen/kirby-plyrtag](https://github.com/dpschen/kirby-plyrtag)         |
| REDAXO    | FriendsOfRedaxo / skerbis ([@skerbis](https://friendsofredaxo.github.io)) | [https://github.com/FriendsOfREDAXO/plyr](https://github.com/FriendsOfREDAXO/plyr)           |

# Issues

If you find anything weird with Plyr, please let us know using the GitHub issues tracker.

# Author

Plyr is developed by [@sam_potts](https://twitter.com/sam_potts) / [sampotts.me](http://sampotts.me) with help from the awesome
[contributors](https://github.com/sampotts/plyr/graphs/contributors)

# Donate

Plyr costs money to run, not only my time. I donate my time for free as I enjoy building Plyr but unfortunately have to pay for domains, hosting, and more. Any help with costs is appreciated...

-   [Donate via Patreon](https://www.patreon.com/plyr)
-   [Donate via PayPal](https://www.paypal.me/pottsy/20usd)

# Mentions

-   [ProductHunt](https://www.producthunt.com/tech/plyr)
-   [The Changelog](http://thechangelog.com/plyr-simple-html5-media-player-custom-controls-webvtt-captions/)
-   [HTML5 Weekly #177](http://html5weekly.com/issues/177)
-   [Responsive Design #149](http://us4.campaign-archive2.com/?u=559bc631fe5294fc66f5f7f89&id=451a61490f)
-   [Web Design Weekly #174](https://web-design-weekly.com/2015/02/24/web-design-weekly-174/)
-   [Front End Focus #177](https://frontendfoc.us/issues/177)
-   [Hacker News](https://news.ycombinator.com/item?id=9136774)
-   [Web Platform Daily](http://webplatformdaily.org/releases/2015-03-04)
-   [LayerVault Designer News](https://news.layervault.com/stories/45394-plyr--a-simple-html5-media-player)
-   [The Treehouse Show #131](https://teamtreehouse.com/library/episode-131-origami-react-responsive-hero-images)
-   [noupe.com](http://www.noupe.com/design/html5-plyr-is-a-responsive-and-accessible-video-player-94389.html)

# Used by

-   [Selz.com](https://selz.com)
-   [Peugeot.fr](http://www.peugeot.fr/marque-et-technologie/technologies/peugeot-i-cockpit.html)
-   [Peugeot.de](http://www.peugeot.de/modelle/modellberater/208-3-turer/fotos-videos.html)
-   [TomTom.com](http://prioritydriving.tomtom.com/)
-   [DIGBMX](http://digbmx.com/)
-   [Grime Archive](https://grimearchive.com/)
-   [koel - A personal music streaming server that works.](http://koel.phanan.net/)
-   [Oscar Radio](http://oscar-radio.xyz/)
-   [Sparkk TV](https://www.sparkktv.com/)
-   [@halfhalftravel](https://www.halfhalftravel.com/)

If you want to be added to the list, open a pull request. It'd be awesome to see how you're using Plyr 😎

# Useful links and credits

-   [PayPal's Accessible HTML5 Video Player (which Plyr was originally ported from)](https://github.com/paypal/accessible-html5-video-player)
-   [An awesome guide for Plyr in Japanese!](http://syncer.jp/how-to-use-plyr-io) by [@arayutw](https://twitter.com/arayutw)

# Thanks

[![Fastly](https://cdn.plyr.io/static/fastly-logo.png)](https://www.fastly.com/)

Massive thanks to [Fastly](https://www.fastly.com/) for providing the CDN services.

[![Sentry](https://cdn.plyr.io/static/sentry-logo-black.svg)](https://sentry.io/)

Massive thanks to [Sentry](https://sentry.io/) for providing the logging services for the demo site.

# Copyright and License

[The MIT license](license.md)
