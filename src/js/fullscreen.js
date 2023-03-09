// ==========================================================================
// Fullscreen wrapper
// https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API#prefixing
// https://webkit.org/blog/7929/designing-websites-for-iphone-x/
// ==========================================================================

import browser from './utils/browser';
import { closest, getElements, hasClass, toggleClass } from './utils/elements';
import { on, triggerEvent } from './utils/events';
import is from './utils/is';
import { silencePromise } from './utils/promise';

class Fullscreen {
  constructor(player) {
    // Keep reference to parent
    this.player = player;

    // Get prefix
    this.prefix = Fullscreen.prefix;
    this.property = Fullscreen.property;

    // Scroll position
    this.scrollPosition = { x: 0, y: 0 };

    // Force the use of 'full window/browser' rather than fullscreen
    this.forceFallback = player.config.fullscreen.fallback === 'force';

    // Get the fullscreen element
    // Checks container is an ancestor, defaults to null
    this.player.elements.fullscreen =
      player.config.fullscreen.container && closest(this.player.elements.container, player.config.fullscreen.container);

    // Register event listeners
    // Handle event (incase user presses escape etc)
    on.call(
      this.player,
      document,
      this.prefix === 'ms' ? 'MSFullscreenChange' : `${this.prefix}fullscreenchange`,
      () => {
        // TODO: Filter for target??
        this.onChange();
      },
    );

    // Fullscreen toggle on double click
    on.call(this.player, this.player.elements.container, 'dblclick', (event) => {
      // Ignore double click in controls
      if (is.element(this.player.elements.controls) && this.player.elements.controls.contains(event.target)) {
        return;
      }

      this.player.listeners.proxy(event, this.toggle, 'fullscreen');
    });

    // Tap focus when in fullscreen
    on.call(this, this.player.elements.container, 'keydown', (event) => this.trapFocus(event));

    // Update the UI
    this.update();
  }

  // Determine if native supported
  static get nativeSupported() {
    return !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
  }

  // If we're actually using native
  get useNative() {
    return Fullscreen.nativeSupported && !this.forceFallback;
  }

  // Get the prefix for handlers
  static get prefix() {
    // No prefix
    if (is.function(document.exitFullscreen)) return '';

    // Check for fullscreen support by vendor prefix
    let value = '';
    const prefixes = ['webkit', 'moz', 'ms'];

    prefixes.some((pre) => {
      if (is.function(document[`${pre}ExitFullscreen`]) || is.function(document[`${pre}CancelFullScreen`])) {
        value = pre;
        return true;
      }

      return false;
    });

    return value;
  }

  static get property() {
    return this.prefix === 'moz' ? 'FullScreen' : 'Fullscreen';
  }

  // Determine if fullscreen is supported
  get supported() {
    return [
      // Fullscreen is enabled in config
      this.player.config.fullscreen.enabled,
      // Must be a video
      this.player.isVideo,
      // Either native is supported or fallback enabled
      Fullscreen.nativeSupported || this.player.config.fullscreen.fallback,
      // YouTube has no way to trigger fullscreen, so on devices with no native support, playsinline
      // must be enabled and iosNative fullscreen must be disabled to offer the fullscreen fallback
      !this.player.isYouTube ||
        Fullscreen.nativeSupported ||
        !browser.isIos ||
        (this.player.config.playsinline && !this.player.config.fullscreen.iosNative),
    ].every(Boolean);
  }

  // Get active state
  get active() {
    if (!this.supported) return false;

    // Fallback using classname
    if (!Fullscreen.nativeSupported || this.forceFallback) {
      return hasClass(this.target, this.player.config.classNames.fullscreen.fallback);
    }

    const element = !this.prefix
      ? this.target.getRootNode().fullscreenElement
      : this.target.getRootNode()[`${this.prefix}${this.property}Element`];

    return element && element.shadowRoot ? element === this.target.getRootNode().host : element === this.target;
  }

  // Get target element
  get target() {
    return browser.isIos && this.player.config.fullscreen.iosNative
      ? this.player.media
      : this.player.elements.fullscreen ?? this.player.elements.container;
  }

  onChange = () => {
    if (!this.supported) return;

    // Update toggle button
    const button = this.player.elements.buttons.fullscreen;
    if (is.element(button)) {
      button.pressed = this.active;
    }

    // Always trigger events on the plyr / media element (not a fullscreen container) and let them bubble up
    const target = this.target === this.player.media ? this.target : this.player.elements.container;
    // Trigger an event
    triggerEvent.call(this.player, target, this.active ? 'enterfullscreen' : 'exitfullscreen', true);
  };

  toggleFallback = (toggle = false) => {
    // Store or restore scroll position
    if (toggle) {
      this.scrollPosition = {
        x: window.scrollX ?? 0,
        y: window.scrollY ?? 0,
      };
    } else {
      window.scrollTo(this.scrollPosition.x, this.scrollPosition.y);
    }

    // Toggle scroll
    document.body.style.overflow = toggle ? 'hidden' : '';

    // Toggle class hook
    toggleClass(this.target, this.player.config.classNames.fullscreen.fallback, toggle);

    // Force full viewport on iPhone X+
    if (browser.isIos) {
      let viewport = document.head.querySelector('meta[name="viewport"]');
      const property = 'viewport-fit=cover';

      // Inject the viewport meta if required
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
      }

      // Check if the property already exists
      const hasProperty = is.string(viewport.content) && viewport.content.includes(property);

      if (toggle) {
        this.cleanupViewport = !hasProperty;
        if (!hasProperty) viewport.content += `,${property}`;
      } else if (this.cleanupViewport) {
        viewport.content = viewport.content
          .split(',')
          .filter((part) => part.trim() !== property)
          .join(',');
      }
    }

    // Toggle button and fire events
    this.onChange();
  };

  // Trap focus inside container
  trapFocus = (event) => {
    // Bail if iOS/iPadOS, not active, not the tab key
    if (browser.isIos || browser.isIPadOS || !this.active || event.key !== 'Tab') return;

    // Get the current focused element
    const focused = document.activeElement;
    const focusable = getElements.call(this.player, 'a[href], button:not(:disabled), input:not(:disabled), [tabindex]');
    const [first] = focusable;
    const last = focusable[focusable.length - 1];

    if (focused === last && !event.shiftKey) {
      // Move focus to first element that can be tabbed if Shift isn't used
      first.focus();
      event.preventDefault();
    } else if (focused === first && event.shiftKey) {
      // Move focus to last element that can be tabbed if Shift is used
      last.focus();
      event.preventDefault();
    }
  };

  // Update UI
  update = () => {
    if (this.supported) {
      let mode;

      if (this.forceFallback) mode = 'Fallback (forced)';
      else if (Fullscreen.nativeSupported) mode = 'Native';
      else mode = 'Fallback';

      this.player.debug.log(`${mode} fullscreen enabled`);
    } else {
      this.player.debug.log('Fullscreen not supported and fallback disabled');
    }

    // Add styling hook to show button
    toggleClass(this.player.elements.container, this.player.config.classNames.fullscreen.enabled, this.supported);
  };

  // Make an element fullscreen
  enter = () => {
    if (!this.supported) return;

    // iOS native fullscreen doesn't need the request step
    if (browser.isIos && this.player.config.fullscreen.iosNative) {
      if (this.player.isVimeo) {
        this.player.embed.requestFullscreen();
      } else {
        this.target.webkitEnterFullscreen();
      }
    } else if (!Fullscreen.nativeSupported || this.forceFallback) {
      this.toggleFallback(true);
    } else if (!this.prefix) {
      this.target.requestFullscreen({ navigationUI: 'hide' });
    } else if (!is.empty(this.prefix)) {
      this.target[`${this.prefix}Request${this.property}`]();
    }
  };

  // Bail from fullscreen
  exit = () => {
    if (!this.supported) return;

    // iOS native fullscreen
    if (browser.isIos && this.player.config.fullscreen.iosNative) {
      if (this.player.isVimeo) {
        this.player.embed.exitFullscreen();
      } else {
        this.target.webkitEnterFullscreen();
      }
      silencePromise(this.player.play());
    } else if (!Fullscreen.nativeSupported || this.forceFallback) {
      this.toggleFallback(false);
    } else if (!this.prefix) {
      (document.cancelFullScreen || document.exitFullscreen).call(document);
    } else if (!is.empty(this.prefix)) {
      const action = this.prefix === 'moz' ? 'Cancel' : 'Exit';
      document[`${this.prefix}${action}${this.property}`]();
    }
  };

  // Toggle state
  toggle = () => {
    if (!this.active) this.enter();
    else this.exit();
  };
}

export default Fullscreen;
