import captions from './captions';
import controls from './controls';
import html5 from './html5';
import i18n from './i18n';
import { dedupe } from './utils/arrays';
import { createElement, emptyElement, getAttributesFromSelector } from './utils/elements';
import is from './utils/is';
import { extend } from './utils/objects';

const hahow = {
    createControls(data) {
        // Create the container
        const container = createElement('div', getAttributesFromSelector(this.config.selectors.controls.wrapper));

        const topLayer = createElement('div', getAttributesFromSelector(this.config.selectors.controls.layer.topLayer));
        const bottomLayer = createElement(
            'div',
            getAttributesFromSelector(this.config.selectors.controls.layer.bottomLayer),
        );
        const bottomLeft = createElement('div', getAttributesFromSelector(this.config.selectors.controls.bottom.left));
        const bottomRight = createElement(
            'div',
            getAttributesFromSelector(this.config.selectors.controls.bottom.right),
        );

        bottomLayer.appendChild(bottomLeft);
        bottomLayer.appendChild(bottomRight);
        container.appendChild(topLayer);
        container.appendChild(bottomLayer);

        // Rewind button
        bottomLeft.appendChild(controls.createButton.call(this, 'rewind'));

        // Play/Pause button
        bottomLeft.appendChild(controls.createButton.call(this, 'play'));

        // Fast forward button
        bottomLeft.appendChild(controls.createButton.call(this, 'fast-forward'));

        // Progress
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
        topLayer.appendChild(this.elements.progress);

        // Media current time display
        bottomLeft.appendChild(controls.createTime.call(this, 'currentTime'));

        // Media duration display
        bottomLeft.appendChild(controls.createTime.call(this, 'duration'));

        // Toggle mute button
        bottomRight.appendChild(controls.createButton.call(this, 'mute'));

        // Volume range control
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

        bottomRight.appendChild(volume);

        // Settings button / menu
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
        bottomRight.appendChild(menu);

        this.elements.settings.form = form;
        this.elements.settings.menu = menu;

        bottomRight.appendChild(controls.createButton.call(this, 'zoom'));

        // Toggle fullscreen button
        bottomRight.appendChild(controls.createButton.call(this, 'fullscreen'));

        this.elements.controls = container;

        if (this.isHTML5) {
            hahow.setQualityMenu.call(this, html5.getQualityOptions.call(this));
        }

        hahow.setSpeedMenu.call(this);
        hahow.setCaptionsMenu.call(this);
        hahow.setCaptionsPositionMenu.call(this);

        return container;
    },

    // Set the quality menu
    setQualityMenu(options) {
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
                });
            });

        controls.updateSetting.call(this, type, list);
    },

    // Set a list of available captions languages
    setCaptionsMenu() {
        // TODO: Captions or language? Currently it's mixed
        const type = 'captions';
        const list = this.elements.settings.panes.captions.querySelector('ul');
        const tracks = captions.getTracks.call(this);

        // Toggle the pane and tab
        controls.toggleTab.call(this, type, true);

        // Empty the menu
        emptyElement(list);

        // Check if we need to toggle the parent
        controls.checkMenu.call(this);

        // If there's no captions, bail
        if (!tracks.length) {
            controls.createMenuItem.bind(this)({
                value: -1,
                checked: !this.captions.toggled,
                title: i18n.get('noCaptions', this.config),
                list,
                type: 'language',
            });
            controls.updateSetting.call(this, type, list);
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

    setCaptionsPositionMenu() {
        if (!is.element(this.elements.settings.panes['caption-position'])) {
            return;
        }

        const type = 'caption-position';

        controls.toggleTab.call(this, type, true);

        // Get the list to populate
        const list = this.elements.settings.panes['caption-position'].querySelector('ul');

        // Empty the menu
        emptyElement(list);

        const positions = ['top', 'bottom'];

        // Create items
        positions.forEach(position => {
            controls.createMenuItem.call(this, {
                value: position,
                list,
                type,
                title: controls.getLabel.call(this, 'caption-position', position),
            });
        });
        controls.updateSetting.call(this, type, list);
    },

    // Set a list of available captions languages
    setSpeedMenu(options) {
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
};

export default hahow;
