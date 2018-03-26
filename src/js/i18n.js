// ==========================================================================
// Plyr internationalization
// ==========================================================================

import utils from './utils';

const i18n = {
    get(key = '', config = {}) {
        if (utils.is.empty(key) || utils.is.empty(config) || !Object.keys(config.i18n).includes(key)) {
            return '';
        }

        let string = config.i18n[key];

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
