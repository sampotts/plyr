import utils from '../utils';

// Events are different on various devices. We det the correct events, based on userAgent.
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

export default class Ads {
    constructor(player) {
        this.player = player;

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
        this.startEvents = getStartEvents();
        this.adDisplayContainer = null;
        this.adDisplayElement = null;
        this.adsManager = null;
        this.adsLoader = null;
        this.adCuePoints = null;
        this.currentAd = null;
        this.events = {};
        this.videoElement = document.createElement('video');

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
        this.adsLoader = new window.google.ima.AdsLoader(this.adDisplayContainer, this.videoElement);

        // Tell the adsLoader we are handling ad breaks manually.
        this.adsLoader.getSettings().setAutoPlayAdBreaks(false);

        // Listen and respond to ads loaded and error events.
        this.adsLoader.addEventListener(window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, event => this.onAdsManagerLoaded(event), false);
        this.adsLoader.addEventListener(window.google.ima.AdErrorEvent.Type.AD_ERROR, error => this.onAdError(error), false);

        // Request video ads.
        const adsRequest = new window.google.ima.AdsRequest();
        adsRequest.adTagUrl = this.player.config.ads.tagUrl;

        // Specify the linear and nonlinear slot sizes. This helps the SDK to
        // select the correct creative if multiple are returned.
        adsRequest.linearAdSlotWidth = container.offsetWidth;
        adsRequest.linearAdSlotHeight = container.offsetHeight;
        adsRequest.nonLinearAdSlotWidth = container.offsetWidth;
        adsRequest.nonLinearAdSlotHeight = container.offsetHeight;

        this.adsLoader.requestAds(adsRequest);
    }

    onAdsManagerLoaded(adsManagerLoadedEvent) {
        const { videoElement } = this;

        // Get the ads manager.
        const settings = new window.google.ima.AdsRenderingSettings();
        settings.restoreCustomPlaybackStateOnAdBreakComplete = true;
        settings.enablePreloading = true;

        // The SDK is polling currentTime on the contentPlayback. And needs a duration
        // so it can determine when to start the mid- and post-roll.
        this.adsManager = adsManagerLoadedEvent.getAdsManager(videoElement, settings);

        // Get the cue points for any mid-rolls by filtering out the pre- and post-roll.
        this.adsCuePoints = this.adsManager.getCuePoints().filter(x => x > 0 && x !== -1);

        // Add listeners to the required events.
        this.adsManager.addEventListener(window.google.ima.AdErrorEvent.Type.AD_ERROR, error => this.onAdError(error));
        this.adsManager.addEventListener(window.google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, event => this.onAdEvent(event));
        this.adsManager.addEventListener(window.google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, event => this.onAdEvent(event));
        this.adsManager.addEventListener(window.google.ima.AdEvent.Type.ALL_ADS_COMPLETED, event => this.onAdEvent(event));
        this.adsManager.addEventListener(window.google.ima.AdEvent.Type.AD_BREAK_READY, event => this.onAdEvent(event));

        // Listen to any additional events, if necessary.
        this.adsManager.addEventListener(window.google.ima.AdEvent.Type.LOADED, event => this.onAdEvent(event));
        this.adsManager.addEventListener(window.google.ima.AdEvent.Type.STARTED, event => this.onAdEvent(event));
        this.adsManager.addEventListener(window.google.ima.AdEvent.Type.COMPLETE, event => this.onAdEvent(event));
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
            case window.google.ima.AdEvent.Type.LOADED:
                // This is the first event sent for an ad - it is possible to
                // determine whether the ad is a video ad or an overlay.

                // Show the ad display element.
                this.adDisplayElement.style.display = 'block';

                this.handleEventListeners('LOADED');

                if (!ad.isLinear()) {
                    // Position AdDisplayContainer correctly for overlay.
                    ad.width = container.offsetWidth;
                    ad.height = container.offsetHeight;
                }
                break;

            case window.google.ima.AdEvent.Type.STARTED:
                // This event indicates the ad has started - the video player
                // can adjust the UI, for example display a pause button and
                // remaining time.

                this.player.pause();
                this.handleEventListeners('STARTED');

                // if (ad.isLinear()) {
                // For a linear ad, a timer can be started to poll for
                // the remaining time.
                // intervalTimer = setInterval(
                //     () => {
                //       let remainingTime = this.adsManager.getRemainingTime();
                //       console.log(remainingTime);
                //     },
                //     300); // every 300ms
                // }
                break;

            case window.google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
                this.handleEventListeners('CONTENT_PAUSE_REQUESTED');
                break;

            case window.google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
                this.handleEventListeners('CONTENT_RESUME_REQUESTED');
                break;

            case window.google.ima.AdEvent.Type.AD_BREAK_READY:
                // This event indicates that a mid-roll ad is ready to start.
                // We pause the player and tell the adsManager to start playing the ad.
                this.player.pause();
                this.adsManager.start();
                this.handleEventListeners('AD_BREAK_READY');
                break;

            case window.google.ima.AdEvent.Type.COMPLETE:
                // This event indicates the ad has finished - the video player
                // can perform appropriate UI actions, such as removing the timer for
                // remaining time detection.
                // clearInterval(intervalTimer);
                this.handleEventListeners('COMPLETE');

                this.adDisplayElement.style.display = 'none';
                if (this.player.currentTime < this.player.duration) {
                    this.player.play();
                }
                break;

            case window.google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                this.handleEventListeners('ALL_ADS_COMPLETED');
                break;

            default:
                break;
        }
    }

    onAdError(adErrorEvent) {
        // Handle the error logging.
        this.adDisplayElement.remove();

        if (this.adsManager) {
            this.adsManager.destroy();
        }

        if (this.player.debug) {
            throw new Error(adErrorEvent);
        }
    }

    setupAdDisplayContainer() {
        const { container } = this.player.elements;

        // We assume the adContainer is the video container of the plyr element
        // that will house the ads.
        this.adDisplayContainer = new window.google.ima.AdDisplayContainer(container);

        this.adDisplayElement = container.firstChild;

        // The AdDisplayContainer call from google IMA sets the style attribute
        // by default. We remove the inline style and set it through the stylesheet.
        this.adDisplayElement.removeAttribute('style');

        // Set class name on the adDisplayContainer element.
        this.adDisplayElement.setAttribute('class', this.player.config.classNames.ads);

        // Play ads when clicked.
        this.setOnClickHandler(this.adDisplayElement, this.playAds);
    }

    playAds() {
        const { container } = this.player.elements;

        // Initialize the container. Must be done via a user action on mobile devices.
        this.adDisplayContainer.initialize();

        try {
            // Initialize the ads manager. Ad rules playlist will start at this time.
            this.adsManager.init(container.offsetWidth, container.offsetHeight, window.google.ima.ViewMode.NORMAL);

            // Call play to start showing the ad. Single video and overlay ads will
            // start at this time; the call will be ignored for ad rules.
            this.adsManager.start();
        } catch (adError) {
            // An error may be thrown if there was a problem with the VAST response.
            this.player.play();
            this.adDisplayElement.remove();

            if (this.player.debug) {
                throw new Error(adError);
            }
        }
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

        this.player.on('timeupdate', event => {
            const { currentTime } = event.detail.plyr;
            this.videoElement.currentTime = Math.ceil(currentTime);
        });

        this.player.on('seeking', event => {
            time = event.detail.plyr.currentTime;
            return time;
        });

        this.player.on('seeked', event => {
            const seekedTime = event.detail.plyr.currentTime;

            this.adsCuePoints.forEach((cuePoint, index) => {
                if (time < cuePoint && cuePoint < seekedTime) {
                    this.adsManager.discardAdBreak();
                    this.adsCuePoints.splice(index, 1);
                }
            });
        });

        // Listen to the resizing of the window. And resize ad accordingly.
        window.addEventListener('resize', () => {
            this.adsManager.resize(container.offsetWidth, container.offsetHeight, window.google.ima.ViewMode.NORMAL);
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
}
