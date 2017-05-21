### Todo

#### To build
[x] Get list of subtitles/captions available (HTML5, Vimeo)
[x] Add preferred quality option into config
[ ] Update quality options on YouTube play
[ ] Update speed options on YouTube load
[ ] Hide unsupported menu items
[ ] Test PiP (need MacOS Sierra)
[ ] Test AirPlay (need MacOS Sierra)
[ ] Add controlshidden controlsshown events
[ ] Test custom controls (with settings support for now)
[ ] Tidy up small UI for iOS inline
[ ] Finish new loop setup and display in seek bar
[ ] Update docs for removal of setup

#### Later
[ ] Get quality options for HTML5 somehow (multi source?)
[ ] Download button - grab first <source> or src attribute (or maybe use currentSrc?) for HTML5 and links for embedded players

#### Bugs
[ ] Fix audio setup bug when calling `.setup()` again
[ ] Fix events on unsupported devices (iOS, old IE)
[x] Fix YouTube rights blocking (origin perhaps?)

# Notes
- No quality HTML5 support (yet)
- No Vimeo quality support
- No YouTube caption support
- Added Vimeo captions support
- No PiP or AirPlay for Vimeo/YouTube
- Settings won't be supported for custom controls (coming soon, need to work on templating)
- Added `playsinline` support for iOS 10
- Embed setup now accepts an <iframe> as the target element for true progressive enhancement

#### Breaking changes
- New config options for loop
- Selectors changes (new `input` and `display` object) - DOCUMENT
- Custom HTML option now `controls` which accepts a string (HTML), a function (your own template engine) or array (use built in controls)
- .setup() is removed in favour of a constructor

## Added
- Seek i8n label
- Loop related i8n labels