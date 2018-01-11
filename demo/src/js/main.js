// ==========================================================================
// Plyr.io demo
// This code is purely for the plyr.io website
// Please see readme.md in the root or github.com/selz/plyr
// ==========================================================================

/*global plyr*/

// General functions
(function() {
    //document.body.addEventListener('ready', function(event) { console.log(event); });

    var myPlaylist = [
        {
            type: 'youtube',
            title: 'Charlie Puth - Attention [Official Video]',
            author: 'Charlie Puth',
            sources: [
                {
                    src: 'nfs8NYg7yQM',
                    type: 'youtube',
                }],
            src: 'nfs8NYg7yQM',
            poster: 'https://img.youtube.com/vi/nfs8NYg7yQM/hqdefault.jpg',
        },
        {
            type: 'youtube',
            title: 'Armin van Buuren live at Ultra Music Festival Miami 2017',
            author: 'Armin van Buuren',
            sources: [
                {
                    src: 'cLcKew4cQq4',
                    type: 'youtube',
                }],
            poster: 'https://img.youtube.com/vi/cLcKew4cQq4/hqdefault.jpg',
        },
        {
            type: 'youtube',
            title: '2 hours Trance Music - Armin Van Buuren',
            author: 'Armin van Buuren',
            sources: [
                {
                    src: 'https://www.youtube.com/watch?v=r6KXy0j85AM',
                    type: 'youtube',
                }],
            poster: 'https://img.youtube.com/vi/r6KXy0j85AM/hqdefault.jpg',
        },
        {
            type: 'audio',
            title: 'Clublife by Tiësto 542 podcast ',
            author: 'Tiësto',
            sources: [
                {
                    src: 'http://feed.pippa.io/public/streams/593eded1acfa040562f3480b/episodes/59c0c870ed6a93163c0a193d.m4a',
                    type: 'm4v',
                }],
            poster: 'https://img.youtube.com/vi/r6KXy0j85AM/hqdefault.jpg',
        },
        {
            type: 'audio',
            title: 'Vocal Trance Vol 261',
            author: 'Sonnydeejay',
            sources: [
                {
                    src: 'http://archive.org/download/SonnydeejayVocalTranceVol261/Sonnydeejay%20-Vocal%20Trance%20vol%20261.mp3',
                    type: 'mp3',
                }],
            poster: 'http://4.bp.blogspot.com/-d6IPBUIj6YE/ThpRaIGJXtI/AAAAAAAABQ8/54RNlCrKCv4/s1600/podcast.jpg',
        },
        {
            type: 'youtube',
            title: '2 hours Trance Music - Armin Van Buuren',
            author: 'Armin van Buuren',
            sources: [
                {
                    src: 'https://www.youtube.com/watch?v=r6KXy0j85AM',
                    type: 'youtube',
                }],
            poster: 'https://img.youtube.com/vi/r6KXy0j85AM/hqdefault.jpg',
        },
        {
            type: 'youtube',
            title: '2 hours Trance Music - Armin Van Buuren',
            author: 'Armin van Buuren',
            sources: [
                {
                    src: 'https://www.youtube.com/watch?v=r6KXy0j85AM',
                    type: 'youtube',
                }],
            poster: 'https://img.youtube.com/vi/r6KXy0j85AM/hqdefault.jpg',
        },
        {
            type: 'youtube',
            title: '2 hours Trance Music - Armin Van Buuren',
            author: 'Armin van Buuren',
            sources: [
                {
                    src: 'https://www.youtube.com/watch?v=r6KXy0j85AM',
                    type: 'youtube',
                }],
            poster: 'https://img.youtube.com/vi/r6KXy0j85AM/hqdefault.jpg',
        },
        {
            type: 'youtube',
            title: '2 hours Trance Music - Armin Van Buuren',
            author: 'Armin van Buuren',
            sources: [
                {
                    src: 'https://www.youtube.com/watch?v=r6KXy0j85AM',
                    type: 'youtube',
                }],
            poster: 'https://img.youtube.com/vi/r6KXy0j85AM/hqdefault.jpg',
        },
        {
            type: 'youtube',
            title: '2 hours Trance Music - Armin Van Buuren',
            author: 'Armin van Buuren',
            sources: [
                {
                    src: 'https://www.youtube.com/watch?v=r6KXy0j85AM',
                    type: 'youtube',
                }],
            poster: 'https://img.youtube.com/vi/r6KXy0j85AM/hqdefault.jpg',
        },
        {
            type: 'youtube',
            title: '2 hours Trance Music - Armin Van Buuren',
            author: 'Armin van Buuren',
            sources: [
                {
                    src: 'https://www.youtube.com/watch?v=r6KXy0j85AM',
                    type: 'youtube',
                }],
            poster: 'https://img.youtube.com/vi/r6KXy0j85AM/hqdefault.jpg',
        },
        {
            type: 'youtube',
            title: '2 hours Trance Music - Armin Van Buuren',
            author: 'Armin van Buuren',
            sources: [
                {
                    src: 'https://www.youtube.com/watch?v=r6KXy0j85AM',
                    type: 'youtube',
                }],
            poster: 'https://img.youtube.com/vi/r6KXy0j85AM/hqdefault.jpg',
        },
    ];

    // Setup the player
    var instances = plyr.setup({
        debug: false,
        title: 'Video demo',
        iconUrl: '../dist/plyr.svg',
        tooltips: {
            controls: true,
        },
        captions: {
            defaultActive: true,
        },
    });
    plyr.loadSprite('dist/demo.svg');

    // Plyr returns an array regardless
    var player = instances[0];

    // Setup type toggle
    var buttons = document.querySelectorAll('[data-source]'),
        types = {
            video: 'video',
            youtube: 'youtube',
            vimeo: 'vimeo',
        },
        currentType = window.location.hash.replace('#', ''),
        historySupport = window.history && window.history.pushState;

    // Bind to each button
    for (var i = buttons.length - 1; i >= 0; i--) {
        buttons[i].addEventListener('click', function() {
            var type = this.getAttribute('data-source');

            newSource(type);

            if (historySupport) {
                history.pushState({type: type}, '', '#' + type);
            }
        });
    }

    // List for backwards/forwards
    window.addEventListener('popstate', function(event) {
        if (event.state && 'type' in event.state) {
            newSource(event.state.type);
        }
    });

    // On load
    if (historySupport) {
        var video = !currentType.length;

        // If there's no current type set, assume video
        if (video) {
            currentType = types.video;
        }

        // Replace current history state
        if (currentType in types) {
            history.replaceState({type: currentType}, '',
                video ? '' : '#' + currentType);
        }

        // If it's not video, load the source
        if (currentType !== types.video) {
            newSource(currentType, true);
        }
    }

    // Toggle class on an element
    function toggleClass(element, className, state) {
        if (element) {
            if (element.classList) {
                element.classList[state ? 'add' : 'remove'](className);
            } else {
                var name = (' ' + element.className + ' ').replace(/\s+/g, ' ').
                    replace(' ' + className + ' ', '');
                element.className = name + (state ? ' ' + className : '');
            }
        }
    }

    // Set a new source
    function newSource(type, init) {
        // Bail if new type isn't known, it's the current type, or current type is empty (video is default) and new type is video
        if (!(type in types) || (!init && type === currentType) ||
            (!currentType.length && type === types.video)) {
            return;
        }

        switch (type) {
            case types.video:
                player.source({
                    type: 'video',
                    title: 'View From A Blue Moon',
                    sources: [
                        {
                            src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.mp4',
                            type: 'video/mp4',
                        },
                        {
                            src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.webm',
                            type: 'video/webm',
                        },
                    ],
                    poster: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
                    tracks: [
                        {
                            kind: 'captions',
                            label: 'English',
                            srclang: 'en',
                            src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt',
                            default: true,
                        },
                    ],
                });
                break;

            case types.youtube:
                player.source({
                    type: 'video',
                    title: 'View From A Blue Moon',
                    sources: [
                        {
                            src: 'bTqVqk7FSmY',
                            type: 'youtube',
                        },
                    ],
                });
                break;

            case types.vimeo:
                player.source({
                    type: 'video',
                    title: 'View From A Blue Moon',
                    sources: [
                        {
                            src: '147865858',
                            type: 'vimeo',
                        },
                    ],
                });
                break;
        }

        // Set the current type for next time
        currentType = type;

        // Remove active classes
        for (var x = buttons.length - 1; x >= 0; x--) {
            toggleClass(buttons[x].parentElement, 'active', false);
        }

        // Set active on parent
        toggleClass(document.querySelector('[data-source="' + type +
            '"]').parentElement, 'active', true);
    }
})();