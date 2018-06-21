// ==========================================================================
// Plyr supported types and providers
// ==========================================================================

export const providers = {
    html5: 'html5',
    youtube: 'youtube',
    vimeo: 'vimeo',
};

export const types = {
    audio: 'audio',
    video: 'video',
};

/**
 * Get provider by URL
 * @param {string} url
 */
export function getProviderByUrl(url) {
    // YouTube
    if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(url)) {
        return providers.youtube;
    }

    // Vimeo
    if (/^https?:\/\/player.vimeo.com\/video\/\d{0,9}(?=\b|\/)/.test(url)) {
        return providers.vimeo;
    }

    return null;
}

export default { providers, types };
