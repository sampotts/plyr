import Plyr from '../plyr';

declare namespace Plyr {
  enum YoutubeState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }

  interface PlyrStateChangeEvent extends CustomEvent {
    readonly detail: {
      readonly plyr: Plyr;
      readonly code: YoutubeState;
    };
  }
  interface ProviderEventMap {
    statechange: PlyrStateChangeEvent;
  }
}
