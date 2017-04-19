### Todo

#### To build
- Get list of subtitles/captions available (HTML5)
- Add preferred quality option into config
- Update quality options on YouTube play (can't get up front?!)
- Update speed options on YouTube load

- Get quality options for HTML5 somehow (multi source?)
- Build templating for controls somehow
- Finish and test PiP (need Sierra VM)
- Finish and test AirPlay (need Sierra VM)

- Click outside of menu closes it

# Notes
- No quality HTML5 support (yet)
- No Vimeo quality support
- No Vimeo or YouTube caption support
- No PiP or AirPlay for Vimeo/YouTube

#### Bugs
- Fix audio setup bug when calling .setup() again
- Fix events on unsupported devices (iOS)
- Investigate iOS inline playback
- Look at Vimeo's "background" option

#### Breaking changes
- Custom controls HTML removed (temporarily, will return) - perhaps can re-instate but no options UI
- Selectors changes (new `input` and `display` object) - DOCUMENT

## Added
- Seek i8n label
- Loop i8n labels