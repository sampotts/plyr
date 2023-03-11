// ==========================================================================
// Plyr Event Listeners
// ==========================================================================

import controls from './controls';
import ui from './ui';
import { repaint } from './utils/animation';
import browser from './utils/browser';
import { getElement, getElements, matches, toggleClass } from './utils/elements';
import { off, on, once, toggleListener, triggerEvent } from './utils/events';
import is from './utils/is';
import { silencePromise } from './utils/promise';
import { getAspectRatio, getViewportSize, supportsCSS } from './utils/style';

class Listeners {
  constructor(player) {
    this.player = player;
    this.lastKey = null;
    this.focusTimer = null;
    this.lastKeyDown = null;

    this.handleKey = this.handleKey.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.firstTouch = this.firstTouch.bind(this);
  }

  // Handle key presses
  handleKey(event) {
    const { player } = this;
    const { elements } = player;
    const { key, type, altKey, ctrlKey, metaKey, shiftKey } = event;
    const pressed = type === 'keydown';
    const repeat = pressed && key === this.lastKey;

    // Bail if a modifier key is set
    if (altKey || ctrlKey || metaKey || shiftKey) {
      return;
    }

    // If the event is bubbled from the media element
    // Firefox doesn't get the key for whatever reason
    if (!key) {
      return;
    }

    // Seek by increment
    const seekByIncrement = (increment) => {
      // Divide the max duration into 10th's and times by the number value
      player.currentTime = (player.duration / 10) * increment;
    };

    // Handle the key on keydown
    // Reset on keyup
    if (pressed) {
      // Check focused element
      // and if the focused element is not editable (e.g. text input)
      // and any that accept key input http://webaim.org/techniques/keyboard/
      const focused = document.activeElement;
      if (is.element(focused)) {
        const { editable } = player.config.selectors;
        const { seek } = elements.inputs;

        if (focused !== seek && matches(focused, editable)) {
          return;
        }

        if (event.key === ' ' && matches(focused, 'button, [role^="menuitem"]')) {
          return;
        }
      }

      // Which keys should we prevent default
      const preventDefault = [
        ' ',
        'ArrowLeft',
        'ArrowUp',
        'ArrowRight',
        'ArrowDown',

        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',

        'c',
        'f',
        'k',
        'l',
        'm',
      ];

      // If the key is found prevent default (e.g. prevent scrolling for arrows)
      if (preventDefault.includes(key)) {
        event.preventDefault();
        event.stopPropagation();
      }

      switch (key) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          if (!repeat) {
            seekByIncrement(parseInt(key, 10));
          }
          break;

        case ' ':
        case 'k':
          if (!repeat) {
            silencePromise(player.togglePlay());
          }
          break;

        case 'ArrowUp':
          player.increaseVolume(0.1);
          break;

        case 'ArrowDown':
          player.decreaseVolume(0.1);
          break;

        case 'm':
          if (!repeat) {
            player.muted = !player.muted;
          }
          break;

        case 'ArrowRight':
          player.forward();
          break;

        case 'ArrowLeft':
          player.rewind();
          break;

        case 'f':
          player.fullscreen.toggle();
          break;

        case 'c':
          if (!repeat) {
            player.toggleCaptions();
          }
          break;

        case 'l':
          player.loop = !player.loop;
          break;

        default:
          break;
      }

      // Escape is handle natively when in full screen
      // So we only need to worry about non native
      if (key === 'Escape' && !player.fullscreen.usingNative && player.fullscreen.active) {
        player.fullscreen.toggle();
      }

      // Store last key for next cycle
      this.lastKey = key;
    } else {
      this.lastKey = null;
    }
  }

  // Toggle menu
  toggleMenu(event) {
    controls.toggleMenu.call(this.player, event);
  }

  // Device is touch enabled
  firstTouch = () => {
    const { player } = this;
    const { elements } = player;

    player.touch = true;

    // Add touch class
    toggleClass(elements.container, player.config.classNames.isTouch, true);
  };

  // Global window & document listeners
  global = (toggle = true) => {
    const { player } = this;

    // Keyboard shortcuts
    if (player.config.keyboard.global) {
      toggleListener.call(player, window, 'keydown keyup', this.handleKey, toggle, false);
    }

    // Click anywhere closes menu
    toggleListener.call(player, document.body, 'click', this.toggleMenu, toggle);

    // Detect touch by events
    once.call(player, document.body, 'touchstart', this.firstTouch);
  };

  // Container listeners
  container = () => {
    const { player } = this;
    const { config, elements, timers } = player;

    // Keyboard shortcuts
    if (!config.keyboard.global && config.keyboard.focused) {
      on.call(player, elements.container, 'keydown keyup', this.handleKey, false);
    }

    // Toggle controls on mouse events and entering fullscreen
    on.call(
      player,
      elements.container,
      'mousemove mouseleave touchstart touchmove enterfullscreen exitfullscreen',
      (event) => {
        const { controls: controlsElement } = elements;

        // Remove button states for fullscreen
        if (controlsElement && event.type === 'enterfullscreen') {
          controlsElement.pressed = false;
          controlsElement.hover = false;
        }

        // Show, then hide after a timeout unless another control event occurs
        const show = ['touchstart', 'touchmove', 'mousemove'].includes(event.type);
        let delay = 0;

        if (show) {
          ui.toggleControls.call(player, true);
          // Use longer timeout for touch devices
          delay = player.touch ? 3000 : 2000;
        }

        // Clear timer
        clearTimeout(timers.controls);

        // Set new timer to prevent flicker when seeking
        timers.controls = setTimeout(() => ui.toggleControls.call(player, false), delay);
      },
    );

    // Set a gutter for Vimeo
    const setGutter = () => {
      if (!player.isVimeo || player.config.vimeo.premium) {
        return;
      }

      const target = elements.wrapper;
      const { active } = player.fullscreen;
      const [videoWidth, videoHeight] = getAspectRatio.call(player);
      const useNativeAspectRatio = supportsCSS(`aspect-ratio: ${videoWidth} / ${videoHeight}`);

      // If not active, remove styles
      if (!active) {
        if (useNativeAspectRatio) {
          target.style.width = null;
          target.style.height = null;
        } else {
          target.style.maxWidth = null;
          target.style.margin = null;
        }
        return;
      }

      // Determine which dimension will overflow and constrain view
      const [viewportWidth, viewportHeight] = getViewportSize();
      const overflow = viewportWidth / viewportHeight > videoWidth / videoHeight;

      if (useNativeAspectRatio) {
        target.style.width = overflow ? 'auto' : '100%';
        target.style.height = overflow ? '100%' : 'auto';
      } else {
        target.style.maxWidth = overflow ? `${(viewportHeight / videoHeight) * videoWidth}px` : null;
        target.style.margin = overflow ? '0 auto' : null;
      }
    };

    // Handle resizing
    const resized = () => {
      clearTimeout(timers.resized);
      timers.resized = setTimeout(setGutter, 50);
    };

    on.call(player, elements.container, 'enterfullscreen exitfullscreen', (event) => {
      const { target } = player.fullscreen;

      // Ignore events not from target
      if (target !== elements.container) {
        return;
      }

      // If it's not an embed and no ratio specified
      if (!player.isEmbed && is.empty(player.config.ratio)) {
        return;
      }

      // Set Vimeo gutter
      setGutter();

      // Watch for resizes
      const method = event.type === 'enterfullscreen' ? on : off;
      method.call(player, window, 'resize', resized);
    });
  };

  // Listen for media events
  media = () => {
    const { player } = this;
    const { elements } = player;

    // Time change on media
    on.call(player, player.media, 'timeupdate seeking seeked', (event) => controls.timeUpdate.call(player, event));

    // Display duration
    on.call(player, player.media, 'durationchange loadeddata loadedmetadata', (event) =>
      controls.durationUpdate.call(player, event),
    );

    // Handle the media finishing
    on.call(player, player.media, 'ended', () => {
      // Show poster on end
      if (player.isHTML5 && player.isVideo && player.config.resetOnEnd) {
        // Restart
        player.restart();

        // Call pause otherwise IE11 will start playing the video again
        player.pause();
      }
    });

    // Check for buffer progress
    on.call(player, player.media, 'progress playing seeking seeked', (event) =>
      controls.updateProgress.call(player, event),
    );

    // Handle volume changes
    on.call(player, player.media, 'volumechange', (event) => controls.updateVolume.call(player, event));

    // Handle play/pause
    on.call(player, player.media, 'playing play pause ended emptied timeupdate', (event) =>
      ui.checkPlaying.call(player, event),
    );

    // Loading state
    on.call(player, player.media, 'waiting canplay seeked playing', (event) => ui.checkLoading.call(player, event));

    // Click video
    if (player.supported.ui && player.config.clickToPlay && !player.isAudio) {
      // Re-fetch the wrapper
      const wrapper = getElement.call(player, `.${player.config.classNames.video}`);

      // Bail if there's no wrapper (this should never happen)
      if (!is.element(wrapper)) {
        return;
      }

      // On click play, pause or restart
      on.call(player, elements.container, 'click', (event) => {
        const targets = [elements.container, wrapper];

        // Ignore if click if not container or in video wrapper
        if (!targets.includes(event.target) && !wrapper.contains(event.target)) {
          return;
        }

        // Touch devices will just show controls (if hidden)
        if (player.touch && player.config.hideControls) {
          return;
        }

        if (player.ended) {
          this.proxy(event, player.restart, 'restart');
          this.proxy(
            event,
            () => {
              silencePromise(player.play());
            },
            'play',
          );
        } else {
          this.proxy(
            event,
            () => {
              silencePromise(player.togglePlay());
            },
            'play',
          );
        }
      });
    }

    // Disable right click
    if (player.supported.ui && player.config.disableContextMenu) {
      on.call(
        player,
        elements.wrapper,
        'contextmenu',
        (event) => {
          event.preventDefault();
        },
        false,
      );
    }

    // Volume change
    on.call(player, player.media, 'volumechange', () => {
      // Save to storage
      player.storage.set({
        volume: player.volume,
        muted: player.muted,
      });
    });

    // Speed change
    on.call(player, player.media, 'ratechange', () => {
      // Update UI
      controls.updateSetting.call(player, 'speed');

      // Save to storage
      player.storage.set({ speed: player.speed });
    });

    // Quality change
    on.call(player, player.media, 'qualitychange', (event) => {
      // Update UI
      controls.updateSetting.call(player, 'quality', null, event.detail.quality);
    });

    // Update download link when ready and if quality changes
    on.call(player, player.media, 'ready qualitychange', () => {
      controls.setDownloadUrl.call(player);
    });

    // Proxy events to container
    // Bubble up key events for Edge
    const proxyEvents = player.config.events.concat(['keyup', 'keydown']).join(' ');

    on.call(player, player.media, proxyEvents, (event) => {
      let { detail = {} } = event;

      // Get error details from media
      if (event.type === 'error') {
        detail = player.media.error;
      }

      triggerEvent.call(player, elements.container, event.type, true, detail);
    });
  };

  // Run default and custom handlers
  proxy = (event, defaultHandler, customHandlerKey) => {
    const { player } = this;
    const customHandler = player.config.listeners[customHandlerKey];
    const hasCustomHandler = is.function(customHandler);
    let returned = true;

    // Execute custom handler
    if (hasCustomHandler) {
      returned = customHandler.call(player, event);
    }

    // Only call default handler if not prevented in custom handler
    if (returned !== false && is.function(defaultHandler)) {
      defaultHandler.call(player, event);
    }
  };

  // Trigger custom and default handlers
  bind = (element, type, defaultHandler, customHandlerKey, passive = true) => {
    const { player } = this;
    const customHandler = player.config.listeners[customHandlerKey];
    const hasCustomHandler = is.function(customHandler);

    on.call(
      player,
      element,
      type,
      (event) => this.proxy(event, defaultHandler, customHandlerKey),
      passive && !hasCustomHandler,
    );
  };

  // Listen for control events
  controls = () => {
    const { player } = this;
    const { elements } = player;
    // IE doesn't support input event, so we fallback to change
    const inputEvent = browser.isIE ? 'change' : 'input';

    // Play/pause toggle
    if (elements.buttons.play) {
      Array.from(elements.buttons.play).forEach((button) => {
        this.bind(
          button,
          'click',
          () => {
            silencePromise(player.togglePlay());
          },
          'play',
        );
      });
    }

    // Pause
    this.bind(elements.buttons.restart, 'click', player.restart, 'restart');

    // Rewind
    this.bind(
      elements.buttons.rewind,
      'click',
      () => {
        // Record seek time so we can prevent hiding controls for a few seconds after rewind
        player.lastSeekTime = Date.now();
        player.rewind();
      },
      'rewind',
    );

    // Rewind
    this.bind(
      elements.buttons.fastForward,
      'click',
      () => {
        // Record seek time so we can prevent hiding controls for a few seconds after fast forward
        player.lastSeekTime = Date.now();
        player.forward();
      },
      'fastForward',
    );

    // Mute toggle
    this.bind(
      elements.buttons.mute,
      'click',
      () => {
        player.muted = !player.muted;
      },
      'mute',
    );

    // Captions toggle
    this.bind(elements.buttons.captions, 'click', () => player.toggleCaptions());

    // Download
    this.bind(
      elements.buttons.download,
      'click',
      () => {
        triggerEvent.call(player, player.media, 'download');
      },
      'download',
    );

    // Fullscreen toggle
    this.bind(
      elements.buttons.fullscreen,
      'click',
      () => {
        player.fullscreen.toggle();
      },
      'fullscreen',
    );

    // Picture-in-Picture
    this.bind(
      elements.buttons.pip,
      'click',
      () => {
        player.pip = 'toggle';
      },
      'pip',
    );

    // Airplay
    this.bind(elements.buttons.airplay, 'click', player.airplay, 'airplay');

    // Settings menu - click toggle
    this.bind(
      elements.buttons.settings,
      'click',
      (event) => {
        // Prevent the document click listener closing the menu
        event.stopPropagation();
        event.preventDefault();

        controls.toggleMenu.call(player, event);
      },
      null,
      false,
    ); // Can't be passive as we're preventing default

    // Settings menu - keyboard toggle
    // We have to bind to keyup otherwise Firefox triggers a click when a keydown event handler shifts focus
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1220143
    this.bind(
      elements.buttons.settings,
      'keyup',
      (event) => {
        if (![' ', 'Enter'].includes(event.key)) {
          return;
        }

        // Because return triggers a click anyway, all we need to do is set focus
        if (event.key === 'Enter') {
          controls.focusFirstMenuItem.call(player, null, true);
          return;
        }

        // Prevent scroll
        event.preventDefault();

        // Prevent playing video (Firefox)
        event.stopPropagation();

        // Toggle menu
        controls.toggleMenu.call(player, event);
      },
      null,
      false, // Can't be passive as we're preventing default
    );

    // Escape closes menu
    this.bind(elements.settings.menu, 'keydown', (event) => {
      if (event.key === 'Escape') {
        controls.toggleMenu.call(player, event);
      }
    });

    // Set range input alternative "value", which matches the tooltip time (#954)
    this.bind(elements.inputs.seek, 'mousedown mousemove', (event) => {
      const rect = elements.progress.getBoundingClientRect();
      const percent = (100 / rect.width) * (event.pageX - rect.left);
      event.currentTarget.setAttribute('seek-value', percent);
    });

    // Pause while seeking
    this.bind(elements.inputs.seek, 'mousedown mouseup keydown keyup touchstart touchend', (event) => {
      const seek = event.currentTarget;
      const attribute = 'play-on-seeked';

      if (is.keyboardEvent(event) && !['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        return;
      }

      // Record seek time so we can prevent hiding controls for a few seconds after seek
      player.lastSeekTime = Date.now();

      // Was playing before?
      const play = seek.hasAttribute(attribute);
      // Done seeking
      const done = ['mouseup', 'touchend', 'keyup'].includes(event.type);

      // If we're done seeking and it was playing, resume playback
      if (play && done) {
        seek.removeAttribute(attribute);
        silencePromise(player.play());
      } else if (!done && player.playing) {
        seek.setAttribute(attribute, '');
        player.pause();
      }
    });

    // Fix range inputs on iOS
    // Super weird iOS bug where after you interact with an <input type="range">,
    // it takes over further interactions on the page. This is a hack
    if (browser.isIos) {
      const inputs = getElements.call(player, 'input[type="range"]');
      Array.from(inputs).forEach((input) => this.bind(input, inputEvent, (event) => repaint(event.target)));
    }

    // Seek
    this.bind(
      elements.inputs.seek,
      inputEvent,
      (event) => {
        const seek = event.currentTarget;
        // If it exists, use seek-value instead of "value" for consistency with tooltip time (#954)
        let seekTo = seek.getAttribute('seek-value');

        if (is.empty(seekTo)) {
          seekTo = seek.value;
        }

        seek.removeAttribute('seek-value');

        player.currentTime = (seekTo / seek.max) * player.duration;
      },
      'seek',
    );

    // Seek tooltip
    this.bind(elements.progress, 'mouseenter mouseleave mousemove', (event) =>
      controls.updateSeekTooltip.call(player, event),
    );

    // Preview thumbnails plugin
    // TODO: Really need to work on some sort of plug-in wide event bus or pub-sub for this
    this.bind(elements.progress, 'mousemove touchmove', (event) => {
      const { previewThumbnails } = player;

      if (previewThumbnails && previewThumbnails.loaded) {
        previewThumbnails.startMove(event);
      }
    });

    // Hide thumbnail preview - on mouse click, mouse leave, and video play/seek. All four are required, e.g., for buffering
    this.bind(elements.progress, 'mouseleave touchend click', () => {
      const { previewThumbnails } = player;

      if (previewThumbnails && previewThumbnails.loaded) {
        previewThumbnails.endMove(false, true);
      }
    });

    // Show scrubbing preview
    this.bind(elements.progress, 'mousedown touchstart', (event) => {
      const { previewThumbnails } = player;

      if (previewThumbnails && previewThumbnails.loaded) {
        previewThumbnails.startScrubbing(event);
      }
    });

    this.bind(elements.progress, 'mouseup touchend', (event) => {
      const { previewThumbnails } = player;

      if (previewThumbnails && previewThumbnails.loaded) {
        previewThumbnails.endScrubbing(event);
      }
    });

    // Polyfill for lower fill in <input type="range"> for webkit
    if (browser.isWebKit) {
      Array.from(getElements.call(player, 'input[type="range"]')).forEach((element) => {
        this.bind(element, 'input', (event) => controls.updateRangeFill.call(player, event.target));
      });
    }

    // Current time invert
    // Only if one time element is used for both currentTime and duration
    if (player.config.toggleInvert && !is.element(elements.display.duration)) {
      this.bind(elements.display.currentTime, 'click', () => {
        // Do nothing if we're at the start
        if (player.currentTime === 0) {
          return;
        }

        player.config.invertTime = !player.config.invertTime;

        controls.timeUpdate.call(player);
      });
    }

    // Volume
    this.bind(
      elements.inputs.volume,
      inputEvent,
      (event) => {
        player.volume = event.target.value;
      },
      'volume',
    );

    // Update controls.hover state (used for ui.toggleControls to avoid hiding when interacting)
    this.bind(elements.controls, 'mouseenter mouseleave', (event) => {
      elements.controls.hover = !player.touch && event.type === 'mouseenter';
    });

    // Also update controls.hover state for any non-player children of fullscreen element (as above)
    if (elements.fullscreen) {
      Array.from(elements.fullscreen.children)
        .filter((c) => !c.contains(elements.container))
        .forEach((child) => {
          this.bind(child, 'mouseenter mouseleave', (event) => {
            if (elements.controls) {
              elements.controls.hover = !player.touch && event.type === 'mouseenter';
            }
          });
        });
    }

    // Update controls.pressed state (used for ui.toggleControls to avoid hiding when interacting)
    this.bind(elements.controls, 'mousedown mouseup touchstart touchend touchcancel', (event) => {
      elements.controls.pressed = ['mousedown', 'touchstart'].includes(event.type);
    });

    // Show controls when they receive focus (e.g., when using keyboard tab key)
    this.bind(elements.controls, 'focusin', () => {
      const { config, timers } = player;

      // Skip transition to prevent focus from scrolling the parent element
      toggleClass(elements.controls, config.classNames.noTransition, true);

      // Toggle
      ui.toggleControls.call(player, true);

      // Restore transition
      setTimeout(() => {
        toggleClass(elements.controls, config.classNames.noTransition, false);
      }, 0);

      // Delay a little more for mouse users
      const delay = this.touch ? 3000 : 4000;

      // Clear timer
      clearTimeout(timers.controls);

      // Hide again after delay
      timers.controls = setTimeout(() => ui.toggleControls.call(player, false), delay);
    });

    // Mouse wheel for volume
    this.bind(
      elements.inputs.volume,
      'wheel',
      (event) => {
        // Detect "natural" scroll - supported on OS X Safari only
        // Other browsers on OS X will be inverted until support improves
        const inverted = event.webkitDirectionInvertedFromDevice;
        // Get delta from event. Invert if `inverted` is true
        const [x, y] = [event.deltaX, -event.deltaY].map((value) => (inverted ? -value : value));
        // Using the biggest delta, normalize to 1 or -1 (or 0 if no delta)
        const direction = Math.sign(Math.abs(x) > Math.abs(y) ? x : y);

        // Change the volume by 2%
        player.increaseVolume(direction / 50);

        // Don't break page scrolling at max and min
        const { volume } = player.media;
        if ((direction === 1 && volume < 1) || (direction === -1 && volume > 0)) {
          event.preventDefault();
        }
      },
      'volume',
      false,
    );
  };
}

export default Listeners;
