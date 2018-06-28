// ==========================================================================
// Plyr Event Listeners
// ==========================================================================

import controls from './controls';
import ui from './ui';
import browser from './utils/browser';
import { getElement, getElements, getFocusElement, matches, toggleClass, toggleHidden } from './utils/elements';
import { on, once, toggleListener, triggerEvent } from './utils/events';
import is from './utils/is';

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
        if (!is.number(code)) {
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
            const preventDefault = [32, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 54, 56, 57, 67, 70, 73, 75, 76, 77, 79];

            // Check focused element
            // and if the focused element is not editable (e.g. text input)
            // and any that accept key input http://webaim.org/techniques/keyboard/
            const focused = getFocusElement();
            if (
                is.element(focused) &&
                (focused !== this.player.elements.inputs.seek &&
                    matches(focused, this.player.config.selectors.editable))
            ) {
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
        toggleClass(this.player.elements.container, this.player.config.classNames.isTouch, true);
    }

    // Global window & document listeners
    global(toggle = true) {
        // Keyboard shortcuts
        if (this.player.config.keyboard.global) {
            toggleListener.call(this.player, window, 'keydown keyup', this.handleKey, toggle, false);
        }

        // Click anywhere closes menu
        toggleListener.call(this.player, document.body, 'click', this.toggleMenu, toggle);

        // Detect touch by events
        once.call(this.player, document.body, 'touchstart', this.firstTouch);
    }

    // Container listeners
    container() {
        // Keyboard shortcuts
        if (!this.player.config.keyboard.global && this.player.config.keyboard.focused) {
            on.call(this.player, this.player.elements.container, 'keydown keyup', this.handleKey, false);
        }

        // Detect tab focus
        // Remove class on blur/focusout
        on.call(this.player, this.player.elements.container, 'focusout', event => {
            toggleClass(event.target, this.player.config.classNames.tabFocus, false);
        });
        // Add classname to tabbed elements
        on.call(this.player, this.player.elements.container, 'keydown', event => {
            if (event.keyCode !== 9) {
                return;
            }

            // Delay the adding of classname until the focus has changed
            // This event fires before the focusin event
            setTimeout(() => {
                toggleClass(getFocusElement(), this.player.config.classNames.tabFocus, true);
            }, 0);
        });

        // Toggle controls on mouse events and entering fullscreen
        on.call(
            this.player,
            this.player.elements.container,
            'mousemove mouseleave touchstart touchmove enterfullscreen exitfullscreen',
            event => {
                const { controls } = this.player.elements;

                // Remove button states for fullscreen
                if (event.type === 'enterfullscreen') {
                    controls.pressed = false;
                    controls.hover = false;
                }

                // Show, then hide after a timeout unless another control event occurs
                const show = ['touchstart', 'touchmove', 'mousemove'].includes(event.type);

                let delay = 0;

                if (show) {
                    ui.toggleControls.call(this.player, true);
                    // Use longer timeout for touch devices
                    delay = this.player.touch ? 3000 : 2000;
                }

                // Clear timer
                clearTimeout(this.player.timers.controls);
                // Timer to prevent flicker when seeking
                this.player.timers.controls = setTimeout(() => ui.toggleControls.call(this.player, false), delay);
            },
        );
    }

    // Listen for media events
    media() {
        // Time change on media
        on.call(this.player, this.player.media, 'timeupdate seeking seeked', event =>
            controls.timeUpdate.call(this.player, event),
        );

        // Display duration
        on.call(this.player, this.player.media, 'durationchange loadeddata loadedmetadata', event =>
            controls.durationUpdate.call(this.player, event),
        );

        // Check for audio tracks on load
        // We can't use `loadedmetadata` as it doesn't seem to have audio tracks at that point
        on.call(this.player, this.player.media, 'canplay', () => {
            toggleHidden(this.player.elements.volume, !this.player.hasAudio);
            toggleHidden(this.player.elements.buttons.mute, !this.player.hasAudio);
        });

        // Handle the media finishing
        on.call(this.player, this.player.media, 'ended', () => {
            // Show poster on end
            if (this.player.isHTML5 && this.player.isVideo && this.player.config.resetOnEnd) {
                // Restart
                this.player.restart();
            }
        });

        // Check for buffer progress
        on.call(this.player, this.player.media, 'progress playing seeking seeked', event =>
            controls.updateProgress.call(this.player, event),
        );

        // Handle volume changes
        on.call(this.player, this.player.media, 'volumechange', event =>
            controls.updateVolume.call(this.player, event),
        );

        // Handle play/pause
        on.call(this.player, this.player.media, 'playing play pause ended emptied timeupdate', event =>
            ui.checkPlaying.call(this.player, event),
        );

        // Loading state
        on.call(this.player, this.player.media, 'waiting canplay seeked playing', event =>
            ui.checkLoading.call(this.player, event),
        );

        // If autoplay, then load advertisement if required
        // TODO: Show some sort of loading state while the ad manager loads else there's a delay before ad shows
        on.call(this.player, this.player.media, 'playing', () => {
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
            const wrapper = getElement.call(this.player, `.${this.player.config.classNames.video}`);

            // Bail if there's no wrapper (this should never happen)
            if (!is.element(wrapper)) {
                return;
            }

            // On click play, pause ore restart
            on.call(this.player, wrapper, 'click', () => {
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
            on.call(
                this.player,
                this.player.elements.wrapper,
                'contextmenu',
                event => {
                    event.preventDefault();
                },
                false,
            );
        }

        // Volume change
        on.call(this.player, this.player.media, 'volumechange', () => {
            // Save to storage
            this.player.storage.set({ volume: this.player.volume, muted: this.player.muted });
        });

        // Speed change
        on.call(this.player, this.player.media, 'ratechange', () => {
            // Update UI
            controls.updateSetting.call(this.player, 'speed');

            // Save to storage
            this.player.storage.set({ speed: this.player.speed });
        });

        // Quality request
        on.call(this.player, this.player.media, 'qualityrequested', event => {
            // Save to storage
            this.player.storage.set({ quality: event.detail.quality });
        });

        // Quality change
        on.call(this.player, this.player.media, 'qualitychange', event => {
            // Update UI
            controls.updateSetting.call(this.player, 'quality', null, event.detail.quality);
        });

        // Proxy events to container
        // Bubble up key events for Edge
        const proxyEvents = this.player.config.events.concat(['keyup', 'keydown']).join(' ');
        on.call(this.player, this.player.media, proxyEvents, event => {
            let { detail = {} } = event;

            // Get error details from media
            if (event.type === 'error') {
                detail = this.player.media.error;
            }

            triggerEvent.call(this.player, this.player.elements.container, event.type, true, detail);
        });
    }

    // Listen for control events
    controls() {
        // IE doesn't support input event, so we fallback to change
        const inputEvent = browser.isIE ? 'change' : 'input';

        // Run default and custom handlers
        const proxy = (event, defaultHandler, customHandlerKey) => {
            const customHandler = this.player.config.listeners[customHandlerKey];
            const hasCustomHandler = is.function(customHandler);
            let returned = true;

            // Execute custom handler
            if (hasCustomHandler) {
                returned = customHandler.call(this.player, event);
            }

            // Only call default handler if not prevented in custom handler
            if (returned && is.function(defaultHandler)) {
                defaultHandler.call(this.player, event);
            }
        };

        // Trigger custom and default handlers
        const bind = (element, type, defaultHandler, customHandlerKey, passive = true) => {
            const customHandler = this.player.config.listeners[customHandlerKey];
            const hasCustomHandler = is.function(customHandler);

            on.call(
                this.player,
                element,
                type,
                event => proxy(event, defaultHandler, customHandlerKey),
                passive && !hasCustomHandler,
            );
        };

        // Play/pause toggle
        if (this.player.elements.buttons.play) {
            Array.from(this.player.elements.buttons.play).forEach(button => {
                bind(button, 'click', this.player.togglePlay, 'play');
            });
        }

        // Pause
        bind(this.player.elements.buttons.restart, 'click', this.player.restart, 'restart');

        // Rewind
        bind(this.player.elements.buttons.rewind, 'click', this.player.rewind, 'rewind');

        // Rewind
        bind(this.player.elements.buttons.fastForward, 'click', this.player.forward, 'fastForward');

        // Mute toggle
        bind(
            this.player.elements.buttons.mute,
            'click',
            () => {
                this.player.muted = !this.player.muted;
            },
            'mute',
        );

        // Captions toggle
        bind(this.player.elements.buttons.captions, 'click', () => this.player.toggleCaptions());

        // Fullscreen toggle
        bind(
            this.player.elements.buttons.fullscreen,
            'click',
            () => {
                this.player.fullscreen.toggle();
            },
            'fullscreen',
        );

        // Picture-in-Picture
        bind(
            this.player.elements.buttons.pip,
            'click',
            () => {
                this.player.pip = 'toggle';
            },
            'pip',
        );

        // Airplay
        bind(this.player.elements.buttons.airplay, 'click', this.player.airplay, 'airplay');

        // Settings menu
        bind(this.player.elements.buttons.settings, 'click', event => {
            controls.toggleMenu.call(this.player, event);
        });

        // Settings menu
        bind(this.player.elements.settings.form, 'click', event => {
            event.stopPropagation();

            // Go back to home tab on click
            const showHomeTab = () => {
                const id = `plyr-settings-${this.player.id}-home`;
                controls.showTab.call(this.player, id);
            };

            // Settings menu items - use event delegation as items are added/removed
            if (matches(event.target, this.player.config.selectors.inputs.language)) {
                proxy(
                    event,
                    () => {
                        this.player.currentTrack = Number(event.target.value);
                        showHomeTab();
                    },
                    'language',
                );
            } else if (matches(event.target, this.player.config.selectors.inputs.quality)) {
                proxy(
                    event,
                    () => {
                        this.player.quality = event.target.value;
                        showHomeTab();
                    },
                    'quality',
                );
            } else if (matches(event.target, this.player.config.selectors.inputs.speed)) {
                proxy(
                    event,
                    () => {
                        this.player.speed = parseFloat(event.target.value);
                        showHomeTab();
                    },
                    'speed',
                );
            } else {
                const tab = event.target;
                controls.showTab.call(this.player, tab.getAttribute('aria-controls'));
            }
        });

        // Set range input alternative "value", which matches the tooltip time (#954)
        bind(this.player.elements.inputs.seek, 'mousedown mousemove', event => {
            const clientRect = this.player.elements.progress.getBoundingClientRect();
            const percent = 100 / clientRect.width * (event.pageX - clientRect.left);
            event.currentTarget.setAttribute('seek-value', percent);
        });

        // Pause while seeking
        bind(this.player.elements.inputs.seek, 'mousedown mouseup keydown keyup touchstart touchend', event => {
            const seek = event.currentTarget;

            const code = event.keyCode ? event.keyCode : event.which;
            const eventType = event.type;

            if ((eventType === 'keydown' || eventType === 'keyup') && (code !== 39 && code !== 37)) {
                return;
            }
            // Was playing before?
            const play = seek.hasAttribute('play-on-seeked');

            // Done seeking
            const done = ['mouseup', 'touchend', 'keyup'].includes(event.type);

            // If we're done seeking and it was playing, resume playback
            if (play && done) {
                seek.removeAttribute('play-on-seeked');
                this.player.play();
            } else if (!done && this.player.playing) {
                seek.setAttribute('play-on-seeked', '');
                this.player.pause();
            }
        });

        // Seek
        bind(
            this.player.elements.inputs.seek,
            inputEvent,
            event => {
                const seek = event.currentTarget;

                // If it exists, use seek-value instead of "value" for consistency with tooltip time (#954)
                let seekTo = seek.getAttribute('seek-value');

                if (is.empty(seekTo)) {
                    seekTo = seek.value;
                }

                seek.removeAttribute('seek-value');

                this.player.currentTime = seekTo / seek.max * this.player.duration;
            },
            'seek',
        );

        // Current time invert
        // Only if one time element is used for both currentTime and duration
        if (this.player.config.toggleInvert && !is.element(this.player.elements.display.duration)) {
            bind(this.player.elements.display.currentTime, 'click', () => {
                // Do nothing if we're at the start
                if (this.player.currentTime === 0) {
                    return;
                }

                this.player.config.invertTime = !this.player.config.invertTime;

                controls.timeUpdate.call(this.player);
            });
        }

        // Volume
        bind(
            this.player.elements.inputs.volume,
            inputEvent,
            event => {
                this.player.volume = event.target.value;
            },
            'volume',
        );

        // Polyfill for lower fill in <input type="range"> for webkit
        if (browser.isWebkit) {
            Array.from(getElements.call(this.player, 'input[type="range"]')).forEach(element => {
                bind(element, 'input', event => controls.updateRangeFill.call(this.player, event.target));
            });
        }

        // Seek tooltip
        bind(this.player.elements.progress, 'mouseenter mouseleave mousemove', event =>
            controls.updateSeekTooltip.call(this.player, event),
        );

        // Update controls.hover state (used for ui.toggleControls to avoid hiding when interacting)
        bind(this.player.elements.controls, 'mouseenter mouseleave', event => {
            this.player.elements.controls.hover = !this.player.touch && event.type === 'mouseenter';
        });

        // Update controls.pressed state (used for ui.toggleControls to avoid hiding when interacting)
        bind(this.player.elements.controls, 'mousedown mouseup touchstart touchend touchcancel', event => {
            this.player.elements.controls.pressed = ['mousedown', 'touchstart'].includes(event.type);
        });

        // Focus in/out on controls
        bind(this.player.elements.controls, 'focusin focusout', event => {
            const { config, elements, timers } = this.player;

            // Skip transition to prevent focus from scrolling the parent element
            toggleClass(elements.controls, config.classNames.noTransition, event.type === 'focusin');

            // Toggle
            ui.toggleControls.call(this.player, event.type === 'focusin');

            // If focusin, hide again after delay
            if (event.type === 'focusin') {
                // Restore transition
                setTimeout(() => {
                    toggleClass(elements.controls, config.classNames.noTransition, false);
                }, 0);

                // Delay a little more for keyboard users
                const delay = this.touch ? 3000 : 4000;

                // Clear timer
                clearTimeout(timers.controls);
                // Hide
                timers.controls = setTimeout(() => ui.toggleControls.call(this.player, false), delay);
            }
        });

        // Mouse wheel for volume
        bind(
            this.player.elements.inputs.volume,
            'wheel',
            event => {
                // Detect "natural" scroll - suppored on OS X Safari only
                // Other browsers on OS X will be inverted until support improves
                const inverted = event.webkitDirectionInvertedFromDevice;

                // Get delta from event. Invert if `inverted` is true
                const [x, y] = [event.deltaX, -event.deltaY].map(value => (inverted ? -value : value));

                // Using the biggest delta, normalize to 1 or -1 (or 0 if no delta)
                const direction = Math.sign(Math.abs(x) > Math.abs(y) ? x : y);

                // Change the volume by 2%
                this.player.increaseVolume(direction / 50);

                // Don't break page scrolling at max and min
                const { volume } = this.player.media;
                if ((direction === 1 && volume < 1) || (direction === -1 && volume > 0)) {
                    event.preventDefault();
                }
            },
            'volume',
            false,
        );
    }
}

export default Listeners;
