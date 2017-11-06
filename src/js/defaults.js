// Default config
const defaults = {
    // Disable
    enabled: true,

    // Custom media title
    title: '',

    // Logging to console
    debug: false,

    // Auto play (if supported)
    autoplay: false,

    // Default time to skip when rewind/fast forward
    seekTime: 10,

    // Default volume
    volume: 1,
    muted: false,

    // Display the media duration
    displayDuration: true,

    // Click video to play
    clickToPlay: true,

    // Auto hide the controls
    hideControls: true,

    // Revert to poster on finish (HTML5 - will cause reload)
    showPosterOnEnd: false,

    // Disable the standard context menu
    disableContextMenu: true,

    // Sprite (for icons)
    loadSprite: true,
    iconPrefix: 'plyr',
    iconUrl: 'https://cdn.plyr.io/2.0.10/plyr.svg',

    // Blank video (used to prevent errors on source change)
    blankVideo: 'https://cdn.plyr.io/static/blank.mp4',

    // Pass a custom duration
    duration: null,

    // Aspect ratio (for embeds)
    ratio: '16:9',

    // Quality default
    quality: {
        default: 'default',
        options: ['hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny', 'default'],
    },

    // Set loops
    loop: {
        active: false,
        start: null,
        end: null,
    },

    // Speed default and options to display
    speed: {
        default: 1,
        options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    },

    // Keyboard shortcut settings
    keyboard: {
        focused: true,
        global: false,
    },

    // Display tooltips
    tooltips: {
        controls: false,
        seek: true,
    },

    // Captions settings
    captions: {
        active: false,
        language: window.navigator.language.split('-')[0],
    },

    // Fullscreen settings
    fullscreen: {
        enabled: true, // Allow fullscreen?
        fallback: true, // Fallback for vintage browsers
    },

    // Local storage
    storage: {
        enabled: true,
        key: 'plyr',
    },

    // Default controls
    controls: [
        'play-large',
        'play',
        'progress',
        'current-time',
        'mute',
        'volume',
        'captions',
        'settings',
        'pip',
        'airplay',
        'fullscreen',
    ],
    settings: ['captions', 'quality', 'speed', 'loop'],

    // Localisation
    i18n: {
        restart: 'Restart',
        rewind: 'Rewind {seektime} secs',
        play: 'Play',
        pause: 'Pause',
        forward: 'Forward {seektime} secs',
        seek: 'Seek',
        played: 'Played',
        buffered: 'Buffered',
        currentTime: 'Current time',
        duration: 'Duration',
        volume: 'Volume',
        toggleMute: 'Toggle Mute',
        toggleCaptions: 'Toggle Captions',
        toggleFullscreen: 'Toggle Fullscreen',
        frameTitle: 'Player for {title}',
        captions: 'Captions',
        settings: 'Settings',
        speed: 'Speed',
        quality: 'Quality',
        loop: 'Loop',
        start: 'Start',
        end: 'End',
        all: 'All',
        reset: 'Reset',
        none: 'None',
        disabled: 'Disabled',
    },

    // URLs
    urls: {
        vimeo: {
            api: 'https://player.vimeo.com/api/player.js',
        },
        youtube: {
            api: 'https://www.youtube.com/iframe_api',
        },
    },

    // Custom control listeners
    listeners: {
        seek: null,
        play: null,
        pause: null,
        restart: null,
        rewind: null,
        forward: null,
        mute: null,
        volume: null,
        captions: null,
        fullscreen: null,
        pip: null,
        airplay: null,
        speed: null,
        quality: null,
        loop: null,
        language: null,
    },

    // Events to watch and bubble
    events: [
        // Events to watch on HTML5 media elements and bubble
        // https://developer.mozilla.org/en/docs/Web/Guide/Events/Media_events
        'ended',
        'progress',
        'stalled',
        'playing',
        'waiting',
        'canplay',
        'canplaythrough',
        'loadstart',
        'loadeddata',
        'loadedmetadata',
        'timeupdate',
        'volumechange',
        'play',
        'pause',
        'error',
        'seeking',
        'seeked',
        'emptied',
        'ratechange',
        'cuechange',

        // Custom events
        'enterfullscreen',
        'exitfullscreen',
        'captionsenabled',
        'captionsdisabled',
        'captionchange',
        'controlshidden',
        'controlsshown',
        'ready',

        // YouTube
        'statechange',
        'qualitychange',
        'qualityrequested',
    ],

    // Selectors
    // Change these to match your template if using custom HTML
    selectors: {
        editable: 'input, textarea, select, [contenteditable]',
        container: '.plyr',
        controls: {
            container: null,
            wrapper: '.plyr__controls',
        },
        labels: '[data-plyr]',
        buttons: {
            play: '[data-plyr="play"]',
            pause: '[data-plyr="pause"]',
            restart: '[data-plyr="restart"]',
            rewind: '[data-plyr="rewind"]',
            forward: '[data-plyr="fast-forward"]',
            mute: '[data-plyr="mute"]',
            captions: '[data-plyr="captions"]',
            fullscreen: '[data-plyr="fullscreen"]',
            pip: '[data-plyr="pip"]',
            airplay: '[data-plyr="airplay"]',
            settings: '[data-plyr="settings"]',
            loop: '[data-plyr="loop"]',
        },
        inputs: {
            seek: '[data-plyr="seek"]',
            volume: '[data-plyr="volume"]',
            speed: '[data-plyr="speed"]',
            language: '[data-plyr="language"]',
            quality: '[data-plyr="quality"]',
        },
        display: {
            currentTime: '.plyr__time--current',
            duration: '.plyr__time--duration',
            buffer: '.plyr__progress--buffer',
            played: '.plyr__progress--played',
            loop: '.plyr__progress--loop',
            volume: '.plyr__volume--display',
        },
        progress: '.plyr__progress',
        captions: '.plyr__captions',
        menu: {
            quality: '.js-plyr__menu__list--quality',
        },
    },

    // Class hooks added to the player in different states
    classNames: {
        video: 'plyr__video-wrapper',
        embed: 'plyr__video-embed',
        control: 'plyr__control',
        type: 'plyr--{0}',
        stopped: 'plyr--stopped',
        playing: 'plyr--playing',
        muted: 'plyr--muted',
        loading: 'plyr--loading',
        hover: 'plyr--hover',
        tooltip: 'plyr__tooltip',
        hidden: 'plyr__sr-only',
        hideControls: 'plyr--hide-controls',
        isIos: 'plyr--is-ios',
        isTouch: 'plyr--is-touch',
        uiSupported: 'plyr--full-ui',
        menu: {
            value: 'plyr__menu__value',
            badge: 'plyr__badge',
        },
        captions: {
            enabled: 'plyr--captions-enabled',
            active: 'plyr--captions-active',
        },
        fullscreen: {
            enabled: 'plyr--fullscreen-enabled',
            fallback: 'plyr--fullscreen-fallback',
        },
        pip: {
            supported: 'plyr--pip-supported',
            active: 'plyr--pip-active',
        },
        airplay: {
            supported: 'plyr--airplay-supported',
            active: 'plyr--airplay-active',
        },
        tabFocus: 'plyr__tab-focus',
    },
};

export default defaults;
