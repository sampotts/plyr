// ==========================================================================
// Simple Media Player
// simple-media.js v1.0.0
// https://github.com/sampotts/simple-media
// ==========================================================================
// Credits: http://paypal.github.io/accessible-html5-video-player/
// ==========================================================================

// Fullscreen API
(function() {
    var
        fullscreen = {
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

    // Export api
    window.fullscreen = fullscreen;
})();

function InitPxVideo(options) {

	"use strict";

	// Replace all
	// ---------------------------------
	if (!String.prototype.replaceAll) {
		Object.defineProperty(String.prototype, "replaceAll", {
			value: function(find, replace) {
				return this.replace(new RegExp(find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), "g"), replace);
			}
		});
	}

	// Get click position relative to parent
	// http://www.kirupa.com/html5/getting_mouse_click_position.htm
	// ---------------------------------
	function getClickPosition(e) {
		var parentPosition = window.fullscreen.isFullScreen() ? { x: 0, y: 0 } : getPosition(e.currentTarget);

		return {
			x: e.clientX - parentPosition.x,
			y: e.clientY - parentPosition.y
		};
	}

	// Get element position
	// http://www.kirupa.com/html5/getting_mouse_click_position.htm
	// ---------------------------------
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
	function adjustManualCaptions(obj) {
		obj.subcount = 0;
		while (video_timecode_max(obj.captions[obj.subcount][0]) < obj.movie.currentTime.toFixed(1)) {
			obj.subcount++;
			if (obj.subcount > obj.captions.length-1) {
				obj.subcount = obj.captions.length-1;
				break;
			}
		}
	}

	// Display captions container and button (for initialization)
	function showCaptionContainerAndButton(obj) {
		//obj.captionsBtnContainer.className = "px-video-captions-btn-container show";
		if (obj.isCaptionDefault) {
			obj.captionsContainer.className = "px-video-captions show";
			obj.captionsBtn.setAttribute("checked", "checked");
		}
	}

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

	// Global variable
	var obj = {};

	obj.arBrowserInfo = browserSniff();
	obj.browserName = obj.arBrowserInfo[0];
	obj.browserMajorVersion = obj.arBrowserInfo[1];

	// If IE8, stop customization (use fallback)
	// If IE9, stop customization (use native controls)
	if (obj.browserName === "IE" && (obj.browserMajorVersion === 8 || obj.browserMajorVersion === 9) ) {
		return false;
	}

	// If smartphone or tablet, stop customization as video (and captions in latest devices) are handled natively
	obj.isSmartphoneOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
	if (obj.isSmartphoneOrTablet) {
		return false;
	}

	// Set debug mode
	if (typeof(options.debug)==="undefined") {
		options.debug = false;
	}
	obj.debug = options.debug;

	// Output browser info to log if debug on
	if (options.debug) {
		console.log(obj.browserName + " " + obj.browserMajorVersion);
	}

	// Set up aria-label for Play button with the videoTitle option
	if ((typeof(options.videoTitle)==="undefined") || (options.videoTitle==="")) {
		obj.playAriaLabel = "Play";
	}
	else {
		obj.playAriaLabel = "Play video, " + options.videoTitle;
	}

	// Get the container, video element, and controls container
	obj.container = document.getElementById(options.videoId);
	obj.container.className = obj.container.className + " stopped";
	obj.movie = obj.container.getElementsByTagName("video")[0];
	obj.controls = obj.container.getElementsByClassName("px-video-controls")[0];

	// Remove native video controls
	obj.movie.removeAttribute("controls");
	
	// Generate random number for ID/FOR attribute values for controls
	obj.randomNum = Math.floor(Math.random() * (10000));
	
	// Insert custom video controls
	if (options.debug) {
		console.log("Inserting custom video controls");
	}
	obj.controls.innerHTML = options.html
								.replaceAll("{aria-label}", obj.playAriaLabel)
								.replaceAll("{id}", obj.randomNum);

	// Responsive ffs
	// ----
	// Adjust layout per width of video - container
	//obj.movieWidth = obj.movie.width;
	//if (obj.movieWidth < 360) {
	//	obj.movieWidth = 360;
	//}
	//obj.container.setAttribute("style", "width:" + obj.movieWidth + "px");
	
	// Adjust layout per width of video - controls/mute offset
	obj.labelMute = document.getElementById("labelMute" + obj.randomNum);
	obj.labelMuteOffset = obj.movieWidth - 390;
	if (obj.labelMuteOffset < 0) {
		obj.labelMuteOffset = 0;
	}
	obj.labelMute.setAttribute("style", "margin-left:" + obj.labelMuteOffset + "px");

	// Get URL of caption file if exists
	var captionSrc = "",
		kind,
		children = obj.movie.childNodes;

	for (var i = 0; i < children.length; i++) {
		if (children[i].nodeName.toLowerCase() === "track") {
			kind = children[i].getAttribute("kind");
			if (kind === "captions") {
				captionSrc = children[i].getAttribute("src");
			}
		}
	}

	// Record if caption file exists or not
	obj.captionExists = true;
	if (captionSrc === "") {
		obj.captionExists = false;
		if (options.debug) {
			console.log("No caption track found.");
		}
	}
	else {
		if (options.debug) {
			console.log("Caption track found; URI: " + captionSrc);
		}
	}

	// Set captions on/off - on by default
	if (typeof(options.captionsOnDefault) === "undefined") {
		options.captionsOnDefault = true;
	}
	obj.isCaptionDefault = options.captionsOnDefault;

	// Number of seconds for rewind and forward buttons
	if (typeof(options.seekInterval) === "undefined") {
		options.seekInterval = 10;
	}
	obj.seekInterval = options.seekInterval;
	
	// Get the elements for the controls
	obj.btnPlay = obj.container.getElementsByClassName("px-video-play")[0];
	obj.btnPause = obj.container.getElementsByClassName("px-video-pause")[0];
	obj.btnRestart = obj.container.getElementsByClassName("px-video-restart")[0];
	obj.btnRewind = obj.container.getElementsByClassName("px-video-rewind")[0];
	obj.btnForward = obj.container.getElementsByClassName("px-video-forward")[0];
	obj.btnVolume = obj.container.getElementsByClassName("px-video-volume")[0];
	obj.btnMute = obj.container.getElementsByClassName("px-video-mute")[0];
	obj.progressBar = obj.container.getElementsByClassName("px-video-progress")[0];
	obj.progressBarSpan = obj.progressBar.getElementsByTagName("span")[0];
	obj.captionsContainer = obj.container.getElementsByClassName("px-video-captions")[0];
	obj.captionsBtn = obj.container.getElementsByClassName("px-video-btnCaptions")[0];
	obj.captionsBtnContainer = obj.container.getElementsByClassName("px-video-captions-btn-container")[0];
	obj.duration = obj.container.getElementsByClassName("px-video-duration")[0];
	obj.txtSeconds = obj.container.getElementsByClassName("px-seconds");

	obj.toggleFullscreen = obj.container.querySelector("[data-player='toggle-fullscreen']");
	obj.videoContainer = obj.container.querySelector(".player-video");

	// Update number of seconds in rewind and fast forward buttons
	obj.txtSeconds[0].innerHTML = obj.seekInterval;
	obj.txtSeconds[1].innerHTML = obj.seekInterval;

	// Determine if HTML5 textTracks is supported (for captions)
	obj.isTextTracks = false;
	if (obj.movie.textTracks) {
		obj.isTextTracks = true;
	}

	// Fullscreen
	obj.toggleFullscreen.addEventListener("click", function() {
		if(!window.fullscreen.isFullScreen()) {
			window.fullscreen.requestFullScreen(obj.container);
		}
		else {
			window.fullscreen.cancelFullScreen();
		}
	}, false);

	// Click video
	obj.videoContainer.addEventListener("click", function() {
		if(obj.movie.paused) {
			play();
		}
		else if(obj.movie.ended) {
			restart();
		}
		else {
			pause();
		}
	}, false);

	function play() {
		obj.movie.play();
		obj.container.className = obj.container.className.replace("stopped", "playing");
		
	}

	function pause() {
		obj.movie.pause(); 
		obj.container.className = obj.container.className.replace("playing", "stopped");
	}

	function restart() {
		// Move to beginning
		obj.movie.currentTime = 0;

		// Special handling for "manual" captions
		if (!obj.isTextTracks) {
			obj.subcount = 0;
		}

		// Play and ensure the play button is in correct state
		play();
	}

	// Play
	obj.btnPlay.addEventListener("click", function() { play(); obj.btnPause.focus(); }, false);

	// Pause
	obj.btnPause.addEventListener("click", function() { pause(); obj.btnPlay.focus(); }, false);

	// Restart
	obj.btnRestart.addEventListener("click", restart, false);

	// Rewind
	obj.btnRewind.addEventListener("click", function() {
	    var targetTime = obj.movie.currentTime - obj.seekInterval;
	    if (targetTime < 0) {
	      obj.movie.currentTime = 0;
	    }
	    else {
	      obj.movie.currentTime = targetTime;
	    }
		// Special handling for "manual" captions
		if (!obj.isTextTracks) {
			adjustManualCaptions(obj);
		}
	}, false);

	// Fast forward
	obj.btnForward.addEventListener("click", function() {
	    var targetTime = obj.movie.currentTime + obj.seekInterval;
		if (targetTime > obj.movie.duration) {
			obj.movie.currentTime = obj.movie.duration;
		}
		else {
			obj.movie.currentTime = targetTime;
		}
		// Special handling for "manual" captions
		if (!obj.isTextTracks) {
			adjustManualCaptions(obj);
		}
	}, false);

	// Get the HTML5 range input element and append audio volume adjustment on change
	obj.btnVolume.addEventListener("change", function() {
		obj.movie.volume = parseFloat(this.value / 10);
	}, false);

	// Mute
	obj.btnMute.addEventListener("click", function() {
		if (obj.movie.muted === true) {
			obj.movie.muted = false;
		}
		else {
			obj.movie.muted = true;
		}
	}, false);
	
	// Duration
	obj.movie.addEventListener("timeupdate", function() {
		obj.secs = parseInt(obj.movie.currentTime % 60);
		obj.mins = parseInt((obj.movie.currentTime / 60) % 60);
		
		// Ensure it"s two digits. For example, 03 rather than 3.
		obj.secs = ("0" + obj.secs).slice(-2);
		obj.mins = ("0" + obj.mins).slice(-2);

		// Render
		obj.duration.innerHTML = obj.mins + ":" + obj.secs;
	}, false);

	// Progress bar
	obj.movie.addEventListener("timeupdate", function() {
		obj.percent = (100 / obj.movie.duration) * obj.movie.currentTime;
		if (obj.percent > 0) {
			obj.progressBar.value = obj.percent;
			obj.progressBarSpan.innerHTML = obj.percent;
		}
	}, false);

	// Skip when clicking progress bar
	obj.progressBar.addEventListener("click", function(e) {
		obj.pos = getClickPosition(e).x / this.offsetWidth;
		obj.movie.currentTime = obj.pos * obj.movie.duration;
		
		// Special handling for "manual" captions
		if (!obj.isTextTracks) {
			adjustManualCaptions(obj);
		}
	});

	// Clear captions at end of video
	obj.movie.addEventListener("ended", function() {
		obj.captionsContainer.innerHTML = "";
	});

	// ***
	// Captions
	// ***

	// Toggle display of captions via captions button
	obj.captionsBtn.addEventListener("click", function() { 
		if (this.checked) {
			obj.captionsContainer.className = "px-video-captions show";
		} else {
			obj.captionsContainer.className = "px-video-captions hide";
		}
	}, false);

	// If no caption file exists, hide container for caption text
	if (!obj.captionExists) {
		obj.captionsContainer.className = "px-video-captions hide";
	}

	// If caption file exists, process captions
	else {

		// If IE 10/11 or Firefox 31+ or Safari 7+, don"t use native captioning (still doesn"t work although they claim it"s now supported)
		if ((obj.browserName==="IE" && obj.browserMajorVersion===10) || 
				(obj.browserName==="IE" && obj.browserMajorVersion===11) || 
				(obj.browserName==="Firefox" && obj.browserMajorVersion>=31) || 
				(obj.browserName==="Safari" && obj.browserMajorVersion>=7)) {
			if (options.debug) {
				console.log("Detected IE 10/11 or Firefox 31+ or Safari 7+");
			}
			// set to false so skips to "manual" captioning
			obj.isTextTracks = false;
			
			// turn off native caption rendering to avoid double captions [doesn"t work in Safari 7; see patch below]
			var track = {};
			var tracks = obj.movie.textTracks;
			for (var j=0; j < tracks.length; j++) {
				track = obj.movie.textTracks[j];
				track.mode = "hidden";
			}
		}

		// Rendering caption tracks - native support required - http://caniuse.com/webvtt
		if (obj.isTextTracks) {
			if (options.debug) {
				console.log("textTracks supported");
			}
			showCaptionContainerAndButton(obj);

			var track = {};
			var tracks = obj.movie.textTracks;
			for (var j=0; j < tracks.length; j++) {
				track = obj.movie.textTracks[j];
				track.mode = "hidden";
				if (track.kind === "captions") {
					track.addEventListener("cuechange",function() {
						if (this.activeCues[0]) {
							if (this.activeCues[0].hasOwnProperty("text")) {
								obj.captionsContainer.innerHTML = this.activeCues[0].text;
							}
						}
					},false);
				}
			}
		}
		// Caption tracks not natively supported
		else {
			if (options.debug) {
				console.log("textTracks not supported so rendering captions manually");
			}
			showCaptionContainerAndButton(obj);

			// Render captions from array at appropriate time
			obj.currentCaption = "";
			obj.subcount = 0;
			obj.captions = [];

			obj.movie.addEventListener("timeupdate", function() {
				// Check if the next caption is in the current time range
				if (obj.movie.currentTime.toFixed(1) > video_timecode_min(obj.captions[obj.subcount][0]) && 
					obj.movie.currentTime.toFixed(1) < video_timecode_max(obj.captions[obj.subcount][0])) {
						obj.currentCaption = obj.captions[obj.subcount][1];
				}
				// Is there a next timecode?
				if (obj.movie.currentTime.toFixed(1) > video_timecode_max(obj.captions[obj.subcount][0]) && 
					obj.subcount < (obj.captions.length-1)) {
						obj.subcount++;
				}
				// Render the caption
				obj.captionsContainer.innerHTML = obj.currentCaption;
			}, false);

			if (captionSrc !== "") {
				// Create XMLHttpRequest object
				var xhr;
				if (window.XMLHttpRequest) {
					xhr = new XMLHttpRequest();
				} else if (window.ActiveXObject) { // IE8
					xhr = new ActiveXObject("Microsoft.XMLHTTP");
				}
				xhr.onreadystatechange = function() {
					if (xhr.readyState === 4) {
						if (xhr.status === 200) {
							if (options.debug) {
								console.log("xhr = 200");
							}
							
							obj.captions = [];
							var records = [], 
								record,
								req = xhr.responseText;
							records = req.split("\n\n");
							for (var r=0; r < records.length; r++) {
								record = records[r];
								obj.captions[r] = [];
								obj.captions[r] = record.split("\n");
							}
							// Remove first element ("VTT")
							obj.captions.shift();

							if (options.debug) {
								console.log("Successfully loaded the caption file via ajax.");
							}
						} else {
							if (options.debug) {
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
		if (obj.browserName === "Safari" && obj.browserMajorVersion === 7) {
			console.log("Safari 7 detected; removing track from DOM");
			var tracks = obj.movie.getElementsByTagName("track");
			obj.movie.removeChild(tracks[0]);
		}
	}
}