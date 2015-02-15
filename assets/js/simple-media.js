// ==========================================================================
// Simple Media Player
// simple-media.js v1.0.0
// https://github.com/sampotts/simple-media
// ==========================================================================
// Credits: http://paypal.github.io/accessible-html5-video-player/
// ==========================================================================

/*global ActiveXObject*/

(function(api){
	"use strict";

	// Globals
	var fullscreen, config;

	// Handler cache
	var handlers = {};

	// Object cache
	var player = {};

	// Default config
	var defaults = {
		enabled: 				true, // /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
		debug: 					false,
		seekInterval: 			10,
		volume: 				5,
		clickToPause: 			true,
		selectors: {
			container: 			".player",
			controls: 			".player-controls",
			buttons: {
				play: 			"[data-player='play']",
				pause: 			"[data-player='pause']",
				restart: 		"[data-player='restart']",
				rewind: 		"[data-player='restart']",
				forward: 		"[data-player='fast-forward']",
				mute: 			"[data-player='mute']",
				volume: 		"[data-player='volume']",
				captions: 		"[data-player='captions']",
				fullscreen: 	"[data-player='fullscreen']"
			},
			progress: 			".player-progress",
			captions: 			".player-captions",
			duration: 			".player-duration",
			seekTime: 			".player-seek-time"
		},
		classes: {
			videoContainer:		"player-video",
			stopped: 			"stopped",
			playing: 			"playing",
			muted: 				"muted",
			captions: {
				active: 		"captions-active",
				enabled: 		"captions-enabled"
			},
			fullscreen: {
				enabled: 		"fullscreen-enabled"
			}
		},
		captions: {
			defaultActive: 		true
		},
		fullscreen: {
			enabled: 			true
		}
	};

	// Credits: http://paypal.github.io/accessible-html5-video-player/
	// Unfortunately, due to scattered support, browser sniffing is required
	function browserSniff() {
		var nAgt = navigator.userAgent,
			browserName = navigator.appName,
			fullVersion = ""+parseFloat(navigator.appVersion),
			majorVersion = parseInt(navigator.appVersion,10),
			nameOffset,
			verOffset,
			ix;

		// MSIE 11
		if ((navigator.appVersion.indexOf("Windows NT") !== -1) && (navigator.appVersion.indexOf("rv:11") !== -1)) {
			browserName = "IE";
			fullVersion = "11;";
		}
		// MSIE
		else if ((verOffset=nAgt.indexOf("MSIE")) !== -1) {
			browserName = "IE";
			fullVersion = nAgt.substring(verOffset+5);
		}
		// Chrome
		else if ((verOffset=nAgt.indexOf("Chrome")) !== -1) {
			browserName = "Chrome";
			fullVersion = nAgt.substring(verOffset+7);
		}
		// Safari
		else if ((verOffset=nAgt.indexOf("Safari")) !== -1) {
			browserName = "Safari";
			fullVersion = nAgt.substring(verOffset+7);
			if ((verOffset=nAgt.indexOf("Version")) !== -1) {
				fullVersion = nAgt.substring(verOffset+8);
			}
		}
		// Firefox
		else if ((verOffset=nAgt.indexOf("Firefox")) !== -1) {
			browserName = "Firefox";
			fullVersion = nAgt.substring(verOffset+8);
		}
		// In most other browsers, "name/version" is at the end of userAgent 
		else if ( (nameOffset=nAgt.lastIndexOf(" ")+1) < (verOffset=nAgt.lastIndexOf("/")) ) {
			browserName = nAgt.substring(nameOffset,verOffset);
			fullVersion = nAgt.substring(verOffset+1);
			if (browserName.toLowerCase()==browserName.toUpperCase()) {
				browserName = navigator.appName;
			}
		}
		// Trim the fullVersion string at semicolon/space if present
		if ((ix=fullVersion.indexOf(";")) !== -1) {
			fullVersion=fullVersion.substring(0,ix);
		}
		if ((ix=fullVersion.indexOf(" ")) !== -1) {
			fullVersion=fullVersion.substring(0,ix);
		}
		// Get major version
		majorVersion = parseInt(""+fullVersion,10);
		if (isNaN(majorVersion)) {
			fullVersion = ""+parseFloat(navigator.appVersion); 
			majorVersion = parseInt(navigator.appVersion,10);
		}
		// Return data
		return [browserName, majorVersion];
	}
	// Utilities for caption time codes
	function video_timecode_min(tc) {
		var tcpair = [];
		tcpair = tc.split(" --> ");
		return videosub_tcsecs(tcpair[0]);
	}
	function video_timecode_max(tc) {
		var tcpair = [];
		tcpair = tc.split(" --> ");
		return videosub_tcsecs(tcpair[1]);
	}
	function videosub_tcsecs(tc) {
		if (tc === null || tc === undefined) {
			return 0;
		}
		else {
			var tc1 = [],
				tc2 = [],
				seconds;
			tc1 = tc.split(",");
			tc2 = tc1[0].split(":");
			seconds = Math.floor(tc2[0]*60*60) + Math.floor(tc2[1]*60) + Math.floor(tc2[2]);
			return seconds;
		}
	}
	// For "manual" captions, adjust caption position when play time changed (via rewind, clicking progress bar, etc.)
	// http://paypal.github.io/accessible-html5-video-player/
	function adjustManualCaptions(player) {
		player.subcount = 0;
		while (video_timecode_max(player.captions[player.subcount][0]) < player.media.currentTime.toFixed(1)) {
			player.subcount++;
			if (player.subcount > player.captions.length-1) {
				player.subcount = player.captions.length-1;
				break;
			}
		}
	}
	// Display captions container and button (for initialization)
	function showCaptions(player) {
		player.container.className += " " + config.classes.captions.enabled;

		if (config.captions.defaultActive) {
			player.container.className += " " + config.classes.captions.active;
			player.buttons.captions.setAttribute("checked", "checked");
		}
	}

	// Replace all
	function replaceAll(string, find, replace) {
		return string.replace(new RegExp(find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), "g"), replace);
	}

	// Wrap an element
	function wrap(elements, wrapper) {
	    // Convert `elms` to an array, if necessary.
	    if (!elements.length) {
	    	elements = [elements];
	    } 
	    
	    // Loops backwards to prevent having to clone the wrapper on the
	    // first element (see `child` below).
	    for (var i = elements.length - 1; i >= 0; i--) {
	        var child = (i > 0) ? wrapper.cloneNode(true) : wrapper;
	        var el    = elements[i];
	        
	        // Cache the current parent and sibling.
	        var parent  = el.parentNode;
	        var sibling = el.nextSibling;
	        
	        // Wrap the element (is automatically removed from its current
	        // parent).
	        child.appendChild(el);
	        
	        // If the element had a sibling, insert the wrapper before
	        // the sibling to maintain the HTML structure; otherwise, just
	        // append it to the parent.
	        if (sibling) {
	            parent.insertBefore(child, sibling);
	        } else {
	            parent.appendChild(child);
	        }
	    }
	}

	// Get click position relative to parent
	// http://www.kirupa.com/html5/getting_mouse_click_position.htm
	function getClickPosition(e) {
		var parentPosition = fullscreen.isFullScreen() ? { x: 0, y: 0 } : getPosition(e.currentTarget);

		return {
			x: e.clientX - parentPosition.x,
			y: e.clientY - parentPosition.y
		};
	}
	// Get element position
	function getPosition(element) {
		var xPosition = 0;
		var yPosition = 0;

		while (element) {
			xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
			yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
			element = element.offsetParent;
		}
		
		return { 
			x: xPosition, 
			y: yPosition 
		};
	}

	// Deep extend/merge two Objects
	// http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
	// Removed call to arguments.callee (used explicit function name instead)
    function extend(destination, source) {
		for (var property in source) {
			if (source[property] && source[property].constructor && source[property].constructor === Object) {
				destination[property] = destination[property] || {};
				extend(destination[property], source[property]);
			} 
			else {
				destination[property] = source[property];
			}
		}
		return destination;
	}

	// Our internal function that executes handlers with a given name
	function executeHandlers(eventName){
		// Get all handlers with the selected name
		var handler = handlers[eventName] || [], 
			len = handler.length, 
			i;
		
		// Execute each
		for(i = 0; i< len; i++){
			// You can use apply to specify what "this" and parameters the callback gets
			handler[i].apply(player.media,[]);
		}
	}

	// Fullscreen API
	function fullscreenApi() {
		var fullscreen = {
				supportsFullScreen: false,
				isFullScreen: function() { return false; },
				requestFullScreen: function() {},
				cancelFullScreen: function() {},
				fullScreenEventName: "",
				element: null,
				prefix: ""
			},
			browserPrefixes = "webkit moz o ms khtml".split(" ");

		// check for native support
		if (typeof document.cancelFullScreen != "undefined") {
			fullscreen.supportsFullScreen = true;
		}
		else {
			// check for fullscreen support by vendor prefix
			for (var i = 0, il = browserPrefixes.length; i < il; i++ ) {
				fullscreen.prefix = browserPrefixes[i];

				if (typeof document[fullscreen.prefix + "CancelFullScreen" ] != "undefined" ) {
					fullscreen.supportsFullScreen = true;

					break;
				}
			}
		}

		// Safari doesn't support the ALLOW_KEYBOARD_INPUT flag so set it to not supported
		// https://bugs.webkit.org/show_bug.cgi?id=121496
		if(fullscreen.prefix === "webkit" && !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)) {
			 fullscreen.supportsFullScreen = false;
		}

		// Update methods to do something useful
		if (fullscreen.supportsFullScreen) {
			fullscreen.fullScreenEventName = fullscreen.prefix + "fullscreenchange";

			fullscreen.isFullScreen = function() {
				switch (this.prefix) {
					case "":
						return document.fullScreen;
					case "webkit":
						return document.webkitIsFullScreen;
					default:
						return document[this.prefix + "FullScreen"];
				}
			};
			fullscreen.requestFullScreen = function(element) {
				return (this.prefix === "") ? element.requestFullScreen() : element[this.prefix + "RequestFullScreen"](this.prefix === "webkit" ? element.ALLOW_KEYBOARD_INPUT : null);
			};
			fullscreen.cancelFullScreen = function() {
				return (this.prefix === "") ? document.cancelFullScreen() : document[this.prefix + "CancelFullScreen"]();
			};
			fullscreen.element = function() { 
				return (this.prefix === "") ? document.fullscreenElement : document[this.prefix + "FullscreenElement"];
			};
		}

		return fullscreen;
	}

	// Insert controls
	function injectControls() {
		// Insert custom video controls
		if (config.debug) {
			console.log("Injecting custom controls");
		}

		// Use specified html 
		// Need to do a default?
		var html = config.html;

		// Replace aria label instances
		html = replaceAll(html, "{aria-label}", config.playAriaLabel);

		// Replace all id references
		html = replaceAll(html, "{id}", player.random);

		// Inject into the container
		player.container.insertAdjacentHTML("beforeend", html);
	}

	// Find all elements
	function getElements(selector) {
		return player.container.querySelectorAll(selector);
	}

	// Find a single element
	function getElement(selector) {
		return getElements(selector)[0];
	}

	// Find the UI controls and store references
	function findElements() {
		player.controls 			= getElement(config.selectors.controls);

		// Buttons
		player.buttons = {};
		player.buttons.play 		= getElement(config.selectors.buttons.play);
		player.buttons.pause 		= getElement(config.selectors.buttons.pause);
		player.buttons.restart 		= getElement(config.selectors.buttons.restart);
		player.buttons.rewind 		= getElement(config.selectors.buttons.rewind);
		player.buttons.forward 		= getElement(config.selectors.buttons.forward);
		player.buttons.mute 		= getElement(config.selectors.buttons.mute);
		player.buttons.captions		= getElement(config.selectors.buttons.captions);
		player.buttons.fullscreen 	= getElement(config.selectors.buttons.fullscreen);

		// Progress
		player.progress = {};
		player.progress.bar			= getElement(config.selectors.progress);
		player.progress.text 		= player.progress.bar.getElementsByTagName("span")[0];

		// Volume
		player.volume 				= getElement(config.selectors.buttons.volume);

		// Timing
		player.duration 			= getElement(config.selectors.duration);
		player.seekTime 			= getElements(config.selectors.seekTime);
	}

	// Play media
	function play() {
		player.media.play();
		player.container.className = player.container.className.replace(config.classes.stopped, config.classes.playing);
	}

	// Pause media
	function pause() {
		player.media.pause(); 
		player.container.className = player.container.className.replace(config.classes.playing, config.classes.stopped);
	}

	// Restart playback
	function restart() {
		// Move to beginning
		player.media.currentTime = 0;

		// Special handling for "manual" captions
		if (!player.isTextTracks) {
			player.subcount = 0;
		}

		// Play and ensure the play button is in correct state
		play();
	}

	// Set volume
	function setVolume() {
		player.volume.value = config.volume;
		player.media.volume = parseFloat(config.volume / 10);
		checkMute();
	}

	// Check mute state
	function checkMute() {
		if(player.media.volume === 0 || player.media.muted) {
			player.container.className += " " + config.classes.muted;
		}
		else {
			player.container.className = player.container.className.replace(config.classes.muted, "");
		}
	}

	// Setup media
	function setupMedia() {
		player.media = player.container.querySelectorAll("audio, video")[0];

		// If there's no media, bail
		if(!player.media) {
			console.error("No audio or video element found!");
			return false;
		}

		// If there's no autoplay attribute, assume the video is stopped
		if(player.media.getAttribute("autoplay") === null) {
			player.container.className += " " + config.classes.stopped;
		}

		// Remove native video controls
		player.media.removeAttribute("controls");

		// Set type
		player.type = (player.media.tagName.toLowerCase() == "video" ? "video" : "audio");

		// Inject the player wrapper
		if(player.type === "video") {
			// Create the wrapper div
			var wrapper = document.createElement("div");
			wrapper.setAttribute("class", config.classes.videoContainer);

			// Wrap the video in a container
			wrap(player.media, wrapper);

			// Cache the container
			player.videoContainer = wrapper;
		}
	}

	// Setup captions
	function setupCaptions() {
		if(player.type === "video") {
			// Inject the container
			player.videoContainer.insertAdjacentHTML("afterbegin", "<div class='" + config.selectors.captions.replace(".", "") + "'></div>");

			// Cache selector
			player.captionsContainer = getElement(config.selectors.captions);

			// Determine if HTML5 textTracks is supported
			player.isTextTracks = false;
			if (player.media.textTracks) {
				player.isTextTracks = true;
			}

			// Get URL of caption file if exists
			var captionSrc = "",
				kind,
				children = player.media.childNodes;

			for (var i = 0; i < children.length; i++) {
				if (children[i].nodeName.toLowerCase() === "track") {
					kind = children[i].getAttribute("kind");
					if (kind === "captions") {
						captionSrc = children[i].getAttribute("src");
					}
				}
			}

			// Record if caption file exists or not
			player.captionExists = true;
			if (captionSrc === "") {
				player.captionExists = false;
				if (config.debug) {
					console.log("No caption track found.");
				}
			}
			else {
				if (config.debug) {
					console.log("Caption track found; URI: " + captionSrc);
				}
			}

			// If no caption file exists, hide container for caption text
			if (!player.captionExists) {
				player.container.className = player.container.className.replace(config.classes.captions.enabled, "");
			}

			// If caption file exists, process captions
			else {
				var track = {}, tracks, j;

				// If IE 10/11 or Firefox 31+ or Safari 7+, don"t use native captioning (still doesn"t work although they claim it"s now supported)
				if ((player.browserName === "IE" && player.browserMajorVersion === 10) || 
						(player.browserName === "IE" && player.browserMajorVersion === 11) || 
						(player.browserName === "Firefox" && player.browserMajorVersion >= 31) || 
						(player.browserName === "Safari" && player.browserMajorVersion >= 7)) {
					if (config.debug) {
						console.log("Detected IE 10/11 or Firefox 31+ or Safari 7+");
					}
					// set to false so skips to "manual" captioning
					player.isTextTracks = false;
					
					// turn off native caption rendering to avoid double captions [doesn"t work in Safari 7; see patch below]
					track = {};
					tracks = player.media.textTracks;
					for (j=0; j < tracks.length; j++) {
						track = player.media.textTracks[j];
						track.mode = "hidden";
					}
				}

				// Rendering caption tracks - native support required - http://caniuse.com/webvtt
				if (player.isTextTracks) {
					if (config.debug) {
						console.log("textTracks supported");
					}
					showCaptions(player);

					track = {};
					tracks = player.media.textTracks;
					for (j=0; j < tracks.length; j++) {
						track = player.media.textTracks[j];
						track.mode = "hidden";
						if (track.kind === "captions") {
							track.addEventListener("cuechange",function() {
								if (this.activeCues[0]) {
									if (this.activeCues[0].hasOwnProperty("text")) {
										player.captionsContainer.innerHTML = this.activeCues[0].text;
									}
								}
							},false);
						}
					}
				}
				// Caption tracks not natively supported
				else {
					if (config.debug) {
						console.log("textTracks not supported so rendering captions manually");
					}
					showCaptions(player);

					// Render captions from array at appropriate time
					player.currentCaption = "";
					player.subcount = 0;
					player.captions = [];

					player.media.addEventListener("timeupdate", function() {
						// Check if the next caption is in the current time range
						if (player.media.currentTime.toFixed(1) > video_timecode_min(player.captions[player.subcount][0]) && 
							player.media.currentTime.toFixed(1) < video_timecode_max(player.captions[player.subcount][0])) {
								player.currentCaption = player.captions[player.subcount][1];
						}
						// Is there a next timecode?
						if (player.media.currentTime.toFixed(1) > video_timecode_max(player.captions[player.subcount][0]) && 
							player.subcount < (player.captions.length-1)) {
								player.subcount++;
						}
						// Render the caption
						player.captionsContainer.innerHTML = player.currentCaption;
					}, false);

					if (captionSrc !== "") {
						// Create XMLHttpRequest Object
						var xhr;
						if (window.XMLHttpRequest) {
							xhr = new XMLHttpRequest();
						} 
						else if (window.ActiveXObject) { // IE8
							xhr = new ActiveXObject("Microsoft.XMLHTTP");
						}
						xhr.onreadystatechange = function() {
							if (xhr.readyState === 4) {
								if (xhr.status === 200) {
									if (config.debug) {
										console.log("xhr = 200");
									}
									
									player.captions = [];
									var records = [], 
										record,
										req = xhr.responseText;
									records = req.split("\n\n");
									for (var r=0; r < records.length; r++) {
										record = records[r];
										player.captions[r] = [];
										player.captions[r] = record.split("\n");
									}
									// Remove first element ("VTT")
									player.captions.shift();

									if (config.debug) {
										console.log("Successfully loaded the caption file via ajax.");
									}
								} else {
									if (config.debug) {
										console.log("There was a problem loading the caption file via ajax.");
									}
								}
							}
						}
						xhr.open("get", captionSrc, true);
						xhr.send();
					}
				}

				// If Safari 7, removing track from DOM [see "turn off native caption rendering" above]
				if (player.browserName === "Safari" && player.browserMajorVersion === 7) {
					if (config.debug) {
						console.log("Safari 7 detected; removing track from DOM");
					}
					tracks = player.media.getElementsByTagName("track");
					player.media.removeChild(tracks[0]);
				}
			}
		}
	}

	// Setup seeking
	function setupSeeking() {
		// Update number of seconds in rewind and fast forward buttons
		player.seekTime[0].innerHTML = config.seekInterval;
		player.seekTime[1].innerHTML = config.seekInterval;
	}

	// Setup fullscreen
	function setupFullscreen() {
		if(player.type === "video" && config.fullscreen.enabled) {
			
			if(config.debug) {
				console.log(fullscreen.supportsFullScreen ? "Fullscreen supported" : "No fullscreen supported");
			}
			if(fullscreen.supportsFullScreen) {
				if(config.debug) {
					console.log("Fullscreen enabled");
				}

				player.container.className += " " + config.classes.fullscreen.enabled;
			}
			else if(config.debug) {
				console.warn("Fullscreen not supported");
			}
		}
		
	}

	// Listen for events
	function listeners() {
		// Fullscreen
		player.buttons.fullscreen.addEventListener("click", function() {
			if(!fullscreen.isFullScreen()) {
				fullscreen.requestFullScreen(player.container);
			}
			else {
				fullscreen.cancelFullScreen();
			}
		}, false);

		// Click video
		if(player.type === "video" && config.clickToPause) {
			player.videoContainer.addEventListener("click", function() {
				if(player.media.paused) {
					play();
				}
				else if(player.media.ended) {
					restart();
				}
				else {
					pause();
				}
			}, false);
		}

		// Play
		player.buttons.play.addEventListener("click", function() { 
			play(); 
			player.buttons.pause.focus(); 
		}, false);

		// Pause
		player.buttons.pause.addEventListener("click", function() { 
			pause(); 
			player.buttons.play.focus(); 
		}, false);

		// Restart
		player.buttons.restart.addEventListener("click", restart, false);

		// Rewind
		player.buttons.rewind.addEventListener("click", function() {
			var targetTime = player.media.currentTime - config.seekInterval;

			if (targetTime < 0) {
				player.media.currentTime = 0;
			}
			else {
				player.media.currentTime = targetTime;
			}
			// Special handling for "manual" captions
			if (!player.isTextTracks && player.type === "video") {
				adjustManualCaptions(player);
			}
		}, false);

		// Fast forward
		player.buttons.forward.addEventListener("click", function() {
			var targetTime = player.media.currentTime + config.seekInterval;

			if (targetTime > player.media.duration) {
				player.media.currentTime = player.media.duration;
			}
			else {
				player.media.currentTime = targetTime;
			}
			// Special handling for "manual" captions
			if (!player.isTextTracks && player.type === "video") {
				adjustManualCaptions(player);
			}
		}, false);

		// Get the HTML5 range input element and append audio volume adjustment on change
		player.volume.addEventListener("change", function() {
			config.volume = this.value;
			setVolume();
		}, false);

		// Mute
		player.buttons.mute.addEventListener("click", function() {
			if (player.media.muted === true) {
				player.media.muted = false;
			}
			else {
				player.media.muted = true;
			}
			checkMute();
		}, false);
		
		// Duration
		player.media.addEventListener("timeupdate", function() {
			player.secs = parseInt(player.media.currentTime % 60);
			player.mins = parseInt((player.media.currentTime / 60) % 60);
			
			// Ensure it"s two digits. For example, 03 rather than 3.
			player.secs = ("0" + player.secs).slice(-2);
			player.mins = ("0" + player.mins).slice(-2);

			// Render
			player.duration.innerHTML = player.mins + ":" + player.secs;
		}, false);

		// Progress bar
		player.media.addEventListener("timeupdate", function() {
			player.percent = (100 / player.media.duration) * player.media.currentTime;

			if (player.percent > 0) {
				player.progress.bar.value = player.percent;
				player.progress.text.innerHTML = player.percent;
			}
		}, false);

		// Skip when clicking progress bar
		player.progress.bar.addEventListener("click", function(e) {
			player.pos = getClickPosition(e).x / this.offsetWidth;
			player.media.currentTime = player.pos * player.media.duration;
			
			// Special handling for "manual" captions
			if (!player.isTextTracks && player.type === "video") {
				adjustManualCaptions(player);
			}
		});

		// Captions
		player.buttons.captions.addEventListener("click", function() { 
			if (this.checked) {
				player.container.className += " " + config.classes.captions.active;
			} 
			else {
				player.container.className = player.container.className.replace(config.classes.captions.active, "");
			}
		}, false);

		// Clear captions at end of video
		player.media.addEventListener("ended", function() {
			if(player.type === "video") {
				player.captionsContainer.innerHTML = "";
			}
			player.container.className = player.container.className.replace(config.classes.playing, config.classes.stopped);
		});
	}
 
	// Our "on" function which collects handlers
	api.on = function(eventName, handler){
		// If no handler collection exists, create one
		if(!handlers[eventName]){
			handlers[eventName] = [];
		}
		handlers[eventName].push(handler);
	}

	function setupPlayer(element) {
		player.container = element;
		
		// Setup media
		setupMedia();

		// Generate random number for id/for attribute values for controls
		player.random = Math.floor(Math.random() * (10000));

		// Inject custom controls
		injectControls();

		// Find the elements
		findElements();

		// Set volume
		setVolume();

		// Setup fullscreen
		setupFullscreen();

		// Captions
		setupCaptions();

		// Seeking
		setupSeeking();

		// Listeners
		listeners();
	}

	// Expose setup function
	api.setup = function(options){
		// Extend the default options with user specified
		config = extend(defaults, options);

		// If enabled carry on
		if(!config.enabled) {
			return false;
		}

		// Setup the fullscreen api 
		fullscreen = fullscreenApi();

		// Sniff 
		player.browserInfo = browserSniff();
		player.browserName = player.browserInfo[0];
		player.browserMajorVersion = player.browserInfo[1];

		// Debug info
		if(config.debug) {
			console.log(player.browserName + " " + player.browserMajorVersion);
		}

		// If IE8, stop customization (use fallback)
		// If IE9, stop customization (use native controls)
		if (player.browserName === "IE" && (player.browserMajorVersion === 8 || player.browserMajorVersion === 9) ) {
			if(config.debug) {
				console.error("Browser not suppported.");
			}
			return false;
		}

		// Set up aria-label for Play button with the title option
		if (typeof(config.title) === "undefined" || !config.title.length) {
			config.playAriaLabel = "Play";
		}
		else {
			config.playAriaLabel = "Play " + config.title;
		}

		// Get the container and video container
		var element = document.querySelector(config.selectors.container);
		if(element === null) {
			if(config.debug) {
				console.error("Selector " + config.selectors.container + " not found!");
			}
			return false;
		}
		setupPlayer(element);

		// Trigger the setup event
		executeHandlers("setup");
	}

}(this.simpleMedia = this.simpleMedia || {}));