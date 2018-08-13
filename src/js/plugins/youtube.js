// ==========================================================================
// YouTube plugin
// ==========================================================================

import ui from '../ui';
import { createElement, replaceElement, toggleClass } from '../utils/elements';
import { triggerEvent } from '../utils/events';
import fetch from '../utils/fetch';
import is from '../utils/is';
import loadImage from '../utils/loadImage';
import loadScript from '../utils/loadScript';
import { format, generateId } from '../utils/strings';

// Parse YouTube ID from URL
function parseId(url) {
    if (is.empty(url)) {
        return null;
    }

    const regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
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

const youtube = {
    setup() {
        // Add embed class for responsive
        toggleClass(this.elements.wrapper, this.config.classNames.embed, true);

        // Set aspect ratio
        youtube.setAspectRatio.call(this);

        // Setup API
        if (is.object(window.YT) && is.function(window.YT.Player)) {
            youtube.ready.call(this);
        } else {
            // Load the API
            loadScript(this.config.urls.youtube.sdk).catch(error => {
                this.debug.warn('YouTube API failed to load', error);
            });

            // Setup callback for the API
            // YouTube has it's own system of course...
            window.onYouTubeReadyCallbacks = window.onYouTubeReadyCallbacks || [];

            // Add to queue
            window.onYouTubeReadyCallbacks.push(() => {
                youtube.ready.call(this);
            });

            // Set callback to process queue
            window.onYouTubeIframeAPIReady = () => {
                window.onYouTubeReadyCallbacks.forEach(callback => {
                    callback();
                });
            };
        }
    },

    // Get the media title
    getTitle(videoId) {
        // Try via undocumented API method first
        // This method disappears now and then though...
        // https://github.com/sampotts/plyr/issues/709
        if (is.function(this.embed.getVideoData)) {
            const { title } = this.embed.getVideoData();

            if (is.empty(title)) {
                this.config.title = title;
                ui.setTitle.call(this);
                return;
            }
        }

        // Or via Google API
        const key = this.config.keys.google;
        if (is.string(key) && !is.empty(key)) {
            const url = format(this.config.urls.youtube.api, videoId, key);

            fetch(url)
                .then(result => {
                    if (is.object(result)) {
                        this.config.title = result.items[0].snippet.title;
                        ui.setTitle.call(this);
                    }
                })
                .catch(() => {});
        }
    },

    // Set aspect ratio
    setAspectRatio() {
        const ratio = this.config.ratio.split(':');
        this.elements.wrapper.style.paddingBottom = `${100 / ratio[0] * ratio[1]}%`;
    },

    // API ready
    ready() {
        const player = this;

        // Ignore already setup (race condition)
        const currentId = player.media.getAttribute('id');
        if (!is.empty(currentId) && currentId.startsWith('youtube-')) {
            return;
        }

        // Get the source URL or ID
        let source = player.media.getAttribute('src');

        // Get from <div> if needed
        if (is.empty(source)) {
            source = player.media.getAttribute(this.config.attributes.embed.id);
        }

        // Replace the <iframe> with a <div> due to YouTube API issues
        const videoId = parseId(source);
        const id = generateId(player.provider);

        // Get poster, if already set
        const { poster } = player;

        // Replace media element
        const container = createElement('div', { id, poster });
        player.media = replaceElement(container, player.media);

        // Id to poster wrapper
        const posterSrc = format => `https://img.youtube.com/vi/${videoId}/${format}default.jpg`;

        // Check thumbnail images in order of quality, but reject fallback thumbnails (120px wide)
        loadImage(posterSrc('maxres'), 121) // Higest quality and unpadded
            .catch(() => loadImage(posterSrc('sd'), 121)) // 480p padded 4:3
            .catch(() => loadImage(posterSrc('hq'))) // 360p padded 4:3. Always exists
            .then(image => ui.setPoster.call(player, image.src))
            .then(posterSrc => {
                // If the image is padded, use background-size "cover" instead (like youtube does too with their posters)
                if (!posterSrc.includes('maxres')) {
                    player.elements.poster.style.backgroundSize = 'cover';
                }
            })
            .catch(() => {});

        // Setup instance
        // https://developers.google.com/youtube/iframe_api_reference
        player.embed = new window.YT.Player(id, {
            videoId,
            playerVars: {
                autoplay: player.config.autoplay ? 1 : 0, // Autoplay
                hl: player.config.hl, // iframe interface language
                controls: player.supported.ui ? 0 : 1, // Only show controls if not fully supported
                rel: 0, // No related vids
                showinfo: 0, // Hide info
                iv_load_policy: 3, // Hide annotations
                modestbranding: 1, // Hide logos as much as possible (they still show one in the corner when paused)
                disablekb: 1, // Disable keyboard as we handle it
                playsinline: 1, // Allow iOS inline playback

                // Tracking for stats
                // origin: window ? `${window.location.protocol}//${window.location.host}` : null,
                widget_referrer: window ? window.location.href : null,

                // Captions are flaky on YouTube
                cc_load_policy: player.captions.active ? 1 : 0,
                cc_lang_pref: player.config.captions.language,
            },
            events: {
                onError(event) {
                    // YouTube may fire onError twice, so only handle it once
                    if (!player.media.error) {
                        const code = event.data;
                        // Messages copied from https://developers.google.com/youtube/iframe_api_reference#onError
                        const message =
                            {
                                2: 'The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.',
                                5: 'The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.',
                                100: 'The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.',
                                101: 'The owner of the requested video does not allow it to be played in embedded players.',
                                150: 'The owner of the requested video does not allow it to be played in embedded players.',
                            }[code] || 'An unknown error occured';

                        player.media.error = { code, message };

                        triggerEvent.call(player, player.media, 'error');
                    }
                },
                onPlaybackRateChange(event) {
                    // Get the instance
                    const instance = event.target;

                    // Get current speed
                    player.media.playbackRate = instance.getPlaybackRate();

                    triggerEvent.call(player, player.media, 'ratechange');
                },
                onReady(event) {
                    // Bail if onReady has already been called. See issue #1108
                    if (is.function(player.media.play)) {
                        return;
                    }
                    // Get the instance
                    const instance = event.target;

                    // Get the title
                    youtube.getTitle.call(player, videoId);

                    // Create a faux HTML5 API using the YouTube API
                    player.media.play = () => {
                        assurePlaybackState.call(player, true);
                        instance.playVideo();
                    };

                    player.media.pause = () => {
                        assurePlaybackState.call(player, false);
                        instance.pauseVideo();
                    };

                    player.media.stop = () => {
                        instance.stopVideo();
                    };

                    player.media.duration = instance.getDuration();
                    player.media.paused = true;

                    // Seeking
                    player.media.currentTime = 0;
                    Object.defineProperty(player.media, 'currentTime', {
                        get() {
                            return Number(instance.getCurrentTime());
                        },
                        set(time) {
                            // If paused and never played, mute audio preventively (YouTube starts playing on seek if the video hasn't been played yet).
                            if (player.paused && !player.embed.hasPlayed) {
                                player.embed.mute();
                            }

                            // Set seeking state and trigger event
                            player.media.seeking = true;
                            triggerEvent.call(player, player.media, 'seeking');

                            // Seek after events sent
                            instance.seekTo(time);
                        },
                    });

                    // Playback speed
                    Object.defineProperty(player.media, 'playbackRate', {
                        get() {
                            return instance.getPlaybackRate();
                        },
                        set(input) {
                            instance.setPlaybackRate(input);
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
                            instance.setVolume(volume * 100);
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
                            instance[toggle ? 'mute' : 'unMute']();
                            triggerEvent.call(player, player.media, 'volumechange');
                        },
                    });

                    // Source
                    Object.defineProperty(player.media, 'currentSrc', {
                        get() {
                            return instance.getVideoUrl();
                        },
                    });

                    // Ended
                    Object.defineProperty(player.media, 'ended', {
                        get() {
                            return player.currentTime === player.duration;
                        },
                    });

                    // Get available speeds
                    player.options.speed = instance.getAvailablePlaybackRates();

                    // Set the tabindex to avoid focus entering iframe
                    if (player.supported.ui) {
                        player.media.setAttribute('tabindex', -1);
                    }

                    triggerEvent.call(player, player.media, 'timeupdate');
                    triggerEvent.call(player, player.media, 'durationchange');

                    // Reset timer
                    clearInterval(player.timers.buffering);

                    // Setup buffering
                    player.timers.buffering = setInterval(() => {
                        // Get loaded % from YouTube
                        player.media.buffered = instance.getVideoLoadedFraction();

                        // Trigger progress only when we actually buffer something
                        if (player.media.lastBuffered === null || player.media.lastBuffered < player.media.buffered) {
                            triggerEvent.call(player, player.media, 'progress');
                        }

                        // Set last buffer point
                        player.media.lastBuffered = player.media.buffered;

                        // Bail if we're at 100%
                        if (player.media.buffered === 1) {
                            clearInterval(player.timers.buffering);

                            // Trigger event
                            triggerEvent.call(player, player.media, 'canplaythrough');
                        }
                    }, 200);

                    // Rebuild UI
                    setTimeout(() => ui.build.call(player), 50);
                },
                onStateChange(event) {
                    // Get the instance
                    const instance = event.target;

                    // Reset timer
                    clearInterval(player.timers.playing);

                    const seeked = player.media.seeking && [1, 2].includes(event.data);

                    if (seeked) {
                        // Unset seeking and fire seeked event
                        player.media.seeking = false;
                        triggerEvent.call(player, player.media, 'seeked');
                    }

                    // Handle events
                    // -1   Unstarted
                    // 0    Ended
                    // 1    Playing
                    // 2    Paused
                    // 3    Buffering
                    // 5    Video cued
                    switch (event.data) {
                        case -1:
                            // Update scrubber
                            triggerEvent.call(player, player.media, 'timeupdate');

                            // Get loaded % from YouTube
                            player.media.buffered = instance.getVideoLoadedFraction();
                            triggerEvent.call(player, player.media, 'progress');

                            break;

                        case 0:
                            assurePlaybackState.call(player, false);

                            // YouTube doesn't support loop for a single video, so mimick it.
                            if (player.media.loop) {
                                // YouTube needs a call to `stopVideo` before playing again
                                instance.stopVideo();
                                instance.playVideo();
                            } else {
                                triggerEvent.call(player, player.media, 'ended');
                            }

                            break;

                        case 1:
                            // Restore paused state (YouTube starts playing on seek if the video hasn't been played yet)
                            if (player.media.paused && !player.embed.hasPlayed) {
                                player.media.pause();
                            } else {
                                assurePlaybackState.call(player, true);

                                triggerEvent.call(player, player.media, 'playing');

                                // Poll to get playback progress
                                player.timers.playing = setInterval(() => {
                                    triggerEvent.call(player, player.media, 'timeupdate');
                                }, 50);

                                // Check duration again due to YouTube bug
                                // https://github.com/sampotts/plyr/issues/374
                                // https://code.google.com/p/gdata-issues/issues/detail?id=8690
                                if (player.media.duration !== instance.getDuration()) {
                                    player.media.duration = instance.getDuration();
                                    triggerEvent.call(player, player.media, 'durationchange');
                                }
                            }

                            break;

                        case 2:
                            // Restore audio (YouTube starts playing on seek if the video hasn't been played yet)
                            if (!player.muted) {
                                player.embed.unMute();
                            }
                            assurePlaybackState.call(player, false);

                            break;

                        default:
                            break;
                    }

                    triggerEvent.call(player, player.elements.container, 'statechange', false, {
                        code: event.data,
                    });
                },
            },
        });
    },
};

export default youtube;
