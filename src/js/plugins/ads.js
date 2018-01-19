// ==========================================================================
// Advertisment plugin
// Create an account with our ad partner, vi here:
// https://www.vi.ai/publisher-video-monetization/
// ==========================================================================

/* global google */

import utils from '../utils';

// Events are different on various devices. We set the correct events, based on userAgent.
const getStartEvents = () => {
    let events = ['click'];

    // TODO: Detecting touch is tricky, we should look at other ways?
    // For mobile users the start event will be one of
    // touchstart, touchend and touchmove.
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Android/i)) {
        events = [
            'touchstart',
            'touchend',
            'touchmove',
        ];
    }

    return events;
};

class Ads {
    constructor(player) {
        this.player = player;
        this.playing = false;
        this.initialized = false;

        // Check if a tag URL is provided.
        if (!utils.is.url(player.config.ads.tagUrl)) {
            return this;
        }

        // Check if the Google IMA3 SDK is loaded
        if (!utils.is.object(window.google)) {
            utils.loadScript(player.config.urls.googleIMA.api, () => {
                this.ready();
            });
        } else {
            this.ready();
        }
    }

    ready() {
        this.time = Date.now();
        this.startEvents = getStartEvents();
        this.adDisplayContainer = null;
        this.adsDisplayElement = null;
        this.adsManager = null;
        this.adsLoader = null;
        this.adsCuePoints = null;
        this.currentAd = null;
        this.events = {};
        this.safetyTimer = null;

        // Setup a simple promise to resolve if the IMA loader is ready.
        this.adsLoaderResolve = () => {};
        this.adsLoaderPromise = new Promise(resolve => {
            this.adsLoaderResolve = resolve;
        });
        this.adsLoaderPromise.then(() => {
            this.player.debug.log(`[${(Date.now() - this.time) / 1000}s][IMA SDK] adsLoader resolved!`, this.adsLoader);
        });

        // Setup a promise to resolve if the IMA manager is ready.
        this.adsManagerResolve = () => {};
        this.adsManagerPromise = new Promise(resolve => {
            // Resolve our promise.
            this.adsManagerResolve = resolve;
        });
        this.adsManagerPromise.then(() => {
            // Clear the safety timer.
            this.clearSafetyTimer('onAdsManagerLoaded()');
            this.player.debug.log(`[${(Date.now() - this.time) / 1000}s][IMA SDK] adsManager resolved!`, this.adsManager);
        });

        // Start ticking our safety timer. If the whole advertisement
        // thing doesn't resolve within our set time; we bail.
        this.startSafetyTimer(12000, 'ready()');

        // Setup the ad display container.
        this.setupAdDisplayContainer();

        // Setup the IMA SDK.
        this.setupIMA();

        // Set listeners on the Plyr instance.
        this.setupListeners();
    }

    setupIMA() {
        const { container } = this.player.elements;

        // Create ads loader.
        this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer);

        // Listen and respond to ads loaded and error events.
        this.adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, event => this.onAdsManagerLoaded(event), false);
        this.adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, error => this.onAdError(error), false);

        // Request video ads.
        const adsRequest = new google.ima.AdsRequest();
        adsRequest.adTagUrl = this.player.config.ads.tagUrl;

        // Specify the linear and nonlinear slot sizes. This helps the SDK to
        // select the correct creative if multiple are returned.
        adsRequest.linearAdSlotWidth = container.offsetWidth;
        adsRequest.linearAdSlotHeight = container.offsetHeight;
        adsRequest.nonLinearAdSlotWidth = container.offsetWidth;
        adsRequest.nonLinearAdSlotHeight = container.offsetHeight;

        this.adsLoader.requestAds(adsRequest);

        this.adsLoaderResolve();
    }

    onAdsManagerLoaded(adsManagerLoadedEvent) {
        // Get the ads manager.
        const settings = new google.ima.AdsRenderingSettings();

        // Tell the SDK to save and restore content video state on our behalf.
        settings.restoreCustomPlaybackStateOnAdBreakComplete = true;
        settings.enablePreloading = true;

        // The SDK is polling currentTime on the contentPlayback. And needs a duration
        // so it can determine when to start the mid- and post-roll.
        this.adsManager = adsManagerLoadedEvent.getAdsManager(this.player, settings);

        // Get the cue points for any mid-rolls by filtering out the pre- and post-roll.
        this.adsCuePoints = this.adsManager.getCuePoints();

        // Add listeners to the required events.
        this.adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, error => this.onAdError(error));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.AD_BREAK_READY, event => this.onAdEvent(event));

        // Listen to any additional events, if necessary.
        this.adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, event => this.onAdEvent(event));

        // Resolve our adsManager.
        this.adsManagerResolve();
    }

    onAdEvent(event) {
        const { container } = this.player.elements;

        // Retrieve the ad from the event. Some events (e.g. ALL_ADS_COMPLETED)
        // don't have ad object associated.
        const ad = event.getAd();

        // Set the currently played ad. This information could be used by callback
        // events.
        this.currentAd = ad;

        // let intervalTimer;

        switch (event.type) {
            case google.ima.AdEvent.Type.AD_BREAK_READY:
                // This event indicates that a mid-roll ad is ready to start.
                // We pause the player and tell the adsManager to start playing the ad.
                this.player.debug.log(
                    `[${(Date.now() - this.time) / 1000}s][IMA SDK] AD_BREAK_READY |`,
                    'Fired when an ad rule or a VMAP ad break would have played if autoPlayAdBreaks is false.',
                );
                // this.handleEventListeners('AD_BREAK_READY');
                // this.playing = true;
                // this.adsManager.start();
                break;
            case google.ima.AdEvent.Type.AD_METADATA:
                this.player.debug.log(`[${(Date.now() - this.time) / 1000}s][IMA SDK] AD_METADATA |`, 'Fired when an ads list is loaded.');
                break;
            case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                this.player.debug.log(
                    `[${(Date.now() - this.time) / 1000}s][IMA SDK] ALL_ADS_COMPLETED |`,
                    'Fired when the ads manager is done playing all the ads.',
                );
                this.handleEventListeners('ALL_ADS_COMPLETED');
                break;
            case google.ima.AdEvent.Type.CLICK:
                this.player.debug.log(`[${(Date.now() - this.time) / 1000}s][IMA SDK] CLICK |`, 'Fired when the ad is clicked.');
                break;
            case google.ima.AdEvent.Type.COMPLETE:
                // This event indicates the ad has finished - the video player
                // can perform appropriate UI actions, such as removing the timer for
                // remaining time detection.
                // clearInterval(intervalTimer);
                this.player.debug.log(`[${(Date.now() - this.time) / 1000}s][IMA SDK] COMPLETE |`, 'Fired when the ad completes playing.');
                this.handleEventListeners('COMPLETE');
                this.playing = false;

                this.adsDisplayElement.style.display = 'none';

                if (this.player.currentTime < this.player.duration) {
                    this.player.play();
                }
                break;
            case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
                this.player.debug.log(
                    `[${(Date.now() - this.time) / 1000}s][IMA SDK] CONTENT_PAUSE_REQUESTED |`,
                    'Fired when content should be paused. This usually happens right before an ad is about to cover the content.',
                );
                this.handleEventListeners('CONTENT_PAUSE_REQUESTED');
                this.player.pause();
                break;

            case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
                this.player.debug.log(
                    `[${(Date.now() - this.time) / 1000}s][IMA SDK] CONTENT_RESUME_REQUESTED |`,
                    'Fired when content should be resumed. This usually happens when an ad finishes or collapses.',
                );
                this.handleEventListeners('CONTENT_RESUME_REQUESTED');
                if (this.player.currentTime < this.player.duration) {
                    this.player.play();
                }
                break;
            case google.ima.AdEvent.Type.LOADED:
                // This is the first event sent for an ad - it is possible to
                // determine whether the ad is a video ad or an overlay.
                this.player.debug.log(`[${(Date.now() - this.time) / 1000}s][IMA SDK] LOADED |`, event.getAd().getContentType());
                this.handleEventListeners('LOADED');

                // Show the ad display element.
                this.adsDisplayElement.style.display = 'block';

                if (!ad.isLinear()) {
                    // Position AdDisplayContainer correctly for overlay.
                    ad.width = container.offsetWidth;
                    ad.height = container.offsetHeight;
                }

                // console.info('Ad type: ' + event.getAd().getAdPodInfo().getPodIndex());
                // console.info('Ad time: ' + event.getAd().getAdPodInfo().getTimeOffset());
                break;
            case google.ima.AdEvent.Type.STARTED:
                // This event indicates the ad has started - the video player
                // can adjust the UI, for example display a pause button and
                // remaining time.
                this.player.debug.log(`[${(Date.now() - this.time) / 1000}s][IMA SDK] STARTED |`, 'Fired when the ad starts playing.');
                this.player.pause();
                this.playing = true;
                this.handleEventListeners('STARTED');
                break;
            case google.ima.AdEvent.Type.DURATION_CHANGE:
                this.player.debug.log(`[${(Date.now() - this.time) / 1000}s][IMA SDK] DURATION_CHANGE |`, "Fired when the ad's duration changes.");
                break;
            case google.ima.AdEvent.Type.FIRST_QUARTILE:
                this.player.debug.log(`[${(Date.now() - this.time) / 1000}s][IMA SDK] FIRST_QUARTILE |`, 'Fired when the ad playhead crosses first quartile.');
                break;
            case google.ima.AdEvent.Type.IMPRESSION:
                this.player.debug.log(`[${(Date.now() - this.time) / 1000}s][IMA SDK] IMPRESSION |`, 'Fired when the impression URL has been pinged.');
                break;
            case google.ima.AdEvent.Type.INTERACTION:
                this.player.debug.log(
                    `[${(Date.now() - this.time) / 1000}s][IMA SDK] INTERACTION |`,
                    'Fired when an ad triggers the interaction callback. Ad interactions contain an interaction ID string in the ad data.',
                );
                break;
            case google.ima.AdEvent.Type.LINEAR_CHANGED:
                this.player.debug.log(
                    `[${(Date.now() - this.time) / 1000}s][IMA SDK] LINEAR_CHANGED |`,
                    'Fired when the displayed ad changes from linear to nonlinear, or vice versa.',
                );
                break;
            case google.ima.AdEvent.Type.MIDPOINT:
                this.player.debug.log(`[${(Date.now() - this.time) / 1000}s][IMA SDK] MIDPOINT |`, 'Fired when the ad playhead crosses midpoint.');
                break;
            case google.ima.AdEvent.Type.PAUSED:
                this.player.debug.log(`[${(Date.now() - this.time) / 1000}s][IMA SDK] PAUSED |`, 'Fired when the ad is paused.');
                break;
            case google.ima.AdEvent.Type.RESUMED:
                this.player.debug.log(`[${(Date.now() - this.time) / 1000}s][IMA SDK] RESUMED |`, 'Fired when the ad is resumed.');
                break;
            case google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED:
                this.player.debug.log(
                    `[${(Date.now() - this.time) / 1000}s][IMA SDK] SKIPPABLE_STATE_CHANGED |`,
                    'Fired when the displayed ads skippable state is changed.',
                );
                break;
            case google.ima.AdEvent.Type.SKIPPED:
                this.player.debug.log(`[${(Date.now() - this.time) / 1000}s][IMA SDK] SKIPPED |`, 'Fired when the ad is skipped by the user.');
                break;
            case google.ima.AdEvent.Type.THIRD_QUARTILE:
                this.player.debug.log(`[${(Date.now() - this.time) / 1000}s][IMA SDK] THIRD_QUARTILE |`, 'Fired when the ad playhead crosses third quartile.');
                break;
            case google.ima.AdEvent.Type.USER_CLOSE:
                this.player.debug.log(`[${(Date.now() - this.time) / 1000}s][IMA SDK] USER_CLOSE |`, 'Fired when the ad is closed by the user.');
                break;
            case google.ima.AdEvent.Type.VOLUME_CHANGED:
                this.player.debug.log(`[${(Date.now() - this.time) / 1000}s][IMA SDK] VOLUME_CHANGED |`, 'Fired when the ad volume has changed.');
                break;
            case google.ima.AdEvent.Type.VOLUME_MUTED:
                this.player.debug.log(`[${(Date.now() - this.time) / 1000}s][IMA SDK] VOLUME_MUTED |`, 'Fired when the ad volume has been muted.');
                break;

            default:
                break;
        }
    }

    onAdError(adErrorEvent) {
        this.cancel();
        this.player.debug.log(`[${(Date.now() - this.time) / 1000}s][IMA SDK] ERROR |`, adErrorEvent);
    }

    setupAdDisplayContainer() {
        const { wrapper } = this.player.elements;

        // So we can run VPAID2.
        google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED);

        // Set language.
        // Todo: Could make a config option out of this locale value.
        google.ima.settings.setLocale('en');

        // We assume the adContainer is the video container of the plyr element
        // that will house the ads.
        this.adDisplayContainer = new google.ima.AdDisplayContainer(wrapper);

        this.adsDisplayElement = wrapper.firstChild;

        // The AdDisplayContainer call from google IMA sets the style attribute
        // by default. We remove the inline style and set it through the stylesheet.
        this.adsDisplayElement.removeAttribute('style');

        // Set class name on the adDisplayContainer element.
        this.adsDisplayElement.setAttribute('class', this.player.config.classNames.ads);

        // Play ads when clicked. Wait until the adsManager and adsLoader
        // are both resolved.
        Promise.all([
            this.adsManagerPromise,
            this.adsLoaderPromise,
        ]).then(() => {
            this.setOnClickHandler(this.adsDisplayElement, this.play);
        });
    }

    /**
     * Setup hooks for Plyr and window events. This ensures
     * the mid- and post-roll launch at the correct time. And
     * resize the advertisement when the player resizes.
     */
    setupListeners() {
        const { container } = this.player.elements;
        let time;

        // Add listeners to the required events.
        this.player.on('ended', () => {
            this.adsLoader.contentComplete();
        });

        this.player.on('seeking', event => {
            time = this.player.currentTime;
            return time;
        });

        this.player.on('seeked', event => {
            const seekedTime = this.player.currentTime;

            this.adsCuePoints.forEach((cuePoint, index) => {
                if (time < cuePoint && cuePoint < seekedTime) {
                    this.adsManager.discardAdBreak();
                    this.adsCuePoints.splice(index, 1);
                }
            });
        });

        // Listen to the resizing of the window. And resize ad accordingly.
        window.addEventListener('resize', () => {
            this.adsManager.resize(container.offsetWidth, container.offsetHeight, google.ima.ViewMode.NORMAL);
        });
    }

    /**
     * Initialize the adsManager and start playing advertisements.
     */
    play() {
        const { container } = this.player.elements;

        // Initialize the container. Must be done via a user action on mobile devices.
        this.adDisplayContainer.initialize();

        // Play the requested advertisement whenever the adsManager is ready.
        this.adsManagerPromise.then(() => {
            try {
                if (!this.initialized) {
                    // Initialize the ads manager. Ad rules playlist will start at this time.
                    this.adsManager.init(container.offsetWidth, container.offsetHeight, google.ima.ViewMode.NORMAL);

                    // Call play to start showing the ad. Single video and overlay ads will
                    // start at this time; the call will be ignored for ad rules.
                    this.adsManager.start();
                }

                this.initialized = true;
            } catch (adError) {
                // An error may be thrown if there was a problem with the VAST response.
                this.adsDisplayElement.remove();

                if (this.player.debug) {
                    throw new Error(adError);
                }
                this.player.play();
            }
        });
    }

    /**
     * Destroy the adsManager so we can grab new ads after this.
     * If we don't then we're not allowed to call new ads based
     * on google policies, as they interpret this as an accidental
     * video requests. https://developers.google.com/interactive-
     * media-ads/docs/sdks/android/faq#8
     */
    cancel() {
        this.player.debug.warn(`[${(Date.now() - this.time) / 1000}s][IMA SDK]`, 'Advertisement cancelled.');

        // Todo: Removing the ad container might be problematic if we were to recreate the adsManager. Think of playlists. Every new video you need to request a new VAST xml and preload the advertisement.
        this.adsDisplayElement.remove();

        // Tell our adsManager to go bye bye.
        this.adsManagerPromise.then(() => {
            if (this.adsManager) {
                this.adsManager.destroy();
            }
        });
    }

    /**
     * Handles callbacks after an ad event was invoked.
     */
    handleEventListeners(event) {
        if (typeof this.events[event] !== 'undefined') {
            this.events[event].call(this);
        }
    }

    /**
     * Set start event listener on a DOM element and triggers the
     * callback when clicked.
     * @param {element} element - The element on which to set the listener
     * @param {function} callback - The callback which will be invoked once triggered.
     */
    setOnClickHandler(element, callback) {
        for (let i = 0; i < this.startEvents.length; i += 1) {
            const startEvent = this.startEvents[i];
            element.addEventListener(
                startEvent,
                event => {
                    if ((event.type === 'touchend' && startEvent === 'touchend') || event.type === 'click') {
                        callback.call(this);
                    }
                },
                { once: true },
            );
        }
    }

    /**
     * Add event listeners
     * @param {string} event - Event type
     * @param {function} callback - Callback for when event occurs
     */
    on(event, callback) {
        this.events[event] = callback;
        return this;
    }

    /**
     * startSafetyTimer
     * Setup a safety timer for when the ad network
     * doesn't respond for whatever reason. The advertisement has 12 seconds
     * to get its shit together. We stop this timer when the advertisement
     * is playing, or when a user action is required to start, then we
     * clear the timer on ad ready.
     * @param {Number} time
     * @param {String} from
     * @private
     */
    startSafetyTimer(time, from) {
        this.player.debug.log(`[${(Date.now() - this.time) / 1000}s][IMA SDK]`, `Safety timer invoked timer from: ${from}`);
        this.safetyTimer = window.setTimeout(() => {
            this.cancel();
            this.clearSafetyTimer('startSafetyTimer()');
        }, time);
    }

    /**
     * clearSafetyTimer
     * @param {String} from
     * @private
     */
    clearSafetyTimer(from) {
        if (typeof this.safetyTimer !== 'undefined' && this.safetyTimer !== null) {
            this.player.debug.log(`[${(Date.now() - this.time) / 1000}s][IMA SDK]`, `Safety timer cleared timer from: ${from}`);
            clearTimeout(this.safetyTimer);
            this.safetyTimer = undefined;
        }
    }
}

export default Ads;
