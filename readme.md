# Plyr
A simple, accessible HTML5 media player. 

[Checkout the demo](http://plyr.io)

[![Image of Plyr](https://cdn.plyr.io/static/plyr.png?1)](http://plyr.io)

## Why?
We wanted a lightweight, accessible and customisable media player that just supports *modern* browsers. Sure, there are many other players out there but we wanted to keep things simple, using the right elements for the job. 

## Features
- **Accessible** - full support for captions and screen readers.
- **Lightweight** - just 5.7KB minified and gzipped.
- **Customisable** - make the player look how you want with the markup you want.
- **Semantic** - uses the *right* elements. `<input type="range">` for volume and `<progress>` for progress and well, `<button>`s for buttons. There's no `<span>` or `<a href="#">` button hacks.
- **Responsive** - as you'd expect these days.
- **Audio & Video** - support for both formats.
- **API** - toggle playback, volume, seeking, and more.
- **Fullscreen** - supports native fullscreen with fallback to "full window" modes.
- **No dependencies** - written in vanilla JavaScript, no jQuery required. 

Oh and yes, it works with Bootstrap. 

## Changelog
Check out [the changelog](changelog.md)

## Planned development
- Accept a string selector, a node, or a nodelist for the `container` property of `selectors`.
- Multiple language captions (with selection)
- Playlists (audio and video)
- Set source by API
- Tooltip option (for seeking and controls)
... and whatever else has been raised in [issues](https://github.com/Selz/plyr/issues)

If you have any cool ideas or features, please let me know by [creating an issue](https://github.com/Selz/plyr/issues/new) or of course, forking and sending a pull request.

## Implementation

Check `docs/index.html` and `docs/dist/docs.js` for an example setup. 

**Heads up**, the example `index.html` file needs to be served from a webserver (such as Apache, Nginx, IIS or similar) unless you change the file sources to include http or https. e.g. change `//cdn.plyr.io/1.0.27/plyr.js` to `https://cdn.plyr.io/1.0.27/plyr.js`

### Bower
If bower is your thang, you can grab Plyr using:
```
bower install plyr
```
More info on setting up dependencies can be found in the [Bower Docs](http://bower.io/docs/creating-packages/#maintaining-dependencies)

### CDN 
If you want to use our CDN, you can use the following. HTTPS (SSL) is supported.

```html
<link rel="stylesheet" href="//cdn.plyr.io/1.0.27/plyr.css">
<script src="//cdn.plyr.io/1.0.27/plyr.js"></script>
```

You can also access the `sprite.svg` file at `//cdn.plyr.io/1.0.27/sprite.svg`.

### CSS
If you want to use the default css, add the `plyr.css` file from /dist into your head, or even better use `plyr.less` or `plyr.sass` file included in `/src` in your build to save a request. 

```html
<link rel="stylesheet" href="dist/plyr.css">
```

### SVG
The SVG sprite for the controls icons is loaded in by AJAX to help with performance. This is best added before the closing `</body>`, before any other scripts.

```html
<script>
(function(d,p){
	var a=new XMLHttpRequest(),
		b=d.body;
	a.open("GET",p,!0);
	a.send();
	a.onload=function(){
		var c=d.createElement("div");
		c.style.display="none";
		c.innerHTML=a.responseText;
		b.insertBefore(c,b.childNodes[0])
	}
})(document,"dist/sprite.svg");
</script>
```
More info on SVG sprites here:
[http://css-tricks.com/svg-sprites-use-better-icon-fonts/](http://css-tricks.com/svg-sprites-use-better-icon-fonts/) 
and the AJAX technique here: 
[http://css-tricks.com/ajaxing-svg-sprite/](http://css-tricks.com/ajaxing-svg-sprite/)

### HTML
The only extra markup that's needed to use plyr is a `<div>` wrapper. Replace the source, poster and captions with urls for your media.
```html
<div class="player">
	<video poster="//cdn.selz.com/plyr/1.0/poster.jpg" controls crossorigin>
		<!-- Video files -->
		<source src="//cdn.selz.com/plyr/1.0/movie.mp4" type="video/mp4">
		<source src="//cdn.selz.com/plyr/1.0/movie.webm" type="video/webm">
		
		<!-- Text track file -->
		<track kind="captions" label="English captions" src="//cdn.selz.com/plyr/1.0/movie_captions_en.vtt" srclang="en" default>
		
		<!-- Fallback for browsers that don't support the <video> element -->
		<div>
			<a href="//cdn.selz.com/plyr/1.0/movie.mp4">Download</a>
		</div>
	</video>
</div>
```
And the same for `<audio>`

```html
<div class="player">
	<audio controls>
		<!-- Audio files -->
		<source src="//cdn.selz.com/plyr/1.0/logistics-96-sample.mp3" type="audio/mp3">
    <source src="//cdn.selz.com/plyr/1.0/logistics-96-sample.ogg" type="audio/ogg">
		
		<!-- Fallback for browsers that don't support the <audio> element -->
		<div>
			<a href="//cdn.selz.com/plyr/1.0/logistics-96-sample.mp3">Download</a>
		</div>
	</audio>
</div>
```	

#### Cross Origin (CORS)
You'll notice the `crossorigin` attribute on the example `<video>` and `<audio>` elements. This is because the media is loaded from another domain. If your media is hosted on another domain, you may need to add this attribute. 

More info on CORS here:
[https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)

###JavaScript
Much of the behaviour of the player is configurable when initialising the library. Below is an example of a default instance.

```html
<script src="dist/plyr.js"></script>
<script>
plyr.setup({
	*options*
});
</script>
```

#### Options

You can pass the following options to the setup method.

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
    <td>Completely disable Plyr. This would allow you to do a User Agent check or similar to programatically enable or disable Plyr for a certain UA. Example below.</td>
  </tr>
  <tr>
    <td><code>html</code></td>
    <td>String</td>
    <td><code><a href="controls.md">See controls.md</a></code></td>
    <td>See <a href="controls.md">controls.md</a> for more info on how the html needs to be structured.</td>
  </tr>
  <tr>
    <td><code>debug</code></td>
    <td>Boolean</td>
    <td><code>false</code></td>
    <td>Display debugging information on what Plyr is doing.</td>
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
    <td><code>click</code></td>
    <td>Boolean</td>
    <td><code>true</code></td>
    <td>Click (or tap) will toggle pause/play of a <code>&lt;video&gt;</code>.</td>
  </tr>
  <tr>
    <td><code>tooltips</code></td>
    <td>Boolean</td>
    <td><code>false</code></td>
    <td>Display control labels as tooltips on :hover &amp; :focus (by default, the labels are screen reader only).</td>
  </tr>
  <tr>
    <td><code>selectors</code></td>
    <td>Object</td>
    <td>&mdash;</td>
    <td>See <code>plyr.js</code> in <code>/src</code> for more info. The only option you might want to change is <code>player</code> which is the hook used for Plyr, the default is <code>.player</code>.</td>
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
    <td>Two properties; <code>enabled</code> which toggles if fullscreen should be enabled (if the browser supports it). The default value is <code>true</code>. Also an extra property called <code>fallback</code> which will enable a full window view for older browsers. The default value is <code>true</code>.</td>
  </tr>
  <tr>
    <td><code>storage</code></td>
    <td>Object</td>
    <td>&mdash;</td>
    <td>Two properties; <code>enabled</code> which toggles if local storage should be enabled (if the browser supports it). The default value is `true`. This enables storing user settings, currently it only stores volume but more will be added later. The second property <code>key</code> is the key used for the local storage. The default is <code>plyr_volume</code> until more settings are stored.</td>
  </tr>
 </tbody>
</table>

## API

A `plyr` object is added to any element that Plyr is initialised on. You can then control the player by accessing methods in the `plyr` object. For example if you wanted to pause Plyr:

```javascript
document.querySelectorAll(".player")[0].plyr.pause();
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
    <td><code>support(...)</code></td>
    <td>String</td>
    <td>Determine if a player supports a certain MIME type.</td>
  </tr>
  <tr>
    <td><code>source(...)</code></td>
    <td>String or Array</td>
    <td>
      Set the media source.
      <br><br> 
      <strong>string</strong><br>
      <code>.source("/path/to/video.mp4")</code><br>
      This will set the <code>src</code> attribute on the <code>video</code> or <code>audio</code> element.
      <br><br>
      <strong>array</strong><br>
      <code>.source([{ src: "/path/to/video.webm", type: "video/webm", ...more attributes... }, { src: "/path/to/video.mp4", type: "video/mp4", ...more attributes... }])`</code><br>
      This will inject a child `source` element for every element in the array with the specified attributes. `src` is the only required attribute although adding `type` is recommended as it helps the browser decide which file to download and play. 
    </td>
  </tr>
    <tr>
    <td><code>poster(...)</code></td>
    <td>String</td>
    <td>Set the poster url. This is supported for the <code>video</code> element only.</td>
  </tr>
 </tbody>
</table>

## Events/Callbacks

The `plyr` object on the player element also contains a `media` property which is a reference to the `<audio>` or `<video>` element within the player which you can use to listen for events. Here's an example:

```javascript
var media = document.querySelectorAll(".player")[0].plyr.media;

media.addEventListener("playing", function() { 
  console.log("playing");
});
```
A complete list of events can be found here:
[Media Events - W3.org](http://www.w3.org/2010/05/video/mediaevents.html)

## Fullscreen
Fullscreen in Plyr is supported for all browsers that [currently support it](http://caniuse.com/#feat=fullscreen). If you're using the default CSS, you can also use a "full browser" mode which will use the full browser window by adding the `player-fullscreen` class to your container.

## Browser support

<table width="100%" style="text-align: center;">
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
      <td>✖&sup2;</td>
      <td>✔&sup3;</td>
    </tr>
  </tbody>
</table>

&sup1; iPhone forces the native player for `<video>` so no customisation possible. `<audio>` elements have volume controls disabled.

&sup2; Native player used (no support for `<progress>` or `<input type="range">`)

&sup3; IE10 has no native fullscreen support, fallback can be used (see options)

The `enabled` option can be used to disable certain User Agents. For example, if you don't want to use Plyr for smartphones, you could use: 

```javascript
enabled: /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
```
If a User Agent is disabled but supports `<video>` and `<audio>` natively, it will use the native player.

Any unsupported browsers will display links to download the media if the correct html is used.

## Issues
If you find anything weird with Plyr, please let us know using the GitHub issues tracker.

## Author
Plyr is developed by Sam Potts ([@sam_potts](https://twitter.com/sam_potts)) ([sampotts.me](http://sampotts.me))

## Mentions
- [The Changelog](http://thechangelog.com/plyr-simple-html5-media-player-custom-controls-webvtt-captions/)
- [HTML5 Weekly #177](http://html5weekly.com/issues/177)
- [Web Design Weekly #174](https://web-design-weekly.com/2015/02/24/web-design-weekly-174/)
- [Hacker News](https://news.ycombinator.com/item?id=9136774)
- [Web Platform Daily](http://webplatformdaily.org/releases/2015-03-04)
- [LayerVault Designer News](https://news.layervault.com/stories/45394-plyr--a-simple-html5-media-player)

## Used by
- [Selz.com](https://selz.com)

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