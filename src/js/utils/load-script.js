// ==========================================================================
// Load an external script
// ==========================================================================

import loadjs from 'loadjs';

export default function loadScript(url) {
    return new Promise((resolve, reject) => {
        loadjs(url, {
            success: resolve,
            error: reject,
        });
    });
}
