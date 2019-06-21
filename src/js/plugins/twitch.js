// ==========================================================================
// Twitch plugin
// ==========================================================================
import controls from '../controls';
import ui from '../ui';
import { createElement, replaceElement, toggleClass } from '../utils/elements';
import { triggerEvent } from '../utils/events';
import is from '../utils/is';
import loadScript from '../utils/load-script';
import { generateId } from '../utils/strings';
import { setAspectRatio } from '../utils/style';

const twitch = {
    setup() {
        // Add embed class for responsive
        toggleClass(this.elements.wrapper, this.config.classNames.embed, true);

        // Set aspect ratio
        setAspectRatio.call(this);

        // Setup API
        if (is.object(window.Twitch) && is.function(window.Twitch.Player)) {
            twitch.ready.call(this);
        } else {
            // Load the API
            loadScript(this.config.urls.twitch.api).catch(error => {
                this.debug.warn('Twitch API failed to load', error);
            });
            // Load the API
            loadScript(this.config.urls.twitch.api);
            const interval = window.setInterval(() => {
                if (window.Twitch) {
                    window.clearInterval(interval);
                    twitch.ready.call(this);
                }
            }, 100);
        }
    },

    // API ready
    ready() {
        const player = this;
        // Get the source URL or ID
        let source = player.media.getAttribute('src');

        // Get from <div> if needed
        if (is.empty(source)) {
            source = player.media.getAttribute(this.config.attributes.embed.id);
        }

        const opts = {
            autoplay: player.config.autoplay,
            muted: player.config.muted,
        };

        // Parse whether video, channel or collection
        // then assign it to opts accordingly
        const videoId = twitch.parseTwitchId(source);
        opts[videoId.type] = videoId.src;

        const id = generateId(player.provider);
        const { poster } = player;
        // This was taken from youtube.js
        const container = createElement('div', { id, poster, class: player.config.classNames.embedContainer });
        player.media = replaceElement(container, player.media);

        player.embed = new window.Twitch.Player(id, opts);

        // Get the instance
        const instance = player.embed;
        instance.plyrProps = {
            videoId,
        };

        instance.addEventListener(window.Twitch.Player.READY, () => {
            // TODO: Get the title

            // Create a faux HTML5 API using the YouTube API
            player.media.play = () => {
                instance.play();
            };

            player.media.pause = () => {
                instance.pause();
            };

            player.media.stop = () => {
                player.pause();
                player.currentTime = 0;
            };

            // XXX: instance.getDuration() is 0 for some reason
            // Despite the API reporting that it's ready to be used
            // Live streams thankfully respond with a duration of Infinity
            // Therefore, we should be OK using the condition of !== 0 && !isNan()
            player.media.duration = 0;
            const durationInterval = setInterval(() => {
                const duration = instance.getDuration();
                if (duration !== 0 && is.number(duration)) {
                    if (instance.plyrProps.type !== 'channel' && duration === Infinity) {
                        // Only channels are allowed to have an infinite duration
                        return;
                    }
                    clearInterval(durationInterval);
                    player.media.duration = duration;
                    player.media.paused = true;
                    triggerEvent.call(player, player.media, 'durationchange');
                }
            }, 100);

            // Seeking
            player.media.currentTime = 0;
            Object.defineProperty(player.media, 'currentTime', {
                get() {
                    return Number(instance.getCurrentTime());
                },
                set(time) {
                    // Vimeo will automatically play on seek
                    const { paused } = player.media;

                    // Set seeking flag
                    player.media.seeking = true;

                    // Trigger seeking
                    triggerEvent.call(player, player.media, 'seeking');

                    // Seek after events sent
                    instance.seek(time);

                    // Restore pause state
                    if (paused) {
                        player.pause();
                    }
                },
            });

            // Playback speed
            // Twitch does not allow changing playbackRate
            Object.defineProperty(player.media, 'playbackRate', {
                get() {
                    return 1.0;
                },
                set() {
                    // XXX: Fail silently?
                },
            });

            // Quality

            // instance.getQualities is of the format
            // [
            //  {
            //    "name": "720p60",
            //    "group": "720p60",
            //    "codecs": "avc1.4D401F,mp4a.40.2",
            //    "bitrate": 3074863,
            //    "width": 1280,
            //    "height": 720,
            //    "framerate": 0,
            //    "isDefault": false,
            //    "bandwidth": 3074863
            //  },
            //  ...
            // ]
            // TODO: Should we calculate every time?
            Object.defineProperty(player.media, 'quality', {
                get() {
                    const qualities = instance.getQualities();
                    // instance.getQuality() always returns 'group'
                    const entry = qualities.filter(v => v.group === instance.getQuality())[0];

                    if (entry) {
                        return entry.height;
                    }
                    return undefined;
                },
                set(input) {
                    const qualities = instance.getQualities();
                    const quality = input;
                    // Find the entry whose 'height' equals quality
                    const entry = qualities.filter(v => v.height === quality)[0] || qualities[0];
                    instance.setQuality(entry.group);
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
                    instance.setVolume(volume);
                    triggerEvent.call(player, player.media, 'volumechange');
                },
            });

            // Muted
            let { muted } = player.config;
            Object.defineProperty(player.media, 'muted', {
                get() {
                    return muted;
                },
                set(input) {
                    const toggle = is.boolean(input) ? input : muted;
                    muted = toggle;
                    instance.setMuted(muted);
                    triggerEvent.call(player, player.media, 'volumechange');
                },
            });

            let { currentSrc } = player.media;
            currentSrc = source;
            // Source
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

            // Twitch recommended is 4:3
            player.embed.ratio = [16, 9];
            setAspectRatio.call(this);

            // Get available speeds
            player.options.speed = [];

            // Set the tabindex to avoid focus entering iframe
            if (player.supported.ui) {
                player.media.setAttribute('tabindex', -1);
            }

            triggerEvent.call(player, player.media, 'timeupdate');
            triggerEvent.call(player, player.media, 'durationchange');

            // Rebuild UI
            setTimeout(() => ui.build.call(player), 50);

            instance.addEventListener(window.Twitch.Player.ENDED, () => {
                if(player.config.loop.active) {
                    instance.seek(0);
                    instance.play();
                    return;
                }
                player.media.paused = true;
                triggerEvent.call(player, player.media, 'ended');
            });

            instance.addEventListener(window.Twitch.Player.PLAY, () => {
                player.media.paused = false;
                player.media.seeking = false;

                triggerEvent.call(player, player.media, 'play');
                triggerEvent.call(player, player.media, 'playing');

                // Poll to get playback progress
                player.timers.playing = window.setInterval(() => {
                    triggerEvent.call(player, player.media, 'timeupdate');
                }, 50);

                // Get quality
                controls.setQualityMenu.call(player, instance.getQualities().map(v => v.height));
            });

            instance.addEventListener(window.Twitch.Player.PAUSE, () => {
                player.media.paused = true;
                triggerEvent.call(player, player.media, 'pause');
            });
        });
    },
    parseTwitchId(source) {
        // By default, we treat things as videos
        // If it contains a prefix of 'channel:', 'video:', 'collection:'
        // then it's treated accordingly
        const colonIndex = source.indexOf(':');
        const hasPrefix =  colonIndex !== -1;
        if (hasPrefix) {
            const idType = source.substr(0, colonIndex);
            const id = source.substr(colonIndex + 1);
            return {
                type: idType,
                src: id,
            };
        }
        return {
            type: 'video',
            src: source,
        };
    },
};

export default twitch;
