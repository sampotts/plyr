# Changelog

## v1.6.1
- Tooltip changes for accessibility 

## v1.6.0
- New, cleaner, UI:
	- Controls are now overlaid, maintaining the video's ratio and making sizing easier
	- A large play button can now be overlaid over videos
	- Default number of control buttons reduced 
	- New play, pause, rewind and fast forward icons
	- Flexbox all the things!
- Tidied up the LESS (and SCSS) as part of the above, variables and mixins in seprate files amking customization and upgrades easier
- Toggle mute bug fix; if a player was muted previously and the user refreshed, unmuting would have meant volume was still zero (effectively muted), now the config default value is used. Not ideal but good for now
- New `iconUrl` option allowing specifying a same origin SVG sprite location. Loading this way means you don't need the AJAX sprite loading JavaScript
- `click` option renamed to `clickToPlay` to make it a bit more self explanatory. Unfortunately cross origin SVG sprites is not supported in any browser yet :-(
- `hideControls` is now a global option, rather than being exclusive to fullscreen. Controls are now hidden after 2 seconds of no mouse movement. Controls are always shown when media is paused or stopped. This is defaulted to true.
- `sass` folder in `src` renamed from to `scss`

## v1.5.21
- Bug fix for embeds: `play` not being defined (fixes #185 and #186)

## v1.5.20
- Bug fix for autoplay option

## v1.5.19
- Fix for accessing `embed` property after `ready` event fired

## v1.5.18
- Added 'ready' event for initial setup complete or source change occurs
- Fixed SASS stylesheet references to transparentize
- Added default font stack to controls
- Docs fixes inc controls HTML (fixes #180)

## v1.5.17
- Expose YouTube and Vimeo API (docs update required) (Fixes #176)
- Auto set title based on YouTube getVideoData() title property
- Bug fix for Vimeo API change (Uncaught TypeError: Cannot read property 'value' of undefined) due to a change their end

## v1.5.16
- Cancel requests on source change (Fixes #174)

## v1.5.15
- Fix for CustomEvent polyfill and related bug (See #172)

## v1.5.14
- Volume storage fix (Fixes #171)

## v1.5.13
- Fix for manual caption rendering

## v1.5.12
- Added a duration option to pass the duration of the file
- Added the ability to set options per element by setting a data-plyr attribute on the target elements (this might be useful for the duration option for example)
- Fixes for Chrome and Safari caption rendering, they now use the default texttrack and cuechange events
- Firefox bug fix for event not defined

## v1.5.11
- iOS embed bug fixes (fixes #166)
- Hide IE/Edge <input type='range'> tooltip (since we have a styled one) (fixes #160)
- SASS bug fix for default values (fixes #158)

## v1.5.9 + v1.5.10
- NPM bug fixes

## v1.5.8
- Fix for touch device seek tooltip
- Seek improvements

## v1.5.7
- Fix for control tooltips always showing

## v1.5.6
- Seek tooltip (option for tooltips changed, please check docs)
- SASS compile error fixes (fixes #148)
- Fullscreen fixes for controls not always hiding/showing (fixes #149)
- Screen reader icon fixes (title was being read twice due to the tooltip/hidden label)

## v1.5.5
- Fixed controls.md example
- Bug fix for docs error page
- Bug fix for controls tooltips

## v1.5.4
- Minor bug fix for clicking video to play/pause after source change

## v1.5.3
- Minor bug fix for occasional display of 0:00 as the media duration

## v1.5.2
- `handlers` option renamed to `listeners`
- Added event listeners for all types to the plyr container (playback, fullscreen, captions etc - see docs)
- Removed onSetup config option (use the 'setup' event instead, plyr element is event.plyr)
- Style bug fixes
- Vimeo seek bug fix (requires whole seconds when seeking)
- Fix for fullscreen player (using class hook, not browser fullscreen)

## v1.5.1
- Fix for event listeners being duplicated on source change

# v1.5.0
- Vimeo support (fixes #8)
- New options for initialization (you can now pass a selector, HTMLElement or NodeList) (fixes #118)
- Switched to BEM methodology (you will need to change CSS and probably HTML)
- Decoupled CSS and JS hooks (fixes #129)
- Custom controls container (fixes #98)
- Fix for private/incognito mode local storage bug (fixes #131)
- UMD module setup (fixes #121)
- Specify iframe title for Vimeo and YouTube (fixes #124)
- Better handling of mission controls (fixes #132)
- Retain classname on source change (fixes #120)
- Increased thumb size on seek (partially fixes #130)
- Passing no argument to `source` api method, now returns current source (by @gurupras)
- Ability to add custom handlers to controls prior to Plyr bindings (by @gurupras)
- Keyboard navigation improvements (focus on seek, focus trap in fullscreen) (fixes #135)

## v1.3.5
- Fixed bug with API use on basic supported browsers

## v1.3.4
- Code cleanup by @calvintam236

## v1.3.3
- Removed captions being read by screen readers

## v1.3.2
- Voiceover fix for captions

## v1.3.1
- ARIA improvements for captions being read

## v1.3.0
- Internationalization support (i18n) using default controls (required markup changes to controls)
- ARIA enhancements for controls (required markup changes to controls)
- Captions legibility improvements
- YouTube bug fixes

## v1.2.6
- SASS updates and fixes (cheers @ChristianPV)

## v1.2.5
- Fix for YouTube quality (let them decide quality)

## v1.2.4
- Fix for omitted kind attribute on <track> (fixes #88)

## v1.2.3
- Fix for YouTube on iPhone or unsupported browsers (fallback to YouTube native)
- Docs tidy up
- Fullscreen for Safari fix (Fixes #96)

## v1.2.2
- Fix for :focus keyboard vs mouse (Fixes #61)
- Fix for caption positioning in full screen (Fixes #92)

## v1.2.1
- Tooltip bug fix

# v1.2.0
- Added YouTube support

## v1.1.13
- Added icon prefix option for when using default controls

## v1.1.13
- Logic tweaks for hiding controls in fullscreen

## v1.1.12
- Bug fix for Chrome Canary

## v1.1.11
- Bug fix

## v1.1.10
- Bug fix

## v1.1.9
- Bug fix for 1.1.8

## v1.1.8
- setVolume API method improvements (Fixes #83)

## v1.1.7
- Restore classname on destroy()

## v1.1.6
- New API methods (fixes #77), Fix for non strict mode (fixes #78)

## v1.1.5
- Fix for incorrect `isFullscreen()` return value in Mozilla (Fixes #38)

## v1.1.4
- Minor bug fixes

## v1.1.3
- Fixes for random id used in controls with multiple instances and one call to setup
- Audio player UI improvements

## v1.1.2
- Added an onSetup callback option
- Added fullscreen API methods `toggleFullscreen()` (must be user iniated), and `isFullscreen()`

## v1.1.1
- Fix for unsupported browser handling
- Fix for config.controls having no effect

## v1.1.0
- Added config option to set which controls are shown (if using the default controls html) and better handling of missing controls

## v1.0.31
- Display duration on `metadataloaded`

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
