// ==========================================================================
// Plyr
// plyr.js v1.0.0
// https://github.com/sampotts/plyr
// ==========================================================================
// Credits: http://paypal.github.io/accessible-html5-video-player/
// ==========================================================================

(function (api) {
	"use strict";

	// Globals
	var fullscreen, config;

	// Default config
	var defaults = {
		enabled: 				true, 
		debug: 					false,
		seekInterval: 			10,
		volume: 				5,
		click: 					true,
		selectors: {
			container: 			".player",
			controls: 			".player-controls",
			buttons: {
				play: 			"[data-player='play']",
				pause: 			"[data-player='pause']",
				restart: 		"[data-player='restart']",
				rewind: 		"[data-player='rewind']",
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
			video:				"player-video",
			videoWrapper: 		"player-video-wrapper",
			audio:				"player-audio",
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
			defaultActive: 		false
		},
		fullscreen: {
			enabled: 			true
		}
	};

	// Credits: http://paypal.github.io/accessible-html5-video-player/
	// Unfortunately, due to scattered support, browser sniffing is required
	function _browserSniff() {
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
	
	// Replace all
	function _replaceAll(string, find, replace) {
		return string.replace(new RegExp(find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), "g"), replace);
	}

	// Wrap an element
	function _wrap(elements, wrapper) {
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

	// Toggle class on an element
	function _toggleClass(element, name, state) {
		if(element){
			if(element.classList) {
				element.classList[state ? "add" : "remove"](name);
			}
			else {
				var className = (" " + element.className + " ").replace(/\s+/g, " ").replace(" " + name + " ", "");
				element.className = className + (state ? " " + name : "");
			}
		}
	}

	// Bind event
	function _on(element, event, callback) {
		element.addEventListener(event, callback, false);
	}

	// Get click position relative to parent
	// http://www.kirupa.com/html5/getting_mouse_click_position.htm
	function _getClickPosition(event) {
		var parentPosition = _fullscreen().isFullScreen() ? { x: 0, y: 0 } : _getPosition(event.currentTarget);

		return {
			x: event.clientX - parentPosition.x,
			y: event.clientY - parentPosition.y
		};
	}
	// Get element position
	function _getPosition(element) {
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
    function _extend(destination, source) {
		for (var property in source) {
			if (source[property] && source[property].constructor && source[property].constructor === Object) {
				destination[property] = destination[property] || {};
				_extend(destination[property], source[property]);
			} 
			else {
				destination[property] = source[property];
			}
		}
		return destination;
	}

	// Fullscreen API
	function _fullscreen() {
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

				if (typeof document[fullscreen.prefix + "CancelFullScreen"] != "undefined") {
					fullscreen.supportsFullScreen = true;
					break;
				}
				// Special case for MS (when isn't it?)
				else if (typeof document.msExitFullscreen != "undefined" && document.msFullscreenEnabled) {
					fullscreen.prefix = "ms";
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
					case "ms":
						// Docs say document.msFullScreenElement returns undefined
						// if no element is full screem but it returns null, cheers
						// https://msdn.microsoft.com/en-us/library/ie/dn265028%28v=vs.85%29.aspx
						return (document.msFullscreenElement !== null);
					default:
						return document[this.prefix + "FullScreen"];
				}
			};
			fullscreen.requestFullScreen = function(element) {
				return (this.prefix === "") ? element.requestFullScreen() : element[this.prefix + (this.prefix == "ms" ? "RequestFullscreen" : "RequestFullScreen")](this.prefix === "webkit" ? element.ALLOW_KEYBOARD_INPUT : null);
			};
			fullscreen.cancelFullScreen = function() {
				return (this.prefix === "") ? document.cancelFullScreen() : document[this.prefix + (this.prefix == "ms" ? "ExitFullscreen" : "CancelFullScreen")]();
			};
			fullscreen.element = function() { 
				return (this.prefix === "") ? document.fullscreenElement : document[this.prefix + "FullscreenElement"];
			};
		}

		return fullscreen;
	}

	// Player instance
	function Plyr(container) {
		var player = this;
		player.container = container;

		// Captions functions
		// Credits: http://paypal.github.io/accessible-html5-video-player/

		// For "manual" captions, adjust caption position when play time changed (via rewind, clicking progress bar, etc.)
		function _adjustManualCaptions() {
			player.subcount = 0;
			while (_timecodeMax(player.captions[player.subcount][0]) < player.media.currentTime.toFixed(1)) {
				player.subcount++;
				if (player.subcount > player.captions.length-1) {
					player.subcount = player.captions.length-1;
					break;
				}
			}
		}
		// Display captions container and button (for initialization)
		function _showCaptions() {
			_toggleClass(player.container, config.classes.captions.enabled, true);

			if (config.captions.defaultActive) {
				_toggleClass(player.container, config.classes.captions.active, true);
				player.buttons.captions.setAttribute("checked", "checked");
			}
		}
		// Utilities for caption time codes
		function _timecodeMin(tc) {
			var tcpair = [];
			tcpair = tc.split(" --> ");
			return _subTcSecs(tcpair[0]);
		}
		function _timecodeMax(tc) {
			var tcpair = [];
			tcpair = tc.split(" --> ");
			return _subTcSecs(tcpair[1]);
		}
		function _subTcSecs(tc) {
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

		// Find all elements
		function _getElements(selector) {
			return player.container.querySelectorAll(selector);
		}

		// Find a single element
		function _getElement(selector) {
			return _getElements(selector)[0];
		}

		// Insert controls
		function _injectControls() {
			// Insert custom video controls
			if (config.debug) {
				console.log("Injecting custom controls");
			}

			// Use specified html 
			// Need to do a default?
			var html = config.html;

			// Replace aria label instances
			html = _replaceAll(html, "{aria-label}", config.playAriaLabel);

			// Replace all id references
			html = _replaceAll(html, "{id}", player.random);

			// Inject into the container
			player.container.insertAdjacentHTML("beforeend", html);
		}

		// Find the UI controls and store references
		function _findElements() {
			player.controls 			= _getElement(config.selectors.controls);

			// Buttons
			player.buttons = {};
			player.buttons.play 		= _getElement(config.selectors.buttons.play);
			player.buttons.pause 		= _getElement(config.selectors.buttons.pause);
			player.buttons.restart 		= _getElement(config.selectors.buttons.restart);
			player.buttons.rewind 		= _getElement(config.selectors.buttons.rewind);
			player.buttons.forward 		= _getElement(config.selectors.buttons.forward);
			player.buttons.mute 		= _getElement(config.selectors.buttons.mute);
			player.buttons.captions		= _getElement(config.selectors.buttons.captions);
			player.buttons.fullscreen 	= _getElement(config.selectors.buttons.fullscreen);

			// Progress
			player.progress = {};
			player.progress.bar			= _getElement(config.selectors.progress);
			player.progress.text 		= player.progress.bar.getElementsByTagName("span")[0];

			// Volume
			player.volume 				= _getElement(config.selectors.buttons.volume);

			// Timing
			player.duration 			= _getElement(config.selectors.duration);
			player.seekTime 			= _getElements(config.selectors.seekTime);
		}

		// Setup media
		function _setupMedia() {
			player.media = player.container.querySelectorAll("audio, video")[0];

			// If there's no media, bail
			if(!player.media) {
				console.error("No audio or video element found!");
				return false;
			}

			// Remove native video controls
			player.media.removeAttribute("controls");

			// Set media type
			player.type = (player.media.tagName.toLowerCase() == "video" ? "video" : "audio");

			// Add type class
			_toggleClass(player.container, config.classes[player.type], true);

			// If there's no autoplay attribute, assume the video is stopped and add state class
			_toggleClass(player.container, config.classes.stopped, (player.media.getAttribute("autoplay") === null));

			// Inject the player wrapper
			if(player.type === "video") {
				// Create the wrapper div
				var wrapper = document.createElement("div");
				wrapper.setAttribute("class", config.classes.videoWrapper);

				// Wrap the video in a container
				_wrap(player.media, wrapper);

				// Cache the container
				player.videoContainer = wrapper;
			}
		}

		// Setup captions
		function _setupCaptions() {
			if(player.type === "video") {
				// Inject the container
				player.videoContainer.insertAdjacentHTML("afterbegin", "<div class='" + config.selectors.captions.replace(".", "") + "'></div>");

				// Cache selector
				player.captionsContainer = _getElement(config.selectors.captions);

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
					_toggleClass(player.container, config.classes.captions.enabled);
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
						_showCaptions(player);

						track = {};
						tracks = player.media.textTracks;
						for (j=0; j < tracks.length; j++) {
							track = player.media.textTracks[j];
							track.mode = "hidden";
							if (track.kind === "captions") {
								_on(track, "cuechange",function() {
									if (this.activeCues[0]) {
										if (this.activeCues[0].hasOwnProperty("text")) {
											player.captionsContainer.innerHTML = this.activeCues[0].text;
										}
									}
								});
							}
						}
					}
					// Caption tracks not natively supported
					else {
						if (config.debug) {
							console.log("textTracks not supported so rendering captions manually");
						}
						_showCaptions(player);

						// Render captions from array at appropriate time
						player.currentCaption = "";
						player.subcount = 0;
						player.captions = [];

						_on(player.media, "timeupdate", function() {
							// Check if the next caption is in the current time range
							if (player.media.currentTime.toFixed(1) > _timecodeMin(player.captions[player.subcount][0]) && 
								player.media.currentTime.toFixed(1) < _timecodeMax(player.captions[player.subcount][0])) {
									player.currentCaption = player.captions[player.subcount][1];
							}
							// Is there a next timecode?
							if (player.media.currentTime.toFixed(1) > _timecodeMax(player.captions[player.subcount][0]) && 
								player.subcount < (player.captions.length-1)) {
									player.subcount++;
							}
							// Render the caption
							player.captionsContainer.innerHTML = player.currentCaption;
						});

						if (captionSrc !== "") {
							// Create XMLHttpRequest Object
							var xhr = new XMLHttpRequest();

							xhr.onreadystatechange = function() {
								if (xhr.readyState === 4) {
									if (xhr.status === 200) {
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
									} 
									else if (config.debug) {
										console.error("There was a problem loading the caption file via ajax.");
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
		function _setupSeeking() {
			// Update number of seconds in rewind and fast forward buttons
			player.seekTime[0].innerHTML = config.seekInterval;
			player.seekTime[1].innerHTML = config.seekInterval;
		}

		// Setup fullscreen
		function _setupFullscreen() {
			if(player.type === "video" && config.fullscreen.enabled) {
				if(fullscreen.supportsFullScreen) {
					if(config.debug) {
						console.log("Fullscreen enabled");
					}

					_toggleClass(player.container, config.classes.fullscreen.enabled, true);
				}
				else if(config.debug) {
					console.warn("Fullscreen not supported");
				}
			}	
		}

		// Play media
		function _play() {
			player.media.play();

			_toggleClass(player.container, config.classes.stopped);
			_toggleClass(player.container, config.classes.playing, true);
		}

		// Pause media
		function _pause() {
			player.media.pause(); 

			_toggleClass(player.container, config.classes.playing);
			_toggleClass(player.container, config.classes.stopped, true);
		}

		// Restart playback
		function _restart() {
			// Move to beginning
			player.media.currentTime = 0;

			// Special handling for "manual" captions
			if (!player.isTextTracks) {
				player.subcount = 0;
			}

			// Play and ensure the play button is in correct state
			_play();
		}

		// Rewind
		function _rewind(seekInterval) {
			// Use default if needed
			if(typeof seekInterval === "undefined") {
				seekInterval = config.seekInterval;
			}

			var targetTime = player.media.currentTime - seekInterval;

			if (targetTime < 0) {
				player.media.currentTime = 0;
			}
			else {
				player.media.currentTime = targetTime;
			}
			// Special handling for "manual" captions
			if (!player.isTextTracks && player.type === "video") {
				_adjustManualCaptions(player);
			}
		}

		// Fast forward
		function _forward(seekInterval) {
			// Use default if needed
			if(typeof seekInterval === "undefined") {
				seekInterval = config.seekInterval;
			}

			var targetTime = player.media.currentTime + seekInterval;

			if (targetTime > player.media.duration) {
				player.media.currentTime = player.media.duration;
			}
			else {
				player.media.currentTime = targetTime;
			}
			// Special handling for "manual" captions
			if (!player.isTextTracks && player.type === "video") {
				_adjustManualCaptions(player);
			}
		}

		// Toggle fullscreen
		function _toggleFullscreen() {
			if(!fullscreen.isFullScreen()) {
				fullscreen.requestFullScreen(player.container);
			}
			else {
				fullscreen.cancelFullScreen();
			}
		}

		// Set volume
		function _setVolume(volume) {
			// Use default if needed
			if(typeof volume === "undefined") {
				volume = config.volume;
			}
			// Maximum is 10
			if(volume > 10) {
				volume = 10;
			}

			player.volume.value = volume;
			player.media.volume = parseFloat(volume / 10);
			_checkMute();
		}

		// Mute
		function _toggleMute(muted) {
			// If the method is called without parameter, toggle based on current value
			if(typeof active === "undefined") {
				muted = !player.media.muted;
				player.buttons.mute.checked = muted;
			}

			player.media.muted = muted;
			_checkMute();
		}

		// Toggle captions
		function _toggleCaptions(active) { 
			// If the method is called without parameter, toggle based on current value
			if(typeof active === "undefined") {
				active = (player.container.className.indexOf(config.classes.captions.active) === -1);
				player.buttons.captions.checked = active;
			}

			if (active) {
				_toggleClass(player.container, config.classes.captions.active, true);
			} 
			else {
				_toggleClass(player.container, config.classes.captions.active);
			}
		}

		// Check mute state
		function _checkMute() {
			_toggleClass(player.container, config.classes.muted, (player.media.volume === 0 || player.media.muted));
		}

		// Listen for events
		function _listeners() {
			// Fullscreen
			_on(player.buttons.fullscreen, "click", _toggleFullscreen);

			// Click video
			if(player.type === "video" && config.click) {
				_on(player.videoContainer, "click", function() {
					if(player.media.paused) {
						_play();
					}
					else if(player.media.ended) {
						_restart();
					}
					else {
						_pause();
					}
				});
			}

			// Play
			_on(player.buttons.play, "click", function() { 
				_play(); 
				player.buttons.pause.focus(); 
			});

			// Pause
			_on(player.buttons.pause, "click", function() { 
				_pause(); 
				player.buttons.play.focus(); 
			});

			// Restart
			_on(player.buttons.restart, "click", _restart);

			// Rewind
			_on(player.buttons.rewind, "click", function() {
				_rewind(config.seekInterval);
			});

			// Fast forward
			_on(player.buttons.forward, "click", function() {
				_forward(config.seekInterval);
			});

			// Get the HTML5 range input element and append audio volume adjustment on change
			_on(player.volume, "change", function() {
				_setVolume(this.value);
			});

			// Mute
			_on(player.buttons.mute, "change", function() {
				_toggleMute(this.checked);
			});
			
			// Duration
			_on(player.media, "timeupdate", function() {
				player.secs = parseInt(player.media.currentTime % 60);
				player.mins = parseInt((player.media.currentTime / 60) % 60);
				
				// Ensure it"s two digits. For example, 03 rather than 3.
				player.secs = ("0" + player.secs).slice(-2);
				player.mins = ("0" + player.mins).slice(-2);

				// Render
				player.duration.innerHTML = player.mins + ":" + player.secs;
			});

			// Progress bar
			_on(player.media, "timeupdate", function() {
				player.percent = (100 / player.media.duration) * player.media.currentTime;

				if (player.percent > 0) {
					player.progress.bar.value = player.percent;
					player.progress.text.innerHTML = player.percent;
				}
			});

			// Skip when clicking progress bar
			_on(player.progress.bar, "click", function(event) {
				player.pos = _getClickPosition(event).x / this.offsetWidth;
				player.media.currentTime = player.pos * player.media.duration;
				
				// Special handling for "manual" captions
				if (!player.isTextTracks && player.type === "video") {
					_adjustManualCaptions(player);
				}
			});

			// Captions
			_on(player.buttons.captions, "click", function() { 
				_toggleCaptions(this.checked);
			});

			// Clear captions at end of video
			_on(player.media, "ended", function() {
				if(player.type === "video") {
					player.captionsContainer.innerHTML = "";
				}
				_toggleClass(player.container, config.classes.stopped, true);
				_toggleClass(player.container, config.classes.playing);
			});
		}

		function _init() {
			// Setup the fullscreen api 
			fullscreen = _fullscreen();

			// Sniff 
			player.browserInfo = _browserSniff();
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

			// Setup media
			_setupMedia();

			// Generate random number for id/for attribute values for controls
			player.random = Math.floor(Math.random() * (10000));

			// Inject custom controls
			_injectControls();

			// Find the elements
			_findElements();

			// Set volume
			_setVolume(config.volume);

			// Setup fullscreen
			_setupFullscreen();

			// Captions
			_setupCaptions();

			// Seeking
			_setupSeeking();

			// Listeners
			_listeners();
		}

		_init();

		return {
			media: 				player.media,
			play: 				_play,
			pause: 				_pause,
			restart: 			_restart,
			rewind: 			_rewind,
			forward: 			_forward,
			setVolume: 			_setVolume,
			toggleMute: 		_toggleMute,
			toggleCaptions: 	_toggleCaptions
		}
	}

	// Expose setup function
	api.setup = function(options){
		// Extend the default options with user specified
		config = _extend(defaults, options);

		// If enabled carry on
		// You may want to disable certain UAs etc
		if(!config.enabled) {
			return false;
		}

		// Get the players 
		var elements = document.querySelectorAll(config.selectors.container), players = [];

		// Create a player instance for each element
		for (var i = elements.length - 1; i >= 0; i--) {
			// Get the current element
			var element = elements[i];

			// Setup a player instance and add to the element
			if(typeof element.plyr === "undefined") { 
				element.plyr = new Plyr(element);
			}

			// Add to return array
			players.push(element.plyr);
		}

		return players;
	}
}(this.plyr = this.plyr || {}));