// ==========================================================================
// Plyr
// plyr.js v1.0.17
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
        enabled:                true, 
        debug:                  false,
        seekTime:               10,
        volume:                 5,
        click:                  true,
        selectors: {
            container:          ".player",
            controls:           ".player-controls",
            buttons: {
                play:           "[data-player='play']",
                pause:          "[data-player='pause']",
                restart:        "[data-player='restart']",
                rewind:         "[data-player='rewind']",
                forward:        "[data-player='fast-forward']",
                mute:           "[data-player='mute']",
                volume:         "[data-player='volume']",
                captions:       "[data-player='captions']",
                fullscreen:     "[data-player='fullscreen']"
            },
            progress: {
                container:      ".player-progress",
                buffer:         ".player-progress-buffer",
                played:         ".player-progress-played"
            },
            captions:           ".player-captions",
            duration:           ".player-duration",
            seekTime:           ".player-seek-time"
        },
        classes: {
            video:              "player-video",
            videoWrapper:       "player-video-wrapper",
            audio:              "player-audio",
            stopped:            "stopped",
            playing:            "playing",
            muted:              "muted",
            captions: {
                enabled:        "captions-enabled",
                active:         "captions-active"
            },
            fullscreen: {
                enabled:        "fullscreen-enabled",
                active:         "fullscreen-active"
            }
        },
        captions: {
            defaultActive:      false
        },
        fullscreen: {
            enabled:            true,
            fallback:           true
        },
        storage: {
            enabled:            true
        }
    };

    // Debugging
    function _log(text, error) {
        if(config.debug && window.console) {
            console[(error ? "error" : "log")](text);
        }
    }

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

    // Toggle event
    function _toggleHandler(element, events, callback, toggle) {
        events = events.split(" ");

        for (var i = 0; i < events.length; i++) {
            element[toggle ? "addEventListener" : "removeEventListener"](events[i], callback, false);
        }
    }

    // Bind event
    function _on(element, events, callback) {
        _toggleHandler(element, events, callback, true);
    }

    // Unbind event
    function _off(element, events, callback) {
        _toggleHandler(element, events, callback, false);
    }

    // Get percentage
    function _getPercentage(current, max) {
        return Math.floor((current / max) * 100);
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
            // Yet again Microsoft awesomeness, 
            // Sometimes the prefix is "ms", sometimes "MS" to keep you on your toes
            fullscreen.fullScreenEventName = (fullscreen.prefix == "ms" ? "MSFullscreenChange" : fullscreen.prefix + "fullscreenchange");

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

    // Local storage
    function _storage() {
        var storage = {
            supported: (function() {
                try {
                    return "localStorage" in window && window.localStorage !== null;
                } 
                catch(e) {
                    return false;
                }
            })()
        }
        return storage;
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

        // Determine if we're in an iframe
        function _inFrame() {
            try {
                return window.self !== window.top;
            } 
            catch (e) {
                return true;
            }
        }

        // Insert controls
        function _injectControls() {
            // Insert custom video controls
            _log("Injecting custom controls.");

            // Use specified html 
            // Need to do a default?
            var html = config.html;

            // Replace seek time instances
            html = _replaceAll(html, "{seektime}", config.seekTime);

            // Replace all id references
            html = _replaceAll(html, "{id}", player.random);

            // Inject into the container
            player.container.insertAdjacentHTML("beforeend", html);
        }

        // Find the UI controls and store references
        function _findElements() {
            try {
                player.controls                 = _getElement(config.selectors.controls);

                // Buttons
                player.buttons = {};
                player.buttons.play             = _getElement(config.selectors.buttons.play);
                player.buttons.pause            = _getElement(config.selectors.buttons.pause);
                player.buttons.restart          = _getElement(config.selectors.buttons.restart);
                player.buttons.rewind           = _getElement(config.selectors.buttons.rewind);
                player.buttons.forward          = _getElement(config.selectors.buttons.forward);
                player.buttons.mute             = _getElement(config.selectors.buttons.mute);
                player.buttons.captions         = _getElement(config.selectors.buttons.captions);
                player.buttons.fullscreen       = _getElement(config.selectors.buttons.fullscreen);

                // Progress
                player.progress = {};
                player.progress.container       = _getElement(config.selectors.progress.container);

                // Progress - Buffering
                player.progress.buffer          = {};
                player.progress.buffer.bar      = _getElement(config.selectors.progress.buffer);
                player.progress.buffer.text     = player.progress.buffer.bar.getElementsByTagName("span")[0];

                // Progress - Played
                player.progress.played          = {};
                player.progress.played.bar      = _getElement(config.selectors.progress.played);
                player.progress.played.text     = player.progress.played.bar.getElementsByTagName("span")[0];

                // Volume
                player.volume                   = _getElement(config.selectors.buttons.volume);

                // Timing
                player.duration                 = _getElement(config.selectors.duration);
                player.seekTime                 = _getElements(config.selectors.seekTime);

                return true;
            }
            catch(e) {
                _log("It looks like there's a problem with your controls html. Bailing.", true);
                return false;
            }
        }

        // Setup aria attributes
        function _setupAria() {
            var label = player.buttons.play.innerText;

            // If there's a media title set, use that for the label
            if (typeof(config.title) !== "undefined" && config.title.length) {
                label = player.buttons.play.innerText + ", " + config.title;
            }

            player.buttons.play.setAttribute("aria-label", label);
        }

        // Setup media
        function _setupMedia() {
            player.media = player.container.querySelectorAll("audio, video")[0];

            // If there's no media, bail
            if(!player.media) {
                _log("No audio or video element found!", true);
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
                    _log("No caption track found.");
                }
                else {
                    _log("Caption track found; URI: " + captionSrc);
                }

                // If no caption file exists, hide container for caption text
                if (!player.captionExists) {
                    _toggleClass(player.container, config.classes.captions.enabled);
                }
                // If caption file exists, process captions
                else {
                    // Turn off native caption rendering to avoid double captions 
                    // This doesn't seem to work in Safari 7+, so the <track> elements are removed from the dom below
                    var tracks = player.media.textTracks;
                    for (var x=0; x < tracks.length; x++) {
                        tracks[x].mode = "hidden";
                    }

                    // Enable UI
                    _showCaptions(player);

                    // If IE 10/11 or Firefox 31+ or Safari 7+, don"t use native captioning (still doesn"t work although they claim it"s now supported)
                    if ((player.browserName === "IE" && player.browserMajorVersion === 10) || 
                            (player.browserName === "IE" && player.browserMajorVersion === 11) || 
                            (player.browserName === "Firefox" && player.browserMajorVersion >= 31) || 
                            (player.browserName === "Safari" && player.browserMajorVersion >= 7)) {
                        // Debugging
                        _log("Detected IE 10/11 or Firefox 31+ or Safari 7+.");

                        // Set to false so skips to "manual" captioning
                        player.isTextTracks = false;
                    }

                    // Rendering caption tracks
                    // Native support required - http://caniuse.com/webvtt
                    if (player.isTextTracks) {
                        _log("TextTracks supported.");
            
                        for (var y=0; y < tracks.length; y++) {
                            var track = tracks[y];

                            if (track.kind === "captions") {
                                _on(track, "cuechange", function() {
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
                        _log("TextTracks not supported so rendering captions manually.");

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

                                        _log("Successfully loaded the caption file via AJAX.");
                                    } 
                                    else {
                                        _log("There was a problem loading the caption file via AJAX.", true);
                                    }
                                }
                            }
                            
                            xhr.open("get", captionSrc, true);

                            xhr.send();
                        }
                    }

                    // If Safari 7+, removing track from DOM [see "turn off native caption rendering" above]
                    if (player.browserName === "Safari" && player.browserMajorVersion >= 7) {
                        _log("Safari 7+ detected; removing track from DOM.");

                        // Find all <track> elements
                        tracks = player.media.getElementsByTagName("track");
                        
                        // Loop through and remove one by one
                        for (var t=0; t < tracks.length; t++) {
                            player.media.removeChild(tracks[t]);
                        }
                    }
                }
            }
        }

        // Setup seeking
        function _setupSeeking() {
            // Update number of seconds in rewind and fast forward buttons
            player.seekTime[0].innerHTML = config.seekTime;
            player.seekTime[1].innerHTML = config.seekTime;
        }

        // Setup fullscreen
        function _setupFullscreen() {
            if(player.type === "video" && config.fullscreen.enabled) {
                // Check for native support
                var nativeSupport = fullscreen.supportsFullScreen;

                if(nativeSupport || (config.fullscreen.fallback && !_inFrame())) {
                    _log((nativeSupport ? "Native" : "Fallback") + " fullscreen enabled.");

                    // Add styling hook
                    _toggleClass(player.container, config.classes.fullscreen.enabled, true);
                }
                else {
                    _log("Fullscreen not supported and fallback disabled.");
                }
            }   
        }

        // Play media
        function _play() {
            player.media.play();
        }

        // Pause media
        function _pause() {
            player.media.pause();
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
        function _rewind(seekTime) {
            // Use default if needed
            if(typeof seekTime !== "number") {
                seekTime = config.seekTime;
            }

            var targetTime = player.media.currentTime - seekTime;

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
        function _forward(seekTime) {
            // Use default if needed
            if(typeof seekTime !== "number") {
                seekTime = config.seekTime;
            }

            var targetTime = player.media.currentTime + seekTime;

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

        // Check playing state
        function _checkPlaying() {
            _toggleClass(player.container, config.classes.playing, !player.media.paused);
            _toggleClass(player.container, config.classes.stopped, player.media.paused);
        }

        // Toggle fullscreen
        function _toggleFullscreen() {
            // Check for native support
            var nativeSupport = fullscreen.supportsFullScreen;

            // If it's a fullscreen change event, it's probably a native close
            if(event.type === fullscreen.fullScreenEventName) {
                config.fullscreen.active = fullscreen.isFullScreen();
            }
            // If there's native support, use it
            else if(nativeSupport) {
                // Request fullscreen
                if(!fullscreen.isFullScreen()) {
                    fullscreen.requestFullScreen(player.container);
                }
                // Bail from fullscreen
                else {
                    fullscreen.cancelFullScreen();
                }

                // Check if we're actually full screen (it could fail)
                config.fullscreen.active = fullscreen.isFullScreen();
            }
            else {
                // Otherwise, it's a simple toggle
                config.fullscreen.active = !config.fullscreen.active;

                // Bind/unbind escape key
                if(config.fullscreen.active) {
                    _on(document, "keyup", _handleEscapeFullscreen);
                    document.body.style.overflow = "hidden";
                }
                else {
                    _off(document, "keyup", _handleEscapeFullscreen);
                    document.body.style.overflow = "";
                }
            }

            // Set class hook
            _toggleClass(player.container, config.classes.fullscreen.active, config.fullscreen.active);
        }

        // Bail from faux-fullscreen 
        function _handleEscapeFullscreen(event) {
            // If it's a keypress and not escape, bail
            if((event.which || event.charCode || event.keyCode) === 27 && config.fullscreen.active) {
                _toggleFullscreen();                
            }
        }

        // Set volume
        function _setVolume(volume) {
            // Use default if needed
            if(typeof volume === "undefined") {
                if(config.storage.enabled && _storage().supported) {
                    volume = window.localStorage.plyr_volume || config.volume;
                }
                else {
                    volume = config.volume;
                }
            }
            // Maximum is 10
            if(volume > 10) {
                volume = 10;
            }

            player.volume.value = volume;
            player.media.volume = parseFloat(volume / 10);
            _checkMute();

            // Store the volume in storage
            if(config.storage.enabled && _storage().supported) {
                window.localStorage.plyr_volume = volume;
            }
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

        // Update <progress> elements
        function _updateProgress(event) {
            var progress, text, value = 0;

            switch(event.type) {
                // Video playing
                case "timeupdate":
                    progress    = player.progress.played.bar;
                    text        = player.progress.played.text;
                    value       = _getPercentage(player.media.currentTime, player.media.duration);
                    break;

                // Check buffer status
                case "playing":
                case "progress":
                    progress    = player.progress.buffer.bar;
                    text        = player.progress.buffer.text;
                    value       = (function() { 
                                    var buffered = player.media.buffered;

                                    if(buffered.length) {
                                        return _getPercentage(buffered.end(0), player.media.duration);
                                    }

                                    return 0;                                   
                                })();
                    break;
            }

            if (progress && value > 0) {
                progress.value = value;
                text.innerHTML = value;
            }
        }

        // Update the displayed play time
        function _updateTimeDisplay() {
            player.secs = parseInt(player.media.currentTime % 60);
            player.mins = parseInt((player.media.currentTime / 60) % 60);
            
            // Ensure it"s two digits. For example, 03 rather than 3.
            player.secs = ("0" + player.secs).slice(-2);
            player.mins = ("0" + player.mins).slice(-2);

            // Render
            player.duration.innerHTML = player.mins + ":" + player.secs;
        }

        // Listen for events
        function _listeners() {
            // Play
            _on(player.buttons.play, "click", function() { 
                _play(); 
                setTimeout(function() { player.buttons.pause.focus(); }, 100);
            });

            // Pause
            _on(player.buttons.pause, "click", function() { 
                _pause(); 
                setTimeout(function() { player.buttons.play.focus(); }, 100);
            });

            // Restart
            _on(player.buttons.restart, "click", _restart);

            // Rewind
            _on(player.buttons.rewind, "click", _rewind);

            // Fast forward
            _on(player.buttons.forward, "click", _forward);

            // Get the HTML5 range input element and append audio volume adjustment on change
            _on(player.volume, "change", function() {
                _setVolume(this.value);
            });

            // Mute
            _on(player.buttons.mute, "change", function() {
                _toggleMute(this.checked);
            });

            // Fullscreen
            _on(player.buttons.fullscreen, "click", _toggleFullscreen);

            // Handle user exiting fullscreen by escaping etc
            _on(document, fullscreen.fullScreenEventName, _toggleFullscreen);

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
            
            // Duration
            _on(player.media, "timeupdate", _updateTimeDisplay);

            // Playing progress
            _on(player.media, "timeupdate", _updateProgress);

            // Skip when clicking progress bar
            _on(player.progress.played.bar, "click", function(event) {
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
                _checkPlaying();
            });

            // Check for buffer progress
            _on(player.media, "progress", _updateProgress);

            // Also check on start of playing
            _on(player.media, "playing", _updateProgress);

            // Handle native mute
            _on(player.media, "volumechange", _checkMute);

            // Handle native play/pause
            _on(player.media, "play pause", _checkPlaying);
        }

        function _init() {
            // Setup the fullscreen api 
            fullscreen = _fullscreen();

            // Sniff 
            player.browserInfo = _browserSniff();
            player.browserName = player.browserInfo[0];
            player.browserMajorVersion = player.browserInfo[1];

            // Debug info
            _log(player.browserName + " " + player.browserMajorVersion);

            // If IE8, stop customization (use fallback)
            // If IE9, stop customization (use native controls)
            if (player.browserName === "IE" && (player.browserMajorVersion === 8 || player.browserMajorVersion === 9) ) {
                _log("Browser not suppported.", true);
                return false;
            }

            // Setup media
            _setupMedia();

            // Generate random number for id/for attribute values for controls
            player.random = Math.floor(Math.random() * (10000));

            // Inject custom controls
            _injectControls();

            // Find the elements
            if(!_findElements()) {
                return false;
            }

            // Set up aria-label for Play button with the title option
            _setupAria();

            // Captions
            _setupCaptions();

            // Set volume
            _setVolume();

            // Setup fullscreen
            _setupFullscreen();

            // Seeking
            _setupSeeking();

            // Listeners
            _listeners();
        }

        _init();

        return {
            media:              player.media,
            play:               _play,
            pause:              _pause,
            restart:            _restart,
            rewind:             _rewind,
            forward:            _forward,
            setVolume:          _setVolume,
            toggleMute:         _toggleMute,
            toggleCaptions:     _toggleCaptions
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