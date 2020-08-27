// ==========================================================================
// DashJS https://reference.dashif.org/dash.js/latest/samples/index.html
// ==========================================================================

import is from './utils/is';
import loadScript from './utils/load-script';
import { setAspectRatio } from './utils/style';

const dashjs = {
  setup() {
    if (!is.function(window.dashjs)) {
      loadScript(this.config.urls.dashjs.sdk)
        .then(() => {
          dashjs.ready.call(this);
        })
        .catch((error) => {
          this.debug.warn('dashjs failed to load', error);
        });
    } else {
      dashjs.ready.call(this);
    }
  },

  ready() {
    if (!this.isDashjs) {
      return;
    }

    const player = this;

    // Set speed options from config
    player.options.speed = player.config.speed.options;

    // Set aspect ratio if fixed
    if (!is.empty(this.config.ratio)) {
      setAspectRatio.call(player);
    }

    const dash = window.dashjs.MediaPlayer().create();
    dash.initialize(player.media, this.config.src, true);
    window.dash = dash;
  },
};

export default dashjs;
