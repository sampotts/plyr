// ==========================================================================
// Vimeo plugin
// ==========================================================================

import utils from './../utils';
import captions from './../captions';
import controls from './../controls';
import ui from './../ui';

const vimeo = {
    setup() {
        // Remove old containers
        const containers = utils.getElements.call(this, `[id^="${this.type}-"]`);
        Array.from(containers).forEach(utils.removeElement);

        // Add embed class for responsive
        utils.toggleClass(this.elements.wrapper, this.config.classNames.embed, true);

        // Set intial ratio
        vimeo.setAspectRatio.call(this);

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

    // Set aspect ratio
    // For Vimeo we have an extra 300% height <div> to hide the standard controls and UI
    setAspectRatio(input) {
        const ratio = utils.is.string(input) ? input.split(':') : this.config.ratio.split(':');
        const padding = 100 / ratio[0] * ratio[1];
        const offset = (300 - padding) / 6;
        this.elements.wrapper.style.paddingBottom = `${padding}%`;
        this.media.style.transform = `translateY(-${offset}%)`;
    },

    // API Ready
    ready() {
        const player = this;

        // Get Vimeo params for the iframe
        const options = {
            loop: player.config.loop.active,
            autoplay: player.autoplay,
            byline: false,
            portrait: false,
            title: false,
            speed: true,
            transparent: 0,
        };
        const params = utils.buildUrlParameters(options);
        const id = utils.parseVimeoId(player.embedId);

        // Build an iframe
        const iframe = utils.createElement('iframe');
        const src = `https://player.vimeo.com/video/${id}?${params}`;
        iframe.setAttribute('src', src);
        iframe.setAttribute('allowfullscreen', '');
        player.media.appendChild(iframe);

        // Setup instance
        // https://github.com/vimeo/player.js
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
                    player.pause();
                }
            },
        });

        // Playback speed
        let speed = player.config.speed.selected;
        Object.defineProperty(player.media, 'playbackRate', {
            get() {
                return speed;
            },
            set(input) {
                speed = input;
                player.embed.setPlaybackRate(input);
                utils.dispatchEvent.call(player, player.media, 'ratechange');
            },
        });

        // Volume
        let { volume } = player.config;
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

        // Muted
        let { muted } = player.config;
        Object.defineProperty(player.media, 'muted', {
            get() {
                return muted;
            },
            set(input) {
                const toggle = utils.is.boolean(input) ? input : false;
                muted = toggle;
                player.embed.setVolume(toggle ? 0 : player.config.volume);
                utils.dispatchEvent.call(player, player.media, 'volumechange');
            },
        });

        // Loop
        let { loop } = player.config;
        Object.defineProperty(player.media, 'loop', {
            get() {
                return loop;
            },
            set(input) {
                loop = utils.is.boolean(input) ? input : player.config.loop.active;
                player.embed.setLoop(loop);
            },
        });

        // Source
        let currentSrc;
        player.embed.getVideoUrl().then(value => {
            currentSrc = value;
        });
        Object.defineProperty(player.media, 'currentSrc', {
            get() {
                return currentSrc;
            },
        });

        // Set aspect ratio based on video size
        Promise.all([player.embed.getVideoWidth(), player.embed.getVideoHeight()]).then(dimensions => {
            const ratio = utils.getAspectRatio(dimensions[0], dimensions[1]);
            vimeo.setAspectRatio.call(this, ratio);
        });

        // Get available speeds
        if (player.config.controls.includes('settings') && player.config.settings.includes('speed')) {
            controls.setSpeedMenu.call(player);
        }

        // Get title
        player.embed.getVideoTitle().then(title => {
            player.config.title = title;
        });

        // Get current time
        player.embed.getCurrentTime().then(value => {
            currentTime = value;
            utils.dispatchEvent.call(player, player.media, 'timeupdate');
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

        player.embed.on('timeupdate', data => {
            player.media.seeking = false;
            currentTime = data.seconds;
            utils.dispatchEvent.call(player, player.media, 'timeupdate');
        });

        player.embed.on('progress', data => {
            player.media.buffered = data.percent;
            utils.dispatchEvent.call(player, player.media, 'progress');

            if (parseInt(data.percent, 10) === 1) {
                // Trigger event
                utils.dispatchEvent.call(player, player.media, 'canplaythrough');
            }
        });

        player.embed.on('seeked', () => {
            player.media.seeking = false;
            utils.dispatchEvent.call(player, player.media, 'seeked');
            utils.dispatchEvent.call(player, player.media, 'play');
        });

        player.embed.on('ended', () => {
            player.media.paused = true;
            utils.dispatchEvent.call(player, player.media, 'ended');
        });

        // Rebuild UI
        window.setTimeout(() => ui.build.call(player), 0);
    },
};

export default vimeo;
