# Plyr
A simple, accessible and customizable HTML5, YouTube and Vimeo media player.

[Donate to support Plyr](#donate)

[Checkout the demo](https://plyr.io)

[![Image of Plyr](https://cdn.plyr.io/static/demo/screenshot.png)](https://plyr.io)

## Why?
We wanted a lightweight, accessible and customizable media player that supports [*modern*](#browser-support) browsers. Sure, there are many other players out there but we wanted to keep things simple, using the right elements for the job.

## Features
- **Accessible** - full support for VTT captions and screen readers
- **Lightweight** - under 10KB minified and gzipped
- **[Customisable](#html)** - make the player look how you want with the markup you want
- **Semantic** - uses the *right* elements. `<input type="range">` for volume and `<progress>` for progress and well, `<button>`s for buttons. There's no `<span>` or `<a href="#">` button hacks
- **Responsive** - works with any screen size
- **HTML Video & Audio** - support for both formats
- **[Embedded Video](#embeds)** - support for YouTube and Vimeo video playback
- **[Streaming](#streaming)** - support for hls.js, Shaka and dash.js streaming playback
- **[API](#api)** - toggle playback, volume, seeking, and more
- **[Events](#events)** - no messing around with Vimeo and YouTube APIs, all events are standardized across formats
- **[Fullscreen](#fullscreen)** - supports native fullscreen with fallback to "full window" modes
- **[Shortcuts](#shortcuts)** - supports keyboard shortcuts
- **i18n support** - support for internationalization of controls
- **No dependencies** - written in "vanilla" JavaScript, no jQuery required
- **SASS and LESS** - to include in your build processes

Oh and yes, it works with Bootstrap.

## Changelog
Check out the [changelog](changelog.md) to see what's new with Plyr.

## Features currently being developed
- Playback speed selection
- Quality selection
- Caption language selection
- AirPlay
- Picture in Picture (MacOS Sierra + Safari)

[more info](https://github.com/sampotts/plyr/issues?q=is%3Aissue+is%3Aopen+label%3A%22In+Development%22)

## Planned features
- Playlists
- Google cast
- Facebook video support
- Wistia video support
- YouTube and Vimeo audio support
- Audio captions
...and whatever else has been raised in [issues](https://github.com/sampotts/plyr/issues)

If you have any cool ideas or features, please let me know by [creating an issue](https://github.com/sampotts/plyr/issues/new) or, of course, forking and sending a pull request.

## CMS plugins

### [WordPress](https://wordpress.org/plugins/plyr/)
Created and maintained by Ryan Anthony Drake ([@iamryandrake](https://github.com/iamryandrake))

### [Neos](https://packagist.org/packages/jonnitto/plyr)
Created and maintained by Jon Uhlmann ([@jonnitto](https://github.com/jonnitto))

### [Kirby](https://github.com/dpschen/kirby-plyrtag)
Created and maintained by Dominik Pschenitschni ([@dpschen](https://github.com/dpschen))

## Using package managers
You can grab the source using one of the following package managers.

### npm
```
npm install plyr
```
[https://www.npmjs.com/package/plyr](https://www.npmjs.com/package/plyr)

### Bower
```
bower install plyr
```
[http://bower.io/search/?q=plyr](http://bower.io/search/?q=plyr)

More info on setting up dependencies can be found in the [Bower Docs](http://bower.io/docs/creating-packages/#maintaining-dependencies)

### Ember
The awesome [@louisrudner](https://twitter.com/louisrudner) has created an ember component, available by running:
```
ember addon:install ember-cli-plyr
```
More info is on [npm](https://www.npmjs.com/package/ember-cli-plyr) and [GitHub](https://github.com/louisrudner/ember-cli-plyr)

## Quick setup
Here's a quick run through on getting up and running. There's also a [demo on Codepen](http://codepen.io/sampotts/pen/jARJYp).

### HTML
Plyr extends upon the standard HTML5 markup so that's all you need for those types. More info on advanced HTML markup can be found under [initialising](#initialising).

#### HTML5 Video
```html
<video poster="/path/to/poster.jpg" controls>
  <source src="/path/to/video.mp4" type="video/mp4">
  <source src="/path/to/video.webm" type="video/webm">
  <!-- Captions are optional -->
  <track kind="captions" label="English captions" src="/path/to/captions.vtt" srclang="en" default>
</video>
```

#### HTML5 Audio
```html
<audio controls>
  <source src="/path/to/audio.mp3" type="audio/mp3">
  <source src="/path/to/audio.ogg" type="audio/ogg">
</audio>
```

For YouTube and Vimeo, Plyr uses the standard YouTube API markup (an empty `<div>`):

#### YouTube embed
```html
<div data-type="youtube" data-video-id="bTqVqk7FSmY"></div>
```

Note: `data-video-id` value can now be the ID or URL for the video. This attribute name will change in a future release to reflect this change.

#### Vimeo embed
```html
<div data-type="vimeo" data-video-id="143418951"></div>
```
Note: `data-video-id` value can now be the ID or URL for the video. This attribute name will change in a future release to reflect this change.

### JavaScript
Include the `plyr.js` script before the closing `</body>` tag and then call `plyr.setup()`. More info on `setup()` can be found under [initialising](#initialising).

```html
<script src="path/to/plyr.js"></script>
<script>plyr.setup();</script>
```

If you want to use our CDN (provided by [Fastly](https://www.fastly.com/)) for the JavaScript, you can use the following:

```html
<script src="https://cdn.plyr.io/2.0.17/plyr.js"></script>
```

### CSS
Include the `plyr.css` stylsheet into your `<head>`

```html
<link rel="stylesheet" href="path/to/plyr.css">
```

If you want to use our CDN (provided by [Fastly](https://www.fastly.com/)) for the default CSS, you can use the following:

```html
<link rel="stylesheet" href="https://cdn.plyr.io/2.0.17/plyr.css">
```

### SVG Sprite
The SVG sprite is loaded automatically from our CDN (provided by [Fastly](https://www.fastly.com/)). To change this, see the [options](#options) below. For reference, the CDN hosted SVG sprite can be found at `https://cdn.plyr.io/2.0.17/plyr.svg`.

## Advanced

### LESS & SASS/SCSS
You can use `plyr.less` or `plyr.scss` file included in `/src` as part of your build and change variables to suit your design. The LESS and SASS require you to use the [autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer) plugin (you should already) as all declerations use the W3C definitions - e.g. `appearance: none;` will be prefixed to `-webkit-appearance: none;` by autoprefixer.

The HTML markup uses the BEM methodology with `plyr` as the block, e.g. `.plyr__controls`. You can change the class hooks in the options to match any custom CSS you write. Check out the JavaScript source for more on this.

### SVG
The icons used in the Plyr controls are loaded in an SVG sprite. The sprite is automatically loaded from our CDN by default. If you already have an icon build system in place, you can include the source plyr icons (see `/src/sprite` for source icons).

#### Using the `iconUrl` option
You can however specify your own `iconUrl` option and Plyr will determine if the url is absolute and requires loading by AJAX/CORS due to current browser limitations or if it's a relative path, just use the path directly.

If you're using the `<base>` tag on your site, you may need to use something like this:
[svgfixer.js](https://gist.github.com/leonderijke/c5cf7c5b2e424c0061d2)

More info on SVG sprites here:
[http://css-tricks.com/svg-sprites-use-better-icon-fonts/](http://css-tricks.com/svg-sprites-use-better-icon-fonts/)
and the AJAX technique here:
[http://css-tricks.com/ajaxing-svg-sprite/](http://css-tricks.com/ajaxing-svg-sprite/)

### Cross Origin (CORS)
You'll notice the `crossorigin` attribute on the example `<video>` elements. This is because the TextTrack captions are loaded from another domain. If your TextTrack captions are also hosted on another domain, you will need to add this attribute and make sure your host has the correct headers setup. For more info on CORS checkout the MDN docs:
[https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)

### Captions
WebVTT captions are supported. To add a caption track, check the HTML example above and look for the `<track>` element. Be sure to [validate your caption files](https://quuz.org/webvtt/).

### JavaScript

#### Initialising

By default, `setup()` will find all `<video>`, `<audio>` and `[data-type]` elements with the document and initialises on any found. Each target media element found will be wrapped in a `<div>` for styling and setup individually. You can specify a variety of arguments to `setup()` to use, including a different NodeList, HTMLElement, Array of HTMLElements or string selector as below:

Passing a [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList):
```javascript
plyr.setup(document.querySelectorAll('.js-player'), options);
```

Passing a [HTMLElement](https://developer.mozilla.org/en/docs/Web/API/HTMLElement):
```javascript
plyr.setup(document.querySelector('.js-player'), options);
```

Passing an [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) of [HTMLElement](https://developer.mozilla.org/en/docs/Web/API/HTMLElement)s:
```javascript
plyr.setup([
	document.querySelector('.js-player-1'),
	document.querySelector('.js-player-2')
], options);
```

Passing a [string selector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll):
```javascript
plyr.setup('.js-player', options);
```

The NodeList, HTMLElement or string selector can be the target `<video>`, `<audio>` or `[data-type]` (for embeds) element itself or a container element.

Passing just the options object:
```javascript
plyr.setup(options);
```

`setup()` will return an array of *instances* that can be used with the [API](#api) methods. See the [API](#api) section for more info.

#### RangeTouch
Some touch browsers (particularly Mobile Safari on iOS) seem to have issues with `<input type="range">` elements whereby touching the track to set the value doesn't work and sliding the thumb can be tricky. To combat this, I've created [RangeTouch](https://rangetouch.com) which I'd recommend including in your solution. It's a tiny script with a nice benefit for users on touch devices.

#### Options
Options must be passed as an object to the `setup()` method as above or as JSON in `data-plyr` attribute on each of your target elements:

```html
<video data-plyr='{ title: "testing" }'></video>
```

Note the single quotes encapsulating the JSON and double quotes on the object keys.

<table class="table" width="100%">
  <thead>
    <tr>
      <th width="20%">Option</th>
      <th width="15%">Type</th>
      <th width="15%">Default</th>
      <th width="50%">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>enabled</code></td>
      <td>Boolean</td>
      <td><code>true</code></td>
      <td>Completely disable Plyr. This would allow you to do a User Agent check or similar to programmatically enable or disable Plyr for a certain UA. Example below.</td>
    </tr>
    <tr>
      <td><code>html</code></td>
      <td>String</td>
      <td><code><a href="controls.md">See controls.md</a></code></td>
      <td>See <a href="controls.md">controls.md</a> for more info on how the html needs to be structured.</td>
    </tr>
    <tr>
      <td><code>controls</code></td>
      <td>Array</td>
      <td><code>['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'fullscreen']</code></td>
      <td>Toggle which control elements you would like to display when using the default controls html. If you specify a <code>html</code> option, this is redundant. The default value is to display everything.</td>
    </tr>
    <tr>
      <td><code>i18n</code></td>
      <td>Object</td>
      <td><code><a href="controls.md">See controls.md</a></code></td>
      <td>Used for internationalization (i18n) of the tooltips/labels within the buttons.</td>
    </tr>
    <tr>
      <td><code>loadSprite</code></td>
      <td>Boolean</td>
      <td><code>true</code></td>
      <td>Load the SVG sprite specified as the <code>iconUrl</code> option (if a URL). If <code>false</code>, it is assumed you are handling sprite loading yourself.</td>
    </tr>
    <tr>
      <td><code>iconUrl</code></td>
      <td>String</td>
      <td><code>null</code></td>
      <td>Specify a URL or path to the SVG sprite. See the <a href="#svg">SVG section</a> for more info.</td>
    </tr>
    <tr>
      <td><code>iconPrefix</code></td>
      <td>String</td>
      <td><code>plyr</code></td>
      <td>Specify the id prefix for the icons used in the default controls (e.g. "plyr-play" would be "plyr"). This is to prevent clashes if you're using your own SVG sprite but with the default controls. Most people can ignore this option.</td>
    </tr>
    <tr>
      <td><code>blankUrl</code></td>
      <td>String</td>
      <td><code>https://cdn.selz.com/plyr/blank.mp4</code></td>
      <td>Specify a URL or path to a blank video file used to properly cancel network requests. See <a href="https://github.com/sampotts/plyr/issues/174">issue #174</a> for more info.</td>
    </tr>
    <tr>
      <td><code>debug</code></td>
      <td>Boolean</td>
      <td><code>false</code></td>
      <td>Display debugging information on what Plyr is doing.</td>
    </tr>
    <tr>
      <td><code>autoplay</code></td>
      <td>Boolean</td>
      <td><code>false</code></td>
      <td>Autoplay the media on load. This is generally advised against on UX grounds. It is also disabled on iOS (an Apple limitation).</td>
    </tr>
    <tr>
      <td><code>seekTime</code></td>
      <td>Number</td>
      <td><code>10</code></td>
      <td>The time, in seconds, to seek when a user hits fast forward or rewind.</td>
    </tr>
    <tr>
      <td><code>volume</code></td>
      <td>Number</td>
      <td><code>5</code></td>
      <td>A number, between 1 and 10, representing the initial volume of the player.</td>
    </tr>
    <tr>
      <td><code>clickToPlay</code></td>
      <td>Boolean</td>
      <td><code>true</code></td>
      <td>Click (or tap) of the video container will toggle pause/play.</td>
    </tr>
    <tr>
      <td><code>disableContextMenu</code></td>
      <td>Boolean</td>
      <td><code>true</code></td>
      <td>Disable right click menu on video to <em>help</em> as very primitive obfuscation to prevent downloads of content.</td>
    </tr>
    <tr>
      <td><code>hideControls</code></td>
      <td>Boolean</td>
      <td><code>true</code></td>
      <td>Hide video controls automatically after 2s of no mouse or focus movement, on control element blur (tab out), on playback start or entering fullscreen. As soon as the mouse is moved, a control element is focused or playback is paused, the controls reappear instantly.</td>
    </tr>
    <tr>
      <td><code>showPosterOnEnd</code></td>
      <td>Boolean</td>
      <td><code>false</code></td>
      <td>This will restore and *reload* HTML5 video once playback is complete. Note: depending on the browser caching, this may result in the video downloading again (or parts of it). Use with caution.</td>
    </tr>
    <tr>
      <td><code>keyboardShortcuts</code></td>
      <td>Object</td>
      <td><code>{ focused: true, global: false }</code></td>
      <td>Enable <a href="#shortcuts">keyboard shortcuts</a> for focused players only or globally as well (this will only work if there's one player in the document)</td>
    </tr>
    <tr>
      <td><code>tooltips</code></td>
      <td>Object</td>
      <td><code>{ controls: false, seek: true }</code></td>
      <td>
  		<strong>controls</strong>: Display control labels as tooltips on :hover &amp; :focus (by default, the labels are screen reader only).
  		<br><br>
  		<strong>seek</strong>: Display a seek tooltip to indicate on click where the media would seek to.
  	</td>
    </tr>
    <tr>
      <td><code>duration</code></td>
      <td>Number</td>
      <td><code>null</code></td>
      <td>Specify a custom duration.</td>
    </tr>
    <tr>
      <td><code>displayDuration</code></td>
      <td>Boolean</td>
      <td><code>true</code></td>
      <td>Displays the duration of the media on the "metadataloaded" event (on startup) in the current time display. This will only work if the `preload` attribute is not set to `none` (or is not set at all) and you choose not to display the duration (see <code>controls</code> option).</td>
    </tr>
    <tr>
      <td><code>selectors</code></td>
      <td>Object</td>
      <td>&mdash;</td>
      <td>See <code>plyr.js</code> in <code>/src</code> for more info. You probably don't need to change any of these.</td>
    </tr>
    <tr>
      <td><code>listeners</code></td>
      <td>Object</td>
      <td>&mdash;</td>
      <td>Allows early binding of event listeners to the controls. See <code>controls</code> above for list of controls and see <code>plyr.js</code> in <code>/src</code> for more info.</td>
    </tr>
    <tr>
      <td><code>classes</code></td>
      <td>Object</td>
      <td>&mdash;</td>
      <td>Similar to above, these are the classes added to the player when state changes occur.</td>
    </tr>
    <tr>
      <td><code>captions</code></td>
      <td>Object</td>
      <td>&mdash;</td>
      <td>One property <code>defaultActive</code> which toggles if captions should be on by default. The default value is <code>false</code>.</td>
    </tr>
    <tr>
      <td><code>fullscreen</code></td>
      <td>Object</td>
      <td>&mdash;</td>
      <td>See <a href="#fullscreen-options">below</a></td>
    </tr>
    <tr>
      <td><code>storage</code></td>
      <td>Object</td>
      <td>&mdash;</td>
      <td>Two properties; <code>enabled</code> which toggles if local storage should be enabled (if the browser supports it). The default value is `true`. This enables storing user settings, currently it only stores volume but more will be added later. The second property <code>key</code> is the key used for the local storage. The default is <code>plyr_volume</code> until more settings are stored.</td>
    </tr>
  </tbody>
</table>

#### Fullscreen options

<table class="table" width="100%" id="fullscreen-options">
  <thead>
    <tr>
      <th width="20%">Option</th>
      <th width="15%">Type</th>
      <th width="15%">Default</th>
      <th width="50%">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>enabled</code></td>
      <td>Boolean</td>
      <td><code>true</code></td>
      <td>Toggles if fullscreen should be enabled (if the browser supports it).</td>
    </tr>
    <tr>
      <td><code>fallback</code></td>
      <td>Boolean</td>
      <td><code>true</code></td>
      <td>Enable a full viewport view for older browsers.</td>
    </tr>
    <tr>
      <td><code>allowAudio</code></td>
      <td>Boolean</td>
      <td><code>false</code></td>
      <td>Allow audio play to toggle fullscreen. This will be more useful later when posters are supported.</td>
    </tr>
  </tbody>
</table>

## API

### Instance

The easiest way to access the plyr instances is to store the return value from your call to `setup()`:

```javascript
var players = plyr.setup('.js-player');
```

This will return an array of all instances that were setup. Another way is to use `plyr.get()` to get all instances within a given container, for example:

```javascript
var players = plyr.get('.js-player');
```

If no argument is passed, it will find all instances in the current document. This will return an array of all instances that were found in the given selector.

A final option is to access the instance through the event handlers:

```javascript
instance.on('ready', function(event) {
  var instance = event.detail.plyr;
});
```

### Methods

Once you have your instances, you can use the API methods below on it. For example to pause the first player:

```javascript
players[0].pause();
```

Here's a list of the methods supported:

<table class="table" width="100%">
<thead>
  <tr>
    <th width="20%">Method</th>
    <th width="15%">Parameters</th>
    <th width="65%">Description</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td><code>getContainer()</code></td>
    <td>&mdash;</td>
    <td>Get the players outer container element that is automatically injected.</td>
  </tr>
  <tr>
    <td><code>getMedia()</code></td>
    <td>&mdash;</td>
    <td>Get the media element (<code>&gt;video&lt;</code>, <code>&gt;audio&lt;</code> or <code>&gt;div&lt;</code> for YouTube or Vimeo).</td>
  </tr>
  <tr>
    <td><code>getEmbed()</code></td>
    <td>&mdash;</td>
    <td>Get the [embed](#embed) API to access those methods - either YouTube or Vimeo.</td>
  </tr>
  <tr>
    <td><code>getType()</code></td>
    <td>&mdash;</td>
    <td>Get the type - 'video', 'audio', 'youtube' or 'vimeo'.</td>
  </tr>
  <tr>
    <td><code>isReady()</code></td>
    <td>&mdash;</td>
    <td>Determine if the player is loaded and UI ready.</td>
  </tr>
  <tr>
    <td><code>on()</code></td>
    <td>String, Function</td>
    <td>Watch for an event (first argument) and run a callback function (second argument). This saves you doing your own <code>addEventListner</code> code. This is chainable.</td>
  </tr>
  <tr>
    <td><code>play()</code></td>
    <td>&mdash;</td>
    <td>Plays the media</td>
  </tr>
  <tr>
    <td><code>pause()</code></td>
    <td>&mdash;</td>
    <td>Pauses the media</td>
  </tr>
  <tr>
    <td><code>stop()</code></td>
    <td>&mdash;</td>
    <td>Stops the media</td>
  </tr>
  <tr>
    <td><code>restart()</code></td>
    <td>&mdash;</td>
    <td>Restarts playback</td>
  </tr>
  <tr>
    <td><code>rewind(...)</code></td>
    <td>Number</td>
    <td>Rewinds by the provided parameter, in seconds. If no parameter is provided, the default seekInterval is used (10 seconds).</td>
  </tr>
  <tr>
    <td><code>forward(...)</code></td>
    <td>Number</td>
    <td>Fast forwards by the provided parameter, in seconds. If no parameter is provided, the default seekInterval is used (10 seconds).</td>
  </tr>
  <tr>
    <td><code>seek(...)</code></td>
    <td>Number</td>
    <td>Seeks the media to the provided parameter, time in seconds.</td>
  </tr>
  <tr>
    <td><code>getCurrentTime()</code></td>
    <td>&mdash;</td>
    <td>Will return a float with the current time in seconds.</td>
  </tr>
  <tr>
    <td><code>getDuration()</code></td>
    <td>&mdash;</td>
    <td>Will return a float with the duration in seconds.</td>
  </tr>
  <tr>
    <td><code>getVolume()</code></td>
    <td>&mdash;</td>
    <td>Will return a float between 0 and 1 for the current volume level.</td>
  </tr>
  <tr>
    <td><code>isMuted()</code></td>
    <td>&mdash;</td>
    <td>Will return a boolean for whether the media is currently muted.</td>
  </tr>
  <tr>
    <td><code>setVolume(...)</code></td>
    <td>Number</td>
    <td>Sets the player volume to the provided parameter. The value should be between 0 (muted) and 10 (loudest). If no parameter is provided, the default volume is used (5). Values over 10 are ignored.</td>
  </tr>
  <tr>
    <td><code>togglePlay()</code></td>
    <td>Boolean</td>
    <td>Toggles playback for the player based on either the boolean argument or it's current state.</td>
  </tr>
  <tr>
    <td><code>isPaused()</code></td>
    <td>&mdash;</td>
    <td>Will return a boolean for whether the media is currently paused.</td>
  </tr>
  <tr>
    <td><code>toggleMute()</code></td>
    <td>&mdash;</td>
    <td>Toggles mute for the player.</td>
  </tr>
  <tr>
    <td><code>toggleCaptions()</code></td>
    <td>&mdash;</td>
    <td>Toggles whether captions are enabled.</td>
  </tr>
  <tr>
    <td><code>toggleFullscreen()</code></td>
    <td>Event</td>
    <td>Toggles fullscreen. This can only be initiated by a user gesture due to browser security, i.e. a user event such as click.</td>
  </tr>
  <tr>
    <td><code>isFullscreen()</code></td>
    <td>&mdash;</td>
    <td>Boolean returned if the player is in fullscreen.</td>
  </tr>
  <tr>
    <td><code>support(...)</code></td>
    <td>String</td>
    <td>Determine if a player supports a certain MIME type. This is not supported for embedded content (YouTube).</td>
  </tr>
  <tr>
    <td><code>source(...)</code></td>
    <td>Object or undefined</td>
    <td>
      Get/Set the media source.
      <br><br>
      <strong>Object</strong><br>
      See <a href="#source-method">below</a>
      <br><br>
      <strong>YouTube</strong><br>
      Currently this API method only accepts a YouTube ID when used with a YouTube player. I will add URL support soon, along with being able to swap between types (e.g. YouTube to Audio or Video and vice versa.)
      <br><br>
      <strong>undefined</strong><br>
      Returns the current media source url. Works for both native videos and embeds.
    </td>
  </tr>
  <tr>
    <td><code>poster(...)</code></td>
    <td>String</td>
    <td>Set the poster url. This is supported for the <code>video</code> element only.</td>
  </tr>
  <tr>
    <td><code>destroy()</code></td>
    <td>&mdash;</td>
    <td>Restores the original element, reversing the effects of <code>setup()</code>.</td>
  </tr>
 </tbody>
</table>

#### .source() method
This allows changing the plyr source and type on the fly.

Video example:

```javascript
player.source({
  type:       'video',
  title:      'Example title',
  sources: [{
      src:    '/path/to/movie.mp4',
      type:   'video/mp4'
  },
  {
      src:    '/path/to/movie.webm',
      type:   'video/webm'
  }],
  poster:     '/path/to/poster.jpg',
  tracks:     [{
      kind:   'captions',
      label:  'English',
      srclang:'en',
      src:    '/path/to/captions.vtt',
      default: true
  }]
});
```

Audio example:

```javascript
player.source({
  type:       'audio',
  title:      'Example title',
  sources: [{
    src:      '/path/to/audio.mp3',
    type:     'audio/mp3'
  },
  {
    src:      '/path/to/audio.ogg',
    type:     'audio/ogg'
  }]
});
```

YouTube example:

```javascript
player.source({
  type:       'video',
  title:      'Example title',
  sources: [{
      src:    'bTqVqk7FSmY',
      type:   'youtube'
  }]
});
```

Note: `src` can be the video ID or URL

Vimeo example

```javascript
player.source({
  type:       'video',
  title:      'Example title',
  sources: [{
      src:    '143418951',
      type:   'vimeo'
  }]
});
```

Note: `src` can be the video ID or URL

More details on the object parameters

<table class="table" width="100%">
  <thead>
    <tr>
      <th width="20%">Key</th>
      <th width="15%">Type</th>
      <th width="65%">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>type</code></td>
      <td>String</td>
      <td>Options are <code>video</code>, <code>audio</code>, <code>youtube</code> and <code>vimeo</code></td>
    </tr>
    <tr>
      <td><code>title</code></td>
      <td>String</td>
      <td>Title of the new media. Used for the `aria-label` attribute on the play button, and outer container.</td>
    </tr>
    <tr>
      <td><code>sources</code></td>
      <td>Array</td>
      <td>This is an array of sources. <code>type</code> is optional for YouTube and Vimeo when specifying an array. For YouTube and Vimeo media, the video ID or URL must be passed as the source as shown above. The keys of this object are mapped directly to HTML attributes so more can be added to the object if required.</td>
    </tr>
    <tr>
      <td><code>poster</code></td>
      <td>String</td>
      <td>URL for the poster image (video only).</td>
    </tr>
    <tr>
      <td><code>tracks</code></td>
      <td>Array</td>
      <td>An array of track objects. Each element in the array is mapped directly to a track element and any keys mapped directly to HTML attributes so as in the example above, it will render as `<track kind="captions" label="English" srclang="en" src="https://cdn.selz.com/plyr/1.0/example_captions_en.vtt" default>`. Booleans are converted to HTML5 value-less attributes.</td>
    </tr>
  </tbody>
</table>

## Events
You can listen for events on the target element you setup Plyr on (see example under the table). Some events only apply to HTML5 audio and video. Using your reference to the instance, you can use the `on()` API method or `addEventListener()`. Access to the API can be obtained this way through the `event.detail.plyr` property. Here's an example:

```javascript
instance.on('ready', function(event) {
  var instance = event.detail.plyr;
});
```

These events also bubble up the DOM. The event target will be the container element.

<table class="table" width="100%">
  <thead>
    <tr>
      <th width="20%">Event name</th>
	    <th width="20%">HTML5 only</th>
      <th width="60%">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>setup</code></td>
      <td></td>
      <td>When an initial setup has completed</td>
    </tr>
    <tr>
      <td><code>ready</code></td>
      <td></td>
      <td>Triggered when the instance is ready for API use and external APIs are ready (in the case of YouTube and Vimeo).</td>
    </tr>
  	<tr>
  		<td><code>canplay</code></td>
  		<td>✔</td>
  		<td>Sent when enough data is available that the media can be played, at least for a couple of frames. This corresponds to the <code>HAVE_ENOUGH_DATA</code> <code>readyState</code>.</td>
  	</tr>
  	<tr>
  		<td><code>canplaythrough</code></td>
  		<td></td>
  		<td>Sent when the ready state changes to <code>CAN_PLAY_THROUGH</code>, indicating that the entire media can be played without interruption, assuming the download rate remains at least at the current level. <strong>Note</strong>: Manually setting the <code>currentTime</code> will eventually fire a <code>canplaythrough</code> event in firefox. Other browsers might not fire this event.</td>
  	</tr>
  	<tr>
  		<td><code>emptied</code></td>
  		<td>✔</td>
  		<td>The media has become empty; for example, this event is sent if the media has already been loaded (or partially loaded), and the <code>load()</code> method is called to reload it.</td>
  	</tr>
  	<tr>
  		<td><code>ended</code></td>
  		<td></td>
  		<td>Sent when playback completes. Note: with Vimeo this does not occur if `loop` is enabled.</td>
  	</tr>
  	<tr>
  		<td><code>error</code></td>
  		<td>✔</td>
  		<td>Sent when an error occurs.&nbsp; The element's <code>error</code> attribute contains more information.</td>
  	</tr>
  	<tr>
  		<td><code>loadeddata</code></td>
  		<td>✔</td>
  		<td>The first frame of the media has finished loading.</td>
  	</tr>
  	<tr>
  		<td><code>loadedmetadata</code></td>
  		<td>✔</td>
  		<td>The media's metadata has finished loading; all attributes now contain as much useful information as they're going to.</td>
  	</tr>
  	<tr>
  		<td><code>loadstart</code></td>
  		<td>✔</td>
  		<td>Sent when loading of the media begins.</td>
  	</tr>
  	<tr>
  		<td><code>pause</code></td>
  		<td></td>
  		<td>Sent when playback is paused.</td>
  	</tr>
  	<tr>
  		<td><code>play</code></td>
  		<td></td>
  		<td>Sent when playback of the media starts after having been paused; that is, when playback is resumed after a prior <code>pause</code> event.</td>
  	</tr>
  	<tr>
  		<td><code>playing</code></td>
  		<td></td>
  		<td>Sent when the media begins to play (either for the first time, after having been paused, or after ending and then restarting).</td>
  	</tr>
  	<tr>
  		<td><code>progress</code></td>
  		<td></td>
  		<td>Sent periodically to inform interested parties of progress downloading the media. Information about the current amount of the media that has been downloaded is available in the media element's <code>buffered</code> attribute.</td>
  	</tr>
  	<tr>
  		<td><code>seeked</code></td>
  		<td></td>
  		<td>Sent when a seek operation completes.</td>
  	</tr>
  	<tr>
  		<td><code>seeking</code></td>
  		<td></td>
  		<td>Sent when a seek operation begins.</td>
  	</tr>
  	<tr>
  		<td><code>stalled</code></td>
  		<td>✔</td>
  		<td>Sent when the user agent is trying to fetch media data, but data is unexpectedly not forthcoming.</td>
  	</tr>
  	<tr>
  		<td><code>timeupdate</code></td>
  		<td></td>
  		<td>The time indicated by the element's <code>currentTime</code> attribute has changed.</td>
  	</tr>
  	<tr>
  		<td><code>volumechange</code></td>
  		<td></td>
  		<td>Sent when the audio volume changes (both when the volume is set and when the <code>muted</code> attribute is changed).</td>
  	</tr>
  	<tr>
  		<td><code>waiting</code></td>
  		<td>✔</td>
  		<td>Sent when the requested operation (such as playback) is delayed pending the completion of another operation (such as a seek).</td>
  	</tr>
  	<tr>
  		<td><code>enterfullscreen</code></td>
  		<td></td>
  		<td>User enters fullscreen (either the proper fullscreen or full-window fallback for older browsers)</td>
  	</tr>
  	<tr>
  		<td><code>exitfullscreen</code></td>
  		<td></td>
  		<td>User exits fullscreen</td>
  	</tr>
  	<tr>
  		<td><code>captionsenabled</code></td>
  		<td></td>
  		<td>Captions toggled on</td>
  	</tr>
  	<tr>
  		<td><code>captionsdisabled</code></td>
  		<td></td>
  		<td>Captions toggled off</td>
  	</tr>
    <tr>
      <td><code>destroyed</code></td>
      <td></td>
      <td>When an instance is destroyed. The original element that replaced the container will be returned to your handler as the event target.</td>
    </tr>
	</tbody>
</table>

Details borrowed from: [https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events)

## Embeds
YouTube and Vimeo are currently supported and function much like a HTML5 video. Check the relevant documentation sections for any differences. You don't need to worry about including your own versions of the Vimeo or YouTube JavaScript APIs. Plyr will automatically include them.

The embed third party API's can be accessed through the `getEmbed()` API method.

More info on the respective API's here:

- [YouTube API Reference](https://developers.google.com/youtube/js_api_reference)
- [Vimeo API Reference](https://github.com/vimeo/player.js)

*Please note*: not all API methods may work 100%. Your mileage may vary. It's better to use the universal plyr API where possible.

## Shortcuts
By default, a player will bind the following keyboard shortcuts when it has focus. If you have the `global` option to `true` and there's only one player in the document then the shortcuts will work when any element has focus, apart from an element that requires input.

<table class="table" width="100%">
  <thead>
    <tr>
      <th width="25%">Key</th>
      <th width="25%">Global</th>
      <th width="50%">Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>0</code> to <code>9</code></td>
      <td>✔</td>
      <td>Seek from 0 to 90% respectively</td>
    </tr>
    <tr>
      <td><code>space</code></td>
      <td></td>
      <td>Toggle playback</td>
    </tr>
    <tr>
      <td><code>K</code></td>
      <td>✔</td>
      <td>Toggle playback</td>
    </tr>
    <tr>
      <td><code>&larr;</code></td>
      <td></td>
      <td>Seek backward by the <code>seekTime</code> option</td>
    </tr>
    <tr>
      <td><code>&rarr;</code></td>
      <td></td>
      <td>Seek forward by the <code>seekTime</code> option</td>
    </tr>
    <tr>
      <td><code>&uarr;</code></td>
      <td></td>
      <td>Increase volume</td>
    </tr>
    <tr>
      <td><code>&darr;</code></td>
      <td></td>
      <td>Decrease volume</td>
    </tr>
    <tr>
      <td><code>M</code></td>
      <td>✔</td>
      <td>Toggle mute</td>
    </tr>
    <tr>
      <td><code>F</code></td>
      <td>✔</td>
      <td>Toggle fullscreen</td>
    </tr>
    <tr>
      <td><code>C</code></td>
      <td>✔</td>
      <td>Toggle captions</td>
    </tr>
  </tbody>
</table>

## Streaming
Because Plyr is an extension of the standard HTML5 video and audio elements, third party streaming plugins can be used with Plyr. Massive thanks to Matias Russitto ([@russitto](https://github.com/russitto)) for working on this. Here's a few examples:

- Using [hls.js](https://github.com/dailymotion/hls.js) - [Demo](http://codepen.io/sampotts/pen/JKEMqB)
- Using [Shaka](https://github.com/google/shaka-player) - [Demo](http://codepen.io/sampotts/pen/zBNpVR)
- Using [dash.js](https://github.com/Dash-Industry-Forum/dash.js) - [Demo](http://codepen.io/sampotts/pen/BzpJXN)

## Fullscreen
Fullscreen in Plyr is supported by all browsers that [currently support it](http://caniuse.com/#feat=fullscreen).

## Browser support

<table width="100%" style="text-align: center">
  <thead>
    <tr>
      <td>Safari</td>
      <td>Firefox</td>
      <td>Chrome</td>
      <td>Opera</td>
      <td>IE9</td>
      <td>IE10+</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>✔&sup1;</td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
      <td>API&sup2;</td>
      <td>✔&sup3;</td>
    </tr>
  </tbody>
</table>

&sup1; Mobile Safari on the iPhone forces the native player for `<video>` so no useful customization is possible. `<audio>` elements have volume controls disabled.

&sup2; Native player used (no support for `<progress>` or `<input type="range">`) but the API is supported (v1.0.28+)

&sup3; IE10 has no native fullscreen support, fallback can be used (see [options](#options))

The `enabled` option can be used to disable certain User Agents. For example, if you don't want to use Plyr for smartphones, you could use:

```javascript
enabled: /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
```
If a User Agent is disabled but supports `<video>` and `<audio>` natively, it will use the native player.

Any unsupported browsers will display links to download the media if the correct html is used.

### Checking for support
There's an API method for checking support. You can call `plyr.supported()` and optionally pass a type to it, e.g. `plyr.supported("video")`. It will return an object with two keys; `basic` meaning there's basic support for that media type (or both if no type is passed) and `full` meaning there's full support for plyr.

## Issues
If you find anything weird with Plyr, please let us know using the GitHub issues tracker.

## Author
Plyr is developed by [@sam_potts](https://twitter.com/sam_potts) / [sampotts.me](http://sampotts.me) with help from the awesome [contributors](https://github.com/sampotts/plyr/graphs/contributors)

## Donate
Plyr costs money to run, not my time - I donate that for free but domains, hosting and more. Any help is appreciated...
[Donate to support Plyr](https://www.paypal.me/pottsy/20usd)

## Mentions
- [ProductHunt](https://www.producthunt.com/tech/plyr)
- [The Changelog](http://thechangelog.com/plyr-simple-html5-media-player-custom-controls-webvtt-captions/)
- [HTML5 Weekly #177](http://html5weekly.com/issues/177)
- [Responsive Design #149](http://us4.campaign-archive2.com/?u=559bc631fe5294fc66f5f7f89&id=451a61490f)
- [Web Design Weekly #174](https://web-design-weekly.com/2015/02/24/web-design-weekly-174/)
- [Hacker News](https://news.ycombinator.com/item?id=9136774)
- [Web Platform Daily](http://webplatformdaily.org/releases/2015-03-04)
- [LayerVault Designer News](https://news.layervault.com/stories/45394-plyr--a-simple-html5-media-player)
- [The Treehouse Show #131](https://teamtreehouse.com/library/episode-131-origami-react-responsive-hero-images)
- [noupe.com](http://www.noupe.com/design/html5-plyr-is-a-responsive-and-accessible-video-player-94389.html)

## Used by
- [Selz.com](https://selz.com)
- [Peugeot.fr](http://www.peugeot.fr/marque-et-technologie/technologies/peugeot-i-cockpit.html)
- [Peugeot.de](http://www.peugeot.de/modelle/modellberater/208-3-turer/fotos-videos.html)
- [TomTom.com](http://prioritydriving.tomtom.com/)
- [DIGBMX](http://digbmx.com/)
- [Grime Archive](https://grimearchive.com/)
- [koel - A personal music streaming server that works.](http://koel.phanan.net/)
- [Oscar Radio](http://oscar-radio.xyz/)

Let me know on [Twitter](https://twitter.com/sam_potts) I can add you to the above list. It'd be awesome to see how you're using Plyr :-)

## Useful links and credits
Credit to the PayPal HTML5 Video player from which Plyr's caption functionality is ported from:
- [PayPal's Accessible HTML5 Video Player](https://github.com/paypal/accessible-html5-video-player)
- The icons used in Plyr are [Vicons](https://dribbble.com/shots/1663443-60-Vicons-Free-Icon-Set) plus some ones I made
- [An awesome guide for Plyr in Japanese!](http://syncer.jp/how-to-use-plyr-io) by [@arayutw](https://twitter.com/arayutw)

Also these links helped created Plyr:
- [Media Events - W3.org](http://www.w3.org/2010/05/video/mediaevents.html)
- [Styling the `<progress>` element - hongkiat.com](http://www.hongkiat.com/blog/html5-progress-bar/)

## Thanks
[![Fastly](https://www.fastly.com/sites/all/themes/custom/fastly2016/logo.png)](https://www.fastly.com/)

Thanks to [Fastly](https://www.fastly.com/) for providing the CDN services.

## Copyright and License
[The MIT license](license.md).
