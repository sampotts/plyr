// ==========================================================================
// Browser sniffing
// Unfortunately, due to mixed support, UA sniffing is required
// ==========================================================================

const isIE = Boolean(window.document.documentMode);
const isEdge = /Edge/g.test(navigator.userAgent);
const isWebKit = 'WebkitAppearance' in document.documentElement.style && !/Edge/g.test(navigator.userAgent);
const isIPhone = /iPhone|iPod/gi.test(navigator.userAgent) && navigator.maxTouchPoints > 1;
// navigator.platform may be deprecated but this check is still required
const isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
const isIos = /iPad|iPhone|iPod/gi.test(navigator.userAgent) && navigator.maxTouchPoints > 1;

export default {
  isIE,
  isEdge,
  isWebKit,
  isIPhone,
  isIPadOS,
  isIos,
};
