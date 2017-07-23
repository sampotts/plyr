### Todo

#### To finish
[x] Get list of subtitles/captions available (HTML5, Vimeo)
[x] Add preferred quality option into config
[ ] Update quality options on YouTube play
[ ] Update speed options on YouTube load
[ ] Handle quality change for YouTube
[ ] Handle speed change for YouTube
[ ] Set quality when loading YouTube vid
[ ] Set default values
[ ] Hide unsupported menu items on source change
[ ] Test PiP (need MacOS Sierra)
[ ] Test AirPlay (need MacOS Sierra)
[ ] Add `controlshidden` and `controlsshown` events
[ ] Test custom controls still works (without settings support for now)
[ ] Tidy up small UI for iOS inline
[ ] Finish new loop setup and display in seek bar
[ ] Update docs for removal of setup

#### Later
[ ] Wistia player
[ ] Inlined sprite option
[ ] Start / end time options for all players?
[ ] Get quality options for HTML5 somehow (multi source?)
[ ] Download button - grab first <source> or src attribute (or maybe use currentSrc?) for HTML5 and links for embedded players
[ ] Scale captions size based on video size (in lieu of element queries)
[ ] Allow passing YouTube/Vimeo iframe to setup

#### Bugs
[ ] Fix audio setup bug when calling `.setup()` again
[ ] Fix events on unsupported devices (iOS, old IE)
[x] Fix YouTube rights blocking (origin perhaps?)

### Release notes
- No quality HTML5 support (yet)
- No Vimeo quality support
- No YouTube caption support
- Added Vimeo captions support
- No PiP or AirPlay for Vimeo/YouTube
- Settings won't be supported for custom controls (coming soon, need to work on templating)
- Added `playsinline` support for iOS 10
- Embed setup now accepts an <iframe> as the target element for true progressive enhancement

## Changes

### Config changes
- videoWrapper -> video
- embedWrapper -> embed
- setup and ready classes removed

### API changes
- Can now chain most functions (need to document which can)
- support -> supports
- isFullscreen -> fullscreen.active
- new 'language'
- getType -> type
- getEmbed -> embed
- getContainer removed
- getMedia -> media
- getCurrentTime -> media.currentTime
- getVolume -> media.volume
- isMuted -> media.muted
- isLoading -> media.loading
- isPaused -> media.paused
- updatePoster -> poster
- setVolume -> volume
- increaseVolume (new)
- decreaseVolume (new)
- togglePictureInPicture (new)
- airPlay (new)
- Added `.off` API method

#### Other breaking changes
- New config options for loop
- Selectors changes (new `input` and `display` object) - DOCUMENT
- Custom HTML option now `controls` which accepts a string (HTML), a function (your own template engine) or array (use built in controls)
- `.setup()` is removed in favour of a constructor
- `.loadSprite` removed
- `.support` removed

#### Added
- Seek i8n label
- Loop related i8n labels