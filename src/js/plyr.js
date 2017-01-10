// ==========================================================================
// Plyr
// plyr.js v2.0.10
// https://github.com/selz/plyr
// License: The MIT License (MIT)
// ==========================================================================
// Credits: http://paypal.github.io/accessible-html5-video-player/
// ==========================================================================

(function(root, factory) {
    'use strict';
    /* global define,module */

    if (typeof module === 'object' && typeof module.exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(root, document);
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define([], function() {
            return factory(root, document);
        });
    } else {
        // Browser globals (root is window)
        root.plyr = factory(root, document);
    }
}(typeof window !== 'undefined' ? window : this, function(window, document) {
    'use strict';

    // Globals
    var scroll = {
            x: 0,
            y: 0
        },

        // Default config
        defaults = {
            enabled: true,
            debug: false,
            autoplay: false,
            loop: false,
            seekTime: 10,
            volume: 10,
            volumeMin: 0,
            volumeMax: 10,
            volumeStep: 1,
            defaultSpeed: 1.0,
            currentSpeed: 1.0,
            speeds: [0.5, 1.0, 1.5, 2.0],
            duration: null,
            displayDuration: true,
            loadSprite: true,
            iconPrefix: 'plyr',
            iconUrl: 'https://cdn.plyr.io/2.0.10/plyr.svg',
            clickToPlay: true,
            hideControls: true,
            showPosterOnEnd: false,
            disableContextMenu: true,
            keyboardShorcuts: {
                focused: true,
                global: false
            },
            tooltips: {
                controls: false,
                seek: true
            },
            selectors: {
                html5: 'video, audio',
                embed: '[data-type]',
                editable: 'input, textarea, select, [contenteditable]',
                container: '.plyr',
                controls: {
                    container: null,
                    wrapper: '.plyr__controls'
                },
                labels: '[data-plyr]',
                buttons: {
                    seek: '[data-plyr="seek"]',
                    play: '[data-plyr="play"]',
                    pause: '[data-plyr="pause"]',
                    restart: '[data-plyr="restart"]',
                    rewind: '[data-plyr="rewind"]',
                    forward: '[data-plyr="fast-forward"]',
                    mute: '[data-plyr="mute"]',
                    captions: '[data-plyr="captions"]',
                    fullscreen: '[data-plyr="fullscreen"]',
                    settings: '[data-plyr="settings"]',
                    pip: '[data-plyr="pip"]',
                    airplay: '[data-plyr="airplay"]'
                },
                volume: {
                    input: '[data-plyr="volume"]',
                    display: '.plyr__volume--display'
                },
                progress: {
                    container: '.plyr__progress',
                    buffer: '.plyr__progress--buffer',
                    played: '.plyr__progress--played'
                },
                captions: '.plyr__captions',
                currentTime: '.plyr__time--current',
                duration: '.plyr__time--duration'
            },
            classes: {
                setup: 'plyr--setup',
                ready: 'plyr--ready',
                videoWrapper: 'plyr__video-wrapper',
                embedWrapper: 'plyr__video-embed',
                type: 'plyr--{0}',
                stopped: 'plyr--stopped',
                playing: 'plyr--playing',
                muted: 'plyr--muted',
                loading: 'plyr--loading',
                hover: 'plyr--hover',
                tooltip: 'plyr__tooltip',
                hidden: 'plyr__sr-only',
                hideControls: 'plyr--hide-controls',
                isIos: 'plyr--is-ios',
                isTouch: 'plyr--is-touch',
                captions: {
                    enabled: 'plyr--captions-enabled',
                    active: 'plyr--captions-active'
                },
                fullscreen: {
                    enabled: 'plyr--fullscreen-enabled',
                    active: 'plyr--fullscreen-active'
                },
                pip: {
                    enabled: 'plyr--pip-enabled',
                    active: 'plyr--pip-active'
                },
                tabFocus: 'tab-focus'
            },
            captions: {
                defaultActive: false,
                selectedIndex: 0
            },
            fullscreen: {
                enabled: true,
                fallback: true,
                allowAudio: false
            },
            storage: {
                enabled: true,
                key: 'plyr'
            },
            controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'pip', 'airplay', 'fullscreen'],
            i18n: {
                restart: 'Restart',
                rewind: 'Rewind {seektime} secs',
                play: 'Play',
                pause: 'Pause',
                forward: 'Forward {seektime} secs',
                played: 'played',
                buffered: 'buffered',
                currentTime: 'Current time',
                duration: 'Duration',
                volume: 'Volume',
                toggleMute: 'Toggle Mute',
                toggleCaptions: 'Toggle Captions',
                toggleFullscreen: 'Toggle Fullscreen',
                frameTitle: 'Player for {title}',
                captions: 'Captions',
                settings: 'Settings',
                speed: 'Speed',
                quality: 'Quality'
            },
            types: {
                embed: ['youtube', 'vimeo', 'soundcloud'],
                html5: ['video', 'audio']
            },
            // URLs
            urls: {
                vimeo: {
                    api: 'https://player.vimeo.com/api/player.js',
                },
                youtube: {
                    api: 'https://www.youtube.com/iframe_api'
                },
                soundcloud: {
                    api: 'https://w.soundcloud.com/player/api.js'
                }
            },
            // Custom control listeners
            listeners: {
                seek: null,
                play: null,
                pause: null,
                restart: null,
                rewind: null,
                forward: null,
                mute: null,
                volume: null,
                captions: null,
                fullscreen: null,
                speed: null
            },
            // Events to watch on HTML5 media elements
            events: ['ready', 'ended', 'progress', 'stalled', 'playing', 'waiting', 'canplay', 'canplaythrough', 'loadstart', 'loadeddata', 'loadedmetadata', 'timeupdate', 'volumechange', 'play', 'pause', 'error', 'seeking', 'seeked', 'emptied'],
            // Logging
            logPrefix: ''
        };

    // Credits: http://paypal.github.io/accessible-html5-video-player/
    // Unfortunately, due to mixed support, UA sniffing is required
    function getBrowser() {
        var ua = navigator.userAgent,
            name = navigator.appName,
            fullVersion = '' + parseFloat(navigator.appVersion),
            majorVersion = parseInt(navigator.appVersion, 10),
            nameOffset,
            verOffset,
            ix,
            isIE = false,
            isFirefox = false,
            isChrome = false,
            isSafari = false;

        if ((navigator.appVersion.indexOf('Windows NT') !== -1) && (navigator.appVersion.indexOf('rv:11') !== -1)) {
            // MSIE 11
            isIE = true;
            name = 'IE';
            fullVersion = '11';
        } else if ((verOffset = ua.indexOf('MSIE')) !== -1) {
            // MSIE
            isIE = true;
            name = 'IE';
            fullVersion = ua.substring(verOffset + 5);
        } else if ((verOffset = ua.indexOf('Chrome')) !== -1) {
            // Chrome
            isChrome = true;
            name = 'Chrome';
            fullVersion = ua.substring(verOffset + 7);
        } else if ((verOffset = ua.indexOf('Safari')) !== -1) {
            // Safari
            isSafari = true;
            name = 'Safari';
            fullVersion = ua.substring(verOffset + 7);
            if ((verOffset = ua.indexOf('Version')) !== -1) {
                fullVersion = ua.substring(verOffset + 8);
            }
        } else if ((verOffset = ua.indexOf('Firefox')) !== -1) {
            // Firefox
            isFirefox = true;
            name = 'Firefox';
            fullVersion = ua.substring(verOffset + 8);
        } else if ((nameOffset = ua.lastIndexOf(' ') + 1) < (verOffset = ua.lastIndexOf('/'))) {
            // In most other browsers, 'name/version' is at the end of userAgent
            name = ua.substring(nameOffset, verOffset);
            fullVersion = ua.substring(verOffset + 1);

            if (name.toLowerCase() === name.toUpperCase()) {
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
            name: name,
            version: majorVersion,
            isIE: isIE,
            isFirefox: isFirefox,
            isChrome: isChrome,
            isSafari: isSafari,
            isIos: /(iPad|iPhone|iPod)/g.test(navigator.platform),
            isTouch: 'ontouchstart' in document.documentElement
        };
    }

    // Inject a script
    function injectScript(source) {
        if (document.querySelectorAll('script[src="' + source + '"]').length) {
            return;
        }

        var tag = document.createElement('script');
        tag.src = source;
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Element exists in an array
    function inArray(haystack, needle) {
        return Array.prototype.indexOf && (haystack.indexOf(needle) !== -1);
    }

    // Replace all
    function replaceAll(string, find, replace) {
        return string.replace(new RegExp(find.replace(/([.*+?\^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g'), replace);
    }

    // Wrap an element
    function wrap(elements, wrapper) {
        // Convert `elements` to an array, if necessary.
        if (!elements.length) {
            elements = [elements];
        }

        // Loops backwards to prevent having to clone the wrapper on the
        // first element (see `child` below).
        for (var i = elements.length - 1; i >= 0; i--) {
            var child = (i > 0) ? wrapper.cloneNode(true) : wrapper;
            var element = elements[i];

            // Cache the current parent and sibling.
            var parent = element.parentNode;
            var sibling = element.nextSibling;

            // Wrap the element (is automatically removed from its current
            // parent).
            child.appendChild(element);

            // If the element had a sibling, insert the wrapper before
            // the sibling to maintain the HTML structure; otherwise, just
            // append it to the parent.
            if (sibling) {
                parent.insertBefore(child, sibling);
            } else {
                parent.appendChild(child);
            }

            return child;
        }
    }

    // Remove an element
    function remove(element) {
        if (!element) {
            return;
        }
        element.parentNode.removeChild(element);
    }

    // Prepend child
    function prependChild(parent, element) {
        parent.insertBefore(element, parent.firstChild);
    }

    // Set attributes
    function setAttributes(element, attributes) {
        for (var key in attributes) {
            element.setAttribute(key, (is.boolean(attributes[key]) && attributes[key]) ? '' : attributes[key]);
        }
    }

    // Insert a HTML element
    function insertElement(type, parent, attributes) {
        // Create a new <element>
        var element = document.createElement(type);

        // Set all passed attributes
        setAttributes(element, attributes);

        // Inject the new element
        prependChild(parent, element);
    }

    // Get a classname from selector
    function getClassname(selector) {
        return selector.replace('.', '');
    }

    // Toggle class on an element
    function toggleClass(element, className, state) {
        if (element) {
            if (element.classList) {
                element.classList[state ? 'add' : 'remove'](className);
            } else {
                var name = (' ' + element.className + ' ').replace(/\s+/g, ' ').replace(' ' + className + ' ', '');
                element.className = name + (state ? ' ' + className : '');
            }
        }
    }

    // Has class name
    function hasClass(element, className) {
        if (element) {
            if (element.classList) {
                return element.classList.contains(className);
            } else {
                return new RegExp('(\\s|^)' + className + '(\\s|$)').test(element.className);
            }
        }
        return false;
    }

    // Element matches selector
    function matches(element, selector) {
        var p = Element.prototype;

        var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
            return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
        };

        return f.call(element, selector);
    }

    // Bind along with custom handler
    function proxyListener(element, eventName, userListener, defaultListener, useCapture) {
        on(element, eventName, function(event) {
            if (userListener) {
                userListener.apply(element, [event]);
            }
            defaultListener.apply(element, [event]);
        }, useCapture);
    }

    // Toggle event listener
    function toggleListener(elements, events, callback, toggle, useCapture) {
        var eventList = events.split(' ');

        // Whether the listener is a capturing listener or not
        // Default to false
        if (!is.boolean(useCapture)) {
            useCapture = false;
        }

        // If a nodelist is passed, call itself on each node
        if (elements instanceof NodeList) {
            for (var x = 0; x < elements.length; x++) {
                if (elements[x] instanceof Node) {
                    toggleListener(elements[x], arguments[1], arguments[2], arguments[3]);
                }
            }
            return;
        }

        // If a single node is passed, bind the event listener
        for (var i = 0; i < eventList.length; i++) {
            elements[toggle ? 'addEventListener' : 'removeEventListener'](eventList[i], callback, useCapture);
        }
    }

    // Bind event handler
    function on(element, events, callback, useCapture) {
        if (!is.undefined(element)) {
            toggleListener(element, events, callback, true, useCapture);
        }
    }

    // Unbind event handler
    function off(element, events, callback, useCapture) {
        if (!is.undefined(element)) {
            toggleListener(element, events, callback, false, useCapture);
        }
    }

    // Trigger event
    function event(element, type, bubbles, properties) {
        // Bail if no element
        if (!element || !type) {
            return;
        }

        // Default bubbles to false
        if (!is.boolean(bubbles)) {
            bubbles = false;
        }

        // Create and dispatch the event
        var event = new CustomEvent(type, {
            bubbles: bubbles,
            detail: properties
        });

        // Dispatch the event
        element.dispatchEvent(event);
    }

    // Toggle aria-pressed state on a toggle button
    // http://www.ssbbartgroup.com/blog/how-not-to-misuse-aria-states-properties-and-roles
    function toggleState(target, state) {
        // Bail if no target
        if (!target) {
            return;
        }

        // Get state
        state = (is.boolean(state) ? state : !target.getAttribute('aria-pressed'));

        // Set the attribute on target
        target.setAttribute('aria-pressed', state);

        return state;
    }

    // Get percentage
    function getPercentage(current, max) {
        if (current === 0 || max === 0 || isNaN(current) || isNaN(max)) {
            return 0;
        }
        return ((current / max) * 100).toFixed(2);
    }

    // Deep extend/merge destination object with N more objects
    // http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
    // Removed call to arguments.callee (used explicit function name instead)
    function extend() {
        // Get arguments
        var objects = arguments;

        // Bail if nothing to merge
        if (!objects.length) {
            return;
        }

        // Return first if specified but nothing to merge
        if (objects.length === 1) {
            return objects[0];
        }

        // First object is the destination
        var destination = Array.prototype.shift.call(objects),
            length = objects.length;

        // Loop through all objects to merge
        for (var i = 0; i < length; i++) {
            var source = objects[i];

            for (var property in source) {
                if (source[property] && source[property].constructor && source[property].constructor === Object) {
                    destination[property] = destination[property] || {};
                    extend(destination[property], source[property]);
                } else {
                    destination[property] = source[property];
                }
            }
        }

        return destination;
    }

    // Loop through an object or array
    function each(variable, callback) {
        if (is.object(variable)) {
            for (var key in variable) {
                if (variable.hasOwnProperty(key)) {
                    var element = variable[key];
                    callback.call(element, key, element);
                }
            }
        } else if (is.array(variable)) {
            var length = variable.length;
            for (var index = 0; index < length; index++) {
                var item = variable[index];
                callback.call(item, index, item);
            }
        }
    }

    // Check variable types
    var is = {
        object: function(input) {
            return input !== null && typeof(input) === 'object' && input.constructor === Object;
        },
        array: function(input) {
            return input !== null && typeof(input) === 'object' && input.constructor === Array;
        },
        number: function(input) {
            return input !== null && (typeof(input) === 'number' && !isNaN(input - 0) || (typeof input === 'object' && input.constructor === Number));
        },
        string: function(input) {
            return input !== null && (typeof input === 'string' || (typeof input === 'object' && input.constructor === String));
        },
        boolean: function(input) {
            return input !== null && typeof input === 'boolean';
        },
        nodeList: function(input) {
            return input !== null && input instanceof NodeList;
        },
        htmlElement: function(input) {
            return input !== null && input instanceof HTMLElement;
        },
        function: function(input) {
            return input !== null && typeof input === 'function';
        },
        event: function(input) {
            return input !== null && typeof input === 'object' && (input.constructor === Event || input.constructor === CustomEvent);
        },
        undefined: function(input) {
            return input !== null && typeof input === 'undefined';
        },
        empty: function(input) {
            return input === null || this.undefined(input) || ((this.string(input) || this.array(input) || this.nodeList(input)) && input.length === 0) || (this.object(input) && Object.keys(input).length === 0);
        }
    };

    // Parse YouTube ID from url
    function parseYouTubeId(url) {
        var regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        return (url.match(regex)) ? RegExp.$2 : url;
    }

    // Parse Vimeo ID from url
    function parseVimeoId(url) {
        var regex = /^.*(vimeo.com\/|video\/)(\d+).*/;
        return (url.match(regex)) ? RegExp.$2 : url;
    }

    // Fullscreen API
    // Determine the prefix
    var prefix = false;

    if (is.function(document.cancelFullScreen)) {
        prefix = '';
    } else {
        // Check for fullscreen support by vendor prefix
        ['webkit', 'o', 'moz', 'ms', 'khtml'].some(function(test) {
            if (is.function(document[test + 'CancelFullScreen'])) {
                prefix = test;
                return true;
            } else if (is.function(document.msExitFullscreen) && document.msFullscreenEnabled) {
                // Special case for MS (when isn't it?)
                prefix = 'ms';
                return true;
            }
        });
    }

    var fullscreen = {
        prefix: prefix,

        // Yet again Microsoft awesomeness,
        // Sometimes the prefix is 'ms', sometimes 'MS' to keep you on your toes
        eventType: (prefix === 'ms' ? 'MSFullscreenChange' : prefix + 'fullscreenchange'),

        // Is an element fullscreen
        isFullScreen: function(element) {
            if (!support.fullscreen) {
                return false;
            }
            if (is.undefined(element)) {
                element = document.body;
            }
            switch (this.prefix) {
                case '':
                    return document.fullscreenElement === element;
                case 'moz':
                    return document.mozFullScreenElement === element;
                default:
                    return document[prefix + 'FullscreenElement'] === element;
            }
        },
        requestFullScreen: function(element) {
            if (!support.fullscreen) {
                return false;
            }
            if (!is.htmlElement(element)) {
                element = document.body;
            }

            return (prefix === '') ? element.requestFullScreen() : element[prefix + (prefix === 'ms' ? 'RequestFullscreen' : 'RequestFullScreen')]();
        },
        cancelFullScreen: function() {
            if (!support.fullscreen) {
                return false;
            }
            return (prefix === '') ? document.cancelFullScreen() : document[prefix + (prefix === 'ms' ? 'ExitFullscreen' : 'CancelFullScreen')]();
        },
        element: function() {
            if (!support.fullscreen) {
                return null;
            }
            return (prefix === '') ? document.fullscreenElement : document[prefix + 'FullscreenElement'];
        }
    };

    // Check for support
    var support = {
        // Fullscreen support and set prefix
        fullscreen: fullscreen.prefix !== false,
        // Local storage mode
        // We can't assume if local storage is present that we can use it
        storage: (function() {
            if (!('localStorage' in window)) {
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
            } catch (e) {
                return false;
            }

            return false;
        })(),
        // Picture-in-picture support
        // Safari only currently
        pip: (function() {
            return is.function(document.createElement('video').webkitSetPresentationMode);
        })(),
        // Airplay support
        // Safari only currently
        airplay: (function() {
            return is.function(window.WebKitPlaybackTargetAvailabilityEvent);
        })(),
        // Check for mime type support against a player instance
        // Credits: http://diveintohtml5.info/everything.html
        // Related: http://www.leanbackplyr.com/test/h5mt.html
        mime: function(plyr, type) {
            var media = plyr.media;

            try {
                // Bail if no checking function
                if (!is.function(media.canPlayType)) {
                    return false;
                }

                // Type specific checks
                if (plyr.type === 'video') {
                    switch (type) {
                        case 'video/webm':
                            return media.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/no/, '');
                        case 'video/mp4':
                            return media.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/, '');
                        case 'video/ogg':
                            return media.canPlayType('video/ogg; codecs="theora"').replace(/no/, '');
                    }
                } else if (plyr.type === 'audio') {
                    switch (type) {
                        case 'audio/mpeg':
                            return media.canPlayType('audio/mpeg;').replace(/no/, '');
                        case 'audio/ogg':
                            return media.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, '');
                        case 'audio/wav':
                            return media.canPlayType('audio/wav; codecs="1"').replace(/no/, '');
                    }
                }
            } catch (e) {
                return false;
            }

            // If we got this far, we're stuffed
            return false;
        }
    };

    // Player instance
    function Plyr(media, config) {
        var plyr = this,
            timers = {},
            api;

        // Set media
        plyr.media = media;
        var original = media.cloneNode(true);

        // Trigger events, with plyr instance passed
        function triggerEvent(element, type, bubbles, properties) {
            event(element, type, bubbles, extend({}, properties, {
                plyr: api
            }));
        }

        // Debugging proxy
        function debug(type, args) {
            if (config.debug && window.console) {
                args = Array.prototype.slice.call(args);

                // Add a logging prefix if set
                if (!is.empty(config.logPrefix)) {
                    args.unshift(config.logPrefix);
                }

                console[type].apply(console, args);
            }
        }
        var log = function() {
            debug('log', arguments);
        };
        var warn = function() {
            debug('warn', arguments);
        };

        // Log config options
        log('Config', config);

        // Get icon URL
        function getIconUrl() {
            return {
                url: config.iconUrl,
                absolute: (config.iconUrl.indexOf("http") === 0) || plyr.browser.isIE
            };
        }

        // Build the default HTML
        function buildControls() {
            // Create html array
            var html = [],
                iconUrl = getIconUrl(),
                iconPath = (!iconUrl.absolute ? iconUrl.url : '') + '#' + config.iconPrefix;

            // Larger overlaid play button
            if (inArray(config.controls, 'play-large')) {
                html.push(
                    '<button type="button" data-plyr="play" class="plyr__play-large">',
                    '<svg><use xlink:href="' + iconPath + '-play" /></svg>',
                    '<span class="plyr__sr-only">' + config.i18n.play + '</span>',
                    '</button>'
                );
            }

            html.push('<div class="plyr__controls">');

            // Restart button
            if (inArray(config.controls, 'restart')) {
                html.push(
                    '<button type="button" class="plyr__control" data-plyr="restart">',
                    '<svg><use xlink:href="' + iconPath + '-restart" /></svg>',
                    '<span class="plyr__sr-only">' + config.i18n.restart + '</span>',
                    '</button>'
                );
            }

            // Rewind button
            if (inArray(config.controls, 'rewind')) {
                html.push(
                    '<button type="button" class="plyr__control" data-plyr="rewind">',
                    '<svg><use xlink:href="' + iconPath + '-rewind" /></svg>',
                    '<span class="plyr__sr-only">' + config.i18n.rewind + '</span>',
                    '</button>'
                );
            }

            // Play Pause button
            // TODO: This should be a toggle button really?
            if (inArray(config.controls, 'play')) {
                html.push(
                    '<button type="button" class="plyr__control" data-plyr="play">',
                    '<svg><use xlink:href="' + iconPath + '-play" /></svg>',
                    '<span class="plyr__sr-only">' + config.i18n.play + '</span>',
                    '</button>',
                    '<button type="button" class="plyr__control" data-plyr="pause">',
                    '<svg><use xlink:href="' + iconPath + '-pause" /></svg>',
                    '<span class="plyr__sr-only">' + config.i18n.pause + '</span>',
                    '</button>'
                );
            }

            // Fast forward button
            if (inArray(config.controls, 'fast-forward')) {
                html.push(
                    '<button type="button" class="plyr__control" data-plyr="fast-forward">',
                    '<svg><use xlink:href="' + iconPath + '-fast-forward" /></svg>',
                    '<span class="plyr__sr-only">' + config.i18n.forward + '</span>',
                    '</button>'
                );
            }

            // Progress
            if (inArray(config.controls, 'progress')) {
                // Create progress
                html.push('<span class="plyr__progress">',
                    '<label for="seek-{id}" class="plyr__sr-only">Seek</label>',
                    '<input id="seek-{id}" class="plyr__progress--seek" type="range" min="0" max="100" step="0.1" value="0" data-plyr="seek">',
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
            if (inArray(config.controls, 'current-time')) {
                html.push(
                    '<span class="plyr__time">',
                    '<span class="plyr__sr-only">' + config.i18n.currentTime + '</span>',
                    '<span class="plyr__time--current">00:00</span>',
                    '</span>'
                );
            }

            // Media duration display
            if (inArray(config.controls, 'duration')) {
                html.push(
                    '<span class="plyr__time">',
                    '<span class="plyr__sr-only">' + config.i18n.duration + '</span>',
                    '<span class="plyr__time--duration">00:00</span>',
                    '</span>'
                );
            }

            // Toggle mute button
            if (inArray(config.controls, 'mute')) {
                html.push(
                    '<button type="button" class="plyr__control" data-plyr="mute">',
                    '<svg class="icon--muted"><use xlink:href="' + iconPath + '-muted" /></svg>',
                    '<svg><use xlink:href="' + iconPath + '-volume" /></svg>',
                    '<span class="plyr__sr-only">' + config.i18n.toggleMute + '</span>',
                    '</button>'
                );
            }

            // Volume range control
            if (inArray(config.controls, 'volume')) {
                html.push(
                    '<span class="plyr__volume">',
                    '<label for="volume-{id}" class="plyr__sr-only">' + config.i18n.volume + '</label>',
                    '<input id="volume-{id}" class="plyr__volume--input" type="range" min="' + config.volumeMin + '" max="' + config.volumeMax + '" value="' + config.volume + '" data-plyr="volume">',
                    '<progress class="plyr__volume--display" max="' + config.volumeMax + '" value="' + config.volumeMin + '" role="presentation"></progress>',
                    '</span>'
                );
            }

            // Toggle captions button
            if (inArray(config.controls, 'captions')) {
                html.push(
                    '<button type="button" class="plyr__control" data-plyr="captions">',
                    '<svg class="icon--captions-on"><use xlink:href="' + iconPath + '-captions-on" /></svg>',
                    '<svg><use xlink:href="' + iconPath + '-captions-off" /></svg>',
                    '<span class="plyr__sr-only">' + config.i18n.toggleCaptions + '</span>',
                    '</button>'
                );
            }

            // Settings button / menu
            if (inArray(config.controls, 'settings')) {
                html.push(
                    '<div class="plyr__menu" data-plyr="settings">',
                    '<button type="button" id="plyr-settings-toggle-{id}" class="plyr__control" aria-haspopup="true" aria-controls="plyr-settings-{id}" aria-expanded="false">',
                    '<svg><use xlink:href="' + iconPath + '-settings" /></svg>',
                    '<span class="plyr__sr-only">' + config.i18n.settings + '</span>',
                    '</button>',
                    '<div class="plyr__menu__container" id="plyr-settings-{id}" aria-hidden="true" aria-labelled-by="plyr-settings-toggle-{id}" role="tablist" tabindex="-1">',
                    '<div>',
                    '<div class="plyr__menu__primary" id="plyr-settings-{id}-primary" aria-hidden="false" aria-labelled-by="plyr-settings-toggle-{id}" role="tabpanel" tabindex="-1">',
                    '<ul>',
                    '<li role="tab">',
                    '<button type="button" class="plyr__control plyr__control--forward" id="plyr-settings-{id}-captions-toggle" aria-haspopup="true" aria-controls="plyr-settings-{id}-captions" aria-expanded="false">',
                    config.i18n.captions + ' <span class="plyr__menu__value">{lang}</span>',
                    '</button>',
                    '</li>',
                    '<li role="tab">',
                    '<button type="button" class="plyr__control plyr__control--forward" id="plyr-settings-{id}-speed-toggle" aria-haspopup="true" aria-controls="plyr-settings-{id}-speed" aria-expanded="false">',
                    config.i18n.speed + ' <span class="plyr__menu__value">{speed}</span>',
                    '</button>',
                    '</li>',
                    '<li role="tab">',
                    '<button type="button" class="plyr__control plyr__control--forward" id="plyr-settings-{id}-quality-toggle" aria-haspopup="true" aria-controls="plyr-settings-{id}-quality" aria-expanded="false">',
                    config.i18n.quality + ' <span class="plyr__menu__value">Auto</span>',
                    '</button>',
                    '</li>',
                    '</ul>',
                    '</div>',
                    '<div class="plyr__menu__secondary" id="plyr-settings-{id}-captions" aria-hidden="true" aria-labelled-by="plyr-settings-{id}-captions-toggle" role="tabpanel" tabindex="-1">',
                    '<ul>',
                    '<li role="tab">',
                    '<button type="button" class="plyr__control plyr__control--back" aria-haspopup="true" aria-controls="plyr-settings-{id}-primary" aria-expanded="false">',
                    config.i18n.captions,
                    '</button>',
                    '</li>',
                    '<li>',
                    '<button type="button" class="plyr__control">English</button>',
                    '</li>',
                    '<li>',
                    '<button type="button" class="plyr__control">Off</button>',
                    '</li>',
                    '</ul>',
                    '</div>',
                    '<div class="plyr__menu__secondary" id="plyr-settings-{id}-speed" aria-hidden="true" aria-labelled-by="plyr-settings-{id}-speed-toggle" role="tabpanel" tabindex="-1">',
                    '<ul>',
                    '<li role="tab">',
                    '<button type="button" class="plyr__control plyr__control--back" aria-haspopup="true" aria-controls="plyr-settings-{id}-primary" aria-expanded="false">',
                    config.i18n.speed,
                    '</button>',
                    '</li>',
                    '<li>',
                    '<label class="plyr__control">',
                    '<input type="radio" name="speed">',
                    '2&times;',
                    '</label>',
                    '</li>',
                    '<li>',
                    '<label class="plyr__control">',
                    '<input type="radio" name="speed">',
                    '1.5&times;',
                    '</label>',
                    '</li>',
                    '<li>',
                    '<label class="plyr__control">',
                    '<input type="radio" name="speed" checked>',
                    '1&times;',
                    '</label>',
                    '</li>',
                    '<li>',
                    '<label class="plyr__control">',
                    '<input type="radio" name="speed">',
                    '0.5&times;',
                    '</label>',
                    '</li>',
                    '</ul>',
                    '</div>',
                    '<div class="plyr__menu__secondary" id="plyr-settings-{id}-quality" aria-hidden="true" aria-labelled-by="plyr-settings-{id}-quality-toggle" role="tabpanel" tabindex="-1">',
                    '<ul>',
                    '<li role="tab">',
                    '<button type="button" class="plyr__control plyr__control--back" aria-haspopup="true" aria-controls="plyr-settings-{id}-primary" aria-expanded="false">',
                    config.i18n.quality,
                    '</button>',
                    '</li>',
                    '<li>',
                    '<label class="plyr__control">',
                    '<input type="radio" name="quality">',
                    '2160P',
                    '<span class="plyr__menu__value">',
                    '<span class="plyr__badge">4K</span>',
                    '</span>',
                    '</label>',
                    '</li>',
                    '<li>',
                    '<label class="plyr__control">',
                    '<input type="radio" name="quality">',
                    '1440P',
                    '<span class="plyr__menu__value">',
                    '<span class="plyr__badge">WQHD</span>',
                    '</span>',
                    '</label>',
                    '</li>',
                    '<li>',
                    '<label class="plyr__control">',
                    '<input type="radio" name="quality">',
                    '1080P',
                    '<span class="plyr__menu__value">',
                    '<span class="plyr__badge">HD</span>',
                    '</span>',
                    '</label>',
                    '</li>',
                    '<li>',
                    '<label class="plyr__control">',
                    '<input type="radio" name="quality" checked>',
                    '720P',
                    '<span class="plyr__menu__value">',
                    '<span class="plyr__badge">HD</span>',
                    '</span>',
                    '</label>',
                    '</li>',
                    '<li>',
                    '<label class="plyr__control">',
                    '<input type="radio" name="quality">',
                    '480P',
                    '</label>',
                    '</li>',
                    '<li>',
                    '<label class="plyr__control">',
                    '<input type="radio" name="quality">',
                    '360P',
                    '</label>',
                    '</li>',
                    '</ul>',
                    '</div>',
                    '</div>',
                    '</div>',
                    '</div>'
                );
            }

            // Picture in picture button
            if (inArray(config.controls, 'pip') && support.pip) {
                html.push(
                    '<button type="button" class="plyr__control" data-plyr="pip">',
                    '<svg><use xlink:href="' + iconPath + '-pip" /></svg>',
                    '<span class="plyr__sr-only">PIP</span>',
                    '</button>'
                );
            }

            // Airplay button
            if (inArray(config.controls, 'airplay') && support.airplay) {
                html.push(
                    '<button type="button" class="plyr__control" data-plyr="airplay">',
                    '<svg><use xlink:href="' + iconPath + '-airplay" /></svg>',
                    '<span class="plyr__sr-only">AirPlay</span>',
                    '</button>'
                );
            }

            // Toggle fullscreen button
            if (inArray(config.controls, 'fullscreen')) {
                html.push(
                    '<button type="button" class="plyr__control" data-plyr="fullscreen">',
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
        function setupFullscreen() {
            if (!plyr.supported.full) {
                return;
            }

            if ((plyr.type !== 'audio' || config.fullscreen.allowAudio) && config.fullscreen.enabled) {
                // Check for native support
                var nativeSupport = support.fullscreen;

                if (nativeSupport || (config.fullscreen.fallback && !inFrame())) {
                    log((nativeSupport ? 'Native' : 'Fallback') + ' fullscreen enabled');

                    // Add styling hook
                    toggleClass(plyr.container, config.classes.fullscreen.enabled, true);
                } else {
                    log('Fullscreen not supported and fallback disabled');
                }

                // Toggle state
                if (plyr.buttons && plyr.buttons.fullscreen) {
                    toggleState(plyr.buttons.fullscreen, false);
                }

                // Setup focus trap
                focusTrap();
            }
        }

        // Display active caption if it contains text
        function setActiveCue(track) {
            // Get the track from the event if needed
            if (is.event(track)) {
                track = track.target;
            }

            // Display a cue, if there is one
            if (track.activeCues[0] && 'text' in track.activeCues[0]) {
                setCaption(track.activeCues[0].getCueAsHTML());
            } else {
                setCaption();
            }
        }

        // Setup captions
        function setupCaptions() {
            // Bail if not HTML5 video
            if (plyr.type !== 'video') {
                return;
            }

            // Inject the container
            if (!getElement(config.selectors.captions)) {
                plyr.videoContainer.insertAdjacentHTML('afterbegin', '<div class="' + getClassname(config.selectors.captions) + '"></div>');
            }

            // Determine if HTML5 textTracks is supported
            plyr.usingTextTracks = false;
            if (plyr.media.textTracks) {
                plyr.usingTextTracks = true;
            }

            // Get URL of caption file if exists
            var captionSources = [],
                captionSrc = '';

            plyr.media.childNodes.forEach(function(child) {
                if (child.nodeName.toLowerCase() === 'track') {
                    if (child.kind === 'captions' || child.kind === 'subtitles') {
                        captionSources.push(child.getAttribute('src'));
                    }
                }
            });

            // Record if caption file exists or not
            plyr.captionExists = true;
            if (captionSources.length === 0) {
                plyr.captionExists = false;
                log('No caption track found');
            } else if ((config.captions.selectedIndex + 1) > captionSources.length) {
                plyr.captionExists = false;
                log('Caption index out of bound');
            } else {
                captionSrc = captionSources[config.captions.selectedIndex];
                log('Caption track found; URI: ' + captionSrc);
            }

            // If no caption file exists, hide container for caption text
            if (!plyr.captionExists) {
                toggleClass(plyr.container, config.classes.captions.enabled);
            } else {
                var tracks = plyr.media.textTracks;

                // Turn off native caption rendering to avoid double captions
                // This doesn't seem to work in Safari 7+, so the <track> elements are removed from the dom below
                [].forEach.call(tracks, function(track) {
                    // Remove the listener to prevent event overlapping
                    off(track, 'cuechange', setActiveCue);

                    // Hide captions
                    track.mode = 'hidden';
                });

                // Enable UI
                showCaptions(plyr);

                // Disable unsupported browsers than report false positive
                // Firefox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1033144
                if ((plyr.browser.isIE && plyr.browser.version >= 10) ||
                    (plyr.browser.isFirefox && plyr.browser.version >= 31)) {

                    // Debugging
                    log('Detected browser with known TextTrack issues - using manual fallback');

                    // Set to false so skips to 'manual' captioning
                    plyr.usingTextTracks = false;
                }

                // Rendering caption tracks
                // Native support required - http://caniuse.com/webvtt
                if (plyr.usingTextTracks) {
                    log('TextTracks supported');

                    var track = tracks[config.captions.selectedIndex];

                    if (track.kind === 'captions' || track.kind === 'subtitles') {
                        on(track, 'cuechange', setActiveCue);

                        // If we change the active track while a cue is already displayed we need to update it
                        if (track.activeCues && track.activeCues.length > 0) {
                            setActiveCue(track);
                        }
                    }
                } else {
                    // Caption tracks not natively supported
                    log('TextTracks not supported so rendering captions manually');

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

                                    // According to webvtt spec, line terminator consists of one of the following
                                    // CRLF (U+000D U+000A), LF (U+000A) or CR (U+000D)
                                    var lineSeparator = '\r\n';
                                    if (req.indexOf(lineSeparator + lineSeparator) === -1) {
                                        if (req.indexOf('\r\r') !== -1) {
                                            lineSeparator = '\r';
                                        } else {
                                            lineSeparator = '\n';
                                        }
                                    }

                                    captions = req.split(lineSeparator + lineSeparator);

                                    for (var r = 0; r < captions.length; r++) {
                                        caption = captions[r];
                                        plyr.captions[r] = [];

                                        // Get the parts of the captions
                                        var parts = caption.split(lineSeparator),
                                            index = 0;

                                        // Incase caption numbers are added
                                        if (parts[index].indexOf(":") === -1) {
                                            index = 1;
                                        }

                                        plyr.captions[r] = [parts[index], parts[index + 1]];
                                    }

                                    // Remove first element ('VTT')
                                    plyr.captions.shift();

                                    log('Successfully loaded the caption file via AJAX');
                                } else {
                                    warn(config.logPrefix + 'There was a problem loading the caption file via AJAX');
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
        function setCaption(caption) {
            /* jshint unused:false */
            var container = getElement(config.selectors.captions),
                content = document.createElement('span');

            // Empty the container
            container.innerHTML = '';

            // Default to empty
            if (is.undefined(caption)) {
                caption = '';
            }

            // Set the span content
            if (is.string(caption)) {
                content.innerHTML = caption.trim();
            } else {
                content.appendChild(caption);
            }

            // Set new caption text
            container.appendChild(content);

            // Force redraw (for Safari)
            var redraw = container.offsetHeight;
        }

        // Captions functions
        // Seek the manual caption time and update UI
        function seekManualCaptions(time) {
            // Utilities for caption time codes
            function timecodeCommon(tc, pos) {
                var tcpair = [];
                tcpair = tc.split(' --> ');
                for (var i = 0; i < tcpair.length; i++) {
                    // WebVTT allows for extra meta data after the timestamp line
                    // So get rid of this if it exists
                    tcpair[i] = tcpair[i].replace(/(\d+:\d+:\d+\.\d+).*/, "$1");
                }
                return subTcSecs(tcpair[pos]);
            }

            function timecodeMin(tc) {
                return timecodeCommon(tc, 0);
            }

            function timecodeMax(tc) {
                return timecodeCommon(tc, 1);
            }

            function subTcSecs(tc) {
                if (tc === null || tc === undefined) {
                    return 0;
                } else {
                    var tc1 = [],
                        tc2 = [],
                        seconds;
                    tc1 = tc.split(',');
                    tc2 = tc1[0].split(':');
                    seconds = Math.floor(tc2[0] * 60 * 60) + Math.floor(tc2[1] * 60) + Math.floor(tc2[2]);
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
            time = is.number(time) ? time : plyr.media.currentTime;

            // If there's no subs available, bail
            if (!plyr.captions[plyr.subcount]) {
                return;
            }

            while (timecodeMax(plyr.captions[plyr.subcount][0]) < time.toFixed(1)) {
                plyr.subcount++;
                if (plyr.subcount > plyr.captions.length - 1) {
                    plyr.subcount = plyr.captions.length - 1;
                    break;
                }
            }

            // Check if the next caption is in the current time range
            if (plyr.media.currentTime.toFixed(1) >= timecodeMin(plyr.captions[plyr.subcount][0]) &&
                plyr.media.currentTime.toFixed(1) <= timecodeMax(plyr.captions[plyr.subcount][0])) {
                plyr.currentCaption = plyr.captions[plyr.subcount][1];

                // Render the caption
                setCaption(plyr.currentCaption);
            } else {
                setCaption();
            }
        }

        // Display captions container and button (for initialization)
        function showCaptions() {
            // If there's no caption toggle, bail
            if (!plyr.buttons.captions) {
                return;
            }

            toggleClass(plyr.container, config.classes.captions.enabled, true);

            // Try to load the value from storage
            var active = plyr.storage.captionsEnabled;

            // Otherwise fall back to the default config
            if (!is.boolean(active)) {
                active = config.captions.defaultActive;
            }

            if (active) {
                toggleClass(plyr.container, config.classes.captions.active, true);
                toggleState(plyr.buttons.captions, true);
            }
        }

        // Find all elements
        function getElements(selector) {
            return plyr.container.querySelectorAll(selector);
        }

        // Find a single element
        function getElement(selector) {
            return getElements(selector)[0];
        }

        // Determine if we're in an iframe
        function inFrame() {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        }

        // Trap focus inside container
        function focusTrap() {
            var tabbables = getElements('input:not([disabled]), button:not([disabled])'),
                first = tabbables[0],
                last = tabbables[tabbables.length - 1];

            function checkFocus(event) {
                // If it is TAB
                if (event.which === 9 && plyr.isFullscreen) {
                    if (event.target === last && !event.shiftKey) {
                        // Move focus to first element that can be tabbed if Shift isn't used
                        event.preventDefault();
                        first.focus();
                    } else if (event.target === first && event.shiftKey) {
                        // Move focus to last element that can be tabbed if Shift is used
                        event.preventDefault();
                        last.focus();
                    }
                }
            }

            // Bind the handler
            on(plyr.container, 'keydown', checkFocus);
        }

        // Add elements to HTML5 media (source, tracks, etc)
        function insertChildElements(type, attributes) {
            if (is.string(attributes)) {
                insertElement(type, plyr.media, {
                    src: attributes
                });
            } else if (attributes.constructor === Array) {
                for (var i = attributes.length - 1; i >= 0; i--) {
                    insertElement(type, plyr.media, attributes[i]);
                }
            }
        }

        // Insert controls
        function injectControls() {
            // Sprite
            if (config.loadSprite) {
                var iconUrl = getIconUrl();

                // Only load external sprite using AJAX
                if (iconUrl.absolute) {
                    log('AJAX loading absolute SVG sprite' + (plyr.browser.isIE ? ' (due to IE)' : ''));
                    loadSprite(iconUrl.url, "sprite-plyr");
                } else {
                    log('Sprite will be used as external resource directly');
                }
            }

            // Make a copy of the html
            var html = config.html;

            // Insert custom video controls
            log('Injecting custom controls');

            // If no controls are specified, create default
            if (!html) {
                html = buildControls();
            }

            // Replace seek time instances
            html = replaceAll(html, '{seektime}', config.seekTime);

            // Replace seek time instances
            html = replaceAll(html, '{speed}', config.currentSpeed.toFixed(1).toString().replace('.0', '') + '&times;');

            // Replace current captions language
            html = replaceAll(html, '{lang}', 'English');

            // Replace all id references with random numbers
            html = replaceAll(html, '{id}', Math.floor(Math.random() * (10000)));

            // Controls container
            var target;

            // Inject to custom location
            if (is.string(config.selectors.controls.container)) {
                target = document.querySelector(config.selectors.controls.container);
            }

            // Inject into the container by default
            if (!is.htmlElement(target)) {
                target = plyr.container
            }

            // Inject controls HTML
            target.insertAdjacentHTML('beforeend', html);

            // Setup tooltips
            if (config.tooltips.controls) {
                var labels = getElements([config.selectors.controls.wrapper, ' ', config.selectors.labels, ' .', config.classes.hidden].join(''));

                for (var i = labels.length - 1; i >= 0; i--) {
                    var label = labels[i];

                    toggleClass(label, config.classes.hidden, false);
                    toggleClass(label, config.classes.tooltip, true);
                }
            }
        }

        // Find the UI controls and store references
        function findElements() {
            try {
                plyr.controls = getElement(config.selectors.controls.wrapper);

                // Buttons
                plyr.buttons = {
                    seek: getElement(config.selectors.buttons.seek),
                    play: getElements(config.selectors.buttons.play),
                    pause: getElement(config.selectors.buttons.pause),
                    restart: getElement(config.selectors.buttons.restart),
                    rewind: getElement(config.selectors.buttons.rewind),
                    forward: getElement(config.selectors.buttons.forward),
                    fullscreen: getElement(config.selectors.buttons.fullscreen),
                    settings: getElement(config.selectors.buttons.settings),
                    pip: getElement(config.selectors.buttons.pip)
                };

                // Inputs
                plyr.buttons.mute = getElement(config.selectors.buttons.mute);
                plyr.buttons.captions = getElement(config.selectors.buttons.captions);

                // Progress
                plyr.progress = {
                    container: getElement(config.selectors.progress.container)
                };

                // Progress - Buffering
                plyr.progress.buffer = (function() {
                    var bar = getElement(config.selectors.progress.buffer);

                    return {
                        bar: bar,
                        text: is.htmlElement(bar) && bar.getElementsByTagName('span')[0]
                    };
                })();

                // Progress - Played
                plyr.progress.played = getElement(config.selectors.progress.played);

                // Seek tooltip
                plyr.progress.tooltip = plyr.progress.container && plyr.progress.container.querySelector('.' + config.classes.tooltip);

                // Volume
                plyr.volume = {
                    input: getElement(config.selectors.volume.input),
                    display: getElement(config.selectors.volume.display)
                };

                // Timing
                plyr.duration = getElement(config.selectors.duration);
                plyr.currentTime = getElement(config.selectors.currentTime);
                plyr.seekTime = getElements(config.selectors.seekTime);

                return true;
            } catch (e) {
                warn('It looks like there is a problem with your controls HTML', e);

                // Restore native video controls
                toggleNativeControls(true);

                return false;
            }
        }

        // Toggle style hook
        function toggleStyleHook() {
            toggleClass(plyr.container, config.selectors.container.replace('.', ''), plyr.supported.full);
        }

        // Toggle native controls
        function toggleNativeControls(toggle) {
            if (toggle && inArray(config.types.html5, plyr.type)) {
                plyr.media.setAttribute('controls', '');
            } else {
                plyr.media.removeAttribute('controls');
            }
        }

        // Setup aria attribute for play and iframe title
        function setTitle(iframe) {
            // Find the current text
            var label = config.i18n.play;

            // If there's a media title set, use that for the label
            if (is.string(config.title) && config.title.length) {
                label += ', ' + config.title;

                // Set container label
                plyr.container.setAttribute('aria-label', config.title);
            }

            // If there's a play button, set label
            if (plyr.supported.full && plyr.buttons.play) {
                for (var i = plyr.buttons.play.length - 1; i >= 0; i--) {
                    plyr.buttons.play[i].setAttribute('aria-label', label);
                }
            }

            // Set iframe title
            // https://github.com/Selz/plyr/issues/124
            if (is.htmlElement(iframe)) {
                iframe.setAttribute('title', config.i18n.frameTitle.replace('{title}', config.title));
            }
        }

        // Setup localStorage
        function setupStorage() {
            var value = null;
            plyr.storage = {};

            // Bail if we don't have localStorage support or it's disabled
            if (!support.storage || !config.storage.enabled) {
                return;
            }

            // Clean up old volume
            // https://github.com/Selz/plyr/issues/171
            window.localStorage.removeItem('plyr-volume');

            // load value from the current key
            value = window.localStorage.getItem(config.storage.key);

            if (!value) {
                // Key wasn't set (or had been cleared), move along
                return;
            } else if (/^\d+(\.\d+)?$/.test(value)) {
                // If value is a number, it's probably volume from an older
                // version of plyr. See: https://github.com/Selz/plyr/pull/313
                // Update the key to be JSON
                updateStorage({
                    volume: parseFloat(value)
                });
            } else {
                // Assume it's JSON from this or a later version of plyr
                plyr.storage = JSON.parse(value);
            }
        }

        // Save a value back to local storage
        function updateStorage(value) {
            // Bail if we don't have localStorage support or it's disabled
            if (!support.storage || !config.storage.enabled) {
                return;
            }

            // Update the working copy of the values
            extend(plyr.storage, value);

            // Update storage
            window.localStorage.setItem(config.storage.key, JSON.stringify(plyr.storage));
        }

        // Setup media
        function setupMedia() {
            // If there's no media, bail
            if (!plyr.media) {
                warn('No media element found!');
                return;
            }

            if (plyr.supported.full) {
                // Add type class
                toggleClass(plyr.container, config.classes.type.replace('{0}', plyr.type), true);

                // Add video class for embeds
                // This will require changes if audio embeds are added
                if (inArray(config.types.embed, plyr.type)) {
                    toggleClass(plyr.container, config.classes.type.replace('{0}', 'video'), true);
                }

                // Check for picture-in-picture support
                toggleClass(plyr.container, config.classes.pip.enabled, support.pip);

                // If there's no autoplay attribute, assume the video is stopped and add state class
                toggleClass(plyr.container, config.classes.stopped, config.autoplay);

                // Add iOS class
                toggleClass(plyr.ontainer, config.classes.isIos, plyr.browser.isIos);

                // Add touch class
                toggleClass(plyr.container, config.classes.isTouch, plyr.browser.isTouch);

                // Inject the player wrapper
                if (plyr.type === 'video') {
                    // Create the wrapper div
                    var wrapper = document.createElement('div');
                    wrapper.setAttribute('class', config.classes.videoWrapper);

                    // Wrap the video in a container
                    wrap(plyr.media, wrapper);

                    // Cache the container
                    plyr.videoContainer = wrapper;
                }
            }

            // Embeds
            if (inArray(config.types.embed, plyr.type)) {
                setupEmbed();
            }
        }

        // Setup YouTube/Vimeo
        function setupEmbed() {
            var container = document.createElement('div'),
                mediaId,
                id = plyr.type + '-' + Math.floor(Math.random() * (10000));

            // Parse IDs from URLs if supplied
            switch (plyr.type) {
                case 'youtube':
                    mediaId = parseYouTubeId(plyr.embedId);
                    break;

                case 'vimeo':
                    mediaId = parseVimeoId(plyr.embedId);
                    break;

                default:
                    mediaId = plyr.embedId;
            }

            // Remove old containers
            var containers = getElements('[id^="' + plyr.type + '-"]');
            for (var i = containers.length - 1; i >= 0; i--) {
                remove(containers[i]);
            }

            // Add embed class for responsive
            toggleClass(plyr.media, config.classes.videoWrapper, true);
            toggleClass(plyr.media, config.classes.embedWrapper, true);

            if (plyr.type === 'youtube') {
                // Create the YouTube container
                plyr.media.appendChild(container);

                // Set ID
                container.setAttribute('id', id);

                // Setup API
                if (is.object(window.YT)) {
                    youTubeReady(mediaId, container);
                } else {
                    // Load the API
                    injectScript(config.urls.youtube.api);

                    // Setup callback for the API
                    window.onYouTubeReadyCallbacks = window.onYouTubeReadyCallbacks || [];

                    // Add to queue
                    window.onYouTubeReadyCallbacks.push(function() {
                        youTubeReady(mediaId, container);
                    });

                    // Set callback to process queue
                    window.onYouTubeIframeAPIReady = function() {
                        window.onYouTubeReadyCallbacks.forEach(function(callback) {
                            callback();
                        });
                    };
                }
            } else if (plyr.type === 'vimeo') {
                // Vimeo needs an extra div to hide controls on desktop (which has full support)
                if (plyr.supported.full) {
                    plyr.media.appendChild(container);
                } else {
                    container = plyr.media;
                }

                // Set ID
                container.setAttribute('id', id);

                // Load the API if not already
                if (!is.object(window.Vimeo)) {
                    injectScript(config.urls.vimeo.api);

                    // Wait for fragaloop load
                    var vimeoTimer = window.setInterval(function() {
                        if (is.object(window.Vimeo)) {
                            window.clearInterval(vimeoTimer);
                            vimeoReady(mediaId, container);
                        }
                    }, 50);
                } else {
                    vimeoReady(mediaId, container);
                }
            } else if (plyr.type === 'soundcloud') {
                // TODO: Currently unsupported and undocumented
                // Inject the iframe
                var soundCloud = document.createElement('iframe');

                // Watch for iframe load
                soundCloud.loaded = false;
                on(soundCloud, 'load', function() {
                    soundCloud.loaded = true;
                });

                setAttributes(soundCloud, {
                    'src': 'https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/' + mediaId,
                    'id': id
                });

                container.appendChild(soundCloud);
                plyr.media.appendChild(container);

                // Load the API if not already
                if (!window.SC) {
                    injectScript(config.urls.soundcloud.api);
                }

                // Wait for SC load
                var soundCloudTimer = window.setInterval(function() {
                    if (window.SC && soundCloud.loaded) {
                        window.clearInterval(soundCloudTimer);
                        soundCloudReady.call(soundCloud);
                    }
                }, 50);
            }
        }

        // When embeds are ready
        function embedReady() {
            // Setup the UI and call ready if full support
            if (plyr.supported.full) {
                setupInterface();
                ready();
            }

            // Set title
            setTitle(getElement('iframe'));
        }

        // Handle YouTube API ready
        function youTubeReady(videoId, container) {
            // Setup instance
            // https://developers.google.com/youtube/iframe_api_reference
            plyr.embed = new window.YT.Player(container.id, {
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
                    'onError': function(event) {
                        triggerEvent(plyr.container, 'error', true, {
                            code: event.data,
                            embed: event.target
                        });
                    },
                    'onPlaybackQualityChange': function(event) {
                        // Get the instance
                        var instance = event.target;

                        var quality = instance.getPlaybackQuality();

                        // var set = instance.setPlaybackQuality();
                        console.warn(quality);
                    },
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
                        plyr.media.currentTime = 0;
                        plyr.media.muted = instance.isMuted();

                        // Get available speeds
                        var speed = instance.getPlaybackRate();
                        var speedOptions = instance.getAvailablePlaybackRates();
                        //var set = instance.setPlaybackRate();
                        console.warn(speed, speedOptions);

                        // Set title
                        config.title = instance.getVideoData().title;

                        // Set the tabindex
                        if (plyr.supported.full) {
                            plyr.media.querySelector('iframe').setAttribute('tabindex', '-1');
                        }

                        // Update UI
                        embedReady();

                        // Trigger timeupdate
                        triggerEvent(plyr.media, 'timeupdate');

                        // Trigger timeupdate
                        triggerEvent(plyr.media, 'durationchange');

                        // Reset timer
                        window.clearInterval(timers.buffering);

                        // Setup buffering
                        timers.buffering = window.setInterval(function() {
                            // Get loaded % from YouTube
                            plyr.media.buffered = instance.getVideoLoadedFraction();

                            // Trigger progress only when we actually buffer something
                            if (plyr.media.lastBuffered === null || plyr.media.lastBuffered < plyr.media.buffered) {
                                triggerEvent(plyr.media, 'progress');
                            }

                            // Set last buffer point
                            plyr.media.lastBuffered = plyr.media.buffered;

                            // Bail if we're at 100%
                            if (plyr.media.buffered === 1) {
                                window.clearInterval(timers.buffering);

                                // Trigger event
                                triggerEvent(plyr.media, 'canplaythrough');
                            }
                        }, 200);
                    },
                    'onStateChange': function(event) {
                        // Get the instance
                        var instance = event.target;

                        // Reset timer
                        window.clearInterval(timers.playing);

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
                                triggerEvent(plyr.media, 'ended');
                                break;

                            case 1:
                                plyr.media.paused = false;

                                // If we were seeking, fire seeked event
                                if (plyr.media.seeking) {
                                    triggerEvent(plyr.media, 'seeked');
                                }

                                plyr.media.seeking = false;
                                triggerEvent(plyr.media, 'play');
                                triggerEvent(plyr.media, 'playing');

                                // Poll to get playback progress
                                timers.playing = window.setInterval(function() {
                                    // Set the current time
                                    plyr.media.currentTime = instance.getCurrentTime();

                                    // Trigger timeupdate
                                    triggerEvent(plyr.media, 'timeupdate');
                                }, 100);

                                // Check duration again due to YouTube bug
                                // https://github.com/Selz/plyr/issues/374
                                // https://code.google.com/p/gdata-issues/issues/detail?id=8690
                                if (plyr.media.duration !== instance.getDuration()) {
                                    plyr.media.duration = instance.getDuration();
                                    triggerEvent(plyr.media, 'durationchange');
                                }

                                // Get quality
                                var qualityOptions = instance.getAvailableQualityLevels();
                                console.warn(qualityOptions, event.data);

                                break;

                            case 2:
                                plyr.media.paused = true;
                                triggerEvent(plyr.media, 'pause');
                                break;
                        }

                        triggerEvent(plyr.container, 'statechange', false, {
                            code: event.data
                        });
                    }
                }
            });
        }

        // Vimeo ready
        function vimeoReady(mediaId, container) {
            // Setup instance
            // https://github.com/vimeo/player.js
            plyr.embed = new window.Vimeo.Player(container, {
                id: parseInt(mediaId),
                loop: config.loop,
                autoplay: config.autoplay,
                byline: false,
                portrait: false,
                title: false
            });

            // Create a faux HTML5 API using the Vimeo API
            plyr.media.play = function() {
                plyr.embed.play();
                plyr.media.paused = false;
            };
            plyr.media.pause = function() {
                plyr.embed.pause();
                plyr.media.paused = true;
            };
            plyr.media.stop = function() {
                plyr.embed.stop();
                plyr.media.paused = true;
            };

            plyr.media.paused = true;
            plyr.media.currentTime = 0;

            // Update UI
            embedReady();

            plyr.embed.getCurrentTime().then(function(value) {
                plyr.media.currentTime = value;

                // Trigger timeupdate
                triggerEvent(plyr.media, 'timeupdate');
            });

            plyr.embed.getDuration().then(function(value) {
                plyr.media.duration = value;

                // Trigger timeupdate
                triggerEvent(plyr.media, 'durationchange');
            });

            // TODO: Captions
            /*if (config.captions.defaultActive) {
                plyr.embed.enableTextTrack('en');
            }*/

            plyr.embed.on('loaded', function() {
                // Fix keyboard focus issues
                // https://github.com/Selz/plyr/issues/317
                if (is.htmlElement(plyr.embed.element) && plyr.supported.full) {
                    plyr.embed.element.setAttribute('tabindex', '-1');
                }
            });

            plyr.embed.on('play', function() {
                plyr.media.paused = false;
                triggerEvent(plyr.media, 'play');
                triggerEvent(plyr.media, 'playing');
            });

            plyr.embed.on('pause', function() {
                plyr.media.paused = true;
                triggerEvent(plyr.media, 'pause');
            });

            plyr.embed.on('timeupdate', function(data) {
                plyr.media.seeking = false;
                plyr.media.currentTime = data.seconds;
                triggerEvent(plyr.media, 'timeupdate');
            });

            plyr.embed.on('progress', function(data) {
                plyr.media.buffered = data.percent;
                triggerEvent(plyr.media, 'progress');

                if (parseInt(data.percent) === 1) {
                    // Trigger event
                    triggerEvent(plyr.media, 'canplaythrough');
                }
            });

            plyr.embed.on('seeked', function() {
                plyr.media.seeking = false;
                triggerEvent(plyr.media, 'seeked');
                triggerEvent(plyr.media, 'play');
            });

            plyr.embed.on('ended', function() {
                plyr.media.paused = true;
                triggerEvent(plyr.media, 'ended');
            });
        }

        // SoundCloud ready
        function soundCloudReady() {
            /* jshint validthis: true */
            plyr.embed = window.SC.Widget(this);

            // Setup on ready
            plyr.embed.bind(window.SC.Widget.Events.READY, function() {
                // Create a faux HTML5 API using the SoundCloud API
                plyr.media.play = function() {
                    plyr.embed.play();
                    plyr.media.paused = false;
                };
                plyr.media.pause = function() {
                    plyr.embed.pause();
                    plyr.media.paused = true;
                };
                plyr.media.stop = function() {
                    plyr.embed.seekTo(0);
                    plyr.embed.pause();
                    plyr.media.paused = true;
                };

                plyr.media.paused = true;
                plyr.media.currentTime = 0;

                plyr.embed.getDuration(function(value) {
                    plyr.media.duration = value / 1000;

                    // Update UI
                    embedReady();
                });

                plyr.embed.getPosition(function(value) {
                    plyr.media.currentTime = value;

                    // Trigger timeupdate
                    triggerEvent(plyr.media, 'timeupdate');
                });

                plyr.embed.bind(window.SC.Widget.Events.PLAY, function() {
                    plyr.media.paused = false;
                    triggerEvent(plyr.media, 'play');
                    triggerEvent(plyr.media, 'playing');
                });

                plyr.embed.bind(window.SC.Widget.Events.PAUSE, function() {
                    plyr.media.paused = true;
                    triggerEvent(plyr.media, 'pause');
                });

                plyr.embed.bind(window.SC.Widget.Events.PLAY_PROGRESS, function(data) {
                    plyr.media.seeking = false;
                    plyr.media.currentTime = data.currentPosition / 1000;
                    triggerEvent(plyr.media, 'timeupdate');
                });

                plyr.embed.bind(window.SC.Widget.Events.LOAD_PROGRESS, function(data) {
                    plyr.media.buffered = data.loadProgress;
                    triggerEvent(plyr.media, 'progress');

                    if (parseInt(data.loadProgress) === 1) {
                        // Trigger event
                        triggerEvent(plyr.media, 'canplaythrough');
                    }
                });

                plyr.embed.bind(window.SC.Widget.Events.FINISH, function() {
                    plyr.media.paused = true;
                    triggerEvent(plyr.media, 'ended');
                });
            });
        }

        // Play media
        function play() {
            if ('play' in plyr.media) {
                plyr.media.play();
            }
        }

        // Pause media
        function pause() {
            if ('pause' in plyr.media) {
                plyr.media.pause();
            }
        }

        // Toggle playback
        function togglePlay(toggle) {
            // True toggle
            if (!is.boolean(toggle)) {
                toggle = plyr.media.paused;
            }

            if (toggle) {
                play();
            } else {
                pause();
            }

            return toggle;
        }

        // Rewind
        function rewind(seekTime) {
            // Use default if needed
            if (!is.number(seekTime)) {
                seekTime = config.seekTime;
            }
            seek(plyr.media.currentTime - seekTime);
        }

        // Fast forward
        function forward(seekTime) {
            // Use default if needed
            if (!is.number(seekTime)) {
                seekTime = config.seekTime;
            }
            seek(plyr.media.currentTime + seekTime);
        }

        // Speed-up
        function speed(speed) {
            if (!is.array(config.speeds)) {
                warn('Invalid speeds format');
                return;
            }
            if (!is.number(speed)) {
                var index = config.speeds.indexOf(config.currentSpeed);

                if (index !== -1) {
                    var nextIndex = index + 1;
                    if (nextIndex >= config.speeds.length) {
                        nextIndex = 0;
                    }
                    speed = config.speeds[nextIndex];
                } else {
                    speed = config.defaultSpeed;
                }
            }

            // Store current speed
            config.currentSpeed = speed;

            // Set HTML5 speed
            plyr.media.playbackRate = speed;

            // Save speed to localStorage
            updateStorage({
                speed: speed
            });
        }

        // Seek to time
        // The input parameter can be an event or a number
        function seek(input) {
            var targetTime = 0,
                paused = plyr.media.paused,
                duration = getDuration();

            if (is.number(input)) {
                targetTime = input;
            } else if (is.event(input) && inArray(['input', 'change'], input.type)) {
                // It's the seek slider
                // Seek to the selected time
                targetTime = ((input.target.value / input.target.max) * duration);
            }

            // Normalise targetTime
            if (targetTime < 0) {
                targetTime = 0;
            } else if (targetTime > duration) {
                targetTime = duration;
            }

            // Update seek range and progress
            updateSeekDisplay(targetTime);

            // Set the current time
            // Try/catch incase the media isn't set and we're calling seek() from source() and IE moans
            try {
                plyr.media.currentTime = targetTime.toFixed(4);
            } catch (e) {}

            // Embeds
            if (inArray(config.types.embed, plyr.type)) {
                switch (plyr.type) {
                    case 'youtube':
                        plyr.embed.seekTo(targetTime);
                        break;

                    case 'vimeo':
                        // Round to nearest second for vimeo
                        plyr.embed.setCurrentTime(targetTime.toFixed(0));
                        break;

                    case 'soundcloud':
                        plyr.embed.seekTo(targetTime * 1000);
                        break;
                }

                if (paused) {
                    pause();
                }

                // Trigger timeupdate
                triggerEvent(plyr.media, 'timeupdate');

                // Set seeking flag
                plyr.media.seeking = true;

                // Trigger seeking
                triggerEvent(plyr.media, 'seeking');
            }

            // Logging
            log('Seeking to ' + plyr.media.currentTime + ' seconds');

            // Special handling for 'manual' captions
            seekManualCaptions(targetTime);
        }

        // Get the duration (or custom if set)
        function getDuration() {
            // It should be a number, but parse it just incase
            var duration = parseInt(config.duration),

                // True duration
                mediaDuration = 0;

            // Only if duration available
            if (plyr.media.duration !== null && !isNaN(plyr.media.duration)) {
                mediaDuration = plyr.media.duration;
            }

            // If custom duration is funky, use regular duration
            return (isNaN(duration) ? mediaDuration : duration);
        }

        // Check playing state
        function checkPlaying() {
            toggleClass(plyr.container, config.classes.playing, !plyr.media.paused);

            toggleClass(plyr.container, config.classes.stopped, plyr.media.paused);

            toggleControls(plyr.media.paused);
        }

        // Save scroll position
        function saveScrollPosition() {
            scroll = {
                x: window.pageXOffset || 0,
                y: window.pageYOffset || 0
            };
        }

        // Restore scroll position
        function restoreScrollPosition() {
            window.scrollTo(scroll.x, scroll.y);
        }

        // Toggle fullscreen
        function toggleFullscreen(event) {
            // Check for native support
            var nativeSupport = support.fullscreen;

            if (nativeSupport) {
                // If it's a fullscreen change event, update the UI
                if (event && event.type === fullscreen.eventType) {
                    plyr.isFullscreen = fullscreen.isFullScreen(plyr.container);
                } else {
                    // Else it's a user request to enter or exit
                    if (!fullscreen.isFullScreen(plyr.container)) {
                        // Save scroll position
                        saveScrollPosition();

                        // Request full screen
                        fullscreen.requestFullScreen(plyr.container);
                    } else {
                        // Bail from fullscreen
                        fullscreen.cancelFullScreen();
                    }

                    // Check if we're actually full screen (it could fail)
                    plyr.isFullscreen = fullscreen.isFullScreen(plyr.container);

                    return;
                }
            } else {
                // Otherwise, it's a simple toggle
                plyr.isFullscreen = !plyr.isFullscreen;

                // Bind/unbind escape key
                document.body.style.overflow = plyr.isFullscreen ? 'hidden' : '';
            }

            // Set class hook
            toggleClass(plyr.container, config.classes.fullscreen.active, plyr.isFullscreen);

            // Trap focus
            focusTrap(plyr.isFullscreen);

            // Set button state
            if (plyr.buttons && plyr.buttons.fullscreen) {
                toggleState(plyr.buttons.fullscreen, plyr.isFullscreen);
            }

            // Trigger an event
            triggerEvent(plyr.container, plyr.isFullscreen ? 'enterfullscreen' : 'exitfullscreen', true);

            // Restore scroll position
            if (!plyr.isFullscreen && nativeSupport) {
                restoreScrollPosition();
            }
        }

        // Mute
        function toggleMute(muted) {
            // If the method is called without parameter, toggle based on current value
            if (!is.boolean(muted)) {
                muted = !plyr.media.muted;
            }

            // Set button state
            toggleState(plyr.buttons.mute, muted);

            // Set mute on the player
            plyr.media.muted = muted;

            // If volume is 0 after unmuting, set to default
            if (plyr.media.volume === 0) {
                setVolume(config.volume);
            }

            // Embeds
            if (inArray(config.types.embed, plyr.type)) {
                // YouTube
                switch (plyr.type) {
                    case 'youtube':
                        plyr.embed[plyr.media.muted ? 'mute' : 'unMute']();
                        break;

                    case 'vimeo':
                    case 'soundcloud':
                        plyr.embed.setVolume(plyr.media.muted ? 0 : parseFloat(config.volume / config.volumeMax));
                        break;
                }

                // Trigger volumechange for embeds
                triggerEvent(plyr.media, 'volumechange');
            }
        }

        // Set volume
        function setVolume(volume) {
            var max = config.volumeMax,
                min = config.volumeMin;

            // Load volume from storage if no value specified
            if (is.undefined(volume)) {
                volume = plyr.storage.volume;
            }

            // Use config if all else fails
            if (volume === null || isNaN(volume)) {
                volume = config.volume;
            }

            // Maximum is volumeMax
            if (volume > max) {
                volume = max;
            }
            // Minimum is volumeMin
            if (volume < min) {
                volume = min;
            }

            // Set the player volume
            plyr.media.volume = parseFloat(volume / max);

            // Set the display
            if (plyr.volume.display) {
                plyr.volume.display.value = volume;
            }

            // Embeds
            if (inArray(config.types.embed, plyr.type)) {
                switch (plyr.type) {
                    case 'youtube':
                        plyr.embed.setVolume(plyr.media.volume * 100);
                        break;

                    case 'vimeo':
                    case 'soundcloud':
                        plyr.embed.setVolume(plyr.media.volume);
                        break;
                }

                // Trigger volumechange for embeds
                triggerEvent(plyr.media, 'volumechange');
            }

            // Toggle muted state
            if (volume === 0) {
                plyr.media.muted = true;
            } else if (plyr.media.muted && volume > 0) {
                toggleMute();
            }
        }

        // Increase volume
        function increaseVolume(step) {
            var volume = plyr.media.muted ? 0 : (plyr.media.volume * config.volumeMax);

            if (!is.number(step)) {
                step = config.volumeStep;
            }

            setVolume(volume + step);
        }

        // Decrease volume
        function decreaseVolume(step) {
            var volume = plyr.media.muted ? 0 : (plyr.media.volume * config.volumeMax);

            if (!is.number(step)) {
                step = config.volumeStep;
            }

            setVolume(volume - step);
        }

        // Update volume UI and storage
        function updateVolume() {
            // Get the current volume
            var volume = plyr.media.muted ? 0 : (plyr.media.volume * config.volumeMax);

            // Update the <input type="range"> if present
            if (plyr.supported.full) {
                if (plyr.volume.input) {
                    plyr.volume.input.value = volume;
                }
                if (plyr.volume.display) {
                    plyr.volume.display.value = volume;
                }
            }

            // Update the volume in storage
            updateStorage({
                volume: volume
            });

            // Toggle class if muted
            toggleClass(plyr.container, config.classes.muted, (volume === 0));

            // Update checkbox for mute state
            if (plyr.supported.full && plyr.buttons.mute) {
                toggleState(plyr.buttons.mute, (volume === 0));
            }
        }

        // Toggle captions
        function toggleCaptions(show) {
            // If there's no full support, or there's no caption toggle
            if (!plyr.supported.full || !plyr.buttons.captions) {
                return;
            }

            // If the method is called without parameter, toggle based on current value
            if (!is.boolean(show)) {
                show = (plyr.container.className.indexOf(config.classes.captions.active) === -1);
            }

            // Set global
            plyr.captionsEnabled = show;

            // Toggle state
            toggleState(plyr.buttons.captions, plyr.captionsEnabled);

            // Add class hook
            toggleClass(plyr.container, config.classes.captions.active, plyr.captionsEnabled);

            // Trigger an event
            triggerEvent(plyr.container, plyr.captionsEnabled ? 'captionsenabled' : 'captionsdisabled', true);

            // Save captions state to localStorage
            updateStorage({
                captionsEnabled: plyr.captionsEnabled
            });
        }

        // Select active caption
        function setCaptionIndex(index) {
            // Save active caption
            config.captions.selectedIndex = index;

            // Clear caption
            setCaption();

            // Re-run setup
            setupCaptions();
        }

        // Check if media is loading
        function checkLoading(event) {
            var loading = (event.type === 'waiting');

            // Clear timer
            clearTimeout(timers.loading);

            // Timer to prevent flicker when seeking
            timers.loading = setTimeout(function() {
                // Toggle container class hook
                toggleClass(plyr.container, config.classes.loading, loading);

                // Show controls if loading, hide if done
                toggleControls(loading);
            }, (loading ? 250 : 0));
        }

        // Update <progress> elements
        function updateProgress(event) {
            if (!plyr.supported.full) {
                return;
            }

            var progress = plyr.progress.played,
                value = 0,
                duration = getDuration();

            if (event) {
                switch (event.type) {
                    // Video playing
                    case 'timeupdate':
                    case 'seeking':
                        if (plyr.controls.pressed) {
                            return;
                        }

                        value = getPercentage(plyr.media.currentTime, duration);

                        // Set seek range value only if it's a 'natural' time event
                        if (event.type === 'timeupdate' && plyr.buttons.seek) {
                            plyr.buttons.seek.value = value;
                        }

                        break;

                        // Check buffer status
                    case 'playing':
                    case 'progress':
                        progress = plyr.progress.buffer;
                        value = (function() {
                            var buffered = plyr.media.buffered;

                            if (buffered && buffered.length) {
                                // HTML5
                                return getPercentage(buffered.end(0), duration);
                            } else if (is.number(buffered)) {
                                // YouTube returns between 0 and 1
                                return (buffered * 100);
                            }

                            return 0;
                        })();

                        break;
                }
            }

            // Set values
            setProgress(progress, value);
        }

        // Set <progress> value
        function setProgress(progress, value) {
            if (!plyr.supported.full) {
                return;
            }

            // Default to 0
            if (is.undefined(value)) {
                value = 0;
            }
            // Default to buffer or bail
            if (is.undefined(progress)) {
                if (plyr.progress && plyr.progress.buffer) {
                    progress = plyr.progress.buffer;
                } else {
                    return;
                }
            }

            // One progress element passed
            if (is.htmlElement(progress)) {
                progress.value = value;
            } else if (progress) {
                // Object of progress + text element
                if (progress.bar) {
                    progress.bar.value = value;
                }
                if (progress.text) {
                    progress.text.innerHTML = value;
                }
            }
        }

        // Update the displayed time
        function updateTimeDisplay(time, element) {
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
            var displayHours = (parseInt(((getDuration() / 60) / 60) % 60) > 0);

            // Ensure it's two digits. For example, 03 rather than 3.
            plyr.secs = ('0' + plyr.secs).slice(-2);
            plyr.mins = ('0' + plyr.mins).slice(-2);

            // Render
            element.innerHTML = (displayHours ? plyr.hours + ':' : '') + plyr.mins + ':' + plyr.secs;
        }

        // Show the duration on metadataloaded
        function displayDuration() {
            if (!plyr.supported.full) {
                return;
            }

            // Determine duration
            var duration = getDuration() || 0;

            // If there's only one time display, display duration there
            if (!plyr.duration && config.displayDuration && plyr.media.paused) {
                updateTimeDisplay(duration, plyr.currentTime);
            }

            // If there's a duration element, update content
            if (plyr.duration) {
                updateTimeDisplay(duration, plyr.duration);
            }

            // Update the tooltip (if visible)
            updateSeekTooltip();
        }

        // Handle time change event
        function timeUpdate(event) {
            // Duration
            updateTimeDisplay(plyr.media.currentTime, plyr.currentTime);

            // Ignore updates while seeking
            if (event && event.type === 'timeupdate' && plyr.media.seeking) {
                return;
            }

            // Playing progress
            updateProgress(event);
        }

        // Update seek range and progress
        function updateSeekDisplay(time) {
            // Default to 0
            if (!is.number(time)) {
                time = 0;
            }

            var duration = getDuration(),
                value = getPercentage(time, duration);

            // Update progress
            if (plyr.progress && plyr.progress.played) {
                plyr.progress.played.value = value;
            }

            // Update seek range input
            if (plyr.buttons && plyr.buttons.seek) {
                plyr.buttons.seek.value = value;
            }
        }

        // Update hover tooltip for seeking
        function updateSeekTooltip(event) {
            var duration = getDuration();

            // Bail if setting not true
            if (!config.tooltips.seek || !plyr.progress.container || duration === 0) {
                return;
            }

            // Calculate percentage
            var clientRect = plyr.progress.container.getBoundingClientRect(),
                percent = 0,
                visible = config.classes.tooltip + '--visible';

            // Determine percentage, if already visible
            if (!event) {
                if (hasClass(plyr.progress.tooltip, visible)) {
                    percent = plyr.progress.tooltip.style.left.replace('%', '');
                } else {
                    return;
                }
            } else {
                percent = ((100 / clientRect.width) * (event.pageX - clientRect.left));
            }

            // Set bounds
            if (percent < 0) {
                percent = 0;
            } else if (percent > 100) {
                percent = 100;
            }

            // Display the time a click would seek to
            updateTimeDisplay(((duration / 100) * percent), plyr.progress.tooltip);

            // Set position
            plyr.progress.tooltip.style.left = percent + "%";

            // Show/hide the tooltip
            // If the event is a moues in/out and percentage is inside bounds
            if (event && inArray(['mouseenter', 'mouseleave'], event.type)) {
                toggleClass(plyr.progress.tooltip, visible, (event.type === 'mouseenter'));
            }
        }

        // Set playback speed
        function setSpeed(value) {
            // Load speed from storage or default value
            if (is.undefined(value)) {
                value = plyr.storage.speed || config.defaultSpeed;
            }

            speed(value);
        }

        // Show the player controls in fullscreen mode
        function toggleControls(toggle) {
            // Don't hide if config says not to, it's audio, or not ready or loading
            if (!config.hideControls || plyr.type === 'audio') {
                return;
            }

            var delay = 0,
                isEnterFullscreen = false,
                show = toggle,
                loading = hasClass(plyr.container, config.classes.loading);

            // Default to false if no boolean
            if (!is.boolean(toggle)) {
                if (toggle && toggle.type) {
                    // Is the enter fullscreen event
                    isEnterFullscreen = (toggle.type === 'enterfullscreen');

                    // Whether to show controls
                    show = inArray(['mousemove', 'touchstart', 'mouseenter', 'focus'], toggle.type);

                    // Delay hiding on move events
                    if (inArray(['mousemove', 'touchmove'], toggle.type)) {
                        delay = 2000;
                    }

                    // Delay a little more for keyboard users
                    if (toggle.type === 'focus') {
                        delay = 3000;
                    }
                } else {
                    show = hasClass(plyr.container, config.classes.hideControls);
                }
            }

            // Clear timer every movement
            window.clearTimeout(timers.hover);

            // If the mouse is not over the controls, set a timeout to hide them
            if (show || plyr.media.paused || loading) {
                toggleClass(plyr.container, config.classes.hideControls, false);

                // Always show controls when paused or if touch
                if (plyr.media.paused || loading) {
                    return;
                }

                // Delay for hiding on touch
                if (plyr.browser.isTouch) {
                    delay = 3000;
                }
            }

            // If toggle is false or if we're playing (regardless of toggle),
            // then set the timer to hide the controls
            if (!show || !plyr.media.paused) {
                timers.hover = window.setTimeout(function() {
                    // If the mouse is over the controls (and not entering fullscreen), bail
                    if ((plyr.controls.pressed || plyr.controls.hover) && !isEnterFullscreen) {
                        return;
                    }

                    toggleClass(plyr.container, config.classes.hideControls, true);
                }, delay);
            }
        }

        // Add common function to retrieve media source
        function source(source) {
            // If not null or undefined, parse it
            if (!is.undefined(source)) {
                updateSource(source);
                return;
            }

            // Return the current source
            var url;
            switch (plyr.type) {
                case 'youtube':
                    url = plyr.embed.getVideoUrl();
                    break;

                case 'vimeo':
                    plyr.embed.getVideoUrl.then(function(value) {
                        url = value;
                    });
                    break;

                case 'soundcloud':
                    plyr.embed.getCurrentSound(function(object) {
                        url = object.permalink_url;
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
        function updateSource(source) {
            if (!is.object(source) || !('sources' in source) || !source.sources.length) {
                warn('Invalid source format');
                return;
            }

            // Remove ready class hook
            toggleClass(plyr.container, config.classes.ready, false);

            // Pause playback
            pause();

            // Update seek range and progress
            updateSeekDisplay();

            // Reset buffer progress
            setProgress();

            // Cancel current network requests
            cancelRequests();

            // Setup new source
            function setup() {
                // Remove embed object
                plyr.embed = null;

                // Remove the old media
                remove(plyr.media);

                // Remove video container
                if (plyr.type === 'video' && plyr.videoContainer) {
                    remove(plyr.videoContainer);
                }

                // Reset class name
                if (plyr.container) {
                    plyr.container.removeAttribute('class');
                }

                // Set the type
                if ('type' in source) {
                    plyr.type = source.type;

                    // Get child type for video (it might be an embed)
                    if (plyr.type === 'video') {
                        var firstSource = source.sources[0];

                        if ('type' in firstSource && inArray(config.types.embed, firstSource.type)) {
                            plyr.type = firstSource.type;
                        }
                    }
                }

                // Check for support
                plyr.supported = supported(plyr.type);

                // Create new markup
                switch (plyr.type) {
                    case 'video':
                        plyr.media = document.createElement('video');
                        break;

                    case 'audio':
                        plyr.media = document.createElement('audio');
                        break;

                    case 'youtube':
                    case 'vimeo':
                    case 'soundcloud':
                        plyr.media = document.createElement('div');
                        plyr.embedId = source.sources[0].src;
                        break;
                }

                // Inject the new element
                prependChild(plyr.container, plyr.media);

                // Autoplay the new source?
                if (is.boolean(source.autoplay)) {
                    config.autoplay = source.autoplay;
                }

                // Set attributes for audio and video
                if (inArray(config.types.html5, plyr.type)) {
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

                // Restore class hooks
                toggleClass(plyr.container, config.classes.fullscreen.active, plyr.isFullscreen);
                toggleClass(plyr.container, config.classes.captions.active, plyr.captionsEnabled);
                toggleStyleHook();

                // Set new sources for html5
                if (inArray(config.types.html5, plyr.type)) {
                    insertChildElements('source', source.sources);
                }

                // Set up from scratch
                setupMedia();

                // HTML5 stuff
                if (inArray(config.types.html5, plyr.type)) {
                    // Setup captions
                    if ('tracks' in source) {
                        insertChildElements('track', source.tracks);
                    }

                    // Load HTML5 sources
                    plyr.media.load();
                }

                // If HTML5 or embed but not fully supported, setupInterface and call ready now
                if (inArray(config.types.html5, plyr.type) || (inArray(config.types.embed, plyr.type) && !plyr.supported.full)) {
                    // Setup interface
                    setupInterface();

                    // Call ready
                    ready();
                }

                // Set aria title and iframe title
                config.title = source.title;
                setTitle();
            }

            // Destroy instance adn wait for callback
            // Vimeo throws a wobbly if you don't wait
            destroy(setup, false);
        }

        // Update poster
        function updatePoster(source) {
            if (plyr.type === 'video') {
                plyr.media.setAttribute('poster', source);
            }
        }

        // Listen for control events
        function controlListeners() {
            // IE doesn't support input event, so we fallback to change
            var inputEvent = (plyr.browser.isIE ? 'change' : 'input');

            // Click play/pause helper
            function _togglePlay() {
                var play = togglePlay();

                // Determine which buttons
                var trigger = plyr.buttons[play ? 'play' : 'pause'],
                    target = plyr.buttons[play ? 'pause' : 'play'];

                // Get the last play button to account for the large play button
                if (target && target.length > 1) {
                    target = target[target.length - 1];
                } else {
                    target = target[0];
                }

                // Setup focus and tab focus
                if (target) {
                    var hadTabFocus = hasClass(trigger, config.classes.tabFocus);

                    setTimeout(function() {
                        target.focus();

                        if (hadTabFocus) {
                            toggleClass(trigger, config.classes.tabFocus, false);
                            toggleClass(target, config.classes.tabFocus, true);
                        }
                    }, 100);
                }
            }

            // Get the focused element
            function getFocusElement() {
                var focused = document.activeElement;

                if (!focused || focused === document.body) {
                    focused = null;
                } else {
                    focused = document.querySelector(':focus');
                }

                return focused;
            }

            // Get the key code for an event
            function getKeyCode(event) {
                return event.keyCode ? event.keyCode : event.which;
            }

            // Detect tab focus
            function checkTabFocus(focused) {
                for (var button in plyr.buttons) {
                    var element = plyr.buttons[button];

                    if (is.nodeList(element)) {
                        for (var i = 0; i < element.length; i++) {
                            toggleClass(element[i], config.classes.tabFocus, (element[i] === focused));
                        }
                    } else {
                        toggleClass(element, config.classes.tabFocus, (element === focused));
                    }
                }
            }

            // Keyboard shortcuts
            if (config.keyboardShorcuts.focused) {
                var last = null;

                // Handle global presses
                if (config.keyboardShorcuts.global) {
                    on(window, 'keydown keyup', function(event) {
                        var code = getKeyCode(event),
                            focused = getFocusElement(),
                            allowed = [48, 49, 50, 51, 52, 53, 54, 56, 57, 75, 77, 70, 67],
                            count = get().length;

                        // Only handle global key press if there's only one player
                        // and the key is in the allowed keys
                        // and if the focused element is not editable (e.g. text input)
                        // and any that accept key input http://webaim.org/techniques/keyboard/
                        if (count === 1 && inArray(allowed, code) && (!is.htmlElement(focused) || !matches(focused, config.selectors.editable))) {
                            handleKey(event);
                        }
                    });
                }

                // Handle presses on focused
                on(plyr.container, 'keydown keyup', handleKey);
            }

            function handleKey(event) {
                var code = getKeyCode(event),
                    pressed = event.type === 'keydown',
                    held = pressed && code === last;

                // If the event is bubbled from the media element
                // Firefox doesn't get the keycode for whatever reason
                if (!is.number(code)) {
                    return;
                }

                // Seek by the number keys
                function seekByKey() {
                    // Get current duration
                    var duration = plyr.media.duration;

                    // Bail if we have no duration set
                    if (!is.number(duration)) {
                        return;
                    }

                    // Divide the max duration into 10th's and times by the number value
                    seek((duration / 10) * (code - 48));
                }

                // Handle the key on keydown
                // Reset on keyup
                if (pressed) {
                    // Which keycodes should we prevent default
                    var preventDefault = [48, 49, 50, 51, 52, 53, 54, 56, 57, 32, 75, 38, 40, 77, 39, 37, 70, 67];
                    var checkFocus = [38, 40];

                    if (inArray(checkFocus, code)) {
                        var focused = getFocusElement();

                        if (is.htmlElement(focused) && getFocusElement().type === "radio") {
                            return;
                        }
                    }

                    // If the code is found prevent default (e.g. prevent scrolling for arrows)
                    if (inArray(preventDefault, code)) {
                        event.preventDefault();
                        event.stopPropagation();
                    }

                    switch (code) {
                        // 0-9
                        case 48:
                        case 49:
                        case 50:
                        case 51:
                        case 52:
                        case 53:
                        case 54:
                        case 55:
                        case 56:
                        case 57:
                            if (!held) {
                                seekByKey();
                            }
                            break;
                            // Space and K key
                        case 32:
                        case 75:
                            if (!held) {
                                togglePlay();
                            }
                            break;
                            // Arrow up
                        case 38:
                            increaseVolume();
                            break;
                            // Arrow down
                        case 40:
                            decreaseVolume();
                            break;
                            // M key
                        case 77:
                            if (!held) {
                                toggleMute()
                            }
                            break;
                            // Arrow forward
                        case 39:
                            forward();
                            break;
                            // Arrow back
                        case 37:
                            rewind();
                            break;
                            // F key
                        case 70:
                            toggleFullscreen();
                            break;
                            // C key
                        case 67:
                            if (!held) {
                                toggleCaptions();
                            }
                            break;
                    }

                    // Escape is handle natively when in full screen
                    // So we only need to worry about non native
                    if (!support.fullscreen && plyr.isFullscreen && code === 27) {
                        toggleFullscreen();
                    }

                    // Store last code for next cycle
                    last = code;
                } else {
                    last = null;
                }
            }

            // Focus/tab management
            on(window, 'keyup', function(event) {
                var code = getKeyCode(event),
                    focused = getFocusElement();

                if (code === 9) {
                    checkTabFocus(focused);
                }
            });
            on(document.body, 'click', function() {
                toggleClass(getElement('.' + config.classes.tabFocus), config.classes.tabFocus, false);
            });
            for (var button in plyr.buttons) {
                var element = plyr.buttons[button];

                on(element, 'blur', function() {
                    toggleClass(element, 'tab-focus', false);
                });
            }

            // Play
            proxyListener(plyr.buttons.play, 'click', config.listeners.play, _togglePlay);

            // Pause
            proxyListener(plyr.buttons.pause, 'click', config.listeners.pause, _togglePlay);

            // Restart
            proxyListener(plyr.buttons.restart, 'click', config.listeners.restart, seek);

            // Rewind
            proxyListener(plyr.buttons.rewind, 'click', config.listeners.rewind, rewind);

            // Fast forward
            proxyListener(plyr.buttons.forward, 'click', config.listeners.forward, forward);

            // Speed-up
            proxyListener(plyr.buttons.speed, 'click', config.listeners.speed, speed);

            // Seek
            proxyListener(plyr.buttons.seek, inputEvent, config.listeners.seek, seek);

            // Set volume
            proxyListener(plyr.volume.input, inputEvent, config.listeners.volume, function() {
                setVolume(plyr.volume.input.value);
            });

            // Mute
            proxyListener(plyr.buttons.mute, 'click', config.listeners.mute, toggleMute);

            // Fullscreen
            proxyListener(plyr.buttons.fullscreen, 'click', config.listeners.fullscreen, toggleFullscreen);

            // Handle user exiting fullscreen by escaping etc
            if (support.fullscreen) {
                on(document, fullscreen.eventType, toggleFullscreen);
            }

            // Captions
            on(plyr.buttons.captions, 'click', toggleCaptions);

            // Settings
            on(plyr.buttons.settings, 'click', function(event) {
                var menu = this,
                    toggle = event.target,
                    target = document.getElementById(toggle.getAttribute('aria-controls')),
                    show = (toggle.getAttribute('aria-expanded') === 'false');

                // Nothing to show, bail
                if (!is.htmlElement(target)) {
                    return;
                }

                // Are we targetting a tab?
                var isTab = target.getAttribute('role') === 'tabpanel',
                    targetWidth,
                    targetHeight,
                    container;

                // Hide all other tabs
                if (isTab) {
                    // Get other tabs
                    var current = menu.querySelector('[role="tabpanel"][aria-hidden="false"]');
                    container = current.parentNode;

                    [].forEach.call(menu.querySelectorAll('[aria-controls="' + current.getAttribute('id') + '"]'), function(toggle) {
                        toggle.setAttribute('aria-expanded', false);
                    });

                    container.style.width = current.scrollWidth + 'px';
                    container.style.height = current.scrollHeight + 'px';

                    current.setAttribute('aria-hidden', true);
                    current.setAttribute('tabindex', -1);

                    // Get the natural element size
                    var clone = target.cloneNode(true);
                    clone.style.position = "absolute";
                    clone.style.opacity = 0;
                    clone.setAttribute('aria-hidden', false);
                    container.appendChild(clone);
                    targetWidth = clone.scrollWidth;
                    targetHeight = clone.scrollHeight;
                    remove(clone);
                }

                target.setAttribute('aria-hidden', !show);
                toggle.setAttribute('aria-expanded', show);
                target.setAttribute('tabindex', 0);

                if (isTab) {
                    container.style.width = targetWidth + 'px';
                    container.style.height = targetHeight + 'px';

                    window.setTimeout(function() {
                        container.style.width = '';
                        container.style.height = '';
                    }, 300);
                }
            });

            // Picture in picture
            on(plyr.buttons.pip, 'click', function() {
                //if ()

                plyr.media.webkitSetPresentationMode(plyr.media.webkitPresentationMode === 'picture-in-picture' ? 'inline' : 'picture-in-picture');
            });

            // Seek tooltip
            on(plyr.progress.container, 'mouseenter mouseleave mousemove', updateSeekTooltip);

            // Toggle controls visibility based on mouse movement
            if (config.hideControls) {
                // Toggle controls on mouse events and entering fullscreen
                on(plyr.container, 'mouseenter mouseleave mousemove touchstart touchend touchcancel touchmove enterfullscreen', toggleControls);

                // Watch for cursor over controls so they don't hide when trying to interact
                on(plyr.controls, 'mouseenter mouseleave', function(event) {
                    plyr.controls.hover = event.type === 'mouseenter';
                });

                // Watch for cursor over controls so they don't hide when trying to interact
                on(plyr.controls, 'mousedown mouseup touchstart touchend touchcancel', function(event) {
                    plyr.controls.pressed = inArray(['mousedown', 'touchstart'], event.type);
                });

                // Focus in/out on controls
                on(plyr.controls, 'focus blur', toggleControls, true);
            }

            // Adjust volume on scroll
            on(plyr.volume.input, 'wheel', function(event) {
                event.preventDefault();

                // Detect "natural" scroll - suppored on OS X Safari only
                // Other browsers on OS X will be inverted until support improves
                var inverted = event.webkitDirectionInvertedFromDevice,
                    step = (config.volumeStep / 5);

                // Scroll down (or up on natural) to decrease
                if (event.deltaY < 0 || event.deltaX > 0) {
                    if (inverted) {
                        decreaseVolume(step);
                    } else {
                        increaseVolume(step);
                    }
                }

                // Scroll up (or down on natural) to increase
                if (event.deltaY > 0 || event.deltaX < 0) {
                    if (inverted) {
                        increaseVolume(step);
                    } else {
                        decreaseVolume(step);
                    }
                }
            });
        }

        // Listen for media events
        function mediaListeners() {
            // Time change on media
            on(plyr.media, 'timeupdate seeking', timeUpdate);

            // Update manual captions
            on(plyr.media, 'timeupdate', seekManualCaptions);

            // Display duration
            on(plyr.media, 'durationchange loadedmetadata', displayDuration);

            // Handle the media finishing
            on(plyr.media, 'ended', function() {
                // Show poster on end
                if (plyr.type === 'video' && config.showPosterOnEnd) {
                    // Clear
                    if (plyr.type === 'video') {
                        setCaption();
                    }

                    // Restart
                    seek();

                    // Re-load media
                    plyr.media.load();
                }
            });

            // Check for buffer progress
            on(plyr.media, 'progress playing', updateProgress);

            // Handle native mute
            on(plyr.media, 'volumechange', updateVolume);

            // Handle native play/pause
            on(plyr.media, 'play pause ended', checkPlaying);

            // Loading
            on(plyr.media, 'waiting canplay seeked', checkLoading);

            // Click video
            if (config.clickToPlay && plyr.type !== 'audio') {
                // Re-fetch the wrapper
                var wrapper = getElement('.' + config.classes.videoWrapper);

                // Bail if there's no wrapper (this should never happen)
                if (!wrapper) {
                    return;
                }

                // Set cursor
                wrapper.style.cursor = "pointer";

                // On click play, pause ore restart
                on(wrapper, 'click', function() {
                    // Touch devices will just show controls (if we're hiding controls)
                    if (config.hideControls && plyr.browser.isTouch && !plyr.media.paused) {
                        return;
                    }

                    if (plyr.media.paused) {
                        play();
                    } else if (plyr.media.ended) {
                        seek();
                        play();
                    } else {
                        pause();
                    }
                });
            }

            // Disable right click
            if (config.disableContextMenu) {
                on(plyr.media, 'contextmenu', function(event) {
                    event.preventDefault();
                });
            }

            // Proxy events to container
            // Bubble up key events for Edge
            on(plyr.media, config.events.concat(['keyup', 'keydown']).join(' '), function(event) {
                triggerEvent(plyr.container, event.type, true);
            });
        }

        // Cancel current network requests
        // See https://github.com/Selz/plyr/issues/174
        function cancelRequests() {
            if (!inArray(config.types.html5, plyr.type)) {
                return;
            }

            // Remove child sources
            var sources = plyr.media.querySelectorAll('source');
            for (var i = 0; i < sources.length; i++) {
                remove(sources[i]);
            }

            // Set blank video src attribute
            // This is to prevent a MEDIA_ERR_SRC_NOTsupportED error
            // Info: http://stackoverflow.com/questions/32231579/how-to-properly-dispose-of-an-html5-video-and-close-socket-or-connection
            plyr.media.setAttribute('src', 'https://cdn.selz.com/plyr/blank.mp4');

            // Load the new empty source
            // This will cancel existing requests
            // See https://github.com/Selz/plyr/issues/174
            plyr.media.load();

            // Debugging
            log('Cancelled network requests');
        }

        // Destroy an instance
        // Event listeners are removed when elements are removed
        // http://stackoverflow.com/questions/12528049/if-a-dom-element-is-removed-are-its-listeners-also-removed-from-memory
        function destroy(callback, restore) {
            // Bail if the element is not initialized
            if (!plyr.init) {
                return null;
            }

            // Type specific stuff
            switch (plyr.type) {
                case 'youtube':
                    // Clear timers
                    window.clearInterval(timers.buffering);
                    window.clearInterval(timers.playing);

                    // Destroy YouTube API
                    plyr.embed.destroy();

                    // Clean up
                    cleanUp();

                    break;

                case 'vimeo':
                    // Destroy Vimeo API
                    // then clean up (wait, to prevent postmessage errors)
                    plyr.embed.unload().then(cleanUp);

                    // Vimeo does not always return
                    window.setTimeout(cleanUp, 200);

                    break;

                case 'video':
                case 'audio':
                    // Restore native video controls
                    toggleNativeControls(true);

                    // Clean up
                    cleanUp();

                    break;
            }

            function cleanUp() {
                // Default to restore original element
                if (!is.boolean(restore)) {
                    restore = true;
                }

                // Callback
                if (is.function(callback)) {
                    callback.call(original);
                }

                // Bail if we don't need to restore the original element
                if (!restore) {
                    return;
                }

                // Remove init flag
                plyr.init = false;

                // Replace the container with the original element provided
                plyr.container.parentNode.replaceChild(original, plyr.container);

                // unbind escape key
                document.body.style.overflow = '';

                // Event
                triggerEvent(original, 'destroyed', true);
            }
        }

        // Setup a player
        function init() {
            // Bail if the element is initialized
            if (plyr.init) {
                return null;
            }

            // Sniff out the browser
            plyr.browser = getBrowser();

            // Bail if nothing to setup
            if (!is.htmlElement(plyr.media)) {
                return;
            }

            // Load saved settings from localStorage
            setupStorage();

            // Set media type based on tag or data attribute
            // Supported: video, audio, vimeo, youtube
            var tagName = media.tagName.toLowerCase();
            if (tagName === 'div') {
                plyr.type = media.getAttribute('data-type');
                plyr.embedId = media.getAttribute('data-video-id');

                // Clean up
                media.removeAttribute('data-type');
                media.removeAttribute('data-video-id');
            } else {
                plyr.type = tagName;
                config.crossorigin = (media.getAttribute('crossorigin') !== null);
                config.autoplay = (config.autoplay || (media.getAttribute('autoplay') !== null));
                config.loop = (config.loop || (media.getAttribute('loop') !== null));
            }

            // Check for support
            plyr.supported = supported(plyr.type);

            // If no native support, bail
            if (!plyr.supported.basic) {
                return;
            }

            // Wrap media
            plyr.container = wrap(media, document.createElement('div'));

            // Allow focus to be captured
            plyr.container.setAttribute('tabindex', 0);

            // Add style hook
            toggleStyleHook();

            // Debug info
            log('' + plyr.browser.name + ' ' + plyr.browser.version);

            // Setup media
            setupMedia();

            // Setup interface
            // If embed but not fully supported, setupInterface (to avoid flash of controls) and call ready now
            if (inArray(config.types.html5, plyr.type) || (inArray(config.types.embed, plyr.type) && !plyr.supported.full)) {
                // Setup UI
                setupInterface();

                // Call ready
                ready();

                // Set title on button and frame
                setTitle();
            }

            // Successful setup
            plyr.init = true;
        }

        // Setup the UI
        function setupInterface() {
            // Don't setup interface if no support
            if (!plyr.supported.full) {
                warn('Basic support only', plyr.type);

                // Remove controls
                remove(getElement(config.selectors.controls.wrapper));

                // Remove large play
                remove(getElement(config.selectors.buttons.play));

                // Restore native controls
                toggleNativeControls(true);

                // Bail
                return;
            }

            // Inject custom controls if not present
            var controlsMissing = !getElements(config.selectors.controls.wrapper).length;
            if (controlsMissing) {
                // Inject custom controls
                injectControls();
            }

            // Find the elements
            if (!findElements()) {
                return;
            }

            // If the controls are injected, re-bind listeners for controls
            if (controlsMissing) {
                controlListeners();
            }

            // Media element listeners
            mediaListeners();

            // Remove native controls
            toggleNativeControls();

            // Setup fullscreen
            setupFullscreen();

            // Captions
            setupCaptions();

            // Set volume
            setVolume();
            updateVolume();

            // Set playback speed
            setSpeed();

            // Reset time display
            timeUpdate();

            // Update the UI
            checkPlaying();
        }

        api = {
            getOriginal: function() {
                return original;
            },
            getContainer: function() {
                return plyr.container
            },
            getEmbed: function() {
                return plyr.embed;
            },
            getMedia: function() {
                return plyr.media;
            },
            getType: function() {
                return plyr.type;
            },
            getDuration: getDuration,
            getCurrentTime: function() {
                return plyr.media.currentTime;
            },
            getVolume: function() {
                return plyr.media.volume;
            },
            isMuted: function() {
                return plyr.media.muted;
            },
            isReady: function() {
                return hasClass(plyr.container, config.classes.ready);
            },
            isLoading: function() {
                return hasClass(plyr.container, config.classes.loading);
            },
            isPaused: function() {
                return plyr.media.paused;
            },
            on: function(event, callback) {
                on(plyr.container, event, callback);
                return this;
            },
            play: play,
            pause: pause,
            stop: function() {
                pause();
                seek();
            },
            restart: seek,
            rewind: rewind,
            forward: forward,
            seek: seek,
            source: source,
            poster: updatePoster,
            setVolume: setVolume,
            setSpeed: setSpeed,
            togglePlay: togglePlay,
            toggleMute: toggleMute,
            toggleCaptions: toggleCaptions,
            toggleFullscreen: toggleFullscreen,
            toggleControls: toggleControls,
            setCaptionIndex: setCaptionIndex,
            isFullscreen: function() {
                return plyr.isFullscreen || false;
            },
            support: function(mimeType) {
                return support.mime(plyr, mimeType);
            },
            destroy: destroy
        };

        // Everything done
        function ready() {
            // Ready event at end of execution stack
            window.setTimeout(function() {
                triggerEvent(plyr.media, 'ready');
            }, 0);

            // Set class hook on media element
            toggleClass(plyr.media, defaults.classes.setup, true);

            // Set container class for ready
            toggleClass(plyr.container, config.classes.ready, true);

            // Store a refernce to instance
            plyr.media.plyr = api;

            // Autoplay
            if (config.autoplay) {
                play();
            }
        }

        // Initialize instance
        init();

        // If init failed, return null
        if (!plyr.init) {
            return null;
        }

        return api;
    }

    // Load a sprite
    function loadSprite(url, id) {
        var x = new XMLHttpRequest();

        // If the id is set and sprite exists, bail
        if (is.string(id) && is.htmlElement(document.querySelector('#' + id))) {
            return;
        }

        // Create placeholder (to prevent loading twice)
        var container = document.createElement('div');
        container.setAttribute('hidden', '');
        if (is.string(id)) {
            container.setAttribute('id', id);
        }
        document.body.insertBefore(container, document.body.childNodes[0]);

        // Check for CORS support
        if ('withCredentials' in x) {
            x.open('GET', url, true);
        } else {
            return;
        }

        // Inject hidden div with sprite on load
        x.onload = function() {
            container.innerHTML = x.responseText;
        }

        x.send();
    }

    // Check for support
    function supported(type) {
        var browser = getBrowser(),
            isOldIE = (browser.isIE && browser.version <= 9),
            isIos = browser.isIos,
            isIphone = /iPhone|iPod/i.test(navigator.userAgent),
            audio = !!document.createElement('audio').canPlayType,
            video = !!document.createElement('video').canPlayType,
            basic, full;

        switch (type) {
            case 'video':
                basic = video;
                full = (basic && (!isOldIE && !isIphone));
                break;

            case 'audio':
                basic = audio;
                full = (basic && !isOldIE);
                break;

            case 'vimeo':
            case 'youtube':
            case 'soundcloud':
                basic = true;
                full = (!isOldIE && !isIos);
                break;

            default:
                basic = (audio && video);
                full = (basic && !isOldIE);
        }

        return {
            basic: basic,
            full: full
        };
    }

    // Setup function
    function setup(targets, options) {
        // Get the players
        var players = [],
            instances = [],
            selector = [defaults.selectors.html5, defaults.selectors.embed].join(',');

        // Select the elements
        if (is.string(targets)) {
            // String selector passed
            targets = document.querySelectorAll(targets);
        } else if (is.htmlElement(targets)) {
            // Single HTMLElement passed
            targets = [targets];
        } else if (!is.nodeList(targets) && !is.array(targets) && !is.string(targets)) {
            // No selector passed, possibly options as first argument
            // If options are the first argument
            if (is.undefined(options) && is.object(targets)) {
                options = targets;
            }

            // Use default selector
            targets = document.querySelectorAll(selector);
        }

        // Convert NodeList to array
        if (is.nodeList(targets)) {
            targets = Array.prototype.slice.call(targets);
        }

        // Bail if disabled or no basic support
        // You may want to disable certain UAs etc
        if (!supported().basic || !targets.length) {
            return false;
        }

        // Add to container list
        function add(target, media) {
            if (!hasClass(media, defaults.classes.hook)) {
                players.push({
                    // Always wrap in a <div> for styling
                    //container:  wrap(media, document.createElement('div')),
                    // Could be a container or the media itself
                    target: target,
                    // This should be the <video>, <audio> or <div> (YouTube/Vimeo)
                    media: media
                });
            }
        }

        // Check if the targets have multiple media elements
        for (var i = 0; i < targets.length; i++) {
            var target = targets[i];

            // Get children
            var children = target.querySelectorAll(selector);

            // If there's more than one media element child, wrap them
            if (children.length) {
                for (var x = 0; x < children.length; x++) {
                    add(target, children[x]);
                }
            } else if (matches(target, selector)) {
                // Target is media element
                add(target, target);
            }
        }

        // Create a player instance for each element
        players.forEach(function(player) {
            var element = player.target,
                media = player.media,
                match = false;

            // The target element can also be the media element
            if (media === element) {
                match = true;
            }

            // Setup a player instance and add to the element
            // Create instance-specific config
            var data = {};

            // Try parsing data attribute config
            try {
                data = JSON.parse(element.getAttribute('data-plyr'));
            } catch (e) {}

            var config = extend({}, defaults, options, data);

            // Bail if not enabled
            if (!config.enabled) {
                return null;
            }

            // Create new instance
            var instance = new Plyr(media, config);

            // Go to next if setup failed
            if (!is.object(instance)) {
                return;
            }

            // Listen for events if debugging
            if (config.debug) {
                var events = config.events.concat(['setup', 'statechange', 'enterfullscreen', 'exitfullscreen', 'captionsenabled', 'captionsdisabled']);

                on(instance.getContainer(), events.join(' '), function(event) {
                    console.log([config.logPrefix, 'event:', event.type].join(' '), event.detail.plyr);
                });
            }

            // Callback
            event(instance.getContainer(), 'setup', true, {
                plyr: instance
            });

            // Add to return array even if it's already setup
            instances.push(instance);
        });

        return instances;
    }

    // Get all instances within a provided container
    function get(container) {
        if (is.string(container)) {
            // Get selector if string passed
            container = document.querySelector(container);
        } else if (is.undefined(container)) {
            // Use body by default to get all on page
            container = document.body;
        }

        // If we have a HTML element
        if (is.htmlElement(container)) {
            var elements = container.querySelectorAll('.' + defaults.classes.setup),
                instances = [];

            Array.prototype.slice.call(elements).forEach(function(element) {
                if (is.object(element.plyr)) {
                    instances.push(element.plyr);
                }
            });

            return instances;
        }

        return [];
    }

    return {
        setup: setup,
        supported: supported,
        loadSprite: loadSprite,
        get: get
    };
}));

// Custom event polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
(function() {
    if (typeof window.CustomEvent === 'function') {
        return;
    }

    function CustomEvent(event, params) {
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();
