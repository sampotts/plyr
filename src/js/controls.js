// ==========================================================================
// Plyr controls
// ==========================================================================

import captions from './captions';
import html5 from './html5';
import i18n from './i18n';
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
    toggleClass,
    toggleHidden,
} from './utils/elements';
import { off, on } from './utils/events';
import is from './utils/is';
import loadSprite from './utils/loadSprite';
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
                this.elements.display.seekTooltip = this.elements.progress.querySelector(
                    `.${this.config.classNames.tooltip}`,
                );
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
                role: 'presentation',
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
        } else {
            use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', path);
        }

        // Add <use> to <svg>
        icon.appendChild(use);

        return icon;
    },

    // Create hidden text label
    createLabel(type, attr = {}) {
        // Skip i18n for abbreviations and brand names
        const universals = {
            pip: 'PIP',
            airplay: 'AirPlay',
        };
        const text = universals[type] || i18n.get(type, this.config);

        const attributes = Object.assign({}, attr, {
            class: [attr.class, this.config.classNames.hidden].filter(Boolean).join(' '),
        });
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
        const button = createElement('button');
        const attributes = Object.assign({}, attr);
        let type = toCamelCase(buttonType);

        let toggle = false;
        let label;
        let icon;
        let labelPressed;
        let iconPressed;

        if (!('type' in attributes)) {
            attributes.type = 'button';
        }

        if ('class' in attributes) {
            if (!attributes.class.includes(this.config.classNames.control)) {
                attributes.class += ` ${this.config.classNames.control}`;
            }
        } else {
            attributes.class = this.config.classNames.control;
        }

        // Large play button
        switch (buttonType) {
            case 'play':
                toggle = true;
                label = 'play';
                labelPressed = 'pause';
                icon = 'play';
                iconPressed = 'pause';
                break;

            case 'mute':
                toggle = true;
                label = 'mute';
                labelPressed = 'unmute';
                icon = 'volume';
                iconPressed = 'muted';
                break;

            case 'captions':
                toggle = true;
                label = 'enableCaptions';
                labelPressed = 'disableCaptions';
                icon = 'captions-off';
                iconPressed = 'captions-on';
                break;

            case 'fullscreen':
                toggle = true;
                label = 'enterFullscreen';
                labelPressed = 'exitFullscreen';
                icon = 'enter-fullscreen';
                iconPressed = 'exit-fullscreen';
                break;

            case 'play-large':
                attributes.class += ` ${this.config.classNames.control}--overlaid`;
                type = 'play';
                label = 'play';
                icon = 'play';
                break;

            default:
                label = type;
                icon = buttonType;
        }

        // Setup toggle icon and labels
        if (toggle) {
            // Icon
            button.appendChild(controls.createIcon.call(this, iconPressed, { class: 'icon--pressed' }));
            button.appendChild(controls.createIcon.call(this, icon, { class: 'icon--not-pressed' }));

            // Label/Tooltip
            button.appendChild(controls.createLabel.call(this, labelPressed, { class: 'label--pressed' }));
            button.appendChild(controls.createLabel.call(this, label, { class: 'label--not-pressed' }));
        } else {
            button.appendChild(controls.createIcon.call(this, icon));
            button.appendChild(controls.createLabel.call(this, label));
        }

        // Merge attributes
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

        // Toggle classname when pressed property is set
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
                    role: 'presentation',
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
    createTime(type) {
        const attributes = getAttributesFromSelector(this.config.selectors.display[type]);

        const container = createElement(
            'div',
            extend(attributes, {
                class: `plyr__time ${attributes.class}`,
                'aria-label': i18n.get(type, this.config),
            }),
            '00:00',
        );

        // Reference for updates
        this.elements.display[type] = container;

        return container;
    },

    // Create a settings menu item
    createMenuItem({ value, list, type, title, badge = null, checked = false }) {
        const item = createElement('li');

        const label = createElement('label', {
            class: this.config.classNames.control,
        });

        const radio = createElement(
            'input',
            extend(getAttributesFromSelector(this.config.selectors.inputs[type]), {
                type: 'radio',
                name: `plyr-${type}`,
                value,
                checked,
                class: 'plyr__sr-only',
            }),
        );

        const faux = createElement('span', { hidden: '' });

        label.appendChild(radio);
        label.appendChild(faux);
        label.insertAdjacentHTML('beforeend', title);

        if (is.element(badge)) {
            label.appendChild(badge);
        }

        item.appendChild(label);
        list.appendChild(item);
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
            const value = is.number(input) ? input : 0;
            const progress = is.element(target) ? target : this.elements.display.buffer;

            // Update value and label
            if (is.element(progress)) {
                progress.value = value;

                // Update text label inside
                const label = progress.getElementsByTagName('span')[0];
                if (is.element(label)) {
                    label.childNodes[0].nodeValue = value;
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
            range.setAttribute('aria-valuetext', `${percent}%`);
        } else {
            range.setAttribute('aria-valuenow', range.value);
        }

        // WebKit only
        if (!browser.isWebkit) {
            return;
        }

        // Set CSS custom property
        range.style.setProperty('--value', `${range.value / range.max * 100}%`);
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

        // Calculate percentage
        let percent = 0;
        const clientRect = this.elements.progress.getBoundingClientRect();
        const visible = `${this.config.classNames.tooltip}--visible`;

        const toggle = toggle => {
            toggleClass(this.elements.display.seekTooltip, visible, toggle);
        };

        // Hide on touch
        if (this.touch) {
            toggle(false);
            return;
        }

        // Determine percentage, if already visible
        if (is.event(event)) {
            percent = 100 / clientRect.width * (event.pageX - clientRect.left);
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
        controls.updateTimeDisplay.call(this, this.elements.display.seekTooltip, this.duration / 100 * percent);

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
        if (this.duration >= 2**32) {
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
    toggleTab(setting, toggle) {
        toggleHidden(this.elements.settings.tabs[setting], !toggle);
    },

    // Set the quality menu
    setQualityMenu(options) {
        // Menu required
        if (!is.element(this.elements.settings.panes.quality)) {
            return;
        }

        const type = 'quality';
        const list = this.elements.settings.panes.quality.querySelector('ul');

        // Set options if passed and filter based on uniqueness and config
        if (is.array(options)) {
            this.options.quality = dedupe(options).filter(quality => this.config.quality.options.includes(quality));
        }

        // Toggle the pane and tab
        const toggle = !is.empty(this.options.quality) && this.options.quality.length > 1;
        controls.toggleTab.call(this, type, toggle);

        // Check if we need to toggle the parent
        controls.checkMenu.call(this);

        // If we're hiding, nothing more to do
        if (!toggle) {
            return;
        }

        // Empty the menu
        emptyElement(list);

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

    // Update the selected setting
    updateSetting(setting, container, input) {
        const pane = this.elements.settings.panes[setting];
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
            list = pane && pane.querySelector('ul');
        }

        // If there's no list it means it's not been rendered...
        if (!is.element(list)) {
            return;
        }

        // Update the label
        const label = this.elements.settings.tabs[setting].querySelector(`.${this.config.classNames.menu.value}`);
        label.innerHTML = controls.getLabel.call(this, setting, value);

        // Find the radio option and check it
        const target = list && list.querySelector(`input[value="${value}"]`);

        if (is.element(target)) {
            target.checked = true;
        }
    },

    // Set the looping options
    /* setLoopMenu() {
        // Menu required
        if (!is.element(this.elements.settings.panes.loop)) {
            return;
        }

        const options = ['start', 'end', 'all', 'reset'];
        const list = this.elements.settings.panes.loop.querySelector('ul');

        // Show the pane and tab
        toggleHidden(this.elements.settings.tabs.loop, false);
        toggleHidden(this.elements.settings.panes.loop, false);

        // Toggle the pane and tab
        const toggle = !is.empty(this.loop.options);
        controls.toggleTab.call(this, 'loop', toggle);

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
        // TODO: Captions or language? Currently it's mixed
        const type = 'captions';
        const list = this.elements.settings.panes.captions.querySelector('ul');
        const tracks = captions.getTracks.call(this);

        // Toggle the pane and tab
        controls.toggleTab.call(this, type, tracks.length);

        // Empty the menu
        emptyElement(list);

        // Check if we need to toggle the parent
        controls.checkMenu.call(this);

        // If there's no captions, bail
        if (!tracks.length) {
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
    setSpeedMenu(options) {
        // Do nothing if not selected
        if (!this.config.controls.includes('settings') || !this.config.settings.includes('speed')) {
            return;
        }

        // Menu required
        if (!is.element(this.elements.settings.panes.speed)) {
            return;
        }

        const type = 'speed';

        // Set the speed options
        if (is.array(options)) {
            this.options.speed = options;
        } else if (this.isHTML5 || this.isVimeo) {
            this.options.speed = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
        }

        // Set options if passed and filter based on config
        this.options.speed = this.options.speed.filter(speed => this.config.speed.options.includes(speed));

        // Toggle the pane and tab
        const toggle = !is.empty(this.options.speed) && this.options.speed.length > 1;
        controls.toggleTab.call(this, type, toggle);

        // Check if we need to toggle the parent
        controls.checkMenu.call(this);

        // If we're hiding, nothing more to do
        if (!toggle) {
            return;
        }

        // Get the list to populate
        const list = this.elements.settings.panes.speed.querySelector('ul');

        // Empty the menu
        emptyElement(list);

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
        const { tabs } = this.elements.settings;
        const visible = !is.empty(tabs) && Object.values(tabs).some(tab => !tab.hidden);

        toggleHidden(this.elements.settings.menu, !visible);
    },

    // Show/hide menu
    toggleMenu(event) {
        const { form } = this.elements.settings;
        const button = this.elements.buttons.settings;

        // Menu and button are required
        if (!is.element(form) || !is.element(button)) {
            return;
        }

        const show = is.boolean(event) ? event : is.element(form) && form.hasAttribute('hidden');

        if (is.event(event)) {
            const isMenuItem = is.element(form) && form.contains(event.target);
            const isButton = event.target === this.elements.buttons.settings;

            // If the click was inside the form or if the click
            // wasn't the button or menu item and we're trying to
            // show the menu (a doc click shouldn't show the menu)
            if (isMenuItem || (!isMenuItem && !isButton && show)) {
                return;
            }

            // Prevent the toggle being caught by the doc listener
            if (isButton) {
                event.stopPropagation();
            }
        }

        // Set form and button attributes
        if (is.element(button)) {
            button.setAttribute('aria-expanded', show);
        }

        if (is.element(form)) {
            toggleHidden(form, !show);
            toggleClass(this.elements.container, this.config.classNames.menu.open, show);

            if (show) {
                form.removeAttribute('tabindex');
            } else {
                form.setAttribute('tabindex', -1);
            }
        }
    },

    // Get the natural size of a tab
    getTabSize(tab) {
        const clone = tab.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.opacity = 0;
        clone.removeAttribute('hidden');

        // Prevent input's being unchecked due to the name being identical
        Array.from(clone.querySelectorAll('input[name]')).forEach(input => {
            const name = input.getAttribute('name');
            input.setAttribute('name', `${name}-clone`);
        });

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

    // Toggle Menu
    showTab(target = '') {
        const { menu } = this.elements.settings;
        const pane = document.getElementById(target);

        // Nothing to show, bail
        if (!is.element(pane)) {
            return;
        }

        // Are we targeting a tab? If not, bail
        const isTab = pane.getAttribute('role') === 'tabpanel';
        if (!isTab) {
            return;
        }

        // Hide all other tabs
        // Get other tabs
        const current = menu.querySelector('[role="tabpanel"]:not([hidden])');
        const container = current.parentNode;

        // Set other toggles to be expanded false
        Array.from(menu.querySelectorAll(`[aria-controls="${current.getAttribute('id')}"]`)).forEach(toggle => {
            toggle.setAttribute('aria-expanded', false);
        });

        // If we can do fancy animations, we'll animate the height/width
        if (support.transitions && !support.reducedMotion) {
            // Set the current width as a base
            container.style.width = `${current.scrollWidth}px`;
            container.style.height = `${current.scrollHeight}px`;

            // Get potential sizes
            const size = controls.getTabSize.call(this, pane);

            // Restore auto height/width
            const restore = e => {
                // We're only bothered about height and width on the container
                if (e.target !== container || !['width', 'height'].includes(e.propertyName)) {
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
        current.setAttribute('tabindex', -1);

        // Set attributes on target
        toggleHidden(pane, false);

        const tabs = getElements.call(this, `[aria-controls="${target}"]`);
        Array.from(tabs).forEach(tab => {
            tab.setAttribute('aria-expanded', true);
        });
        pane.removeAttribute('tabindex');

        // Focus the first item
        pane.querySelectorAll('button:not(:disabled), input:not(:disabled), [tabindex]')[0].focus();
    },

    // Build the default HTML
    // TODO: Set order based on order in the config.controls array?
    create(data) {
        // Do nothing if we want no controls
        if (is.empty(this.config.controls)) {
            return null;
        }

        // Create the container
        const container = createElement('div', getAttributesFromSelector(this.config.selectors.controls.wrapper));

        // Restart button
        if (this.config.controls.includes('restart')) {
            container.appendChild(controls.createButton.call(this, 'restart'));
        }

        // Rewind button
        if (this.config.controls.includes('rewind')) {
            container.appendChild(controls.createButton.call(this, 'rewind'));
        }

        // Play/Pause button
        if (this.config.controls.includes('play')) {
            container.appendChild(controls.createButton.call(this, 'play'));
        }

        // Fast forward button
        if (this.config.controls.includes('fast-forward')) {
            container.appendChild(controls.createButton.call(this, 'fast-forward'));
        }

        // Progress
        if (this.config.controls.includes('progress')) {
            const progress = createElement('div', getAttributesFromSelector(this.config.selectors.progress));

            // Seek range slider
            progress.appendChild(
                controls.createRange.call(this, 'seek', {
                    id: `plyr-seek-${data.id}`,
                }),
            );

            // Buffer progress
            progress.appendChild(controls.createProgress.call(this, 'buffer'));

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
            container.appendChild(this.elements.progress);
        }

        // Media current time display
        if (this.config.controls.includes('current-time')) {
            container.appendChild(controls.createTime.call(this, 'currentTime'));
        }

        // Media duration display
        if (this.config.controls.includes('duration')) {
            container.appendChild(controls.createTime.call(this, 'duration'));
        }

        // Toggle mute button
        if (this.config.controls.includes('mute')) {
            container.appendChild(controls.createButton.call(this, 'mute'));
        }

        // Volume range control
        if (this.config.controls.includes('volume')) {
            const volume = createElement('div', {
                class: 'plyr__volume',
            });

            // Set the attributes
            const attributes = {
                max: 1,
                step: 0.05,
                value: this.config.volume,
            };

            // Create the volume range slider
            volume.appendChild(
                controls.createRange.call(
                    this,
                    'volume',
                    extend(attributes, {
                        id: `plyr-volume-${data.id}`,
                    }),
                ),
            );

            this.elements.volume = volume;

            container.appendChild(volume);
        }

        // Toggle captions button
        if (this.config.controls.includes('captions')) {
            container.appendChild(controls.createButton.call(this, 'captions'));
        }

        // Settings button / menu
        if (this.config.controls.includes('settings') && !is.empty(this.config.settings)) {
            const menu = createElement('div', {
                class: 'plyr__menu',
                hidden: '',
            });

            menu.appendChild(
                controls.createButton.call(this, 'settings', {
                    id: `plyr-settings-toggle-${data.id}`,
                    'aria-haspopup': true,
                    'aria-controls': `plyr-settings-${data.id}`,
                    'aria-expanded': false,
                }),
            );

            const form = createElement('form', {
                class: 'plyr__menu__container',
                id: `plyr-settings-${data.id}`,
                hidden: '',
                'aria-labelled-by': `plyr-settings-toggle-${data.id}`,
                role: 'tablist',
                tabindex: -1,
            });

            const inner = createElement('div');

            const home = createElement('div', {
                id: `plyr-settings-${data.id}-home`,
                'aria-labelled-by': `plyr-settings-toggle-${data.id}`,
                role: 'tabpanel',
            });

            // Create the tab list
            const tabs = createElement('ul', {
                role: 'tablist',
            });

            // Build the tabs
            this.config.settings.forEach(type => {
                const tab = createElement('li', {
                    role: 'tab',
                    hidden: '',
                });

                const button = createElement(
                    'button',
                    extend(getAttributesFromSelector(this.config.selectors.buttons.settings), {
                        type: 'button',
                        class: `${this.config.classNames.control} ${this.config.classNames.control}--forward`,
                        id: `plyr-settings-${data.id}-${type}-tab`,
                        'aria-haspopup': true,
                        'aria-controls': `plyr-settings-${data.id}-${type}`,
                        'aria-expanded': false,
                    }),
                    i18n.get(type, this.config),
                );

                const value = createElement('span', {
                    class: this.config.classNames.menu.value,
                });

                // Speed contains HTML entities
                value.innerHTML = data[type];

                button.appendChild(value);
                tab.appendChild(button);
                tabs.appendChild(tab);

                this.elements.settings.tabs[type] = tab;
            });

            home.appendChild(tabs);
            inner.appendChild(home);

            // Build the panes
            this.config.settings.forEach(type => {
                const pane = createElement('div', {
                    id: `plyr-settings-${data.id}-${type}`,
                    hidden: '',
                    'aria-labelled-by': `plyr-settings-${data.id}-${type}-tab`,
                    role: 'tabpanel',
                    tabindex: -1,
                });

                const back = createElement(
                    'button',
                    {
                        type: 'button',
                        class: `${this.config.classNames.control} ${this.config.classNames.control}--back`,
                        'aria-haspopup': true,
                        'aria-controls': `plyr-settings-${data.id}-home`,
                        'aria-expanded': false,
                    },
                    i18n.get(type, this.config),
                );

                pane.appendChild(back);

                const options = createElement('ul');

                pane.appendChild(options);
                inner.appendChild(pane);

                this.elements.settings.panes[type] = pane;
            });

            form.appendChild(inner);
            menu.appendChild(form);
            container.appendChild(menu);

            this.elements.settings.form = form;
            this.elements.settings.menu = menu;
        }

        // Picture in picture button
        if (this.config.controls.includes('pip') && support.pip) {
            container.appendChild(controls.createButton.call(this, 'pip'));
        }

        // Airplay button
        if (this.config.controls.includes('airplay') && support.airplay) {
            container.appendChild(controls.createButton.call(this, 'airplay'));
        }

        // Toggle fullscreen button
        if (this.config.controls.includes('fullscreen')) {
            container.appendChild(controls.createButton.call(this, 'fullscreen'));
        }

        // Larger overlaid play button
        if (this.config.controls.includes('play-large')) {
            this.elements.container.appendChild(controls.createButton.call(this, 'play-large'));
        }

        this.elements.controls = container;

        if (this.isHTML5) {
            controls.setQualityMenu.call(this, html5.getQualityOptions.call(this));
        }

        controls.setSpeedMenu.call(this);

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

        if (is.string(this.config.controls) || is.element(this.config.controls)) {
            // String or HTMLElement passed as the option
            container = this.config.controls;
        } else if (is.function(this.config.controls)) {
            // A custom function to build controls
            // The function can return a HTMLElement or String
            container = this.config.controls.call(this, props);
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
            } else if (is.element(container)) {
                container.innerHTML = replace(container.innerHTML);
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

        // Edge sometimes doesn't finish the paint so force a redraw
        if (window.navigator.userAgent.includes('Edge')) {
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
