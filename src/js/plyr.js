// ==========================================================================
// Plyr
// plyr.js v1.6.1
// https://github.com/selz/plyr
// License: The MIT License (MIT)
// ==========================================================================
// Credits: http://paypal.github.io/accessible-html5-video-player/
// ==========================================================================

;(function(root, factory) {
    'use strict';
    /*global define,module*/

    if (typeof module === 'object' && typeof module.exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(root, document);
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(null, function() { factory(root, document) });
    } else {
        // Browser globals (root is window)
        root.plyr = factory(root, document);
    }
}(typeof window !== 'undefined' ? window : this, function(window, document) {
    'use strict';
    /*global YT,$f*/

    // Globals
    var fullscreen, api = {};

    // Default config
    var defaults = {
        enabled:                true,
        debug:                  false,
        autoplay:               false,
        loop:                   false,
        seekTime:               10,
        volume:                 5,
        duration:               null,
        displayDuration:        true,
        iconPrefix:             'icon',
        iconUrl:                '',
        clickToPlay:            true,
        hideControls:           true,
        tooltips: {
            controls:           false,
            seek:               true
        },
        selectors: {
            container:          '.plyr',
            controls: {
                container:      null,
                wrapper:        '.plyr__controls'
            },
            labels:             '[data-plyr]',
            buttons: {
                seek:           '[data-plyr="seek"]',
                play:           '[data-plyr="play"]',
                pause:          '[data-plyr="pause"]',
                restart:        '[data-plyr="restart"]',
                rewind:         '[data-plyr="rewind"]',
                forward:        '[data-plyr="fast-forward"]',
                mute:           '[data-plyr="mute"]',
                captions:       '[data-plyr="captions"]',
                fullscreen:     '[data-plyr="fullscreen"]'
            },
            volume: {
                input:          '[data-plyr="volume"]',
                display:        '.plyr__volume--display'
            },
            progress: {
                container:      '.plyr__progress',
                buffer:         '.plyr__progress--buffer',
                played:         '.plyr__progress--played'
            },
            captions:           '.plyr__captions',
            currentTime:        '.plyr__time--current',
            duration:           '.plyr__time--duration'
        },
        classes: {
            videoWrapper:       'plyr__video-wrapper',
            embedWrapper:       'plyr__video-embed',
            type:               'plyr--{0}',
            stopped:            'plyr--stopped',
            playing:            'plyr--playing',
            muted:              'plyr--muted',
            loading:            'plyr--loading',
            hover:              'plyr--hover',
            tooltip:            'plyr__tooltip',
            hidden:             'plyr__sr-only',
            hideControls:       'plyr--hide-controls',
            isIos:              'plyr--is-ios',
            isTouch:            'plyr--is-touch',
            captions: {
                enabled:        'plyr--captions-enabled',
                active:         'plyr--captions-active'
            },
            fullscreen: {
                enabled:        'plyr--fullscreen-enabled',
                active:         'plyr--fullscreen-active'
            },
            tabFocus:           'tab-focus'
        },
        captions: {
            defaultActive:      false
        },
        fullscreen: {
            enabled:            true,
            fallback:           true,
            allowAudio:         false
        },
        storage: {
            enabled:            true,
            key:                'plyr'
        },
        controls:               ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'fullscreen'],
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
            toggleFullscreen:   'Toggle Fullscreen',
            frameTitle:         'Player for {title}'
        },
        types: {
            embed:              ['youtube', 'vimeo'],
            html5:              ['video', 'audio']
        },
        // URLs
        urls: {
            vimeo: {
                api:            'https://cdn.plyr.io/froogaloop/1.0.1/plyr.froogaloop.js',
            },
            youtube: {
                api:            'https://www.youtube.com/iframe_api'
            }
        },
        // Custom control listeners
        listeners: {
            seek:               null,
            play:               null,
            pause:              null,
            restart:            null,
            rewind:             null,
            forward:            null,
            mute:               null,
            volume:             null,
            captions:           null,
            fullscreen:         null
        },
        // Events to watch on HTML5 media elements
        events:                 ['ended', 'progress', 'stalled', 'playing', 'waiting', 'canplay', 'canplaythrough', 'loadstart', 'loadeddata', 'loadedmetadata', 'timeupdate', 'volumechange', 'play', 'pause', 'error', 'seeking', 'emptied']
    };

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
            ios:        /(iPad|iPhone|iPod)/g.test(navigator.platform),
            touch:      'ontouchstart' in document.documentElement
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
        if(!element) {
            return;
        }
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
    function _toggleClass(element, className, state) {
        if (element) {
            if (element.classList) {
                element.classList[state ? 'add' : 'remove'](className);
            }
            else {
                var name = (' ' + element.className + ' ').replace(/\s+/g, ' ').replace(' ' + className + ' ', '');
                element.className = name + (state ? ' ' + className : '');
            }
        }
    }

    // Has class name
    function _hasClass(element, className) {
        if (element) {
            if (element.classList) {
                return element.classList.contains(className);
            }
            else {
                return new RegExp('(\\s|^)' + className + '(\\s|$)').test(element.className);
            }
        }
        return false;
    }

    // Bind event
    function _on(element, events, callback, useCapture) {
        if (element) {
            _toggleListener(element, events, callback, true, useCapture);
        }
    }

    // Unbind event
    function _off(element, events, callback, useCapture) {
        if (element) {
            _toggleListener(element, events, callback, false, useCapture);
        }
    }

    // Bind along with custom handler
    function _proxyListener(element, eventName, userListener, defaultListener, useCapture) {
        _on(element, eventName, function(event) {
            if(userListener) {
                userListener.apply(element, [event]);
            }
            defaultListener.apply(element, [event]);
        }, useCapture);
    }

    // Toggle event listener
    function _toggleListener(element, events, callback, toggle, useCapture) {
        var eventList = events.split(' ');

        // Whether the listener is a capturing listener or not
        // Default to false
        if(typeof useCapture !== 'boolean') {
            useCapture = false;
        }

        // If a nodelist is passed, call itself on each node
        if (element instanceof NodeList) {
            for (var x = 0; x < element.length; x++) {
                if (element[x] instanceof Node) {
                    _toggleListener(element[x], arguments[1], arguments[2], arguments[3]);
                }
            }
            return;
        }

        // If a single node is passed, bind the event listener
        for (var i = 0; i < eventList.length; i++) {
            element[toggle ? 'addEventListener' : 'removeEventListener'](eventList[i], callback, useCapture);
        }
    }

    // Trigger event
    function _triggerEvent(element, eventName, properties) {
        // Bail if no element
        if(!element || !eventName) {
            return;
        }

        // create and dispatch the event
        var event = new CustomEvent(eventName, properties);

        // Dispatch the event
        element.dispatchEvent(event);
    }

    // Toggle aria-pressed state on a toggle button
    // http://www.ssbbartgroup.com/blog/how-not-to-misuse-aria-states-properties-and-roles
    function _toggleState(target, state) {
        // Bail if no target
        if(!target) {
            return;
        }

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

    // Deep extend/merge destination object with N more objects
    // http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
    // Removed call to arguments.callee (used explicit function name instead)
    function _extend() {
        // Get arguments
        var objects = arguments;

        // Bail if nothing to merge
        if(!objects.length) {
            return;
        }

        // Return first if specified but nothing to merge
        if(objects.lenth == 1) {
            return objects[0];
        }

        // First object is the destination
        var destination = Array.prototype.shift.call(objects),
            length      = objects.length;

        // Loop through all objects to merge
        for (var i = 0; i < length; i++) {
            var source = objects[i];

            for (var property in source) {
                if (source[property] && source[property].constructor && source[property].constructor === Object) {
                    destination[property] = destination[property] || {};
                    _extend(destination[property], source[property]);
                }
                else {
                    destination[property] = source[property];
                }
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
                if(!('localStorage' in window)) {
                    return false;
                }

                // Try to use it (it might be disabled, e.g. user is in private/porn mode)
                // see: https://github.com/Selz/plyr/issues/131
                try {
                    // Add test item
                    window.localStorage.setItem('___test', 'OK');

                    // Get the test item
                    var result = window.localStorage.getItem('___test');

                    // Clean up
                    window.localStorage.removeItem('___test');

                    // Check if value matches
                    return (result === 'OK');
                }
                catch (e) {
                    return false;
                }

                return false;
            })()
        };
        return storage;
    }

    // Player instance
    function Plyr(container, config) {
        var plyr = this;
        plyr.container = container;
        plyr.timers = {};

        // Log config options
        _log(config);

        // Debugging
        function _log(text, warn) {
            if (config.debug && window.console) {
                console[(warn ? 'warn' : 'log')](text);
            }
        }

        // Build the default HTML
        function _buildControls() {
            // Create html array
            var html = [],
                iconPath = config.iconUrl + '#' + config.iconPrefix;

            // Larger overlaid play button
            if (_inArray(config.controls, 'play-large')) {
                html.push(
                    '<button type="button" data-plyr="play" class="plyr__play-large">',
                        '<svg><use xlink:href="' + iconPath + '-play" /></svg>',
                        '<span class="plyr__sr-only">' + config.i18n.play + '</span>',
                    '</button>'
                );
            }

            html.push('<div class="plyr__controls">');

            // Restart button
            if (_inArray(config.controls, 'restart')) {
                html.push(
                    '<button type="button" data-plyr="restart">',
                        '<svg><use xlink:href="' + iconPath + '-restart" /></svg>',
                        '<span class="plyr__sr-only">' + config.i18n.restart + '</span>',
                    '</button>'
                );
            }

            // Rewind button
            if (_inArray(config.controls, 'rewind')) {
                html.push(
                    '<button type="button" data-plyr="rewind">',
                        '<svg><use xlink:href="' + iconPath + '-rewind" /></svg>',
                        '<span class="plyr__sr-only">' + config.i18n.rewind + '</span>',
                    '</button>'
                );
            }

            // Play Pause button
            // TODO: This should be a toggle button really?
            if (_inArray(config.controls, 'play')) {
                html.push(
                    '<button type="button" data-plyr="play">',
                        '<svg><use xlink:href="' + iconPath + '-play" /></svg>',
                        '<span class="plyr__sr-only">' + config.i18n.play + '</span>',
                    '</button>',
                    '<button type="button" data-plyr="pause">',
                        '<svg><use xlink:href="' + iconPath + '-pause" /></svg>',
                        '<span class="plyr__sr-only">' + config.i18n.pause + '</span>',
                    '</button>'
                );
            }

            // Fast forward button
            if (_inArray(config.controls, 'fast-forward')) {
                html.push(
                    '<button type="button" data-plyr="fast-forward">',
                        '<svg><use xlink:href="' + iconPath + '-fast-forward" /></svg>',
                        '<span class="plyr__sr-only">' + config.i18n.forward + '</span>',
                    '</button>'
                );
            }

            // Progress
            if (_inArray(config.controls, 'progress')) {
                // Create progress
                html.push('<span class="plyr__progress">',
                    '<label for="seek{id}" class="plyr__sr-only">Seek</label>',
                    '<input id="seek{id}" class="plyr__progress--seek" type="range" min="0" max="100" step="0.1" value="0" data-plyr="seek">',
                    '<progress class="plyr__progress--played" max="100" value="0" role="presentation"></progress>',
                    '<progress class="plyr__progress--buffer" max="100" value="0">',
                        '<span>0</span>% ' + config.i18n.buffered,
                    '</progress>');

                // Seek tooltip
                if (config.tooltips.seek) {
                    html.push('<span class="plyr__tooltip">00:00</span>');
                }

                // Close
                html.push('</span>');
            }

            // Media current time display
            if (_inArray(config.controls, 'current-time')) {
                html.push(
                    '<span class="plyr__time">',
                        '<span class="plyr__sr-only">' + config.i18n.currentTime + '</span>',
                        '<span class="plyr__time--current">00:00</span>',
                    '</span>'
                );
            }

            // Media duration display
            if (_inArray(config.controls, 'duration')) {
                html.push(
                    '<span class="plyr__time">',
                        '<span class="plyr__sr-only">' + config.i18n.duration + '</span>',
                        '<span class="plyr__time--duration">00:00</span>',
                    '</span>'
                );
            }

            // Toggle mute button
            if (_inArray(config.controls, 'mute')) {
                html.push(
                    '<button type="button" data-plyr="mute">',
                        '<svg class="icon--muted"><use xlink:href="' + iconPath + '-muted" /></svg>',
                        '<svg><use xlink:href="' + iconPath + '-volume" /></svg>',
                        '<span class="plyr__sr-only">' + config.i18n.toggleMute + '</span>',
                    '</button>'
                );
            }

            // Volume range control
            if (_inArray(config.controls, 'volume')) {
                html.push(
                    '<span class="plyr__volume">',
                        '<label for="volume{id}" class="plyr__sr-only">' + config.i18n.volume + '</label>',
                        '<input id="volume{id}" class="plyr__volume--input" type="range" min="0" max="10" value="5" data-plyr="volume">',
                        '<progress class="plyr__volume--display" max="10" value="0" role="presentation"></progress>',
                    '</span>'
                );
            }

            // Toggle captions button
            if (_inArray(config.controls, 'captions')) {
                html.push(
                    '<button type="button" data-plyr="captions">',
                        '<svg class="icon--captions-on"><use xlink:href="' + iconPath + '-captions-on" /></svg>',
                        '<svg><use xlink:href="' + iconPath+ '-captions-off" /></svg>',
                        '<span class="plyr__sr-only">' + config.i18n.toggleCaptions + '</span>',
                    '</button>'
                );
            }

            // Toggle fullscreen button
            if (_inArray(config.controls, 'fullscreen')) {
                html.push(
                    '<button type="button" data-plyr="fullscreen">',
                        '<svg class="icon--exit-fullscreen"><use xlink:href="' + iconPath + '-exit-fullscreen" /></svg>',
                        '<svg><use xlink:href="' + iconPath + '-enter-fullscreen" /></svg>',
                        '<span class="plyr__sr-only">' + config.i18n.toggleFullscreen + '</span>',
                    '</button>'
                );
            }

            // Close everything
            html.push('</div>');

            return html.join('');
        }

        // Setup fullscreen
        function _setupFullscreen() {
            if (!plyr.supported.full) {
                return;
            }

            if ((plyr.type != 'audio' || config.fullscreen.allowAudio) && config.fullscreen.enabled) {
                // Check for native support
                var nativeSupport = fullscreen.supportsFullScreen;

                if (nativeSupport || (config.fullscreen.fallback && !_inFrame())) {
                    _log((nativeSupport ? 'Native' : 'Fallback') + ' fullscreen enabled');

                    // Add styling hook
                    _toggleClass(plyr.container, config.classes.fullscreen.enabled, true);
                }
                else {
                    _log('Fullscreen not supported and fallback disabled');
                }

                // Toggle state
                _toggleState(plyr.buttons.fullscreen, false);

                // Setup focus trap
                _focusTrap();
            }
        }

        // Setup captions
        function _setupCaptions() {
            if (plyr.type !== 'video') {
                return;
            }

            // Inject the container
            if (!_getElement(config.selectors.captions)) {
                plyr.videoContainer.insertAdjacentHTML('afterbegin', '<div class="' + _getClassname(config.selectors.captions) + '"></div>');
            }

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
                _log('No caption track found');
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
                // Firefox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1033144
                if ((plyr.browser.name === 'IE' && plyr.browser.version >= 10) ||
                    (plyr.browser.name === 'Firefox' && plyr.browser.version >= 31)) {

                    // Debugging
                    _log('Detected browser with known TextTrack issues - using manual fallback');

                    // Set to false so skips to 'manual' captioning
                    plyr.usingTextTracks = false;
                }

                // Rendering caption tracks
                // Native support required - http://caniuse.com/webvtt
                if (plyr.usingTextTracks) {
                    _log('TextTracks supported');

                    for (var y = 0; y < tracks.length; y++) {
                        var track = tracks[y];

                        if (track.kind === 'captions' || track.kind === 'subtitles') {
                            _on(track, 'cuechange', function() {
                                // Display a cue, if there is one
                                if (this.activeCues[0] && 'text' in this.activeCues[0]) {
                                    _setCaption(this.activeCues[0].getCueAsHTML());
                                }
                                else {
                                    _setCaption();
                                }
                            });
                        }
                    }
                }
                // Caption tracks not natively supported
                else {
                    _log('TextTracks not supported so rendering captions manually');

                    // Render captions from array at appropriate time
                    plyr.currentCaption = '';
                    plyr.captions = [];

                    if (captionSrc !== '') {
                        // Create XMLHttpRequest Object
                        var xhr = new XMLHttpRequest();

                        xhr.onreadystatechange = function() {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    var captions = [],
                                        caption,
                                        req = xhr.responseText;

                                    captions = req.split('\n\n');

                                    for (var r = 0; r < captions.length; r++) {
                                        caption = captions[r];
                                        plyr.captions[r] = [];

                                        // Get the parts of the captions
                                        var parts = caption.split('\n'),
                                            index = 0;

                                        // Incase caption numbers are added
                                        if(parts[index].indexOf(":") === -1) {
                                            index = 1;
                                        }

                                        plyr.captions[r] = [parts[index], parts[index + 1]];
                                    }

                                    // Remove first element ('VTT')
                                    plyr.captions.shift();

                                    _log('Successfully loaded the caption file via AJAX');
                                }
                                else {
                                    _log('There was a problem loading the caption file via AJAX', true);
                                }
                            }
                        };

                        xhr.open('get', captionSrc, true);

                        xhr.send();
                    }
                }
            }
        }

        // Set the current caption
        function _setCaption(caption) {
            var container = _getElement(config.selectors.captions),
                content = document.createElement('span');

            // Empty the container
            container.innerHTML = '';

            // Default to empty
            if(typeof caption === 'undefined') {
                caption = '';
            }

            // Set the span content
            if(typeof caption === 'string') {
                content.innerHTML = caption.trim();
            }
            else {
                content.appendChild(caption);
            }

            // Set new caption text
            container.appendChild(content);

            // Force redraw
            var redraw = container.offsetHeight;
        }

        // Captions functions
        // Seek the manual caption time and update UI
        function _seekManualCaptions(time) {
            // Utilities for caption time codes
            function _timecodeCommon(tc, pos) {
                var tcpair = [];
                tcpair = tc.split(' --> ');
                for(var i = 0; i < tcpair.length; i++) {
                    // WebVTT allows for extra meta data after the timestamp line
                    // So get rid of this if it exists
                    tcpair[i] = tcpair[i].replace(/(\d+:\d+:\d+\.\d+).*/, "$1");
                }
                return _subTcSecs(tcpair[pos]);
            }
            function _timecodeMin(tc) {
                return _timecodeCommon(tc, 0);
            }
            function _timecodeMax(tc) {
                return _timecodeCommon(tc, 1);
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

                // Render the caption
                _setCaption(plyr.currentCaption);
            }
            else {
                _setCaption();
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

        // Trap focus inside container
        function _focusTrap() {
            var tabbables   = _getElements('input:not([disabled]), button:not([disabled])'),
                first       = tabbables[0],
                last        = tabbables[tabbables.length - 1];

            function _checkFocus(event) {
                // If it is TAB
                if (event.which === 9 && plyr.isFullscreen) {
                    // Move focus to first element that can be tabbed if Shift isn't used
                    if (event.target === last && !event.shiftKey) {
                        event.preventDefault();
                        first.focus();
                    }
                    // Move focus to last element that can be tabbed if Shift is used
                    else if (event.target === first && event.shiftKey) {
                        event.preventDefault();
                        last.focus();
                    }
                }
            }

            // Bind the handler
            _on(plyr.container, 'keydown', _checkFocus);
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

        // Insert controls
        function _injectControls() {
            // Make a copy of the html
            var html = config.html;

            // Insert custom video controls
            _log('Injecting custom controls');

            // If no controls are specified, create default
            if (!html) {
                html = _buildControls();
            }

            // Replace seek time instances
            html = _replaceAll(html, '{seektime}', config.seekTime);

            // Replace all id references with random numbers
            html = _replaceAll(html, '{id}', Math.floor(Math.random() * (10000)));

            // Controls container
            var container;

            // Inject to custom location
            if (config.selectors.controls.container !== null) {
                container = config.selectors.controls.container;

                if(typeof selector === 'string') {
                    container = document.querySelector(container);
                }
            }

            // Inject into the container by default
            if (!(container instanceof HTMLElement)) {
                container = plyr.container
            }

            // Inject controls HTML
            container.insertAdjacentHTML('beforeend', html);

            // Setup tooltips
            if (config.tooltips.controls) {
                var labels = _getElements([config.selectors.controls.wrapper, ' ', config.selectors.labels, ' .', config.classes.hidden].join(''));

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
                plyr.controls                 = _getElement(config.selectors.controls.wrapper);

                // Buttons
                plyr.buttons = {};
                plyr.buttons.seek             = _getElement(config.selectors.buttons.seek);
                plyr.buttons.play             = _getElements(config.selectors.buttons.play);
                plyr.buttons.pause            = _getElement(config.selectors.buttons.pause);
                plyr.buttons.restart          = _getElement(config.selectors.buttons.restart);
                plyr.buttons.rewind           = _getElement(config.selectors.buttons.rewind);
                plyr.buttons.forward          = _getElement(config.selectors.buttons.forward);
                plyr.buttons.fullscreen       = _getElement(config.selectors.buttons.fullscreen);

                // Inputs
                plyr.buttons.mute             = _getElement(config.selectors.buttons.mute);
                plyr.buttons.captions         = _getElement(config.selectors.buttons.captions);

                // Progress
                plyr.progress = {};
                plyr.progress.container       = _getElement(config.selectors.progress.container);

                // Progress - Buffering
                plyr.progress.buffer          = {};
                plyr.progress.buffer.bar      = _getElement(config.selectors.progress.buffer);
                plyr.progress.buffer.text     = plyr.progress.buffer.bar && plyr.progress.buffer.bar.getElementsByTagName('span')[0];

                // Progress - Played
                plyr.progress.played          = _getElement(config.selectors.progress.played);

                // Seek tooltip
                plyr.progress.tooltip         = plyr.progress.container && plyr.progress.container.querySelector('.' + config.classes.tooltip);

                // Volume
                plyr.volume                   = {};
                plyr.volume.input             = _getElement(config.selectors.volume.input);
                plyr.volume.display           = _getElement(config.selectors.volume.display);

                // Timing
                plyr.duration                 = _getElement(config.selectors.duration);
                plyr.currentTime              = _getElement(config.selectors.currentTime);
                plyr.seekTime                 = _getElements(config.selectors.seekTime);

                return true;
            }
            catch(e) {
                _log('It looks like there is a problem with your controls html', true);

                // Restore native video controls
                _toggleNativeControls(true);

                return false;
            }
        }

        // Toggle style hook
        function _toggleStyleHook() {
            _toggleClass(plyr.container, config.selectors.container.replace('.', ''), plyr.supported.full);
        }

        // Toggle native controls
        function _toggleNativeControls(toggle) {
            if(toggle) {
                plyr.media.setAttribute('controls', '');
            }
            else {
                plyr.media.removeAttribute('controls');
            }
        }

        // Setup aria attribute for play and iframe title
        function _setTitle(iframe) {
            // Find the current text
            var label = config.i18n.play;

            // If there's a media title set, use that for the label
            if (typeof(config.title) !== 'undefined' && config.title.length) {
                label += ', ' + config.title;
            }

            // If there's a play button, set label
            if (plyr.supported.full && plyr.buttons.play) {
                for (var i = plyr.buttons.play.length - 1; i >= 0; i--) {
                    plyr.buttons.play[i].setAttribute('aria-label', label);
                }
            }

            // Set iframe title
            // https://github.com/Selz/plyr/issues/124
            if (iframe instanceof HTMLElement) {
                iframe.setAttribute('title', config.i18n.frameTitle.replace('{title}', config.title));
            }
        }

        // Setup media
        function _setupMedia() {
            // If there's no media, bail
            if (!plyr.media) {
                _log('No audio or video element found', true);
                return false;
            }

            if (plyr.supported.full) {
                // Add type class
                _toggleClass(plyr.container, config.classes.type.replace('{0}', plyr.type), true);

                // Add video class for embeds
                // This will require changes if audio embeds are added
                if (_inArray(config.types.embed, plyr.type)) {
                    _toggleClass(plyr.container, config.classes.type.replace('{0}', 'video'), true);
                }

                // If there's no autoplay attribute, assume the video is stopped and add state class
                _toggleClass(plyr.container, config.classes.stopped, config.autoplay);

                // Add iOS class
                _toggleClass(plyr.container, config.classes.isIos, plyr.browser.ios);

                // Add touch class
                _toggleClass(plyr.container, config.classes.isTouch, plyr.browser.touch);

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
                _setupEmbed();

                // Clean up
                plyr.embedId = null;
            }
        }

        // Setup YouTube/Vimeo
        function _setupEmbed() {
            var container = document.createElement('div'),
                videoId = plyr.embedId,
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
                    window.onYouTubeReadyCallbacks = window.onYouTubeReadyCallbacks || [];

                    // Add to queue
                    window.onYouTubeReadyCallbacks.push(function() { _youTubeReady(videoId, container) });

                    // Set callback to process queue
                    window.onYouTubeIframeAPIReady = function () {
                        window.onYouTubeReadyCallbacks.forEach(function(callback) { callback(); });
                    };
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

                // If full support, we can use custom controls (hiding Vimeos), if not, use Vimeo
                if(plyr.supported.full) {
                    container.appendChild(iframe);
                    plyr.media.appendChild(container);
                }
                else {
                    plyr.media.appendChild(iframe);
                }

                // Load the API
                if (!('$f' in window)) {
                    _injectScript(config.urls.vimeo.api);
                }

                // Wait for fragaloop load
                var timer = window.setInterval(function() {
                    if ('$f' in window && iframe.loaded) {
                        window.clearInterval(timer);
                        _vimeoReady.call(iframe);
                    }
                }, 50);
            }
        }

        // When embeds are ready
        function _embedReady() {
            // Store reference to API
            plyr.container.plyr.embed = plyr.embed;

            // Setup the UI
            _setupInterface();

            // Set title
            _setTitle(_getElement('iframe'));
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
                    disablekb: 1,
                    origin: '*' // https://code.google.com/p/gdata-issues/issues/detail?id=5788#c45
                },
                events: {
                    'onReady': function(event) {
                        // Get the instance
                        var instance = event.target;

                        // Create a faux HTML5 API using the YouTube API
                        plyr.media.play = function() {
                            instance.playVideo();
                            plyr.media.paused = false;
                        };
                        plyr.media.pause = function() {
                            instance.pauseVideo();
                            plyr.media.paused = true;
                        };
                        plyr.media.stop = function() {
                            instance.stopVideo();
                            plyr.media.paused = true;
                        };
                        plyr.media.duration = instance.getDuration();
                        plyr.media.paused = true;
                        plyr.media.currentTime = instance.getCurrentTime();
                        plyr.media.muted = instance.isMuted();

                        // Set title
                        config.title = instance.getVideoData().title;

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

                                // Trigger event
                                _triggerEvent(plyr.media, 'canplaythrough');
                            }
                        }, 200);

                        // Update UI
                        _embedReady();

                        // Display duration if available
                        _displayDuration();
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
                                plyr.media.seeking = false;
                                _triggerEvent(plyr.media, 'play');
                                _triggerEvent(plyr.media, 'playing');

                                // Poll to get playback progress
                                plyr.timer.playing = window.setInterval(function() {
                                    // Set the current time
                                    plyr.media.currentTime = instance.getCurrentTime();

                                    // Trigger timeupdate
                                    _triggerEvent(plyr.media, 'timeupdate');
                                }, 100);

                                break;

                            case 2:
                                plyr.media.paused = true;
                                _triggerEvent(plyr.media, 'pause');
                                break;
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
                plyr.media.play = function() {
                    plyr.embed.api('play');
                    plyr.media.paused = false;
                };
                plyr.media.pause = function() {
                    plyr.embed.api('pause');
                    plyr.media.paused = true;
                };
                plyr.media.stop = function() {
                    plyr.embed.api('stop');
                    plyr.media.paused = true;
                };
                plyr.media.paused = true;
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
                    _displayDuration();
                });

                plyr.embed.addEvent('play', function() {
                    plyr.media.paused = false;
                    _triggerEvent(plyr.media, 'play');
                    _triggerEvent(plyr.media, 'playing');
                });

                plyr.embed.addEvent('pause', function() {
                    plyr.media.paused = true;
                    _triggerEvent(plyr.media, 'pause');
                });

                plyr.embed.addEvent('playProgress', function(data) {
                    plyr.media.seeking = false;
                    plyr.media.currentTime = data.seconds;
                    _triggerEvent(plyr.media, 'timeupdate');
                });

                plyr.embed.addEvent('loadProgress', function(data) {
                    plyr.media.buffered = data.percent;
                    _triggerEvent(plyr.media, 'progress');

                    if(parseInt(data.percent) === 1) {
                        // Trigger event
                        _triggerEvent(plyr.media, 'canplaythrough');
                    }
                });

                plyr.embed.addEvent('finish', function() {
                    plyr.media.paused = true;
                    _triggerEvent(plyr.media, 'ended');
                });

                // Always seek to 0
                // plyr.embed.api('seekTo', 0);

                // Autoplay
                if (config.autoplay) {
                    plyr.embed.api('play');
                }
            });
        }

        // Play media
        function _play() {
            if('play' in plyr.media) {
                plyr.media.play();
            }
        }

        // Pause media
        function _pause() {
            if('pause' in plyr.media) {
                plyr.media.pause();
            }
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
                paused = plyr.media.paused,
                duration = _getDuration();

            // Explicit position
            if (typeof input === 'number') {
                targetTime = input;
            }
            // Event
            else if (typeof input === 'object' && (input.type === 'input' || input.type === 'change')) {
                // It's the seek slider
                // Seek to the selected time
                targetTime = ((input.target.value / input.target.max) * duration);
            }

            // Normalise targetTime
            if (targetTime < 0) {
                targetTime = 0;
            }
            else if (targetTime > duration) {
                targetTime = duration;
            }

            // Update progress 
            if(plyr.progress && plyr.progress.played) {
                plyr.progress.played.value = ((100 / duration) * targetTime);
            }

            // Set the current time
            // Try/catch incase the media isn't set and we're calling seek() from source() and IE moans
            try {
                plyr.media.currentTime = targetTime.toFixed(1);
            }
            catch(e) {}

            // Embeds
            if(_inArray(config.types.embed, plyr.type)) {
                // YouTube
                switch(plyr.type) {
                    case 'youtube':
                        plyr.embed.seekTo(targetTime);
                        break;

                    case 'vimeo':
                        // Round to nearest second for vimeo
                        plyr.embed.api('seekTo', targetTime.toFixed(0));
                        break;
                }

                if (paused) {
                    _pause();
                }

                // Trigger timeupdate for embeds
                _triggerEvent(plyr.media, 'timeupdate');

                // Set seeking flag
                plyr.media.seeking = true;
            }

            // Logging
            _log('Seeking to ' + plyr.media.currentTime + ' seconds');

            // Special handling for 'manual' captions
            _seekManualCaptions(targetTime);
        }

        // Get the duration (or custom if set)
        function _getDuration() {
            // It should be a number, but parse it just incase
            var duration = parseInt(config.duration);

            // If custom duration is funky, use regular duration
            return (isNaN(duration) ? plyr.media.duration : duration);
        }

        // Check playing state
        function _checkPlaying() {
            _toggleClass(plyr.container, config.classes.playing, !plyr.media.paused);
            _toggleClass(plyr.container, config.classes.stopped, plyr.media.paused);

            _toggleControls(plyr.media.paused);
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

            // Trap focus
            if(plyr.isFullscreen) {
                plyr.container.setAttribute('tabindex', '-1');
            }
            else {
                plyr.container.removeAttribute('tabindex');
            }

            // Trap focus
            _focusTrap(plyr.isFullscreen);

            // Set button state
            _toggleState(plyr.buttons.fullscreen, plyr.isFullscreen);

            // Trigger an event
            _triggerEvent(plyr.container, plyr.isFullscreen ? 'enterfullscreen' : 'exitfullscreen');
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

            // If volume is 0 after unmuting, set to default
            if(plyr.media.volume === 0) {
                _setVolume(config.volume);
            }

            // Embeds
            if(_inArray(config.types.embed, plyr.type)) {
                // YouTube
                switch(plyr.type) {
                    case 'youtube':
                        plyr.embed[plyr.media.muted ? 'mute' : 'unMute']();
                        break;

                    case 'vimeo':
                        plyr.embed.api('setVolume', plyr.media.muted ? 0 : parseFloat(config.volume / 10));
                        break;
                }

                // Trigger volumechange for embeds
                _triggerEvent(plyr.media, 'volumechange');
            }
        }

        // Set volume
        function _setVolume(volume) {
            // Use default if no value specified
            if (typeof volume === 'undefined') {
                volume = config.volume;

                if (config.storage.enabled && _storage().supported) {
                    volume = window.localStorage.getItem(config.storage.key);

                    // Clean up old volume
                    // https://github.com/Selz/plyr/issues/171
                    window.localStorage.removeItem('plyr-volume');
                }
            }

            // Use config if all else fails
            if(volume === null || isNaN(volume)) {
                volume = config.volume;
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

            // Set the display
            if (plyr.volume.display) {
                plyr.volume.display.value = volume;
            }

            // Embeds
            if(_inArray(config.types.embed, plyr.type)) {
                // YouTube
                switch(plyr.type) {
                    case 'youtube':
                        plyr.embed.setVolume(plyr.media.volume * 100);
                        break;

                    case 'vimeo':
                        plyr.embed.api('setVolume', plyr.media.volume);
                        break;
                }

                // Trigger volumechange for embeds
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
            if (plyr.supported.full) {
                if (plyr.volume.input) {
                    plyr.volume.input.value = volume;
                }
                if (plyr.volume.display) {
                    plyr.volume.display.value = volume;
                }
            }

            // Store the volume in storage
            if (config.storage.enabled && _storage().supported && !isNaN(volume)) {
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

            // Trigger an event
            _triggerEvent(plyr.container, plyr.captionsEnabled ? 'captionsenabled' : 'captionsdisabled');
        }

        // Check if media is loading
        function _checkLoading(event) {
            var loading = (event.type === 'waiting');

            // Clear timer
            clearTimeout(plyr.timers.loading);

            // Timer to prevent flicker when seeking
            plyr.timers.loading = setTimeout(function() {
                _toggleClass(plyr.container, config.classes.loading, loading);
            }, (loading ? 250 : 0));
        }

        // Update <progress> elements
        function _updateProgress(event) {
            var progress    = plyr.progress.played,
                text        = false,
                value       = 0,
                duration    = _getDuration();

            if (event) {
                switch (event.type) {
                    // Video playing
                    case 'timeupdate':
                    case 'seeking':
                        value = _getPercentage(plyr.media.currentTime, duration);

                        // Set seek range value only if it's a 'natural' time event
                        if (event.type == 'timeupdate' && plyr.buttons.seek) {
                            plyr.buttons.seek.value = value;
                        }

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
                                return _getPercentage(buffered.end(0), duration);
                            }
                            // YouTube returns between 0 and 1
                            else if (typeof buffered === 'number') {
                                return (buffered * 100);
                            }

                            return 0;
                        })();

                        break;
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
            var displayHours = (parseInt(((_getDuration() / 60) / 60) % 60) > 0);

            // Ensure it's two digits. For example, 03 rather than 3.
            plyr.secs = ('0' + plyr.secs).slice(-2);
            plyr.mins = ('0' + plyr.mins).slice(-2);

            // Render
            element.innerHTML = (displayHours ? plyr.hours + ':' : '') + plyr.mins + ':' + plyr.secs;
        }

        // Show the duration on metadataloaded
        function _displayDuration() {
            if (!plyr.supported.full) {
                return;
            }

            // Determine duration
            var duration = _getDuration() || 0;

            // If there's only one time display, display duration there
            if (!plyr.duration && config.displayDuration && plyr.media.paused) {
                _updateTimeDisplay(duration, plyr.currentTime);
            }

            // If there's a duration element, update content
            if (plyr.duration) {
                _updateTimeDisplay(duration, plyr.duration);
            }

            // Update the tooltip (if visible)
            _updateSeekTooltip();
        }

        // Handle time change event
        function _timeUpdate(event) {
            // Duration
            _updateTimeDisplay(plyr.media.currentTime, plyr.currentTime);

            // Ignore updates while seeking
            if(event && event.type == 'timeupdate' && plyr.media.seeking) {
                return;
            }

            // Playing progress
            _updateProgress(event);
        }

        // Update hover tooltip for seeking
        function _updateSeekTooltip(event) {
            // Bail if setting not true
            if (!config.tooltips.seek || plyr.browser.touch || !plyr.progress.container) {
                return;
            }

            // Calculate percentage
            var clientRect  = plyr.progress.container.getBoundingClientRect(),
                percent     = 0,
                visible     = config.classes.tooltip + '--visible';

            // Determine percentage, if already visible
            if (!event) {
                if(_hasClass(plyr.progress.tooltip, visible)) {
                    percent = plyr.progress.tooltip.style.left.replace('%', '');
                }
                else {
                    return;
                }
            }
            else {
                percent = ((100 / clientRect.width) * (event.pageX - clientRect.left));
            }

            // Set bounds
            if (percent < 0) {
                percent = 0;
            }
            else if (percent > 100) {
                percent = 100;
            }

            // Display the time a click would seek to
            _updateTimeDisplay(((_getDuration() / 100) * percent), plyr.progress.tooltip);

            // Set position
            plyr.progress.tooltip.style.left = percent + "%";

            // Show/hide the tooltip
            // If the event is a moues in/out and percentage is inside bounds
            if(event && _inArray(['mouseenter', 'mouseleave'], event.type)) {
                _toggleClass(plyr.progress.tooltip, visible, (event.type === 'mouseenter'));
            }
        }

        // Show the player controls in fullscreen mode
        function _toggleControls(toggle) {
            if (!config.hideControls || plyr.type === 'audio') {
                return;
            }
            var delay = 0,
                isEnterFullscreen = false,
                show = toggle;

            // Default to false if no boolean
            if(typeof toggle !== "boolean") {
                if(toggle && toggle.type) {
                    // Is the enter fullscreen event
                    isEnterFullscreen = (toggle.type === 'enterfullscreen');

                    // Whether to show controls
                    show = _inArray(['mousemove', 'mouseenter', 'focus'], toggle.type);

                    // Delay hiding on mousemove events
                    if (toggle.type === 'mousemove') {
                        delay = 2000;
                    }

                    // Delay a little more for keyboard users
                    if (toggle.type === 'focus') {
                        delay = 3000;
                    }
                }
                else {
                    show = false;
                }
            }

            // Clear timer every movement
            window.clearTimeout(plyr.timers.hover);

            // If the mouse is not over the controls, set a timeout to hide them
            if(show || plyr.media.paused) {
                _toggleClass(plyr.container, config.classes.hideControls, false);

                // Always show controls when paused
                if(plyr.media.paused) {
                    return;
                }
            }

            // If toggle is false or if we're playing (regardless of toggle), then
            // set the timer to hide the controls 
            if(!show || !plyr.media.paused) {
                plyr.timers.hover = window.setTimeout(function() {
                    // If the mouse is over the controls (and not entering fullscreen), bail
                    if(plyr.controls.active && !isEnterFullscreen) {
                        return;
                    }

                    _toggleClass(plyr.container, config.classes.hideControls, true);
                }, delay);
            }
        }

        // Add common function to retrieve media source
        function _source(source) {
            // If not null or undefined, parse it
            if(typeof source !== 'undefined') {
                _updateSource(source);
                return;
            }

            // Return the current source
            var url;
            switch(plyr.type) {
                case 'youtube':
                    url = plyr.embed.getVideoUrl();
                    break;

                case 'vimeo':
                    plyr.embed.api('getVideoUrl', function (value) {
                        url = value;
                    });
                    break;

                default:
                    url = plyr.media.currentSrc;
                    break;
            }

            return url || '';
        }

        // Update source
        // Sources are not checked for support so be careful
        function _updateSource(source) {
            if (typeof source === 'undefined' || !('sources' in source) || !source.sources.length) {
                _log('Invalid source format', true);
                return;
            }

            // Pause playback
            _pause();

            // Set seek input to 0
            if (plyr.buttons && plyr.buttons.seek) {
                plyr.buttons.seek.value = 0;
            }
            if (plyr.progress && plyr.progress.played) {
                plyr.progress.played.value = 0;
            }

            // Clean up YouTube stuff
            if (plyr.type === 'youtube') {
                // Destroy the embed instance
                plyr.embed.destroy();

                // Clear timer
                window.clearInterval(plyr.timer.buffering);
                window.clearInterval(plyr.timer.playing);
            }
            else if (plyr.type === 'video' && plyr.videoContainer) {
                // Remove video wrapper
                _remove(plyr.videoContainer);
            }

            // Remove embed object
            plyr.embed = null;

            // Cancel current network requests
            _cancelRequests();

            // Remove the old media
            _remove(plyr.media);

            // Set the type
            if ('type' in source) {
                plyr.type = source.type;

                // Get child type for video (it might be an embed)
                if(plyr.type === 'video') {
                    var firstSource = source.sources[0];

                    if('type' in firstSource && _inArray(config.types.embed, firstSource.type)) {
                        plyr.type = firstSource.type;
                    }
                }
            }

            // Check for support
            plyr.supported = api.supported(plyr.type);

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
                    plyr.embedId = source.sources[0].src;
                    break;
            }

            // Inject the new element
            _prependChild(plyr.container, plyr.media);

            // Autoplay the new source?
            if (typeof source.autoplay !== 'undefined') {
                config.autoplay = source.autoplay;
            }

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
            _toggleStyleHook();

            // Set new sources for html5
            if (_inArray(config.types.html5, plyr.type)) {
                _insertChildElements('source', source.sources);
            }

            // Set up from scratch
            _setupMedia();

            // HTML5 stuff
            if (_inArray(config.types.html5, plyr.type)) {
                // Setup captions
                if ('tracks' in source) {
                    _insertChildElements('track', source.tracks);
                }

                // Load HTML5 sources
                plyr.media.load();

                // Setup interface
                _setupInterface();

                // Display duration if available
                _displayDuration();
            }

            // Set aria title and iframe title
            config.title = source.title;
            _setTitle();

            // Reset media objects
            plyr.container.plyr.media = plyr.media;
        }

        // Update poster
        function _updatePoster(source) {
            if (plyr.type === 'video') {
                plyr.media.setAttribute('poster', source);
            }
        }

        // Listen for control events
        function _controlListeners() {
            // IE doesn't support input event, so we fallback to change
            var inputEvent = (plyr.browser.name == 'IE' ? 'change' : 'input');

            // Click play/pause helper
            function _togglePlay() {
                var play = plyr.media.paused;

                // Toggle playback
                if (play) {
                    _play();
                }
                else {
                    _pause();
                }

                // Determine which buttons
                var trigger = plyr.buttons[play ? 'play' : 'pause'],
                    target = plyr.buttons[play ? 'pause' : 'play'];

                // Get the last play button to account for the large play button
                if(target && target.length > 1) {
                    target = target[target.length - 1];
                }
                else {
                    target = target[0];
                }

                // Setup focus and tab focus
                if(target) {
                    var hadTabFocus = _hasClass(trigger, config.classes.tabFocus);

                    setTimeout(function() {
                        target.focus();

                        if(hadTabFocus) {
                            _toggleClass(trigger, config.classes.tabFocus, false);
                            _toggleClass(target, config.classes.tabFocus, true);
                        }
                    }, 100);
                }
            }

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

                    if (element instanceof NodeList) {
                        for (var i = 0; i < element.length; i++) {
                            _toggleClass(element[i], config.classes.tabFocus, (element[i] === focused));
                        }
                    }
                    else {
                        _toggleClass(element, config.classes.tabFocus, (element === focused));
                    }
                }
            }
            _on(window, 'keyup', function(event) {
                var code = (event.keyCode ? event.keyCode : event.which);

                if (code == 9) {
                    checkFocus();
                }
            });
            _on(document.body, 'click', function() {
                _toggleClass(_getElement('.' + config.classes.tabFocus), config.classes.tabFocus, false);
            });
            for (var button in plyr.buttons) {
                var element = plyr.buttons[button];

                _on(element, 'blur', function() {
                    _toggleClass(element, 'tab-focus', false);
                });
            }

            // Play
            _proxyListener(plyr.buttons.play, 'click', config.listeners.play, _togglePlay);

            // Pause
            _proxyListener(plyr.buttons.pause, 'click', config.listeners.pause, _togglePlay);

            // Restart
            _proxyListener(plyr.buttons.restart, 'click', config.listeners.restart, _seek);

            // Rewind
            _proxyListener(plyr.buttons.rewind, 'click', config.listeners.rewind, _rewind);

            // Fast forward
            _proxyListener(plyr.buttons.forward, 'click', config.listeners.forward, _forward);

            // Seek
            _proxyListener(plyr.buttons.seek, inputEvent, config.listeners.seek, _seek);

            // Set volume
            _proxyListener(plyr.volume.input, inputEvent, config.listeners.volume, function() {
                _setVolume(plyr.volume.input.value);
            });

            // Mute
            _proxyListener(plyr.buttons.mute, 'click', config.listeners.mute, _toggleMute);

            // Fullscreen
            _proxyListener(plyr.buttons.fullscreen, 'click', config.listeners.fullscreen, _toggleFullscreen);

            // Handle user exiting fullscreen by escaping etc
            if (fullscreen.supportsFullScreen) {
                _on(document, fullscreen.fullScreenEventName, _toggleFullscreen);
            }

            // Captions
            _on(plyr.buttons.captions, 'click', _toggleCaptions);

            // Seek tooltip
            _on(plyr.progress.container, 'mouseenter mouseleave mousemove', _updateSeekTooltip);

            // Toggle controls visibility based on mouse movement
            if (config.hideControls) {
                // Toggle controls on mouse events and entering fullscreen
                _on(plyr.container, 'mouseenter mouseleave mousemove enterfullscreen', _toggleControls);

                // Watch for cursor over controls so they don't hide when trying to interact
                _on(plyr.controls, 'mouseenter mouseleave', function(event) { 
                    plyr.controls.active = (event.type === 'mouseenter');
                });

                // Focus in/out on controls
                _on(plyr.controls, 'focus blur', _toggleControls, true);
            }
        }

        // Listen for media events
        function _mediaListeners() {
            // Time change on media
            _on(plyr.media, 'timeupdate seeking', _timeUpdate);

            // Update manual captions
            _on(plyr.media, 'timeupdate', _seekManualCaptions);

            // Display duration
            _on(plyr.media, 'durationchange loadedmetadata', _displayDuration);

            // Handle the media finishing
            _on(plyr.media, 'ended', function() {
                // Clear
                if (plyr.type === 'video') {
                    _setCaption();
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
            if (config.clickToPlay && plyr.type !== 'audio') {
                // Re-fetch the wrapper
                var wrapper = _getElement('.' + config.classes.videoWrapper);

                // Bail if there's no wrapper (this should never happen)
                if(!wrapper) {
                    return;
                }

                // Set cursor
                wrapper.style.cursor = "pointer";

                // On click play, pause ore restart
                _on(wrapper, 'click', function() {
                    if (plyr.media.paused) {
                        _play();
                    }
                    else if (plyr.media.ended) {
                        _seek();
                        _play();
                    }
                    else {
                        _pause();
                    }
                });
            }

            // Proxy events to container
            _on(plyr.media, config.events.join(' '), function(event) {
                _triggerEvent(plyr.container, event.type);
            });
        }

        // Cancel current network requests
        // See https://github.com/Selz/plyr/issues/174
        function _cancelRequests() {
            if(!_inArray(config.types.html5, plyr.type)) {
                return;
            }

            // Set empty src attribute
            plyr.media.setAttribute('src', '');

            // Remove child sources
            var sources = plyr.media.querySelectorAll('source');
            for (var i = 0; i < sources.length; i++) {
                _remove(sources[i]);
            }

            // Load the new empty source
            // This will cancel existing requests
            // See https://github.com/Selz/plyr/issues/174
            plyr.media.load();

            // Debugging
            _log("Cancelled network requests for old media");
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
            _remove(_getElement(config.selectors.controls.wrapper));

            // YouTube
            if (plyr.type === 'youtube') {
                plyr.embed.destroy();
                return;
            }

            // If video, we need to remove some more
            if (plyr.type === 'video') {
                // Remove captions container
                _remove(_getElement(config.selectors.captions));

                // Remove video wrapper
                _unwrap(plyr.videoContainer);
            }

            // Restore native video controls
            _toggleNativeControls(true);

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
            plyr.media = plyr.container.querySelectorAll('audio, video')[0];

            // Get the div placeholder for YouTube and Vimeo
            if(!plyr.media) {
                plyr.media = plyr.container.querySelectorAll('div')[0];
            }

            // Bail if nothing to setup
            if(!plyr.media) {
                return;
            }

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
                plyr.type           = tagName;
                config.crossorigin  = (plyr.media.getAttribute('crossorigin') !== null);
                config.autoplay     = (config.autoplay || (plyr.media.getAttribute('autoplay') !== null));
                config.loop         = (config.loop || (plyr.media.getAttribute('loop') !== null));
            }

            // Check for support
            plyr.supported = api.supported(plyr.type);

            // Add style hook
            _toggleStyleHook();

            // If no native support, bail
            if (!plyr.supported.basic) {
                return false;
            }

            // Debug info
            _log(plyr.browser.name + ' ' + plyr.browser.version);

            // Setup media
            _setupMedia();

            // Setup interface
            if (_inArray(config.types.html5, plyr.type)) {
                // Bail if no support
                if (!plyr.supported.full) {
                    // Successful setup
                    plyr.init = true;

                    // Don't inject controls if no full support
                    return;
                }

                // Setup UI
                _setupInterface();

                // Set title on button and frame
                _setTitle();

                // Autoplay
                if (config.autoplay) {
                    _play();
                }
            }

            // Successful setup
            plyr.init = true;
        }

        function _setupInterface() {
            // Don't setup interface if no support
            if (!plyr.supported.full) {
                _log('No full support for this media type (' + plyr.type + ')', true);

                // Remove controls
                _remove(_getElement(config.selectors.controls.wrapper));

                // Remove large play
                _remove(_getElement(config.selectors.buttons.play));

                // Restore native controls
                _toggleNativeControls(true);

                // Bail
                return;
            }

            // Inject custom controls if not present
            var controlsMissing = !_getElements(config.selectors.controls.wrapper).length;
            if (controlsMissing) {
                // Inject custom controls
                _injectControls();
            }

            // Find the elements
            if (!_findElements()) {
                return;
            }

            // If the controls are injected, re-bind listeners for controls
            if (controlsMissing) {
                _controlListeners();
            }

            // Media element listeners
            _mediaListeners();

            // Remove native controls
            _toggleNativeControls();

            // Setup fullscreen
            _setupFullscreen();

            // Captions
            _setupCaptions();

            // Set volume
            _setVolume();
            _updateVolume();

            // Reset time display
            _timeUpdate();

            // Update the UI
            _checkPlaying();

            // Display duration
            _displayDuration();

            // Ready event
            _triggerEvent(plyr.container, 'ready');
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
            source:             _source,
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

        // Bail if disabled or no basic support
        // You may want to disable certain UAs etc
        if (!api.supported().basic || !elements.length) {
            return false;
        }

        // Create a player instance for each element
        for (var i = 0; i < elements.length; i++) {
            // Get the current element
            var element = elements[i];

            // Setup a player instance and add to the element
            if (typeof element.plyr === 'undefined') {
                // Create instance-specific config
                var config = _extend(defaults, options, JSON.parse(element.getAttribute("data-plyr")));

                // Bail if not enabled
                if(!config.enabled) {
                    return;
                }

                // Create new instance
                var instance = new Plyr(element, config);

                // Set plyr to false if setup failed
                element.plyr = (Object.keys(instance).length ? instance : false);

                // Callback
                _triggerEvent(element, 'setup', { plyr: element.plyr });
            }

            // Add to return array even if it's already setup
            instances.push(element.plyr);
        }

        return instances;
    };

    return api;
}));

// Custom event polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
(function () {
    if (typeof window.CustomEvent === 'function') {
        return false;
    }

    function CustomEvent (event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();
