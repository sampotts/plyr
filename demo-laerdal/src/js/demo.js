// ==========================================================================
// Plyr.io demo
// This code is purely for the https://plyr.io website
// Please see README.md in the root or github.com/sampotts/plyr
// ==========================================================================

import './tab-focus';
import 'custom-event-polyfill';
import 'url-polyfill';

import Plyr from '../../../src/js/plyr';
import sources from './sources';

(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const playerOptions = {
      debug: true,
      title: 'View From A Blue Moon',
      iconUrl: 'dist/demo.svg',
      keyboard: {
        global: true,
      },
      tooltips: {
        controls: true,
      },
      captions: {
        active: true,
      },
      descriptions: {
        active: true,
      },
      previewThumbnails: {
        enabled: true,
        src: ['https://cdn.plyr.io/static/demo/thumbs/100p.vtt', 'https://cdn.plyr.io/static/demo/thumbs/240p.vtt'],
      },
      vimeo: {
        // Prevent Vimeo blocking plyr.io demo site
        referrerPolicy: 'no-referrer',
      },
    };

    // Setup the player
    const videoPlayer = new Plyr('#video-player', playerOptions);
    const audioPlayer = new Plyr('#audio-player', playerOptions);
    const youtubePlayer = new Plyr('#youtube-player', playerOptions);
    const vimeoPlayer = new Plyr('#vimeo-player', playerOptions);

    // Expose for tinkering in the console
    window.videoPlayer = videoPlayer;
    window.audioPlayer = audioPlayer;
    window.youtubePlayer = youtubePlayer;
    window.vimeoPlayer = vimeoPlayer;

    // Set the source
    videoPlayer.source = sources.video;
    audioPlayer.source = sources.audio;
    // youtubePlayer.source = sources.youtube;
    // vimeoPlayer.source = sources.vimeo;
  });
})();
