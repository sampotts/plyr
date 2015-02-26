# Plyr
A simple, accessible HTML5 media player. 

[Checkout the demo](http://plyr.io)

## Why?
We wanted a lightweight, accessible and customisable media player that just supports *modern* browsers. Sure, there are many other players out there but we wanted to keep things simple, using the right elements for the job. 

## Features
- **Accessible** - full support for captions and screen readers.
- **Lightweight** - just 4.8KB minified and gzipped.
- **Customisable** - make the player look how you want with the markup you want.
- **Semantic** - uses HTML5 form inputs for volume (range) and progress element for playback progress.
- **No dependencies** - written in native JS.
- **API** - easy to use API.
- **Fallback** - if there's no support, the native players are used.
- **Fullscreen** - options to run the player full browser or the user can toggle fullscreen.

## Changelog
Check out [the changelog](changelog.md)

## Planned development
- Accept a string selector, a node, or a nodelist for the `container` property of `selectors`.
- Accept a selector for the `html` template property.
- Multiple language captions (with selection)

If you have any cool ideas or features, please let me know by [creating an issue](https://github.com/Selz/plyr/issues/new) or of course, forking and sending a pull request.

## Implementation

### Bower
If bower is your thang, you can grab Plyr using:
```
bower install plyr
```
More info on setting up dependencies can be found in the [Bower Docs](http://bower.io/docs/creating-packages/#maintaining-dependencies)

### CSS
If you want to use the default css, add the css file from /dist into your head, or even better use the less file included in /assets in your build to save a request. 

```html
<link rel="stylesheet" href="/css/plyr.css" />
```

### SVG
The SVG sprite for the controls icons is loaded in by AJAX to help with performance. This is best added before the closing `</body>`

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
})(document,"/svg/sprite.svg");
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
	<video poster="//cdn.sampotts.me/plyr/poster.jpg" controls crossorigin>
		<!-- Video files -->
		<source src="//cdn.sampotts.me/plyr/movie.mp4" type="video/mp4">
		<source src="//cdn.sampotts.me/plyr/movie.webm" type="video/webm">
		
		<!-- Text track file -->
		<track kind="captions" label="English captions" src="//cdn.sampotts.me/plyr/movie_captions_en.vtt" srclang="en" default>
		
		<!-- Fallback for browsers that don't support the <video> element -->
		<div>
			<a href="//cdn.sampotts.me/plyr/movie.mp4">
				<img src="//cdn.sampotts.me/plyr/poster.jpg" alt="Download">
			</a>
		</div>
	</video>
</div>
```
And the same for `<audio>`

```html
<div class="player">
	<audio controls>
		<!-- Audio files -->
		<source src="//cdn.sampotts.me/plyr/logistics-96-sample.mp3" type="audio/mp3">
		
		<!-- Fallback for browsers that don't support the <audio> element -->
		<div>
			<a href="//cdn.sampotts.me/plyr/logistics-96-sample.mp3">Download</a>
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
<script src="js/plyr.js"></script>
<script>
plyr.setup({
	html: **your controls html**
});
</script>
```
You can pass the following settings:

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
    <td><code>&mdash;</code></td>
    <td>This is **required**. It is the markup used for the controls. In the demo, we use Hogan templates as we are already using them. You can of course, just specify vanilla html. The only requirement is your selectors should match the `selectors` option below. If you check `controls.html` in `/assets/templates` to get an idea of how the default html works. 

    You need to add two placeholders to your html template:
    - {id} for the dynamically generated ID for the player (for form controls)
    - {aria_label} for the dynamically generated play button label for screen readers</td>
  </tr>
  <tr>
    <td><code>debug</code></td>
    <td>Boolean</td>
    <td><code>false</code></td>
    <td>Display debugging information on what Plyr is doing.</td>
  </tr>
  <tr>
    <td><code>seekInterval</code></td>
    <td>Number</td>
    <td><code>10</code></td>
    <td>The time, in seconds, to seek when a user hits fast forward or rewind.</td>
  </tr>
  <tr>
    <td><code>volume</code></td>
    <td>Number</td>
    <td><code>5</code></td>
    <td>A number, between 1 and 10, representing the inital volume of the player.</td>
  </tr>
  <tr>
    <td><code>click</code></td>
    <td>Boolean</td>
    <td><code>true</code></td>
    <td>Click (or tap) will toggle pause/play of a `<video>`.</td>
  </tr>
  <tr>
    <td><code>selectors</code></td>
    <td>Object</td>
    <td>&mdash;</td>
    <td>See `plyr.js` in `/assets` for more info. The only option you might want to change is `player` which is the hook used for Plyr, the default is `.player`.</td>
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
    <td>This currently contains one property `defaultActive` which toggles if captions should be on by default. The default value is `false`.</td>
  </tr>
  <tr>
    <td><code>fullscreen</code></td>
    <td>Object</td>
    <td>&mdash;</td>
    <td>This currently contains one property `enabled` which toggles if fullscreen should be enabled (if the browser supports it). The default value is `true`.</td>
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
    <td><code>play</code></td>
    <td>&mdash;</td>
    <td>Plays the media</td>
  </tr>
  <tr>
    <td><code>pause</code></td>
    <td>&mdash;</td>
    <td>Pauses the media</td>
  </tr>
    <tr>
    <td><code>restart</code></td>
    <td>&mdash;</td>
    <td>Restarts playback</td>
  </tr>
  <tr>
    <td><code>rewind</code></td>
    <td>Number</td>
    <td>Rewinds by the provided parameter, in seconds. If no parameter is provided, the default seekInterval is used (10 seconds).</td>
  </tr>
  <tr>
    <td><code>forward</code></td>
    <td>Number</td>
    <td>Fast forwards by the provided parameter, in seconds. If no parameter is provided, the default seekInterval is used (10 seconds).</td>
  </tr>
  <tr>
    <td><code>setVolume</code></td>
    <td>Number</td>
    <td>Sets the player voume to the provided parameter. The value should be between 0 (muted) and 10 (loudest). If no parameter is provided, the default volume is used (5). Values over 10 are ignored.</td>
  </tr>
  <tr>
    <td><code>toggleMute</code></td>
    <td>&mdash;</td>
    <td>Toggles mute for the player.</td>
  </tr>
  <tr>
    <td><code>toggleCaptions</code></td>
    <td>&mdash;</td>
    <td>Toggles whether captions are enabled.</td>
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

## Support
- Chrome: full support
- Safari: full support
- Firefox: full support
- Internet Explorer 10, 11: full support
- Internet Explorer 9: native player used (no support for `<progress>` or `<input type="range">`) 

The `enabled` option can be used to disable certain User Agents. For example, if you don't want to use Plyr for smartphones, you could use: 

```javascript
enabled: /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
```
If a User Agent is disabled but supports `<video>` and `<audio>` natively, it will use the native player.

Any unsupported browsers will display links to download the media if the correct html is used.

## Issues
If you find anything weird with Plyr, please let us know using the Github issues tracker.

## Author
This was created by Sam Potts ([@sam_potts](https://twitter.com/sam_potts))

## Useful links and credits
Credit to the PayPal HTML5 Video player from which Plyr's caption functionality is ported from:
- [PayPal's Accessible HTML5 Video Player](https://github.com/paypal/accessible-html5-video-player)
- The icons used in Plyr are [Vicons](https://dribbble.com/shots/1663443-60-Vicons-Free-Icon-Set) plus some ones I made

Also these links helped created Plyr:
- [Media Events - W3.org](http://www.w3.org/2010/05/video/mediaevents.html)
- [Styling the `<progress>` element - hongkiat.com](http://www.hongkiat.com/blog/html5-progress-bar/)

## Copyright and License
Copyright 2014, Selz.com under [the BSD license](license.md).