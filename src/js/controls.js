// ==========================================================================
// Plyr controls
// ==========================================================================

import support from './support';
import utils from './utils';
import ui from './ui';

const controls = {
    // Webkit polyfill for lower fill range
    updateRangeFill(target) {
        // WebKit only
        if (!this.browser.isWebkit) {
            return;
        }

        // Get range from event if event passed
        const range = utils.is.event(target) ? target.target : target;

        // Needs to be a valid <input type='range'>
        if (!utils.is.htmlElement(range) || range.getAttribute('type') !== 'range') {
            return;
        }

        // Inject the stylesheet if needed
        if (!utils.is.htmlElement(this.elements.styleSheet)) {
            this.elements.styleSheet = utils.createElement('style');
            this.elements.container.appendChild(this.elements.styleSheet);
        }

        const styleSheet = this.elements.styleSheet.sheet;
        const percentage = range.value / range.max * 100;
        const selector = `#${range.id}::-webkit-slider-runnable-track`;
        const styles = `{ background-image: linear-gradient(to right, currentColor ${percentage}%, transparent ${percentage}%) }`;

        // Find old rule if it exists
        const index = Array.from(styleSheet.rules).findIndex(rule => rule.selectorText === selector);

        // Remove old rule
        if (index !== -1) {
            styleSheet.deleteRule(index);
        }

        // Insert new one
        styleSheet.insertRule([selector, styles].join(' '));
    },

    // Get icon URL
    getIconUrl() {
        return {
            url: this.config.iconUrl,
            absolute: this.config.iconUrl.indexOf('http') === 0 || (this.browser.isIE && !window.svg4everybody),
        };
    },

    // Create <svg> icon
    createIcon(type, attributes) {
        const namespace = 'http://www.w3.org/2000/svg';
        const iconUrl = controls.getIconUrl.call(this);
        const iconPath = `${!iconUrl.absolute ? iconUrl.url : ''}#${this.config.iconPrefix}`;

        // Create <svg>
        const icon = document.createElementNS(namespace, 'svg');
        utils.setAttributes(
            icon,
            utils.extend(attributes, {
                role: 'presentation',
            })
        );

        // Create the <use> to reference sprite
        const use = document.createElementNS(namespace, 'use');
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `${iconPath}-${type}`);

        // Add <use> to <svg>
        icon.appendChild(use);

        return icon;
    },

    // Create hidden text label
    createLabel(type) {
        let text = this.config.i18n[type];

        switch (type) {
            case 'pip':
                text = 'PIP';
                break;

            case 'airplay':
                text = 'AirPlay';
                break;

            default:
                break;
        }

        return utils.createElement(
            'span',
            {
                class: this.config.classNames.hidden,
            },
            text
        );
    },

    // Create a badge
    createBadge(text) {
        const badge = utils.createElement('span', {
            class: this.config.classNames.menu.value,
        });

        badge.appendChild(
            utils.createElement(
                'span',
                {
                    class: this.config.classNames.menu.badge,
                },
                text
            )
        );

        return badge;
    },

    // Create a <button>
    createButton(buttonType, attr) {
        const button = utils.createElement('button');
        const attributes = Object.assign({}, attr);
        let type = buttonType;
        let iconDefault;
        let iconToggled;
        let labelKey;

        if (!('type' in attributes)) {
            attributes.type = 'button';
        }

        if ('class' in attributes) {
            if (attributes.class.indexOf(this.config.classNames.control) === -1) {
                attributes.class += ` ${this.config.classNames.control}`;
            }
        } else {
            attributes.class = this.config.classNames.control;
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
        utils.extend(attributes, utils.getAttributesFromSelector(this.config.selectors.buttons[type], attributes));

        // Add toggle icon if needed
        if (utils.is.string(iconToggled)) {
            button.appendChild(
                controls.createIcon.call(this, iconToggled, {
                    class: `icon--${iconToggled}`,
                })
            );
        }

        button.appendChild(controls.createIcon.call(this, iconDefault));
        button.appendChild(controls.createLabel.call(this, labelKey));

        utils.setAttributes(button, attributes);

        this.elements.buttons[type] = button;

        return button;
    },

    // Create an <input type='range'>
    createRange(type, attributes) {
        // Seek label
        const label = utils.createElement(
            'label',
            {
                for: attributes.id,
                class: this.config.classNames.hidden,
            },
            this.config.i18n[type]
        );

        // Seek input
        const input = utils.createElement(
            'input',
            utils.extend(
                utils.getAttributesFromSelector(this.config.selectors.inputs[type]),
                {
                    type: 'range',
                    min: 0,
                    max: 100,
                    step: 0.01,
                    value: 0,
                    autocomplete: 'off',
                },
                attributes
            )
        );

        this.elements.inputs[type] = input;

        // Set the fill for webkit now
        controls.updateRangeFill.call(this, input);

        return {
            label,
            input,
        };
    },

    // Create a <progress>
    createProgress(type, attributes) {
        const progress = utils.createElement(
            'progress',
            utils.extend(
                utils.getAttributesFromSelector(this.config.selectors.display[type]),
                {
                    min: 0,
                    max: 100,
                    value: 0,
                },
                attributes
            )
        );

        // Create the label inside
        if (type !== 'volume') {
            progress.appendChild(utils.createElement('span', null, '0'));

            let suffix = '';
            switch (type) {
                case 'played':
                    suffix = this.config.i18n.played;
                    break;

                case 'buffer':
                    suffix = this.config.i18n.buffered;
                    break;

                default:
                    break;
            }

            progress.textContent = `% ${suffix.toLowerCase()}`;
        }

        this.elements.display[type] = progress;

        return progress;
    },

    // Create time display
    createTime(type) {
        const container = utils.createElement('span', {
            class: 'plyr__time',
        });

        container.appendChild(
            utils.createElement(
                'span',
                {
                    class: this.config.classNames.hidden,
                },
                this.config.i18n[type]
            )
        );

        container.appendChild(
            utils.createElement('span', utils.getAttributesFromSelector(this.config.selectors.display[type]), '00:00')
        );

        this.elements.display[type] = container;

        return container;
    },

    // Update hover tooltip for seeking
    updateSeekTooltip(event) {
        // Bail if setting not true
        if (
            !this.config.tooltips.seek ||
            !utils.is.htmlElement(this.elements.inputs.seek) ||
            !utils.is.htmlElement(this.elements.display.seekTooltip) ||
            this.duration === 0
        ) {
            return;
        }

        // Calculate percentage
        let percent = 0;
        const clientRect = this.elements.inputs.seek.getBoundingClientRect();
        const visible = `${this.config.classNames.tooltip}--visible`;

        // Determine percentage, if already visible
        if (utils.is.event(event)) {
            percent = 100 / clientRect.width * (event.pageX - clientRect.left);
        } else if (utils.hasClass(this.elements.display.seekTooltip, visible)) {
            percent = this.elements.display.seekTooltip.style.left.replace('%', '');
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
        ui.updateTimeDisplay.call(this, this.duration / 100 * percent, this.elements.display.seekTooltip);

        // Set position
        this.elements.display.seekTooltip.style.left = `${percent}%`;

        // Show/hide the tooltip
        // If the event is a moues in/out and percentage is inside bounds
        if (utils.is.event(event) && ['mouseenter', 'mouseleave'].includes(event.type)) {
            utils.toggleClass(this.elements.display.seekTooltip, visible, event.type === 'mouseenter');
        }
    },

    // Hide/show a tab
    toggleTab(setting, toggle) {
        const tab = this.elements.settings.tabs[setting];
        const pane = this.elements.settings.panes[setting];

        if (utils.is.htmlElement(tab)) {
            if (toggle) {
                tab.removeAttribute('hidden');
            } else {
                tab.setAttribute('hidden', '');
            }
        }

        if (utils.is.htmlElement(pane)) {
            if (toggle) {
                pane.removeAttribute('hidden');
            } else {
                pane.setAttribute('hidden', '');
            }
        }
    },

    // Set the YouTube quality menu
    // TODO: Support for HTML5
    setQualityMenu(options) {
        const list = this.elements.settings.panes.quality.querySelector('ul');

        // Set options if passed and filter based on config
        if (utils.is.array(options)) {
            this.options.quality = options.filter(quality => this.config.quality.options.includes(quality));
        } else {
            this.options.quality = this.config.quality.options;
        }

        // Toggle the pane and tab
        const toggle = !utils.is.empty(this.options.quality) && this.type === 'youtube';
        controls.toggleTab.call(this, 'quality', toggle);

        // If we're hiding, nothing more to do
        if (!toggle) {
            return;
        }

        // Empty the menu
        utils.emptyElement(list);

        // Get the badge HTML for HD, 4K etc
        const getBadge = quality => {
            let label = '';

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

                default:
                    break;
            }

            if (!label.length) {
                return null;
            }

            return controls.createBadge.call(this, label);
        };

        this.options.quality.forEach(quality => {
            const item = utils.createElement('li');

            const label = utils.createElement('label', {
                class: this.config.classNames.control,
            });

            const radio = utils.createElement(
                'input',
                utils.extend(utils.getAttributesFromSelector(this.config.selectors.inputs.quality), {
                    type: 'radio',
                    name: 'plyr-quality',
                    value: quality,
                })
            );

            label.appendChild(radio);
            label.appendChild(document.createTextNode(controls.getLabel.call(this, 'quality', quality)));

            const badge = getBadge(quality);
            if (utils.is.htmlElement(badge)) {
                label.appendChild(badge);
            }

            item.appendChild(label);
            list.appendChild(item);
        });

        controls.updateSetting.call(this, 'quality', list);
    },

    // Translate a value into a nice label
    // TODO: Localisation
    getLabel(setting, value) {
        switch (setting) {
            case 'speed':
                return value === 1 ? 'Normal' : `${value}&times;`;

            case 'quality':
                switch (value) {
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
                    case 'tiny':
                        return 'Tiny';
                    case 'default':
                        return 'Auto';
                    default:
                        return value;
                }

            case 'captions':
                return controls.getLanguage.call(this);

            default:
                return null;
        }
    },

    // Update the selected setting
    updateSetting(setting, container) {
        const pane = this.elements.settings.panes[setting];
        let value = null;
        let list = container;

        switch (setting) {
            case 'captions':
                value = this.captions.language;

                if (!this.captions.enabled) {
                    value = '';
                }

                break;

            default:
                value = this[setting];

                // Get default
                if (utils.is.empty(value)) {
                    value = this.config[setting].default;
                }

                // Unsupported value
                if (!this.options[setting].includes(value)) {
                    this.warn(`Unsupported value of '${value}' for ${setting}`);
                    return;
                }

                // Disabled value
                if (!this.config[setting].options.includes(value)) {
                    this.warn(`Disabled value of '${value}' for ${setting}`);
                    return;
                }

                break;
        }

        // Get the list if we need to
        if (!utils.is.htmlElement(list)) {
            list = pane && pane.querySelector('ul');
        }

        // Find the radio option
        const target = list && list.querySelector(`input[value="${value}"]`);

        if (!utils.is.htmlElement(target)) {
            return;
        }

        // Check it
        target.checked = true;

        // Find the label
        const label = this.elements.settings.tabs[setting].querySelector(`.${this.config.classNames.menu.value}`);
        label.innerHTML = controls.getLabel.call(this, setting, value);
    },

    // Set the looping options
    setLoopMenu() {
        const options = ['start', 'end', 'all', 'reset'];
        const list = this.elements.settings.panes.loop.querySelector('ul');

        // Show the pane and tab
        this.elements.settings.tabs.loop.removeAttribute('hidden');
        this.elements.settings.panes.loop.removeAttribute('hidden');

        // Toggle the pane and tab
        const toggle = !utils.is.empty(this.loop.options);
        controls.toggleTab.call(this, 'loop', toggle);

        // Empty the menu
        utils.emptyElement(list);

        options.forEach(option => {
            const item = utils.createElement('li');

            const button = utils.createElement(
                'button',
                utils.extend(utils.getAttributesFromSelector(this.config.selectors.buttons.loop), {
                    type: 'button',
                    class: this.config.classNames.control,
                    'data-plyr-loop-action': option,
                }),
                this.config.i18n[option]
            );

            if (['start', 'end'].includes(option)) {
                const badge = controls.createBadge.call(this, '00:00');
                button.appendChild(badge);
            }

            item.appendChild(button);
            list.appendChild(item);
        });
    },

    // Get current selected caption language
    // TODO: rework this to user the getter in the API?
    getLanguage() {
        if (!this.supported.ui) {
            return null;
        }

        if (!support.textTracks || utils.is.empty(this.captions.tracks)) {
            return this.config.i18n.none;
        }

        if (this.captions.enabled) {
            return this.captions.currentTrack.label;
        }

        return this.config.i18n.disabled;
    },

    // Set a list of available captions languages
    setCaptionsMenu() {
        const list = this.elements.settings.panes.captions.querySelector('ul');

        // Toggle the pane and tab
        const toggle = !utils.is.empty(this.captions.tracks);
        controls.toggleTab.call(this, 'captions', toggle);

        // Empty the menu
        utils.emptyElement(list);

        // If there's no captions, bail
        if (utils.is.empty(this.captions.tracks)) {
            return;
        }

        // Re-map the tracks into just the data we need
        const tracks = Array.from(this.captions.tracks).map(track => ({
            language: track.language,
            badge: true,
            label: !utils.is.empty(track.label) ? track.label : track.language.toUpperCase(),
        }));

        // Add the "None" option to turn off captions
        tracks.unshift({
            language: '',
            label: this.config.i18n.none,
        });

        // Generate options
        tracks.forEach(track => {
            const item = utils.createElement('li');

            const label = utils.createElement('label', {
                class: this.config.classNames.control,
            });

            const radio = utils.createElement(
                'input',
                utils.extend(utils.getAttributesFromSelector(this.config.selectors.inputs.language), {
                    type: 'radio',
                    name: 'plyr-language',
                    value: track.language,
                })
            );

            if (track.language.toLowerCase() === this.captions.language.toLowerCase()) {
                radio.checked = true;
            }

            label.appendChild(radio);
            label.appendChild(document.createTextNode(track.label || track.language));

            if (track.badge) {
                label.appendChild(controls.createBadge.call(this, track.language.toUpperCase()));
            }

            item.appendChild(label);
            list.appendChild(item);
        });

        controls.updateSetting.call(this, 'captions', list);
    },

    // Set a list of available captions languages
    setSpeedMenu(options) {
        // Set options if passed and filter based on config
        if (utils.is.array(options)) {
            this.options.speed = options.filter(speed => this.config.speed.options.includes(speed));
        } else {
            this.options.speed = this.config.speed.options;
        }

        // Toggle the pane and tab
        const toggle = !utils.is.empty(this.options.speed);
        controls.toggleTab.call(this, 'speed', toggle);

        // If we're hiding, nothing more to do
        if (!toggle) {
            return;
        }

        // Get the list to populate
        const list = this.elements.settings.panes.speed.querySelector('ul');

        // Show the pane and tab
        this.elements.settings.tabs.speed.removeAttribute('hidden');
        this.elements.settings.panes.speed.removeAttribute('hidden');

        // Empty the menu
        utils.emptyElement(list);

        // Create items
        this.options.speed.forEach(speed => {
            const item = utils.createElement('li');

            const label = utils.createElement('label', {
                class: this.config.classNames.control,
            });

            const radio = utils.createElement(
                'input',
                utils.extend(utils.getAttributesFromSelector(this.config.selectors.inputs.speed), {
                    type: 'radio',
                    name: 'plyr-speed',
                    value: speed,
                })
            );

            label.appendChild(radio);
            label.insertAdjacentHTML('beforeend', controls.getLabel.call(this, 'speed', speed));
            item.appendChild(label);
            list.appendChild(item);
        });

        controls.updateSetting.call(this, 'speed', list);
    },

    // Show/hide menu
    toggleMenu(event) {
        const { form } = this.elements.settings;
        const button = this.elements.buttons.settings;
        const show = utils.is.boolean(event) ? event : form && form.getAttribute('aria-hidden') === 'true';

        if (utils.is.event(event)) {
            const isMenuItem = form && form.contains(event.target);
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
        if (button) {
            button.setAttribute('aria-expanded', show);
        }
        if (form) {
            form.setAttribute('aria-hidden', !show);

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
        clone.setAttribute('aria-hidden', false);

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
        utils.removeElement(clone);

        return {
            width,
            height,
        };
    },

    // Toggle Menu
    showTab(event) {
        const { menu } = this.elements.settings;
        const tab = event.target;
        const show = tab.getAttribute('aria-expanded') === 'false';
        const pane = document.getElementById(tab.getAttribute('aria-controls'));

        // Nothing to show, bail
        if (!utils.is.htmlElement(pane)) {
            return;
        }

        // Are we targetting a tab? If not, bail
        const isTab = pane.getAttribute('role') === 'tabpanel';
        if (!isTab) {
            return;
        }

        // Hide all other tabs
        // Get other tabs
        const current = menu.querySelector('[role="tabpanel"][aria-hidden="false"]');
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
                utils.off(container, utils.transitionEnd, restore);
            };

            // Listen for the transition finishing and restore auto height/width
            utils.on(container, utils.transitionEnd, restore);

            // Set dimensions to target
            container.style.width = `${size.width}px`;
            container.style.height = `${size.height}px`;
        }

        // Set attributes on current tab
        current.setAttribute('aria-hidden', true);
        current.setAttribute('tabindex', -1);

        // Set attributes on target
        pane.setAttribute('aria-hidden', !show);
        tab.setAttribute('aria-expanded', show);
        pane.removeAttribute('tabindex');
    },

    // Build the default HTML
    // TODO: Set order based on order in the config.controls array?
    create(data) {
        // Do nothing if we want no controls
        if (utils.is.empty(this.config.controls)) {
            return null;
        }

        // Create the container
        const container = utils.createElement(
            'div',
            utils.getAttributesFromSelector(this.config.selectors.controls.wrapper)
        );

        // Restart button
        if (this.config.controls.includes('restart')) {
            container.appendChild(controls.createButton.call(this, 'restart'));
        }

        // Rewind button
        if (this.config.controls.includes('rewind')) {
            container.appendChild(controls.createButton.call(this, 'rewind'));
        }

        // Play Pause button
        if (this.config.controls.includes('play')) {
            container.appendChild(controls.createButton.call(this, 'play'));
            container.appendChild(controls.createButton.call(this, 'pause'));
        }

        // Fast forward button
        if (this.config.controls.includes('fast-forward')) {
            container.appendChild(controls.createButton.call(this, 'fast-forward'));
        }

        // Progress
        if (this.config.controls.includes('progress')) {
            const progress = utils.createElement(
                'span',
                utils.getAttributesFromSelector(this.config.selectors.progress)
            );

            // Seek range slider
            const seek = controls.createRange.call(this, 'seek', {
                id: `plyr-seek-${data.id}`,
            });
            progress.appendChild(seek.label);
            progress.appendChild(seek.input);

            // Buffer progress
            progress.appendChild(controls.createProgress.call(this, 'buffer'));

            // TODO: Add loop display indicator

            // Seek tooltip
            if (this.config.tooltips.seek) {
                const tooltip = utils.createElement(
                    'span',
                    {
                        role: 'tooltip',
                        class: this.config.classNames.tooltip,
                    },
                    '00:00'
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
            const volume = utils.createElement('span', {
                class: 'plyr__volume',
            });

            // Set the attributes
            const attributes = {
                max: 1,
                step: 0.05,
                value: this.config.volume,
            };

            // Create the volume range slider
            const range = controls.createRange.call(
                this,
                'volume',
                utils.extend(attributes, {
                    id: `plyr-volume-${data.id}`,
                })
            );
            volume.appendChild(range.label);
            volume.appendChild(range.input);

            container.appendChild(volume);
        }

        // Toggle captions button
        if (this.config.controls.includes('captions')) {
            container.appendChild(controls.createButton.call(this, 'captions'));
        }

        // Settings button / menu
        if (this.config.controls.includes('settings') && !utils.is.empty(this.config.settings)) {
            const menu = utils.createElement('div', {
                class: 'plyr__menu',
            });

            menu.appendChild(
                controls.createButton.call(this, 'settings', {
                    id: `plyr-settings-toggle-${data.id}`,
                    'aria-haspopup': true,
                    'aria-controls': `plyr-settings-${data.id}`,
                    'aria-expanded': false,
                })
            );

            const form = utils.createElement('form', {
                class: 'plyr__menu__container',
                id: `plyr-settings-${data.id}`,
                'aria-hidden': true,
                'aria-labelled-by': `plyr-settings-toggle-${data.id}`,
                role: 'tablist',
                tabindex: -1,
            });

            const inner = utils.createElement('div');

            const home = utils.createElement('div', {
                id: `plyr-settings-${data.id}-home`,
                'aria-hidden': false,
                'aria-labelled-by': `plyr-settings-toggle-${data.id}`,
                role: 'tabpanel',
            });

            // Create the tab list
            const tabs = utils.createElement('ul', {
                role: 'tablist',
            });

            // Build the tabs
            this.config.settings.forEach(type => {
                const tab = utils.createElement('li', {
                    role: 'tab',
                    hidden: '',
                });

                const button = utils.createElement(
                    'button',
                    utils.extend(utils.getAttributesFromSelector(this.config.selectors.buttons.settings), {
                        type: 'button',
                        class: `${this.config.classNames.control} ${this.config.classNames.control}--forward`,
                        id: `plyr-settings-${data.id}-${type}-tab`,
                        'aria-haspopup': true,
                        'aria-controls': `plyr-settings-${data.id}-${type}`,
                        'aria-expanded': false,
                    }),
                    this.config.i18n[type]
                );

                const value = utils.createElement('span', {
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
                const pane = utils.createElement('div', {
                    id: `plyr-settings-${data.id}-${type}`,
                    'aria-hidden': true,
                    'aria-labelled-by': `plyr-settings-${data.id}-${type}-tab`,
                    role: 'tabpanel',
                    tabindex: -1,
                    hidden: '',
                });

                const back = utils.createElement(
                    'button',
                    {
                        type: 'button',
                        class: `${this.config.classNames.control} ${this.config.classNames.control}--back`,
                        'aria-haspopup': true,
                        'aria-controls': `plyr-settings-${data.id}-home`,
                        'aria-expanded': false,
                    },
                    this.config.i18n[type]
                );

                pane.appendChild(back);

                const options = utils.createElement('ul');

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
            this.elements.buttons.playLarge = controls.createButton.call(this, 'play-large');
            this.elements.container.appendChild(this.elements.buttons.playLarge);
        }

        this.elements.controls = container;

        if (this.config.controls.includes('settings') && this.config.settings.includes('speed')) {
            controls.setSpeedMenu.call(this);
        }

        return container;
    },

    // Insert controls
    inject() {
        // Sprite
        if (this.config.loadSprite) {
            const iconUrl = controls.getIconUrl.call(this);

            // Only load external sprite using AJAX
            if (iconUrl.absolute) {
                this.log(`AJAX loading absolute SVG sprite ${this.browser.isIE ? '(due to IE)' : ''}`);
                utils.loadSprite(iconUrl.url, 'sprite-plyr');
            } else {
                this.log('Sprite will be used as external resource directly');
            }
        }

        // Create a unique ID
        this.id = Math.floor(Math.random() * 10000);

        // Null by default
        let container = null;

        // HTML passed as the option
        if (utils.is.string(this.config.controls)) {
            container = this.config.controls;
        } else if (utils.is.function(this.config.controls)) {
            // A custom function to build controls
            // The function can return a HTMLElement or String
            container = this.config.controls({
                id: this.id,
                seektime: this.config.seekTime,
                title: this.config.title,
            });
        } else {
            // Create controls
            container = controls.create.call(this, {
                id: this.id,
                seektime: this.config.seekTime,
                speed: this.speed,
                quality: this.quality,
                captions: controls.getLanguage.call(this),
                // TODO: Looping
                // loop: 'None',
            });
        }

        // Controls container
        let target;

        // Inject to custom location
        if (utils.is.string(this.config.selectors.controls.container)) {
            target = document.querySelector(this.config.selectors.controls.container);
        }

        // Inject into the container by default
        if (!utils.is.htmlElement(target)) {
            target = this.elements.container;
        }

        // Inject controls HTML
        if (utils.is.htmlElement(container)) {
            target.appendChild(container);
        } else {
            target.insertAdjacentHTML('beforeend', container);
        }

        // Find the elements if need be
        if (utils.is.htmlElement(this.elements.controls)) {
            utils.findElements.call(this);
        }

        // Setup tooltips
        if (this.config.tooltips.controls) {
            const labels = utils.getElements.call(
                this,
                [
                    this.config.selectors.controls.wrapper,
                    ' ',
                    this.config.selectors.labels,
                    ' .',
                    this.config.classNames.hidden,
                ].join('')
            );

            Array.from(labels).forEach(label => {
                utils.toggleClass(label, this.config.classNames.hidden, false);
                utils.toggleClass(label, this.config.classNames.tooltip, true);
            });
        }
    },
};

export default controls;
