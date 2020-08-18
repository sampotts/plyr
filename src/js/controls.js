// ==========================================================================
// Plyr controls
// TODO: This needs to be split into smaller files and cleaned up
// ==========================================================================

import RangeTouch from 'rangetouch';

import captions from './captions';
import html5 from './html5';
import support from './support';
import { repaint, transitionEndEvent } from './utils/animation';
import { dedupe } from './utils/arrays';
import browser from './utils/browser';
import {
  createElement,
  emptyElement,
  getAttributesFromSelector,
  getElement,
  getElements,
  hasClass,
  matches,
  removeElement,
  setAttributes,
  setFocus,
  toggleClass,
  toggleHidden,
} from './utils/elements';
import { off, on } from './utils/events';
import i18n from './utils/i18n';
import is from './utils/is';
import loadSprite from './utils/load-sprite';
import { extend } from './utils/objects';
import { getPercentage, replaceAll, toCamelCase, toTitleCase } from './utils/strings';
import { formatTime, getHours } from './utils/time';

// TODO: Don't export a massive object - break down and create class
const controls = {
  // Get icon URL
  getIconUrl() {
    const url = new URL(this.config.iconUrl, window.location);
    const cors = url.host !== window.location.host || (browser.isIE && !window.svg4everybody);

    return {
      url: this.config.iconUrl,
      cors,
    };
  },

  // Find the UI controls
  findElements() {
    try {
      this.elements.controls = getElement.call(this, this.config.selectors.controls.wrapper);

      // Buttons
      this.elements.buttons = {
        play: getElements.call(this, this.config.selectors.buttons.play),
        pause: getElement.call(this, this.config.selectors.buttons.pause),
        restart: getElement.call(this, this.config.selectors.buttons.restart),
        rewind: getElement.call(this, this.config.selectors.buttons.rewind),
        fastForward: getElement.call(this, this.config.selectors.buttons.fastForward),
        mute: getElement.call(this, this.config.selectors.buttons.mute),
        pip: getElement.call(this, this.config.selectors.buttons.pip),
        airplay: getElement.call(this, this.config.selectors.buttons.airplay),
        settings: getElement.call(this, this.config.selectors.buttons.settings),
        captions: getElement.call(this, this.config.selectors.buttons.captions),
        fullscreen: getElement.call(this, this.config.selectors.buttons.fullscreen),
      };

      // Progress
      this.elements.progress = getElement.call(this, this.config.selectors.progress);

      // Inputs
      this.elements.inputs = {
        seek: getElement.call(this, this.config.selectors.inputs.seek),
        volume: getElement.call(this, this.config.selectors.inputs.volume),
      };

      // Display
      this.elements.display = {
        buffer: getElement.call(this, this.config.selectors.display.buffer),
        currentTime: getElement.call(this, this.config.selectors.display.currentTime),
        duration: getElement.call(this, this.config.selectors.display.duration),
      };

      // Seek tooltip
      if (is.element(this.elements.progress)) {
        this.elements.display.seekTooltip = this.elements.progress.querySelector(`.${this.config.classNames.tooltip}`);
      }

      return true;
    } catch (error) {
      // Log it
      this.debug.warn('It looks like there is a problem with your custom controls HTML', error);

      // Restore native video controls
      this.toggleNativeControls(true);

      return false;
    }
  },

  // Create <svg> icon
  createIcon(type, attributes) {
    const namespace = 'http://www.w3.org/2000/svg';
    const iconUrl = controls.getIconUrl.call(this);
    const iconPath = `${!iconUrl.cors ? iconUrl.url : ''}#${this.config.iconPrefix}`;
    // Create <svg>
    const icon = document.createElementNS(namespace, 'svg');
    setAttributes(
      icon,
      extend(attributes, {
        'aria-hidden': 'true',
        focusable: 'false',
      }),
    );

    // Create the <use> to reference sprite
    const use = document.createElementNS(namespace, 'use');
    const path = `${iconPath}-${type}`;

    // Set `href` attributes
    // https://github.com/sampotts/plyr/issues/460
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/xlink:href
    if ('href' in use) {
      use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', path);
    }

    // Always set the older attribute even though it's "deprecated" (it'll be around for ages)
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', path);

    // Add <use> to <svg>
    icon.appendChild(use);

    return icon;
  },

  // Create hidden text label
  createLabel(key, attr = {}) {
    const text = i18n.get(key, this.config);
    const attributes = { ...attr, class: [attr.class, this.config.classNames.hidden].filter(Boolean).join(' ') };

    return createElement('span', attributes, text);
  },

  // Create a badge
  createBadge(text) {
    if (is.empty(text)) {
      return null;
    }

    const badge = createElement('span', {
      class: this.config.classNames.menu.value,
    });

    badge.appendChild(
      createElement(
        'span',
        {
          class: this.config.classNames.menu.badge,
        },
        text,
      ),
    );

    return badge;
  },

  // Create a <button>
  createButton(buttonType, attr) {
    const attributes = extend({}, attr);
    let type = toCamelCase(buttonType);

    const props = {
      element: 'button',
      toggle: false,
      label: null,
      icon: null,
      labelPressed: null,
      iconPressed: null,
    };

    ['element', 'icon', 'label'].forEach(key => {
      if (Object.keys(attributes).includes(key)) {
        props[key] = attributes[key];
        delete attributes[key];
      }
    });

    // Default to 'button' type to prevent form submission
    if (props.element === 'button' && !Object.keys(attributes).includes('type')) {
      attributes.type = 'button';
    }

    // Set class name
    if (Object.keys(attributes).includes('class')) {
      if (!attributes.class.split(' ').some(c => c === this.config.classNames.control)) {
        extend(attributes, {
          class: `${attributes.class} ${this.config.classNames.control}`,
        });
      }
    } else {
      attributes.class = this.config.classNames.control;
    }

    // Large play button
    switch (buttonType) {
      case 'play':
        props.toggle = true;
        props.label = 'play';
        props.labelPressed = 'pause';
        props.icon = 'play';
        props.iconPressed = 'pause';
        break;

      case 'mute':
        props.toggle = true;
        props.label = 'mute';
        props.labelPressed = 'unmute';
        props.icon = 'volume';
        props.iconPressed = 'muted';
        break;

      case 'captions':
        props.toggle = true;
        props.label = 'enableCaptions';
        props.labelPressed = 'disableCaptions';
        props.icon = 'captions-off';
        props.iconPressed = 'captions-on';
        break;

      case 'fullscreen':
        props.toggle = true;
        props.label = 'enterFullscreen';
        props.labelPressed = 'exitFullscreen';
        props.icon = 'enter-fullscreen';
        props.iconPressed = 'exit-fullscreen';
        break;

      case 'play-large':
        attributes.class += ` ${this.config.classNames.control}--overlaid`;
        type = 'play';
        props.label = 'play';
        props.icon = 'play';
        break;

      default:
        if (is.empty(props.label)) {
          props.label = type;
        }
        if (is.empty(props.icon)) {
          props.icon = buttonType;
        }
    }

    const button = createElement(props.element);

    // Setup toggle icon and labels
    if (props.toggle) {
      // Icon
      button.appendChild(
        controls.createIcon.call(this, props.iconPressed, {
          class: 'icon--pressed',
        }),
      );
      button.appendChild(
        controls.createIcon.call(this, props.icon, {
          class: 'icon--not-pressed',
        }),
      );

      // Label/Tooltip
      button.appendChild(
        controls.createLabel.call(this, props.labelPressed, {
          class: 'label--pressed',
        }),
      );
      button.appendChild(
        controls.createLabel.call(this, props.label, {
          class: 'label--not-pressed',
        }),
      );
    } else {
      button.appendChild(controls.createIcon.call(this, props.icon));
      button.appendChild(controls.createLabel.call(this, props.label));
    }

    // Merge and set attributes
    extend(attributes, getAttributesFromSelector(this.config.selectors.buttons[type], attributes));
    setAttributes(button, attributes);

    // We have multiple play buttons
    if (type === 'play') {
      if (!is.array(this.elements.buttons[type])) {
        this.elements.buttons[type] = [];
      }

      this.elements.buttons[type].push(button);
    } else {
      this.elements.buttons[type] = button;
    }

    return button;
  },

  // Create an <input type='range'>
  createRange(type, attributes) {
    // Seek input
    const input = createElement(
      'input',
      extend(
        getAttributesFromSelector(this.config.selectors.inputs[type]),
        {
          type: 'range',
          min: 0,
          max: 100,
          step: 0.01,
          value: 0,
          autocomplete: 'off',
          // A11y fixes for https://github.com/sampotts/plyr/issues/905
          role: 'slider',
          'aria-label': i18n.get(type, this.config),
          'aria-valuemin': 0,
          'aria-valuemax': 100,
          'aria-valuenow': 0,
        },
        attributes,
      ),
    );

    this.elements.inputs[type] = input;

    // Set the fill for webkit now
    controls.updateRangeFill.call(this, input);

    // Improve support on touch devices
    RangeTouch.setup(input);

    return input;
  },

  // Create a <progress>
  createProgress(type, attributes) {
    const progress = createElement(
      'progress',
      extend(
        getAttributesFromSelector(this.config.selectors.display[type]),
        {
          min: 0,
          max: 100,
          value: 0,
          role: 'progressbar',
          'aria-hidden': true,
        },
        attributes,
      ),
    );

    // Create the label inside
    if (type !== 'volume') {
      progress.appendChild(createElement('span', null, '0'));

      const suffixKey = {
        played: 'played',
        buffer: 'buffered',
      }[type];
      const suffix = suffixKey ? i18n.get(suffixKey, this.config) : '';

      progress.innerText = `% ${suffix.toLowerCase()}`;
    }

    this.elements.display[type] = progress;

    return progress;
  },

  // Create time display
  createTime(type, attrs) {
    const attributes = getAttributesFromSelector(this.config.selectors.display[type], attrs);

    const container = createElement(
      'div',
      extend(attributes, {
        class: `${attributes.class ? attributes.class : ''} ${this.config.classNames.display.time} `.trim(),
        'aria-label': i18n.get(type, this.config),
      }),
      '00:00',
    );

    // Reference for updates
    this.elements.display[type] = container;

    return container;
  },

  // Bind keyboard shortcuts for a menu item
  // We have to bind to keyup otherwise Firefox triggers a click when a keydown event handler shifts focus
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1220143
  bindMenuItemShortcuts(menuItem, type) {
    // Navigate through menus via arrow keys and space
    on.call(
      this,
      menuItem,
      'keydown keyup',
      event => {
        // We only care about space and ⬆️ ⬇️️ ➡️
        if (![32, 38, 39, 40].includes(event.which)) {
          return;
        }

        // Prevent play / seek
        event.preventDefault();
        event.stopPropagation();

        // We're just here to prevent the keydown bubbling
        if (event.type === 'keydown') {
          return;
        }

        const isRadioButton = matches(menuItem, '[role="menuitemradio"]');

        // Show the respective menu
        if (!isRadioButton && [32, 39].includes(event.which)) {
          controls.showMenuPanel.call(this, type, true);
        } else {
          let target;

          if (event.which !== 32) {
            if (event.which === 40 || (isRadioButton && event.which === 39)) {
              target = menuItem.nextElementSibling;

              if (!is.element(target)) {
                target = menuItem.parentNode.firstElementChild;
              }
            } else {
              target = menuItem.previousElementSibling;

              if (!is.element(target)) {
                target = menuItem.parentNode.lastElementChild;
              }
            }

            setFocus.call(this, target, true);
          }
        }
      },
      false,
    );

    // Enter will fire a `click` event but we still need to manage focus
    // So we bind to keyup which fires after and set focus here
    on.call(this, menuItem, 'keyup', event => {
      if (event.which !== 13) {
        return;
      }

      controls.focusFirstMenuItem.call(this, null, true);
    });
  },

  // Create a settings menu item
  createMenuItem({ value, list, type, title, badge = null, checked = false }) {
    const attributes = getAttributesFromSelector(this.config.selectors.inputs[type]);

    const menuItem = createElement(
      'button',
      extend(attributes, {
        type: 'button',
        role: 'menuitemradio',
        class: `${this.config.classNames.control} ${attributes.class ? attributes.class : ''}`.trim(),
        'aria-checked': checked,
        value,
      }),
    );

    const flex = createElement('span');

    // We have to set as HTML incase of special characters
    flex.innerHTML = title;

    if (is.element(badge)) {
      flex.appendChild(badge);
    }

    menuItem.appendChild(flex);

    // Replicate radio button behaviour
    Object.defineProperty(menuItem, 'checked', {
      enumerable: true,
      get() {
        return menuItem.getAttribute('aria-checked') === 'true';
      },
      set(check) {
        // Ensure exclusivity
        if (check) {
          Array.from(menuItem.parentNode.children)
            .filter(node => matches(node, '[role="menuitemradio"]'))
            .forEach(node => node.setAttribute('aria-checked', 'false'));
        }

        menuItem.setAttribute('aria-checked', check ? 'true' : 'false');
      },
    });

    this.listeners.bind(
      menuItem,
      'click keyup',
      event => {
        if (is.keyboardEvent(event) && event.which !== 32) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        menuItem.checked = true;

        switch (type) {
          case 'language':
            this.currentTrack = Number(value);
            break;

          case 'quality':
            this.quality = value;
            break;

          case 'speed':
            this.speed = parseFloat(value);
            break;

          default:
            break;
        }

        controls.showMenuPanel.call(this, 'home', is.keyboardEvent(event));
      },
      type,
      false,
    );

    controls.bindMenuItemShortcuts.call(this, menuItem, type);

    list.appendChild(menuItem);
  },

  // Format a time for display
  formatTime(time = 0, inverted = false) {
    // Bail if the value isn't a number
    if (!is.number(time)) {
      return time;
    }

    // Always display hours if duration is over an hour
    const forceHours = getHours(this.duration) > 0;

    return formatTime(time, forceHours, inverted);
  },

  // Update the displayed time
  updateTimeDisplay(target = null, time = 0, inverted = false) {
    // Bail if there's no element to display or the value isn't a number
    if (!is.element(target) || !is.number(time)) {
      return;
    }

    // eslint-disable-next-line no-param-reassign
    target.innerText = controls.formatTime(time, inverted);
  },

  // Update volume UI and storage
  updateVolume() {
    if (!this.supported.ui) {
      return;
    }

    // Update range
    if (is.element(this.elements.inputs.volume)) {
      controls.setRange.call(this, this.elements.inputs.volume, this.muted ? 0 : this.volume);
    }

    // Update mute state
    if (is.element(this.elements.buttons.mute)) {
      this.elements.buttons.mute.pressed = this.muted || this.volume === 0;
    }
  },

  // Update seek value and lower fill
  setRange(target, value = 0) {
    if (!is.element(target)) {
      return;
    }

    // eslint-disable-next-line
    target.value = value;

    // Webkit range fill
    controls.updateRangeFill.call(this, target);
  },

  // Update <progress> elements
  updateProgress(event) {
    if (!this.supported.ui || !is.event(event)) {
      return;
    }

    let value = 0;

    const setProgress = (target, input) => {
      const val = is.number(input) ? input : 0;
      const progress = is.element(target) ? target : this.elements.display.buffer;

      // Update value and label
      if (is.element(progress)) {
        progress.value = val;

        // Update text label inside
        const label = progress.getElementsByTagName('span')[0];
        if (is.element(label)) {
          label.childNodes[0].nodeValue = val;
        }
      }
    };

    if (event) {
      switch (event.type) {
        // Video playing
        case 'timeupdate':
        case 'seeking':
        case 'seeked':
          value = getPercentage(this.currentTime, this.duration);

          // Set seek range value only if it's a 'natural' time event
          if (event.type === 'timeupdate') {
            controls.setRange.call(this, this.elements.inputs.seek, value);
          }

          break;

        // Check buffer status
        case 'playing':
        case 'progress':
          setProgress(this.elements.display.buffer, this.buffered * 100);

          break;

        default:
          break;
      }
    }
  },

  // Webkit polyfill for lower fill range
  updateRangeFill(target) {
    // Get range from event if event passed
    const range = is.event(target) ? target.target : target;

    // Needs to be a valid <input type='range'>
    if (!is.element(range) || range.getAttribute('type') !== 'range') {
      return;
    }

    // Set aria values for https://github.com/sampotts/plyr/issues/905
    if (matches(range, this.config.selectors.inputs.seek)) {
      range.setAttribute('aria-valuenow', this.currentTime);
      const currentTime = controls.formatTime(this.currentTime);
      const duration = controls.formatTime(this.duration);
      const format = i18n.get('seekLabel', this.config);
      range.setAttribute(
        'aria-valuetext',
        format.replace('{currentTime}', currentTime).replace('{duration}', duration),
      );
    } else if (matches(range, this.config.selectors.inputs.volume)) {
      const percent = range.value * 100;
      range.setAttribute('aria-valuenow', percent);
      range.setAttribute('aria-valuetext', `${percent.toFixed(1)}%`);
    } else {
      range.setAttribute('aria-valuenow', range.value);
    }

    // WebKit only
    if (!browser.isWebkit) {
      return;
    }

    // Set CSS custom property
    range.style.setProperty('--value', `${(range.value / range.max) * 100}%`);
  },

  // Update hover tooltip for seeking
  updateSeekTooltip(event) {
    // Bail if setting not true
    if (
      !this.config.tooltips.seek ||
      !is.element(this.elements.inputs.seek) ||
      !is.element(this.elements.display.seekTooltip) ||
      this.duration === 0
    ) {
      return;
    }

    const visible = `${this.config.classNames.tooltip}--visible`;
    const toggle = show => toggleClass(this.elements.display.seekTooltip, visible, show);

    // Hide on touch
    if (this.touch) {
      toggle(false);
      return;
    }

    // Determine percentage, if already visible
    let percent = 0;
    const clientRect = this.elements.progress.getBoundingClientRect();

    if (is.event(event)) {
      percent = (100 / clientRect.width) * (event.pageX - clientRect.left);
    } else if (hasClass(this.elements.display.seekTooltip, visible)) {
      percent = parseFloat(this.elements.display.seekTooltip.style.left, 10);
    } else {
      return;
    }

    // Set bounds
    if (percent < 0) {
      percent = 0;
    } else if (percent > 100) {
      percent = 100;
    }

    // Display the time a click would seek to
    controls.updateTimeDisplay.call(this, this.elements.display.seekTooltip, (this.duration / 100) * percent);

    // Set position
    this.elements.display.seekTooltip.style.left = `${percent}%`;

    // Show/hide the tooltip
    // If the event is a moues in/out and percentage is inside bounds
    if (is.event(event) && ['mouseenter', 'mouseleave'].includes(event.type)) {
      toggle(event.type === 'mouseenter');
    }
  },

  // Handle time change event
  timeUpdate(event) {
    // Only invert if only one time element is displayed and used for both duration and currentTime
    const invert = !is.element(this.elements.display.duration) && this.config.invertTime;

    // Duration
    controls.updateTimeDisplay.call(
      this,
      this.elements.display.currentTime,
      invert ? this.duration - this.currentTime : this.currentTime,
      invert,
    );

    // Ignore updates while seeking
    if (event && event.type === 'timeupdate' && this.media.seeking) {
      return;
    }

    // Playing progress
    controls.updateProgress.call(this, event);
  },

  // Show the duration on metadataloaded or durationchange events
  durationUpdate() {
    // Bail if no UI or durationchange event triggered after playing/seek when invertTime is false
    if (!this.supported.ui || (!this.config.invertTime && this.currentTime)) {
      return;
    }

    // If duration is the 2**32 (shaka), Infinity (HLS), DASH-IF (Number.MAX_SAFE_INTEGER || Number.MAX_VALUE) indicating live we hide the currentTime and progressbar.
    // https://github.com/video-dev/hls.js/blob/5820d29d3c4c8a46e8b75f1e3afa3e68c1a9a2db/src/controller/buffer-controller.js#L415
    // https://github.com/google/shaka-player/blob/4d889054631f4e1cf0fbd80ddd2b71887c02e232/lib/media/streaming_engine.js#L1062
    // https://github.com/Dash-Industry-Forum/dash.js/blob/69859f51b969645b234666800d4cb596d89c602d/src/dash/models/DashManifestModel.js#L338
    if (this.duration >= 2 ** 32) {
      toggleHidden(this.elements.display.currentTime, true);
      toggleHidden(this.elements.progress, true);
      return;
    }

    // Update ARIA values
    if (is.element(this.elements.inputs.seek)) {
      this.elements.inputs.seek.setAttribute('aria-valuemax', this.duration);
    }

    // If there's a spot to display duration
    const hasDuration = is.element(this.elements.display.duration);

    // If there's only one time display, display duration there
    if (!hasDuration && this.config.displayDuration && this.paused) {
      controls.updateTimeDisplay.call(this, this.elements.display.currentTime, this.duration);
    }

    // If there's a duration element, update content
    if (hasDuration) {
      controls.updateTimeDisplay.call(this, this.elements.display.duration, this.duration);
    }

    // Update the tooltip (if visible)
    controls.updateSeekTooltip.call(this);
  },

  // Hide/show a tab
  toggleMenuButton(setting, toggle) {
    toggleHidden(this.elements.settings.buttons[setting], !toggle);
  },

  // Update the selected setting
  updateSetting(setting, container, input) {
    const pane = this.elements.settings.panels[setting];
    let value = null;
    let list = container;

    if (setting === 'captions') {
      value = this.currentTrack;
    } else {
      value = !is.empty(input) ? input : this[setting];

      // Get default
      if (is.empty(value)) {
        value = this.config[setting].default;
      }

      // Unsupported value
      if (!is.empty(this.options[setting]) && !this.options[setting].includes(value)) {
        this.debug.warn(`Unsupported value of '${value}' for ${setting}`);
        return;
      }

      // Disabled value
      if (!this.config[setting].options.includes(value)) {
        this.debug.warn(`Disabled value of '${value}' for ${setting}`);
        return;
      }
    }

    // Get the list if we need to
    if (!is.element(list)) {
      list = pane && pane.querySelector('[role="menu"]');
    }

    // If there's no list it means it's not been rendered...
    if (!is.element(list)) {
      return;
    }

    // Update the label
    const label = this.elements.settings.buttons[setting].querySelector(`.${this.config.classNames.menu.value}`);
    label.innerHTML = controls.getLabel.call(this, setting, value);

    // Find the radio option and check it
    const target = list && list.querySelector(`[value="${value}"]`);

    if (is.element(target)) {
      target.checked = true;
    }
  },

  // Translate a value into a nice label
  getLabel(setting, value) {
    switch (setting) {
      case 'speed':
        return value === 1 ? i18n.get('normal', this.config) : `${value}&times;`;

      case 'quality':
        if (is.number(value)) {
          const label = i18n.get(`qualityLabel.${value}`, this.config);

          if (!label.length) {
            return `${value}p`;
          }

          return label;
        }

        return toTitleCase(value);

      case 'captions':
        return captions.getLabel.call(this);

      default:
        return null;
    }
  },

  // Set the quality menu
  setQualityMenu(options) {
    // Menu required
    if (!is.element(this.elements.settings.panels.quality)) {
      return;
    }

    const type = 'quality';
    const list = this.elements.settings.panels.quality.querySelector('[role="menu"]');

    // Set options if passed and filter based on uniqueness and config
    if (is.array(options)) {
      this.options.quality = dedupe(options).filter(quality => this.config.quality.options.includes(quality));
    }

    // Toggle the pane and tab
    const toggle = !is.empty(this.options.quality) && this.options.quality.length > 1;
    controls.toggleMenuButton.call(this, type, toggle);

    // Empty the menu
    emptyElement(list);

    // Check if we need to toggle the parent
    controls.checkMenu.call(this);

    // If we're hiding, nothing more to do
    if (!toggle) {
      return;
    }

    // Get the badge HTML for HD, 4K etc
    const getBadge = quality => {
      const label = i18n.get(`qualityBadge.${quality}`, this.config);

      if (!label.length) {
        return null;
      }

      return controls.createBadge.call(this, label);
    };

    // Sort options by the config and then render options
    this.options.quality
      .sort((a, b) => {
        const sorting = this.config.quality.options;
        return sorting.indexOf(a) > sorting.indexOf(b) ? 1 : -1;
      })
      .forEach(quality => {
        controls.createMenuItem.call(this, {
          value: quality,
          list,
          type,
          title: controls.getLabel.call(this, 'quality', quality),
          badge: getBadge(quality),
        });
      });

    controls.updateSetting.call(this, type, list);
  },

  // Set the looping options
  /* setLoopMenu() {
        // Menu required
        if (!is.element(this.elements.settings.panels.loop)) {
            return;
        }

        const options = ['start', 'end', 'all', 'reset'];
        const list = this.elements.settings.panels.loop.querySelector('[role="menu"]');

        // Show the pane and tab
        toggleHidden(this.elements.settings.buttons.loop, false);
        toggleHidden(this.elements.settings.panels.loop, false);

        // Toggle the pane and tab
        const toggle = !is.empty(this.loop.options);
        controls.toggleMenuButton.call(this, 'loop', toggle);

        // Empty the menu
        emptyElement(list);

        options.forEach(option => {
            const item = createElement('li');

            const button = createElement(
                'button',
                extend(getAttributesFromSelector(this.config.selectors.buttons.loop), {
                    type: 'button',
                    class: this.config.classNames.control,
                    'data-plyr-loop-action': option,
                }),
                i18n.get(option, this.config)
            );

            if (['start', 'end'].includes(option)) {
                const badge = controls.createBadge.call(this, '00:00');
                button.appendChild(badge);
            }

            item.appendChild(button);
            list.appendChild(item);
        });
    }, */

  // Get current selected caption language
  // TODO: rework this to user the getter in the API?

  // Set a list of available captions languages
  setCaptionsMenu() {
    // Menu required
    if (!is.element(this.elements.settings.panels.captions)) {
      return;
    }

    // TODO: Captions or language? Currently it's mixed
    const type = 'captions';
    const list = this.elements.settings.panels.captions.querySelector('[role="menu"]');
    const tracks = captions.getTracks.call(this);
    const toggle = Boolean(tracks.length);

    // Toggle the pane and tab
    controls.toggleMenuButton.call(this, type, toggle);

    // Empty the menu
    emptyElement(list);

    // Check if we need to toggle the parent
    controls.checkMenu.call(this);

    // If there's no captions, bail
    if (!toggle) {
      return;
    }

    // Generate options data
    const options = tracks.map((track, value) => ({
      value,
      checked: this.captions.toggled && this.currentTrack === value,
      title: captions.getLabel.call(this, track),
      badge: track.language && controls.createBadge.call(this, track.language.toUpperCase()),
      list,
      type: 'language',
    }));

    // Add the "Disabled" option to turn off captions
    options.unshift({
      value: -1,
      checked: !this.captions.toggled,
      title: i18n.get('disabled', this.config),
      list,
      type: 'language',
    });

    // Generate options
    options.forEach(controls.createMenuItem.bind(this));

    controls.updateSetting.call(this, type, list);
  },

  // Set a list of available captions languages
  setSpeedMenu() {
    // Menu required
    if (!is.element(this.elements.settings.panels.speed)) {
      return;
    }

    const type = 'speed';
    const list = this.elements.settings.panels.speed.querySelector('[role="menu"]');

    // Filter out invalid speeds
    this.options.speed = this.options.speed.filter(o => o >= this.minimumSpeed && o <= this.maximumSpeed);

    // Toggle the pane and tab
    const toggle = !is.empty(this.options.speed) && this.options.speed.length > 1;
    controls.toggleMenuButton.call(this, type, toggle);

    // Empty the menu
    emptyElement(list);

    // Check if we need to toggle the parent
    controls.checkMenu.call(this);

    // If we're hiding, nothing more to do
    if (!toggle) {
      return;
    }

    // Create items
    this.options.speed.forEach(speed => {
      controls.createMenuItem.call(this, {
        value: speed,
        list,
        type,
        title: controls.getLabel.call(this, 'speed', speed),
      });
    });

    controls.updateSetting.call(this, type, list);
  },

  // Check if we need to hide/show the settings menu
  checkMenu() {
    const { buttons } = this.elements.settings;
    const visible = !is.empty(buttons) && Object.values(buttons).some(button => !button.hidden);

    toggleHidden(this.elements.settings.menu, !visible);
  },

  // Focus the first menu item in a given (or visible) menu
  focusFirstMenuItem(pane, tabFocus = false) {
    if (this.elements.settings.popup.hidden) {
      return;
    }

    let target = pane;

    if (!is.element(target)) {
      target = Object.values(this.elements.settings.panels).find(p => !p.hidden);
    }

    const firstItem = target.querySelector('[role^="menuitem"]');

    setFocus.call(this, firstItem, tabFocus);
  },

  // Show/hide menu
  toggleMenu(input) {
    const { popup } = this.elements.settings;
    const button = this.elements.buttons.settings;

    // Menu and button are required
    if (!is.element(popup) || !is.element(button)) {
      return;
    }

    // True toggle by default
    const { hidden } = popup;
    let show = hidden;

    if (is.boolean(input)) {
      show = input;
    } else if (is.keyboardEvent(input) && input.which === 27) {
      show = false;
    } else if (is.event(input)) {
      // If Plyr is in a shadowDOM, the event target is set to the component, instead of the
      // Element in the shadowDOM. The path, if available, is complete.
      const target = is.function(input.composedPath) ? input.composedPath()[0] : input.target;
      const isMenuItem = popup.contains(target);

      // If the click was inside the menu or if the click
      // wasn't the button or menu item and we're trying to
      // show the menu (a doc click shouldn't show the menu)
      if (isMenuItem || (!isMenuItem && input.target !== button && show)) {
        return;
      }
    }

    // Set button attributes
    button.setAttribute('aria-expanded', show);

    // Show the actual popup
    toggleHidden(popup, !show);

    // Add class hook
    toggleClass(this.elements.container, this.config.classNames.menu.open, show);

    // Focus the first item if key interaction
    if (show && is.keyboardEvent(input)) {
      controls.focusFirstMenuItem.call(this, null, true);
    } else if (!show && !hidden) {
      // If closing, re-focus the button
      setFocus.call(this, button, is.keyboardEvent(input));
    }
  },

  // Get the natural size of a menu panel
  getMenuSize(tab) {
    const clone = tab.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.opacity = 0;
    clone.removeAttribute('hidden');

    // Append to parent so we get the "real" size
    tab.parentNode.appendChild(clone);

    // Get the sizes before we remove
    const width = clone.scrollWidth;
    const height = clone.scrollHeight;

    // Remove from the DOM
    removeElement(clone);

    return {
      width,
      height,
    };
  },

  // Show a panel in the menu
  showMenuPanel(type = '', tabFocus = false) {
    const target = this.elements.container.querySelector(`#plyr-settings-${this.id}-${type}`);

    // Nothing to show, bail
    if (!is.element(target)) {
      return;
    }

    // Hide all other panels
    const container = target.parentNode;
    const current = Array.from(container.children).find(node => !node.hidden);

    // If we can do fancy animations, we'll animate the height/width
    if (support.transitions && !support.reducedMotion) {
      // Set the current width as a base
      container.style.width = `${current.scrollWidth}px`;
      container.style.height = `${current.scrollHeight}px`;

      // Get potential sizes
      const size = controls.getMenuSize.call(this, target);

      // Restore auto height/width
      const restore = event => {
        // We're only bothered about height and width on the container
        if (event.target !== container || !['width', 'height'].includes(event.propertyName)) {
          return;
        }

        // Revert back to auto
        container.style.width = '';
        container.style.height = '';

        // Only listen once
        off.call(this, container, transitionEndEvent, restore);
      };

      // Listen for the transition finishing and restore auto height/width
      on.call(this, container, transitionEndEvent, restore);

      // Set dimensions to target
      container.style.width = `${size.width}px`;
      container.style.height = `${size.height}px`;
    }

    // Set attributes on current tab
    toggleHidden(current, true);

    // Set attributes on target
    toggleHidden(target, false);

    // Focus the first item
    controls.focusFirstMenuItem.call(this, target, tabFocus);
  },

  // Set the download URL
  setDownloadUrl() {
    const button = this.elements.buttons.download;

    // Bail if no button
    if (!is.element(button)) {
      return;
    }

    // Set attribute
    button.setAttribute('href', this.download);
  },

  // Build the default HTML
  create(data) {
    const {
      bindMenuItemShortcuts,
      createButton,
      createProgress,
      createRange,
      createTime,
      setQualityMenu,
      setSpeedMenu,
      showMenuPanel,
    } = controls;
    this.elements.controls = null;

    // Larger overlaid play button
    if (is.array(this.config.controls) && this.config.controls.includes('play-large')) {
      this.elements.container.appendChild(createButton.call(this, 'play-large'));
    }

    // Create the container
    const container = createElement('div', getAttributesFromSelector(this.config.selectors.controls.wrapper));
    this.elements.controls = container;

    // Default item attributes
    const defaultAttributes = { class: 'plyr__controls__item' };

    // Loop through controls in order
    dedupe(is.array(this.config.controls) ? this.config.controls: []).forEach(control => {
      // Restart button
      if (control === 'restart') {
        container.appendChild(createButton.call(this, 'restart', defaultAttributes));
      }

      // Rewind button
      if (control === 'rewind') {
        container.appendChild(createButton.call(this, 'rewind', defaultAttributes));
      }

      // Play/Pause button
      if (control === 'play') {
        container.appendChild(createButton.call(this, 'play', defaultAttributes));
      }

      // Fast forward button
      if (control === 'fast-forward') {
        container.appendChild(createButton.call(this, 'fast-forward', defaultAttributes));
      }

      // Progress
      if (control === 'progress') {
        const progressContainer = createElement('div', {
          class: `${defaultAttributes.class} plyr__progress__container`,
        });

        const progress = createElement('div', getAttributesFromSelector(this.config.selectors.progress));

        // Seek range slider
        progress.appendChild(
          createRange.call(this, 'seek', {
            id: `plyr-seek-${data.id}`,
          }),
        );

        // Buffer progress
        progress.appendChild(createProgress.call(this, 'buffer'));

        // TODO: Add loop display indicator

        // Seek tooltip
        if (this.config.tooltips.seek) {
          const tooltip = createElement(
            'span',
            {
              class: this.config.classNames.tooltip,
            },
            '00:00',
          );

          progress.appendChild(tooltip);
          this.elements.display.seekTooltip = tooltip;
        }

        this.elements.progress = progress;
        progressContainer.appendChild(this.elements.progress);
        container.appendChild(progressContainer);
      }

      // Media current time display
      if (control === 'current-time') {
        container.appendChild(createTime.call(this, 'currentTime', defaultAttributes));
      }

      // Media duration display
      if (control === 'duration') {
        container.appendChild(createTime.call(this, 'duration', defaultAttributes));
      }

      // Volume controls
      if (control === 'mute' || control === 'volume') {
        let { volume } = this.elements;

        // Create the volume container if needed
        if (!is.element(volume) || !container.contains(volume)) {
          volume = createElement(
            'div',
            extend({}, defaultAttributes, {
              class: `${defaultAttributes.class} plyr__volume`.trim(),
            }),
          );

          this.elements.volume = volume;

          container.appendChild(volume);
        }

        // Toggle mute button
        if (control === 'mute') {
          volume.appendChild(createButton.call(this, 'mute'));
        }

        // Volume range control
        // Ignored on iOS as it's handled globally
        // https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html
        if (control === 'volume' && !browser.isIos) {
          // Set the attributes
          const attributes = {
            max: 1,
            step: 0.05,
            value: this.config.volume,
          };

          // Create the volume range slider
          volume.appendChild(
            createRange.call(
              this,
              'volume',
              extend(attributes, {
                id: `plyr-volume-${data.id}`,
              }),
            ),
          );
        }
      }

      // Toggle captions button
      if (control === 'captions') {
        container.appendChild(createButton.call(this, 'captions', defaultAttributes));
      }

      // Settings button / menu
      if (control === 'settings' && !is.empty(this.config.settings)) {
        const wrapper = createElement(
          'div',
          extend({}, defaultAttributes, {
            class: `${defaultAttributes.class} plyr__menu`.trim(),
            hidden: '',
          }),
        );

        wrapper.appendChild(
          createButton.call(this, 'settings', {
            'aria-haspopup': true,
            'aria-controls': `plyr-settings-${data.id}`,
            'aria-expanded': false,
          }),
        );

        const popup = createElement('div', {
          class: 'plyr__menu__container',
          id: `plyr-settings-${data.id}`,
          hidden: '',
        });

        const inner = createElement('div');

        const home = createElement('div', {
          id: `plyr-settings-${data.id}-home`,
        });

        // Create the menu
        const menu = createElement('div', {
          role: 'menu',
        });

        home.appendChild(menu);
        inner.appendChild(home);
        this.elements.settings.panels.home = home;

        // Build the menu items
        this.config.settings.forEach(type => {
          // TODO: bundle this with the createMenuItem helper and bindings
          const menuItem = createElement(
            'button',
            extend(getAttributesFromSelector(this.config.selectors.buttons.settings), {
              type: 'button',
              class: `${this.config.classNames.control} ${this.config.classNames.control}--forward`,
              role: 'menuitem',
              'aria-haspopup': true,
              hidden: '',
            }),
          );

          // Bind menu shortcuts for keyboard users
          bindMenuItemShortcuts.call(this, menuItem, type);

          // Show menu on click
          on.call(this, menuItem, 'click', () => {
            showMenuPanel.call(this, type, false);
          });

          const flex = createElement('span', null, i18n.get(type, this.config));

          const value = createElement('span', {
            class: this.config.classNames.menu.value,
          });

          // Speed contains HTML entities
          value.innerHTML = data[type];

          flex.appendChild(value);
          menuItem.appendChild(flex);
          menu.appendChild(menuItem);

          // Build the panes
          const pane = createElement('div', {
            id: `plyr-settings-${data.id}-${type}`,
            hidden: '',
          });

          // Back button
          const backButton = createElement('button', {
            type: 'button',
            class: `${this.config.classNames.control} ${this.config.classNames.control}--back`,
          });

          // Visible label
          backButton.appendChild(
            createElement(
              'span',
              {
                'aria-hidden': true,
              },
              i18n.get(type, this.config),
            ),
          );

          // Screen reader label
          backButton.appendChild(
            createElement(
              'span',
              {
                class: this.config.classNames.hidden,
              },
              i18n.get('menuBack', this.config),
            ),
          );

          // Go back via keyboard
          on.call(
            this,
            pane,
            'keydown',
            event => {
              // We only care about <-
              if (event.which !== 37) {
                return;
              }

              // Prevent seek
              event.preventDefault();
              event.stopPropagation();

              // Show the respective menu
              showMenuPanel.call(this, 'home', true);
            },
            false,
          );

          // Go back via button click
          on.call(this, backButton, 'click', () => {
            showMenuPanel.call(this, 'home', false);
          });

          // Add to pane
          pane.appendChild(backButton);

          // Menu
          pane.appendChild(
            createElement('div', {
              role: 'menu',
            }),
          );

          inner.appendChild(pane);

          this.elements.settings.buttons[type] = menuItem;
          this.elements.settings.panels[type] = pane;
        });

        popup.appendChild(inner);
        wrapper.appendChild(popup);
        container.appendChild(wrapper);

        this.elements.settings.popup = popup;
        this.elements.settings.menu = wrapper;
      }

      // Picture in picture button
      if (control === 'pip' && support.pip) {
        container.appendChild(createButton.call(this, 'pip', defaultAttributes));
      }

      // Airplay button
      if (control === 'airplay' && support.airplay) {
        container.appendChild(createButton.call(this, 'airplay', defaultAttributes));
      }

      // Download button
      if (control === 'download') {
        const attributes = extend({}, defaultAttributes, {
          element: 'a',
          href: this.download,
          target: '_blank',
        });

        // Set download attribute for HTML5 only
        if (this.isHTML5) {
          attributes.download = '';
        }

        const { download } = this.config.urls;

        if (!is.url(download) && this.isEmbed) {
          extend(attributes, {
            icon: `logo-${this.provider}`,
            label: this.provider,
          });
        }

        container.appendChild(createButton.call(this, 'download', attributes));
      }

      // Toggle fullscreen button
      if (control === 'fullscreen') {
        container.appendChild(createButton.call(this, 'fullscreen', defaultAttributes));
      }
    });

    // Set available quality levels
    if (this.isHTML5) {
      setQualityMenu.call(this, html5.getQualityOptions.call(this));
    }

    setSpeedMenu.call(this);

    return container;
  },

  // Insert controls
  inject() {
    // Sprite
    if (this.config.loadSprite) {
      const icon = controls.getIconUrl.call(this);

      // Only load external sprite using AJAX
      if (icon.cors) {
        loadSprite(icon.url, 'sprite-plyr');
      }
    }

    // Create a unique ID
    this.id = Math.floor(Math.random() * 10000);

    // Null by default
    let container = null;
    this.elements.controls = null;

    // Set template properties
    const props = {
      id: this.id,
      seektime: this.config.seekTime,
      title: this.config.title,
    };
    let update = true;

    // If function, run it and use output
    if (is.function(this.config.controls)) {
      this.config.controls = this.config.controls.call(this, props);
    }

    // Convert falsy controls to empty array (primarily for empty strings)
    if (!this.config.controls) {
      this.config.controls = [];
    }

    if (is.element(this.config.controls) || is.string(this.config.controls)) {
      // HTMLElement or Non-empty string passed as the option
      container = this.config.controls;
    } else {
      // Create controls
      container = controls.create.call(this, {
        id: this.id,
        seektime: this.config.seekTime,
        speed: this.speed,
        quality: this.quality,
        captions: captions.getLabel.call(this),
        // TODO: Looping
        // loop: 'None',
      });
      update = false;
    }

    // Replace props with their value
    const replace = input => {
      let result = input;

      Object.entries(props).forEach(([key, value]) => {
        result = replaceAll(result, `{${key}}`, value);
      });

      return result;
    };

    // Update markup
    if (update) {
      if (is.string(this.config.controls)) {
        container = replace(container);
      }
    }

    // Controls container
    let target;

    // Inject to custom location
    if (is.string(this.config.selectors.controls.container)) {
      target = document.querySelector(this.config.selectors.controls.container);
    }

    // Inject into the container by default
    if (!is.element(target)) {
      target = this.elements.container;
    }

    // Inject controls HTML (needs to be before captions, hence "afterbegin")
    const insertMethod = is.element(container) ? 'insertAdjacentElement' : 'insertAdjacentHTML';
    target[insertMethod]('afterbegin', container);

    // Find the elements if need be
    if (!is.element(this.elements.controls)) {
      controls.findElements.call(this);
    }

    // Add pressed property to buttons
    if (!is.empty(this.elements.buttons)) {
      const addProperty = button => {
        const className = this.config.classNames.controlPressed;
        Object.defineProperty(button, 'pressed', {
          enumerable: true,
          get() {
            return hasClass(button, className);
          },
          set(pressed = false) {
            toggleClass(button, className, pressed);
          },
        });
      };

      // Toggle classname when pressed property is set
      Object.values(this.elements.buttons)
        .filter(Boolean)
        .forEach(button => {
          if (is.array(button) || is.nodeList(button)) {
            Array.from(button)
              .filter(Boolean)
              .forEach(addProperty);
          } else {
            addProperty(button);
          }
        });
    }

    // Edge sometimes doesn't finish the paint so force a repaint
    if (browser.isEdge) {
      repaint(target);
    }

    // Setup tooltips
    if (this.config.tooltips.controls) {
      const { classNames, selectors } = this.config;
      const selector = `${selectors.controls.wrapper} ${selectors.labels} .${classNames.hidden}`;
      const labels = getElements.call(this, selector);

      Array.from(labels).forEach(label => {
        toggleClass(label, this.config.classNames.hidden, false);
        toggleClass(label, this.config.classNames.tooltip, true);
      });
    }
  },
};

export default controls;
