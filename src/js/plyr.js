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
    };

    // Default config
    var defaults = {
        enabled: true,
        debug: false,
        autoplay: false,
        seekTime: 10,
        volume: 10,
        duration: null,
        displayDuration: true,
        loadSprite: true,
        iconPrefix: 'plyr',
        iconUrl: 'https://cdn.plyr.io/2.0.10/plyr.svg',
        clickToPlay: true,
        hideControls: true,
        showPosterOnEnd: false,
        disableContextMenu: true,

        // Quality settings
        quality: {
            default: 'auto',
            selected: 'auto'
        },

        // Set loops
        loop: {
            active: false,
            start: 0,
            end: null,
            indicator: {
                start: 0,
                end: 0
            }
        },

        // Speed up/down
        speed: {
            selected: 1.0,
            options: [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0]
        },

        // Keyboard shortcut settings
        keyboardShortcuts: {
            focused: true,
            global: false
        },

        // Display tooltips
        tooltips: {
            controls: false,
            seek: true
        },

        // Selectors
        // Change these to match your template if using custom HTML
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
                play: '[data-plyr="play"]',
                pause: '[data-plyr="pause"]',
                restart: '[data-plyr="restart"]',
                rewind: '[data-plyr="rewind"]',
                forward: '[data-plyr="fast-forward"]',
                mute: '[data-plyr="mute"]',
                captions: '[data-plyr="captions"]',
                fullscreen: '[data-plyr="fullscreen"]',
                pip: '[data-plyr="pip"]',
                airplay: '[data-plyr="airplay"]',
                settings: '[data-plyr="settings"]',
                loop: '[data-plyr="loop"]'
            },
            inputs: {
                seek: '[data-plyr="seek"]',
                volume: '[data-plyr="volume"]',
                speed: '[data-plyr="speed"]',
                language: '[data-plyr="language"]',
                quality: '[data-plyr="quality"]'
            },
            display: {
                currentTime: '.plyr__time--current',
                duration: '.plyr__time--duration',
                buffer: '.plyr__progress--buffer',
                played: '.plyr__progress--played',
                loop: '.plyr__progress--loop',
                volume: '.plyr__volume--display',
            },
            progress: '.plyr__progress',
            captions: '.plyr__captions',
            menu: {
                quality: '.js-plyr__menu__list--quality'
            }
        },

        // Class hooks added to the player in different states
        classes: {
            setup: 'plyr--setup',
            ready: 'plyr--ready',
            videoWrapper: 'plyr__video-wrapper',
            embedWrapper: 'plyr__video-embed',
            control: 'plyr__control',
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
            menu: {
                value: 'plyr__menu__value',
                badge: 'plyr__badge'
            },
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
            airplay: {
                enabled: 'plyr--airplay-enabled',
                active: 'plyr--airplay-active'
            },
            tabFocus: 'tab-focus'
        },

        // Captions settings
        captions: {
            defaultActive: false,
            language: window.navigator.language.split("-")[0]
        },

        // Fullscreen settings
        fullscreen: {
            enabled: true,
            fallback: true,
            allowAudio: false
        },

        // Local storage
        storage: {
            enabled: true,
            key: 'plyr'
        },

        // Default controls
        controls: [
            'play-large',
            'play',
            'progress',
            'current-time',
            'mute',
            'volume',
            'captions',
            'settings',
            'pip',
            'airplay',
            'fullscreen'
        ],

        // Localisation
        i18n: {
            restart: 'Restart',
            rewind: 'Rewind {seektime} secs',
            play: 'Play',
            pause: 'Pause',
            forward: 'Forward {seektime} secs',
            seek: 'Seek',
            played: 'Played',
            buffered: 'Buffered',
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
            quality: 'Quality',
            loop: 'Loop',
            start: 'Start',
            end: 'End',
            all: 'All',
            reset: 'Reset',
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
            pip: null,
            airplay: null,
            speed: null,
            quality: null,
            loop: null,
            language: null
        },

        // Events to watch on HTML5 media elements and bubble
        events: [
            'ready',
            'ended',
            'progress',
            'stalled',
            'playing',
            'waiting',
            'canplay',
            'canplaythrough',
            'loadstart',
            'loadeddata',
            'loadedmetadata',
            'timeupdate',
            'volumechange',
            'play',
            'pause',
            'error',
            'seeking',
            'seeked',
            'emptied'
        ],

        // Logging
        logPrefix: ''
    };

    // Types
    var types = {
        embed: ['youtube', 'vimeo', 'soundcloud'],
        html5: ['video', 'audio']
    };

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
            return input !== null && input instanceof Event;
        },
        cue: function(input) {
            return input !== null && (input instanceof window.TextTrackCue || input instanceof window.VTTCue);
        },
        track: function(input) {
            return input !== null && input instanceof window.TextTrack;
        },
        undefined: function(input) {
            return input !== null && typeof input === 'undefined';
        },
        empty: function(input) {
            return input === null || this.undefined(input) || ((this.string(input) || this.array(input) || this.nodeList(input)) && input.length === 0) || (this.object(input) && Object.keys(input).length === 0);
        }
    };

    // Credits: http://paypal.github.io/accessible-html5-video-player/
    // Unfortunately, due to mixed support, UA sniffing is required
    function getBrowser() {
        var ua = navigator.userAgent;
        var name = navigator.appName;
        var fullVersion = '' + parseFloat(navigator.appVersion);
        var majorVersion = parseInt(navigator.appVersion, 10);
        var nameOffset;
        var verOffset;
        var ix;
        var isIE = false;
        var isFirefox = false;
        var isChrome = false;
        var isSafari = false;

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
    function injectScript(url) {
        // Check script is not already referenced
        if (document.querySelectorAll('script[src="' + url + '"]').length) {
            return;
        }

        var tag = document.createElement('script');
        tag.src = url;

        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Determine if we're in an iframe
    function inFrame() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
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
            element.setAttribute(key, attributes[key]);
        }
    }

    // Get an attribute object from a string selector
    function getAttributesFromSelector(selector, existingAttributes) {
        // For example:
        // '.test' to { class: 'test' }
        // '#test' to { id: 'test' }
        // '[data-test="test"]' to { 'data-test': 'test' }

        if (!is.string(selector) || is.empty(selector)) {
            return {};
        }

        var attributes = {};

        selector.split(',').forEach(function(selector) {
            // Remove whitespace
            selector = selector.trim();

            // Get the first character
            var start = selector.charAt(0);

            switch (start) {
                case '.':
                    // Classname selector
                    var className = selector.replace('.', '');

                    // Add to existing classname
                    if (is.object(existingAttributes) && is.string(existingAttributes.class)) {
                        existingAttributes.class += ' ' + className;
                    }

                    attributes.class = className;
                    break;

                case '#':
                    // ID selector
                    attributes.id = selector.replace('#', '');
                    break;

                case '[':
                    // Strip the []
                    selector = selector.replace(/[\[\]]/g, '');

                    // Get the parts if
                    var parts = selector.split('=');
                    var key = parts[0];

                    // Get the value if provided
                    var value = parts.length > 1 ? parts[1].replace(/[\"\']/g, '') : '';

                    // Attribute selector
                    attributes[key] = value;

                    break;
            }
        });

        return attributes;
    }

    // Create a DocumentFragment
    function createElement(type, attributes, text) {
        // Create a new <element>
        var element = document.createElement(type);

        // Set all passed attributes
        if (is.object(attributes)) {
            setAttributes(element, attributes);
        }

        // Add text node
        if (is.string(text)) {
            element.textContent = text;
        }

        // Return built element
        return element;
    }

    // Insert a DocumentFragment
    function insertElement(type, parent, attributes, text) {
        // Create a new <element>
        var element = createElement(type, attributes, text);

        // Inject the new element
        prependChild(parent, element);
    }

    // Remove all child elements
    function emptyElement(element) {
        var length = element.childNodes.length;
        while (length--) {
            element.removeChild(element.lastChild);
        }
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
        var prototype = Element.prototype;

        var matches = prototype.matches ||
            prototype.webkitMatchesSelector ||
            prototype.mozMatchesSelector ||
            prototype.msMatchesSelector ||
            function(s) {
                return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
            };

        return matches.call(element, selector);
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

    // Bind along with custom handler
    function proxy(element, eventName, customListener, defaultListener, useCapture) {
        on(element, eventName, function(event) {
            if (customListener) {
                customListener.apply(element, [event]);
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
        var destination = Array.prototype.shift.call(objects);
        if (!is.object(destination)) {
            destination = {};
        }

        var length = objects.length;

        // Loop through all objects to merge
        for (var i = 0; i < length; i++) {
            var source = objects[i];

            if (!is.object(source)) {
                source = {};
            }

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

    // Parse YouTube ID from url
    function parseYouTubeId(url) {
        var regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        return (url.match(regex)) ? RegExp.$2 : url;
    }

    // Fullscreen API
    var fullscreen = (function() {
        // Determine the prefix
        var prefix = (function() {
            var value = false;

            if (is.function(document.cancelFullScreen)) {
                value = '';
            } else {
                // Check for fullscreen support by vendor prefix
                ['webkit', 'o', 'moz', 'ms', 'khtml'].some(function(prefix) {
                    if (is.function(document[prefix + 'CancelFullScreen'])) {
                        value = prefix;
                        return true;
                    } else if (is.function(document.msExitFullscreen) && document.msFullscreenEnabled) {
                        // Special case for MS (when isn't it?)
                        value = 'ms';
                        return true;
                    }
                });
            }

            return value;
        })();

        return {
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

                console.log(prefix);

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
    })();

    // Check for support
    var support = {
        // Fullscreen support and set prefix
        fullscreen: fullscreen.prefix !== false,

        // Local storage
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
            return is.function(createElement('video').webkitSetPresentationMode);
        })(),

        // Airplay support
        // Safari only currently
        airplay: (function() {
            return is.function(window.WebKitPlaybackTargetAvailabilityEvent);
        })(),

        // Check for mime type support against a player instance
        // Credits: http://diveintohtml5.info/everything.html
        // Related: http://www.leanbackplayer.com/test/h5mt.html
        mime: function(player, type) {
            var media = player.media;

            try {
                // Bail if no checking function
                if (!is.function(media.canPlayType)) {
                    return false;
                }

                // Type specific checks
                if (player.type === 'video') {
                    switch (type) {
                        case 'video/webm':
                            return media.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/no/, '');
                        case 'video/mp4':
                            return media.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/, '');
                        case 'video/ogg':
                            return media.canPlayType('video/ogg; codecs="theora"').replace(/no/, '');
                    }
                } else if (player.type === 'audio') {
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
        },

        // Check for textTracks support
        textTracks: (function() {
            return 'textTracks' in document.createElement('video');
        })()
    };

    // Player instance
    function Plyr(media, config) {
        var player = this;
        var timers = {};
        var api;

        player.fullscreen = {
            active: false
        };

        // Elements cache
        player.elements = {
            container: null,
            buttons: {},
            display: {},
            progress: {},
            inputs: {},
            settings: {
                menu: null,
                panes: {},
                tabs: {}
            },
            media: media,
            captions: null
        };

        // Captions
        player.captions = {
            enabled: false,
            captions: [],
            tracks: [],
            currentTrack: null
        };

        // Set media
        var original = media.cloneNode(true);

        // Debugging
        var log = function() {};
        var warn = function() {};
        if (config.debug && 'console' in window) {
            log = window.console.log;
            warn = window.console.warn;
        }

        // Log config options and support
        log('Config', config);
        log('Support', support);

        // Trigger events, with plyr instance passed
        function trigger(element, type, bubbles, properties) {
            event(element, type, bubbles, extend({}, properties, {
                plyr: api
            }));
        }

        // Find all elements
        function getElements(selector) {
            return player.elements.container.querySelectorAll(selector);
        }

        // Find a single element
        function getElement(selector) {
            return getElements(selector)[0];
        }

        // Trap focus inside container
        function focusTrap() {
            var tabbables = getElements('input:not([disabled]), button:not([disabled])');
            var first = tabbables[0];
            var last = tabbables[tabbables.length - 1];

            function checkFocus(event) {
                // If it is TAB
                if (event.which === 9 && player.fullscreen.active) {
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
            on(player.elements.container, 'keydown', checkFocus);
        }

        // Add elements to HTML5 media (source, tracks, etc)
        function insertElements(type, attributes) {
            if (is.string(attributes)) {
                insertElement(type, player.elements.media, {
                    src: attributes
                });
            } else if (is.array(attributes)) {
                attributes.forEach(function(attribute) {
                    insertElement(type, player.elements.media, attribute);
                });
            }
        }

        // Get icon URL
        function getIconUrl() {
            return {
                url: config.iconUrl,
                absolute: (config.iconUrl.indexOf("http") === 0) || player.browser.isIE
            };
        }

        // Create <svg> icon
        function createIcon(type, attributes) {
            var namespace = 'http://www.w3.org/2000/svg';
            var iconUrl = getIconUrl();
            var iconPath = (!iconUrl.absolute ? iconUrl.url : '') + '#' + config.iconPrefix;

            // Create <svg>
            var icon = document.createElementNS(namespace, 'svg');
            setAttributes(icon, extend(attributes, {
                role: 'presentation'
            }));

            // Create the <use> to reference sprite
            var use = document.createElementNS(namespace, 'use');
            use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', iconPath + '-' + type);

            // Add <use> to <svg>
            icon.appendChild(use);

            return icon;
        }

        // Create hidden text label
        function createLabel(type) {
            var text = config.i18n[type];

            switch (type) {
                case 'pip':
                    text = 'PIP';
                    break;

                case 'airplay':
                    text = 'AirPlay';
                    break;
            }

            return createElement('span', {
                class: config.classes.hidden
            }, text);
        }

        // Create a badge
        function createBadge(text) {
            var badge = createElement('span', {
                class: config.classes.menu.value
            });

            badge.appendChild(createElement('span', {
                class: config.classes.menu.badge
            }, text));

            return badge;
        }

        // Create a <button>
        function createButton(type, attributes) {
            var button = createElement('button');
            var iconDefault;
            var iconToggled;
            var labelKey;

            if (!is.object(attributes)) {
                attributes = {};
            }

            if ('class' in attributes) {
                if (attributes.class.indexOf(config.classes.control) === -1) {
                    attributes.class += ' ' + config.classes.control;
                }
            } else {
                attributes.class = config.classes.control;
            }

            // Large play button
            switch (type) {
                case 'mute':
                    labelKey = 'toggleMute';
                    iconDefault = 'volume';
                    iconToggled = 'muted';
                    break;

                case 'captions':
                    labelKey = 'toggleCaptions';
                    iconDefault = 'captions-off';
                    iconToggled = 'captions-on';
                    break;

                case 'fullscreen':
                    labelKey = 'toggleFullscreen';
                    iconDefault = 'enter-fullscreen';
                    iconToggled = 'exit-fullscreen';
                    break;

                case 'play-large':
                    attributes.class = 'plyr__play-large';
                    type = 'play';
                    labelKey = 'play';
                    iconDefault = 'play';
                    break;

                default:
                    labelKey = type;
                    iconDefault = type;
            }

            // Merge attributes
            extend(attributes, getAttributesFromSelector(config.selectors.buttons[type], attributes));

            // Add toggle icon if needed
            if (is.string(iconToggled)) {
                button.appendChild(createIcon(iconToggled, {
                    class: 'icon--' + iconToggled
                }));
            }

            // Add the icon
            button.appendChild(createIcon(iconDefault));

            // Add the label
            button.appendChild(createLabel(labelKey));

            // Set element attributes
            setAttributes(button, attributes);

            player.elements.buttons[type] = button;

            return button;
        }

        // Create an <input type='range'>
        function createRange(type, attributes) {
            // Seek label
            var label = createElement('label', {
                for: attributes.id,
                class: config.classes.hidden
            }, config.i18n[type]);

            // Seek input
            var input = createElement('input', extend(getAttributesFromSelector(config.selectors.inputs[type]), {
                type: 'range',
                min: 0,
                max: 100,
                step: 0.1,
                value: 0,
                autocomplete: 'off'
            }, attributes));

            player.elements.inputs[type] = input;

            return {
                label: label,
                input: input
            }
        }

        // Create a <progress>
        function createProgress(type, attributes) {
            var progress = createElement('progress', extend(getAttributesFromSelector(config.selectors.display[type]), {
                min: 0,
                max: 100,
                value: 0
            }, attributes));

            // Create the label inside
            if (type !== 'volume') {
                progress.appendChild(createElement('span', null, '0'));

                var suffix = '';
                switch (type) {
                    case 'played':
                        suffix = config.i18n.played;
                        break;

                    case 'buffer':
                        suffix = config.i18n.buffered;
                        break;
                }

                progress.textContent = '% ' + suffix.toLowerCase();
            }

            player.elements.display[type] = progress;

            return progress;
        }

        // Create time display
        function createTime(type) {
            var container = createElement('span', {
                class: 'plyr__time'
            });

            container.appendChild(createElement('span', {
                class: config.classes.hidden
            }, config.i18n[type]));

            container.appendChild(createElement('span', getAttributesFromSelector(config.selectors.display[type]), '00:00'));

            player.elements.display[type] = container;

            return container;
        }

        // Build the default HTML
        function createControls(data) {
            // Create the container
            var controls = createElement('div', getAttributesFromSelector(config.selectors.controls.wrapper));

            // Restart button
            if (inArray(config.controls, 'restart')) {
                controls.appendChild(createButton('restart'));
            }

            // Rewind button
            if (inArray(config.controls, 'rewind')) {
                controls.appendChild(createButton('rewind'));
            }

            // Play Pause button
            // TODO: This should be a toggle button really?
            if (inArray(config.controls, 'play')) {
                controls.appendChild(createButton('play'));
                controls.appendChild(createButton('pause'));
            }

            // Fast forward button
            if (inArray(config.controls, 'fast-forward')) {
                controls.appendChild(createButton('fast-forward'));
            }

            // Progress
            if (inArray(config.controls, 'progress')) {
                var container = createElement('span', getAttributesFromSelector(config.selectors.progress));

                // Seek range slider
                var seek = createRange('seek', {
                    id: 'plyr-seek-' + data.id
                });
                container.appendChild(seek.label);
                container.appendChild(seek.input);

                // TODO: Add loop display indicator

                // Played progress
                container.appendChild(createProgress('played'));

                // Buffer progress
                container.appendChild(createProgress('buffer'));

                // Seek tooltip
                if (config.tooltips.seek) {
                    var tooltip = createElement('span', {
                        role: 'tooltip',
                        class: config.classes.tooltip
                    }, '00:00');

                    container.appendChild(tooltip);
                    player.elements.display.seekTooltip = tooltip;
                }

                player.elements.progress = container;
                controls.appendChild(player.elements.progress);
            }

            // Media current time display
            if (inArray(config.controls, 'current-time')) {
                controls.appendChild(createTime('currentTime'));
            }

            // Media duration display
            if (inArray(config.controls, 'duration')) {
                controls.appendChild(createTime('duration'));
            }

            // Toggle mute button
            if (inArray(config.controls, 'mute')) {
                controls.appendChild(createButton('mute'));
            }

            // Volume range control
            if (inArray(config.controls, 'volume')) {
                var volume = createElement('span', {
                    class: 'plyr__volume'
                });

                // Set the attributes
                var attributes = {
                    max: 10,
                    value: config.volume
                };

                // Create the volume range slider
                var range = createRange('volume', extend(attributes, {
                    id: 'plyr-volume-' + data.id
                }));
                volume.appendChild(range.label);
                volume.appendChild(range.input);

                // Create the display progress
                var progress = createProgress('volume', attributes);
                volume.appendChild(progress);

                controls.appendChild(volume);
            }

            // Toggle captions button
            if (inArray(config.controls, 'captions')) {
                controls.appendChild(createButton('captions'));
            }

            // Settings button / menu
            if (inArray(config.controls, 'settings')) {
                var menu = createElement('span', extend(getAttributesFromSelector(config.selectors.buttons.settings), {
                    class: 'plyr__menu'
                }));

                menu.appendChild(createButton('settings', {
                    id: 'plyr-settings-toggle-' + data.id,
                    'aria-haspopup': true,
                    'aria-controls': 'plyr-settings-' + data.id,
                    'aria-expanded': false
                }));

                var form = createElement('form', {
                    class: 'plyr__menu__container',
                    id: 'plyr-settings-' + data.id,
                    'aria-hidden': true,
                    'aria-labelled-by': 'plyr-settings-toggle-' + data.id,
                    role: 'tablist',
                    tabindex: -1
                });

                var inner = createElement('div');

                var home = createElement('div', {
                    id: 'plyr-settings-' + data.id + '-home',
                    'aria-hidden': false,
                    'aria-labelled-by': 'plyr-settings-toggle-' + data.id,
                    role: 'tabpanel'
                });

                var tabs = createElement('ul', {
                    role: 'tablist'
                });

                ['captions', 'quality', 'speed', 'loop'].forEach(function(type) {
                    var tab = createElement('li', {
                        role: 'tab'
                    });

                    var button = createElement('button', extend(getAttributesFromSelector(config.selectors.buttons.settings), {
                        type: 'button',
                        class: config.classes.control + ' ' + config.classes.control + '--forward',
                        id: 'plyr-settings-' + data.id + '-' + type + '-tab',
                        'aria-haspopup': true,
                        'aria-controls': 'plyr-settings-' + data.id + '-' + type,
                        'aria-expanded': false
                    }), config.i18n[type]);

                    var value = createElement('span', {
                        class: config.classes.menu.value
                    });

                    // Speed contains HTML entities
                    value.innerHTML = data[type];

                    button.appendChild(value);

                    tab.appendChild(button);

                    tabs.appendChild(tab);

                    player.elements.settings.tabs[type] = tab;
                });

                home.appendChild(tabs);

                inner.appendChild(home);

                ['captions', 'quality', 'speed', 'loop'].forEach(function(type) {
                    var pane = createElement('div', {
                        id: 'plyr-settings-' + data.id + '-' + type,
                        'aria-hidden': true,
                        'aria-labelled-by': 'plyr-settings-' + data.id + '-' + type + '-tab',
                        role: 'tabpanel',
                        tabindex: -1
                    });

                    var back = createElement('button', {
                        type: 'button',
                        class: config.classes.control + ' ' + config.classes.control + '--back',
                        'aria-haspopup': true,
                        'aria-controls': 'plyr-settings-' + data.id + '-home',
                        'aria-expanded': false
                    }, config.i18n[type]);

                    pane.appendChild(back);

                    var options = createElement('ul');

                    pane.appendChild(options);

                    inner.appendChild(pane);

                    player.elements.settings.panes[type] = pane;
                });

                form.appendChild(inner);

                menu.appendChild(form);

                controls.appendChild(menu);

                player.elements.settings.menu = menu;
            }

            // Picture in picture button
            if (inArray(config.controls, 'pip') && support.pip) {
                controls.appendChild(createButton('pip'));
            }

            // Airplay button
            if (inArray(config.controls, 'airplay') && support.airplay) {
                controls.appendChild(createButton('airplay'));
            }

            // Toggle fullscreen button
            if (inArray(config.controls, 'fullscreen')) {
                controls.appendChild(createButton('fullscreen'));
            }

            player.elements.controls = controls;

            setLoopMenu();
            setSpeedMenu();

            return controls;
        }

        // Set the YouTube quality menu
        // TODO: Support for HTML5
        // YouTube: "hd2160", "hd1440", "hd1080", "hd720", "large", "medium", "small", "tiny", "auto"
        function setQualityMenu(options, current) {
            var list = player.elements.settings.panes.quality.querySelector('ul');

            // Empty the menu
            emptyElement(list);

            // Get the badge HTML for HD, 4K etc
            function getBadge(quality) {
                var label = "";

                switch (quality) {
                    case 'hd2160':
                        label = '4K';
                        break;
                    case 'hd1440':
                        label = 'WQHD';
                        break;
                    case 'hd1080':
                        label = 'HD';
                        break;
                    case 'hd720':
                        label = 'HD';
                        break;
                }

                if (!label.length) {
                    return null;
                }

                return createBadge(label);
            }

            // Translate the quality key into a nice label
            function getLabel(quality) {
                switch (quality) {
                    case 'hd2160':
                        return '2160P';
                    case 'hd1440':
                        return '1440P';
                    case 'hd1080':
                        return '1080P';
                    case 'hd720':
                        return '720P';
                    case 'large':
                        return '480P';
                    case 'medium':
                        return '360P';
                    case 'small':
                        return '240P';
                    default:
                        return 'Auto';
                }
            }

            if (is.array(options) && !is.empty(options)) {
                // Remove any unwanted quality levels
                var filtered = options.filter(function(quality) {
                    return ['tiny', 'small'].indexOf(quality) === -1;
                });

                filtered.forEach(function(quality) {
                    var item = createElement('li');

                    var label = createElement('label', {
                        class: config.classes.control,
                        for: 'plyr-quality-' + quality
                    });

                    var radio = createElement('input', extend(getAttributesFromSelector(config.selectors.inputs.quality), {
                        type: 'radio',
                        id: 'plyr-quality-' + quality,
                        name: 'plyr-quality',
                        value: quality,
                    }));

                    if (quality === config.quality.selected) {
                        radio.setAttribute('checked', '');
                    }

                    label.appendChild(radio);
                    label.appendChild(document.createTextNode(getLabel(quality)));

                    var badge = getBadge(quality);
                    if (is.htmlElement(badge)) {
                        label.appendChild(badge);
                    }

                    item.appendChild(label);

                    list.appendChild(item);
                });
            }
        }

        // Set the looping options
        function setLoopMenu() {
            var options = ['start', 'end', 'all', 'reset'];
            var list = player.elements.settings.panes.loop.querySelector('ul');

            // Empty the menu
            emptyElement(list);

            options.forEach(function(option) {
                var item = createElement('li');

                var button = createElement('button', extend(getAttributesFromSelector(config.selectors.buttons.loop), {
                    type: 'button',
                    class: config.classes.control,
                    'data-plyr-loop-action': option
                }), config.i18n[option]);

                if (inArray(['start', 'end'], option)) {
                    var badge = createBadge('0:00');
                    button.appendChild(badge);
                }

                item.appendChild(button);

                list.appendChild(item);
            });
        }

        // Set a list of available captions languages
        function setCaptionsMenu() {
            var list = player.elements.settings.panes.captions.querySelector('ul');

            // Empty the menu
            emptyElement(list);

            // If there's no captions, bail
            if (is.empty(player.captions.tracks)) {
                return;
            }

            [].forEach.call(player.captions.tracks, function(track) {
                if (is.function(track)) {
                    return;
                }

                var item = createElement('li');

                var label = createElement('label', {
                    class: config.classes.control,
                    for: 'plyr-language-' + track.language
                });

                var radio = createElement('input', extend(getAttributesFromSelector(config.selectors.inputs.language), {
                    type: 'radio',
                    id: 'plyr-language-' + track.language,
                    name: 'plyr-language',
                    value: track.language,
                }));

                if (track.language === config.captions.language.toLowerCase()) {
                    radio.setAttribute('checked', '');
                }

                label.appendChild(radio);
                label.appendChild(document.createTextNode(track.label || track.language));
                label.appendChild(createBadge(track.language.toUpperCase()));

                item.appendChild(label);

                list.appendChild(item);
            });
        }

        // Set a list of available captions languages
        function setSpeedMenu(options) {
            var list = player.elements.settings.panes.speed.querySelector('ul');

            // Empty the menu
            emptyElement(list);

            // If there's no captions, bail
            if (!is.array(options)) {
                options = config.speed.options;
            }

            options.forEach(function(speed) {
                var item = createElement('li');

                var label = createElement('label', {
                    class: config.classes.control,
                    for: 'plyr-speed-' + speed.toString().replace('.', '-')
                });

                var radio = createElement('input', extend(getAttributesFromSelector(config.selectors.inputs.speed), {
                    type: 'radio',
                    id: 'plyr-speed-' + speed.toString().replace('.', '-'),
                    name: 'plyr-speed',
                    value: speed,
                }));

                if (speed === config.speed.selected) {
                    radio.setAttribute('checked', '');
                }

                label.appendChild(radio);
                label.insertAdjacentHTML('beforeend', '&times;' + speed);

                item.appendChild(label);

                list.appendChild(item);
            });
        }

        // Setup fullscreen
        function setupFullscreen() {
            if (!player.supported.full) {
                return;
            }

            if ((player.type !== 'audio' || config.fullscreen.allowAudio) && config.fullscreen.enabled) {
                // Check for native support
                var nativeSupport = support.fullscreen;

                if (nativeSupport || (config.fullscreen.fallback && !inFrame())) {
                    log((nativeSupport ? 'Native' : 'Fallback') + ' fullscreen enabled');

                    // Add styling hook
                    toggleClass(player.elements.container, config.classes.fullscreen.enabled, true);
                } else {
                    log('Fullscreen not supported and fallback disabled');
                }

                // Toggle state
                if (player.elements.buttons && player.elements.buttons.fullscreen) {
                    toggleState(player.elements.buttons.fullscreen, false);
                }

                // Setup focus trap
                focusTrap();
            }
        }

        // Setup captions
        function setupCaptions() {
            // Bail if not HTML5 video or textTracks not supported
            if (player.type !== 'video' || !support.textTracks) {
                return;
            }

            // Inject the container
            if (!is.htmlElement(player.elements.captions)) {
                player.elements.captions = createElement('div', getAttributesFromSelector(config.selectors.captions));
                player.elements.wrapper.appendChild(player.elements.captions);
            }

            // Get tracks
            player.captions.tracks = player.elements.media.textTracks;

            // If no caption file exists, hide container for caption text
            if (is.empty(player.captions.tracks)) {
                toggleClass(player.elements.container, config.classes.captions.enabled);
            } else {
                var language = config.captions.language.toLowerCase();

                // Turn off native caption rendering to avoid double captions
                [].forEach.call(player.captions.tracks, function(track) {
                    // Remove previous bindings (if we've changed source or language)
                    off(track, 'cuechange', setActiveCue);

                    // Hide captions
                    track.mode = 'hidden';

                    // If language matches, it's the selected track
                    if (track.language === language) {
                        player.captions.currentTrack = track;
                    }
                });

                // If we couldn't get the requested language, we get the first
                if (!is.track(player.captions.currentTrack)) {
                    warn('No language found to match ' + language + ' in tracks');
                    player.captions.currentTrack = player.captions.tracks[0];
                }

                // Enable UI
                showCaptions(player);

                // If it's a caption or subtitle, render it
                var track = player.captions.currentTrack;
                if (is.track(track) && inArray(['captions', 'subtitles'], track.kind)) {
                    on(track, 'cuechange', setActiveCue);

                    // If we change the active track while a cue is already displayed we need to update it
                    if (track.activeCues && track.activeCues.length > 0) {
                        setActiveCue(track);
                    }
                }

                // Set available languages in list
                setCaptionsMenu();
            }
        }

        // Get current selected caption language
        function getLanguage() {
            if (!support.textTracks || is.empty(player.captions.tracks)) {
                return 'No Subs';
            }

            if (player.captions.enabled) {
                return player.captions.currentTrack.label;
            } else {
                return 'Disabled';
            }
        }

        // Display active caption if it contains text
        function setActiveCue(track) {
            // Get the track from the event if needed
            if (is.event(track)) {
                track = track.target;
            }

            var active = track.activeCues[0];

            // Display a cue, if there is one
            if (is.cue(active)) {
                setCaption(active.getCueAsHTML());
            } else {
                setCaption();
            }
        }

        // Select active caption
        function setLanguage(language) {
            // Save config
            if (is.string(language)) {
                config.captions.language = language.toLowerCase();
            } else if (is.event(language)) {
                config.captions.language = language.target.value.toLowerCase();
            }

            // Clear caption
            setCaption();

            // Re-run setup
            setupCaptions();
        }

        // Set the current caption
        function setCaption(caption) {
            var captions = getElement(config.selectors.captions);

            if (is.htmlElement(captions)) {
                var content = createElement('span');

                // Empty the container
                emptyElement(captions);

                // Default to empty
                if (is.undefined(caption)) {
                    caption = '';
                }

                // Set the span content
                if (is.string(caption)) {
                    content.textContent = caption.trim();
                } else {
                    content.appendChild(caption);
                }

                // Set new caption text
                captions.appendChild(content);

                // Force redraw (for Safari)
                // var redraw = captions.offsetHeight;
            }
        }

        // Display captions container and button (for initialization)
        function showCaptions() {
            // If there's no caption toggle, bail
            if (!player.elements.buttons.captions) {
                return;
            }

            toggleClass(player.elements.container, config.classes.captions.enabled, true);

            // Try to load the value from storage
            var active = player.storage.captions;

            // Otherwise fall back to the default config
            if (!is.boolean(active)) {
                active = config.captions.defaultActive;
            }

            if (active) {
                toggleClass(player.elements.container, config.classes.captions.active, true);
                toggleState(player.elements.buttons.captions, true);
            }
        }

        // Toggle captions
        function toggleCaptions(show) {
            // If there's no full support, or there's no caption toggle
            if (!player.supported.full || !player.elements.buttons.captions) {
                return;
            }

            // If the method is called without parameter, toggle based on current value
            if (!is.boolean(show)) {
                show = (player.elements.container.className.indexOf(config.classes.captions.active) === -1);
            }

            // Set global
            player.captions.enabled = show;

            // Toggle state
            toggleState(player.elements.buttons.captions, player.captions.enabled);

            // Add class hook
            toggleClass(player.elements.container, config.classes.captions.active, player.captions.enabled);

            // Trigger an event
            trigger(player.elements.container, player.captions.enabled ? 'captionsenabled' : 'captionsdisabled', true);

            // Save captions state to localStorage
            updateStorage({
                captions: player.captions.enabled
            });
        }

        // Insert controls
        function injectControls() {
            // Sprite
            if (config.loadSprite) {
                var iconUrl = getIconUrl();

                // Only load external sprite using AJAX
                if (iconUrl.absolute) {
                    log('AJAX loading absolute SVG sprite' + (player.browser.isIE ? ' (due to IE)' : ''));
                    loadSprite(iconUrl.url, "sprite-plyr");
                } else {
                    log('Sprite will be used as external resource directly');
                }
            }

            // Larger overlaid play button
            if (inArray(config.controls, 'play-large')) {
                player.elements.buttons.playLarge = createButton('play-large');
                player.elements.container.appendChild(player.elements.buttons.playLarge);
            }

            // Create a unique ID
            player.id = Math.floor(Math.random() * 10000);

            // Create controls
            var controls = createControls({
                id: player.id,
                seektime: config.seekTime,
                speed: getSpeed(),
                // TODO: Get current quality
                quality: 'HD',
                // TODO: Set language automatically based on UA?
                captions: getLanguage(),
                // TODO: Get loop
                loop: 'None'
            });

            // Controls container
            var target;

            // Inject to custom location
            if (is.string(config.selectors.controls.container)) {
                target = document.querySelector(config.selectors.controls.container);
            }

            // Inject into the container by default
            if (!is.htmlElement(target)) {
                target = player.elements.container
            }

            // Inject controls HTML
            // target.insertAdjacentHTML('beforeend', html);
            target.appendChild(controls);

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
        // TODO: Re-configure for new elements
        /*function findElements() {
            try {
                player.elements.controls = getElement(config.selectors.controls.wrapper);

                // Buttons
                player.elements.buttons = {
                    play: getElements(config.selectors.buttons.play),
                    pause: getElement(config.selectors.buttons.pause),
                    restart: getElement(config.selectors.buttons.restart),
                    rewind: getElement(config.selectors.buttons.rewind),
                    forward: getElement(config.selectors.buttons.forward),
                    fullscreen: getElement(config.selectors.buttons.fullscreen),
                    settings: getElement(config.selectors.buttons.settings),
                    pip: getElement(config.selectors.buttons.pip),
                    //lang: getElement(config.selectors.buttons.captions_lang),
                    speed: getElement(config.selectors.buttons.speed),
                    loop: getElement(config.selectors.buttons.loop),
                    mute: getElement(config.selectors.buttons.mute),
                    captions: getElement(config.selectors.buttons.captions)
                };

                // Progress
                player.elements.progress = getElement(config.selectors.progress);

                // Inputs
                player.elements.inputs = {
                    seek: getElement(config.selectors.inputs.seek),
                    volume: getElement(config.selectors.inputs.volume)
                };

                // Display
                player.elements.display = {
                    buffer: getElement(config.selectors.display.buffer),
                    played: getElement(config.selectors.display.played),
                    volume: getElement(config.selectors.display.volume),
                    duration: getElement(config.selectors.display.duration),
                    currentTime: getElement(config.selectors.display.currentTime),
                };

                // Seek tooltip
                if (is.htmlElement(player.elements.progress)) {
                    player.elements.display.seekTooltip = player.elements.progress.querySelector('.' + config.classes.tooltip);
                }

                return true;
            } catch (error) {
                warn('It looks like there is a problem with your custom controls HTML', error);

                // Restore native video controls
                toggleNativeControls(true);

                return false;
            }
        }*/

        // Toggle style hook
        function toggleStyleHook() {
            toggleClass(player.elements.container, config.selectors.container.replace('.', ''), player.supported.full);
        }

        // Toggle native controls
        function toggleNativeControls(toggle) {
            if (toggle && inArray(types.html5, player.type)) {
                player.elements.media.setAttribute('controls', '');
            } else {
                player.elements.media.removeAttribute('controls');
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
                player.elements.container.setAttribute('aria-label', config.title);
            }

            // If there's a play button, set label
            if (player.supported.full) {
                if (is.htmlElement(player.elements.buttons.play)) {
                    player.elements.buttons.play.setAttribute('aria-label', label);
                }
                if (is.htmlElement(player.elements.buttons.playLarge)) {
                    player.elements.buttons.playLarge.setAttribute('aria-label', label);
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
            player.storage = {};

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
                // version of player. See: https://github.com/Selz/plyr/pull/313
                // Update the key to be JSON
                updateStorage({
                    volume: parseFloat(value)
                });
            } else {
                // Assume it's JSON from this or a later version of plyr
                player.storage = JSON.parse(value);
            }
        }

        // Save a value back to local storage
        function updateStorage(value) {
            // Bail if we don't have localStorage support or it's disabled
            if (!support.storage || !config.storage.enabled) {
                return;
            }

            // Update the working copy of the values
            extend(player.storage, value);

            // Update storage
            window.localStorage.setItem(config.storage.key, JSON.stringify(player.storage));
        }

        // Setup media
        function setupMedia() {
            // If there's no media, bail
            if (!player.elements.media) {
                warn('No media element found!');
                return;
            }

            if (player.supported.full) {
                // Add type class
                toggleClass(player.elements.container, config.classes.type.replace('{0}', player.type), true);

                // Add video class for embeds
                // This will require changes if audio embeds are added
                if (inArray(types.embed, player.type)) {
                    toggleClass(player.elements.container, config.classes.type.replace('{0}', 'video'), true);
                }

                // Check for picture-in-picture support
                toggleClass(player.elements.container, config.classes.pip.enabled, support.pip && player.type === 'video');

                // Check for airplay support
                toggleClass(player.elements.container, config.classes.airplay.enabled, support.airplay && inArray(types.html5, player.type));

                // If there's no autoplay attribute, assume the video is stopped and add state class
                toggleClass(player.elements.container, config.classes.stopped, config.autoplay);

                // Add iOS class
                toggleClass(player.elements.container, config.classes.isIos, player.browser.isIos);

                // Add touch class
                toggleClass(player.elements.container, config.classes.isTouch, player.browser.isTouch);

                // Inject the player wrapper
                if (player.type === 'video') {
                    // Create the wrapper div
                    var wrapper = createElement('div');
                    wrapper.setAttribute('class', config.classes.videoWrapper);

                    // Wrap the video in a container
                    wrap(player.elements.media, wrapper);

                    // Cache the container
                    player.elements.wrapper = wrapper;
                }
            }

            // Embeds
            if (inArray(types.embed, player.type)) {
                setupEmbed();
            }
        }

        // Setup YouTube/Vimeo
        function setupEmbed() {
            var container = createElement('div');
            var mediaId;
            var id = player.type + '-' + Math.floor(Math.random() * (10000));

            // Parse IDs from URLs if supplied
            switch (player.type) {
                case 'youtube':
                    mediaId = parseYouTubeId(player.embedId);
                    break;

                default:
                    mediaId = player.embedId;
            }

            // Remove old containers
            var containers = getElements('[id^="' + player.type + '-"]');
            for (var i = containers.length - 1; i >= 0; i--) {
                remove(containers[i]);
            }

            // Add embed class for responsive
            toggleClass(player.elements.media, config.classes.videoWrapper, true);
            toggleClass(player.elements.media, config.classes.embedWrapper, true);

            if (player.type === 'youtube') {
                // Create the YouTube container
                player.elements.media.appendChild(container);

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
            } else if (player.type === 'vimeo') {
                // Vimeo needs an extra div to hide controls on desktop (which has full support)
                if (player.supported.full) {
                    player.elements.media.appendChild(container);
                } else {
                    container = player.elements.media;
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
            } else if (player.type === 'soundcloud') {
                // TODO: Currently unsupported and undocumented
                // Inject the iframe
                var soundCloud = createElement('iframe');

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
                player.elements.media.appendChild(container);

                // Load the API if not already
                if (!window.SC) {
                    injectScript(config.urls.soundcloud.api);
                }

                // Wait for SC load
                var soundCloudTimer = window.setInterval(function() {
                    if (window.SC && soundCloud.loaded) {
                        window.clearInterval(soundCloudTimer);
                        soundcloudReady.call(soundCloud);
                    }
                }, 50);
            }
        }

        // When embeds are ready
        function embedReady() {
            // Setup the UI and call ready if full support
            if (player.supported.full) {
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
            player.embed = new window.YT.Player(container.id, {
                videoId: videoId,
                playerVars: {
                    autoplay: (config.autoplay ? 1 : 0),
                    controls: (player.supported.full ? 0 : 1),
                    rel: 0,
                    showinfo: 0,
                    iv_load_policy: 3,
                    cc_load_policy: (config.captions.defaultActive ? 1 : 0),
                    cc_lang_pref: 'en',
                    wmode: 'transparent',
                    modestbranding: 1,
                    disablekb: 1,
                    origin: 'https://plyr.io'
                },
                events: {
                    'onError': function(event) {
                        trigger(player.elements.container, 'error', true, {
                            code: event.data,
                            embed: event.target
                        });
                    },
                    'onPlaybackQualityChange': function(event) {
                        // Get the instance
                        var instance = event.target;

                        // Get current quality
                        var quality = instance.getPlaybackQuality();

                        // var set = player.setPlaybackQuality();
                        console.warn(quality);
                    },
                    'onReady': function(event) {
                        // Get the instance
                        var instance = event.target;

                        // Create a faux HTML5 API using the YouTube API
                        player.elements.media.play = function() {
                            instance.playVideo();
                            player.elements.media.paused = false;
                        };
                        player.elements.media.pause = function() {
                            instance.pauseVideo();
                            player.elements.media.paused = true;
                        };
                        player.elements.media.stop = function() {
                            instance.stopVideo();
                            player.elements.media.paused = true;
                        };
                        player.elements.media.duration = instance.getDuration();
                        player.elements.media.paused = true;
                        player.elements.media.currentTime = 0;
                        player.elements.media.muted = instance.isMuted();

                        // Get available speeds
                        var speed = instance.getPlaybackRate();
                        var speedOptions = instance.getAvailablePlaybackRates();
                        //var set = instance.setPlaybackRate();
                        console.warn(speed, speedOptions);

                        // Set title
                        config.title = instance.getVideoData().title;

                        // Set the tabindex
                        if (player.supported.full) {
                            player.elements.media.querySelector('iframe').setAttribute('tabindex', -1);
                        }

                        // Update UI
                        embedReady();

                        // Trigger timeupdate
                        trigger(player.elements.media, 'timeupdate');

                        // Trigger timeupdate
                        trigger(player.elements.media, 'durationchange');

                        // Reset timer
                        window.clearInterval(timers.buffering);

                        // Setup buffering
                        timers.buffering = window.setInterval(function() {
                            // Get loaded % from YouTube
                            player.elements.media.buffered = instance.getVideoLoadedFraction();

                            // Trigger progress only when we actually buffer something
                            if (player.elements.media.lastBuffered === null || player.elements.media.lastBuffered < player.elements.media.buffered) {
                                trigger(player.elements.media, 'progress');
                            }

                            // Set last buffer point
                            player.elements.media.lastBuffered = player.elements.media.buffered;

                            // Bail if we're at 100%
                            if (player.elements.media.buffered === 1) {
                                window.clearInterval(timers.buffering);

                                // Trigger event
                                trigger(player.elements.media, 'canplaythrough');
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
                                player.elements.media.paused = true;
                                trigger(player.elements.media, 'ended');
                                break;

                            case 1:
                                player.elements.media.paused = false;

                                // If we were seeking, fire seeked event
                                if (player.elements.media.seeking) {
                                    trigger(player.elements.media, 'seeked');
                                }

                                player.elements.media.seeking = false;
                                trigger(player.elements.media, 'play');
                                trigger(player.elements.media, 'playing');

                                // Poll to get playback progress
                                timers.playing = window.setInterval(function() {
                                    // Set the current time
                                    player.elements.media.currentTime = instance.getCurrentTime();

                                    // Trigger timeupdate
                                    trigger(player.elements.media, 'timeupdate');
                                }, 100);

                                // Check duration again due to YouTube bug
                                // https://github.com/Selz/plyr/issues/374
                                // https://code.google.com/p/gdata-issues/issues/detail?id=8690
                                if (player.elements.media.duration !== instance.getDuration()) {
                                    player.elements.media.duration = instance.getDuration();
                                    trigger(player.elements.media, 'durationchange');
                                }

                                // Get quality
                                var qualityOptions = instance.getAvailableQualityLevels();
                                var quality = instance.getPlaybackQuality();
                                setQualityMenu(qualityOptions, quality);

                                break;

                            case 2:
                                player.elements.media.paused = true;
                                trigger(player.elements.media, 'pause');
                                break;
                        }

                        trigger(player.elements.container, 'statechange', false, {
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
                id: mediaId,
                loop: config.loop,
                autoplay: config.autoplay,
                byline: false,
                portrait: false,
                title: false
            });

            // Create a faux HTML5 API using the Vimeo API
            player.elements.media.play = function() {
                player.embed.play();
                player.elements.media.paused = false;
            };
            player.elements.media.pause = function() {
                player.embed.pause();
                player.elements.media.paused = true;
            };
            player.elements.media.stop = function() {
                player.embed.stop();
                player.elements.media.paused = true;
            };

            player.elements.media.paused = true;
            player.elements.media.currentTime = 0;

            // Update UI
            embedReady();

            player.embed.getCurrentTime().then(function(value) {
                player.elements.media.currentTime = value;

                // Trigger timeupdate
                trigger(player.elements.media, 'timeupdate');
            });

            player.embed.getDuration().then(function(value) {
                player.elements.media.duration = value;

                // Trigger timeupdate
                trigger(player.elements.media, 'durationchange');
            });

            // TODO: Captions
            /*if (config.captions.defaultActive) {
                player.embed.enableTextTrack('en');
            }*/

            player.embed.on('loaded', function() {
                // Fix keyboard focus issues
                // https://github.com/Selz/plyr/issues/317
                if (is.htmlElement(player.embed.element) && player.supported.full) {
                    player.embed.element.setAttribute('tabindex', -1);
                }
            });

            player.embed.on('play', function() {
                player.elements.media.paused = false;
                trigger(player.elements.media, 'play');
                trigger(player.elements.media, 'playing');
            });

            player.embed.on('pause', function() {
                player.elements.media.paused = true;
                trigger(player.elements.media, 'pause');
            });

            player.embed.on('timeupdate', function(data) {
                player.elements.media.seeking = false;
                player.elements.media.currentTime = data.seconds;
                trigger(player.elements.media, 'timeupdate');
            });

            player.embed.on('progress', function(data) {
                player.elements.media.buffered = data.percent;
                trigger(player.elements.media, 'progress');

                if (parseInt(data.percent) === 1) {
                    // Trigger event
                    trigger(player.elements.media, 'canplaythrough');
                }
            });

            player.embed.on('seeked', function() {
                player.elements.media.seeking = false;
                trigger(player.elements.media, 'seeked');
                trigger(player.elements.media, 'play');
            });

            player.embed.on('ended', function() {
                player.elements.media.paused = true;
                trigger(player.elements.media, 'ended');
            });
        }

        // Soundcloud ready
        function soundcloudReady() {
            /* jshint validthis: true */
            player.embed = window.SC.Widget(this);

            // Setup on ready
            player.embed.bind(window.SC.Widget.Events.READY, function() {
                // Create a faux HTML5 API using the Soundcloud API
                player.elements.media.play = function() {
                    player.embed.play();
                    player.elements.media.paused = false;
                };
                player.elements.media.pause = function() {
                    player.embed.pause();
                    player.elements.media.paused = true;
                };
                player.elements.media.stop = function() {
                    player.embed.seekTo(0);
                    player.embed.pause();
                    player.elements.media.paused = true;
                };

                player.elements.media.paused = true;
                player.elements.media.currentTime = 0;

                player.embed.getDuration(function(value) {
                    player.elements.media.duration = value / 1000;

                    // Update UI
                    embedReady();
                });

                player.embed.getPosition(function(value) {
                    player.elements.media.currentTime = value;

                    // Trigger timeupdate
                    trigger(player.elements.media, 'timeupdate');
                });

                player.embed.bind(window.SC.Widget.Events.PLAY, function() {
                    player.elements.media.paused = false;
                    trigger(player.elements.media, 'play');
                    trigger(player.elements.media, 'playing');
                });

                player.embed.bind(window.SC.Widget.Events.PAUSE, function() {
                    player.elements.media.paused = true;
                    trigger(player.elements.media, 'pause');
                });

                player.embed.bind(window.SC.Widget.Events.PLAY_PROGRESS, function(data) {
                    player.elements.media.seeking = false;
                    player.elements.media.currentTime = data.currentPosition / 1000;
                    trigger(player.elements.media, 'timeupdate');
                });

                player.embed.bind(window.SC.Widget.Events.LOAD_PROGRESS, function(data) {
                    player.elements.media.buffered = data.loadProgress;
                    trigger(player.elements.media, 'progress');

                    if (parseInt(data.loadProgress) === 1) {
                        // Trigger event
                        trigger(player.elements.media, 'canplaythrough');
                    }
                });

                player.embed.bind(window.SC.Widget.Events.FINISH, function() {
                    player.elements.media.paused = true;
                    trigger(player.elements.media, 'ended');
                });
            });
        }

        // Play media
        function play() {
            if ('play' in player.elements.media) {
                player.elements.media.play();
            }
        }

        // Pause media
        function pause() {
            if ('pause' in player.elements.media) {
                player.elements.media.pause();
            }
        }

        // Toggle playback
        function togglePlay(toggle) {
            // True toggle
            if (!is.boolean(toggle)) {
                toggle = player.elements.media.paused;
            }

            if (toggle) {
                play();
            } else {
                pause();
            }

            return toggle;
        }

        // Toggle loop
        // TODO: Set the indicator on load as user may pass loop as config
        function toggleLoop(type) {
            // Set default to be a true toggle
            if (!inArray(['start', 'end', 'all', 'none', 'toggle'], type)) {
                type = 'toggle';
            }

            var currentTime = Number(player.elements.media.currentTime);

            switch (type) {
                case 'start':
                    if (config.loop.end && config.loop.end <= currentTime) {
                        config.loop.end = null;
                    }
                    config.loop.start = currentTime;
                    config.loop.indicator.start = player.elements.display.played.value;
                    break;

                case 'end':
                    if (config.loop.start >= currentTime) {
                        return;
                    }
                    config.loop.end = currentTime;
                    config.loop.indicator.end = player.elements.display.played.value;
                    break;

                case 'all':
                    config.loop.start = 0;
                    config.loop.end = player.elements.media.duration - 2;
                    config.loop.indicator.start = 0;
                    config.loop.indicator.end = 100;
                    break;

                case 'toggle':
                    if (config.loop.active) {
                        config.loop.start = 0;
                        config.loop.end = null;
                    } else {
                        config.loop.start = 0;
                        config.loop.end = player.elements.media.duration - 2;
                    }
                    break;

                default:
                    config.loop.start = 0;
                    config.loop.end = null;
                    break;
            }

            // Check if can loop
            config.loop.active = is.number(config.loop.start) && is.number(config.loop.end);
            var start = updateTimeDisplay(config.loop.start, getElement('[data-plyr-loop="start"]'));
            var end = null;

            if (is.number(config.loop.end)) {
                // Find the <span> inside button
                end = updateTimeDisplay(config.loop.end, document.querySelector('[data-loop__value="loopout"]'));
            } else {
                // Find the <span> inside button
                //end = document.querySelector('[data-loop__value="loopout"]').innerHTML = '';
            }

            if (config.loop.active) {
                // TODO: Improve the design of the loop indicator and put styling in CSS where it's meant to be
                //getElement('[data-menu="loop"]').innerHTML = start + ' - ' + end;
                //getElement(config.selectors.progress.looped).style.position = 'absolute';
                //getElement(config.selectors.progress.looped).style.left = config.loopinPositionPercentage + '%';
                //getElement(config.selectors.progress.looped).style.width = (config.loopoutPositionPercentage - config.loopinPositionPercentage) + '%';
                //getElement(config.selectors.progress.looped).style.background = '#ffbb00';
                //getElement(config.selectors.progress.looped).style.height = '3px';
                //getElement(config.selectors.progress.looped).style.top = '3px';
                //getElement(config.selectors.progress.looped).style['border-radius'] = '100px';
            } else {
                //getElement('[data-menu="loop"]').innerHTML = config.i18n.loopNone;
                //getElement(config.selectors.progress.looped).style.width = '0px';
            }
        }

        // Set playback speed
        function setSpeed(speed) {
            // Load speed from storage or default value
            if (is.event(speed)) {
                speed = parseFloat(speed.target.value);
            } else if (!is.number(speed)) {
                speed = parseFloat(player.storage.speed || config.speed.selected);
            }

            // Set min/max
            if (speed < 0.1) {
                speed = 0.1;
            }
            if (speed > 2.0) {
                speed = 2.0;
            }

            if (!is.array(config.speed.options)) {
                warn('Invalid speeds format');
                return;
            }

            // Store current speed
            config.speed.selected = speed;

            // Set HTML5 speed
            // TODO: set YouTube
            player.elements.media.playbackRate = speed;

            // Save speed to localStorage
            updateStorage({
                speed: speed
            });
        }

        // Get the current speed value
        function getSpeed() {
            return config.speed.selected.toFixed(1).toString().replace('.0', '') + '&times;'
        }

        // Rewind
        function rewind(seekTime) {
            // Use default if needed
            if (!is.number(seekTime)) {
                seekTime = config.seekTime;
            }
            seek(player.elements.media.currentTime - seekTime);
        }

        // Fast forward
        function forward(seekTime) {
            // Use default if needed
            if (!is.number(seekTime)) {
                seekTime = config.seekTime;
            }
            seek(player.elements.media.currentTime + seekTime);
        }

        // Seek to time
        // The input parameter can be an event or a number
        function seek(input) {
            var targetTime = 0;
            var paused = player.elements.media.paused;
            var duration = getDuration();

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
                player.elements.media.currentTime = targetTime.toFixed(4);
            } catch (e) {}

            // Embeds
            if (inArray(types.embed, player.type)) {
                switch (player.type) {
                    case 'youtube':
                        player.embed.seekTo(targetTime);
                        break;

                    case 'vimeo':
                        // Round to nearest second for vimeo
                        player.embed.setCurrentTime(targetTime.toFixed(0));
                        break;

                    case 'soundcloud':
                        player.embed.seekTo(targetTime * 1000);
                        break;
                }

                if (paused) {
                    pause();
                }

                // Trigger timeupdate
                trigger(player.elements.media, 'timeupdate');

                // Set seeking flag
                player.elements.media.seeking = true;

                // Trigger seeking
                trigger(player.elements.media, 'seeking');
            }

            // Logging
            log('Seeking to ' + player.elements.media.currentTime + ' seconds');
        }

        // Get the duration (or custom if set)
        function getDuration() {
            // It should be a number, but parse it just incase
            var duration = parseInt(config.duration);

            // True duration
            var mediaDuration = 0;

            // Only if duration available
            if (player.elements.media.duration !== null && !isNaN(player.elements.media.duration)) {
                mediaDuration = player.elements.media.duration;
            }

            // If custom duration is funky, use regular duration
            return (isNaN(duration) ? mediaDuration : duration);
        }

        // Check playing state
        function checkPlaying() {
            toggleClass(player.elements.container, config.classes.playing, !player.elements.media.paused);

            toggleClass(player.elements.container, config.classes.stopped, player.elements.media.paused);

            toggleControls(player.elements.media.paused);
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
                    player.fullscreen.active = fullscreen.isFullScreen(player.elements.container);
                } else {
                    // Else it's a user request to enter or exit
                    if (!fullscreen.isFullScreen(player.elements.container)) {
                        // Save scroll position
                        saveScrollPosition();

                        // Request full screen
                        fullscreen.requestFullScreen(player.elements.container);
                    } else {
                        // Bail from fullscreen
                        fullscreen.cancelFullScreen();
                    }

                    // Check if we're actually full screen (it could fail)
                    player.fullscreen.active = fullscreen.isFullScreen(player.elements.container);

                    return;
                }
            } else {
                // Otherwise, it's a simple toggle
                player.fullscreen.active = !player.fullscreen.active;

                // Bind/unbind escape key
                document.body.style.overflow = player.fullscreen.active ? 'hidden' : '';
            }

            // Set class hook
            toggleClass(player.elements.container, config.classes.fullscreen.active, player.fullscreen.active);

            // Trap focus
            focusTrap(player.fullscreen.active);

            // Set button state
            if (player.elements.buttons && player.elements.buttons.fullscreen) {
                toggleState(player.elements.buttons.fullscreen, player.fullscreen.active);
            }

            // Trigger an event
            trigger(player.elements.container, player.fullscreen.active ? 'enterfullscreen' : 'exitfullscreen', true);

            // Restore scroll position
            if (!player.fullscreen.active && nativeSupport) {
                restoreScrollPosition();
            }
        }

        // Toggle Menu
        function toggleMenu(event) {
            var menu = player.elements.settings.menu.parentNode;
            var toggle = event.target;
            var target = document.getElementById(toggle.getAttribute('aria-controls'));
            var show = (toggle.getAttribute('aria-expanded') === 'false');

            // Nothing to show, bail
            if (!is.htmlElement(target)) {
                return;
            }

            // Are we targetting a tab?
            var isTab = target.getAttribute('role') === 'tabpanel';
            var targetWidth;
            var targetHeight;
            var container;

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
            target.removeAttribute('tabindex');

            if (isTab) {
                container.style.width = targetWidth + 'px';
                container.style.height = targetHeight + 'px';

                window.setTimeout(function() {
                    container.style.width = '';
                    container.style.height = '';
                }, 300);
            }
        }

        // Mute
        function toggleMute(muted) {
            // If the method is called without parameter, toggle based on current value
            if (!is.boolean(muted)) {
                muted = !player.elements.media.muted;
            }

            // Set button state
            toggleState(player.elements.buttons.mute, muted);

            // Set mute on the player
            player.elements.media.muted = muted;

            // If volume is 0 after unmuting, set to default
            if (player.elements.media.volume === 0) {
                setVolume(config.volume);
            }

            // Embeds
            if (inArray(types.embed, player.type)) {
                // YouTube
                switch (player.type) {
                    case 'youtube':
                        player.embed[player.elements.media.muted ? 'mute' : 'unMute']();
                        break;

                    case 'vimeo':
                    case 'soundcloud':
                        player.embed.setVolume(player.elements.media.muted ? 0 : parseFloat(config.volume / 10));
                        break;
                }

                // Trigger volumechange for embeds
                trigger(player.elements.media, 'volumechange');
            }
        }

        // Set volume
        function setVolume(volume) {
            var max = 10;
            var min = 0;

            // If volume is event, get from input
            if (is.event(volume)) {
                volume = volume.target.value;
            }

            // Load volume from storage if no value specified
            if (is.undefined(volume)) {
                volume = player.storage.volume;
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
            player.elements.media.volume = parseFloat(volume / max);

            // Set the display
            if (player.elements.display.volume) {
                player.elements.display.volume.value = volume;
            }

            // Embeds
            if (inArray(types.embed, player.type)) {
                switch (player.type) {
                    case 'youtube':
                        player.embed.setVolume(player.elements.media.volume * 100);
                        break;

                    case 'vimeo':
                    case 'soundcloud':
                        player.embed.setVolume(player.elements.media.volume);
                        break;
                }

                // Trigger volumechange for embeds
                trigger(player.elements.media, 'volumechange');
            }

            // Toggle muted state
            if (volume === 0) {
                player.elements.media.muted = true;
            } else if (player.elements.media.muted && volume > 0) {
                toggleMute();
            }
        }

        // Increase volume
        function increaseVolume(step) {
            var volume = player.elements.media.muted ? 0 : (player.elements.media.volume * 10);

            if (!is.number(step)) {
                step = 1;
            }

            setVolume(volume + step);
        }

        // Decrease volume
        function decreaseVolume(step) {
            var volume = player.elements.media.muted ? 0 : (player.elements.media.volume * 10);

            if (!is.number(step)) {
                step = 1;
            }

            setVolume(volume - step);
        }

        // Update volume UI and storage
        function updateVolume() {
            // Get the current volume
            var volume = player.elements.media.muted ? 0 : (player.elements.media.volume * 10);

            // Update the <input type="range"> if present
            if (player.supported.full) {
                if (player.elements.inputs.volume) {
                    player.elements.inputs.volume.value = volume;
                }
                if (player.elements.display.volume) {
                    player.elements.display.volume.value = volume;
                }
            }

            // Update the volume in storage
            updateStorage({
                volume: volume
            });

            // Toggle class if muted
            toggleClass(player.elements.container, config.classes.muted, (volume === 0));

            // Update checkbox for mute state
            if (player.supported.full && player.elements.buttons.mute) {
                toggleState(player.elements.buttons.mute, (volume === 0));
            }
        }

        // Check if media is loading
        function checkLoading(event) {
            var loading = (event.type === 'waiting');

            // Clear timer
            clearTimeout(timers.loading);

            // Timer to prevent flicker when seeking
            timers.loading = setTimeout(function() {
                // Toggle container class hook
                toggleClass(player.elements.container, config.classes.loading, loading);

                // Show controls if loading, hide if done
                toggleControls(loading);
            }, (loading ? 250 : 0));
        }

        // Update <progress> elements
        function updateProgress(event) {
            if (!player.supported.full) {
                return;
            }

            var progress = player.elements.display.played,
                value = 0,
                duration = getDuration();

            if (event) {
                switch (event.type) {
                    // Video playing
                    case 'timeupdate':
                    case 'seeking':
                        if (player.elements.controls.pressed) {
                            return;
                        }

                        value = getPercentage(player.elements.media.currentTime, duration);

                        // Set seek range value only if it's a 'natural' time event
                        if (event.type === 'timeupdate' && player.elements.inputs.seek) {
                            player.elements.inputs.seek.value = value;
                        }

                        break;

                        // Check buffer status
                    case 'playing':
                    case 'progress':
                        progress = player.elements.display.buffer;
                        value = (function() {
                            var buffered = player.elements.media.buffered;

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

            if (is.number(config.loop.start) && is.number(config.loop.end) && player.elements.media.currentTime >= config.loop.end) {
                seek(config.loop.start);
            }

            setProgress(progress, value);
        }

        // Set <progress> value
        function setProgress(progress, value) {
            if (!player.supported.full) {
                return;
            }

            // Default to 0
            if (is.undefined(value)) {
                value = 0;
            }
            // Default to buffer or bail
            if (is.undefined(progress)) {
                if (is.htmlElement(player.elements.display.buffer)) {
                    progress = player.elements.display.buffer;
                } else {
                    return;
                }
            }

            // Update value and label
            if (is.htmlElement(progress)) {
                progress.value = value;

                // Update text label inside
                var label = progress.getElementsByTagName('span')[0];
                if (is.htmlElement(label)) {
                    label.childNodes[0].nodeValue = value;
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

            var secs = parseInt(time % 60);
            var mins = parseInt((time / 60) % 60);
            var hours = parseInt(((time / 60) / 60) % 60);

            // Do we need to display hours?
            var displayHours = (parseInt(((getDuration() / 60) / 60) % 60) > 0);

            // Ensure it's two digits. For example, 03 rather than 3.
            secs = ('0' + secs).slice(-2);
            mins = ('0' + mins).slice(-2);

            // Generate display
            var display = (displayHours ? hours + ':' : '') + mins + ':' + secs;

            // Render
            element.textContent = display;

            // Return for looping
            return display;
        }

        // Show the duration on metadataloaded
        function displayDuration() {
            if (!player.supported.full) {
                return;
            }

            // Determine duration
            var duration = getDuration() || 0;

            // If there's only one time display, display duration there
            if (!player.elements.display.duration && config.displayDuration && player.elements.media.paused) {
                updateTimeDisplay(duration, player.elements.display.currentTime);
            }

            // If there's a duration element, update content
            if (player.elements.display.duration) {
                updateTimeDisplay(duration, player.elements.display.duration);
            }

            // Update the tooltip (if visible)
            updateSeekTooltip();
        }

        // Handle time change event
        function timeUpdate(event) {
            // Duration
            updateTimeDisplay(player.elements.media.currentTime, player.elements.display.currentTime);

            // Ignore updates while seeking
            if (event && event.type === 'timeupdate' && player.elements.media.seeking) {
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
            if (player.elements.progress && player.elements.display.played) {
                player.elements.display.played.value = value;
            }

            // Update seek range input
            if (player.elements.buttons && player.elements.inputs.seek) {
                player.elements.inputs.seek.value = value;
            }
        }

        // Update hover tooltip for seeking
        function updateSeekTooltip(event) {
            var duration = getDuration();

            // Bail if setting not true
            if (!config.tooltips.seek || !is.htmlElement(player.elements.inputs.seek) || !is.htmlElement(player.elements.display.seekTooltip) || duration === 0) {
                return;
            }

            // Calculate percentage
            var clientRect = player.elements.inputs.seek.getBoundingClientRect();
            var percent = 0;
            var visible = config.classes.tooltip + '--visible';

            // Determine percentage, if already visible
            if (is.event(event)) {
                percent = ((100 / clientRect.width) * (event.pageX - clientRect.left));
            } else {
                if (hasClass(player.elements.display.seekTooltip, visible)) {
                    percent = player.elements.display.seekTooltip.style.left.replace('%', '');
                } else {
                    return;
                }
            }

            // Set bounds
            if (percent < 0) {
                percent = 0;
            } else if (percent > 100) {
                percent = 100;
            }

            // Display the time a click would seek to
            updateTimeDisplay(((duration / 100) * percent), player.elements.display.seekTooltip);

            // Set position
            player.elements.display.seekTooltip.style.left = percent + "%";

            // Show/hide the tooltip
            // If the event is a moues in/out and percentage is inside bounds
            if (is.event(event) && inArray(['mouseenter', 'mouseleave'], event.type)) {
                toggleClass(player.elements.display.seekTooltip, visible, (event.type === 'mouseenter'));
            }
        }

        // Show the player controls in fullscreen mode
        function toggleControls(toggle) {
            // Don't hide if config says not to, it's audio, or not ready or loading
            if (!config.hideControls || player.type === 'audio') {
                return;
            }

            var delay = 0;
            var isEnterFullscreen = false;
            var show = toggle;
            var loading = hasClass(player.elements.container, config.classes.loading);

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
                    show = hasClass(player.elements.container, config.classes.hideControls);
                }
            }

            // Clear timer every movement
            window.clearTimeout(timers.hover);

            // If the mouse is not over the controls, set a timeout to hide them
            if (show || player.elements.media.paused || loading) {
                toggleClass(player.elements.container, config.classes.hideControls, false);

                // Always show controls when paused or if touch
                if (player.elements.media.paused || loading) {
                    return;
                }

                // Delay for hiding on touch
                if (player.browser.isTouch) {
                    delay = 3000;
                }
            }

            // If toggle is false or if we're playing (regardless of toggle),
            // then set the timer to hide the controls
            if (!show || !player.elements.media.paused) {
                timers.hover = window.setTimeout(function() {
                    // If the mouse is over the controls (and not entering fullscreen), bail
                    if ((player.elements.controls.pressed || player.elements.controls.hover) && !isEnterFullscreen) {
                        return;
                    }

                    toggleClass(player.elements.container, config.classes.hideControls, true);
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
            switch (player.type) {
                case 'youtube':
                    url = player.embed.getVideoUrl();
                    break;

                case 'vimeo':
                    player.embed.getVideoUrl.then(function(value) {
                        url = value;
                    });
                    break;

                case 'soundcloud':
                    player.embed.getCurrentSound(function(object) {
                        url = object.permalink_url;
                    });
                    break;

                default:
                    url = player.elements.media.currentSrc;
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
            toggleClass(player.elements.container, config.classes.ready, false);

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
                player.embed = null;

                // Remove the old media
                remove(player.elements.media);

                // Remove video container
                if (player.type === 'video' && player.elements.wrapper) {
                    remove(player.elements.wrapper);
                }

                // Reset class name
                if (player.elements.container) {
                    player.elements.container.removeAttribute('class');
                }

                // Set the type
                if ('type' in source) {
                    player.type = source.type;

                    // Get child type for video (it might be an embed)
                    if (player.type === 'video') {
                        var firstSource = source.sources[0];

                        if ('type' in firstSource && inArray(types.embed, firstSource.type)) {
                            player.type = firstSource.type;
                        }
                    }
                }

                // Check for support
                player.supported = checkSupport(player.type);

                // Create new markup
                switch (player.type) {
                    case 'video':
                        player.elements.media = createElement('video');
                        break;

                    case 'audio':
                        player.elements.media = createElement('audio');
                        break;

                    case 'youtube':
                    case 'vimeo':
                    case 'soundcloud':
                        player.elements.media = createElement('div');
                        player.embedId = source.sources[0].src;
                        break;
                }

                // Inject the new element
                prependChild(player.elements.container, player.elements.media);

                // Autoplay the new source?
                if (is.boolean(source.autoplay)) {
                    config.autoplay = source.autoplay;
                }

                // Set attributes for audio and video
                if (inArray(types.html5, player.type)) {
                    if (config.crossorigin) {
                        player.elements.media.setAttribute('crossorigin', '');
                    }
                    if (config.autoplay) {
                        player.elements.media.setAttribute('autoplay', '');
                    }
                    if ('poster' in source) {
                        player.elements.media.setAttribute('poster', source.poster);
                    }
                    if (config.loop.active) {
                        player.elements.media.setAttribute('loop', '');
                    }
                }

                // Restore class hooks
                toggleClass(player.elements.container, config.classes.fullscreen.active, player.fullscreen.active);
                toggleClass(player.elements.container, config.classes.captions.active, player.captions.enabled);
                toggleStyleHook();

                // Set new sources for html5
                if (inArray(types.html5, player.type)) {
                    insertElements('source', source.sources);
                }

                // Set up from scratch
                setupMedia();

                // HTML5 stuff
                if (inArray(types.html5, player.type)) {
                    // Setup captions
                    if ('tracks' in source) {
                        insertElements('track', source.tracks);
                    }

                    // Load HTML5 sources
                    player.elements.media.load();
                }

                // If HTML5 or embed but not fully supported, setupInterface and call ready now
                if (inArray(types.html5, player.type) || (inArray(types.embed, player.type) && !player.supported.full)) {
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
            if (player.type === 'video') {
                player.elements.media.setAttribute('poster', source);
            }
        }

        // Listen for control events
        function controlListeners() {
            // IE doesn't support input event, so we fallback to change
            var inputEvent = (player.browser.isIE ? 'change' : 'input');

            // Click play/pause helper
            function _togglePlay() {
                var play = togglePlay();

                // Determine which buttons
                var trigger = player.elements.buttons[play ? 'play' : 'pause'];
                var target = player.elements.buttons[play ? 'pause' : 'play'];

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

            // Get the key code for an event
            function getKeyCode(event) {
                return event.keyCode ? event.keyCode : event.which;
            }

            // Detect tab focus
            function checkTabFocus(focused) {
                toggleClass(getElements('.' + config.classes.tabFocus), config.classes.tabFocus, false);

                if (player.elements.container.contains(focused)) {
                    toggleClass(focused, config.classes.tabFocus, true);
                }
            }

            // Keyboard shortcuts
            if (config.keyboardShortcuts.focused) {
                var last = null;

                // Handle global presses
                if (config.keyboardShortcuts.global) {
                    on(window, 'keydown keyup', function(event) {
                        var code = getKeyCode(event);
                        var focused = getFocusElement();
                        var allowed = [48, 49, 50, 51, 52, 53, 54, 56, 57, 75, 77, 70, 67, 73, 76, 79];
                        var count = get().length;

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
                on(player.elements.container, 'keydown keyup', handleKey);
            }

            function handleKey(event) {
                var code = getKeyCode(event);
                var pressed = event.type === 'keydown';
                var held = pressed && code === last;

                // If the event is bubbled from the media element
                // Firefox doesn't get the keycode for whatever reason
                if (!is.number(code)) {
                    return;
                }

                // Seek by the number keys
                function seekByKey() {
                    // Get current duration
                    var duration = player.elements.media.duration;

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
                    var preventDefault = [48, 49, 50, 51, 52, 53, 54, 56, 57, 32, 75, 38, 40, 77, 39, 37, 70, 67, 73, 76, 79];
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
                            // 0-9
                            if (!held) {
                                seekByKey();
                            }
                            break;

                        case 32:
                        case 75:
                            // Space and K key
                            if (!held) {
                                _togglePlay();
                            }
                            break;

                        case 38:
                            // Arrow up
                            increaseVolume();
                            break;

                        case 40:
                            // Arrow down
                            decreaseVolume();
                            break;

                        case 77:
                            // M key
                            if (!held) {
                                toggleMute();
                            }
                            break;

                        case 39:
                            // Arrow forward
                            forward();
                            break;

                        case 37:
                            // Arrow back
                            rewind();
                            break;

                        case 70:
                            // F key
                            toggleFullscreen();
                            break;

                        case 67:
                            // C key
                            if (!held) {
                                toggleCaptions();
                            }
                            break;

                        case 73:
                            toggleLoop('start');
                            break;

                        case 76:
                            toggleLoop();
                            break;

                        case 79:
                            toggleLoop('end');
                            break;
                    }

                    // Escape is handle natively when in full screen
                    // So we only need to worry about non native
                    if (!support.fullscreen && player.fullscreen.active && code === 27) {
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
                var code = getKeyCode(event);
                var focused = getFocusElement();

                if (code === 9) {
                    checkTabFocus(focused);
                }
            });
            on(document.body, 'click', function() {
                toggleClass(getElement('.' + config.classes.tabFocus), config.classes.tabFocus, false);
            });
            for (var button in player.elements.buttons) {
                var element = player.elements.buttons[button];

                on(element, 'blur', function() {
                    toggleClass(element, 'tab-focus', false);
                });
            }

            // Trigger custom and default handlers
            var handlerProxy = function(event, customHandler, defaultHandler) {
                if (is.function(customHandler)) {
                    customHandler.call(this, event);
                }
                if (is.function(defaultHandler)) {
                    defaultHandler.call(this, event);
                }
            }

            // Play
            proxy(player.elements.buttons.play, 'click', config.listeners.play, _togglePlay);
            proxy(player.elements.buttons.playLarge, 'click', config.listeners.play, _togglePlay);

            // Pause
            proxy(player.elements.buttons.pause, 'click', config.listeners.pause, _togglePlay);

            // Pause
            proxy(player.elements.buttons.restart, 'click', config.listeners.restart, seek);

            // Rewind
            proxy(player.elements.buttons.rewind, 'click', config.listeners.rewind, rewind);

            // Rewind
            proxy(player.elements.buttons.forward, 'click', config.listeners.forward, forward);

            // Mute
            proxy(player.elements.buttons.mute, 'click', config.listeners.mute, toggleMute);

            // Captions
            proxy(player.elements.buttons.captions, 'click', config.listeners.captions, toggleCaptions);

            // Fullscreen
            proxy(player.elements.buttons.fullscreen, 'click', config.listeners.fullscreen, toggleFullscreen);

            // Picture-in-Picture
            proxy(player.elements.buttons.pip, 'click', config.listeners.pip, function(event) {
                if (!support.pip) {
                    return;
                }
                player.elements.media.webkitSetPresentationMode(player.elements.media.webkitPresentationMode === 'picture-in-picture' ? 'inline' : 'picture-in-picture');
            });

            // Airplay
            proxy(player.elements.buttons.airplay, 'click', config.listeners.airplay, function(event) {
                if (!support.airplay) {
                    return;
                }
                player.elements.media.webkitShowPlaybackTargetPicker();
            });

            // Settings menu
            on(player.elements.settings.menu, 'click', toggleMenu);

            // Click anywhere closes menu
            on(document.body, 'click', function(event) {
                var menu = player.elements.settings.menu;
                var form = menu.querySelector('form');

                if (form.getAttribute('aria-hidden') === 'true' || menu.contains(event.target)) {
                    return;
                }

                // TODO: This should call some sort of menuToggle function?
                form.setAttribute('aria-hidden', true);
            });

            // Settings menu items - use event delegation as items are added/removed
            on(player.elements.settings.menu, 'click', function(event) {
                // Settings - Language
                if (matches(event.target, config.selectors.inputs.language)) {
                    handlerProxy.call(this, event, config.listeners.language, setLanguage);
                }

                // Settings - Quality
                else if (matches(event.target, config.selectors.inputs.quality)) {
                    handlerProxy.call(this, event, config.listeners.quality, function() {
                        warn("Set quality");
                    });
                }

                // Settings - Speed
                else if (matches(event.target, config.selectors.inputs.speed)) {
                    handlerProxy.call(this, event, config.listeners.speed, setSpeed);
                }

                // Settings - Looping
                // TODO: use toggle buttons
                else if (matches(event.target, config.selectors.buttons.loop)) {
                    handlerProxy.call(this, event, config.listeners.loop, function() {
                        // TODO: This should be done in the method itself I think
                        var value = event.target.getAttribute('data-loop__value') || event.target.getAttribute('data-loop__type');

                        if (inArray(['start', 'end', 'all', 'none'], value)) {
                            toggleLoop(value);
                        }
                    });
                }
            });

            // Seek
            proxy(player.elements.inputs.seek, inputEvent, config.listeners.seek, seek);

            // Seek
            proxy(player.elements.inputs.volume, inputEvent, config.listeners.volume, setVolume);

            // Seek tooltip
            on(player.elements.progress, 'mouseenter mouseleave mousemove', updateSeekTooltip);

            // Toggle controls visibility based on mouse movement
            if (config.hideControls) {
                // Toggle controls on mouse events and entering fullscreen
                on(player.elements.container, 'mouseenter mouseleave mousemove touchstart touchend touchcancel touchmove enterfullscreen', toggleControls);

                // Watch for cursor over controls so they don't hide when trying to interact
                on(player.elements.controls, 'mouseenter mouseleave', function(event) {
                    player.elements.controls.hover = event.type === 'mouseenter';
                });

                // Watch for cursor over controls so they don't hide when trying to interact
                on(player.elements.controls, 'mousedown mouseup touchstart touchend touchcancel', function(event) {
                    player.elements.controls.pressed = inArray(['mousedown', 'touchstart'], event.type);
                });

                // Focus in/out on controls
                on(player.elements.controls, 'focus blur', toggleControls, true);
            }

            // Mouse wheel for volume
            proxy(player.elements.inputs.volume, 'wheel', config.listeners.volume, function(event) {
                // Detect "natural" scroll - suppored on OS X Safari only
                // Other browsers on OS X will be inverted until support improves
                var inverted = event.webkitDirectionInvertedFromDevice;
                var step = (1 / 5);
                var direction = 0;

                // Scroll down (or up on natural) to decrease
                if (event.deltaY < 0 || event.deltaX > 0) {
                    if (inverted) {
                        decreaseVolume(step);
                        direction = -1;
                    } else {
                        increaseVolume(step);
                        direction = 1;
                    }
                }

                // Scroll up (or down on natural) to increase
                if (event.deltaY > 0 || event.deltaX < 0) {
                    if (inverted) {
                        increaseVolume(step);
                        direction = 1;
                    } else {
                        decreaseVolume(step);
                        direction = -1;
                    }
                }

                // Don't break page scrolling at max and min
                if ((direction === 1 && player.elements.media.volume < 1) ||
                    (direction === -1 && player.elements.media.volume > 0)) {
                    event.preventDefault();
                }
            });

            // Handle user exiting fullscreen by escaping etc
            if (support.fullscreen) {
                on(document, fullscreen.eventType, toggleFullscreen);
            }
        }

        // Listen for media events
        function mediaListeners() {
            // Time change on media
            on(player.elements.media, 'timeupdate seeking', timeUpdate);

            // Display duration
            on(player.elements.media, 'durationchange loadedmetadata', displayDuration);

            // Handle the media finishing
            on(player.elements.media, 'ended', function() {
                // Show poster on end
                if (player.type === 'video' && config.showPosterOnEnd) {
                    // Clear
                    if (player.type === 'video') {
                        setCaption();
                    }

                    // Restart
                    seek();

                    // Re-load media
                    player.elements.media.load();
                }
            });

            // Check for buffer progress
            on(player.elements.media, 'progress playing', updateProgress);

            // Handle native mute
            on(player.elements.media, 'volumechange', updateVolume);

            // Handle native play/pause
            on(player.elements.media, 'play pause ended', checkPlaying);

            // Loading
            on(player.elements.media, 'waiting canplay seeked', checkLoading);

            // Click video
            if (config.clickToPlay && player.type !== 'audio') {
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
                    if (config.hideControls && player.browser.isTouch && !player.elements.media.paused) {
                        return;
                    }

                    if (player.elements.media.paused) {
                        play();
                    } else if (player.elements.media.ended) {
                        seek();
                        play();
                    } else {
                        pause();
                    }
                });
            }

            // Disable right click
            if (config.disableContextMenu) {
                on(player.elements.media, 'contextmenu', function(event) {
                    event.preventDefault();
                });
            }

            // Proxy events to container
            // Bubble up key events for Edge
            on(player.elements.media, config.events.concat(['keyup', 'keydown']).join(' '), function(event) {
                trigger(player.elements.container, event.type, true);
            });
        }

        // Cancel current network requests
        // See https://github.com/Selz/plyr/issues/174
        function cancelRequests() {
            if (!inArray(types.html5, player.type)) {
                return;
            }

            // Remove child sources
            var sources = player.elements.media.querySelectorAll('source');
            for (var i = 0; i < sources.length; i++) {
                remove(sources[i]);
            }

            // Set blank video src attribute
            // This is to prevent a MEDIA_ERR_SRC_NOT_SUPPORTED error
            // Info: http://stackoverflow.com/questions/32231579/how-to-properly-dispose-of-an-html5-video-and-close-socket-or-connection
            player.elements.media.setAttribute('src', 'https://cdn.selz.com/plyr/blank.mp4');

            // Load the new empty source
            // This will cancel existing requests
            // See https://github.com/Selz/plyr/issues/174
            player.elements.media.load();

            // Debugging
            log('Cancelled network requests');
        }

        // Destroy an instance
        // Event listeners are removed when elements are removed
        // http://stackoverflow.com/questions/12528049/if-a-dom-element-is-removed-are-its-listeners-also-removed-from-memory
        function destroy(callback, restore) {
            // Bail if the element is not initialized
            if (!player.init) {
                return null;
            }

            // Type specific stuff
            switch (player.type) {
                case 'youtube':
                    // Clear timers
                    window.clearInterval(timers.buffering);
                    window.clearInterval(timers.playing);

                    // Destroy YouTube API
                    player.embed.destroy();

                    // Clean up
                    cleanUp();

                    break;

                case 'vimeo':
                    // Destroy Vimeo API
                    // then clean up (wait, to prevent postmessage errors)
                    player.embed.unload().then(cleanUp);

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
                player.init = false;

                // Replace the container with the original element provided
                player.elements.container.parentNode.replaceChild(original, player.elements.container);

                // unbind escape key
                document.body.style.overflow = '';

                // Event
                trigger(original, 'destroyed', true);
            }
        }

        // Setup a player
        function init() {
            // Bail if the element is initialized
            if (player.init) {
                return null;
            }

            // Sniff out the browser
            player.browser = getBrowser();

            // Bail if nothing to setup
            if (!is.htmlElement(player.elements.media)) {
                return;
            }

            // Load saved settings from localStorage
            setupStorage();

            // Set media type based on tag or data attribute
            // Supported: video, audio, vimeo, youtube
            var tagName = media.tagName.toLowerCase();
            if (tagName === 'div') {
                player.type = media.getAttribute('data-type');
                player.embedId = media.getAttribute('data-video-id');

                // Clean up
                media.removeAttribute('data-type');
                media.removeAttribute('data-video-id');
            } else {
                player.type = tagName;
                config.crossorigin = (media.getAttribute('crossorigin') !== null);
                config.autoplay = (config.autoplay || (media.getAttribute('autoplay') !== null));
                config.loop = (config.loop || (media.getAttribute('loop') !== null));
            }

            // Check for support
            player.supported = checkSupport(player.type);

            // If no native support, bail
            if (!player.supported.basic) {
                return;
            }

            // Wrap media
            player.elements.container = wrap(media, createElement('div'));

            // Allow focus to be captured
            player.elements.container.setAttribute('tabindex', 0);

            // Add style hook
            toggleStyleHook();

            // Debug info
            log('' + player.browser.name + ' ' + player.browser.version);

            // Setup media
            setupMedia();

            // Setup interface
            // If embed but not fully supported, setupInterface (to avoid flash of controls) and call ready now
            if (inArray(types.html5, player.type) || (inArray(types.embed, player.type) && !player.supported.full)) {
                // Setup UI
                setupInterface();

                // Call ready
                ready();

                // Set title on button and frame
                setTitle();
            }

            // Successful setup
            player.init = true;
        }

        // Setup the UI
        function setupInterface() {
            // Don't setup interface if no support
            if (!player.supported.full) {
                warn('Basic support only', player.type);

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
            if (!is.htmlElement(getElement(config.selectors.controls.wrapper))) {
                // Inject custom controls
                injectControls();
                controlListeners();
            }

            // Find the elements
            // TODO: re-enable when custom HTML is restored
            /*if (!findElements()) {
                return;
            }*/

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

            // Set loop
            toggleLoop();

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
                return player.elements.container
            },
            getEmbed: function() {
                return player.embed;
            },
            getMedia: function() {
                return player.elements.media;
            },
            getType: function() {
                return player.type;
            },
            getDuration: getDuration,
            getCurrentTime: function() {
                return player.elements.media.currentTime;
            },
            getVolume: function() {
                return player.elements.media.volume;
            },
            isMuted: function() {
                return player.elements.media.muted;
            },
            isReady: function() {
                return hasClass(player.elements.container, config.classes.ready);
            },
            isLoading: function() {
                return hasClass(player.elements.container, config.classes.loading);
            },
            isPaused: function() {
                return player.elements.media.paused;
            },
            isLooping: function() {
                return config.loop.active;
            },
            on: function(event, callback) {
                on(player.elements.container, event, callback);
                return this;
            },
            play: play,
            pause: pause,
            loop: toggleLoop,
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
            setLanguage: setLanguage,
            isFullscreen: function() {
                return player.fullscreen.active || false;
            },
            support: function(mimeType) {
                return support.mime(player, mimeType);
            },
            destroy: destroy
        };

        // Everything done
        function ready() {
            // Ready event at end of execution stack
            window.setTimeout(function() {
                trigger(player.elements.media, 'ready');
            }, 0);

            // Set class hook on media element
            toggleClass(player.elements.media, defaults.classes.setup, true);

            // Set container class for ready
            toggleClass(player.elements.container, config.classes.ready, true);

            // Store a refernce to instance
            player.elements.media.plyr = api;

            // Autoplay
            if (config.autoplay) {
                play();
            }
        }

        // Initialize instance
        init();

        // If init failed, return null
        if (!player.init) {
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
        var container = createElement('div');
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
    function checkSupport(type) {
        var browser = getBrowser();
        var isOldIE = (browser.isIE && browser.version <= 9);
        var isIos = browser.isIos;
        var isIphone = /iPhone|iPod/i.test(navigator.userAgent);
        var audio = !!createElement('audio').canPlayType;
        var video = !!createElement('video').canPlayType;
        var basic;
        var full;

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
        var players = [];
        var instances = [];
        var selector = [defaults.selectors.html5, defaults.selectors.embed].join(',');

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
        if (!checkSupport().basic || !targets.length) {
            return false;
        }

        // Add to container list
        function add(target, media) {
            if (!hasClass(media, defaults.classes.hook)) {
                players.push({
                    // Always wrap in a <div> for styling
                    // container: wrap(media, document.createElement('div')),
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
            var element = player.target;
            var media = player.media;
            var match = false;

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
        supported: checkSupport,
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
