// ==========================================================================
// Vimeo plugin
// ==========================================================================

import utils from './../utils';
import captions from './../captions';
import ui from './../ui';

const vimeo = {
    // Setup YouTube
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

    // Ready
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

        // Rebuild UI
        ui.build.call(player);

        player.embed.getCurrentTime().then(value => {
            player.media.currentTime = value;
            utils.dispatchEvent.call(this, this.media, 'timeupdate');
        });

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

                // Fix Vimeo controls issue
                // https://github.com/sampotts/plyr/issues/697
                // frame.src = `${frame.src}&transparent=0`;

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
            this.media.currentTime = data.seconds;
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
