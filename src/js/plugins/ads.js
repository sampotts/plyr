import utils from '../utils';

/**
 * Advertisements using Google IMA HTML5 SDK.
 */
class Ads {
    /**
     * Ads constructor.
     * @param {object} player
     * @return {Ads}
     */
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

    /**
     * Get the ads instance ready.
     */
    ready() {
        this.adsContainer = null;
        this.adDisplayContainer = null;
        this.adsManager = null;
        this.adsLoader = null;
        this.adsCuePoints = null;
        this.events = {};
        this.safetyTimer = null;

        // Set listeners on the Plyr instance.
        this.setupListeners();

        // Start ticking our safety timer. If the whole advertisement
        // thing doesn't resolve within our set time; we bail.
        this.startSafetyTimer(12000, 'ready()');

        // Setup a simple promise to resolve if the IMA loader is ready.
        this.adsLoaderPromise = new Promise((resolve) => {
            this.on('ADS_LOADER_LOADED', () => resolve());
        });
        this.adsLoaderPromise.then(() => {
            this.player.debug.log('Ads loader resolved!', this.adsLoader);
        });

        // Setup a promise to resolve if the IMA manager is ready.
        this.adsManagerPromise = new Promise((resolve) => {
            this.on('ADS_MANAGER_LOADED', () => resolve());
        });
        this.adsManagerPromise.then(() => {
            this.player.debug.log('Ads manager resolved!', this.adsManager);

            // Clear the safety timer.
            this.clearSafetyTimer('onAdsManagerLoaded()');
        });

        // Setup the IMA SDK.
        this.setupIMA();
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
        // Create the container for our advertisements.
        this.adsContainer = utils.createElement('div', {
            class: this.player.config.classNames.ads,
        });
        this.player.elements.container.appendChild(this.adsContainer);

        // So we can run VPAID2.
        google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED);

        // Set language.
        // Todo: Could make a config option out of this locale value.
        google.ima.settings.setLocale('en');

        // We assume the adContainer is the video container of the plyr element
        // that will house the ads.
        this.adDisplayContainer = new google.ima.AdDisplayContainer(this.adsContainer);

        // Request video ads to be pre-loaded.
        this.requestAds();
    }

    /**
     * Request advertisements.
     */
    requestAds() {
        const { container } = this.player.elements;

        try {
            // Create ads loader.
            this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer);

            // Listen and respond to ads loaded and error events.
            this.adsLoader.addEventListener(
                google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
                event => this.onAdsManagerLoaded(event), false);
            this.adsLoader.addEventListener(
                google.ima.AdErrorEvent.Type.AD_ERROR,
                error => this.onAdError(error), false);

            // Request video ads.
            const adsRequest = new google.ima.AdsRequest();
            adsRequest.adTagUrl = this.player.config.ads.tagUrl;

            // Specify the linear and nonlinear slot sizes. This helps the SDK
            // to select the correct creative if multiple are returned.
            adsRequest.linearAdSlotWidth = container.offsetWidth;
            adsRequest.linearAdSlotHeight = container.offsetHeight;
            adsRequest.nonLinearAdSlotWidth = container.offsetWidth;
            adsRequest.nonLinearAdSlotHeight = container.offsetHeight;

            // We only overlay ads as we only support video.
            adsRequest.forceNonLinearFullSlot = false;

            this.adsLoader.requestAds(adsRequest);

            this.handleEventListeners('ADS_LOADER_LOADED');
        } catch (e) {
            this.onAdError(e);
        }
    }

    /**
     * This method is called whenever the ads are ready inside the AdDisplayContainer.
     * @param {Event} adsManagerLoadedEvent
     */
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

        // Add advertisement cue's within the time line if available.
        this.adsCuePoints.forEach((cuePoint) => {
            if (cuePoint !== 0 && cuePoint !== -1) {
                const seekElement = this.player.elements.progress;
                if (seekElement) {
                    const cuePercentage = 100 / this.player.duration * cuePoint;
                    const cue = utils.createElement('span', {
                        class: this.player.config.classNames.cues,
                    });
                    cue.style.left = `${cuePercentage.toString()}%`;
                    seekElement.appendChild(cue);
                }
            }
        });

        // Add listeners to the required events.
        // Advertisement error events.
        this.adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR,
            error => this.onAdError(error));

        // Advertisement regular events.
        this.adsManager.addEventListener(google.ima.AdEvent.Type.AD_BREAK_READY,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.AD_METADATA,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.CLICK,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.LOADED,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.STARTED,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.DURATION_CHANGE,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.FIRST_QUARTILE,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.IMPRESSION,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.INTERACTION,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.LINEAR_CHANGED,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.MIDPOINT,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.PAUSED,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.RESUMED,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.THIRD_QUARTILE,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.USER_CLOSE,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_CHANGED,
            event => this.onAdEvent(event));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_MUTED,
            event => this.onAdEvent(event));

        // Resolve our adsManager.
        this.handleEventListeners('ADS_MANAGER_LOADED');
    }

    /**
     * This is where all the event handling takes place. Retrieve the ad from the event. Some
     * events (e.g. ALL_ADS_COMPLETED) don't have the ad object associated.
     * @param {Event} event
     */
    onAdEvent(event) {
        const { container } = this.player.elements;

        // Listen for events if debugging.
        this.player.debug.log(`ads event: ${event.type}`);

        // Retrieve the ad from the event. Some events (e.g. ALL_ADS_COMPLETED)
        // don't have ad object associated.
        const ad = event.getAd();

        switch (event.type) {
            case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                // All ads for the current videos are done. We can now request new advertisements
                // in case the video is re-played.
                this.handleEventListeners('ALL_ADS_COMPLETED');

                // Todo: Example for what happens when a next video in a playlist would be loaded.
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

                // Todo: So there is still this thing where a video should only be allowed to start
                // playing when the IMA SDK is ready or has failed.

                this.loadAds();
                break;
            case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
                // This event indicates the ad has started - the video player can adjust the UI,
                // for example display a pause button and remaining time. Fired when content should
                // be paused. This usually happens right before an ad is about to cover the content.
                this.handleEventListeners('CONTENT_PAUSE_REQUESTED');
                this.pauseContent();
                break;
            case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
                // This event indicates the ad has finished - the video player can perform
                // appropriate UI actions, such as removing the timer for remaining time detection.
                // Fired when content should be resumed. This usually happens when an ad finishes
                // or collapses.
                this.handleEventListeners('CONTENT_RESUME_REQUESTED');
                this.resumeContent();
                break;
            case google.ima.AdEvent.Type.LOADED:
                // This is the first event sent for an ad - it is possible to determine whether the
                // ad is a video ad or an overlay.
                this.handleEventListeners('LOADED');

                if (!ad.isLinear()) {
                    // Position AdDisplayContainer correctly for overlay.
                    ad.width = container.offsetWidth;
                    ad.height = container.offsetHeight;
                }

                // console.info('Ad type: ' + event.getAd().getAdPodInfo().getPodIndex());
                // console.info('Ad time: ' + event.getAd().getAdPodInfo().getTimeOffset());
                break;

            default:
                break;
        }
    }

    /**
     * Any ad error handling comes through here.
     * @param {Event} adErrorEvent
     */
    onAdError(adErrorEvent) {
        this.cancel();
        this.player.debug.log('Ads error.', adErrorEvent);
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

        this.player.on('seeking', () => {
            time = this.player.currentTime;
            return time;
        });

        this.player.on('seeked', () => {
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
            this.adsManager.resize(container.offsetWidth, container.offsetHeight,
                google.ima.ViewMode.NORMAL);
        });
    }

    /**
     * Initialize the adsManager and start playing advertisements.
     */
    play() {
        const { container } = this.player.elements;

        if (!this.adsManagerPromise) {
            return;
        }

        // Play the requested advertisement whenever the adsManager is ready.
        this.adsManagerPromise.then(() => {
            // Initialize the container. Must be done via a user action on mobile devices.
            this.adDisplayContainer.initialize();

            try {
                if (!this.initialized) {

                    // Initialize the ads manager. Ad rules playlist will start at this time.
                    this.adsManager.init(container.offsetWidth, container.offsetHeight,
                        google.ima.ViewMode.NORMAL);

                    // Call play to start showing the ad. Single video and overlay ads will
                    // start at this time; the call will be ignored for ad rules.
                    this.adsManager.start();
                }

                this.initialized = true;
            } catch (adError) {
                // An error may be thrown if there was a problem with the
                // VAST response.
                this.onAdError(adError);
            }
        });
    }

    /**
     * Resume our video.
     */
    resumeContent() {
        this.player.debug.log('Resume video.');

        // Hide our ad container.
        this.adsContainer.style.display = 'none';

        // Ad is stopped.
        this.playing = false;

        // Play our video.
        if (this.player.currentTime < this.player.duration) {
            this.player.play();
        }
    }

    /**
     * Pause our video.
     */
    pauseContent() {
        this.player.debug.log('Pause video.');

        // Show our ad container.
        this.adsContainer.style.display = 'block';

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
        this.player.debug.warn('Ad cancelled.');

        // Pause our video.
        this.resumeContent();

        // Tell our instance that we're done for now.
        this.handleEventListeners('ERROR');

        // Re-create our adsManager.
        this.loadAds();
    }

    /**
     * Re-create our adsManager.
     */
    loadAds() {
        // Tell our adsManager to go bye bye.
        this.adsManagerPromise.then(() => {
            // Destroy our adsManager.
            if (this.adsManager) {
                this.adsManager.destroy();
            }

            // Re-set our adsManager promises.
            this.adsManagerPromise = new Promise((resolve) => {
                this.on('ADS_MANAGER_LOADED', () => resolve());
                this.player.debug.log(this.adsManager);
            });

            // Make sure we can re-call advertisements.
            this.initialized = false;

            // Now request some new advertisements.
            this.requestAds();
        });
    }

    /**
     * Handles callbacks after an ad event was invoked.
     * @param {string} event - Event type
     */
    handleEventListeners(event) {
        if (typeof this.events[event] !== 'undefined') {
            this.events[event].call(this);
        }
    }

    /**
     * Add event listeners
     * @param {string} event - Event type
     * @param {function} callback - Callback for when event occurs
     * @return {Ads}
     */
    on(event, callback) {
        this.events[event] = callback;
        return this;
    }

    /**
     * Setup a safety timer for when the ad network doesn't respond for whatever reason.
     * The advertisement has 12 seconds to get its things together. We stop this timer when the
     * advertisement is playing, or when a user action is required to start, then we clear the
     * timer on ad ready.
     * @param {Number} time
     * @param {String} from
     */
    startSafetyTimer(time, from) {
        this.player.debug.log(`Safety timer invoked from: ${from}.`);
        this.safetyTimer = window.setTimeout(() => {
            this.cancel();
            this.clearSafetyTimer('startSafetyTimer()');
        }, time);
    }

    /**
     * Clear our safety timer(s).
     * @param {String} from
     */
    clearSafetyTimer(from) {
        if (typeof this.safetyTimer !== 'undefined' && this.safetyTimer !== null) {
            this.player.debug.log(`Safety timer cleared from: ${from}.`);
            clearTimeout(this.safetyTimer);
            this.safetyTimer = undefined;
        }
    }
}

export default Ads;
