// ==========================================================================
// Fullscreen wrapper
// https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API#prefixing
// https://webkit.org/blog/7929/designing-websites-for-iphone-x/
// ==========================================================================

import browser from './utils/browser';
import { closest,getElements, hasClass, toggleClass } from './utils/elements';
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
    on.call(this.player, this.player.elements.container, 'dblclick', event => {
      // Ignore double click in controls
      if (is.element(this.player.elements.controls) && this.player.elements.controls.contains(event.target)) {
        return;
      }

      this.toggle();
    });

    // Tap focus when in fullscreen
    on.call(this, this.player.elements.container, 'keydown', event => this.trapFocus(event));

    // Update the UI
    this.update();
  }

  // Determine if native supported
  static get native() {
    return !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
  }

  // If we're actually using native
  get usingNative() {
    return Fullscreen.native && !this.forceFallback;
  }

  // Get the prefix for handlers
  static get prefix() {
    // No prefix
    if (is.function(document.exitFullscreen)) {
      return '';
    }

    // Check for fullscreen support by vendor prefix
    let value = '';
    const prefixes = ['webkit', 'moz', 'ms'];

    prefixes.some(pre => {
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

  // Determine if fullscreen is enabled
  get enabled() {
    return (
      (Fullscreen.native || this.player.config.fullscreen.fallback) &&
      this.player.config.fullscreen.enabled &&
      this.player.supported.ui &&
      this.player.isVideo
    );
  }

  // Get active state
  get active() {
    if (!this.enabled) {
      return false;
    }

    // Fallback using classname
    if (!Fullscreen.native || this.forceFallback) {
      return hasClass(this.target, this.player.config.classNames.fullscreen.fallback);
    }

    const element = !this.prefix ? document.fullscreenElement : document[`${this.prefix}${this.property}Element`];

    return element && element.shadowRoot ? element === this.target.getRootNode().host : element === this.target;
  }

  // Get target element
  get target() {
    return browser.isIos && this.player.config.fullscreen.iosNative
      ? this.player.media
      : this.player.elements.fullscreen || this.player.elements.container;
  }

  onChange() {
    if (!this.enabled) {
      return;
    }

    // Update toggle button
    const button = this.player.elements.buttons.fullscreen;
    if (is.element(button)) {
      button.pressed = this.active;
    }

    // Trigger an event
    triggerEvent.call(this.player, this.target, this.active ? 'enterfullscreen' : 'exitfullscreen', true);
  }

  toggleFallback(toggle = false) {
    // Store or restore scroll position
    if (toggle) {
      this.scrollPosition = {
        x: window.scrollX || 0,
        y: window.scrollY || 0,
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

        if (!hasProperty) {
          viewport.content += `,${property}`;
        }
      } else if (this.cleanupViewport) {
        viewport.content = viewport.content
          .split(',')
          .filter(part => part.trim() !== property)
          .join(',');
      }
    }

    // Toggle button and fire events
    this.onChange();
  }

  // Trap focus inside container
  trapFocus(event) {
    // Bail if iOS, not active, not the tab key
    if (browser.isIos || !this.active || event.key !== 'Tab' || event.keyCode !== 9) {
      return;
    }

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
  }

  // Update UI
  update() {
    if (this.enabled) {
      let mode;

      if (this.forceFallback) {
        mode = 'Fallback (forced)';
      } else if (Fullscreen.native) {
        mode = 'Native';
      } else {
        mode = 'Fallback';
      }

      this.player.debug.log(`${mode} fullscreen enabled`);
    } else {
      this.player.debug.log('Fullscreen not supported and fallback disabled');
    }

    // Add styling hook to show button
    toggleClass(this.player.elements.container, this.player.config.classNames.fullscreen.enabled, this.enabled);
  }

  // Make an element fullscreen
  enter() {
    if (!this.enabled) {
      return;
    }

    // iOS native fullscreen doesn't need the request step
    if (browser.isIos && this.player.config.fullscreen.iosNative) {
      this.target.webkitEnterFullscreen();
    } else if (!Fullscreen.native || this.forceFallback) {
      this.toggleFallback(true);
    } else if (!this.prefix) {
      this.target.requestFullscreen({ navigationUI: 'hide' });
    } else if (!is.empty(this.prefix)) {
      this.target[`${this.prefix}Request${this.property}`]();
    }
  }

  // Bail from fullscreen
  exit() {
    if (!this.enabled) {
      return;
    }

    // iOS native fullscreen
    if (browser.isIos && this.player.config.fullscreen.iosNative) {
      this.target.webkitExitFullscreen();
      silencePromise(this.player.play());
    } else if (!Fullscreen.native || this.forceFallback) {
      this.toggleFallback(false);
    } else if (!this.prefix) {
      (document.cancelFullScreen || document.exitFullscreen).call(document);
    } else if (!is.empty(this.prefix)) {
      const action = this.prefix === 'moz' ? 'Cancel' : 'Exit';
      document[`${this.prefix}${action}${this.property}`]();
    }
  }

  // Toggle state
  toggle() {
    if (!this.active) {
      this.enter();
    } else {
      this.exit();
    }
  }
}

export default Fullscreen;
