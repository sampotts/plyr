### Todo

#### To build
[x] Get list of subtitles/captions available (HTML5, Vimeo)
[x] Add preferred quality option into config
[ ] Update quality options on YouTube play (can't get up front?!)
[ ] Update speed options on YouTube load
[ ] Finish and test PiP (need MacOS Sierra)
[ ] Finish and test AirPlay (need MacOS Sierra)
[ ] Controls hide/show events
[ ] Test custom controls still works
[ ] Tidy up small UI for iOS inline
[ ] Finish new loop setup and UI
[ ] Toggle settings menu

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
- Embed setup now accept an <iframe> as the target element for true progressive enhancement

#### Breaking changes
- New config options for loop
- Selectors changes (new `input` and `display` object) - DOCUMENT
- Custom HTML option now `controls` which accepts a string (HTML), a function (your own template engine) or array (use built in controls)
- .setup() is removed in favour of a constructor

## Added
- Seek i8n label
- Loop related i8n labels