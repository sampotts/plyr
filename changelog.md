# Changelog

## v1.0.30
- Fixed bug with media longer than 60 minutes (Fixes #69)

## v1.0.29
- Added option to hide controls on fullscreen (default `true`) while palying, after 1s. Pause, mouse hover on progress, or focus on a child control re-shows the controls. On touch a tap of the video (which plays/pauses the video by default) is required. (Fixes #47)
- Fixed a bug with caption toggle in 1.0.28

## v1.0.28
- Added API support for browsers that don't have full plyr support (pretty much <=IE9 and `<video>` on iPhone/iPod)

## v1.0.27
- Keyboard accessibility improvements (Fixes #66)

## v1.0.26
- Fixes for SASS (cheers @brunowego)
- Indentation reset to 4 spaces

## v1.0.25
- Fixes for iOS volume controls (hidden)
- Classnames for left/right controls changed

## v1.0.24
- Added tooltip option to display labels as tooltips (Fixes #50)

## v1.0.23
- Handling loading states in the UI (Fixes #36)

## v1.0.22
- Added support() API method for checking mimetype support
- Added source() API method for setting media source(s) (Fixes #44)
- Added poster() API method for setting poster source
- Refactored captions logic for manual captions

## v1.0.21
- Added an <input type="range"> for seeking to improve experience (and support dragging) (Fixes #40, #42)
- Icons for restart and captions improved (and some IDs changed) (Fixes #49)

## v1.0.20
- Default controls included (Fixes #45)
- Volume changes on `input` as well as `change` (Fixes #43)
- Fix for undefined Play text
- License changed to MIT

## v1.0.19
- Fixed firefox fullscreen issue (Fixes #38)

## v1.0.18
- Added CDN references

## v1.0.17
- SASS support added (thanks to @brunowego)
- Docs completely separated to avoid any confusion
- New gulp tasks (will add more documentation for this)

## v1.0.16
- Aria label is now dynamic

## v1.0.15
- Fix for seek time display in controls
- More documentation for controls html

## v1.0.14
- Minor change for bootstrap compatibility

## v1.0.13
- Minor tweaks

## v1.0.12
- Handle native events (Issue #34)

## v1.0.11
- Bug fixes for fullscreen mode

## v1.0.10
- Bower includes src files now
- Folder re-arrangement

## v1.0.9
- Added buffer progress bar
- Fixed Safari 8 caption track (it needs to be removed from the DOM like in Safari 7)
- Added validation (it works or it doesn't basically) of the `html` option passed

## v1.0.8
- Bug fix

## v1.0.7
- Storing user selected volume in local storage

## v1.0.6
- Fullscreen fallback for older browsers to use "full window"

## v1.0.5
- More minor bug fixes and improvements

## v1.0.4
- Fixed caption legibility issues

## v1.0.3
- Minor bug fixes

## v1.0.2
- Added OGG to <audio> example for Firefox
- Fixed IE11 fullscreen issues

## v1.0.1
- Bug fixes for IE (as per usual)
- Added CSS hooks for media type
- Return instances of Plyr to the element

## v1.0.0
- Initial release