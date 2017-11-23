// ==========================================================================
// YouTube plugin
// ==========================================================================

import utils from './../utils';
import controls from './../controls';
import ui from './../ui';

const youtube = {
    setup() {
        const videoId = utils.parseYouTubeId(this.embedId);

        // Remove old containers
        const containers = utils.getElements.call(this, `[id^="${this.provider}-"]`);
        Array.from(containers).forEach(utils.removeElement);

        // Add embed class for responsive
        utils.toggleClass(this.elements.wrapper, this.config.classNames.embed, true);

        // Set aspect ratio
        youtube.setAspectRatio.call(this);

        // Set ID
        this.media.setAttribute('id', utils.generateId(this.provider));

        // Setup API
        if (utils.is.object(window.YT)) {
            youtube.ready.call(this, videoId);
        } else {
            // Load the API
            utils.loadScript(this.config.urls.youtube.api);

            // Setup callback for the API
            // YouTube has it's own system of course...
            window.onYouTubeReadyCallbacks = window.onYouTubeReadyCallbacks || [];

            // Add to queue
            window.onYouTubeReadyCallbacks.push(() => {
                youtube.ready.call(this, videoId);
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
    getTitle() {
        // Try via undocumented API method first
        // This method disappears now and then though...
        // https://github.com/sampotts/plyr/issues/709
        if (utils.is.function(this.embed.getVideoData)) {
            const { title } = this.embed.getVideoData();

            if (utils.is.empty(title)) {
                this.config.title = title;
                ui.setTitle.call(this);
                return;
            }
        }

        // Or via Google API
        const key = this.config.keys.google;
        const videoId = utils.parseYouTubeId(this.embedId);
        if (utils.is.string(key) && !utils.is.empty(key)) {
            const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${key}&fields=items(snippet(title))&part=snippet`;

            fetch(url)
                .then(response => (response.ok ? response.json() : null))
                .then(result => {
                    if (result !== null && utils.is.object(result)) {
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
    ready(videoId) {
        const player = this;

        // Setup instance
        // https://developers.google.com/youtube/iframe_api_reference
        player.embed = new window.YT.Player(player.media.id, {
            videoId,
            playerVars: {
                autoplay: player.config.autoplay ? 1 : 0, // Autoplay
                controls: player.supported.ui ? 0 : 1, // Only show controls if not fully supported
                rel: 0, // No related vids
                showinfo: 0, // Hide info
                iv_load_policy: 3, // Hide annotations
                modestbranding: 1, // Hide logos as much as possible (they still show one in the corner when paused)
                disablekb: 1, // Disable keyboard as we handle it
                playsinline: 1, // Allow iOS inline playback

                // Tracking for stats
                origin: window && window.location.hostname,
                widget_referrer: window && window.location.href,

                // Captions are flaky on YouTube
                cc_load_policy: this.captions.active ? 1 : 0,
                cc_lang_pref: this.config.captions.language,
            },
            events: {
                onError(event) {
                    // If we've already fired an error, don't do it again
                    // YouTube fires onError twice
                    if (utils.is.object(player.media.error)) {
                        return;
                    }

                    const detail = {
                        code: event.data,
                    };

                    // Messages copied from https://developers.google.com/youtube/iframe_api_reference#onError
                    switch (event.data) {
                        case 2:
                            detail.message =
                                'The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.';
                            break;

                        case 5:
                            detail.message =
                                'The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.';
                            break;

                        case 100:
                            detail.message =
                                'The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.';
                            break;

                        case 101:
                        case 150:
                            detail.message = 'The owner of the requested video does not allow it to be played in embedded players.';
                            break;

                        default:
                            detail.message = 'An unknown error occured';
                            break;
                    }

                    player.media.error = detail;

                    utils.dispatchEvent.call(player, player.media, 'error');
                },
                onPlaybackQualityChange(event) {
                    // Get the instance
                    const instance = event.target;

                    // Get current quality
                    player.media.quality = instance.getPlaybackQuality();

                    utils.dispatchEvent.call(player, player.media, 'qualitychange');
                },
                onPlaybackRateChange(event) {
                    // Get the instance
                    const instance = event.target;

                    // Get current speed
                    player.media.playbackRate = instance.getPlaybackRate();

                    utils.dispatchEvent.call(player, player.media, 'ratechange');
                },
                onReady(event) {
                    // Get the instance
                    const instance = event.target;

                    // Get the title
                    youtube.getTitle.call(player);

                    // Create a faux HTML5 API using the YouTube API
                    player.media.play = () => {
                        instance.playVideo();
                        player.media.paused = false;
                    };
                    player.media.pause = () => {
                        instance.pauseVideo();
                        player.media.paused = true;
                    };
                    player.media.stop = () => {
                        instance.stopVideo();
                        player.media.paused = true;
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
                            // Set seeking flag
                            player.media.seeking = true;

                            // Trigger seeking
                            utils.dispatchEvent.call(player, player.media, 'seeking');

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

                    // Quality
                    Object.defineProperty(player.media, 'quality', {
                        get() {
                            return instance.getPlaybackQuality();
                        },
                        set(input) {
                            // Trigger request event
                            utils.dispatchEvent.call(player, player.media, 'qualityrequested', false, {
                                quality: input,
                            });

                            instance.setPlaybackQuality(input);
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
                            const toggle = utils.is.boolean(input) ? input : muted;
                            muted = toggle;
                            instance[toggle ? 'mute' : 'unMute']();
                            utils.dispatchEvent.call(player, player.media, 'volumechange');
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

                    utils.dispatchEvent.call(player, player.media, 'timeupdate');
                    utils.dispatchEvent.call(player, player.media, 'durationchange');

                    // Reset timer
                    window.clearInterval(player.timers.buffering);

                    // Setup buffering
                    player.timers.buffering = window.setInterval(() => {
                        // Get loaded % from YouTube
                        player.media.buffered = instance.getVideoLoadedFraction();

                        // Trigger progress only when we actually buffer something
                        if (player.media.lastBuffered === null || player.media.lastBuffered < player.media.buffered) {
                            utils.dispatchEvent.call(player, player.media, 'progress');
                        }

                        // Set last buffer point
                        player.media.lastBuffered = player.media.buffered;

                        // Bail if we're at 100%
                        if (player.media.buffered === 1) {
                            window.clearInterval(player.timers.buffering);

                            // Trigger event
                            utils.dispatchEvent.call(player, player.media, 'canplaythrough');
                        }
                    }, 200);

                    // Rebuild UI
                    window.setTimeout(() => ui.build.call(player), 50);
                },
                onStateChange(event) {
                    // Get the instance
                    const instance = event.target;

                    // Reset timer
                    window.clearInterval(player.timers.playing);

                    // Handle events
                    // -1   Unstarted
                    // 0    Ended
                    // 1    Playing
                    // 2    Paused
                    // 3    Buffering
                    // 5    Video cued
                    switch (event.data) {
                        case 0:
                            player.media.paused = true;

                            // YouTube doesn't support loop for a single video, so mimick it.
                            if (player.media.loop) {
                                // YouTube needs a call to `stopVideo` before playing again
                                instance.stopVideo();
                                instance.playVideo();
                            } else {
                                utils.dispatchEvent.call(player, player.media, 'ended');
                            }

                            break;

                        case 1:
                            // If we were seeking, fire seeked event
                            if (player.media.seeking) {
                                utils.dispatchEvent.call(player, player.media, 'seeked');
                            }
                            player.media.seeking = false;

                            // Only fire play if paused before
                            if (player.media.paused) {
                                utils.dispatchEvent.call(player, player.media, 'play');
                            }
                            player.media.paused = false;

                            utils.dispatchEvent.call(player, player.media, 'playing');

                            // Poll to get playback progress
                            player.timers.playing = window.setInterval(() => {
                                utils.dispatchEvent.call(player, player.media, 'timeupdate');
                            }, 50);

                            // Check duration again due to YouTube bug
                            // https://github.com/sampotts/plyr/issues/374
                            // https://code.google.com/p/gdata-issues/issues/detail?id=8690
                            if (player.media.duration !== instance.getDuration()) {
                                player.media.duration = instance.getDuration();
                                utils.dispatchEvent.call(player, player.media, 'durationchange');
                            }

                            // Get quality
                            controls.setQualityMenu.call(player, instance.getAvailableQualityLevels());

                            break;

                        case 2:
                            player.media.paused = true;

                            utils.dispatchEvent.call(player, player.media, 'pause');

                            break;

                        default:
                            break;
                    }

                    utils.dispatchEvent.call(player, player.elements.container, 'statechange', false, {
                        code: event.data,
                    });
                },
            },
        });
    },
};

export default youtube;
