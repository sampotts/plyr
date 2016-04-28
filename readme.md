# Plyr
A simple, accessible and customizable HTML5, YouTube and Vimeo media player.

[Checkout the demo](https://plyr.io)

[![Image of Plyr](https://cdn.plyr.io/static/plyr_v1.6.0.png)](https://plyr.io)

## Why?
We wanted a lightweight, accessible and customizable media player that supports [*modern*](#browser-support) browsers. Sure, there are many other players out there but we wanted to keep things simple, using the right elements for the job.

## Features
- **Accessible** - full support for VTT captions and screen readers
- **Lightweight** - under 10KB minified and gzipped
- **[Customisable](#html)** - make the player look how you want with the markup you want
- **Semantic** - uses the *right* elements. `<input type="range">` for volume and `<progress>` for progress and well, `<button>`s for buttons. There's no `<span>` or `<a href="#">` button hacks
- **Responsive** - as you'd expect these days
- **HTML Video & Audio** - support for both formats
- **[Embedded Video](#embeds)** - support for YouTube and Vimeo video playback
- **[API](#api)** - toggle playback, volume, seeking, and more
- **[Universal events](#events)** - no messing around with Vimeo and YouTube APIs, all events are universal across formats
- **[Fullscreen](#fullscreen)** - supports native fullscreen with fallback to "full window" modes
- **i18n support** - support for internationalization of controls
- **No dependencies** - written in "vanilla" JavaScript, no jQuery required

Oh and yes, it works with Bootstrap.

## Changelog
Check out the [changelog](changelog.md) to see what's new with Plyr.

## Planned Development
- Streaming
- Playback speed
- Playlists
- Multiple language captions (with selection)
- Audio captions
... and whatever else has been raised in [issues](https://github.com/Selz/plyr/issues)

If you have any cool ideas or features, please let me know by [creating an issue](https://github.com/Selz/plyr/issues/new) or, of course, forking and sending a pull request.

## Implementation
Check `docs/index.html` and `docs/dist/docs.js` for an example setup.

**Heads up:** the example `index.html` file needs to be served from a webserver (such as Apache, Nginx, IIS or similar) unless you change the file sources to include http or https. e.g. change `//cdn.plyr.io/1.6.1/plyr.js` to `https://cdn.plyr.io/1.6.1/plyr.js`

### Node Package Manager (NPM)

Using NPM, you can grab Plyr:
```
npm install plyr
```
[https://www.npmjs.com/package/plyr](https://www.npmjs.com/package/plyr)

### Bower

If bower is your thang, you can grab Plyr using:
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

### CDN
If you want to use our CDN, you can use the following:

```html
<link rel="stylesheet" href="https://cdn.plyr.io/1.6.1/plyr.css">
<script src="https://cdn.plyr.io/1.6.1/plyr.js"></script>
```

You can also access the `sprite.svg` file at `https://cdn.plyr.io/1.6.1/sprite.svg`.

### CSS & Styling
If you want to use the default css, add the `plyr.css` file from `/dist` into your head, or even better use `plyr.less` or `plyr.scss` file included in `/src` in your build to save a request.

```html
<link rel="stylesheet" href="dist/plyr.css">
```

The default setup uses the BEM methodology with `plyr` as the block, e.g. `.plyr__controls`. You can change the class hooks in the options. Check out the source for more on this.

### SVG
The SVG sprite for the controls icons can be loaded two ways:
- By passing the *relative* path to the sprite as the `iconUrl` option; or
- Using AJAX, injecting the sprite into a hidden div. 

#### Using the `iconUrl` option
This method requires the SVG sprite to be hosted on the *same domain* as your page hosting the player. Currently no browser supports cross origin SVG sprites due to XSS issues. Fingers crossed this will come soon though. An example value for this option would be:
```
/path/to/sprite.svg
```

#### Using AJAX
Using AJAX means you can load the sprite from a different origin. Avoiding the issues above. This is an example script to load an SVG sprite best added before the closing `</body>`, before any other scripts.

```html
<script>
(function(d, p){
	var a = new XMLHttpRequest(),
		b = d.body;
	a.open('GET', p, true);
	a.send();
	a.onload = function() {
		var c = d.createElement('div');
		c.setAttribute('hidden', '');
		c.innerHTML = a.responseText;
		b.insertBefore(c, b.childNodes[0]);
	};
})(document, 'https://cdn.plyr.io/1.6.1/sprite.svg');
</script>
```

If you're using the `<base>` tag on your site, you may need to use something like this:
[svgfixer.js](https://gist.github.com/leonderijke/c5cf7c5b2e424c0061d2)

More info on SVG sprites here:
[http://css-tricks.com/svg-sprites-use-better-icon-fonts/](http://css-tricks.com/svg-sprites-use-better-icon-fonts/)
and the AJAX technique here:
[http://css-tricks.com/ajaxing-svg-sprite/](http://css-tricks.com/ajaxing-svg-sprite/)

### HTML
The only extra markup that's needed to use plyr is a `<div>` wrapper. Replace the source, poster and captions with urls for your media.
```html
<div class="plyr">
	<video poster="/path/to/poster.jpg" controls>
		<!-- Video files -->
		<source src="/path/to/video.mp4" type="video/mp4">
		<source src="/path/to/video.webm" type="video/webm">

		<!-- Text track file -->
		<track kind="captions" label="English captions" src="/path/to/captions.vtt" srclang="en" default>

		<!-- Fallback for browsers that don't support the <video> element -->
		<a href="/path/to/movie.mp4">Download</a>
	</video>
</div>
```
And the same for `<audio>`

```html
<div class="plyr">
	<audio controls>
		<!-- Audio files -->
		<source src="/path/to/audio.mp3" type="audio/mp3">
		<source src="/path/to/audio.ogg" type="audio/ogg">

		<!-- Fallback for browsers that don't support the <audio> element -->
		<a href="/path/to/audio.mp3">Download</a>
	</audio>
</div>
```

For YouTube and Vimeo, Plyr uses the standard YouTube API markup (an empty `<div>`):

```html
<div class="plyr">
	<div data-video-id="bTqVqk7FSmY" data-type="youtube"></div>
</div>
```
```html
<div class="plyr">
	<div data-video-id="143418951" data-type="vimeo"></div>
</div>
```

#### Cross Origin (CORS)
You'll notice the `crossorigin` attribute on the example `<video>` and `<audio>` elements. This is because the media is loaded from another domain. If your media is hosted on another domain, you may need to add this attribute.

More info on CORS here:
[https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)

### Captions
WebVTT captions are supported. To add a caption track, check the HTML example above and look for the `<track>` element.

Be sure to [validate your caption files](https://quuz.org/webvtt/)

### JavaScript

#### Quick setup

Here's an example of a default setup:

```html
<script src="https://cdn.plyr.io/1.6.1/plyr.js"></script>
<script>plyr.setup();</script>
```

This will look for all elements with the specified container classname (default is `plyr`) and setup plyr on each element found. You can specify other options, including a different selector hook below. The container classname will be added to the specified element(s) if it is not already present (for the CSS).

You can initialize the player a few other ways:

Passing a [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList):
```javascript
plyr.setup(document.querySelectorAll('.js-plyr'), options);
```

Passing a [HTMLElement](https://developer.mozilla.org/en/docs/Web/API/HTMLElement):
```javascript
plyr.setup(document.querySelector('.js-plyr'), options);
```

Passing a [string selector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll):
```javascript
plyr.setup('.js-plyr', options);
```

Passing just the options object:
```javascript
plyr.setup(options);
```

#### RangeTouch
Some touch browsers (particularly Mobile Safari on iOS) seem to have issues with `<input type="range">` elements whereby touching the track to set the value doesn't work and sliding the thumb can be tricky. To combat this, I've created [RangeTouch](https://rangetouch.com) which I'd recommend including in your solution. It's a tiny script with a nice benefit for users on touch devices. 

#### Options

Options must be passed as an object to the `setup()` method as above or as JSON in `data-plyr` attribute on each of your target elements (e.g. data-plyr='{ title: "testing" }') - note the single quotes encapsulating the JSON.

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
    <td><code>["restart", "rewind", "play", "fast-forward", "current-time", "duration", "mute", "volume", "captions", "fullscreen"]</code></td>
    <td>Toggle which control elements you would like to display when using the default controls html. If you specify a <code>html</code> option, this is redundant. The default value is to display everything.</td>
  </tr>
  <tr>
    <td><code>i18n</code></td>
    <td>Object</td>
    <td><code><a href="controls.md">See controls.md</a></code></td>
    <td>Used for internationalization (i18n) of the tooltips/labels within the buttons.</td>
  </tr>
  <tr>
    <td><code>iconPrefix</code></td>
    <td>String</td>
    <td><code>icon</code></td>
    <td>Specify the id prefix for the icons used in the default controls (e.g. "icon-play" would be "icon"). This is to prevent clashes if you're using your own SVG defs file but with the default controls. Most people can ignore this option.</td>
  </tr>
  <tr>
    <td><code>iconUrl</code></td>
    <td>String</td>
    <td><code>null</code></td>
    <td>Specify a relative path to the SVG sprite, hosted on the *same domain* as the page the player is hosted on. Using this menthod means no requirement for the AJAX sprite loading script. See the <a href="#svg">SVG section</a> for more info.</td>
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
    <td><code>hideControls</code></td>
    <td>Boolean</td>
    <td><code>true</code></td>
    <td>Hide video controls automatically after 2s of no mouse or focus movement, on control element blur (tab out), on playback start or entering fullscreen. As soon as the mouse is moved, a control element is focused or playback is paused, the controls reappear instantly.</td>
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

#### Fetching the plyr instance
A `plyr` object is added to any element that Plyr is initialized on. You can then control the player by accessing methods in the `plyr` object.

There are two ways to access the instance, firstly you re-query the element container you used for setup (e.g. `.js-plyr`) like so:

```javascript
var player = document.querySelector('.js-plyr').plyr;
```

Or you can use the returned object from your call to the setup method:

```javascript
var player = plyr.setup('.js-plyr')[0];
```

This will return an array of plyr instances setup, so you need to specify the index of the instance you want. This is less useful if you are setting up mutliple instances. You can listen for the `setup` [event](#events) documented below which will return each instance one by one, as they are setup (in the `plyr` key of the event object).

Once you have your instance, you can use the API methods below on it. For example to pause it:

```javascript
player.pause();
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
    <td>Destroys the plyr UI and any media event listeners, effectively restoring to the previous state before <code>setup()</code> was called.</td>
  </tr>
  <tr>
    <td><code>restore()</code></td>
    <td>&mdash;</td>
    <td>Reverses the effects of the <code>destroy()</code> method, restoring the UI and listeners.</td>
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

Some more details on the object parameters

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
      <td>Title of the new media. Used for the aria labelling.</td>
    </tr>
    <tr>
      <td><code>sources</code></td>
      <td>Array</td>
      <td>This is an array of sources. <code>type</code> is optional for YouTube and Vimeo when specifying an array. For YouTube and Vimeo media, only the video ID must be passed as the source as shown above. The keys of this object are mapped directly to HTML attributes so more can be added to the object if required.</td>
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

You can listen for events on the element you setup Plyr on. Some events only apply to HTML5 audio and video.

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
		<td>Sent when playback completes.</td>
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
		<td>✔</td>
		<td>Sent when a seek operation completes.</td>
	</tr>
	<tr>
		<td><code>seeking</code></td>
		<td>✔</td>
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
		<td><code>ready</code></td>
		<td></td>
		<td>Triggered when initial setup is done or a source change has occurred.</td>
	</tr>
	</tbody>
</table>

Details borrowed from: [https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events)

Here's an example of binding an event listener:

```javascript
document.querySelector('.js-plyr').addEventListener('ready', function() {
	var player = event.target.plyr;
});
```

## Embeds

YouTube and Vimeo are currently supported and function much like a HTML5 video. Check the relevant documentation sections for any differences.

Plyr references a custom version of the Vimeo Froogaloop API as Vimeo have neglected to maintain the library and there were bugs with their version. You don't need to worry about including your own versions of the Vimeo or YouTube JavaScript APIs.

The native API's can be accessed through the `embed` property of the plyr object. For example:

```javascript
document.querySelector('.js-plyr').addEventListener('ready', function() {
	var player = event.target.plyr;

	// YouTube
	console.log(player.embed.getVideoData());

	// Vimeo
	console.log(player.embed.api('getColor'));
});
```

More info on the respective API's here:
[YouTube API Reference](https://developers.google.com/youtube/js_api_reference)
[Vimeo API Reference](https://developer.vimeo.com/player/js-api#reference)

*Please note*: not all API methods may work 100%. Your mileage may vary. It's better to use the universal plyr API where possible.

## Fullscreen

Fullscreen in Plyr is supported for all browsers that [currently support it](http://caniuse.com/#feat=fullscreen). If you're using the default CSS, you can also use a "full browser" mode which will use the full browser window by adding the `plyr-fullscreen` class to your container.

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

&sup1; Mobile Safari on the iPhone forces the native player for `<video>` so no useful customisation is possible. `<audio>` elements have volume controls disabled.

&sup2; Native player used (no support for `<progress>` or `<input type="range">`) but the API is supported (v1.0.28+)

&sup3; IE10 has no native fullscreen support, fallback can be used (see options)

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
Plyr is developed by [@sam_potts](https://twitter.com/sam_potts) / [sampotts.me](http://sampotts.me) with help from the awesome [contributors](https://github.com/Selz/plyr/graphs/contributors)

## Mentions
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

## Copyright and License
[The MIT license](license.md).
