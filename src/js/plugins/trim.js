// ==========================================================================
// Plyr Trim control
// ==========================================================================

import { createElement, toggleClass, toggleHidden } from '../utils/elements';
import { on, triggerEvent } from '../utils/events';
import is from '../utils/is';

class Trim {
    constructor(player) {
        // Keep reference to parent
        this.player = player;
        this.config = player.config.trim;
        this.loaded = false;
        this.trimming = false;
        this.trimLength = 30;
        this.tool = {
            bar: null,
            leftThumb: null,
            rightThumb: null,
            editing: null,
        };

        // Handle event (incase user presses escape etc)
        on.call(this.player, document, () => {
            this.onChange();
        });

        // Update the UI
        this.update();

        // Prevent the trim tool from being added until the player is in a playable state
        // If the user has pressed the trim tool before this event has fired, show the tool
        this.player.once('canplay', () => {
            this.loaded = true;
            if (this.trimming) {
                this.createTrimTool();
            }
        });
    }

    // Determine if trim is enabled
    get enabled() {
        const { config } = this;
        return config.enabled && this.player.isHTML5 && this.player.isVideo;
    }

    // Get active state
    get active() {
        if (!this.enabled) {
            return false;
        }

        return this.trimming;
    }

    // Get trim range in seconds
    getTrimRange() {
        const { left, width } = this.tool.bar.style;
        const start = this.player.media.duration * (parseFloat(left) / 100);
        const end = this.player.media.duration * ((parseFloat(left) + parseFloat(width)) / 100);

        this.player.debug.log(`Set trimming range from ${start}seconds to ${end}seconds`);
        return { start, end };
    }

    // Show the trim toolbar from the timeline
    showTrimTool() {
        if (!this.tool.bar) {
            this.createTrimTool();
        }
        toggleHidden(this.tool.bar, false);
    }

    // Hide the trim toolbar from the timeline
    hideTrimTool() {
        toggleHidden(this.tool.bar, true);
    }

    // Add trim toolbar to the timeline
    createTrimTool() {
        const seekElement = this.player.elements.progress;
        if (is.element(seekElement) && this.loaded) {
            this.createTrimBar(seekElement);
            this.createTrimBarThumbs();
        }
    }

    // Add trim bar to the timeline
    createTrimBar(seekElement) {
        // Set the trim bar from the current seek time to the trimlength
        const start = this.player.elements.inputs.seek.value;
        // Set the trim bar to be x number of seconds after start and prevent from overflowing
        const end = Math.min(
            parseFloat(start) + (100 / this.player.duration) * this.trimLength,
            100 - parseFloat(start),
        );
        this.tool.bar = createElement('span', {
            class: this.player.config.classNames.trim.trimTool,
        });

        this.tool.bar.style.left = `${start.toString()}%`;
        this.tool.bar.style.width = `${end.toString()}%`;
        seekElement.appendChild(this.tool.bar);

        triggerEvent.call(this.player, this.getTrimRange(), 'trimchange');
    }

    // Add trim length thumbs to the timeline
    createTrimBarThumbs() {
        const { trim } = this.player.config.classNames;

        // Create the trim bar thumb elements
        this.tool.leftThumb = createElement('span', { class: trim.leftThumb });
        this.tool.rightThumb = createElement('span', { class: trim.rightThumb });

        // Add the thumbs to the bar
        this.tool.bar.appendChild(this.tool.leftThumb);
        this.tool.bar.appendChild(this.tool.rightThumb);

        // Add listens for trim thumb (handle) selection
        this.player.listeners.bind(this.tool.leftThumb, 'mousedown touchstart', event => {
            if (this.tool.bar) {
                this.setEditing(event);
            }
        });

        // Listen for trim thumb (handle) selection
        this.player.listeners.bind(this.tool.rightThumb, 'mousedown touchstart', event => {
            if (this.tool.bar) {
                this.setEditing(event);
            }
        });
    }

    setEditing(event) {
        const { leftThumb, rightThumb } = this.player.config.classNames.trim;
        const { type, target } = event;

        if (type === 'mouseup' || type === 'touchend') {
            this.tool.editing = null;
            triggerEvent.call(this.player, this.getTrimRange(), 'trimchange');
        } else if ((type === 'mousedown' || type === 'touchstart') && target.classList.contains(leftThumb)) {
            this.tool.editing = leftThumb;
        } else if ((type === 'mousedown' || type === 'touchstart') && target.classList.contains(rightThumb)) {
            this.tool.editing = rightThumb;
        }
    }

    setTrimLength(event) {
        if (!this.tool.editing) return;

        const { leftThumb, rightThumb } = this.player.config.classNames.trim;
        const { bar, editing } = this.tool;
        const clientRect = this.player.elements.progress.getBoundingClientRect();
        const xPos = event.type === 'touchmove' ? event.touches[0].pageX : event.pageX;
        // Percentage must be between 0 and 100
        const percentage = Math.max(Math.min((100 / clientRect.width) * (xPos - clientRect.left), 100), 0);

        /* Alter width of the trim region
        - If left thumb selected increase width and keep right hand side in same position
        - If right thumb selected just decrease the width */
        if (editing === leftThumb) {
            bar.style.width = `${parseFloat(bar.style.width) - (percentage - parseFloat(bar.style.left))}%`;
            bar.style.left = `${percentage}%`;
            // Update seek position to match the left thumbs position if less than the current left thumb position
        } else if (editing === rightThumb) {
            bar.style.width = `${percentage - parseFloat(bar.style.left)}%`;
        }
    }

    // On toggle of trim control, trigger event
    onChange() {
        if (!this.enabled) {
            return;
        }

        // Update toggle button
        const button = this.player.elements.buttons.trim;
        if (is.element(button)) {
            button.pressed = this.active;
        }

        // Trigger an event
        triggerEvent.call(this.player, this.media, this.active ? 'entertrim' : 'exittrim', true);
    }

    // Update UI
    update() {
        if (this.enabled) {
            this.player.debug.log(`trim enabled`);
        } else {
            this.player.debug.log('Trimming is not supported');
        }

        // Add styling hook to show button
        toggleClass(this.player.elements.container, this.player.config.classNames.trim.enabled, this.enabled);
    }

    // Enter trim tool
    enter() {
        if (!this.enabled) {
            return;
        }
        this.trimming = true;
        this.showTrimTool();
    }

    // Exit trim tool
    exit() {
        if (!this.enabled) {
            return;
        }
        this.trimming = false;
        this.hideTrimTool();
    }

    // Toggle state
    toggle() {
        if (!this.active) {
            this.enter();
        } else {
            this.exit();
        }
        this.onChange();
    }
}

export default Trim;
