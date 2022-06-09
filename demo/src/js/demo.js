import Plyr from '../../../src/js/plyr';
import Detachable from './detachableContainer';
import sources from './sources';

(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const selector = '#player';
    // Setup the player
    const playerConfig = {
      debug: true,
      ads: {
        enabled: true,
        publisherId: '',
        tagUrl: 'https://s.adtelligent.com/?aid=331133&width=640&height=480&domain=test.com',
      },
    };
    const player = new Plyr(selector, playerConfig);
    player.source = sources.video;
    const _ = new Detachable('#playerContainer');
    // Expose for tinkering in the console
    window.player = player;
    window.sources = sources;
  });
})();
