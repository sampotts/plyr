// ==========================================================================
// Plyr internationalization
// ==========================================================================

import is from './is';
import { getDeep } from './objects';
import { replaceAll } from './strings';

// Skip i18n for abbreviations and brand names
const resources = {
  pip: 'PIP',
  airplay: 'AirPlay',
  html5: 'HTML5',
  vimeo: 'Vimeo',
  youtube: 'YouTube',
};

const i18n = {
  get(key = '', config = {}) {
    if (is.empty(key) || is.empty(config)) {
      return '';
    }

    let string = getDeep(config.i18n, key);

    if (is.empty(string)) {
      if (Object.keys(resources).includes(key)) {
        return resources[key];
      }

      return '';
    }

    const replace = {
      '{seektime}': config.seekTime,
      '{title}': config.title,
    };

    Object.entries(replace).forEach(([k, v]) => {
      string = replaceAll(string, k, v);
    });

    return string;
  },
};

export default i18n;
