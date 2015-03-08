# Changelog

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