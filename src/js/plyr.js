// ==========================================================================
// Plyr
// plyr.js v1.1.13
// https://github.com/selz/plyr
// License: The MIT License (MIT)
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
        tooltips:               false,
        displayDuration:        true,
        selectors: {
            container:          ".player",
            controls:           ".player-controls",
            labels:             "[data-player] .sr-only, label .sr-only",
            buttons: {
                seek:           "[data-player='seek']",
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
            currentTime:        ".player-current-time",
            duration:           ".player-duration"
        },
        classes: {
            video:              "player-video",
            videoWrapper:       "player-video-wrapper",
            audio:              "player-audio",
            stopped:            "stopped",
            playing:            "playing",
            muted:              "muted",
            loading:            "loading",
            tooltip:            "player-tooltip",
            hidden:             "sr-only",
            hover:              "hover",
            captions: {
                enabled:        "captions-enabled",
                active:         "captions-active"
            },
            fullscreen: {
                enabled:        "fullscreen-enabled",
                active:         "fullscreen-active",
                hideControls:   "fullscreen-hide-controls"
            }
        },
        captions: {
            defaultActive:      false
        },
        fullscreen: {
            enabled:            true,
            fallback:           true,
            hideControls:       true
        },
        storage: {
            enabled:            true,
            key:                "plyr_volume"
        },
        controls:               ["restart", "rewind", "play", "fast-forward", "current-time", "duration", "mute", "volume", "captions", "fullscreen"],
        onSetup:                function() {}, 
    };

    // Build the default HTML
    function _buildControls() {
        // Open and add the progress and seek elements
        var html = [
        "<div class='player-controls'>",
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
            "<span class='player-controls-left'>"];

        // Restart button
        if(_inArray(config.controls, "restart")) {
            html.push(
                "<button type='button' data-player='restart'>",
                    "<svg><use xlink:href='#icon-restart'></use></svg>",
                    "<span class='sr-only'>Restart</span>",
                "</button>"
            );
        }

        // Rewind button
        if(_inArray(config.controls, "rewind")) {
            html.push(
                "<button type='button' data-player='rewind'>",
                    "<svg><use xlink:href='#icon-rewind'></use></svg>",
                    "<span class='sr-only'>Rewind {seektime} secs</span>",
                "</button>"
            );
        }

        // Play/pause button
        if(_inArray(config.controls, "play")) {
            html.push(
                "<button type='button' data-player='play'>",
                    "<svg><use xlink:href='#icon-play'></use></svg>",
                    "<span class='sr-only'>Play</span>",
                "</button>",
                "<button type='button' data-player='pause'>",
                    "<svg><use xlink:href='#icon-pause'></use></svg>",
                    "<span class='sr-only'>Pause</span>",
                "</button>"
            );
        }

        // Fast forward button
        if(_inArray(config.controls, "fast-forward")) {
            html.push(
                "<button type='button' data-player='fast-forward'>",
                    "<svg><use xlink:href='#icon-fast-forward'></use></svg>",
                    "<span class='sr-only'>Forward {seektime} secs</span>",
                "</button>"
            );
        }

        // Media current time display
        if(_inArray(config.controls, "current-time")) {
            html.push(
                "<span class='player-time'>",
                    "<span class='sr-only'>Current time</span>",
                    "<span class='player-current-time'>00:00</span>",
                "</span>"
            );
        }

        // Media duration display
        if(_inArray(config.controls, "duration")) {
            html.push(
                "<span class='player-time'>",
                    "<span class='sr-only'>Duration</span>",
                    "<span class='player-duration'>00:00</span>",
                "</span>"
            );
        }

        // Close left controls
        html.push(
            "</span>",
            "<span class='player-controls-right'>"
        );

        // Toggle mute button
        if(_inArray(config.controls, "mute")) {
            html.push(
                "<input class='inverted sr-only' id='mute{id}' type='checkbox' data-player='mute'>",
                "<label id='mute{id}' for='mute{id}'>",
                    "<svg class='icon-muted'><use xlink:href='#icon-muted'></use></svg>",
                    "<svg><use xlink:href='#icon-volume'></use></svg>",
                    "<span class='sr-only'>Toggle Mute</span>",
                "</label>"
            );
        }

        // Volume range control
        if(_inArray(config.controls, "volume")) {
            html.push(
                "<label for='volume{id}' class='sr-only'>Volume</label>",
                "<input id='volume{id}' class='player-volume' type='range' min='0' max='10' value='5' data-player='volume'>"
            );
        }

        // Toggle captions button
        if(_inArray(config.controls, "captions")) {
            html.push(
                "<input class='sr-only' id='captions{id}' type='checkbox' data-player='captions'>",
                "<label for='captions{id}'>",
                    "<svg class='icon-captions-on'><use xlink:href='#icon-captions-on'></use></svg>",
                    "<svg><use xlink:href='#icon-captions-off'></use></svg>",
                    "<span class='sr-only'>Toggle Captions</span>",
                "</label>"
            );
        }

        // Toggle fullscreen button
        if(_inArray(config.controls, "fullscreen")) {
            html.push(
                "<button type='button' data-player='fullscreen'>",
                    "<svg class='icon-exit-fullscreen'><use xlink:href='#icon-exit-fullscreen'></use></svg>",
                    "<svg><use xlink:href='#icon-enter-fullscreen'></use></svg>",
                    "<span class='sr-only'>Toggle Fullscreen</span>",
                "</button>"
            );
        }

        // Close everything
        html.push(
            "</span>",
        "</div>"
        );

        return html.join("");
    }

    // Debugging
    function _log(text, error) {
        if(config.debug && window.console) {
            console[(error ? "error" : "log")](text);
        }
    }

    // Credits: http://paypal.github.io/accessible-html5-video-player/
    // Unfortunately, due to mixed support, UA sniffing is required
    function _browserSniff() {
        var nAgt = navigator.userAgent,
            name = navigator.appName,
            fullVersion = "" + parseFloat(navigator.appVersion),
            majorVersion = parseInt(navigator.appVersion, 10),
            nameOffset,
            verOffset,
            ix;

        // MSIE 11
        if ((navigator.appVersion.indexOf("Windows NT") !== -1) && (navigator.appVersion.indexOf("rv:11") !== -1)) {
            name = "IE";
            fullVersion = "11;";
        }
        // MSIE
        else if ((verOffset=nAgt.indexOf("MSIE")) !== -1) {
            name = "IE";
            fullVersion = nAgt.substring(verOffset + 5);
        }
        // Chrome
        else if ((verOffset=nAgt.indexOf("Chrome")) !== -1) {
            name = "Chrome";
            fullVersion = nAgt.substring(verOffset + 7);
        }
        // Safari
        else if ((verOffset=nAgt.indexOf("Safari")) !== -1) {
            name = "Safari";
            fullVersion = nAgt.substring(verOffset + 7);
            if ((verOffset=nAgt.indexOf("Version")) !== -1) {
                fullVersion = nAgt.substring(verOffset + 8);
            }
        }
        // Firefox
        else if ((verOffset=nAgt.indexOf("Firefox")) !== -1) {
            name = "Firefox";
            fullVersion = nAgt.substring(verOffset + 8);
        }
        // In most other browsers, "name/version" is at the end of userAgent 
        else if ((nameOffset=nAgt.lastIndexOf(" ") + 1) < (verOffset=nAgt.lastIndexOf("/"))) {
            name = nAgt.substring(nameOffset,verOffset);
            fullVersion = nAgt.substring(verOffset + 1);

            if (name.toLowerCase() == name.toUpperCase()) {
                name = navigator.appName;
            }
        }
        // Trim the fullVersion string at semicolon/space if present
        if ((ix = fullVersion.indexOf(";")) !== -1) {
            fullVersion = fullVersion.substring(0, ix);
        }
        if ((ix = fullVersion.indexOf(" ")) !== -1) {
            fullVersion = fullVersion.substring(0, ix);
        }
        // Get major version
        majorVersion = parseInt("" + fullVersion, 10);
        if (isNaN(majorVersion)) {
            fullVersion = "" + parseFloat(navigator.appVersion); 
            majorVersion = parseInt(navigator.appVersion, 10);
        }

        // Return data
        return {
            name:       name, 
            version:    majorVersion, 
            ios:        /(iPad|iPhone|iPod)/g.test(navigator.platform)
        };
    }

    // Check for mime type support against a player instance
    // Credits: http://diveintohtml5.info/everything.html 
    // Related: http://www.leanbackplayer.com/test/h5mt.html
    function _supportMime(player, mimeType) {    
        var media = player.media;

        // Only check video types for video players
        if(player.type == "video") {
            // Check type
            switch(mimeType) {
                case "video/webm":   return !!(media.canPlayType && media.canPlayType("video/webm; codecs=\"vp8, vorbis\"").replace(/no/, ""));
                case "video/mp4":    return !!(media.canPlayType && media.canPlayType("video/mp4; codecs=\"avc1.42E01E, mp4a.40.2\"").replace(/no/, ""));
                case "video/ogg":    return !!(media.canPlayType && media.canPlayType("video/ogg; codecs=\"theora\"").replace(/no/, ""));
            }
        }

        // Only check audio types for audio players
        else if(player.type == "audio") {
            // Check type
            switch(mimeType) {
                case "audio/mpeg":   return !!(media.canPlayType && media.canPlayType("audio/mpeg;").replace(/no/, ""));
                case "audio/ogg":    return !!(media.canPlayType && media.canPlayType("audio/ogg; codecs=\"vorbis\"").replace(/no/, ""));
                case "audio/wav":    return !!(media.canPlayType && media.canPlayType("audio/wav; codecs=\"1\"").replace(/no/, ""));
            }
        }        

        // If we got this far, we're stuffed
        return false;
    }

    // Element exists in an array
    function _inArray(haystack, needle) {
        return Array.prototype.indexOf && (haystack.indexOf(needle) != -1);
    }
    
    // Replace all
    function _replaceAll(string, find, replace) {
        return string.replace(new RegExp(find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), "g"), replace);
    }

    // Wrap an element
    function _wrap(elements, wrapper) {
        // Convert `elements` to an array, if necessary.
        if (!elements.length) {
            elements = [elements];
        } 
        
        // Loops backwards to prevent having to clone the wrapper on the
        // first element (see `child` below).
        for (var i = elements.length - 1; i >= 0; i--) {
            var child   = (i > 0) ? wrapper.cloneNode(true) : wrapper;
            var element = elements[i];
            
            // Cache the current parent and sibling.
            var parent  = element.parentNode;
            var sibling = element.nextSibling;
            
            // Wrap the element (is automatically removed from its current
            // parent).
            child.appendChild(element);
            
            // If the element had a sibling, insert the wrapper before
            // the sibling to maintain the HTML structure; otherwise, just
            // append it to the parent.
            if (sibling) {
                parent.insertBefore(child, sibling);
            } 
            else {
                parent.appendChild(child);
            }
        }
    }

    // Unwrap an element
    // http://plainjs.com/javascript/manipulation/unwrap-a-dom-element-35/
    function _unwrap(wrapper) {
        // Get the element's parent node
        var parent = wrapper.parentNode;

        // Move all children out of the element
        while (wrapper.firstChild) {
            parent.insertBefore(wrapper.firstChild, wrapper);
        }

        // Remove the empty element
        parent.removeChild(wrapper);
    }

    // Remove an element
    function _remove(element) {
        element.parentNode.removeChild(element);
    }

    // Prepend child
    function _prependChild(parent, element) {
        parent.insertBefore(element, parent.firstChild);
    }

    // Set attributes
    function _setAttributes(element, attributes) {
        for(var key in attributes) {
            element.setAttribute(key, attributes[key]);
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
        var eventList = events.split(" ");

        // If a nodelist is passed, call itself on each node
        if(element instanceof NodeList) {
            for (var x = 0; x < element.length; x++) {
                if (element[x] instanceof Node) {
                    _toggleHandler(element[x], arguments[1], arguments[2], arguments[3]);
                }
            }
            return;
        }

        // If a single node is passed, bind the event listener
        for (var i = 0; i < eventList.length; i++) {
            element[toggle ? "addEventListener" : "removeEventListener"](eventList[i], callback, false);
        }
    }

    // Bind event
    function _on(element, events, callback) {
        if(element) {
            _toggleHandler(element, events, callback, true);
        }
    }

    // Unbind event
    function _off(element, events, callback) {
        if(element) {
            _toggleHandler(element, events, callback, false);
        }
    }

    // Trigger event
    function _triggerEvent(element, event) {
        // Create faux event
        var fauxEvent = document.createEvent("MouseEvents");

        // Set the event type
        fauxEvent.initEvent(event, true, true);

        // Dispatch the event
        element.dispatchEvent(fauxEvent);
    }

    // Toggle checkbox
    function _toggleCheckbox(event) {
        // Only listen for return key
        if(event.keyCode && event.keyCode != 13) {
            return true;
        }

        // Toggle the checkbox
        event.target.checked = !event.target.checked;

        // Trigger change event
        _triggerEvent(event.target, "change");
    }

    // Get percentage
    function _getPercentage(current, max) {
        if(current === 0 || max === 0 || isNaN(current) || isNaN(max)) {
            return 0;
        }
        return ((current / max) * 100).toFixed(2);
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

        // Safari doesn't support the ALLOW_KEYBOARD_INPUT flag (for security) so set it to not supported
        // https://bugs.webkit.org/show_bug.cgi?id=121496
        if(fullscreen.prefix === "webkit" && !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)) {
             fullscreen.supportsFullScreen = false;
        }

        // Update methods to do something useful
        if (fullscreen.supportsFullScreen) {
            // Yet again Microsoft awesomeness, 
            // Sometimes the prefix is "ms", sometimes "MS" to keep you on your toes
            fullscreen.fullScreenEventName = (fullscreen.prefix == "ms" ? "MSFullscreenChange" : fullscreen.prefix + "fullscreenchange");

            fullscreen.isFullScreen = function(element) {
                if(typeof element == "undefined") {
                    element = document;
                }

                switch (this.prefix) {
                    case "":
                        return document.fullscreenElement == element;
                    case "moz":
                        return document.mozFullScreenElement == element;
                    default:
                        return document[this.prefix + "FullscreenElement"] == element;
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
        // Seek the manual caption time and update UI
        function _seekManualCaptions(time) {
            // If it's not video, or we're using textTracks, bail.
            if (player.usingTextTracks || player.type !== "video" || !player.supported.full) {
                return;
            }

            // Reset subcount
            player.subcount = 0;

            // Check time is a number, if not use currentTime
            // IE has a bug where currentTime doesn't go to 0
            // https://twitter.com/Sam_Potts/status/573715746506731521
            time = typeof time === "number" ? time : player.media.currentTime;

            while (_timecodeMax(player.captions[player.subcount][0]) < time.toFixed(1)) {
                player.subcount++;
                if (player.subcount > player.captions.length-1) {
                    player.subcount = player.captions.length-1;
                    break;
                }
            }

            // Check if the next caption is in the current time range
            if (player.media.currentTime.toFixed(1) >= _timecodeMin(player.captions[player.subcount][0]) && 
                player.media.currentTime.toFixed(1) <= _timecodeMax(player.captions[player.subcount][0])) {
                    player.currentCaption = player.captions[player.subcount][1];

                // Render the caption
                player.captionsContainer.innerHTML = player.currentCaption;
            }
            else {
                // Clear the caption
                player.captionsContainer.innerHTML = "";
            }
        }

        // Display captions container and button (for initialization)
        function _showCaptions() {
            // If there's no caption toggle, bail
            if(!player.buttons.captions) {
                return;
            }

            _toggleClass(player.container, config.classes.captions.enabled, true);

            if (config.captions.defaultActive) {
                _toggleClass(player.container, config.classes.captions.active, true);
                player.buttons.captions.checked = true;
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
            // Make a copy of the html
            var html = config.html;

            // Insert custom video controls
            _log("Injecting custom controls.");

            // If no controls are specified, create default
            if(!html) {
                html = _buildControls();
            }

            // Replace seek time instances
            html = _replaceAll(html, "{seektime}", config.seekTime);

            // Replace all id references with random numbers
            html = _replaceAll(html, "{id}", Math.floor(Math.random() * (10000)));

            // Inject into the container
            player.container.insertAdjacentHTML("beforeend", html);

            // Setup tooltips
            if(config.tooltips) {
                var labels = _getElements(config.selectors.labels);

                for (var i = labels.length - 1; i >= 0; i--) {
                    var label = labels[i];

                    _toggleClass(label, config.classes.hidden, false);
                    _toggleClass(label, config.classes.tooltip, true);
                }
            }
        }

        // Find the UI controls and store references
        function _findElements() {
            try {
                player.controls                 = _getElement(config.selectors.controls);

                // Buttons
                player.buttons = {};
                player.buttons.seek             = _getElement(config.selectors.buttons.seek);
                player.buttons.play             = _getElement(config.selectors.buttons.play);
                player.buttons.pause            = _getElement(config.selectors.buttons.pause);
                player.buttons.restart          = _getElement(config.selectors.buttons.restart);
                player.buttons.rewind           = _getElement(config.selectors.buttons.rewind);
                player.buttons.forward          = _getElement(config.selectors.buttons.forward);
                player.buttons.fullscreen       = _getElement(config.selectors.buttons.fullscreen);

                // Inputs
                player.buttons.mute             = _getElement(config.selectors.buttons.mute);
                player.buttons.captions         = _getElement(config.selectors.buttons.captions);
                player.checkboxes               = _getElements("[type='checkbox']");

                // Progress
                player.progress = {};
                player.progress.container       = _getElement(config.selectors.progress.container);

                // Progress - Buffering
                player.progress.buffer          = {};
                player.progress.buffer.bar      = _getElement(config.selectors.progress.buffer);
                player.progress.buffer.text     = player.progress.buffer.bar && player.progress.buffer.bar.getElementsByTagName("span")[0];

                // Progress - Played
                player.progress.played          = {};
                player.progress.played.bar      = _getElement(config.selectors.progress.played);
                player.progress.played.text     = player.progress.played.bar && player.progress.played.bar.getElementsByTagName("span")[0];

                // Volume
                player.volume                   = _getElement(config.selectors.buttons.volume);

                // Timing
                player.duration                 = _getElement(config.selectors.duration);
                player.currentTime              = _getElement(config.selectors.currentTime);
                player.seekTime                 = _getElements(config.selectors.seekTime);

                return true;
            }
            catch(e) {
                _log("It looks like there's a problem with your controls html. Bailing.", true);

                // Restore native video controls
                player.media.setAttribute("controls", "");

                return false;
            }
        }

        // Setup aria attributes
        function _setupAria() {
            // If there's no play button, bail
            if(!player.buttons.play) {
                return;
            }

            // Find the current text
            var label = player.buttons.play.innerText || "Play";

            // If there's a media title set, use that for the label
            if (typeof(config.title) !== "undefined" && config.title.length) {
                label += ", " + config.title;
            }

            player.buttons.play.setAttribute("aria-label", label);
        }

        // Setup media
        function _setupMedia() {
            // If there's no media, bail
            if(!player.media) {
                _log("No audio or video element found!", true);
                return false;
            }

            if(player.supported.full) {
                // Remove native video controls
                player.media.removeAttribute("controls");
        
                // Add type class
                _toggleClass(player.container, config.classes[player.type], true);

                // If there's no autoplay attribute, assume the video is stopped and add state class
                _toggleClass(player.container, config.classes.stopped, (player.media.getAttribute("autoplay") === null));
            
                // Add iOS class
                if(player.browser.ios) {
                    _toggleClass(player.container, "ios", true);
                }

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

            // Autoplay
            if(player.media.getAttribute("autoplay") !== null) {
                _play();
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
                player.usingTextTracks = false;
                if (player.media.textTracks) {
                    player.usingTextTracks = true;
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

                    // Disable unsupported browsers than report false positive
                    if ((player.browser.name === "IE" && player.browser.version >= 10) || 
                        (player.browser.name === "Firefox" && player.browser.version >= 31) || 
                        (player.browser.name === "Chrome" && player.browser.version >= 43) || 
                        (player.browser.name === "Safari" && player.browser.version >= 7)) {
                        // Debugging
                        _log("Detected unsupported browser for HTML5 captions. Using fallback.");

                        // Set to false so skips to "manual" captioning
                        player.usingTextTracks = false;
                    }

                    // Rendering caption tracks
                    // Native support required - http://caniuse.com/webvtt
                    if (player.usingTextTracks) {
                        _log("TextTracks supported.");
            
                        for (var y=0; y < tracks.length; y++) {
                            var track = tracks[y];

                            if (track.kind === "captions") {
                                _on(track, "cuechange", function() {
                                    // Clear container
                                    player.captionsContainer.innerHTML = "";

                                    // Display a cue, if there is one
                                    if (this.activeCues[0] && this.activeCues[0].hasOwnProperty("text")) {
                                        player.captionsContainer.appendChild(this.activeCues[0].getCueAsHTML());
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
                        player.captions = [];

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
                    if (player.browser.name === "Safari" && player.browser.version >= 7) {
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

                // Set control hide class hook
                if(config.fullscreen.hideControls) {
                    _toggleClass(player.container, config.classes.fullscreen.hideControls, true);
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

        // Toggle playback
        function _togglePlay(toggle) {
            // Play
            if(toggle === true) {
                _play();
            }
            // Pause
            else if(toggle === false) {
                _pause();
            }
            // True toggle
            else {
                player.media[player.media.paused ? "play" : "pause"]();
            }
        }

        // Rewind
        function _rewind(seekTime) {
            // Use default if needed
            if(typeof seekTime !== "number") {
                seekTime = config.seekTime;
            }
            _seek(player.media.currentTime - seekTime);
        }

        // Fast forward
        function _forward(seekTime) {
            // Use default if needed
            if(typeof seekTime !== "number") {
                seekTime = config.seekTime;
            }
            _seek(player.media.currentTime + seekTime);
        }

        // Seek to time
        // The input parameter can be an event or a number
        function _seek(input) {
            var targetTime = 0;

            // Explicit position
            if (typeof input === "number") {
                targetTime = input;
            }
            // Event
            else if (typeof input === "object" && (input.type === "input" || input.type === "change")) {
                // It's the seek slider
                // Seek to the selected time
                targetTime = ((input.target.value / input.target.max) * player.media.duration);
            }

            // Normalise targetTime
            if (targetTime < 0) {
                targetTime = 0;
            }
            else if (targetTime > player.media.duration) {
                targetTime = player.media.duration;
            }

            // Set the current time
            // Try/catch incase the media isn't set and we're calling seek() from source() and IE moans
            try {
                player.media.currentTime = targetTime.toFixed(1);
            }
            catch(e) {}

            // Logging
            _log("Seeking to " + player.media.currentTime + " seconds");

            // Special handling for "manual" captions
            _seekManualCaptions(targetTime);
        }

        // Check playing state
        function _checkPlaying() {
            _toggleClass(player.container, config.classes.playing, !player.media.paused);
            _toggleClass(player.container, config.classes.stopped, player.media.paused);
        }

        // Toggle fullscreen
        function _toggleFullscreen(event) {
            // Check for native support
            var nativeSupport = fullscreen.supportsFullScreen;

            // If it's a fullscreen change event, it's probably a native close
            if(event && event.type === fullscreen.fullScreenEventName) {
                player.isFullscreen = fullscreen.isFullScreen(player.container);
            }
            // If there's native support, use it
            else if(nativeSupport) {
                // Request fullscreen
                if(!fullscreen.isFullScreen(player.container)) {
                    fullscreen.requestFullScreen(player.container);
                }
                // Bail from fullscreen
                else {
                    fullscreen.cancelFullScreen();
                }

                // Check if we're actually full screen (it could fail)
                player.isFullscreen = fullscreen.isFullScreen(player.container);
            }
            else {
                // Otherwise, it's a simple toggle
                player.isFullscreen = !player.isFullscreen;

                // Bind/unbind escape key
                if(player.isFullscreen) {
                    _on(document, "keyup", _handleEscapeFullscreen);
                    document.body.style.overflow = "hidden";
                }
                else {
                    _off(document, "keyup", _handleEscapeFullscreen);
                    document.body.style.overflow = "";
                }
            }

            // Set class hook
            _toggleClass(player.container, config.classes.fullscreen.active, player.isFullscreen);
            
            // Toggle controls visibility based on mouse movement and location
            var hoverTimer, isMouseOver = false;

            // Show the player controls
            function _showControls() {
                // Set shown class
                _toggleClass(player.controls, config.classes.hover, true);

                // Clear timer every movement
                window.clearTimeout(hoverTimer);

                // If the mouse is not over the controls, set a timeout to hide them
                if(!isMouseOver) {
                    hoverTimer = window.setTimeout(function() {
                        _toggleClass(player.controls, config.classes.hover, false);
                    }, 2000);
                }
            }

            // Check mouse is over the controls
            function _setMouseOver (event) {
                isMouseOver = (event.type === "mouseenter");
            }

            if(config.fullscreen.hideControls) {           
                // Hide on entering full screen
                _toggleClass(player.controls, config.classes.hover, false);

                // Keep an eye on the mouse location in relation to controls
                _toggleHandler(player.controls, "mouseenter mouseleave", _setMouseOver, player.isFullscreen);

                // Show the controls on mouse move
                _toggleHandler(player.container, "mousemove", _showControls, player.isFullscreen);
            }
        }

        // Bail from faux-fullscreen 
        function _handleEscapeFullscreen(event) {
            // If it's a keypress and not escape, bail
            if((event.which || event.charCode || event.keyCode) === 27 && player.isFullscreen) {
                _toggleFullscreen();                
            }
        }

        // Set volume
        function _setVolume(volume) {
            // Use default if no value specified
            if(typeof volume === "undefined") {
                if(config.storage.enabled && _storage().supported) {
                    volume = window.localStorage[config.storage.key] || config.volume;
                }
                else {
                    volume = config.volume;
                }                
            }

            // Maximum is 10
            if(volume > 10) {
                volume = 10;
            }
            // Minimum is 0
            if(volume < 0) {
                volume = 0;
            }

            // Set the player volume
            player.media.volume = parseFloat(volume / 10);

            // Toggle muted state
            if(player.media.muted && volume > 0) {
                _toggleMute();
            } 
        }

        // Mute
        function _toggleMute(muted) {
            // If the method is called without parameter, toggle based on current value
            if(typeof muted === "undefined") {
                muted = !player.media.muted;
            }

            // Set mute on the player
            player.media.muted = muted;
        }

        // Update volume UI and storage
        function _updateVolume() {
            // Get the current volume
            var volume = player.media.muted ? 0 : (player.media.volume * 10);

            // Update the <input type="range"> if present
            if(player.supported.full && player.volume) {
                player.volume.value = volume;
            }

            // Store the volume in storage
            if(config.storage.enabled && _storage().supported) {
                window.localStorage.setItem(config.storage.key, volume);
            }

            // Toggle class if muted
            _toggleClass(player.container, config.classes.muted, (volume === 0));
            
            // Update checkbox for mute state
            if(player.supported.full && player.buttons.mute) {
                player.buttons.mute.checked = (volume === 0);
            }
        }

        // Toggle captions
        function _toggleCaptions(show) { 
            // If there's no full support, or there's no caption toggle
            if(!player.supported.full || !player.buttons.captions) {
                return;
            }

            // If the method is called without parameter, toggle based on current value
            if(typeof show === "undefined") {
                show = (player.container.className.indexOf(config.classes.captions.active) === -1);
                player.buttons.captions.checked = show;
            }

            _toggleClass(player.container, config.classes.captions.active, show);
        }

        // Check if media is loading
        function _checkLoading(event) {
            var loading = (event.type === "waiting");

            // Clear timer
            clearTimeout(player.loadingTimer);

            // Timer to prevent flicker when seeking
            player.loadingTimer = setTimeout(function() {
                _toggleClass(player.container, config.classes.loading, loading);
            }, (loading ? 250 : 0));
        }

        // Update <progress> elements
        function _updateProgress(event) {
            var progress    = player.progress.played.bar, 
                text        = player.progress.played.text, 
                value       = 0;

            if(event) {
                switch(event.type) {
                    // Video playing
                    case "timeupdate":
                    case "seeking":
                        value = _getPercentage(player.media.currentTime, player.media.duration);

                        // Set seek range value only if it's a "natural" time event
                        if(event.type == "timeupdate" && player.buttons.seek) {
                            player.buttons.seek.value = value;
                        }
            
                        break;

                    // Events from seek range
                    case "change":
                    case "input":
                        value = event.target.value;
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
            }

            // Set values
            if(progress) {
                progress.value = value;
            }
            if(text) {
                text.innerHTML = value;
            }
        }

        // Update the displayed time
        function _updateTimeDisplay(time, element) {
            // Bail if there's no duration display
            if(!element) {
                return;
            }

            player.secs = parseInt(time % 60);
            player.mins = parseInt((time / 60) % 60);
            player.hours = parseInt(((time / 60) / 60) % 60);

            // Do we need to display hours?
            var displayHours = (parseInt(((player.media.duration / 60) / 60) % 60) > 0)
            
            // Ensure it"s two digits. For example, 03 rather than 3.
            player.secs = ("0" + player.secs).slice(-2);
            player.mins = ("0" + player.mins).slice(-2);

            // Render
            element.innerHTML = (displayHours ? player.hours + ":" : "") + player.mins + ":" + player.secs;
        }

        // Show the duration on metadataloaded
        function _displayDuration() {
            var duration = player.media.duration || 0;

            // If there's only one time display, display duration there
            if(!player.duration && config.displayDuration && player.media.paused) {
                _updateTimeDisplay(duration, player.currentTime);
            }

            // If there's a duration element, update content
            if(player.duration) {
                _updateTimeDisplay(duration, player.duration);
            }
        }

        // Handle time change event
        function _timeUpdate(event) {
            // Duration
            _updateTimeDisplay(player.media.currentTime, player.currentTime);

            // Playing progress
            _updateProgress(event);
        }

        // Remove <source> children and src attribute
        function _removeSources() {
            // Find child <source> elements
            var sources = player.media.querySelectorAll("source");

            // Remove each
            for (var i = sources.length - 1; i >= 0; i--) {
                _remove(sources[i]);
            }

            // Remove src attribute
            player.media.removeAttribute("src");
        }

        // Inject a source
        function _addSource(attributes) {
            if(attributes.src) {
                // Create a new <source>
                var element = document.createElement("source");

                // Set all passed attributes
                _setAttributes(element, attributes);

                // Inject the new source
                _prependChild(player.media, element);
            }
        }

        // Update source
        // Sources are not checked for support so be careful
        function _parseSource(sources) {
            // Pause playback (webkit freaks out)
            _pause();

            // Restart
            _seek();

            // Remove current sources
            _removeSources();

            // If a single source is passed
            // .source("path/to/video.mp4")
            if(typeof sources === "string") {
                player.media.setAttribute("src", sources);
            }

            // An array of source objects
            // Check if a source exists, use that or set the "src" attribute?
            // .source([{ src: "path/to/video.mp4", type: "video/mp4" },{ src: "path/to/video.webm", type: "video/webm" }])
            else if (sources.constructor === Array) {
                for (var index in sources) { 
                    _addSource(sources[index]);
                }
            }

            if(player.supported.full) {
                // Reset time display
                _timeUpdate();

                // Update the UI
                _checkPlaying();
            }

            // Re-load sources
            player.media.load();

            // Play if autoplay attribute is present
            if(player.media.getAttribute("autoplay") !== null) {
                _play();
            }
        }

        // Update poster
        function _updatePoster(source) {
            if(player.type === "video") {
                player.media.setAttribute("poster", source);
            }
        }

        // Listen for events
        function _listeners() {
            // IE doesn't support input event, so we fallback to change
            var inputEvent = (player.browser.name == "IE" ? "change" : "input");

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
            _on(player.buttons.restart, "click", _seek);

            // Rewind
            _on(player.buttons.rewind, "click", _rewind);

            // Fast forward
            _on(player.buttons.forward, "click", _forward);

            // Seek 
            _on(player.buttons.seek, inputEvent, _seek);

            // Set volume
            _on(player.volume, inputEvent, function() {
                _setVolume(this.value);
            });

            // Mute
            _on(player.buttons.mute, "change", function() {
                _toggleMute(this.checked);
            });

            // Fullscreen
            _on(player.buttons.fullscreen, "click", _toggleFullscreen);

            // Handle user exiting fullscreen by escaping etc
            if(fullscreen.supportsFullScreen) {
                _on(document, fullscreen.fullScreenEventName, _toggleFullscreen);
            }
            
            // Time change on media
            _on(player.media, "timeupdate seeking", _timeUpdate);

            // Update manual captions
            _on(player.media, "timeupdate", _seekManualCaptions);

            // Display duration
            _on(player.media, "loadedmetadata", _displayDuration);

            // Captions
            _on(player.buttons.captions, "change", function() { 
                _toggleCaptions(this.checked);
            });

            // Handle the media finishing
            _on(player.media, "ended", function() {
                // Clear 
                if(player.type === "video") {
                    player.captionsContainer.innerHTML = "";
                }

                // Reset UI
                _checkPlaying();
            });

            // Check for buffer progress
            _on(player.media, "progress", _updateProgress);

            // Also check on start of playing
            _on(player.media, "playing", _updateProgress);

            // Handle native mute
            _on(player.media, "volumechange", _updateVolume);

            // Handle native play/pause
            _on(player.media, "play pause", _checkPlaying);

            // Loading
            _on(player.media, "waiting canplay seeked", _checkLoading);

            // Toggle checkboxes on return key (as they look like buttons)
            _on(player.checkboxes, "keyup", _toggleCheckbox);

            // Click video
            if(player.type === "video" && config.click) {
                _on(player.videoContainer, "click", function() {
                    if(player.media.paused) {
                        _triggerEvent(player.buttons.play, "click");
                    }
                    else if(player.media.ended) {
                        _seek();
                        _triggerEvent(player.buttons.play, "click");
                    }
                    else {
                        _triggerEvent(player.buttons.pause, "click");
                    }
                });
            }
        }

        // Destroy an instance
        function _destroy() {
            // Bail if the element is not initialized
            if(!player.init) {
                return null;
            }

            // Reset container classname
            player.container.setAttribute("class", config.selectors.container.replace(".", ""));

            // Event listeners are removed when elements are removed
            // http://stackoverflow.com/questions/12528049/if-a-dom-element-is-removed-are-its-listeners-also-removed-from-memory

            // Remove controls
            _remove(_getElement(config.selectors.controls));

            // If video, we need to remove some more
            if(player.type === "video") {
                // Remove captions
                _remove(_getElement(config.selectors.captions));

                // Remove video wrapper
                _unwrap(player.videoContainer);
            }

            // Restore native video controls
            player.media.setAttribute("controls", "");

            // Clone the media element to remove listeners
            // http://stackoverflow.com/questions/19469881/javascript-remove-all-event-listeners-of-specific-type
            var clone = player.media.cloneNode(true);
            player.media.parentNode.replaceChild(clone, player.media);

            // Remove init flag
            player.init = false;
        }

        // Setup a player
        function _init() {
            // Bail if the element is initialized
            if(player.init) {
                return null;
            }

            // Setup the fullscreen api 
            fullscreen = _fullscreen();

            // Sniff out the browser
            player.browser = _browserSniff();

            // Get the media element
            player.media = player.container.querySelectorAll("audio, video")[0];

            // Set media type
            player.type = player.media.tagName.toLowerCase();

            // Check for full support
            player.supported = api.supported(player.type);

            // If no native support, bail
            if(!player.supported.basic) {
                return false;
            }

            // Debug info
            _log(player.browser.name + " " + player.browser.version);

            // Setup media
            _setupMedia();

            // If there's full support
            if(player.supported.full) {
                // Inject custom controls
                _injectControls();

                // Find the elements
                if(!_findElements()) {
                    return false;
                }

                // Display duration if available
                if(config.displayDuration) {
                    _displayDuration();
                }

                // Set up aria-label for Play button with the title option
                _setupAria();

                // Captions
                _setupCaptions();

                // Set volume
                _setVolume();
                _updateVolume();

                // Setup fullscreen
                _setupFullscreen();

                // Listeners
                _listeners();
            }

            // Successful setup
            player.init = true;
        }

        // Initialize instance 
        _init();

        // If init failed, return an empty object
        if(!player.init) {
            return {};
        }

        return {
            media:              player.media,
            play:               _play,
            pause:              _pause,
            restart:            _seek,
            rewind:             _rewind,
            forward:            _forward,
            seek:               _seek,
            source:             _parseSource,
            poster:             _updatePoster,
            setVolume:          _setVolume,
            togglePlay:         _togglePlay,
            toggleMute:         _toggleMute,
            toggleCaptions:     _toggleCaptions,
            toggleFullscreen:   _toggleFullscreen,
            isFullscreen:       function() { return player.isFullscreen || false; },
            support:            function(mimeType) { return _supportMime(player, mimeType); },
            destroy:            _destroy,
            restore:            _init
        }
    }

    // Check for support 
    api.supported = function(type) {
        var browser = _browserSniff(),
            oldIE   = (browser.name === "IE" && browser.version <= 9),
            iPhone  = /iPhone|iPod/i.test(navigator.userAgent),
            audio   = !!document.createElement("audio").canPlayType,
            video   = !!document.createElement("video").canPlayType,
            basic, full;

        switch (type) {
            case "video": 
                basic = video;
                full  = (basic && (!oldIE && !iPhone));
                break;

            case "audio": 
                basic = audio;
                full  = (basic && !oldIE);
                break; 

            default:
                basic = (audio && video);
                full  = (basic && !oldIE);
                break;                
        }

        return {
            basic:  basic,
            full:   full
        };
    }

    // Expose setup function
    api.setup = function(options){
        // Extend the default options with user specified
        config = _extend(defaults, options);

        // Bail if disabled or no basic support
        // You may want to disable certain UAs etc
        if(!config.enabled || !api.supported().basic) {
            return false;
        }

        // Get the players 
        var elements    = document.querySelectorAll(config.selectors.container), 
            players     = [];

        // Create a player instance for each element
        for (var i = elements.length - 1; i >= 0; i--) {
            // Get the current element
            var element = elements[i];

            // Setup a player instance and add to the element
            if(typeof element.plyr === "undefined") { 
                // Create new instance
                var instance = new Plyr(element);

                // Set plyr to false if setup failed
                element.plyr = (Object.keys(instance).length ? instance : false);

                // Callback
                config.onSetup.apply(element.plyr);
            }

            // Add to return array even if it's already setup
            players.push(element.plyr);
        }

        return players;
    }

}(this.plyr = this.plyr || {}));
