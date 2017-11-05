// ==========================================================================
// Vimeo plugin
// ==========================================================================

import utils from './../utils';
import captions from './../captions';
import ui from './../ui';

const vimeo = {
    setup() {
        // Remove old containers
        const containers = utils.getElements.call(this, `[id^="${this.type}-"]`);
        Array.from(containers).forEach(utils.removeElement);

        // Add embed class for responsive
        utils.toggleClass(this.elements.wrapper, this.config.classNames.embed, true);

        // Set ID
        this.media.setAttribute('id', utils.generateId(this.type));

        // Load the API if not already
        if (!utils.is.object(window.Vimeo)) {
            utils.loadScript(this.config.urls.vimeo.api);
            // Wait for load
            const vimeoTimer = window.setInterval(() => {
                if (utils.is.object(window.Vimeo)) {
                    window.clearInterval(vimeoTimer);
                    vimeo.ready.call(this);
                }
            }, 50);
        } else {
            vimeo.ready.call(this);
        }
    },

    // API Ready
    ready() {
        const player = this;

        // Get Vimeo params for the iframe
        const options = {
            loop: this.config.loop.active,
            autoplay: this.config.autoplay,
            byline: false,
            portrait: false,
            title: false,
            transparent: 0,
        };
        const params = utils.buildUrlParameters(options);
        const id = utils.parseVimeoId(this.embedId);

        // Build an iframe
        const iframe = utils.createElement('iframe');
        const src = `https://player.vimeo.com/video/${id}?${params}`;
        iframe.setAttribute('src', src);
        iframe.setAttribute('allowfullscreen', '');
        player.media.appendChild(iframe);

        // Setup instance
        // https://github.com/vimeo/this.js
        player.embed = new window.Vimeo.Player(iframe);

        // Create a faux HTML5 API using the Vimeo API
        player.media.play = () => {
            player.embed.play();
            player.media.paused = false;
        };
        player.media.pause = () => {
            player.embed.pause();
            player.media.paused = true;
        };
        player.media.stop = () => {
            player.embed.stop();
            player.media.paused = true;
        };

        player.media.paused = true;
        player.media.currentTime = 0;

        // Seeking
        let { currentTime } = player.media;
        Object.defineProperty(player.media, 'currentTime', {
            get() {
                return currentTime;
            },
            set(time) {
                // Get current paused state
                // Vimeo will automatically play on seek
                const { paused } = player.media;

                // Set seeking flag
                player.media.seeking = true;

                // Trigger seeking
                utils.dispatchEvent.call(player, player.media, 'seeking');

                // Seek after events
                player.embed.setCurrentTime(time);

                // Restore pause state
                if (paused) {
                    this.pause();
                }
            },
        });

        // Playback speed
        // Not currently supported in Vimeo
        Object.defineProperty(player.media, 'playbackRate', {
            get() {
                return null;
            },
            set() {},
        });

        // Volume
        let { volume } = player.media;
        Object.defineProperty(player.media, 'volume', {
            get() {
                return volume;
            },
            set(input) {
                volume = input;
                player.embed.setVolume(input);
                utils.dispatchEvent.call(player, player.media, 'volumechange');
            },
        });

        // Source
        let currentSrc;

        player.embed.getVideoUrl.then(value => {
            currentSrc = value;
        });

        Object.defineProperty(player.media, 'currentSrc', {
            get() {
                return currentSrc;
            },
        });

        // Rebuild UI
        window.setTimeout(() => ui.build.call(player), 0);

        // Get title
        player.embed.getVideoTitle().then(title => {
            player.config.title = title;
        });

        // Get current time
        player.embed.getCurrentTime().then(value => {
            currentTime = value;
            utils.dispatchEvent.call(this, this.media, 'timeupdate');
        });

        // Get duration
        player.embed.getDuration().then(value => {
            player.media.duration = value;
            utils.dispatchEvent.call(player, player.media, 'durationchange');
        });

        // Get captions
        player.embed.getTextTracks().then(tracks => {
            player.captions.tracks = tracks;
            captions.setup.call(player);
        });

        player.embed.on('cuechange', data => {
            let cue = null;

            if (data.cues.length) {
                cue = utils.stripHTML(data.cues[0].text);
            }

            captions.set.call(player, cue);
        });

        player.embed.on('loaded', () => {
            if (utils.is.htmlElement(player.embed.element) && player.supported.ui) {
                const frame = player.embed.element;

                // Fix keyboard focus issues
                // https://github.com/sampotts/plyr/issues/317
                frame.setAttribute('tabindex', -1);
            }
        });

        player.embed.on('play', () => {
            player.media.paused = false;
            utils.dispatchEvent.call(player, player.media, 'play');
            utils.dispatchEvent.call(player, player.media, 'playing');
        });

        player.embed.on('pause', () => {
            player.media.paused = true;
            utils.dispatchEvent.call(player, player.media, 'pause');
        });

        this.embed.on('timeupdate', data => {
            this.media.seeking = false;
            currentTime = data.seconds;
            utils.dispatchEvent.call(this, this.media, 'timeupdate');
        });

        this.embed.on('progress', data => {
            this.media.buffered = data.percent;
            utils.dispatchEvent.call(this, this.media, 'progress');

            if (parseInt(data.percent, 10) === 1) {
                // Trigger event
                utils.dispatchEvent.call(this, this.media, 'canplaythrough');
            }
        });

        this.embed.on('seeked', () => {
            this.media.seeking = false;
            utils.dispatchEvent.call(this, this.media, 'seeked');
            utils.dispatchEvent.call(this, this.media, 'play');
        });

        this.embed.on('ended', () => {
            this.media.paused = true;
            utils.dispatchEvent.call(this, this.media, 'ended');
        });
    },
};

export default vimeo;
