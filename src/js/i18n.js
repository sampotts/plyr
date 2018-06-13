// ==========================================================================
// Plyr internationalization
// ==========================================================================

import is from './utils/is';
import { getDeep } from './utils/objects';
import { replaceAll } from './utils/strings';

const i18n = {
    get(key = '', config = {}) {
        if (is.empty(key) || is.empty(config)) {
            return '';
        }

        let string = getDeep(config.i18n, key);

        if (is.empty(string)) {
            return '';
        }

        const replace = {
            '{seektime}': config.seekTime,
            '{title}': config.title,
        };

        Object.entries(replace).forEach(([key, value]) => {
            string = replaceAll(string, key, value);
        });

        return string;
    },
};

export default i18n;
