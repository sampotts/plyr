// ==========================================================================
// Plyr supported types and providers
// ==========================================================================

export const providers = {
  html5: 'html5',
  hlsjs: 'hlsjs',
  dashjs: 'dashjs',
  youtube: 'youtube',
  vimeo: 'vimeo',
};

export const types = {
  audio: 'audio',
  video: 'video',
};

/**
 * Get provider by URL
 * @param {String} url
 */
export function getProviderByUrl(url) {
  // YouTube
  if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(url)) {
    return providers.youtube;
  }

  // Vimeo
  if (/^https?:\/\/player.vimeo.com\/video\/\d{0,9}(?=\b|\/)/.test(url)) {
    return providers.vimeo;
  }

  // Hlsjs
  if (/^https?:\/\/(.*).m3u8(.?)/.test(url)) {
    return providers.hlsjs;
  }
  // Dashjs
  if (/^https?:\/\/(.*).mpd(.?)/.test(url)) {
    return providers.dashjs;
  }

  return null;
}

export default { providers, types };
