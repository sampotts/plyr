// ==========================================================================
// Smoke tests for the Plyr player source (src/js), run with `pnpm test`.
// jsdom has no media playback, so play(), pause(), load() and the paused state are mocked on HTMLMediaElement.
// ==========================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import Plyr from '../src/js/plyr';

// Options shared by every test: don't fetch the SVG sprite over the network.
const options = { loadSprite: false };

// Mock media playback: play() and pause() update the paused state and fire the real media events.
function mockPlayback() {
  const paused = new WeakMap();
  vi.spyOn(HTMLMediaElement.prototype, 'paused', 'get').mockImplementation(function getPaused() {
    return paused.has(this) ? paused.get(this) : true;
  });
  const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function mockPlay() {
    paused.set(this, false);
    this.dispatchEvent(new Event('play'));
    this.dispatchEvent(new Event('playing'));
    return Promise.resolve();
  });
  const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function mockPause() {
    paused.set(this, true);
    this.dispatchEvent(new Event('pause'));
  });
  // destroy() calls load() to reset the media; jsdom doesn't implement it.
  vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
  return { play, pause };
}

// Create a <video> in the document and set up a player on it, resolving once Plyr fires `ready`.
function createPlayer() {
  document.body.innerHTML = '<video id="player" playsinline><source src="video.mp4" type="video/mp4"></video>';
  const video = document.getElementById('player');
  const player = new Plyr(video, options);
  const ready = new Promise((resolve) => player.once('ready', resolve));
  return { video, player, ready };
}

describe('Plyr smoke tests', () => {
  let media;
  let current;

  beforeEach(() => {
    media = mockPlayback();
  });

  afterEach(() => {
    current?.destroy();
    current = null;
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('creates a player on a <video> element', () => {
    const { video, player } = createPlayer();
    current = player;

    expect(player.isHTML5).toBe(true);
    expect(player.isVideo).toBe(true);
    expect(player.media).toBe(video);
    expect(video.plyr).toBe(player);
    expect(player.elements.container.classList.contains('plyr')).toBe(true);
    expect(player.elements.container.contains(video)).toBe(true);
  });

  it('renders the default controls', () => {
    const { player } = createPlayer();
    current = player;
    const { container } = player.elements;
    const control = (name) => container.querySelector(`[data-plyr="${name}"]`);

    expect(container.querySelector('.plyr__controls')).not.toBeNull();
    expect(container.querySelector('.plyr__control--overlaid')).not.toBeNull(); // play-large
    expect(container.querySelectorAll('[data-plyr="play"]')).toHaveLength(2); // play-large and play
    expect(control('seek')).not.toBeNull();
    expect(container.querySelector('.plyr__time--current')).not.toBeNull();
    expect(control('mute')).not.toBeNull();
    expect(control('volume')).not.toBeNull();
    expect(control('settings')).not.toBeNull();
    expect(control('fullscreen')).not.toBeNull();
  });

  it('play() starts the media and marks the player as playing', async () => {
    const { player, ready } = createPlayer();
    current = player;
    await ready;

    await player.play();

    expect(media.play).toHaveBeenCalledTimes(1);
    expect(player.playing).toBe(true);
    expect(player.elements.container.classList.contains('plyr--playing')).toBe(true);
  });

  it('pause() pauses the media after playing', async () => {
    const { player, ready } = createPlayer();
    current = player;
    await ready;

    await player.play();
    player.pause();

    expect(media.pause).toHaveBeenCalledTimes(1);
    expect(player.playing).toBe(false);
    expect(player.paused).toBe(true);
    expect(player.elements.container.classList.contains('plyr--paused')).toBe(true);
  });

  it('passes media events to player.on() handlers', async () => {
    const { player, ready } = createPlayer();
    current = player;
    await ready;
    const onPlay = vi.fn();
    player.on('play', onPlay);

    await player.play();

    expect(onPlay).toHaveBeenCalledTimes(1);
    expect(onPlay.mock.calls[0][0].detail.plyr).toBe(player);
  });
});
