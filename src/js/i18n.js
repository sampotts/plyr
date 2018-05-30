// ==========================================================================
// Plyr internationalization
// ==========================================================================

import utils from './utils';

const i18n = {
    get(key = '', config = {}) {
        if (utils.is.empty(key) || utils.is.empty(config)) {
            return '';
        }

        let string = key.split('.').reduce((o,i) => o[i] || {}, config.i18n);

        if (utils.is.empty(string)) {
            return '';
        }

        const replace = {
            '{seektime}': config.seekTime,
            '{title}': config.title,
        };

        Object.entries(replace).forEach(([
            key,
            value,
        ]) => {
            string = utils.replaceAll(string, key, value);
        });

        return string;
    },
};

export default i18n;
