// ==========================================================================
// Advertisement plugin using Google IMA HTML5 SDK
// Create an account with our ad partner, vi here:
// https://www.vi.ai/publisher-video-monetization/
// ==========================================================================

/* global google */

import i18n from '../i18n';
import { createElement } from '../utils/elements';
import { triggerEvent } from '../utils/events';
import is from '../utils/is';
import loadScript from '../utils/loadScript';
import { formatTime } from '../utils/time';
import { buildUrlParams } from '../utils/urls';

class Ads {
    /**
     * Ads constructor.
     * @param {object} player
     * @return {Ads}
     */
    constructor(player) {
        this.player = player;
        this.publisherId = player.config.ads.publisherId;
        this.playing = false;
        this.initialized = false;
        this.elements = {
            container: null,
            displayContainer: null,
        };
        this.manager = null;
        this.loader = null;
        this.cuePoints = null;
        this.events = {};
        this.safetyTimer = null;
        this.countdownTimer = null;

        // Setup a promise to resolve when the IMA manager is ready
        this.managerPromise = new Promise((resolve, reject) => {
            // The ad is loaded and ready
            this.on('loaded', resolve);

            // Ads failed
            this.on('error', reject);
        });

        this.load();
    }

    get enabled() {
        return (
            this.player.isHTML5 && this.player.isVideo && this.player.config.ads.enabled && !is.empty(this.publisherId)
        );
    }

    /**
     * Load the IMA SDK
     */
    load() {
        if (this.enabled) {
            // Check if the Google IMA3 SDK is loaded or load it ourselves
            if (!is.object(window.google) || !is.object(window.google.ima)) {
                loadScript(this.player.config.urls.googleIMA.sdk)
                    .then(() => {
                        this.ready();
                    })
                    .catch(() => {
                        // Script failed to load or is blocked
                        this.trigger('error', new Error('Google IMA SDK failed to load'));
                    });
            } else {
                this.ready();
            }
        }
    }

    /**
     * Get the ads instance ready
     */
    ready() {
        // Start ticking our safety timer. If the whole advertisement
        // thing doesn't resolve within our set time; we bail
        this.startSafetyTimer(12000, 'ready()');

        // Clear the safety timer
        this.managerPromise.then(() => {
            this.clearSafetyTimer('onAdsManagerLoaded()');
        });

        // Set listeners on the Plyr instance
        this.listeners();

        // Setup the IMA SDK
        this.setupIMA();
    }

    // Build the default tag URL
    get tagUrl() {
        const params = {
            AV_PUBLISHERID: '58c25bb0073ef448b1087ad6',
            AV_CHANNELID: '5a0458dc28a06145e4519d21',
            AV_URL: window.location.hostname,
            cb: Date.now(),
            AV_WIDTH: 640,
            AV_HEIGHT: 480,
            AV_CDIM2: this.publisherId,
        };

        const base = 'https://go.aniview.com/api/adserver6/vast/';

        return `${base}?${buildUrlParams(params)}`;
    }

    /**
     * In order for the SDK to display ads for our video, we need to tell it where to put them,
     * so here we define our ad container. This div is set up to render on top of the video player.
     * Using the code below, we tell the SDK to render ads within that div. We also provide a
     * handle to the content video player - the SDK will poll the current time of our player to
     * properly place mid-rolls. After we create the ad display container, we initialize it. On
     * mobile devices, this initialization is done as the result of a user action.
     */
    setupIMA() {
        // Create the container for our advertisements
        this.elements.container = createElement('div', {
            class: this.player.config.classNames.ads,
        });
        this.player.elements.container.appendChild(this.elements.container);

        // So we can run VPAID2
        google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED);

        // Set language
        google.ima.settings.setLocale(this.player.config.ads.language);

        // We assume the adContainer is the video container of the plyr element
        // that will house the ads
        this.elements.displayContainer = new google.ima.AdDisplayContainer(this.elements.container);

        // Request video ads to be pre-loaded
        this.requestAds();
    }

    /**
     * Request advertisements
     */
    requestAds() {
        const { container } = this.player.elements;

        try {
            // Create ads loader
            this.loader = new google.ima.AdsLoader(this.elements.displayContainer);

            // Listen and respond to ads loaded and error events
            this.loader.addEventListener(
                google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
                event => this.onAdsManagerLoaded(event),
                false,
            );
            this.loader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, error => this.onAdError(error), false);

            // Request video ads
            const request = new google.ima.AdsRequest();
            request.adTagUrl = this.tagUrl;

            // Specify the linear and nonlinear slot sizes. This helps the SDK
            // to select the correct creative if multiple are returned
            request.linearAdSlotWidth = container.offsetWidth;
            request.linearAdSlotHeight = container.offsetHeight;
            request.nonLinearAdSlotWidth = container.offsetWidth;
            request.nonLinearAdSlotHeight = container.offsetHeight;

            // We only overlay ads as we only support video.
            request.forceNonLinearFullSlot = false;

            // Mute based on current state
            request.setAdWillPlayMuted(!this.player.muted);

            this.loader.requestAds(request);
        } catch (e) {
            this.onAdError(e);
        }
    }

    /**
     * Update the ad countdown
     * @param {boolean} start
     */
    pollCountdown(start = false) {
        if (!start) {
            clearInterval(this.countdownTimer);
            this.elements.container.removeAttribute('data-badge-text');
            return;
        }

        const update = () => {
            const time = formatTime(Math.max(this.manager.getRemainingTime(), 0));
            const label = `${i18n.get('advertisement', this.player.config)} - ${time}`;
            this.elements.container.setAttribute('data-badge-text', label);
        };

        this.countdownTimer = setInterval(update, 100);
    }

    /**
     * This method is called whenever the ads are ready inside the AdDisplayContainer
     * @param {Event} adsManagerLoadedEvent
     */
    onAdsManagerLoaded(event) {
        // Get the ads manager
        const settings = new google.ima.AdsRenderingSettings();

        // Tell the SDK to save and restore content video state on our behalf
        settings.restoreCustomPlaybackStateOnAdBreakComplete = true;
        settings.enablePreloading = true;

        // The SDK is polling currentTime on the contentPlayback. And needs a duration
        // so it can determine when to start the mid- and post-roll
        this.manager = event.getAdsManager(this.player, settings);

        // Get the cue points for any mid-rolls by filtering out the pre- and post-roll
        this.cuePoints = this.manager.getCuePoints();

        // Add advertisement cue's within the time line if available
        if (!is.empty(this.cuePoints)) {
            this.cuePoints.forEach(cuePoint => {
                if (cuePoint !== 0 && cuePoint !== -1 && cuePoint < this.player.duration) {
                    const seekElement = this.player.elements.progress;

                    if (is.element(seekElement)) {
                        const cuePercentage = 100 / this.player.duration * cuePoint;
                        const cue = createElement('span', {
                            class: this.player.config.classNames.cues,
                        });

                        cue.style.left = `${cuePercentage.toString()}%`;
                        seekElement.appendChild(cue);
                    }
                }
            });
        }

        // Get skippable state
        // TODO: Skip button
        // this.player.debug.warn(this.manager.getAdSkippableState());

        // Set volume to match player
        this.manager.setVolume(this.player.volume);

        // Add listeners to the required events
        // Advertisement error events
        this.manager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, error => this.onAdError(error));

        // Advertisement regular events
        Object.keys(google.ima.AdEvent.Type).forEach(type => {
            this.manager.addEventListener(google.ima.AdEvent.Type[type], event => this.onAdEvent(event));
        });

        // Resolve our adsManager
        this.trigger('loaded');
    }

    /**
     * This is where all the event handling takes place. Retrieve the ad from the event. Some
     * events (e.g. ALL_ADS_COMPLETED) don't have the ad object associated
     * https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdEvent.Type
     * @param {Event} event
     */
    onAdEvent(event) {
        const { container } = this.player.elements;

        // Retrieve the ad from the event. Some events (e.g. ALL_ADS_COMPLETED)
        // don't have ad object associated
        const ad = event.getAd();

        // Proxy event
        const dispatchEvent = type => {
            const event = `ads${type.replace(/_/g, '').toLowerCase()}`;
            triggerEvent.call(this.player, this.player.media, event);
        };

        switch (event.type) {
            case google.ima.AdEvent.Type.LOADED:
                // This is the first event sent for an ad - it is possible to determine whether the
                // ad is a video ad or an overlay
                this.trigger('loaded');

                // Bubble event
                dispatchEvent(event.type);

                // Start countdown
                this.pollCountdown(true);

                if (!ad.isLinear()) {
                    // Position AdDisplayContainer correctly for overlay
                    ad.width = container.offsetWidth;
                    ad.height = container.offsetHeight;
                }

                // console.info('Ad type: ' + event.getAd().getAdPodInfo().getPodIndex());
                // console.info('Ad time: ' + event.getAd().getAdPodInfo().getTimeOffset());
                break;

            case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                // All ads for the current videos are done. We can now request new advertisements
                // in case the video is re-played

                // Fire event
                dispatchEvent(event.type);

                // TODO: Example for what happens when a next video in a playlist would be loaded.
                // So here we load a new video when all ads are done.
                // Then we load new ads within a new adsManager. When the video
                // Is started - after - the ads are loaded, then we get ads.
                // You can also easily test cancelling and reloading by running
                // player.ads.cancel() and player.ads.play from the console I guess.
                // this.player.source = {
                //     type: 'video',
                //     title: 'View From A Blue Moon',
                //     sources: [{
                //         src:
                // 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.mp4', type:
                // 'video/mp4', }], poster:
                // 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg', tracks:
                // [ { kind: 'captions', label: 'English', srclang: 'en', src:
                // 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt',
                // default: true, }, { kind: 'captions', label: 'French', srclang: 'fr', src:
                // 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.fr.vtt', }, ],
                // };

                // TODO: So there is still this thing where a video should only be allowed to start
                // playing when the IMA SDK is ready or has failed

                this.loadAds();
                break;

            case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
                // This event indicates the ad has started - the video player can adjust the UI,
                // for example display a pause button and remaining time. Fired when content should
                // be paused. This usually happens right before an ad is about to cover the content

                dispatchEvent(event.type);

                this.pauseContent();

                break;

            case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
                // This event indicates the ad has finished - the video player can perform
                // appropriate UI actions, such as removing the timer for remaining time detection.
                // Fired when content should be resumed. This usually happens when an ad finishes
                // or collapses

                dispatchEvent(event.type);

                this.pollCountdown();

                this.resumeContent();

                break;

            case google.ima.AdEvent.Type.STARTED:
            case google.ima.AdEvent.Type.MIDPOINT:
            case google.ima.AdEvent.Type.COMPLETE:
            case google.ima.AdEvent.Type.IMPRESSION:
            case google.ima.AdEvent.Type.CLICK:
                dispatchEvent(event.type);
                break;

            default:
                break;
        }
    }

    /**
     * Any ad error handling comes through here
     * @param {Event} event
     */
    onAdError(event) {
        this.cancel();
        this.player.debug.warn('Ads error', event);
    }

    /**
     * Setup hooks for Plyr and window events. This ensures
     * the mid- and post-roll launch at the correct time. And
     * resize the advertisement when the player resizes
     */
    listeners() {
        const { container } = this.player.elements;
        let time;

        // Add listeners to the required events
        this.player.on('ended', () => {
            this.loader.contentComplete();
        });

        this.player.on('seeking', () => {
            time = this.player.currentTime;
            return time;
        });

        this.player.on('seeked', () => {
            const seekedTime = this.player.currentTime;

            if (is.empty(this.cuePoints)) {
                return;
            }

            this.cuePoints.forEach((cuePoint, index) => {
                if (time < cuePoint && cuePoint < seekedTime) {
                    this.manager.discardAdBreak();
                    this.cuePoints.splice(index, 1);
                }
            });
        });

        // Listen to the resizing of the window. And resize ad accordingly
        // TODO: eventually implement ResizeObserver
        window.addEventListener('resize', () => {
            if (this.manager) {
                this.manager.resize(container.offsetWidth, container.offsetHeight, google.ima.ViewMode.NORMAL);
            }
        });
    }

    /**
     * Initialize the adsManager and start playing advertisements
     */
    play() {
        const { container } = this.player.elements;

        if (!this.managerPromise) {
            this.resumeContent();
        }

        // Play the requested advertisement whenever the adsManager is ready
        this.managerPromise
            .then(() => {
                // Initialize the container. Must be done via a user action on mobile devices
                this.elements.displayContainer.initialize();

                try {
                    if (!this.initialized) {
                        // Initialize the ads manager. Ad rules playlist will start at this time
                        this.manager.init(container.offsetWidth, container.offsetHeight, google.ima.ViewMode.NORMAL);

                        // Call play to start showing the ad. Single video and overlay ads will
                        // start at this time; the call will be ignored for ad rules
                        this.manager.start();
                    }

                    this.initialized = true;
                } catch (adError) {
                    // An error may be thrown if there was a problem with the
                    // VAST response
                    this.onAdError(adError);
                }
            })
            .catch(() => {});
    }

    /**
     * Resume our video
     */
    resumeContent() {
        // Hide the advertisement container
        this.elements.container.style.zIndex = '';

        // Ad is stopped
        this.playing = false;

        // Play our video
        if (this.player.currentTime < this.player.duration) {
            this.player.play();
        }
    }

    /**
     * Pause our video
     */
    pauseContent() {
        // Show the advertisement container
        this.elements.container.style.zIndex = 3;

        // Ad is playing.
        this.playing = true;

        // Pause our video.
        this.player.pause();
    }

    /**
     * Destroy the adsManager so we can grab new ads after this. If we don't then we're not
     * allowed to call new ads based on google policies, as they interpret this as an accidental
     * video requests. https://developers.google.com/interactive-
     * media-ads/docs/sdks/android/faq#8
     */
    cancel() {
        // Pause our video
        if (this.initialized) {
            this.resumeContent();
        }

        // Tell our instance that we're done for now
        this.trigger('error');

        // Re-create our adsManager
        this.loadAds();
    }

    /**
     * Re-create our adsManager
     */
    loadAds() {
        // Tell our adsManager to go bye bye
        this.managerPromise
            .then(() => {
                // Destroy our adsManager
                if (this.manager) {
                    this.manager.destroy();
                }

                // Re-set our adsManager promises
                this.managerPromise = new Promise(resolve => {
                    this.on('loaded', resolve);
                    this.player.debug.log(this.manager);
                });

                // Now request some new advertisements
                this.requestAds();
            })
            .catch(() => {});
    }

    /**
     * Handles callbacks after an ad event was invoked
     * @param {string} event - Event type
     */
    trigger(event, ...args) {
        const handlers = this.events[event];

        if (is.array(handlers)) {
            handlers.forEach(handler => {
                if (is.function(handler)) {
                    handler.apply(this, args);
                }
            });
        }
    }

    /**
     * Add event listeners
     * @param {string} event - Event type
     * @param {function} callback - Callback for when event occurs
     * @return {Ads}
     */
    on(event, callback) {
        if (!is.array(this.events[event])) {
            this.events[event] = [];
        }

        this.events[event].push(callback);

        return this;
    }

    /**
     * Setup a safety timer for when the ad network doesn't respond for whatever reason.
     * The advertisement has 12 seconds to get its things together. We stop this timer when the
     * advertisement is playing, or when a user action is required to start, then we clear the
     * timer on ad ready
     * @param {number} time
     * @param {string} from
     */
    startSafetyTimer(time, from) {
        this.player.debug.log(`Safety timer invoked from: ${from}`);

        this.safetyTimer = setTimeout(() => {
            this.cancel();
            this.clearSafetyTimer('startSafetyTimer()');
        }, time);
    }

    /**
     * Clear our safety timer(s)
     * @param {string} from
     */
    clearSafetyTimer(from) {
        if (!is.nullOrUndefined(this.safetyTimer)) {
            this.player.debug.log(`Safety timer cleared from: ${from}`);

            clearTimeout(this.safetyTimer);
            this.safetyTimer = null;
        }
    }
}

export default Ads;
