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
        this.defaultTrimLength = 30;
        this.startTime = 0;
        this.endTime = 0;
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

        this.listeners();
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

    get trimTime() {
        return { startTime: this.startTime, endTime: this.endTime };
    }

    // Store the trim start time in seconds
    setStartTime(percentage) {
        this.startTime = this.player.media.duration * (parseFloat(percentage) / 100);
    }

    // Store the trim end time in seconds
    setEndTime(percentage) {
        this.endTime = this.startTime + this.player.media.duration * (parseFloat(percentage) / 100);
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
        // Set the trim bar from the current seek time percentage to x number of seconds after and limit the end percentage to 100%
        const start = this.player.elements.inputs.seek.value;
        const end = Math.min(parseFloat(start) + (100 / this.player.duration) * this.defaultTrimLength, 100 - start);

        // Store the start and end video percentages in seconds
        this.setStartTime(start);
        this.setEndTime(end);

        this.tool.bar = createElement('span', {
            class: this.player.config.classNames.trim.trimTool,
        });

        this.tool.bar.style.left = `${start.toString()}%`;
        this.tool.bar.style.width = `${end.toString()}%`;
        seekElement.appendChild(this.tool.bar);

        triggerEvent.call(this.player, this.trimTime, 'trimchange');
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
            triggerEvent.call(this.player, this.trimTime, 'trimchange');
        } else if ((type === 'mousedown' || type === 'touchstart') && target.classList.contains(leftThumb)) {
            this.tool.editing = leftThumb;
        } else if ((type === 'mousedown' || type === 'touchstart') && target.classList.contains(rightThumb)) {
            this.tool.editing = rightThumb;
        }
    }

    setTrimLength(event) {
        if (!this.tool.editing) return;

        const clientRect = this.player.elements.progress.getBoundingClientRect();
        // Mouse Position
        const xPos = event.type === 'touchmove' ? event.touches[0].pageX : event.pageX;
        // Percentage must be between 0 and 100
        const percentage = Math.max(Math.min((100 / clientRect.width) * (xPos - clientRect.left), 100), 0);
        /* Alter width of the trim region
        - If left thumb selected increase width and keep right hand side in same position
        - If right thumb selected just decrease the width */
        const { leftThumb, rightThumb } = this.player.config.classNames.trim;
        const { bar, editing } = this.tool;
        if (editing === leftThumb) {
            bar.style.width = `${parseFloat(bar.style.width) - (percentage - parseFloat(bar.style.left))}%`;
            bar.style.left = `${percentage}%`;
            this.setStartTime(percentage);
            // Update seek position to match the left thumbs position if less than the current left thumb position
        } else if (editing === rightThumb) {
            const end = percentage - parseFloat(bar.style.left);
            bar.style.width = `${end}%`;
            this.setEndTime(end);
        }
    }

    listeners() {
        /* Prevent the trim tool from being added until the player is in a playable state
           If the user has pressed the trim tool before this event has fired, show the tool */
        this.player.once('canplay', () => {
            this.loaded = true;
            if (this.trimming) {
                this.createTrimTool();
            }
        });

        // Set the seektime to the start of the trim timeline, if the seektime is outside of the region.
        this.player.on('timeupdate', () => {
            if (!this.active || !this.trimming || !this.player.playing || this.tool.editing) {
                return;
            }

            const { currentTime } = this.player;
            if (currentTime < this.startTime || currentTime >= this.endTime) {
                this.player.currentTime = this.startTime;

                if (currentTime >= this.endTime) {
                    this.player.pause();
                }
            }
        });
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
