import '@videojs/react/video/minimal-skin.css';
// The /spf entry uses Video.js's own streaming engine instead of hls.js, which halves the bundle.
import { MuxVideo } from '@videojs/react/media/mux-video/spf';
import { MinimalVideoSkin, VideoPlayer } from '@videojs/react/video';

// "View From A Blue Moon" trailer, hosted on Mux. The stream carries an English subtitle track and
// the storyboard (timeline thumbnails) is derived from the playback ID automatically.
const playbackId = 'lyrKpPcGfqyzeI00jZAfW6MvP6GNPrkML';
// Poster frame at 2:02 (the player poster is passed explicitly so it is in the pre-rendered HTML).
const posterTime = 129;
export const poster = `https://image.mux.com/${playbackId}/thumbnail.webp?time=${posterTime}`;

export function Player() {
  return (
    <VideoPlayer title="View From A Blue Moon" poster={poster}>
      <MinimalVideoSkin
        className="player aspect-video shadow-2xl shadow-brand/30 dark:shadow-brand/20"
        aria-label="Video player: View From A Blue Moon trailer"
      >
        <MuxVideo source={{ playbackId, poster: { time: posterTime } }} playsInline crossOrigin="anonymous" />
      </MinimalVideoSkin>
    </VideoPlayer>
  );
}
