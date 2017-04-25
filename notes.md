### Todo

#### To build
[x] Get list of subtitles/captions available (HTML5)
[x] Add preferred quality option into config
[ ] Update quality options on YouTube play (can't get up front?!)
[ ] Update speed options on YouTube load
[ ] Get quality options for HTML5 somehow (multi source?)
[ ] Finish and test PiP (need Sierra VM)
[ ] Finish and test AirPlay (need Sierra VM)
[ ] Download button - grab first <source> or src attribute (or maybe use currentSrc?) for HTML5 and links for embedded players
[ ] Controls hide/show events
[ ] Test custom controls still works

#### Bugs
[ ] Fix audio setup bug when calling .setup() again
[ ] Fix events on unsupported devices (iOS)
[ ] Investigate iOS inline playback
[ ] Look at Vimeo's "background" option
[ ] Fix YouTube rights blocking (origin perhaps?)

# Notes
- No quality HTML5 support (yet)
- No Vimeo quality support
- No Vimeo or YouTube caption support
- No PiP or AirPlay for Vimeo/YouTube
- Settings won't be supported for custom controls (coming soon, need to work on templating)

#### Breaking changes
- New config options for loop
- Selectors changes (new `input` and `display` object) - DOCUMENT
- Custom HTML option now `controls` which accepts a string (HTML), a function (your own template engine) or array (use built in controls)

## Added
- Seek i8n label
- Loop related i8n labels