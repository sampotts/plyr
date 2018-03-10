// ==========================================================================
// Plyr Event Listeners
// ==========================================================================

import support from './support';
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

    // Global window & document listeners
    global(toggle) {
        // Keyboard shortcuts
        if (this.player.config.keyboard.global) {
            utils.toggleListener(window, 'keydown keyup', this.handleKey, toggle, false);
        }

        // Click anywhere closes menu
        utils.toggleListener(document.body, 'click', this.toggleMenu, toggle);
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
        utils.on(this.player.media, 'durationchange loadedmetadata', event => ui.durationUpdate.call(this.player, event));

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

        // Handle native mute
        utils.on(this.player.media, 'volumechange', event => ui.updateVolume.call(this.player, event));

        // Handle native play/pause
        utils.on(this.player.media, 'playing play pause ended', event => ui.checkPlaying.call(this.player, event));

        // Loading
        utils.on(this.player.media, 'waiting canplay seeked playing', event => ui.checkLoading.call(this.player, event));

        // Check if media failed to load
        // utils.on(this.player.media, 'play', event => ui.checkFailed.call(this.player, event));

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
                if (this.player.config.hideControls && support.touch && !this.player.paused) {
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
                this.player.media,
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

        // Quality change
        utils.on(this.player.media, 'qualitychange', () => {
            // Update UI
            controls.updateSetting.call(this.player, 'quality');

            // Save to storage
            this.player.storage.set({ quality: this.player.quality });
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

        // Trigger custom and default handlers
        const proxy = (event, handlerKey, defaultHandler) => {
            const customHandler = this.player.config.listeners[handlerKey];

            // Execute custom handler
            if (utils.is.function(customHandler)) {
                customHandler.call(this.player, event);
            }

            // Only call default handler if not prevented in custom handler
            if (!event.defaultPrevented && utils.is.function(defaultHandler)) {
                defaultHandler.call(this.player, event);
            }
        };

        // Play/pause toggle
        utils.on(this.player.elements.buttons.play, 'click', event =>
            proxy(event, 'play', () => {
                this.player.togglePlay();
            }),
        );

        // Pause
        utils.on(this.player.elements.buttons.restart, 'click', event =>
            proxy(event, 'restart', () => {
                this.player.restart();
            }),
        );

        // Rewind
        utils.on(this.player.elements.buttons.rewind, 'click', event =>
            proxy(event, 'rewind', () => {
                this.player.rewind();
            }),
        );

        // Rewind
        utils.on(this.player.elements.buttons.forward, 'click', event =>
            proxy(event, 'forward', () => {
                this.player.forward();
            }),
        );

        // Mute toggle
        utils.on(this.player.elements.buttons.mute, 'click', event =>
            proxy(event, 'mute', () => {
                this.player.muted = !this.player.muted;
            }),
        );

        // Captions toggle
        utils.on(this.player.elements.buttons.captions, 'click', event =>
            proxy(event, 'captions', () => {
                this.player.toggleCaptions();
            }),
        );

        // Fullscreen toggle
        utils.on(this.player.elements.buttons.fullscreen, 'click', event =>
            proxy(event, 'fullscreen', () => {
                this.player.fullscreen.toggle();
            }),
        );

        // Picture-in-Picture
        utils.on(this.player.elements.buttons.pip, 'click', event =>
            proxy(event, 'pip', () => {
                this.player.pip = 'toggle';
            }),
        );

        // Airplay
        utils.on(this.player.elements.buttons.airplay, 'click', event =>
            proxy(event, 'airplay', () => {
                this.player.airplay();
            }),
        );

        // Settings menu
        utils.on(this.player.elements.buttons.settings, 'click', event => {
            controls.toggleMenu.call(this.player, event);
        });

        // Settings menu
        utils.on(this.player.elements.settings.form, 'click', event => {
            event.stopPropagation();

            // Settings menu items - use event delegation as items are added/removed
            if (utils.matches(event.target, this.player.config.selectors.inputs.language)) {
                proxy(event, 'language', () => {
                    this.player.language = event.target.value;
                });
            } else if (utils.matches(event.target, this.player.config.selectors.inputs.quality)) {
                proxy(event, 'quality', () => {
                    this.player.quality = event.target.value;
                });
            } else if (utils.matches(event.target, this.player.config.selectors.inputs.speed)) {
                proxy(event, 'speed', () => {
                    this.player.speed = parseFloat(event.target.value);
                });
            } else {
                controls.showTab.call(this.player, event);
            }
        });

        // Seek
        utils.on(this.player.elements.inputs.seek, inputEvent, event =>
            proxy(event, 'seek', () => {
                this.player.currentTime = event.target.value / event.target.max * this.player.duration;
            }),
        );

        // Current time invert
        // Only if one time element is used for both currentTime and duration
        if (this.player.config.toggleInvert && !utils.is.element(this.player.elements.display.duration)) {
            utils.on(this.player.elements.display.currentTime, 'click', () => {
                // Do nothing if we're at the start
                if (this.player.currentTime === 0) {
                    return;
                }

                this.player.config.invertTime = !this.player.config.invertTime;
                ui.timeUpdate.call(this.player);
            });
        }

        // Volume
        utils.on(this.player.elements.inputs.volume, inputEvent, event =>
            proxy(event, 'volume', () => {
                this.player.volume = event.target.value;
            }),
        );

        // Polyfill for lower fill in <input type="range"> for webkit
        if (browser.isWebkit) {
            utils.on(utils.getElements.call(this.player, 'input[type="range"]'), 'input', event => {
                controls.updateRangeFill.call(this.player, event.target);
            });
        }

        // Seek tooltip
        utils.on(this.player.elements.progress, 'mouseenter mouseleave mousemove', event => controls.updateSeekTooltip.call(this.player, event));

        // Toggle controls visibility based on mouse movement
        if (this.player.config.hideControls) {
            // Watch for cursor over controls so they don't hide when trying to interact
            utils.on(this.player.elements.controls, 'mouseenter mouseleave', event => {
                this.player.elements.controls.hover = event.type === 'mouseenter';
            });

            // Watch for cursor over controls so they don't hide when trying to interact
            utils.on(this.player.elements.controls, 'mousedown mouseup touchstart touchend touchcancel', event => {
                this.player.elements.controls.pressed = [
                    'mousedown',
                    'touchstart',
                ].includes(event.type);
            });

            // Focus in/out on controls
            utils.on(this.player.elements.controls, 'focusin focusout', event => {
                this.player.toggleControls(event);
            });
        }

        // Mouse wheel for volume
        utils.on(
            this.player.elements.inputs.volume,
            'wheel',
            event =>
                proxy(event, 'volume', () => {
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
                }),
            false,
        );
    }
}

export default Listeners;
