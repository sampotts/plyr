// ==========================================================================
// Vimeo plugin
// ==========================================================================

import utils from './../utils';
import captions from './../captions';
import ui from './../ui';

const vimeo = {
    setup() {
        // Remove old containers
        const containers = utils.getElements.call(this, `[id^="${this.provider}-"]`);
        Array.from(containers).forEach(utils.removeElement);

        // Add embed class for responsive
        utils.toggleClass(this.elements.wrapper, this.config.classNames.embed, true);

        // Set intial ratio
        vimeo.setAspectRatio.call(this);

        // Set ID
        this.media.setAttribute('id', utils.generateId(this.provider));

        // Load the API if not already
        if (!utils.is.object(window.Vimeo)) {
            utils.loadScript(this.config.urls.vimeo.api, () => {
                vimeo.ready.call(this);
            });
        } else {
            vimeo.ready.call(this);
        }
    },

    // Set aspect ratio
    // For Vimeo we have an extra 300% height <div> to hide the standard controls and UI
    setAspectRatio(input) {
        const ratio = utils.is.string(input) ? input.split(':') : this.config.ratio.split(':');
        const padding = 100 / ratio[0] * ratio[1];
        const height = 200;
        const offset = (height - padding) / (height / 50);
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
            gesture: 'media',
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

        player.media.paused = true;
        player.media.currentTime = 0;

        // Create a faux HTML5 API using the Vimeo API
        player.media.play = () => {
            player.embed.play().then(() => {
                player.media.paused = false;
            });
        };

        player.media.pause = () => {
            player.embed.pause().then(() => {
                player.media.paused = true;
            });
        };

        player.media.stop = () => {
            player.embed.stop().then(() => {
                player.media.paused = true;
                player.currentTime = 0;
            });
        };

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
                player.embed.setPlaybackRate(input).then(() => {
                    speed = input;
                    utils.dispatchEvent.call(player, player.media, 'ratechange');
                });
            },
        });

        // Volume
        let { volume } = player.config;
        Object.defineProperty(player.media, 'volume', {
            get() {
                return volume;
            },
            set(input) {
                player.embed.setVolume(input).then(() => {
                    volume = input;
                    utils.dispatchEvent.call(player, player.media, 'volumechange');
                });
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

                player.embed.setVolume(toggle ? 0 : player.config.volume).then(() => {
                    muted = toggle;
                    utils.dispatchEvent.call(player, player.media, 'volumechange');
                });
            },
        });

        // Loop
        let { loop } = player.config;
        Object.defineProperty(player.media, 'loop', {
            get() {
                return loop;
            },
            set(input) {
                const toggle = utils.is.boolean(input) ? input : player.config.loop.active;

                player.embed.setLoop(toggle).then(() => {
                    loop = toggle;
                });
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

        // Ended
        Object.defineProperty(player.media, 'ended', {
            get() {
                return player.currentTime === player.duration;
            },
        });

        // Set aspect ratio based on video size
        Promise.all([
            player.embed.getVideoWidth(),
            player.embed.getVideoHeight(),
        ]).then(dimensions => {
            const ratio = utils.getAspectRatio(dimensions[0], dimensions[1]);
            vimeo.setAspectRatio.call(this, ratio);
        });

        // Set autopause
        player.embed.setAutopause(player.config.autopause).then(state => {
            player.config.autopause = state;
        });

        // Get title
        player.embed.getVideoTitle().then(title => {
            player.config.title = title;
            ui.setTitle.call(this);
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
            player.media.textTracks = tracks;
            captions.setup.call(player);
        });

        player.embed.on('cuechange', data => {
            let cue = null;

            if (data.cues.length) {
                cue = utils.stripHTML(data.cues[0].text);
            }

            captions.setText.call(player, cue);
        });

        player.embed.on('loaded', () => {
            if (utils.is.element(player.embed.element) && player.supported.ui) {
                const frame = player.embed.element;

                // Fix keyboard focus issues
                // https://github.com/sampotts/plyr/issues/317
                frame.setAttribute('tabindex', -1);
            }
        });

        player.embed.on('play', () => {
            // Only fire play if paused before
            if (player.media.paused) {
                utils.dispatchEvent.call(player, player.media, 'play');
            }
            player.media.paused = false;
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

            // Check all loaded
            if (parseInt(data.percent, 10) === 1) {
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

        player.embed.on('error', detail => {
            player.media.error = detail;
            utils.dispatchEvent.call(player, player.media, 'error');
        });

        // Rebuild UI
        window.setTimeout(() => ui.build.call(player), 0);
    },
};

export default vimeo;
