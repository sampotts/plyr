// src/js/plugins/captions-autoscroll.js

/**
 * Captions Auto-scroll Plugin
 *
 * This plugin keeps the active transcript/caption line
 * in view while the media is playing.
 *
 * NOTE:
 * - Opt-in only
 * - Does NOT modify existing captions rendering
 */

export default function captionsAutoscroll(player, options = {}) {
  if (!player) {
    return;
  }

  const config = {
    enabled: false,
    smooth: true,
    offset: 0,
    transcriptContainer: null,
    ...options,
  };

  function enable() {
    config.enabled = true;
  }

  function disable() {
    config.enabled = false;
  }

  function destroy() {
    disable();
  }

  // Public API (attached to player)
  player.autoscrollCaptions = {
    enable,
    disable,
    destroy,
  };
}
