// ==========================================================================
// Plyr Event Listeners
// ==========================================================================

import utils from './utils';
import controls from './controls';
import ui from './ui';

// Sniff out the browser
const browser = utils.getBrowser();

class Listeners {
    constructor(player) {
        this.player = player;
        this.lastKey = null;

        this.handleKey = this.handleKey.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.firstTouch = this.firstTouch.bind(this);
    }

    // Handle key presses
    handleKey(event) {
        const code = event.keyCode ? event.keyCode : event.which;
        const pressed = event.type === 'keydown';
        const repeat = pressed && code === this.lastKey;

        // Bail if a modifier key is set
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }

        // If the event is bubbled from the media element
        // Firefox doesn't get the keycode for whatever reason
        if (!utils.is.number(code)) {
            return;
        }

        // Seek by the number keys
        const seekByKey = () => {
            // Divide the max duration into 10th's and times by the number value
            this.player.currentTime = this.player.duration / 10 * (code - 48);
        };

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

            // Check focused element
            // and if the focused element is not editable (e.g. text input)
            // and any that accept key input http://webaim.org/techniques/keyboard/
            const focused = utils.getFocusElement();
            if (utils.is.element(focused) && utils.matches(focused, this.player.config.selectors.editable)) {
                return;
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
                    if (!repeat) {
                        seekByKey();
                    }
                    break;

                case 32:
                case 75:
                    // Space and K key
                    if (!repeat) {
                        this.player.togglePlay();
                    }
                    break;

                case 38:
                    // Arrow up
                    this.player.increaseVolume(0.1);
                    break;

                case 40:
                    // Arrow down
                    this.player.decreaseVolume(0.1);
                    break;

                case 77:
                    // M key
                    if (!repeat) {
                        this.player.muted = !this.player.muted;
                    }
                    break;

                case 39:
                    // Arrow forward
                    this.player.forward();
                    break;

                case 37:
                    // Arrow back
                    this.player.rewind();
                    break;

                case 70:
                    // F key
                    this.player.fullscreen.toggle();
                    break;

                case 67:
                    // C key
                    if (!repeat) {
                        this.player.toggleCaptions();
                    }
                    break;

                case 76:
                    // L key
                    this.player.loop = !this.player.loop;
                    break;

                /* case 73:
                    this.setLoop('start');
                    break;

                case 76:
                    this.setLoop();
                    break;

                case 79:
                    this.setLoop('end');
                    break; */

                default:
                    break;
            }

            // Escape is handle natively when in full screen
            // So we only need to worry about non native
            if (!this.player.fullscreen.enabled && this.player.fullscreen.active && code === 27) {
                this.player.fullscreen.toggle();
            }

            // Store last code for next cycle
            this.lastKey = code;
        } else {
            this.lastKey = null;
        }
    }

    // Toggle menu
    toggleMenu(event) {
        controls.toggleMenu.call(this.player, event);
    }

    // Device is touch enabled
    firstTouch() {
        this.player.touch = true;

        // Add touch class
        utils.toggleClass(this.player.elements.container, this.player.config.classNames.isTouch, true);

        // Clean up
        utils.off(document.body, 'touchstart', this.firstTouch);
    }

    // Global window & document listeners
    global(toggle = true) {
        // Keyboard shortcuts
        if (this.player.config.keyboard.global) {
            utils.toggleListener(window, 'keydown keyup', this.handleKey, toggle, false);
        }

        // Click anywhere closes menu
        utils.toggleListener(document.body, 'click', this.toggleMenu, toggle);

        // Detect touch by events
        utils.on(document.body, 'touchstart', this.firstTouch);
    }

    // Container listeners
    container() {
        // Keyboard shortcuts
        if (!this.player.config.keyboard.global && this.player.config.keyboard.focused) {
            utils.on(this.player.elements.container, 'keydown keyup', this.handleKey, false);
        }

        // Detect tab focus
        // Remove class on blur/focusout
        utils.on(this.player.elements.container, 'focusout', event => {
            utils.toggleClass(event.target, this.player.config.classNames.tabFocus, false);
        });

        // Add classname to tabbed elements
        utils.on(this.player.elements.container, 'keydown', event => {
            if (event.keyCode !== 9) {
                return;
            }

            // Delay the adding of classname until the focus has changed
            // This event fires before the focusin event
            setTimeout(() => {
                utils.toggleClass(utils.getFocusElement(), this.player.config.classNames.tabFocus, true);
            }, 0);
        });

        // Toggle controls visibility based on mouse movement
        if (this.player.config.hideControls) {
            // Toggle controls on mouse events and entering fullscreen
            utils.on(this.player.elements.container, 'mouseenter mouseleave mousemove touchstart touchend touchmove enterfullscreen exitfullscreen', event => {
                this.player.toggleControls(event);
            });
        }
    }

    // Listen for media events
    media() {
        // Time change on media
        utils.on(this.player.media, 'timeupdate seeking', event => ui.timeUpdate.call(this.player, event));

        // Display duration
        utils.on(this.player.media, 'durationchange loadeddata loadedmetadata', event => ui.durationUpdate.call(this.player, event));

        // Check for audio tracks on load
        // We can't use `loadedmetadata` as it doesn't seem to have audio tracks at that point
        utils.on(this.player.media, 'loadeddata', () => {
            utils.toggleHidden(this.player.elements.volume, !this.player.hasAudio);
            utils.toggleHidden(this.player.elements.buttons.mute, !this.player.hasAudio);
        });

        // Handle the media finishing
        utils.on(this.player.media, 'ended', () => {
            // Show poster on end
            if (this.player.isHTML5 && this.player.isVideo && this.player.config.showPosterOnEnd) {
                // Restart
                this.player.restart();

                // Re-load media
                this.player.media.load();
            }
        });

        // Check for buffer progress
        utils.on(this.player.media, 'progress playing', event => ui.updateProgress.call(this.player, event));

        // Handle volume changes
        utils.on(this.player.media, 'volumechange', event => ui.updateVolume.call(this.player, event));

        // Handle play/pause
        utils.on(this.player.media, 'playing play pause ended emptied', event => ui.checkPlaying.call(this.player, event));

        // Loading state
        utils.on(this.player.media, 'waiting canplay seeked playing', event => ui.checkLoading.call(this.player, event));

        // Check if media failed to load
        // utils.on(this.player.media, 'play', event => ui.checkFailed.call(this.player, event));

        // If autoplay, then load advertisement if required
        // TODO: Show some sort of loading state while the ad manager loads else there's a delay before ad shows
        utils.on(this.player.media, 'playing', () => {
            if (!this.player.ads) {
                return;
            }

            // If ads are enabled, wait for them first
            if (this.player.ads.enabled && !this.player.ads.initialized) {
                // Wait for manager response
                this.player.ads.managerPromise.then(() => this.player.ads.play()).catch(() => this.player.play());
            }
        });

        // Click video
        if (this.player.supported.ui && this.player.config.clickToPlay && !this.player.isAudio) {
            // Re-fetch the wrapper
            const wrapper = utils.getElement.call(this.player, `.${this.player.config.classNames.video}`);

            // Bail if there's no wrapper (this should never happen)
            if (!utils.is.element(wrapper)) {
                return;
            }

            // On click play, pause ore restart
            utils.on(wrapper, 'click', () => {
                // Touch devices will just show controls (if we're hiding controls)
                if (this.player.config.hideControls && this.player.touch && !this.player.paused) {
                    return;
                }

                if (this.player.paused) {
                    this.player.play();
                } else if (this.player.ended) {
                    this.player.restart();
                    this.player.play();
                } else {
                    this.player.pause();
                }
            });
        }

        // Disable right click
        if (this.player.supported.ui && this.player.config.disableContextMenu) {
            utils.on(
                this.player.elements.wrapper,
                'contextmenu',
                event => {
                    event.preventDefault();
                },
                false,
            );
        }

        // Volume change
        utils.on(this.player.media, 'volumechange', () => {
            // Save to storage
            this.player.storage.set({ volume: this.player.volume, muted: this.player.muted });
        });

        // Speed change
        utils.on(this.player.media, 'ratechange', () => {
            // Update UI
            controls.updateSetting.call(this.player, 'speed');

            // Save to storage
            this.player.storage.set({ speed: this.player.speed });
        });

        // Quality request
        utils.on(this.player.media, 'qualityrequested', event => {
            // Save to storage
            this.player.storage.set({ quality: event.detail.quality });
        });

        // Quality change
        utils.on(this.player.media, 'qualitychange', event => {
            // Update UI
            controls.updateSetting.call(this.player, 'quality', null, event.detail.quality);
        });

        // Caption language change
        utils.on(this.player.media, 'languagechange', () => {
            // Update UI
            controls.updateSetting.call(this.player, 'captions');

            // Save to storage
            this.player.storage.set({ language: this.player.language });
        });

        // Captions toggle
        utils.on(this.player.media, 'captionsenabled captionsdisabled', () => {
            // Update UI
            controls.updateSetting.call(this.player, 'captions');

            // Save to storage
            this.player.storage.set({ captions: this.player.captions.active });
        });

        // Proxy events to container
        // Bubble up key events for Edge
        utils.on(this.player.media, this.player.config.events.concat([
            'keyup',
            'keydown',
        ]).join(' '), event => {
            let detail = {};

            // Get error details from media
            if (event.type === 'error') {
                detail = this.player.media.error;
            }

            utils.dispatchEvent.call(this.player, this.player.elements.container, event.type, true, detail);
        });
    }

    // Listen for control events
    controls() {
        // IE doesn't support input event, so we fallback to change
        const inputEvent = browser.isIE ? 'change' : 'input';

        // Run default and custom handlers
        const proxy = (event, defaultHandler, customHandlerKey) => {
            const customHandler = this.player.config.listeners[customHandlerKey];
            const hasCustomHandler = utils.is.function(customHandler);
            let returned = true;

            // Execute custom handler
            if (hasCustomHandler) {
                returned = customHandler.call(this.player, event);
            }

            // Only call default handler if not prevented in custom handler
            if (returned && utils.is.function(defaultHandler)) {
                defaultHandler.call(this.player, event);
            }
        };

        // Trigger custom and default handlers
        const on = (element, type, defaultHandler, customHandlerKey, passive = true) => {
            const customHandler = this.player.config.listeners[customHandlerKey];
            const hasCustomHandler = utils.is.function(customHandler);

            utils.on(element, type, event => proxy(event, defaultHandler, customHandlerKey), passive && !hasCustomHandler);
        };

        // Play/pause toggle
        on(this.player.elements.buttons.play, 'click', this.player.togglePlay, 'play');

        // Pause
        on(this.player.elements.buttons.restart, 'click', this.player.restart, 'restart');

        // Rewind
        on(this.player.elements.buttons.rewind, 'click', this.player.rewind, 'rewind');

        // Rewind
        on(this.player.elements.buttons.fastForward, 'click', this.player.forward, 'fastForward');

        // Mute toggle
        on(
            this.player.elements.buttons.mute,
            'click',
            () => {
                this.player.muted = !this.player.muted;
            },
            'mute',
        );

        // Captions toggle
        on(this.player.elements.buttons.captions, 'click', this.player.toggleCaptions);

        // Fullscreen toggle
        on(
            this.player.elements.buttons.fullscreen,
            'click',
            () => {
                this.player.fullscreen.toggle();
            },
            'fullscreen',
        );

        // Picture-in-Picture
        on(
            this.player.elements.buttons.pip,
            'click',
            () => {
                this.player.pip = 'toggle';
            },
            'pip',
        );

        // Airplay
        on(this.player.elements.buttons.airplay, 'click', this.player.airplay, 'airplay');

        // Settings menu
        on(this.player.elements.buttons.settings, 'click', event => {
            controls.toggleMenu.call(this.player, event);
        });

        // Settings menu
        on(this.player.elements.settings.form, 'click', event => {
            event.stopPropagation();

            // Settings menu items - use event delegation as items are added/removed
            if (utils.matches(event.target, this.player.config.selectors.inputs.language)) {
                proxy(
                    event,
                    () => {
                        this.player.language = event.target.value;
                    },
                    'language',
                );
            } else if (utils.matches(event.target, this.player.config.selectors.inputs.quality)) {
                proxy(
                    event,
                    () => {
                        this.player.quality = event.target.value;
                    },
                    'quality',
                );
            } else if (utils.matches(event.target, this.player.config.selectors.inputs.speed)) {
                proxy(
                    event,
                    () => {
                        this.player.speed = parseFloat(event.target.value);
                    },
                    'speed',
                );
            } else {
                controls.showTab.call(this.player, event);
            }
        });

        // Seek
        on(
            this.player.elements.inputs.seek,
            inputEvent,
            event => {
                this.player.currentTime = event.target.value / event.target.max * this.player.duration;
            },
            'seek',
        );

        // Current time invert
        // Only if one time element is used for both currentTime and duration
        if (this.player.config.toggleInvert && !utils.is.element(this.player.elements.display.duration)) {
            on(this.player.elements.display.currentTime, 'click', () => {
                // Do nothing if we're at the start
                if (this.player.currentTime === 0) {
                    return;
                }

                this.player.config.invertTime = !this.player.config.invertTime;
                ui.timeUpdate.call(this.player);
            });
        }

        // Volume
        on(
            this.player.elements.inputs.volume,
            inputEvent,
            event => {
                this.player.volume = event.target.value;
            },
            'volume',
        );

        // Polyfill for lower fill in <input type="range"> for webkit
        if (browser.isWebkit) {
            on(utils.getElements.call(this.player, 'input[type="range"]'), 'input', event => {
                controls.updateRangeFill.call(this.player, event.target);
            });
        }

        // Seek tooltip
        on(this.player.elements.progress, 'mouseenter mouseleave mousemove', event => controls.updateSeekTooltip.call(this.player, event));

        // Toggle controls visibility based on mouse movement
        if (this.player.config.hideControls) {
            // Watch for cursor over controls so they don't hide when trying to interact
            on(this.player.elements.controls, 'mouseenter mouseleave', event => {
                this.player.elements.controls.hover = !this.player.touch && event.type === 'mouseenter';
            });

            // Watch for cursor over controls so they don't hide when trying to interact
            on(this.player.elements.controls, 'mousedown mouseup touchstart touchend touchcancel', event => {
                this.player.elements.controls.pressed = [
                    'mousedown',
                    'touchstart',
                ].includes(event.type);
            });

            // Focus in/out on controls
            on(this.player.elements.controls, 'focusin focusout', event => {
                this.player.toggleControls(event);
            });
        }

        // Mouse wheel for volume
        on(
            this.player.elements.inputs.volume,
            'wheel',
            event => {
                // Detect "natural" scroll - suppored on OS X Safari only
                // Other browsers on OS X will be inverted until support improves
                const inverted = event.webkitDirectionInvertedFromDevice;
                const step = 1 / 50;
                let direction = 0;

                // Scroll down (or up on natural) to decrease
                if (event.deltaY < 0 || event.deltaX > 0) {
                    if (inverted) {
                        this.player.decreaseVolume(step);
                        direction = -1;
                    } else {
                        this.player.increaseVolume(step);
                        direction = 1;
                    }
                }

                // Scroll up (or down on natural) to increase
                if (event.deltaY > 0 || event.deltaX < 0) {
                    if (inverted) {
                        this.player.increaseVolume(step);
                        direction = 1;
                    } else {
                        this.player.decreaseVolume(step);
                        direction = -1;
                    }
                }

                // Don't break page scrolling at max and min
                if ((direction === 1 && this.player.media.volume < 1) || (direction === -1 && this.player.media.volume > 0)) {
                    event.preventDefault();
                }
            },
            'volume',
            false,
        );
    }

    // Reset on destroy
    clear() {
        this.global(false);
    }
}

export default Listeners;
