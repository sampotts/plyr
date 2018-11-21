// ==========================================================================
// Plyr internationalization
// ==========================================================================

import is from './is';
import { getDeep } from './objects';
import { replaceAll } from './strings';
import languages from '../../locales';

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

        const english = languages.filter(function (elem) {
            return elem.code == 'en';
            }
        );

        const locale = languages.filter(function (elem) {
            return !is.empty(config.language) &&
                elem.code == config.language;
            }
        );

        if (!is.empty(locale)) {
            config.i18n = Object.assign({}, english[0].i18n, locale[0].i18n, config.i18n);
        } else {
            config.i18n = Object.assign({}, english[0].i18n, config.i18n);
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

        Object.entries(replace).forEach(([key, value]) => {
            string = replaceAll(string, key, value);
        });

        return string;
    },
};

export default i18n;
