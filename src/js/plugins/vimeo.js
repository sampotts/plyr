// ==========================================================================
// Vimeo plugin
// ==========================================================================

import captions from '../captions';
import controls from '../controls';
import ui from '../ui';
import { createElement, replaceElement, toggleClass } from '../utils/elements';
import { triggerEvent } from '../utils/events';
import fetch from '../utils/fetch';
import is from '../utils/is';
import loadScript from '../utils/load-script';
import { extend } from '../utils/objects';
import { format, stripHTML } from '../utils/strings';
import { setAspectRatio } from '../utils/style';
import { buildUrlParams } from '../utils/urls';

// Parse Vimeo ID from URL
function parseId(url) {
    if (is.empty(url)) {
        return null;
    }

    if (is.number(Number(url))) {
        return url;
    }

    const regex = /^.*(vimeo.com\/|video\/)(\d+).*/;
    return url.match(regex) ? RegExp.$2 : url;
}

// Set playback state and trigger change (only on actual change)
function assurePlaybackState(play) {
    if (play && !this.embed.hasPlayed) {
        this.embed.hasPlayed = true;
    }
    if (this.media.paused === play) {
        this.media.paused = !play;
        triggerEvent.call(this, this.media, play ? 'play' : 'pause');
    }
}

const vimeo = {
    setup() {
        // Add embed class for responsive
        toggleClass(this.elements.wrapper, this.config.classNames.embed, true);

        // Set intial ratio
        setAspectRatio.call(this);

        // Load the SDK if not already
        if (!is.object(window.Vimeo)) {
            loadScript(this.config.urls.vimeo.sdk)
                .then(() => {
                    vimeo.ready.call(this);
                })
                .catch(error => {
                    this.debug.warn('Vimeo SDK (player.js) failed to load', error);
                });
        } else {
            vimeo.ready.call(this);
        }
    },

    // API Ready
    ready() {
        const player = this;
        const config = player.config.vimeo;

        // Get Vimeo params for the iframe
        const params = buildUrlParams(
            extend(
                {},
                {
                    loop: player.config.loop.active,
                    autoplay: player.autoplay,
                    muted: player.muted,
                    gesture: 'media',
                    playsinline: !this.config.fullscreen.iosNative,
                },
                config,
            ),
        );

        // Get the source URL or ID
        let source = player.media.getAttribute('src');

        // Get from <div> if needed
        if (is.empty(source)) {
            source = player.media.getAttribute(player.config.attributes.embed.id);
        }

        const id = parseId(source);
        // Build an iframe
        const iframe = createElement('iframe');
        const src = format(player.config.urls.vimeo.iframe, id, params);
        iframe.setAttribute('src', src);
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allowtransparency', '');
        iframe.setAttribute('allow', 'autoplay');

        // Get poster, if already set
        const { poster } = player;
        // Inject the package
        const wrapper = createElement('div', { poster, class: player.config.classNames.embedContainer });
        wrapper.appendChild(iframe);
        player.media = replaceElement(wrapper, player.media);

        // Get poster image
        fetch(format(player.config.urls.vimeo.api, id), 'json').then(response => {
            if (is.empty(response)) {
                return;
            }

            // Get the URL for thumbnail
            const url = new URL(response[0].thumbnail_large);

            // Get original image
            url.pathname = `${url.pathname.split('_')[0]}.jpg`;

            // Set and show poster
            ui.setPoster.call(player, url.href).catch(() => {});
        });

        // Setup instance
        // https://github.com/vimeo/player.js
        player.embed = new window.Vimeo.Player(iframe, {
            autopause: player.config.autopause,
            muted: player.muted,
        });

        player.media.paused = true;
        player.media.currentTime = 0;

        // Disable native text track rendering
        if (player.supported.ui) {
            player.embed.disableTextTrack();
        }

        // Create a faux HTML5 API using the Vimeo API
        player.media.play = () => {
            assurePlaybackState.call(player, true);
            return player.embed.play();
        };

        player.media.pause = () => {
            assurePlaybackState.call(player, false);
            return player.embed.pause();
        };

        player.media.stop = () => {
            player.pause();
            player.currentTime = 0;
        };

        // Seeking
        let { currentTime } = player.media;
        Object.defineProperty(player.media, 'currentTime', {
            get() {
                return currentTime;
            },
            set(time) {
                // Vimeo will automatically play on seek if the video hasn't been played before

                // Get current paused state and volume etc
                const { embed, media, paused, volume } = player;
                const restorePause = paused && !embed.hasPlayed;

                // Set seeking state and trigger event
                media.seeking = true;
                triggerEvent.call(player, media, 'seeking');

                // If paused, mute until seek is complete
                Promise.resolve(restorePause && embed.setVolume(0))
                    // Seek
                    .then(() => embed.setCurrentTime(time))
                    // Restore paused
                    .then(() => restorePause && embed.pause())
                    // Restore volume
                    .then(() => restorePause && embed.setVolume(volume))
                    .catch(() => {
                        // Do nothing
                    });
            },
        });

        // Playback speed
        let speed = player.config.speed.selected;
        Object.defineProperty(player.media, 'playbackRate', {
            get() {
                return speed;
            },
            set(input) {
                player.embed
                    .setPlaybackRate(input)
                    .then(() => {
                        speed = input;
                        triggerEvent.call(player, player.media, 'ratechange');
                    })
                    .catch(error => {
                        // Hide menu item (and menu if empty)
                        if (error.name === 'Error') {
                            controls.setSpeedMenu.call(player, []);
                        }
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
                    triggerEvent.call(player, player.media, 'volumechange');
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
                const toggle = is.boolean(input) ? input : false;

                player.embed.setVolume(toggle ? 0 : player.config.volume).then(() => {
                    muted = toggle;
                    triggerEvent.call(player, player.media, 'volumechange');
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
                const toggle = is.boolean(input) ? input : player.config.loop.active;

                player.embed.setLoop(toggle).then(() => {
                    loop = toggle;
                });
            },
        });

        // Source
        let currentSrc;
        player.embed
            .getVideoUrl()
            .then(value => {
                currentSrc = value;
                controls.setDownloadUrl.call(player);
            })
            .catch(error => {
                this.debug.warn(error);
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
        Promise.all([player.embed.getVideoWidth(), player.embed.getVideoHeight()]).then(dimensions => {
            const [width, height] = dimensions;
            player.embed.ratio = [width, height];
            setAspectRatio.call(this);
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
            triggerEvent.call(player, player.media, 'timeupdate');
        });

        // Get duration
        player.embed.getDuration().then(value => {
            player.media.duration = value;
            triggerEvent.call(player, player.media, 'durationchange');
        });

        // Get captions
        player.embed.getTextTracks().then(tracks => {
            player.media.textTracks = tracks;
            captions.setup.call(player);
        });

        player.embed.on('cuechange', ({ cues = [] }) => {
            const strippedCues = cues.map(cue => stripHTML(cue.text));
            captions.updateCues.call(player, strippedCues);
        });

        player.embed.on('loaded', () => {
            // Assure state and events are updated on autoplay
            player.embed.getPaused().then(paused => {
                assurePlaybackState.call(player, !paused);
                if (!paused) {
                    triggerEvent.call(player, player.media, 'playing');
                }
            });

            if (is.element(player.embed.element) && player.supported.ui) {
                const frame = player.embed.element;

                // Fix keyboard focus issues
                // https://github.com/sampotts/plyr/issues/317
                frame.setAttribute('tabindex', -1);
            }
        });

        player.embed.on('play', () => {
            assurePlaybackState.call(player, true);
            triggerEvent.call(player, player.media, 'playing');
        });

        player.embed.on('pause', () => {
            assurePlaybackState.call(player, false);
        });

        player.embed.on('timeupdate', data => {
            player.media.seeking = false;
            currentTime = data.seconds;
            triggerEvent.call(player, player.media, 'timeupdate');
        });

        player.embed.on('progress', data => {
            player.media.buffered = data.percent;
            triggerEvent.call(player, player.media, 'progress');

            // Check all loaded
            if (parseInt(data.percent, 10) === 1) {
                triggerEvent.call(player, player.media, 'canplaythrough');
            }

            // Get duration as if we do it before load, it gives an incorrect value
            // https://github.com/sampotts/plyr/issues/891
            player.embed.getDuration().then(value => {
                if (value !== player.media.duration) {
                    player.media.duration = value;
                    triggerEvent.call(player, player.media, 'durationchange');
                }
            });
        });

        player.embed.on('seeked', () => {
            player.media.seeking = false;
            triggerEvent.call(player, player.media, 'seeked');
        });

        player.embed.on('ended', () => {
            player.media.paused = true;
            triggerEvent.call(player, player.media, 'ended');
        });

        player.embed.on('error', detail => {
            player.media.error = detail;
            triggerEvent.call(player, player.media, 'error');
        });

        // Rebuild UI
        setTimeout(() => ui.build.call(player), 0);
    },
};

export default vimeo;
