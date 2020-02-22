import Console from '../console';
import { createElement, getAttributesFromSelector, insertAfter, toggleClass } from '../utils/elements';
import { triggerEvent } from '../utils/events';
import is from '../utils/is';
import loadScript from '../utils/load-script';
import { extend } from '../utils/objects';

const googlecast = {
    setup(config) {
        if (!window.chrome) {
            // TODO: Figure out if this is the right check
            // We're not on Chrome. Bail since google-cast does not work
            // on other browsers
            console.log('Sorry but google cast works only in Chrome  ;(');
            return;
        }
        googlecast.defaults = {};
        googlecast.config = {};

        googlecast.events = {
            ready: googlecast.onReady,
            play: googlecast.onPlay,
            pause: googlecast.onPause,
            seeked: googlecast.onSeek,
            volumechange: googlecast.onVolumeChange,
            qualityrequested: googlecast.onQualityChange,
            loadedmetadata: googlecast.onLoadedMetadata,
        };

        googlecast.debug = new Console(true);
        // TODO: Get cast logs under a separate namespace?

        // Inject the container

        debugger;
        if (!is.element(this.elements.googlecast)) {
            this.elements.googlecast = createElement(
                'div',
                getAttributesFromSelector(this.config.selectors.googlecast),
            );
            insertAfter(this.elements.googlecast, this.elements.wrapper);
        }
        // Set the class hook
        toggleClass(this.elements.container, this.config.classNames.googlecast.enabled, true);

        if (!window.chrome.cast) {
            loadScript(this.config.urls.googlecast.api).then(() => {
                // FIXME: There __has__ to be a better way to do this
                // window.chrome.cast isn't immediately available when this function runs
                const interval = setInterval(() => {
                    if (window.chrome.cast.isAvailable) {
                        clearInterval(interval);
                        googlecast.defaults = {
                            options: {
                                receiverApplicationId: window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
                                // receiverApplicationId: 'C248C800',
                                autoJoinPolicy: window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
                            },
                        };
                        const opts = extend({}, googlecast.defaults, config);
                        googlecast.initializeCastApi(opts);
                    }
                }, 100);
            });
        }
    },

    initializeCastApi(config) {
        const { framework } = window.cast;
        const { CastContext } = framework;
        console.log(config, 'session');
        CastContext.getInstance().setOptions(config.options);

        // Set up event handlers
        CastContext.getInstance().addEventListener(
            framework.CastContextEventType.CAST_STATE_CHANGED,
            googlecast.castStateListener,
        );
        CastContext.getInstance().addEventListener(
            framework.CastContextEventType.SESSION_STATE_CHANGED,
            googlecast.sessionStateListener,
        );
        googlecast.debug.log('Initialized google cast');
    },

    getCurrentSession() {
        return window.cast.framework.CastContext.getInstance().getCurrentSession();
    },

    getCurrentPlyr() {
        return googlecast.currentPlyr;
    },

    onPlay() {
        const plyr = googlecast.getCurrentPlyr();
        googlecast.debug.log('Asking remote player to play');
        // Seek before playing?
        // googlecast.onSeek();
        plyr.remotePlayerController.playOrPause();
    },
    onPause() {
        const plyr = googlecast.getCurrentPlyr();
        googlecast.debug.log('Asking remote player to pause');
        plyr.remotePlayerController.playOrPause();
        // Seek after pause
        googlecast.onSeek();
    },
    onSeek() {
        const plyr = googlecast.getCurrentPlyr();
        const timestamp = plyr.currentTime;
        plyr.remotePlayer.currentTime = timestamp;
        plyr.remotePlayerController.seek();
        googlecast.debug.log(`Asking remote player to seek to ${timestamp}`);
    },
    onLoadedMetadata() {
        googlecast.debug.log('Running googlecast.onReady()');
        const plyr = googlecast.getCurrentPlyr();
        const oldLoadRequest = plyr.googlecastLoadRequest;
        const newLoadRequest = googlecast.buildLoadRequest(plyr);
        if (oldLoadRequest.media.contentId === newLoadRequest.media.contentId) {
            return;
        }
        googlecast.loadMedia(plyr, newLoadRequest);
    },
    onReady() {
        googlecast.debug.log('Running googlecast.onReady()');
        const plyr = googlecast.getCurrentPlyr();
        googlecast.loadMedia(plyr);
    },
    onVolumeChange() {
        const plyr = googlecast.getCurrentPlyr();
        // We need to specially handle the case where plyr is muted
        let { volume } = plyr;
        if (plyr.muted) {
            volume = 0;
        }
        plyr.remotePlayer.volumeLevel = volume;
        plyr.remotePlayerController.setVolumeLevel();
    },
    onQualityChange() {
        const plyr = googlecast.getCurrentPlyr();
        googlecast.loadMedia(plyr);
    },
    loadMedia(plyr, loadRequest) {
        googlecast.debug.log('load media called');
        const session = googlecast.getCurrentSession();
        if (!session) {
            return;
        }
        if (!loadRequest) {
            loadRequest = googlecast.buildLoadRequest(plyr);
        }
        session
            .loadMedia(loadRequest)
            .then(() => {
                googlecast.debug.log('Successfully handled loadMedia');
                googlecast.getCurrentPlyr().googlecastLoadRequest = loadRequest;
                googlecast.bindPlyr(plyr);
            })
            .catch(err => {
                googlecast.debug.log(`Error during loadMedia: ${err}`);
            });
    },
    buildLoadRequest(plyr) {
        // TODO: We need to be able to override the defaults
        const defaults = {
            mediaInfo: {
                source: plyr.source,
                contentType: 'video/mp4',
            },
            metadata: {
                metadataType: window.chrome.cast.media.MetadataType.GENERIC,
                title: plyr.config.title || plyr.source,
                images: [
                    {
                        url: plyr.poster,
                    },
                ],
            },
            loadRequest: {
                autoplay: plyr.playing,
                currentTime: plyr.currentTime,
                customData: {
                    type: plyr.type,
                    provider: plyr.provider,
                },
            },
        };

        if (plyr.hls) {
            // Plyr has been hijacked by HLS
            const { customData } = defaults.loadRequest;
            customData.subType = 'hls';
            customData.source = plyr.hls.manifestURL;
        }

        const options = extend({}, defaults);
        const mediaInfo = new window.chrome.cast.media.MediaInfo(
            options.mediaInfo.source,
            options.mediaInfo.contentType,
        );
        mediaInfo.streamType = defaults.mediaInfo.streamType;

        mediaInfo.metadata = new window.chrome.cast.media.GenericMediaMetadata();
        Object.assign(mediaInfo.metadata, options.metadata);

        const loadRequest = new window.chrome.cast.media.LoadRequest(mediaInfo);
        loadRequest.customData = options.loadRequest.customData;
        loadRequest.autoplay = options.loadRequest.autoplay;
        loadRequest.currentTime = options.loadRequest.currentTime;
        return loadRequest;
    },
    setCurrentPlyr(plyr) {
        googlecast.currentPlyr = plyr;
    },
    bindEvents(plyr) {
        // Iterate over events and add all listeners
        Object.keys(googlecast.events).forEach(evt => {
            const fn = googlecast.events[evt];
            plyr.on(evt, fn);
        });
    },
    bindPlyr(plyr, options) {
        if (googlecast.currentPlyr !== plyr) {
            googlecast.debug.warn('Warning! Current plyr !==  plyr in bindPlyr()');
            googlecast.currentPlyr = plyr;
        }
        googlecast.currentPlyrOptions = options;

        // TODO: Figure out if we should do plyr.remotePlayer = plyr.remotePlayer || new window.cast.framework.RemotePlayer()
        plyr.remotePlayer = new window.cast.framework.RemotePlayer();
        // TODO: Figure out if we should do plyr.remotePlayerController = plyr.remotePlayerController || new window.cast.framework.RemotePlayerController(plyr.remotePlayer);
        plyr.remotePlayerController = new window.cast.framework.RemotePlayerController(plyr.remotePlayer);

        googlecast.bindEvents(plyr);
        plyr.googlecastEnabled = true; // FIXME: This should probably use state from controls
        googlecast.debug.log('Plyr bound');
    },

    unbindPlyr(plyr) {
        const { currentPlyr } = googlecast;
        if (currentPlyr === plyr) {
            Object.keys(googlecast.events).forEach(evt => {
                const fn = googlecast.events[evt];
                plyr.off(evt, fn);
            });
        }
        delete currentPlyr.googlecastEnabled; // FIXME: This should probably use state from controls
        googlecast.currentPlyr = undefined;
        googlecast.currentPlyrOptions = undefined;
    },

    getErrorMessage(error) {
        const { chrome } = window;
        switch (error.code) {
            case chrome.cast.ErrorCode.API_NOT_INITIALIZED:
                return `The API is not initialized.${error.description ? ` :${error.description}` : ''}`;
            case chrome.cast.ErrorCode.CANCEL:
                return `The operation was canceled by the user${error.description ? ` :${error.description}` : ''}`;
            case chrome.cast.ErrorCode.CHANNEL_ERROR:
                return `A channel to the receiver is not available.${
                    error.description ? ` :${error.description}` : ''
                }`;
            case chrome.cast.ErrorCode.EXTENSION_MISSING:
                return `The Cast extension is not available.${error.description ? ` :${error.description}` : ''}`;
            case chrome.cast.ErrorCode.INVALID_PARAMETER:
                return `The parameters to the operation were not valid.${
                    error.description ? ` :${error.description}` : ''
                }`;
            case chrome.cast.ErrorCode.RECEIVER_UNAVAILABLE:
                return `No receiver was compatible with the session request.${
                    error.description ? ` :${error.description}` : ''
                }`;
            case chrome.cast.ErrorCode.SESSION_ERROR:
                return `A session could not be created, or a session was invalid.${
                    error.description ? ` :${error.description}` : ''
                }`;
            case chrome.cast.ErrorCode.TIMEOUT:
                return `The operation timed out.${error.description ? ` :${error.description}` : ''}`;
            default:
                return `Unknown error: ${JSON.stringify(error)}`;
        }
    },

    castStateListener(data) {
        googlecast.debug.log(`Cast State Changed: ${JSON.stringify(data)}`);
        const plyr = googlecast.getCurrentPlyr();
        const cs = window.cast.framework.CastState;
        let castEvent;
        switch (data.castState) {
            case cs.NO_DEVICES_AVAILABLE:
            case cs.NOT_CONNECTED:
                googlecast.debug.log('NOT CONNECTED');
                castEvent = 'castdisabled';
                break;
            case cs.CONNECTING:
                break;
            case cs.CONNECTED:
                castEvent = 'castenabled';
                break;
            default:
                // googlecast.debug.log(`Unknown cast state=${JSON.stringify(data.castState)}`);
                break;
        }
        if (plyr && castEvent) {
            const castActive = castEvent === 'castenabled';
            // Add class hook
            toggleClass(plyr.elements.container, plyr.config.classNames.googlecast.active, castActive);
            triggerEvent.call(plyr, plyr.elements.container, castEvent, true);
        }
    },

    sessionStateListener(data) {
        const plyr = googlecast.getCurrentPlyr();
        if (!plyr) {
            return;
        }
        // console.log("Session State Changed: " + JSON.stringify(data));
        const ss = window.cast.framework.SessionState;

        switch (data.sessionState) {
            case ss.NO_SESSION:
                break;
            case ss.SESSION_STARTING:
                break;
            case ss.SESSION_STARTED:
            case ss.SESSION_RESUMED:
                // run on ready
                googlecast.onReady();
                break;
            case ss.SESSION_START_FAILED:
            case ss.SESSION_ENDED:
                break;
            case ss.SESSION_ENDING:
                break;
            default:
                // plyr.log(`Unknown session state=${JSON.stringify(data.sessionState)}`);
                break;
        }
        googlecast.debug.log(`sessionStateListener: state=${data.sessionState}`);
    },

    requestSession(plyr) {
        // Check if a session already exists, if it does, just use it
        const session = googlecast.getCurrentSession();
        let wasPlyrAlreadyBound = true;
        const existingPlyr = googlecast.getCurrentPlyr();
        if (existingPlyr !== undefined && existingPlyr !== plyr) {
            googlecast.unbindPlyr(existingPlyr);
        }
        if (existingPlyr !== plyr) {
            googlecast.setCurrentPlyr(plyr);
            wasPlyrAlreadyBound = false;
        }

        function onRequestSuccess(e) {
            // This only triggers when a new session is created.
            // It does not trigger on successfully showing the drop down and
            // requesting stop session.
        }

        function onError(e) {
            googlecast.unbindPlyr(googlecast.getCurrentPlyr());
        }

        // We need to show the cast drop down if:
        // 1) There was no session
        // 2) There was a session and the current plyr was already bound
        //
        // (2) is needed since we need a way to disable cast via the current
        // plyr instance
        if (session === null || wasPlyrAlreadyBound) {
            const promise = window.cast.framework.CastContext.getInstance().requestSession();
            promise.then(onRequestSuccess, onError);
        } else {
            // We have a session and we're just looking to bind plyr which we've
            // done already. Just load media and change icon based on session state.
            const cs = window.cast.framework.CastContext.getInstance().getCastState();
            const castStateEventData = new window.cast.framework.CastStateEventData(cs);
            googlecast.castStateListener(castStateEventData);

            const ss = window.cast.framework.CastContext.getInstance().getSessionState();
            const sessionStateEventData = new window.cast.framework.SessionStateEventData(session, ss, 0);
            googlecast.sessionStateListener(sessionStateEventData);
        }
    },

    // Display cast container and button (for initialization)
    show() {
        // If there's no cast toggle, bail
        if (!this.elements.buttons.googlecast) {
            return;
        }

        // Try to load the value from storage
        let active = this.storage.googlecast;

        // Otherwise fall back to the default config
        if (!is.boolean(active)) {
            ({ active } = this.googlecast);
        } else {
            this.googlecast.active = active;
        }

        if (active) {
            toggleClass(this.elements.container, this.config.classNames.googlecast.active, true);
            toggleState(this.elements.buttons.googlecast, true);
        }
    },
};
export default googlecast;
