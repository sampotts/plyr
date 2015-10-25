// ==========================================================================
// Plyr
// plyr.js v1.4.0
// https://github.com/selz/plyr
// License: The MIT License (MIT)
// ==========================================================================
// Credits: http://paypal.github.io/accessible-html5-video-player/
// ==========================================================================

(function (api) {
    'use strict';
    /*global YT,$f*/

    // Globals
    var fullscreen, config;

    // Default config
    var defaults = {
        enabled:                true,
        debug:                  false,
        autoplay:               false,
        loop:                   false,
        seekTime:               10,
        volume:                 5,
        click:                  true,
        tooltips:               false,
        displayDuration:        true,
        iconPrefix:             'icon',
        selectors: {
            container:          '.plyr',
            controls:           '.plyr-controls',
            labels:             '[data-plyr] .sr-only, label .sr-only',
            buttons: {
                seek:           '[data-plyr="seek"]',
                play:           '[data-plyr="play"]',
                pause:          '[data-plyr="pause"]',
                restart:        '[data-plyr="restart"]',
                rewind:         '[data-plyr="rewind"]',
                forward:        '[data-plyr="fast-forward"]',
                mute:           '[data-plyr="mute"]',
                volume:         '[data-plyr="volume"]',
                captions:       '[data-plyr="captions"]',
                fullscreen:     '[data-plyr="fullscreen"]'
            },
            progress: {
                container:      '.plyr-progress',
                buffer:         '.plyr-progress-buffer',
                played:         '.plyr-progress-played'
            },
            captions:           '.plyr-captions',
            currentTime:        '.plyr-current-time',
            duration:           '.plyr-duration'
        },
        classes: {
            videoWrapper:       'plyr-video-wrapper',
            embedWrapper:       'plyr-video-embed',
            type:               'plyr-{0}',
            stopped:            'stopped',
            playing:            'playing',
            muted:              'muted',
            loading:            'loading',
            tooltip:            'plyr-tooltip',
            hidden:             'sr-only',
            hover:              'plyr-hover',
            captions: {
                enabled:        'captions-enabled',
                active:         'captions-active'
            },
            fullscreen: {
                enabled:        'fullscreen-enabled',
                active:         'fullscreen-active',
                hideControls:   'fullscreen-hide-controls'
            }
        },
        captions: {
            defaultActive:      false
        },
        fullscreen: {
            enabled:            true,
            fallback:           true,
            hideControls:       true,
            allowAudio:         false
        },
        storage: {
            enabled:            true,
            key:                'plyr_volume'
        },
        controls:               ['restart', 'rewind', 'play', 'fast-forward', 'current-time', 'duration', 'mute', 'volume', 'captions', 'fullscreen'],
        i18n: {
            restart:            'Restart',
            rewind:             'Rewind {seektime} secs',
            play:               'Play',
            pause:              'Pause',
            forward:            'Forward {seektime} secs',
            played:             'played',
            buffered:           'buffered',
            currentTime:        'Current time',
            duration:           'Duration',
            volume:             'Volume',
            toggleMute:         'Toggle Mute',
            toggleCaptions:     'Toggle Captions',
            toggleFullscreen:   'Toggle Fullscreen'
        },
        types: {
            embed:              ['youtube','vimeo'],
            html5:              ['video', 'audio'] 
        },
        urls: {
            vimeo: {
                api:            'https://f.vimeocdn.com/js/froogaloop2.min.js'
            },
            youtube: {
                api:            'https://www.youtube.com/iframe_api'
            }
        }
    };

    // Build the default HTML
    function _buildControls() {
        // Open and add the progress and seek elements
        var html = [
        '<div class="plyr-controls">',
            '<div class="plyr-progress">',
                '<label for="seek{id}" class="sr-only">Seek</label>',
                '<input id="seek{id}" class="plyr-progress-seek" type="range" min="0" max="100" step="0.5" value="0" data-plyr="seek">',
                '<progress class="plyr-progress-played" max="100" value="0">',
                    '<span>0</span>% ' + config.i18n.played,
                '</progress>',
                '<progress class="plyr-progress-buffer" max="100" value="0">',
                    '<span>0</span>% ' + config.i18n.buffered,
                '</progress>',
            '</div>',
            '<span class="plyr-controls-left">'];

        // Restart button
        if (_inArray(config.controls, 'restart')) {
            html.push(
                '<button type="button" data-plyr="restart">',
                    '<svg><use xlink:href="#' + config.iconPrefix + '-restart" /></svg>',
                    '<span class="sr-only">' + config.i18n.restart + '</span>',
                '</button>'
            );
        }

        // Rewind button
        if (_inArray(config.controls, 'rewind')) {
            html.push(
                '<button type="button" data-plyr="rewind">',
                    '<svg><use xlink:href="#' + config.iconPrefix + '-rewind" /></svg>',
                    '<span class="sr-only">' + config.i18n.rewind + '</span>',
                '</button>'
            );
        }

        // Play/pause button
        if (_inArray(config.controls, 'play')) {
            html.push(
                '<button type="button" data-plyr="play">',
                    '<svg><use xlink:href="#' + config.iconPrefix + '-play" /></svg>',
                    '<span class="sr-only">' + config.i18n.play + '</span>',
                '</button>',
                '<button type="button" data-plyr="pause">',
                    '<svg><use xlink:href="#' + config.iconPrefix + '-pause" /></svg>',
                    '<span class="sr-only">' + config.i18n.pause + '</span>',
                '</button>'
            );
        }

        // Fast forward button
        if (_inArray(config.controls, 'fast-forward')) {
            html.push(
                '<button type="button" data-plyr="fast-forward">',
                    '<svg><use xlink:href="#' + config.iconPrefix + '-fast-forward" /></svg>',
                    '<span class="sr-only">' + config.i18n.forward + '</span>',
                '</button>'
            );
        }

        // Media current time display
        if (_inArray(config.controls, 'current-time')) {
            html.push(
                '<span class="plyr-time">',
                    '<span class="sr-only">' + config.i18n.currentTime + '</span>',
                    '<span class="plyr-current-time">00:00</span>',
                '</span>'
            );
        }

        // Media duration display
        if (_inArray(config.controls, 'duration')) {
            html.push(
                '<span class="plyr-time">',
                    '<span class="sr-only">' + config.i18n.duration + '</span>',
                    '<span class="plyr-duration">00:00</span>',
                '</span>'
            );
        }

        // Close left controls
        html.push(
            '</span>',
            '<span class="plyr-controls-right">'
        );

        // Toggle mute button
        if (_inArray(config.controls, 'mute')) {
            html.push(
                '<button type="button" data-plyr="mute">',
                    '<svg class="icon-muted"><use xlink:href="#' + config.iconPrefix + '-muted" /></svg>',
                    '<svg><use xlink:href="#' + config.iconPrefix + '-volume" /></svg>',
                    '<span class="sr-only">' + config.i18n.toggleMute + '</span>',
                '</button>'
            );
        }

        // Volume range control
        if (_inArray(config.controls, 'volume')) {
            html.push(
                '<label for="volume{id}" class="sr-only">' + config.i18n.volume + '</label>',
                '<input id="volume{id}" class="plyr-volume" type="range" min="0" max="10" value="5" data-plyr="volume">'
            );
        }

        // Toggle captions button
        if (_inArray(config.controls, 'captions')) {
            html.push(
                '<button type="button" data-plyr="captions">',
                    '<svg class="icon-captions-on"><use xlink:href="#' + config.iconPrefix + '-captions-on" /></svg>',
                    '<svg><use xlink:href="#' + config.iconPrefix + '-captions-off" /></svg>',
                    '<span class="sr-only">' + config.i18n.toggleCaptions + '</span>',
                '</button>'
            );
        }

        // Toggle fullscreen button
        if (_inArray(config.controls, 'fullscreen')) {
            html.push(
                '<button type="button" data-plyr="fullscreen">',
                    '<svg class="icon-exit-fullscreen"><use xlink:href="#' + config.iconPrefix + '-exit-fullscreen" /></svg>',
                    '<svg><use xlink:href="#' + config.iconPrefix + '-enter-fullscreen" /></svg>',
                    '<span class="sr-only">' + config.i18n.toggleFullscreen + '</span>',
                '</button>'
            );
        }

        // Close everything
        html.push(
            '</span>',
        '</div>'
        );

        return html.join('');
    }

    // Debugging
    function _log(text, error) {
        if (config.debug && window.console) {
            console[(error ? 'error' : 'log')](text);
        }
    }

    // Credits: http://paypal.github.io/accessible-html5-video-player/
    // Unfortunately, due to mixed support, UA sniffing is required
    function _browserSniff() {
        var nAgt = navigator.userAgent,
            name = navigator.appName,
            fullVersion = '' + parseFloat(navigator.appVersion),
            majorVersion = parseInt(navigator.appVersion, 10),
            nameOffset,
            verOffset,
            ix;

        // MSIE 11
        if ((navigator.appVersion.indexOf('Windows NT') !== -1) && (navigator.appVersion.indexOf('rv:11') !== -1)) {
            name = 'IE';
            fullVersion = '11;';
        }
        // MSIE
        else if ((verOffset=nAgt.indexOf('MSIE')) !== -1) {
            name = 'IE';
            fullVersion = nAgt.substring(verOffset + 5);
        }
        // Chrome
        else if ((verOffset=nAgt.indexOf('Chrome')) !== -1) {
            name = 'Chrome';
            fullVersion = nAgt.substring(verOffset + 7);
        }
        // Safari
        else if ((verOffset=nAgt.indexOf('Safari')) !== -1) {
            name = 'Safari';
            fullVersion = nAgt.substring(verOffset + 7);
            if ((verOffset=nAgt.indexOf('Version')) !== -1) {
                fullVersion = nAgt.substring(verOffset + 8);
            }
        }
        // Firefox
        else if ((verOffset=nAgt.indexOf('Firefox')) !== -1) {
            name = 'Firefox';
            fullVersion = nAgt.substring(verOffset + 8);
        }
        // In most other browsers, 'name/version' is at the end of userAgent 
        else if ((nameOffset=nAgt.lastIndexOf(' ') + 1) < (verOffset=nAgt.lastIndexOf('/'))) {
            name = nAgt.substring(nameOffset,verOffset);
            fullVersion = nAgt.substring(verOffset + 1);

            if (name.toLowerCase() == name.toUpperCase()) {
                name = navigator.appName;
            }
        }
        // Trim the fullVersion string at semicolon/space if present
        if ((ix = fullVersion.indexOf(';')) !== -1) {
            fullVersion = fullVersion.substring(0, ix);
        }
        if ((ix = fullVersion.indexOf(' ')) !== -1) {
            fullVersion = fullVersion.substring(0, ix);
        }
        // Get major version
        majorVersion = parseInt('' + fullVersion, 10);
        if (isNaN(majorVersion)) {
            fullVersion = '' + parseFloat(navigator.appVersion);
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
    // Related: http://www.leanbackplyr.com/test/h5mt.html
    function _supportMime(plyr, mimeType) {
        var media = plyr.media;

        // Only check video types for video players
        if (plyr.type == 'video') {
            // Check type
            switch (mimeType) {
                case 'video/webm':   return !!(media.canPlayType && media.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/no/, ''));
                case 'video/mp4':    return !!(media.canPlayType && media.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/, ''));
                case 'video/ogg':    return !!(media.canPlayType && media.canPlayType('video/ogg; codecs="theora"').replace(/no/, ''));
            }
        }

        // Only check audio types for audio players
        else if (plyr.type == 'audio') {
            // Check type
            switch (mimeType) {
                case 'audio/mpeg':   return !!(media.canPlayType && media.canPlayType('audio/mpeg;').replace(/no/, ''));
                case 'audio/ogg':    return !!(media.canPlayType && media.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''));
                case 'audio/wav':    return !!(media.canPlayType && media.canPlayType('audio/wav; codecs="1"').replace(/no/, ''));
            }
        }        

        // If we got this far, we're stuffed
        return false;
    }

    // Inject a script
    function _injectScript(source) {
        if (document.querySelectorAll('script[src="' + source + '"]').length) {
            return;
        }

        var tag = document.createElement('script');
        tag.src = source;
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Element exists in an array
    function _inArray(haystack, needle) {
        return Array.prototype.indexOf && (haystack.indexOf(needle) != -1);
    }
    
    // Replace all
    function _replaceAll(string, find, replace) {
        return string.replace(new RegExp(find.replace(/([.*+?\^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g'), replace);
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
        for (var key in attributes) {
            element.setAttribute(key, (typeof attributes[key] === 'boolean' && attributes[key]) ? '' : attributes[key]);
        }
    }

    // Insert a HTML element
    function _insertElement(type, parent, attributes) {
        // Create a new <element>
        var element = document.createElement(type);

        // Set all passed attributes
        _setAttributes(element, attributes);

        // Inject the new element
        _prependChild(parent, element);
    }

    // Get a classname from selector
    function _getClassname(selector) {
        return selector.replace('.', '');
    }

    // Toggle class on an element
    function _toggleClass(element, name, state) {
        if (element) {
            if (element.classList) {
                element.classList[state ? 'add' : 'remove'](name);
            }
            else {
                var className = (' ' + element.className + ' ').replace(/\s+/g, ' ').replace(' ' + name + ' ', '');
                element.className = className + (state ? ' ' + name : '');
            }
        }
    }

    // Toggle event
    function _toggleHandler(element, events, callback, toggle) {
        var eventList = events.split(' ');

        // If a nodelist is passed, call itself on each node
        if (element instanceof NodeList) {
            for (var x = 0; x < element.length; x++) {
                if (element[x] instanceof Node) {
                    _toggleHandler(element[x], arguments[1], arguments[2], arguments[3]);
                }
            }
            return;
        }

        // If a single node is passed, bind the event listener
        for (var i = 0; i < eventList.length; i++) {
            element[toggle ? 'addEventListener' : 'removeEventListener'](eventList[i], callback, false);
        }
    }

    // Bind event
    function _on(element, events, callback) {
        if (element) {
            _toggleHandler(element, events, callback, true);
        }
    }

    // Unbind event
    function _off(element, events, callback) {
        if (element) {
            _toggleHandler(element, events, callback, false);
        }
    }

    // Trigger event
    function _triggerEvent(element, event) {
        // Create faux event
        var fauxEvent = document.createEvent('MouseEvents');

        // Set the event type
        fauxEvent.initEvent(event, true, true);

        // Dispatch the event
        element.dispatchEvent(fauxEvent);
    }

    // Toggle aria-pressed state on a toggle button
    function _toggleState(target, state) {
        // Get state
        state = (typeof state === 'boolean' ? state : !target.getAttribute('aria-pressed'));
        
        // Set the attribute on target
        target.setAttribute('aria-pressed', state);
        
        return state;
    }

    // Get percentage
    function _getPercentage(current, max) {
        if (current === 0 || max === 0 || isNaN(current) || isNaN(max)) {
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
                fullScreenEventName: '',
                element: null,
                prefix: ''
            },
            browserPrefixes = 'webkit moz o ms khtml'.split(' ');

        // Check for native support
        if (typeof document.cancelFullScreen !== 'undefined') {
            fullscreen.supportsFullScreen = true;
        }
        else {
            // Check for fullscreen support by vendor prefix
            for (var i = 0, il = browserPrefixes.length; i < il; i++ ) {
                fullscreen.prefix = browserPrefixes[i];

                if (typeof document[fullscreen.prefix + 'CancelFullScreen'] !== 'undefined') {
                    fullscreen.supportsFullScreen = true;
                    break;
                }
                // Special case for MS (when isn't it?)
                else if (typeof document.msExitFullscreen !== 'undefined' && document.msFullscreenEnabled) {
                    fullscreen.prefix = 'ms';
                    fullscreen.supportsFullScreen = true;
                    break;
                }
            }
        }

        // Update methods to do something useful
        if (fullscreen.supportsFullScreen) {
            // Yet again Microsoft awesomeness,
            // Sometimes the prefix is 'ms', sometimes 'MS' to keep you on your toes
            fullscreen.fullScreenEventName = (fullscreen.prefix == 'ms' ? 'MSFullscreenChange' : fullscreen.prefix + 'fullscreenchange');

            fullscreen.isFullScreen = function(element) {
                if (typeof element === 'undefined') {
                    element = document.body;
                }
                switch (this.prefix) {
                    case '':
                        return document.fullscreenElement == element;
                    case 'moz':
                        return document.mozFullScreenElement == element;
                    default:
                        return document[this.prefix + 'FullscreenElement'] == element;
                }
            };
            fullscreen.requestFullScreen = function(element) {
                if (typeof element === 'undefined') {
                    element = document.body;
                }
                return (this.prefix === '') ? element.requestFullScreen() : element[this.prefix + (this.prefix == 'ms' ? 'RequestFullscreen' : 'RequestFullScreen')]();
            };
            fullscreen.cancelFullScreen = function() {
                return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + (this.prefix == 'ms' ? 'ExitFullscreen' : 'CancelFullScreen')]();
            };
            fullscreen.element = function() {
                return (this.prefix === '') ? document.fullscreenElement : document[this.prefix + 'FullscreenElement'];
            };
        }

        return fullscreen;
    }

    // Local storage
    function _storage() {
        var storage = {
            supported: (function() {
                try {
                    return 'localStorage' in window && window.localStorage !== null;
                } 
                catch(e) {
                    return false;
                }
            })()
        };
        return storage;
    }

    // Player instance
    function Plyr(container) {
        var plyr = this;
        plyr.container = container;

        // Captions functions
        // Seek the manual caption time and update UI
        function _seekManualCaptions(time) {
            // If it's not video, or we're using textTracks, bail.
            if (plyr.usingTextTracks || plyr.type !== 'video' || !plyr.supported.full) {
                return;
            }

            // Reset subcount
            plyr.subcount = 0;

            // Check time is a number, if not use currentTime
            // IE has a bug where currentTime doesn't go to 0
            // https://twitter.com/Sam_Potts/status/573715746506731521
            time = typeof time === 'number' ? time : plyr.media.currentTime;

            // If there's no subs available, bail
            if (!plyr.captions[plyr.subcount]) {
                return;
            }

            while (_timecodeMax(plyr.captions[plyr.subcount][0]) < time.toFixed(1)) {
                plyr.subcount++;
                if (plyr.subcount > plyr.captions.length-1) {
                    plyr.subcount = plyr.captions.length-1;
                    break;
                }
            }

            // Check if the next caption is in the current time range
            if (plyr.media.currentTime.toFixed(1) >= _timecodeMin(plyr.captions[plyr.subcount][0]) && 
                plyr.media.currentTime.toFixed(1) <= _timecodeMax(plyr.captions[plyr.subcount][0])) {
                    plyr.currentCaption = plyr.captions[plyr.subcount][1];

                // Trim caption text
                var content = plyr.currentCaption.trim();

                // Render the caption (only if changed)
                if (plyr.captionsContainer.innerHTML != content) {
                    // Empty caption
                    // Otherwise NVDA reads it twice
                    plyr.captionsContainer.innerHTML = '';

                    // Set new caption text
                    plyr.captionsContainer.innerHTML = content;
                }
            }
            else {
                plyr.captionsContainer.innerHTML = '';
            }
        }

        // Display captions container and button (for initialization)
        function _showCaptions() {
            // If there's no caption toggle, bail
            if (!plyr.buttons.captions) {
                return;
            }

            _toggleClass(plyr.container, config.classes.captions.enabled, true);

            if (config.captions.defaultActive) {
                _toggleClass(plyr.container, config.classes.captions.active, true);
                _toggleState(plyr.buttons.captions, true);
            }
        }

        // Utilities for caption time codes
        function _timecodeMin(tc) {
            var tcpair = [];
            tcpair = tc.split(' --> ');
            return _subTcSecs(tcpair[0]);
        }
        function _timecodeMax(tc) {
            var tcpair = [];
            tcpair = tc.split(' --> ');
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
                tc1 = tc.split(',');
                tc2 = tc1[0].split(':');
                seconds = Math.floor(tc2[0]*60*60) + Math.floor(tc2[1]*60) + Math.floor(tc2[2]);
                return seconds;
            }
        }

        // Find all elements
        function _getElements(selector) {
            return plyr.container.querySelectorAll(selector);
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
            _log('Injecting custom controls.');

            // If no controls are specified, create default
            if (!html) {
                html = _buildControls();
            }

            // Replace seek time instances
            html = _replaceAll(html, '{seektime}', config.seekTime);

            // Replace all id references with random numbers
            html = _replaceAll(html, '{id}', Math.floor(Math.random() * (10000)));

            // Inject into the container
            plyr.container.insertAdjacentHTML('beforeend', html);

            // Setup tooltips
            if (config.tooltips) {
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
                plyr.controls                 = _getElement(config.selectors.controls);

                // Buttons
                plyr.buttons = {};
                plyr.buttons.seek             = _getElement(config.selectors.buttons.seek);
                plyr.buttons.play             = _getElement(config.selectors.buttons.play);
                plyr.buttons.pause            = _getElement(config.selectors.buttons.pause);
                plyr.buttons.restart          = _getElement(config.selectors.buttons.restart);
                plyr.buttons.rewind           = _getElement(config.selectors.buttons.rewind);
                plyr.buttons.forward          = _getElement(config.selectors.buttons.forward);
                plyr.buttons.fullscreen       = _getElement(config.selectors.buttons.fullscreen);

                // Inputs
                plyr.buttons.mute             = _getElement(config.selectors.buttons.mute);
                plyr.buttons.captions         = _getElement(config.selectors.buttons.captions);
                plyr.checkboxes               = _getElements('[type="checkbox"]');

                // Progress
                plyr.progress = {};
                plyr.progress.container       = _getElement(config.selectors.progress.container);

                // Progress - Buffering
                plyr.progress.buffer          = {};
                plyr.progress.buffer.bar      = _getElement(config.selectors.progress.buffer);
                plyr.progress.buffer.text     = plyr.progress.buffer.bar && plyr.progress.buffer.bar.getElementsByTagName('span')[0];

                // Progress - Played
                plyr.progress.played          = {};
                plyr.progress.played.bar      = _getElement(config.selectors.progress.played);
                plyr.progress.played.text     = plyr.progress.played.bar && plyr.progress.played.bar.getElementsByTagName('span')[0];

                // Volume
                plyr.volume                   = _getElement(config.selectors.buttons.volume);

                // Timing
                plyr.duration                 = _getElement(config.selectors.duration);
                plyr.currentTime              = _getElement(config.selectors.currentTime);
                plyr.seekTime                 = _getElements(config.selectors.seekTime);

                return true;
            }
            catch(e) {
                _log('It looks like there\'s a problem with your controls html. Bailing.', true);

                // Restore native video controls
                plyr.media.setAttribute('controls', '');

                return false;
            }
        }

        // Setup aria attribute for play
        function _setupPlayAria() {
            // If there's no play button, bail
            if (!plyr.buttons.play) {
                return;
            }

            // Find the current text
            var label = plyr.buttons.play.innerText || config.i18n.play;

            // If there's a media title set, use that for the label
            if (typeof(config.title) !== 'undefined' && config.title.length) {
                label += ', ' + config.title;
            }

            plyr.buttons.play.setAttribute('aria-label', label);
        }

        // Setup media
        function _setupMedia() {
            // If there's no media, bail
            if (!plyr.media) {
                _log('No audio or video element found!', true);
                return false;
            }

            if (plyr.supported.full) {
                // Remove native video controls
                plyr.media.removeAttribute('controls');
        
                // Add type class
                _toggleClass(plyr.container, config.classes.type.replace('{0}', plyr.type), true);

                // If there's no autoplay attribute, assume the video is stopped and add state class
                _toggleClass(plyr.container, config.classes.stopped, config.autoplay);
            
                // Add iOS class
                if (plyr.browser.ios) {
                    _toggleClass(plyr.container, 'ios', true);
                }

                // Inject the player wrapper
                if (plyr.type === 'video') {
                    // Create the wrapper div
                    var wrapper = document.createElement('div');
                    wrapper.setAttribute('class', config.classes.videoWrapper);

                    // Wrap the video in a container
                    _wrap(plyr.media, wrapper);

                    // Cache the container
                    plyr.videoContainer = wrapper;
                }
            }

            // Embeds
            if (_inArray(config.types.embed, plyr.type)) {
                _setupEmbed(plyr.embedId, plyr.type);

                // Clean up
                plyr.embedId = null;
            }
            else {
                // Autoplay
                if (config.autoplay) {
                    _play();
                }
            }
        }

        // Setup YouTube/Vimeo
        function _setupEmbed(videoId) {
            var container = document.createElement('div'),
                id = plyr.type + '-' + Math.floor(Math.random() * (10000));

            // Remove old containers
            var containers = _getElements('[id^="' + plyr.type + '-"]');
            for (var i = containers.length - 1; i >= 0; i--) {
                _remove(containers[i]);
            }

            // Add embed class for responsive
            _toggleClass(plyr.media, config.classes.videoWrapper, true);
            _toggleClass(plyr.media, config.classes.embedWrapper, true);

            // YouTube
            if (plyr.type === 'youtube') {
                // Create the YouTube container
                plyr.media.appendChild(container);

                // Set ID
                container.setAttribute('id', id);

                // Setup API
                if (typeof YT === 'object') {
                    _youTubeReady(videoId, container);
                }
                else {
                    // Load the API
                    _injectScript(config.urls.youtube.api);

                    // Setup callback for the API
                    window.onYouTubeIframeAPIReady = function () { _youTubeReady(videoId, container); };
                }
            }
            // Vimeo
            else if (plyr.type === 'vimeo') {
                // Inject the iframe
                var iframe = document.createElement('iframe');

                // Watch for iframe load
                iframe.loaded = false;
                _on(iframe, 'load', function() { iframe.loaded = true; });

                _setAttributes(iframe, {
                    'src':                      'https://player.vimeo.com/video/' + videoId + '?player_id=' + id + '&api=1&badge=0&byline=0&portrait=0&title=0',
                    'id':                       id,
                    'webkitallowfullscreen':    '',
                    'mozallowfullscreen':       '',
                    'allowfullscreen':          '',
                    'frameborder':              0
                });
                container.appendChild(iframe);
                plyr.media.appendChild(container);
                
                // Setup API
                if (typeof Froogaloop === 'function') {
                    _on(iframe, 'load', _vimeoReady);
                }
                else {
                    // Load the API
                    _injectScript(config.urls.vimeo.api);

                    // Wait for fragaloop load
                    var timer = window.setInterval(function() {
                        if ('$f' in window && iframe.loaded) {
                            window.clearInterval(timer);

                            _vimeoReady.call(iframe);
                        }
                    }, 50);
                }
            }
        }

        // When embeds are ready
        function _embedReady() {
            // Inject and update UI
            if (plyr.supported.full) {
                // Only setup controls once
                if (!plyr.container.querySelectorAll(config.selectors.controls).length) {
                    _setupInterface();
                }
            }

            // Set the volume
            _setVolume();
            _updateVolume();
        }

        // Handle YouTube API ready
        function _youTubeReady(videoId, container) {
            // Setup timers object
            // We have to poll YouTube for updates
            if (!('timer' in plyr)) {
                plyr.timer = {};
            }

            // Setup instance
            // https://developers.google.com/youtube/iframe_api_reference
            plyr.embed = new YT.Player(container.id, {
                videoId: videoId,
                playerVars: {
                    autoplay: (config.autoplay ? 1 : 0),
                    controls: (plyr.supported.full ? 0 : 1),
                    rel: 0,
                    showinfo: 0,
                    iv_load_policy: 3,
                    cc_load_policy: (config.captions.defaultActive ? 1 : 0),
                    cc_lang_pref: 'en',
                    wmode: 'transparent',
                    modestbranding: 1,
                    disablekb: 1
                },
                events: {
                    'onReady': function(event) {
                        // Get the instance
                        var instance = event.target;

                        // Create a faux HTML5 API using the YouTube API
                        plyr.media.play = function() { instance.playVideo(); };
                        plyr.media.pause = function() { instance.pauseVideo(); };
                        plyr.media.stop = function() { instance.stopVideo(); };
                        plyr.media.duration = instance.getDuration();
                        plyr.media.paused = !config.autoplay;
                        plyr.media.currentTime = instance.getCurrentTime();
                        plyr.media.muted = instance.isMuted();

                        // Trigger timeupdate
                        _triggerEvent(plyr.media, 'timeupdate');

                        // Reset timer
                        window.clearInterval(plyr.timer.buffering);

                        // Setup buffering
                        plyr.timer.buffering = window.setInterval(function() {
                            // Get loaded % from YouTube
                            plyr.media.buffered = instance.getVideoLoadedFraction();
                            
                            // Trigger progress
                            _triggerEvent(plyr.media, 'progress');

                            // Bail if we're at 100%
                            if (plyr.media.buffered === 1) {
                                window.clearInterval(plyr.timer.buffering);
                            }
                        }, 200);

                        // Update UI
                        _embedReady();

                        // Display duration if available
                        if (config.displayDuration) {
                            _displayDuration();
                        }
                    },
                    'onStateChange': function(event) {
                        // Get the instance
                        var instance = event.target;

                        // Reset timer
                        window.clearInterval(plyr.timer.playing);

                        // Handle events
                        // -1   Unstarted
                        // 0    Ended
                        // 1    Playing
                        // 2    Paused
                        // 3    Buffering
                        // 5    Video cued    
                        switch (event.data) {
                            case 0: 
                                plyr.media.paused = true;
                                _triggerEvent(plyr.media, 'ended');
                                break;

                            case 1:
                                plyr.media.paused = false;
                                _triggerEvent(plyr.media, 'play');

                                // Poll to get playback progress
                                plyr.timer.playing = window.setInterval(function() {
                                    // Set the current time
                                    plyr.media.currentTime = instance.getCurrentTime();

                                    // Trigger timeupdate
                                    _triggerEvent(plyr.media, 'timeupdate');
                                }, 200);

                                break;

                            case 2:
                                plyr.media.paused = true;
                                _triggerEvent(plyr.media, 'pause');
                        }
                    }
                }
            });
        }

        // Vimeo ready
        function _vimeoReady() {
            /* jshint validthis: true */
            plyr.embed = $f(this);

            // Setup on ready
            plyr.embed.addEvent('ready', function() {

                // Create a faux HTML5 API using the Vimeo API
                plyr.media.play = function() { plyr.embed.api('play'); };
                plyr.media.pause = function() { plyr.embed.api('pause'); };
                plyr.media.stop = function() { plyr.embed.api('stop') };
                plyr.media.paused = !config.autoplay;
                plyr.media.currentTime = 0;

                // Update UI
                _embedReady();

                plyr.embed.api('getCurrentTime', function (value) {
                    plyr.media.currentTime = value;

                    // Trigger timeupdate
                    _triggerEvent(plyr.media, 'timeupdate');
                });

                plyr.embed.api('getDuration', function(value) {
                    plyr.media.duration = value;

                    // Display duration if available
                    if (plyr.supported.full && config.displayDuration) {
                        _displayDuration();
                    }
                });

                plyr.embed.addEvent('play', function() {
                    plyr.media.paused = false;
                    _triggerEvent(plyr.media, 'play');
                });

                plyr.embed.addEvent('pause', function() {
                    plyr.media.paused = true;
                    _triggerEvent(plyr.media, 'pause');
                });

                plyr.embed.addEvent('playProgress', function(data) {
                    plyr.media.currentTime = data.seconds;
                    _triggerEvent(plyr.media, 'timeupdate');
                });

                plyr.embed.addEvent('loadProgress', function(data) {
                    plyr.media.buffered = data.percent;
                    _triggerEvent(plyr.media, 'progress');
                });

                plyr.embed.addEvent('finish', function() {
                    plyr.media.paused = true;
                    _triggerEvent(plyr.media, 'ended');
                });

                // Always seek to 0
                //plyr.embed.api('seekTo', 0);

                // Prevent autoplay if needed (seek will play)
                //if (!config.autoplay) {
                //    plyr.embed.api('pause');
                //}                
            });
        }

        // Setup captions
        function _setupCaptions() {
            if (plyr.type === 'video') {
                // Inject the container
                if (!_getElement(config.selectors.captions)) {
                    plyr.videoContainer.insertAdjacentHTML('afterbegin', '<div class="' + _getClassname(config.selectors.captions) + '"><span></span></div>');
                }

                // Cache selector
                plyr.captionsContainer = _getElement(config.selectors.captions).querySelector('span');

                // Determine if HTML5 textTracks is supported
                plyr.usingTextTracks = false;
                if (plyr.media.textTracks) {
                    plyr.usingTextTracks = true;
                }

                // Get URL of caption file if exists
                var captionSrc = '',
                    kind,
                    children = plyr.media.childNodes;

                for (var i = 0; i < children.length; i++) {
                    if (children[i].nodeName.toLowerCase() === 'track') {
                        kind = children[i].kind;
                        if (kind === 'captions' || kind === 'subtitles') {
                            captionSrc = children[i].getAttribute('src');
                        }
                    }
                }

                // Record if caption file exists or not
                plyr.captionExists = true;
                if (captionSrc === '') {
                    plyr.captionExists = false;
                    _log('No caption track found.');
                }
                else {
                    _log('Caption track found; URI: ' + captionSrc);
                }

                // If no caption file exists, hide container for caption text
                if (!plyr.captionExists) {
                    _toggleClass(plyr.container, config.classes.captions.enabled);
                }
                // If caption file exists, process captions
                else {
                    // Turn off native caption rendering to avoid double captions 
                    // This doesn't seem to work in Safari 7+, so the <track> elements are removed from the dom below
                    var tracks = plyr.media.textTracks;
                    for (var x = 0; x < tracks.length; x++) {
                        tracks[x].mode = 'hidden';
                    }

                    // Enable UI
                    _showCaptions(plyr);

                    // Disable unsupported browsers than report false positive
                    if ((plyr.browser.name === 'IE' && plyr.browser.version >= 10) || 
                        (plyr.browser.name === 'Firefox' && plyr.browser.version >= 31) || 
                        (plyr.browser.name === 'Chrome' && plyr.browser.version >= 43) || 
                        (plyr.browser.name === 'Safari' && plyr.browser.version >= 7)) {
                        // Debugging
                        _log('Detected unsupported browser for HTML5 captions. Using fallback.');

                        // Set to false so skips to 'manual' captioning
                        plyr.usingTextTracks = false;
                    }

                    // Rendering caption tracks
                    // Native support required - http://caniuse.com/webvtt
                    if (plyr.usingTextTracks) {
                        _log('TextTracks supported.');
            
                        for (var y = 0; y < tracks.length; y++) {
                            var track = tracks[y];

                            if (track.kind === 'captions' || track.kind === 'subtitles') {
                                _on(track, 'cuechange', function() {
                                    // Clear container
                                    plyr.captionsContainer.innerHTML = '';

                                    // Display a cue, if there is one
                                    if (this.activeCues[0] && this.activeCues[0].hasOwnProperty('text')) {
                                        plyr.captionsContainer.appendChild(this.activeCues[0].getCueAsHTML().trim());
                                    }
                                });
                            }
                        }
                    }
                    // Caption tracks not natively supported
                    else {
                        _log('TextTracks not supported so rendering captions manually.');

                        // Render captions from array at appropriate time
                        plyr.currentCaption = '';
                        plyr.captions = [];

                        if (captionSrc !== '') {
                            // Create XMLHttpRequest Object
                            var xhr = new XMLHttpRequest();

                            xhr.onreadystatechange = function() {
                                if (xhr.readyState === 4) {
                                    if (xhr.status === 200) {
                                        var records = [],
                                            record,
                                            req = xhr.responseText;

                                        records = req.split('\n\n');

                                        for (var r = 0; r < records.length; r++) {
                                            record = records[r];
                                            plyr.captions[r] = [];
                                            plyr.captions[r] = record.split('\n');
                                        }

                                        // Remove first element ('VTT')
                                        plyr.captions.shift();

                                        _log('Successfully loaded the caption file via AJAX.');
                                    } 
                                    else {
                                        _log('There was a problem loading the caption file via AJAX.', true);
                                    }
                                }
                            };
                            
                            xhr.open('get', captionSrc, true);

                            xhr.send();
                        }
                    }

                    // If Safari 7+, removing track from DOM [see 'turn off native caption rendering' above]
                    if (plyr.browser.name === 'Safari' && plyr.browser.version >= 7) {
                        _log('Safari 7+ detected; removing track from DOM.');

                        // Find all <track> elements
                        tracks = plyr.media.getElementsByTagName('track');
                        
                        // Loop through and remove one by one
                        for (var t = 0; t < tracks.length; t++) {
                            plyr.media.removeChild(tracks[t]);
                        }
                    }
                }
            }
        }

        // Setup fullscreen
        function _setupFullscreen() {
            if ((plyr.type != 'audio' || config.fullscreen.allowAudio) && config.fullscreen.enabled) {
                // Check for native support
                var nativeSupport = fullscreen.supportsFullScreen;

                if (nativeSupport || (config.fullscreen.fallback && !_inFrame())) {
                    _log((nativeSupport ? 'Native' : 'Fallback') + ' fullscreen enabled.');

                    // Add styling hook
                    _toggleClass(plyr.container, config.classes.fullscreen.enabled, true);
                }
                else {
                    _log('Fullscreen not supported and fallback disabled.');
                }

                // Toggle state
                _toggleState(plyr.buttons.fullscreen, false);

                // Set control hide class hook
                if (config.fullscreen.hideControls) {
                    _toggleClass(plyr.container, config.classes.fullscreen.hideControls, true);
                }
            }   
        }

        // Play media
        function _play() {
            plyr.media.play();
        }

        // Pause media
        function _pause() {
            plyr.media.pause();
        }

        // Toggle playback
        function _togglePlay(toggle) {
            // Play
            if (toggle === true) {
                _play();
            }
            // Pause
            else if (toggle === false) {
                _pause();
            }
            // True toggle
            else {
                plyr.media[plyr.media.paused ? 'play' : 'pause']();
            }
        }

        // Rewind
        function _rewind(seekTime) {
            // Use default if needed
            if (typeof seekTime !== 'number') {
                seekTime = config.seekTime;
            }
            _seek(plyr.media.currentTime - seekTime);
        }

        // Fast forward
        function _forward(seekTime) {
            // Use default if needed
            if (typeof seekTime !== 'number') {
                seekTime = config.seekTime;
            }
            _seek(plyr.media.currentTime + seekTime);
        }

        // Seek to time
        // The input parameter can be an event or a number
        function _seek(input) {
            var targetTime = 0,
                paused = plyr.media.paused;

            // Explicit position
            if (typeof input === 'number') {
                targetTime = input;
            }
            // Event
            else if (typeof input === 'object' && (input.type === 'input' || input.type === 'change')) {
                // It's the seek slider
                // Seek to the selected time
                targetTime = ((input.target.value / input.target.max) * plyr.media.duration);
            }

            // Normalise targetTime
            if (targetTime < 0) {
                targetTime = 0;
            }
            else if (targetTime > plyr.media.duration) {
                targetTime = plyr.media.duration;
            }

            // Set the current time
            // Try/catch incase the media isn't set and we're calling seek() from source() and IE moans
            try {
                plyr.media.currentTime = targetTime.toFixed(1);
            }
            catch(e) {}

            // Trigger timeupdate for embed and restore pause state
            if ('embed' in plyr) {
                // YouTube
                if (plyr.type === 'youtube') {
                    plyr.embed.seekTo(targetTime);
                }

                // Vimeo
                if (plyr.type === 'vimeo') {
                    plyr.embed.api('seekTo', targetTime);
                }

                // Trigger timeupdate
                _triggerEvent(plyr.media, 'timeupdate');

                if (paused) {
                    _pause();
                }
            }

            // Logging
            _log('Seeking to ' + plyr.media.currentTime + ' seconds');

            // Special handling for 'manual' captions
            _seekManualCaptions(targetTime);
        }

        // Check playing state
        function _checkPlaying() {
            _toggleClass(plyr.container, config.classes.playing, !plyr.media.paused);
            _toggleClass(plyr.container, config.classes.stopped, plyr.media.paused);
        }

        // Toggle fullscreen
        function _toggleFullscreen(event) {
            // Check for native support
            var nativeSupport = fullscreen.supportsFullScreen;

            // If it's a fullscreen change event, it's probably a native close
            if (event && event.type === fullscreen.fullScreenEventName) {
                plyr.isFullscreen = fullscreen.isFullScreen(plyr.container);
            }
            // If there's native support, use it
            else if (nativeSupport) {
                // Request fullscreen
                if (!fullscreen.isFullScreen(plyr.container)) {
                    fullscreen.requestFullScreen(plyr.container);
                }
                // Bail from fullscreen
                else {
                    fullscreen.cancelFullScreen();
                }

                // Check if we're actually full screen (it could fail)
                plyr.isFullscreen = fullscreen.isFullScreen(plyr.container);
            }
            else {
                // Otherwise, it's a simple toggle
                plyr.isFullscreen = !plyr.isFullscreen;

                // Bind/unbind escape key
                if (plyr.isFullscreen) {
                    _on(document, 'keyup', _handleEscapeFullscreen);
                    document.body.style.overflow = 'hidden';
                }
                else {
                    _off(document, 'keyup', _handleEscapeFullscreen);
                    document.body.style.overflow = '';
                }
            }

            // Set class hook
            _toggleClass(plyr.container, config.classes.fullscreen.active, plyr.isFullscreen);

            // Set button state
            _toggleState(plyr.buttons.fullscreen, plyr.isFullscreen);
            
            // Toggle controls visibility based on mouse movement and location
            var hoverTimer, isMouseOver = false;

            // Show the player controls
            function _showControls() {
                // Set shown class
                _toggleClass(plyr.container, config.classes.hover, true);

                // Clear timer every movement
                window.clearTimeout(hoverTimer);

                // If the mouse is not over the controls, set a timeout to hide them
                if (!isMouseOver) {
                    hoverTimer = window.setTimeout(function() {
                        _toggleClass(plyr.container, config.classes.hover, false);
                    }, 2000);
                }
            }

            // Check mouse is over the controls
            function _setMouseOver (event) {
                isMouseOver = (event.type === 'mouseenter');
            }

            if (config.fullscreen.hideControls) {
                // Hide on entering full screen
                _toggleClass(plyr.controls, config.classes.hover, false);

                // Keep an eye on the mouse location in relation to controls
                _toggleHandler(plyr.controls, 'mouseenter mouseleave', _setMouseOver, plyr.isFullscreen);

                // Show the controls on mouse move
                _toggleHandler(plyr.container, 'mousemove', _showControls, plyr.isFullscreen);
            }
        }

        // Bail from faux-fullscreen 
        function _handleEscapeFullscreen(event) {
            // If it's a keypress and not escape, bail
            if ((event.which || event.charCode || event.keyCode) === 27 && plyr.isFullscreen) {
                _toggleFullscreen();
            }
        }

        // Mute
        function _toggleMute(muted) {
            // If the method is called without parameter, toggle based on current value
            if (typeof muted !== 'boolean') {
                muted = !plyr.media.muted;
            }

            // Set button state
            _toggleState(plyr.buttons.mute, muted);

            // Set mute on the player
            plyr.media.muted = muted;

            // YouTube
            if (plyr.type === 'youtube') {
                plyr.embed[plyr.media.muted ? 'mute' : 'unMute']();

                // Trigger timeupdate
                _triggerEvent(plyr.media, 'volumechange');
            }

            // Vimeo
            if (plyr.type === 'vimeo') {
                if (plyr.media.muted) {
                    plyr.embed.api('setVolume', 0);
                }
                else {
                    plyr.embed.api('setVolume', parseFloat(config.volume / 10));
                }

                // Trigger timeupdate
                _triggerEvent(plyr.media, 'volumechange');
            }
        }

        // Set volume
        function _setVolume(volume) {
            // Use default if no value specified
            if (typeof volume === 'undefined') {
                if (config.storage.enabled && _storage().supported) {
                    volume = window.localStorage[config.storage.key] || config.volume;
                }
                else {
                    volume = config.volume;
                }                
            }

            // Maximum is 10
            if (volume > 10) {
                volume = 10;
            }
            // Minimum is 0
            if (volume < 0) {
                volume = 0;
            }

            // Set the player volume
            plyr.media.volume = parseFloat(volume / 10);

            // Store in config
            config.volume = volume;

            // YouTube
            if (plyr.type === 'youtube') {
                plyr.embed.setVolume(plyr.media.volume * 100);
            }

            // Vimeo
            if (plyr.type === 'vimeo') {
                plyr.embed.api('setVolume', plyr.media.volume);
            }

            // Trigger volumechange for embeds
            if ('embed' in plyr) {
                _triggerEvent(plyr.media, 'volumechange');
            }

            // Toggle muted state
            if (plyr.media.muted && volume > 0) {
                _toggleMute();
            } 
        }

        // Update volume UI and storage
        function _updateVolume() {
            // Get the current volume
            var volume = plyr.media.muted ? 0 : (plyr.media.volume * 10);

            // Update the <input type="range"> if present
            if (plyr.supported.full && plyr.volume) {
                plyr.volume.value = volume;
            }

            // Store the volume in storage
            if (config.storage.enabled && _storage().supported) {
                window.localStorage.setItem(config.storage.key, volume);
            }

            // Toggle class if muted
            _toggleClass(plyr.container, config.classes.muted, (volume === 0));
            
            // Update checkbox for mute state
            if (plyr.supported.full && plyr.buttons.mute) {
                _toggleState(plyr.buttons.mute, (volume === 0));
            }
        }

        // Toggle captions
        function _toggleCaptions(show) {
            // If there's no full support, or there's no caption toggle
            if (!plyr.supported.full || !plyr.buttons.captions) {
                return;
            }          

            // If the method is called without parameter, toggle based on current value
            if (typeof show !== 'boolean') {
                show = (plyr.container.className.indexOf(config.classes.captions.active) === -1);
            }

            // Set global
            plyr.captionsEnabled = show;

            // Toggle state
            _toggleState(plyr.buttons.captions, plyr.captionsEnabled);

            // Add class hook
            _toggleClass(plyr.container, config.classes.captions.active, plyr.captionsEnabled);
        }

        // Check if media is loading
        function _checkLoading(event) {
            var loading = (event.type === 'waiting');

            // Clear timer
            clearTimeout(plyr.loadingTimer);

            // Timer to prevent flicker when seeking
            plyr.loadingTimer = setTimeout(function() {
                _toggleClass(plyr.container, config.classes.loading, loading);
            }, (loading ? 250 : 0));
        }

        // Update <progress> elements
        function _updateProgress(event) {
            var progress    = plyr.progress.played.bar,
                text        = plyr.progress.played.text,
                value       = 0;

            if (event) {
                switch (event.type) {
                    // Video playing
                    case 'timeupdate':
                    case 'seeking':
                        value = _getPercentage(plyr.media.currentTime, plyr.media.duration);

                        // Set seek range value only if it's a 'natural' time event
                        if (event.type == 'timeupdate' && plyr.buttons.seek) {
                            plyr.buttons.seek.value = value;
                        }
            
                        break;

                    // Events from seek range
                    case 'change':
                    case 'input':
                        value = event.target.value;
                        break;


                    // Check buffer status
                    case 'playing':
                    case 'progress':
                        progress    = plyr.progress.buffer.bar;
                        text        = plyr.progress.buffer.text;
                        value       = (function() {
                                        var buffered = plyr.media.buffered;

                                        // HTML5
                                        if (buffered && buffered.length) {
                                            return _getPercentage(buffered.end(0), plyr.media.duration);
                                        }
                                        // YouTube returns between 0 and 1
                                        else if (typeof buffered === 'number') {
                                            return (buffered * 100);
                                        }

                                        return 0;
                                    })();
                }
            }

            // Set values
            if (progress) {
                progress.value = value;
            }
            if (text) {
                text.innerHTML = value;
            }
        }

        // Update the displayed time
        function _updateTimeDisplay(time, element) {
            // Bail if there's no duration display
            if (!element) {
                return;
            }

            // Fallback to 0
            if (isNaN(time)) {
                time = 0;
            }

            plyr.secs = parseInt(time % 60);
            plyr.mins = parseInt((time / 60) % 60);
            plyr.hours = parseInt(((time / 60) / 60) % 60);

            // Do we need to display hours?
            var displayHours = (parseInt(((plyr.media.duration / 60) / 60) % 60) > 0);
            
            // Ensure it's two digits. For example, 03 rather than 3.
            plyr.secs = ('0' + plyr.secs).slice(-2);
            plyr.mins = ('0' + plyr.mins).slice(-2);

            // Render
            element.innerHTML = (displayHours ? plyr.hours + ':' : '') + plyr.mins + ':' + plyr.secs;
        }

        // Show the duration on metadataloaded
        function _displayDuration() {
            var duration = plyr.media.duration || 0;

            // If there's only one time display, display duration there
            if (!plyr.duration && config.displayDuration && plyr.media.paused) {
                _updateTimeDisplay(duration, plyr.currentTime);
            }

            // If there's a duration element, update content
            if (plyr.duration) {
                _updateTimeDisplay(duration, plyr.duration);
            }
        }

        // Handle time change event
        function _timeUpdate(event) {
            // Duration
            _updateTimeDisplay(plyr.media.currentTime, plyr.currentTime);

            // Playing progress
            _updateProgress(event);
        }

        // Add elements to HTML5 media (source, tracks, etc)
        function _insertChildElements(type, attributes) {
            if (typeof attributes === 'string') {
               _insertElement(type, plyr.media, { src: attributes });
            }
            else if (attributes.constructor === Array) {
                for (var i = attributes.length - 1; i >= 0; i--) {
                    _insertElement(type, plyr.media, attributes[i]);
                }
            }
        }

        // Update source
        // Sources are not checked for support so be careful
        function _updateSource(source) {
            if (typeof source === 'undefined') {
                return;
            }

            // Pause playback
            _pause();

            // Clean up YouTube stuff
            if (plyr.type === 'youtube') {
                // Destroy the embed instance
                plyr.embed.destroy();

                // Clear timer
                window.clearInterval(plyr.timer.buffering);
                window.clearInterval(plyr.timer.playing);
            }
            else if (plyr.type === 'video') {
                // Remove video wrapper
                _remove(plyr.videoContainer);
            }
            
            // Remove the old media
            _remove(plyr.media);

            // Set the new type
            if ('type' in source && source.type !== plyr.type) {
                plyr.type = source.type;
            }

            // Create new markup
            switch(plyr.type) {
                case 'video':
                    plyr.media = document.createElement('video');
                    break;

                case 'audio':
                    plyr.media = document.createElement('audio');
                    break;

                case 'youtube':
                case 'vimeo':
                    plyr.media = document.createElement('div');
                    plyr.embedId = (typeof source.sources === 'string' ? source.sources : source.sources[0].src);
                    break;
            }

            // Inject the new element
            _prependChild(plyr.container, plyr.media);

            // Set attributes for audio video
            if (_inArray(config.types.html5, plyr.type)) {
                if (config.crossorigin) {
                    plyr.media.setAttribute('crossorigin', '');
                }
                if (config.autoplay) {
                    plyr.media.setAttribute('autoplay', '');
                }
                if ('poster' in source) {
                    plyr.media.setAttribute('poster', source.poster);
                }
                if (config.loop) {
                    plyr.media.setAttribute('loop', '');
                }
            }

            // Classname reset
            plyr.container.className = plyr.originalClassName;

            // Restore class hooks
            _toggleClass(plyr.container, config.classes.fullscreen.active, plyr.isFullscreen);
            _toggleClass(plyr.container, config.classes.captions.active, plyr.captionsEnabled);

            // Autoplay the new source?
            config.autoplay = (source.autoplay || config.autoplay);
               
            // Set media id for embeds
            if (_inArray(config.types.embed, plyr.type)) {
                plyr.embedId = source.sources; 
            }

            // Set new sources for html5
            if (_inArray(config.types.html5, plyr.type)) {
                _insertChildElements('source', source.sources);
            }

            // Set up from scratch
            _setupMedia();            

            // Trigger media updated
            _mediaUpdated();

            // HTML5 stuff
            if (_inArray(config.types.html5, plyr.type)) {
                // Set volume
                _setVolume();
                _updateVolume();

                // UI updates
                if (plyr.supported.full) {
                    // Reset time display
                    _timeUpdate();

                    // Update the UI
                    _checkPlaying();
                }

                // Setup captions
                if ('tracks' in source) {
                    _insertChildElements('track', source.tracks);

                    // Captions
                    _setupCaptions();
                }

                // Load HTML5 sources
                plyr.media.load();

                // Play if autoplay attribute is present
                if (config.autoplay) {
                    _play();
                } 
            } 

            if ('title' in source) {
                config.title = source.title;
                _setupPlayAria();
            }       
        }

        // Update poster
        function _updatePoster(source) {
            if (plyr.type === 'video') {
                plyr.media.setAttribute('poster', source);
            }
        }

        // Listen for events
        function _listeners() {
            // IE doesn't support input event, so we fallback to change
            var inputEvent = (plyr.browser.name == 'IE' ? 'change' : 'input');

            // Detect tab focus
            function checkFocus() {
                var focused = document.activeElement;
                if (!focused || focused == document.body) {
                    focused = null;
                }
                else if (document.querySelector) {
                    focused = document.querySelector(':focus');
                }
                for (var button in plyr.buttons) {
                    var element = plyr.buttons[button];

                    _toggleClass(element, 'tab-focus', (element === focused));
                }
            }
            _on(window, 'keyup', function(event) {
                var code = (event.keyCode ? event.keyCode : event.which);

                if (code == 9) {
                    checkFocus();
                }
            });
            for (var button in plyr.buttons) {
                var element = plyr.buttons[button];

                _on(element, 'blur', function() {
                    _toggleClass(element, 'tab-focus', false);
                });
            }

            // Play
            _on(plyr.buttons.play, 'click', function() {
                _play();
                setTimeout(function() { plyr.buttons.pause.focus(); }, 100);
            });

            // Pause
            _on(plyr.buttons.pause, 'click', function() {
                _pause();
                setTimeout(function() { plyr.buttons.play.focus(); }, 100);
            });

            // Restart
            _on(plyr.buttons.restart, 'click', _seek);

            // Rewind
            _on(plyr.buttons.rewind, 'click', _rewind);

            // Fast forward
            _on(plyr.buttons.forward, 'click', _forward);

            // Seek 
            _on(plyr.buttons.seek, inputEvent, _seek);

            // Set volume
            _on(plyr.volume, inputEvent, function() {
                _setVolume(this.value);
            });

            // Mute
            _on(plyr.buttons.mute, 'click', _toggleMute);

            // Fullscreen
            _on(plyr.buttons.fullscreen, 'click', _toggleFullscreen);

            // Handle user exiting fullscreen by escaping etc
            if (fullscreen.supportsFullScreen) {
                _on(document, fullscreen.fullScreenEventName, _toggleFullscreen);
            }
            
            // Time change on media
            _on(plyr.media, 'timeupdate seeking', _timeUpdate);

            // Update manual captions
            _on(plyr.media, 'timeupdate', _seekManualCaptions);

            // Display duration
            _on(plyr.media, 'loadedmetadata', _displayDuration);

            // Captions
            _on(plyr.buttons.captions, 'click', _toggleCaptions);

            // Handle the media finishing
            _on(plyr.media, 'ended', function() {
                // Clear 
                if (plyr.type === 'video') {
                    plyr.captionsContainer.innerHTML = '';
                }

                // Reset UI
                _checkPlaying();
            });

            // Check for buffer progress
            _on(plyr.media, 'progress playing', _updateProgress);

            // Handle native mute
            _on(plyr.media, 'volumechange', _updateVolume);

            // Handle native play/pause
            _on(plyr.media, 'play pause', _checkPlaying);

            // Loading
            _on(plyr.media, 'waiting canplay seeked', _checkLoading);

            // Click video
            if (plyr.type === 'video' && config.click) {
                _on(plyr.videoContainer, 'click', function() {
                    if (plyr.media.paused) {
                        _triggerEvent(plyr.buttons.play, 'click');
                    }
                    else if (plyr.media.ended) {
                        _seek();
                        _triggerEvent(plyr.buttons.play, 'click');
                    }
                    else {
                        _triggerEvent(plyr.buttons.pause, 'click');
                    }
                });
            }
        }

        // Destroy an instance
        // Event listeners are removed when elements are removed
        // http://stackoverflow.com/questions/12528049/if-a-dom-element-is-removed-are-its-listeners-also-removed-from-memory
        function _destroy() {
            // Bail if the element is not initialized
            if (!plyr.init) {
                return null;
            }

            // Reset container classname
            plyr.container.setAttribute('class', _getClassname(config.selectors.container));

            // Remove init flag
            plyr.init = false;

            // Remove controls
            _remove(_getElement(config.selectors.controls));

            // YouTube
            if (plyr.type === 'youtube') {
                plyr.embed.destroy();
                return;
            }

            // If video, we need to remove some more
            if (plyr.type === 'video') {
                // Remove captions
                _remove(_getElement(config.selectors.captions));

                // Remove video wrapper
                _unwrap(plyr.videoContainer);
            }

            // Restore native video controls
            plyr.media.setAttribute('controls', '');

            // Clone the media element to remove listeners
            // http://stackoverflow.com/questions/19469881/javascript-remove-all-event-listeners-of-specific-type
            var clone = plyr.media.cloneNode(true);
            plyr.media.parentNode.replaceChild(clone, plyr.media);
        }

        // Setup a player
        function _init() {
            // Bail if the element is initialized
            if (plyr.init) {
                return null;
            }

            // Setup the fullscreen api 
            fullscreen = _fullscreen();

            // Sniff out the browser
            plyr.browser = _browserSniff();

            // Get the media element
            plyr.media = plyr.container.querySelectorAll('audio, video, div')[0];

            // Get original classname
            plyr.originalClassName = plyr.container.className;

            // Set media type based on tag or data attribute
            // Supported: video, audio, vimeo, youtube
            var tagName = plyr.media.tagName.toLowerCase();
            if (tagName === 'div') {
                plyr.type     = plyr.media.getAttribute('data-type');
                plyr.embedId  = plyr.media.getAttribute('data-video-id');

                // Clean up
                plyr.media.removeAttribute('data-type');
                plyr.media.removeAttribute('data-video-id');
            }
            else {
                plyr.type         = tagName;
                config.crossorigin  = (plyr.media.getAttribute('crossorigin') !== null);
                config.autoplay     = (config.autoplay || (plyr.media.getAttribute('autoplay') !== null));
                config.loop         = (config.loop || (plyr.media.getAttribute('loop') !== null));
            }
        
            // Check for full support
            plyr.supported = api.supported(plyr.type);

            // If no native support, bail
            if (!plyr.supported.basic) {
                return false;
            }

            // Debug info
            _log(plyr.browser.name + ' ' + plyr.browser.version);

            // Setup media
            _setupMedia();

            // Setup interface
            if (plyr.type == 'video' || plyr.type == 'audio') {
                // Bail if no support
                if (!plyr.supported.full) {
                    // Successful setup
                    plyr.init = true;

                    // Don't inject controls if no full support
                    return;
                }

                // Setup UI
                _setupInterface();

                // Display duration if available
                if (config.displayDuration) {
                    _displayDuration();
                }

                // Set up aria-label for Play button with the title option
                _setupPlayAria();
            }

            // Successful setup
            plyr.init = true;
        }

        function _setupInterface() {
            // Inject custom controls
            _injectControls();

            // Find the elements
            if (!_findElements()) {
                return false;
            }

            // Captions
            _setupCaptions();

            // Media updated
            _mediaUpdated();

            // Set volume
            _setVolume();
            _updateVolume();
        }

        function _mediaUpdated() {
            // Setup fullscreen
            _setupFullscreen();

            // Listeners
            _listeners();
        }

        // Initialize instance 
        _init();

        // If init failed, return an empty object
        if (!plyr.init) {
            return {};
        }

        return {
            media:              plyr.media,
            play:               _play,
            pause:              _pause,
            restart:            _seek,
            rewind:             _rewind,
            forward:            _forward,
            seek:               _seek,
            source:             _updateSource,
            poster:             _updatePoster,
            setVolume:          _setVolume,
            togglePlay:         _togglePlay,
            toggleMute:         _toggleMute,
            toggleCaptions:     _toggleCaptions,
            toggleFullscreen:   _toggleFullscreen,
            isFullscreen:       function() { return plyr.isFullscreen || false; },
            support:            function(mimeType) { return _supportMime(plyr, mimeType); },
            destroy:            _destroy,
            restore:            _init
        };
    }

    // Check for support 
    api.supported = function(type) {
        var browser = _browserSniff(),
            oldIE   = (browser.name === 'IE' && browser.version <= 9),
            iPhone  = /iPhone|iPod/i.test(navigator.userAgent),
            audio   = !!document.createElement('audio').canPlayType,
            video   = !!document.createElement('video').canPlayType,
            basic, full;

        switch (type) {
            case 'video': 
                basic = video;
                full  = (basic && (!oldIE && !iPhone));
                break;

            case 'audio': 
                basic = audio;
                full  = (basic && !oldIE);
                break;

            case 'vimeo': 
            case 'youtube': 
                basic = true;
                full  = (!oldIE && !iPhone);
                break;

            default:
                basic = (audio && video);
                full  = (basic && !oldIE);
        }

        return {
            basic:  basic,
            full:   full
        };
    };

    // Expose setup function
    api.setup = function(elements, options) {
        // Get the players 
        var instances = [];

        // Select the elements
        // Assume elements is a NodeList by default
        if (typeof elements === 'string') {
            elements = document.querySelectorAll(elements);
        }
        // Single HTMLElement passed
        else if (elements instanceof HTMLElement) {
            elements = [elements];
        }
        // No selector passed, possibly options as first argument
        else if (!(elements instanceof NodeList) && typeof elements !== 'string')  {
            // If options are the first argument
            if (typeof options === 'undefined' && typeof elements === 'object') {
                options = elements;
            }

            // Use default selector
            elements = document.querySelectorAll(defaults.selectors.container);
        }

        // Extend the default options with user specified
        config = _extend(defaults, options);

        // Bail if disabled or no basic support
        // You may want to disable certain UAs etc
        if (!config.enabled || !api.supported().basic) {
            return false;
        }

        // Create a player instance for each element
        for (var i = elements.length - 1; i >= 0; i--) {
            // Get the current element
            var element = elements[i];

            // Setup a player instance and add to the element
            if (typeof element.plyr === 'undefined') {
                // Create new instance
                var instance = new Plyr(element);

                // Set plyr to false if setup failed
                element.plyr = (Object.keys(instance).length ? instance : false);

                // Callback
                if (typeof config.onSetup === 'function') {
                    config.onSetup.apply(element.plyr);
                }
            }

            // Add to return array even if it's already setup
            instances.push(element.plyr);
        }

        return instances;
    };

}(this.plyr = this.plyr || {}));
