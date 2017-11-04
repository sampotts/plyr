// ==========================================================================
// Plyr Event Listeners
// ==========================================================================

import support from './support';
import utils from './utils';
import controls from './controls';
import fullscreen from './fullscreen';
import storage from './storage';
import ui from './ui';

const listeners = {
    // Listen for media events
    media() {
        // Time change on media
        utils.on(this.media, 'timeupdate seeking', event => ui.timeUpdate.call(this, event));

        // Display duration
        utils.on(this.media, 'durationchange loadedmetadata', event => ui.displayDuration.call(this, event));

        // Handle the media finishing
        utils.on(this.media, 'ended', () => {
            // Show poster on end
            if (this.type === 'video' && this.config.showPosterOnEnd) {
                // Restart
                this.restart();

                // Re-load media
                this.media.load();
            }
        });

        // Check for buffer progress
        utils.on(this.media, 'progress playing', event => ui.updateProgress.call(this, event));

        // Handle native mute
        utils.on(this.media, 'volumechange', event => ui.updateVolume.call(this, event));

        // Handle native play/pause
        utils.on(this.media, 'play pause ended', event => ui.checkPlaying.call(this, event));

        // Loading
        utils.on(this.media, 'waiting canplay seeked', event => ui.checkLoading.call(this, event));

        // Click video
        if (this.supported.ui && this.config.clickToPlay && this.type !== 'audio') {
            // Re-fetch the wrapper
            const wrapper = utils.getElement.call(this, `.${this.config.classNames.video}`);

            // Bail if there's no wrapper (this should never happen)
            if (!wrapper) {
                return;
            }

            // Set cursor
            wrapper.style.cursor = 'pointer';

            // On click play, pause ore restart
            utils.on(wrapper, 'click', () => {
                // Touch devices will just show controls (if we're hiding controls)
                if (this.config.hideControls && support.touch && !this.media.paused) {
                    return;
                }

                if (this.media.paused) {
                    this.play();
                } else if (this.media.ended) {
                    this.restart();
                    this.play();
                } else {
                    this.pause();
                }
            });
        }

        // Disable right click
        if (this.config.disableContextMenu) {
            utils.on(
                this.media,
                'contextmenu',
                event => {
                    event.preventDefault();
                },
                false
            );
        }

        // Speed change
        utils.on(this.media, 'ratechange', () => {
            // Update UI
            controls.updateSetting.call(this, 'speed');

            // Save speed to localStorage
            storage.set.call(this, {
                speed: this.speed,
            });
        });

        // Quality change
        utils.on(this.media, 'qualitychange', () => {
            // Update UI
            controls.updateSetting.call(this, 'quality');

            // Save speed to localStorage
            storage.set.call(this, {
                quality: this.quality,
            });
        });

        // Caption language change
        utils.on(this.media, 'captionchange', () => {
            // Save speed to localStorage
            storage.set.call(this, {
                language: this.captions.language,
            });
        });

        // Captions toggle
        utils.on(this.media, 'captionsenabled captionsdisabled', () => {
            // Update UI
            controls.updateSetting.call(this, 'captions');

            // Save speed to localStorage
            storage.set.call(this, {
                captions: this.captions.enabled,
            });
        });

        // Proxy events to container
        // Bubble up key events for Edge
        utils.on(this.media, this.config.events.concat(['keyup', 'keydown']).join(' '), event => {
            utils.dispatchEvent.call(this, this.elements.container, event.type, true);
        });
    },

    // Listen for control events
    controls() {
        // IE doesn't support input event, so we fallback to change
        const inputEvent = this.browser.isIE ? 'change' : 'input';
        let last = null;

        // Click play/pause helper
        const togglePlay = () => {
            const play = this.togglePlay();

            // Determine which buttons
            const target = this.elements.buttons[play ? 'pause' : 'play'];

            // Transfer focus
            if (utils.is.htmlElement(target)) {
                target.focus();
            }
        };

        // Get the key code for an event
        function getKeyCode(event) {
            return event.keyCode ? event.keyCode : event.which;
        }

        function handleKey(event) {
            const code = getKeyCode(event);
            const pressed = event.type === 'keydown';
            const held = pressed && code === last;

            // If the event is bubbled from the media element
            // Firefox doesn't get the keycode for whatever reason
            if (!utils.is.number(code)) {
                return;
            }

            // Seek by the number keys
            function seekByKey() {
                // Divide the max duration into 10th's and times by the number value
                this.currentTime = this.duration / 10 * (code - 48);
            }

            // Handle the key on keydown
            // Reset on keyup
            if (pressed) {
                // Which keycodes should we prevent default
                const preventDefault = [
                    48,
                    49,
                    50,
                    51,
                    52,
                    53,
                    54,
                    56,
                    57,
                    32,
                    75,
                    38,
                    40,
                    77,
                    39,
                    37,
                    70,
                    67,
                    73,
                    76,
                    79,
                ];
                const checkFocus = [38, 40];

                if (checkFocus.includes(code)) {
                    const focused = utils.getFocusElement();

                    if (utils.is.htmlElement(focused) && utils.getFocusElement().type === 'radio') {
                        return;
                    }
                }

                // If the code is found prevent default (e.g. prevent scrolling for arrows)
                if (preventDefault.includes(code)) {
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
                            togglePlay();
                        }
                        break;

                    case 38:
                        // Arrow up
                        this.increaseVolume(0.1);
                        break;

                    case 40:
                        // Arrow down
                        this.decreaseVolume(0.1);
                        break;

                    case 77:
                        // M key
                        if (!held) {
                            this.toggleMute();
                        }
                        break;

                    case 39:
                        // Arrow forward
                        this.forward();
                        break;

                    case 37:
                        // Arrow back
                        this.rewind();
                        break;

                    case 70:
                        // F key
                        this.toggleFullscreen();
                        break;

                    case 67:
                        // C key
                        if (!held) {
                            this.toggleCaptions();
                        }
                        break;

                    case 73:
                        this.setLoop('start');
                        break;

                    case 76:
                        this.setLoop();
                        break;

                    case 79:
                        this.setLoop('end');
                        break;

                    default:
                        break;
                }

                // Escape is handle natively when in full screen
                // So we only need to worry about non native
                if (!fullscreen.enabled && this.fullscreen.active && code === 27) {
                    this.toggleFullscreen();
                }

                // Store last code for next cycle
                last = code;
            } else {
                last = null;
            }
        }

        // Keyboard shortcuts
        if (this.config.keyboard.focused) {
            // Handle global presses
            if (this.config.keyboard.global) {
                utils.on(
                    window,
                    'keydown keyup',
                    event => {
                        const code = getKeyCode(event);
                        const focused = utils.getFocusElement();
                        const allowed = [48, 49, 50, 51, 52, 53, 54, 56, 57, 75, 77, 70, 67, 73, 76, 79];

                        // Only handle global key press if key is in the allowed keys
                        // and if the focused element is not editable (e.g. text input)
                        // and any that accept key input http://webaim.org/techniques/keyboard/
                        if (
                            allowed.includes(code) &&
                            (!utils.is.htmlElement(focused) || !utils.matches(focused, this.config.selectors.editable))
                        ) {
                            handleKey(event);
                        }
                    },
                    false
                );
            }

            // Handle presses on focused
            utils.on(this.elements.container, 'keydown keyup', handleKey, false);
        }

        // Detect tab focus
        // Remove class on blur/focusout
        utils.on(this.elements.container, 'focusout', event => {
            utils.toggleClass(event.target, this.config.classNames.tabFocus, false);
        });

        // Add classname to tabbed elements
        utils.on(this.elements.container, 'keydown', event => {
            if (event.keyCode !== 9) {
                return;
            }

            // Delay the adding of classname until the focus has changed
            // This event fires before the focusin event
            window.setTimeout(() => {
                utils.toggleClass(utils.getFocusElement(), this.config.classNames.tabFocus, true);
            }, 0);
        });

        // Trigger custom and default handlers
        const handlerProxy = (event, customHandler, defaultHandler) => {
            if (utils.is.function(customHandler)) {
                customHandler.call(this, event);
            }
            if (utils.is.function(defaultHandler)) {
                defaultHandler.call(this, event);
            }
        };

        // Play
        utils.proxy(this.elements.buttons.play, 'click', this.config.listeners.play, togglePlay);
        utils.proxy(this.elements.buttons.playLarge, 'click', this.config.listeners.play, togglePlay);

        // Pause
        utils.proxy(this.elements.buttons.pause, 'click', this.config.listeners.pause, togglePlay);

        // Pause
        utils.proxy(this.elements.buttons.restart, 'click', this.config.listeners.restart, () => {
            this.restart();
        });

        // Rewind
        utils.proxy(this.elements.buttons.rewind, 'click', this.config.listeners.rewind, () => {
            this.rewind();
        });

        // Rewind
        utils.proxy(this.elements.buttons.forward, 'click', this.config.listeners.forward, () => {
            this.forward();
        });

        // Mute
        utils.proxy(this.elements.buttons.mute, 'click', this.config.listeners.mute, () => {
            this.toggleMute();
        });

        // Captions
        utils.proxy(this.elements.buttons.captions, 'click', this.config.listeners.captions, () => {
            this.toggleCaptions();
        });

        // Fullscreen
        utils.proxy(this.elements.buttons.fullscreen, 'click', this.config.listeners.fullscreen, () => {
            this.toggleFullscreen();
        });

        // Picture-in-Picture
        utils.proxy(this.elements.buttons.pip, 'click', this.config.listeners.pip, () => {
            this.togglePictureInPicture();
        });

        // Airplay
        utils.proxy(this.elements.buttons.airplay, 'click', this.config.listeners.airplay, () => {
            this.airPlay();
        });

        // Settings menu
        utils.on(this.elements.buttons.settings, 'click', event => {
            controls.toggleMenu.call(this, event);
        });

        // Click anywhere closes menu
        utils.on(document.documentElement, 'click', event => {
            controls.toggleMenu.call(this, event);
        });

        // Settings menu
        utils.on(this.elements.settings.form, 'click', event => {
            // Show tab in menu
            controls.showTab.call(this, event);

            // Settings menu items - use event delegation as items are added/removed
            // Settings - Language
            if (utils.matches(event.target, this.config.selectors.inputs.language)) {
                handlerProxy.call(this, event, this.config.listeners.language, () => {
                    this.toggleCaptions(true);
                    this.language = event.target.value.toLowerCase();
                });
            } else if (utils.matches(event.target, this.config.selectors.inputs.quality)) {
                // Settings - Quality
                handlerProxy.call(this, event, this.config.listeners.quality, () => {
                    this.quality = event.target.value;
                });
            } else if (utils.matches(event.target, this.config.selectors.inputs.speed)) {
                // Settings - Speed
                handlerProxy.call(this, event, this.config.listeners.speed, () => {
                    this.speed = parseFloat(event.target.value);
                });
            } else if (utils.matches(event.target, this.config.selectors.buttons.loop)) {
                // Settings - Looping
                // TODO: use toggle buttons
                handlerProxy.call(this, event, this.config.listeners.loop, () => {
                    // TODO: This should be done in the method itself I think
                    // var value = event.target.getAttribute('data-loop__value') || event.target.getAttribute('data-loop__type');

                    this.warn('Set loop');
                });
            }
        });

        // Seek
        utils.proxy(this.elements.inputs.seek, inputEvent, this.config.listeners.seek, event => {
            this.currentTime = event.target.value / event.target.max * this.duration;
        });

        // Volume
        utils.proxy(this.elements.inputs.volume, inputEvent, this.config.listeners.volume, event => {
            this.volume = event.target.value;
        });

        // Polyfill for lower fill in <input type="range"> for webkit
        if (this.browser.isWebkit) {
            utils.on(utils.getElements.call(this, 'input[type="range"]'), 'input', event => {
                controls.updateRangeFill.call(this, event.target);
            });
        }

        // Seek tooltip
        utils.on(this.elements.progress, 'mouseenter mouseleave mousemove', event =>
            ui.updateSeekTooltip.call(this, event)
        );

        // Toggle controls visibility based on mouse movement
        if (this.config.hideControls) {
            // Toggle controls on mouse events and entering fullscreen
            utils.on(
                this.elements.container,
                'mouseenter mouseleave mousemove touchstart touchend touchcancel touchmove enterfullscreen',
                event => {
                    this.toggleControls(event);
                }
            );

            // Watch for cursor over controls so they don't hide when trying to interact
            utils.on(this.elements.controls, 'mouseenter mouseleave', event => {
                this.elements.controls.hover = event.type === 'mouseenter';
            });

            // Watch for cursor over controls so they don't hide when trying to interact
            utils.on(this.elements.controls, 'mousedown mouseup touchstart touchend touchcancel', event => {
                this.elements.controls.pressed = ['mousedown', 'touchstart'].includes(event.type);
            });

            // Focus in/out on controls
            // TODO: Check we need capture here
            utils.on(
                this.elements.controls,
                'focus blur',
                event => {
                    this.toggleControls(event);
                },
                true
            );
        }

        // Mouse wheel for volume
        utils.proxy(
            this.elements.inputs.volume,
            'wheel',
            this.config.listeners.volume,
            event => {
                // Detect "natural" scroll - suppored on OS X Safari only
                // Other browsers on OS X will be inverted until support improves
                const inverted = event.webkitDirectionInvertedFromDevice;
                const step = 1 / 50;
                let direction = 0;

                // Scroll down (or up on natural) to decrease
                if (event.deltaY < 0 || event.deltaX > 0) {
                    if (inverted) {
                        this.decreaseVolume(step);
                        direction = -1;
                    } else {
                        this.increaseVolume(step);
                        direction = 1;
                    }
                }

                // Scroll up (or down on natural) to increase
                if (event.deltaY > 0 || event.deltaX < 0) {
                    if (inverted) {
                        this.increaseVolume(step);
                        direction = 1;
                    } else {
                        this.decreaseVolume(step);
                        direction = -1;
                    }
                }

                // Don't break page scrolling at max and min
                if ((direction === 1 && this.media.volume < 1) || (direction === -1 && this.media.volume > 0)) {
                    event.preventDefault();
                }
            },
            false
        );

        // Handle user exiting fullscreen by escaping etc
        if (fullscreen.enabled) {
            utils.on(document, fullscreen.eventType, event => {
                this.toggleFullscreen(event);
            });
        }
    },
};

export default listeners;
