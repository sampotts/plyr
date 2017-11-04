// ==========================================================================
// YouTube plugin
// ==========================================================================

import utils from './../utils';
import controls from './../controls';
import ui from './../ui';

const youtube = {
    // Setup YouTube
    setup() {
        const videoId = utils.parseYouTubeId(this.embedId);

        // Remove old containers
        const containers = utils.getElements.call(this, `[id^="${this.type}-"]`);
        Array.from(containers).forEach(utils.removeElement);

        // Add embed class for responsive
        utils.toggleClass(this.elements.wrapper, this.config.classNames.embed, true);

        // Set ID
        this.media.setAttribute('id', utils.generateId(this.type));

        // Setup API
        if (utils.is.object(window.YT)) {
            youtube.ready.call(this, videoId);
        } else {
            // Load the API
            utils.loadScript(this.config.urls.youtube.api);

            // Setup callback for the API
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

    // Handle YouTube API ready
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

                // Captions is flaky on YouTube
                // cc_load_policy: (this.captions.active ? 1 : 0),
                // cc_lang_pref: 'en',
            },
            events: {
                onError(event) {
                    utils.dispatchEvent.call(player, player.media, 'error', true, {
                        code: event.data,
                        embed: event.target,
                    });
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
                    player.media.muted = instance.isMuted();
                    player.media.currentTime = 0;

                    // Playback speed
                    Object.defineProperty(player.media, 'playbackRate', {
                        get() {
                            return instance.getPlaybackRate();
                        },
                        set(speed) {
                            instance.setPlaybackRate(speed);
                        },
                    });

                    // Get available speeds
                    if (player.config.controls.includes('settings') && player.config.settings.includes('speed')) {
                        controls.setSpeedMenu.call(player, instance.getAvailablePlaybackRates());
                    }

                    // Set title
                    player.config.title = instance.getVideoData().title;

                    // Set the tabindex to avoid focus entering iframe
                    if (player.supported.ui) {
                        player.media.setAttribute('tabindex', -1);
                    }

                    // Rebuild UI
                    ui.build.call(player);

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
                            // YouTube doesn't support loop for a single video, so mimick it.
                            if (player.config.loop.active) {
                                // YouTube needs a call to `stopVideo` before playing again
                                instance.stopVideo();
                                instance.playVideo();

                                break;
                            }

                            player.media.paused = true;

                            utils.dispatchEvent.call(player, player.media, 'ended');

                            break;

                        case 1:
                            player.media.paused = false;

                            // If we were seeking, fire seeked event
                            if (player.media.seeking) {
                                utils.dispatchEvent.call(player, player.media, 'seeked');
                            }

                            player.media.seeking = false;

                            utils.dispatchEvent.call(player, player.media, 'play');
                            utils.dispatchEvent.call(player, player.media, 'playing');

                            // Poll to get playback progress
                            player.timers.playing = window.setInterval(() => {
                                player.media.currentTime = instance.getCurrentTime();
                                utils.dispatchEvent.call(player, player.media, 'timeupdate');
                            }, 100);

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
