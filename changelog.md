### v3.4.7

-   Fix for Vimeo fullscreen with non native aspect ratios (fixes #854)

### v3.4.6

-   Added picture-in-picture support for Chrome 70+
-   Fixed issue with versioning the SVG sprite in the gulp build script

### v3.4.5

-   Added download button option to download either current source or a custom URL you specify in options
-   Prevent immediate hiding of controls on mobile (thanks @jamesoflol)
-   Don't hide controls on focusout event (fixes #1122) (thanks @jamesoflol)
-   Fix HTML5 quality settings being incorrectly set in local storage (thanks @TechGuard)

### v3.4.4

-   Fixed issue with double binding for `click` and `touchstart` for `clickToPlay` option
-   Improved "faux" fullscreen on iPhone X/XS phones with notch
-   Babel 7 upgrade (which reduced the polyfilled build by ~10kb!)

### v3.4.3

-   Fixed issue with nodeList for custom playback controls

### v3.4.2

-   Fix play/pause button state

### v3.4.1

-   Bug fix for custom controls (fixes #1161)

## v3.4.0

-   Accessibility improvements (see #905)
-   Improvements to the way the controls work on iOS
-   Demo code clean up
-   YouTube quality selection removed due to their poor support for it. As a result, the `qualityrequested` event has been removed
-   Controls spacing improvements
-   Fix for pressed property missing with custom controls (Fixes #1062)
-   Fix #1153: Captions language fallback (thanks @friday)
-   Fix for setting pressed property of undefined (Fixes #1102)

### v3.3.23

-   Add support for YouTube's hl param (thanks @renaudleo)
-   Fix for captions positioning when no controls (thanks @friday and @mjfwebb)
-   Fix #1108: Make sure youtube.onReady doesn't run twice (thanks @friday)
-   Fix for WebKit redraw loop on the `<input type="range">` elements

### v3.3.22

-   Travis & CI improvements (thanks @friday)
-   Add navigator.languages fallback for iOS 9 (thanks @friday)

### v3.3.21

-   Hide currentTime and progress for streams (thanks @mimse)
-   Fixed condition check (thanks @mimse)
-   Handle undefined this.player.elements.buttons.play (thanks @klassicd)
-   Fix captions.toggle() if there is no toggle button (thanks @friday)

### v3.3.20

-   Fix for bug where controls wouldn't show on hover over YouTube video

### v3.3.19

-   Remove `pointer-events: none` on embed `<iframe>` to comply with YouTube ToS

### 3.3.18

-   Ads are now only supported on HTML5 videos as it violates terms of service for YouTube and Vimeo 😢
-   Fix i18n defaults path on README (thanks @meyt!)
-   Minor increaseVolume and decreaseVolume changes (thanks @friday!)

### v3.3.17

-   Fix YouTube muting after seeking with the progress slider (thanks @friday!)
-   Respect preload="none" when setting quality if the media hasn't been loaded some other way (thanks @friday!)

### v3.3.16

-   Fixed regression relating the play button status (fixes #1048)

### v3.3.15

-   Fix for error relating to play buttons when switching source

### v3.3.14

-   Fix sprite loading regression

### v3.3.13

You guessed it, a load of awesome changes from contributors:

Thanks @friday for the following:

-   Captions fixes
-   Fix poster race conditions
-   Minor code improvements for quality switching
-   Minor event changes
-   Fix condition in events.toggleListener to allow non-elements
-   Suggestion: Remove array newline rule
-   Contributions improvements

-   fix: html5.cancelRequest not remove source tag correctly (thanks @a60814billy)
-   remove event listeners in destroy() (thanks @cky917)
-   Fix markdown in README (thanks @azu)
-   Some parts of the accessibility improvements outlined in #905 (more on the way...)
-   Fix for bug where volume slider didn't always show

### v3.3.12

-   Fix synthetic event bubble/proxy loses detail (thanks @friday!)
-   Make utils static (thanks @friday!)
-   Fix for YouTube and Vimeo pausing after seek (thanks @friday!)
-   Vimeo: Update playback state and assure events are triggered on load (thanks @friday!)
-   Captions rewrite (use index internally to support missing or duplicate languages) (thanks @friday and @philipgiuliani!)
-   Contributing document and codepen demo updates (thanks @friday!)
-   Fix for after clicking on the progress bar, keyboard operations will not work (thanks @cky917!)

### v3.3.10

-   Fix for buffer display alignment and incorrect BEM classname
-   Fix for playback not resuming position after quality swap (fixes #991, thanks @philipgiuliani!)
-   Travis integration (thanks @friday!)
-   Translate quality badges and quality names (thanks @philipgiuliani!)
-   Improve captions handling for streaming (thanks @friday!)
-   Call duration update method manually if user config has duration (thanks @friday!)

### v3.3.9

Again, more changes from @friday!

-   Restore window reference in `is.cue()`
-   Fix InvalidStateError and IE11 issues
-   Respect storage being disabled for storage getter

### v3.3.8

Many changes here thanks to @friday:

-   Added missing URL polyfill
-   Pause while seeking to mimic default HTML5 behaviour
-   Add `seeked` event listener to update progress (fixes #966)
-   Trigger seeked event in youtube plugin if either playing or paused (fixes #921)
-   Fix for YouTube and Vimeo autoplays on seek (fixes #876)
-   Toggle controls improvements
-   Cleanup unused code
-   Poster image loading improvements
-   Fix for seek tooltip vs click accuracy

### v3.3.7

-   Poster fixes (thanks @friday)
-   Grid tweak

### v3.3.6

-   Vimeo fixes for mute state
-   Vimeo ID fix (fixes #945)
-   Use `<div>` for poster container
-   Tooltip fixes for unicode languages (fixes #943)

### v3.3.5

-   Removed `.load()` call as it breaks HLS (see #870)

### v3.3.4

-   Fix for controls sometimes not showing while video is playing
-   Fixed logic for show home tab on option select

### v3.3.3

-   Reverted change to show home tab on option select due to usability regression

### v3.3.2

-   Fix for ads running in audio
-   Fix for setting poster on source change

## v3.3.0

-   Now using a custom poster image element to hide the YouTube play button and give more control over when the poster image shows
-   Renamed `showPosterOnEnd` to `resetOnEnd` as it makes more sense and now works for all players and does not reload media
-   Fix for same domain SVG URLs (raised by Jochem in Slack)
-   [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/Window/URL) is polyfill now required
-   Added pause className (fixes #941)
-   Button height set in CSS (auto) (fixes #928)
-   Don't autoplay cloned original media (fixes #936)
-   Return to the home menu pane after selecting an option

### v3.2.4

-   Fix issue wher player never reports as ready if controls is empty array
-   Fix issue where screen reader labels were removed from time displays
-   Fix issue where custom controls placeholders were not populated
-   Custom controls HTML example updated
-   Fix for aria-label being set to the initial state on toggle buttons, overriding the inner labels
-   Fix for hidden mute button on iOS (not functional for Vimeo due to API limitations) (fixes #656)

### v3.2.3

-   Fix for iOS 9 throwing error for `name` property in fullscreen API (fixes #908)

### v3.2.2

-   Fix for regression in 3.2.1 resulting in hidden buffer display (fixes #920)
-   Cleaned up incorrect use of `aria-hidden` attribute

### v3.2.1

-   Accessibility improvements for the controls (part of #905 fixes)
-   Fix for context menu showing on YouTube (thanks Anthony Recenello in Slack)
-   Vimeo fix for their API not returning the right duration until playback begins (fixes #891)

## v3.2.0

-   Fullscreen fixes (thanks @friday)
-   Menu fix for if speed not in config
-   Menu z-index fix (thanks @danielsarin)
-   i18n fix for missing "Normal" string (thanks @danielsarin)
-   Safer check for active caption (thanks @Antonio-Laguna)
-   Add custom property fallback (thanks @friday)
-   Fixed bug for captions with no srclang and labels and improved logic (fixes #875)
-   Fix for `playing` false positive (fixes #898)
-   Fix for IE issue with navigator.language (thanks @nicolasthy) (fixes #893)
-   Fix for Vimeo controls missing on iOS (thanks @verde-io) (fixes #807)
-   Fix for double vimeo caption rendering (fixes #877)

## v3.1.0

-   Styling fixes
-   YouTube playback speed fixes
-   HTML5 quality selection
-   Improvements to the YouTube quality selection

### v3.0.11

-   Muted and autoplay fixes
-   Small bug fixes from Sentry logs

### v3.0.10

-   Docs fix
-   Package upgrades

### v3.0.9

-   Demo fix
-   Fix Vimeo regression

### v3.0.8

-   Vimeo hotfix for private videos

### v3.0.7

-   Fix for keyboard shortcut error with fast forward
-   Fix for Vimeo trying to set playback rate when not allowed

### v3.0.6

-   Improved the logic for the custom handlers preventing default handlers

### v3.0.5

-   Removed console messages

### v3.0.4

-   Fixes for fullscreen not working inside iframes
-   Fixes for custom handlers being able to prevent default
-   Fixes for controls not hiding/showing correctly on Mobile Safari

### v3.0.3

-   Vimeo offset tweak (fixes #826)
-   Fix for .stop() method (fixes #819)
-   Check for array for speed options (fixes #817)
-   Restore as float (fixes #828)
-   Fix for Firefox fullscreen oddness (Fixes #821)
-   Improve Sprite checking (fixes #827)
-   Fix fast-forward control (thanks @saadshahd)
-   Fix the options link in the readme (thanks @DanielRuf)

### v3.0.2

-   Fix for Safari not firing error events when trying to load blocked scripts

### v3.0.1

-   Fix for trying to accessing local storage when it's blocked

# v3.0.0

This is a massive release. A _mostly_ complete rewrite in ES6. What started out as a few changes quickly snowballed. There's many breaking changes so be careful upgrading.

### Big changes

-   New settings menu complete with funky animations
-   Ability to adjust speed of playback
-   Ability to toggle caption language (HTML5 and Vimeo only)
-   Ability to set YouTube quality (HTML5 will follow)
-   Added support for Vimeo captions
-   Added Picture-in-Picture support (Safari only)
-   Added AirPlay support (again, Safari only)
-   Added `playsinline` support for iOS 10+
-   Soundcloud removed until I can work on a plugin framework
-   Embedded players are now progressively enhanced - no more empty `<div>`s!

### Other stuff

-   Now using SASS exclusively. Sorry, LESS folk it just made sense to maintain one method as SASS is what the cool kids use. It may come back if we work out an automated way to convert the SASS
-   Moved to ES6. All the rage these days. You'll need to look at polyfills. The demo uses [polyfill.io](https://polyfill.io)
-   Added basic looping support
-   Added an aspect ratio option for those that can't leave the 90s and want 4:3
-   `controlshidden` and `controlsshown` events added for when the controls show or hide
-   `qualityrequested` and `qualitychange` events for YouTube quality control (HTML5 will follow)
-   Volume is now `0` to `1` as per HTML5 spec
-   No longer bodging a `<progress>` behind the `<input type="range">` to make up for WebKit's lack of lower fill styling
-   Captions now render with line breaks as intended
-   Captions now render without AJAX using the native events etc
-   Added a fallback for getting YouTube video data incase `.getVideoData()` disappears when one of their developers randomly deletes it again
-   Setup and building of the UI should be way "snappier"
-   Click to toggle inverted time (e.g. 0:01 or -2:59 for a 3 minute video at 1 seconds) - new `toggleInvert` and `invertTime` options
-   Added `autopause` option for Vimeo
-   Added `muted` option for you guessed it, muted playback
-   Restored the `.off()` API method
-   `.play()` will now return a promise to prevent that pesky uncaught promise issue in Chrome etc
-   Pressing and hold the seek bar no longer freezes all other updates of the UI

...plus loads of bug fixes.

### Breaking changes

You gotta break eggs to make an omelette. Sadly, there's quite a few breaking changes:

-   Setup now uses proper constructor, accepts a single selector/element/node and returns a single instance - much simpler than before
-   Much of the API is now using getters and setters rather than methods (where it makes sense) to match the HTML5 API - see the docs for more info
-   The data attributes for the embeds are now `data-plyr-provider` and `data-plyr-embed-id` to prevent compatibility issues. These can be changed under `config.attributes.embed` if required
-   `blankUrl` -> `blankVideo`
-   `volume` is now `0` to `1` as per HTML5 spec
-   `keyboardShorcuts` (typo) is now just `keyboard`
-   `loop` is now `loop.active` in preparation for loop enhancements later
-   `html` option for custom controls removed in favour of the `controls` option which now accepts an array (to use built in controls) or a string of HTML for custom controls.
-   `classes` -> `classNames`
-   `classes.videoWrapper` -> `classNames.video`
-   `classes.embedWrapper` -> `classNames.embed`
-   `classes.ready` removed
-   `classes.setup` removed
-   `classes.muted` removed
-   `classes.fullscreen.active` removed in favour of the `:fullscreen` selector
-   `selectors.html5` removed
-   `selectors.embed` removed
-   `selectors.buttons.seek` -> `selectors.inputs.seek`
-   `selectors.volume.input` -> `selectors.inputs.volume`
-   `selectors.volume.display` -> `selectors.display.volume`
-   `selectors.currentTime` -> `selectors.display.currentTime`
-   `selectors.duration` -> `selectors.display.duration`

### Polyfilling

Because we're using the fancy new ES6 syntax, you will need to polyfill for vintage browsers if you want to use Plyr and still support them. Luckily there's a decent service for this that makes it painless, [polyfill.io](https://polyfill.io). Alternatively, you can use the prebuilt polyfilled build but bear in mind this is 20kb larger. I'd suggest working our your own polyfill strategy.

### v2.0.18

-   Fix for YouTube .getVideoData() issue (fixes #709)

### v2.0.17

-   Vimeo controls fix (fixes #697)
-   SVG4everybody compatibility fix
-   Allow Plyr.setup event listeners to be set up as separate event listeners (https://github.com/sampotts/plyr/pull/703)
-   Added title to the layer html template (for custom controls) (https://github.com/sampotts/plyr/pull/649)
-   Target is null bug fix (https://github.com/sampotts/plyr/pull/617)
-   fix #684 memory leaks issues after destroy (https://github.com/sampotts/plyr/pull/700)

### v2.0.16

-   Fullscreen bug fix (fixes #664)

### v2.0.15

-   Demo fix

### v2.0.14

-   CDN URL updates. Sorry, still working on V3 as hard as I can...

### v2.0.13

-   Repo moved and Vimeo demo fix

### v2.0.12

-   Ability to set custom `blankUrl` for source changes (https://github.com/sampotts/plyr/pull/504)
-   Ability to set caption button listener (https://github.com/sampotts/plyr/pull/468)

### v2.0.11

-   Fix for `cleanUp` being called twice (thanks to @sebastiancarlsson)
-   Fix for YouTube controls on iPad (fixes #391)

### v2.0.10

-   Added seek event fixes for Vimeo and YouTube (fixes #409)
-   Added support for embed URLs rather than ID only (fixes #345)

### v2.0.9

-   Temporary patch for the YouTube API issues with `getDuration()` (relates to #374)

### v2.0.8

-   Added `isPaused()` API method (thanks to @darrena092)
-   Allowed `.on()` API method to be chainable (thanks to @gurupras) (fixes #357)
-   Improved the "awful" rendering of captions on small screens in fullscreen mode (fixes #390)
-   Fix for Firefox VTT compatibility (thanks to @magourex)
-   Fix for Firefox Developer Edition blank video due to `-webkit-mask-image` issue (fixes #392)
-   Added Issue and PR templates with the aim of reducing duplicate or duff issues

### v2.0.7

-   Fixed `getCurrentTime()` method (fixes #351)
-   Added `getVolume()` , `isMuted()` and `getDuration()` API methods (fixes #346)

### v2.0.6

-   Fixed merge issue with `Updated define to work with AMD imports #326` PR
-   Code formatting

### v2.0.5

-   Fix for Vimeo in IE9 & IE10
-   Fix for HTML5 elements not firing `ready` event

### v2.0.4

-   Fix for Firefox full screen (fixes #343)

### v2.0.3

-   Set 'global' keyboard shortcut option to false as default, added `<textarea>` to editable elements to be ignored

### v2.0.2

-   Added 'global' keyboard shortcut option

### v2.0.1

-   Version bump for NPM (sorry for folks who upgraded to the now deleted v1.9.0 through NPM)

# v2.0.0

This version contains several potential **_breaking changes_**:

-   `setup()` has been reverted to pre v1.8.0 behaviour; meaning it will return the _instance_ rather than the _element_. This is because the reference to the instance is no longer added to the original element (see below).
-   The reference to the `plyr` instance is now added to the media element rather than original container. This is because if a container with multiple children was passed to `setup()` the references to all instances would have been added to the container, creating issues. I would recommend using the return value from `setup()` or the new `get()` method to access the instance.
-   Players will always be wrapped in their own div now - this makes `setup()` and `destroy()` cleaner. This _may_ break any custom styling based on DOM position.
-   Players no longer seek to 0 on 'ended' - this is to fix a bug with Microsoft Edge as it triggers 'ended' on media change for whatever reason. They'll never change ;-)

And some other changes and bug fixes:

-   New `get()` method on the global plyr object to get all instances inside a container
-   New API methods: - `getOriginal()` to get the original, _unmodified_ element plyr was setup on (`<video>`, `<audio>` or empty `<div>` for YouTube and Vimeo) - `getContainer()` to get the players outer wrapper element - `getMedia()` to get the players media element (`<video>`, `<audio>` or empty `<div>` for YouTube and Vimeo) - `getEmbed()` to access the YouTube or Vimeo API directly - `getType()` to get the type of the player - `isReady()` to determine if an instance has completed setup and necessary APIs are loaded (for YouTube / Vimeo) - `on()` to provide an easy way to listen to events - `stop()` to, you guessed it, stop the player
-   `destroy()` now works correctly for YouTube and Vimeo (fixes #272)
-   New `destroyed` event when `destroy()` has completed (original element is passed as event.target)
-   Default volume is now 10 (max) rather than 5
-   Sprite is only loaded once (fixes #259)
-   Fixes for Vimeo post message bugs on source change or destroy (fixes #318)
-   Save caption state in storage (fixes #311)
-   Added keyboard shortcuts to the current focused player (with `keyboardShortcuts` boolean option to disable) (fixes #309)
-   Fix for captions bug (fixes #332)
-   Change to AMD (fixes #298)

### v1.8.12

-   Vimeo keyboard focus fix (Fixes #317)
-   Fix for Vimeo on basic support devices

### v1.8.11

-   Fix for keyboard navigation on Vimeo (Fixes #317)
-   Fix for bug introduced in v1.8.9 related to additional controls
-   Vimeo API upgrade
-   Fix for YouTube bug introduced in v1.8.9
-   Added support for passing array to .setup() (Fixes #319)

### v1.8.10

-   Fix for seek issues introduced in v1.8.9

### v1.8.9

-   Fix for fullscreen not being defined (Fixes #295)
-   Fix for multiline captions (Fixes #314)
-   Clean up of type checks and fix for `restart()` (Fixes #315)
-   Fix for `MEDIA_ERR_SRC_NOT_SUPPORTED` when calling `.source()` API method

### v1.8.8

-   Added getCurrentTime API method (fixes #292)
-   Fix for !hideControls on touch devices (fixes #303)

### v1.8.7

-   Line height fix

### v1.8.6

-   Reverted font size change

### v1.8.5

-   Fixed overflow issues (fixes #286)

### v1.8.4

-   Fix for large play button on small videos

### v1.8.3

-   Disabled iPad support for YouTube and Vimeo due to iOS limitations with iFrame playback
-   Fixed IE11 icon loading (fixes #269)
-   Updated screenshot (fixes #281)
-   Added WordPress plugin (fixes #239)
-   Added Neos plugin
-   Added HLS, Shaka and dash.js examples (see #235 for more)
-   Improvements for controls hiding and showing on touch devices

### v1.8.2

-   Fixed event bubbling

### v1.8.1

-   Fixed inaccurate log message

## v1.8.0

-   **_(Important)_** `setup()` now returns the element Plyr was setup on rather than the `plyr` object. This means `var player = plyr.setup()[0];` would now be `var player = plyr.setup()[0].plyr;`. This improves support for React and other virtual dom frameworks as mentioned in #254
-   Fixed using a relative URL for `iconUrl` in IE (fixes #269)

## v1.7.0

-   SASS cleanup (fixes #265)
-   Docs tidy up to help quick start (fixes #253)
-   Fix for issues with data attribute options passing (fixes #257)
-   **_(Important)_** Removed the requirement for a wrapper div to setup Plyr and removed the dependency on the `plyr` classname as a JS hook. By default it will now look for `<video>`, `<audio>` and `[data-type]` elements. If you are just calling `setup()` with a `<div class="plyr">` you may want to give it a good test after upgrading. You can probably remove the wrapper div. The reason behind this is to make setup easier for newcomers and prevent the styling being used on unsupported players (because the plyr classname was used as a CSS and JS hook - which isn't ideal)
-   Renamed the 'docs' folder to `demo` to avoid confusion - the readme is the docs after all

### v1.6.20

-   Fix for multiple sprites being requested (fixes #259)

### v1.6.19

-   Fix for scroll direction issues on volume control (fixes #258)

### v1.6.18

-   Reduced rounding of seek value from 1 decimal point to 4 (fixes #242)

### v1.6.17

-   Added `disableContextMenu` option to hide the right click context menu (fixes #248 and #225)

### v1.6.16

-   Always hide standard controls (fixes #225)
-   Fix for Tooltips overflowing (fixes #230)

### v1.6.15

-   Restore scroll position when exiting full screen (fixes #236)

### v1.6.14

-   SVG sprite loading automatically for an easier setup
-   Touch devices now show controls on touch rather than pausing playback

### v1.6.13

-   Decreased sensitivity and inverted scroll on volume slider (scroll up to increase, down to decrease)

### v1.6.12

-   Fix for undefined buffer error
-   Add scroll listener on volume slider (PR #227 bty @igoradamenko)

### v1.6.11

-   Fix for Vimeo fullscreen (fixes #214)

### v1.6.10

-   Changed default icon prefix from 'icon' to 'plyr' to avoid clashes

### v1.6.9

-   Added 'latest' CDN option
-   Renamed `sprite.svg` to `plyr.svg` to be inline with the other package files

### v1.6.8

-   Fix for bug introduced in v1.6.7

### v1.6.7

-   Fixes for using `source` API method on iOS

### v1.6.6

-   Icons cleaned up
-   IE11 button fix for tooltips (fixes #210)

### v1.6.5

-   IE UI bug fixes

### v1.6.4

-   Bug fix for undefined progress bar

### v1.6.3

-   Seek back to 0 for all media on ended
-   Check for HTML5 video on ended reload
-   Update to docs for `showPosterOnEnd` option

### v1.6.2

-   Fix for tooltip displaying when duration is not set (fixes #177)
-   `showPosterOnEnd` option to show poster when HTML5 video ended (fixes #59)
-   Error handler for YouTube (fixes #189)
-   Initial SoundCloud support (fixes #194)
-   Other minor bug fixes

### v1.6.1

-   Tooltip changes for accessibility

## v1.6.0

-   New, cleaner, UI: - Controls are now overlaid, maintaining the video's ratio and making sizing easier - A large play button can now be overlaid over videos - Default number of control buttons reduced - New play, pause, rewind and fast forward icons - Flexbox all the things!
-   Tidied up the LESS (and SCSS) as part of the above, variables and mixins in seprate files amking customization and upgrades easier
-   Toggle mute bug fix; if a player was muted previously and the user refreshed, unmuting would have meant volume was still zero (effectively muted), now the config default value is used. Not ideal but good for now
-   New `iconUrl` option allowing specifying a same origin SVG sprite location. Loading this way means you don't need the AJAX sprite loading JavaScript
-   `click` option renamed to `clickToPlay` to make it a bit more self explanatory. Unfortunately cross origin SVG sprites is not supported in any browser yet :-(
-   `hideControls` is now a global option, rather than being exclusive to fullscreen. Controls are now hidden after 2 seconds of no mouse movement. Controls are always shown when media is paused or stopped. This is defaulted to true.
-   `sass` folder in `src` renamed from to `scss`

### v1.5.21

-   Bug fix for embeds: `play` not being defined (fixes #185 and #186)

### v1.5.20

-   Bug fix for autoplay option

### v1.5.19

-   Fix for accessing `embed` property after `ready` event fired

### v1.5.18

-   Added 'ready' event for initial setup complete or source change occurs
-   Fixed SASS stylesheet references to transparentize
-   Added default font stack to controls
-   Docs fixes inc controls HTML (fixes #180)

### v1.5.17

-   Expose YouTube and Vimeo API (docs update required) (fixes #176)
-   Auto set title based on YouTube getVideoData() title property
-   Bug fix for Vimeo API change (Uncaught TypeError: Cannot read property 'value' of undefined) due to a change their end

### v1.5.16

-   Cancel requests on source change (fixes #174)

### v1.5.15

-   Fix for CustomEvent polyfill and related bug (see #172)

### v1.5.14

-   Volume storage fix (fixes #171)

### v1.5.13

-   Fix for manual caption rendering

### v1.5.12

-   Added a duration option to pass the duration of the file
-   Added the ability to set options per element by setting a data-plyr attribute on the target elements (this might be useful for the duration option for example)
-   Fixes for Chrome and Safari caption rendering, they now use the default texttrack and cuechange events
-   Firefox bug fix for event not defined

### v1.5.11

-   iOS embed bug fixes (fixes #166)
-   Hide IE/Edge <input type='range'> tooltip (since we have a styled one) (fixes #160)
-   SASS bug fix for default values (fixes #158)

### v1.5.9

-   NPM bug fixes

### v1.5.10

-   NPM bug fixes

### v1.5.8

-   Fix for touch device seek tooltip
-   Seek improvements

### v1.5.7

-   Fix for control tooltips always showing

### v1.5.6

-   Seek tooltip (option for tooltips changed, please check docs)
-   SASS compile error fixes (fixes #148)
-   Fullscreen fixes for controls not always hiding/showing (fixes #149)
-   Screen reader icon fixes (title was being read twice due to the tooltip/hidden label)

### v1.5.5

-   Fixed controls.md example
-   Bug fix for docs error page
-   Bug fix for controls tooltips

### v1.5.4

-   Minor bug fix for clicking video to play/pause after source change

### v1.5.3

-   Minor bug fix for occasional display of 0:00 as the media duration

### v1.5.2

-   `handlers` option renamed to `listeners`
-   Added event listeners for all types to the plyr container (playback, fullscreen, captions etc - see docs)
-   Removed onSetup config option (use the 'setup' event instead, plyr element is event.plyr)
-   Style bug fixes
-   Vimeo seek bug fix (requires whole seconds when seeking)
-   Fix for fullscreen player (using class hook, not browser fullscreen)

### v1.5.1

-   Fix for event listeners being duplicated on source change

## v1.5.0

-   Vimeo support (fixes #8)
-   New options for initialization (you can now pass a selector, HTMLElement or NodeList) (fixes #118)
-   Switched to BEM methodology (you will need to change CSS and probably HTML)
-   Decoupled CSS and JS hooks (fixes #129)
-   Custom controls container (fixes #98)
-   Fix for private/incognito mode local storage bug (fixes #131)
-   UMD module setup (fixes #121)
-   Specify iframe title for Vimeo and YouTube (fixes #124)
-   Better handling of mission controls (fixes #132)
-   Retain classname on source change (fixes #120)
-   Increased thumb size on seek (partially fixes #130)
-   Passing no argument to `source` api method, now returns current source (by @gurupras)
-   Ability to add custom handlers to controls prior to Plyr bindings (by @gurupras)
-   Keyboard navigation improvements (focus on seek, focus trap in fullscreen) (fixes #135)

### v1.3.5

-   Fixed bug with API use on basic supported browsers

### v1.3.4

-   Code cleanup by @calvintam236

### v1.3.3

-   Removed captions being read by screen readers

### v1.3.2

-   Voiceover fix for captions

### v1.3.1

-   ARIA improvements for captions being read

### v1.3.0

-   Internationalization support (i18n) using default controls (required markup changes to controls)
-   ARIA enhancements for controls (required markup changes to controls)
-   Captions legibility improvements
-   YouTube bug fixes

### v1.2.6

-   SASS updates and fixes (cheers @ChristianPV)

### v1.2.5

-   Fix for YouTube quality (let them decide quality)

### v1.2.4

-   Fix for omitted kind attribute on <track> (fixes #88)

### v1.2.3

-   Fix for YouTube on iPhone or unsupported browsers (fallback to YouTube native)
-   Docs tidy up
-   Fullscreen for Safari fix (fixes #96)

### v1.2.2

-   Fix for :focus keyboard vs mouse (fixes #61)
-   Fix for caption positioning in full screen (fixes #92)

### v1.2.1

-   Tooltip bug fix

## v1.2.0

-   Added YouTube support

### v1.1.13

-   Added icon prefix option for when using default controls

### v1.1.13

-   Logic tweaks for hiding controls in fullscreen

### v1.1.12

-   Bug fix for Chrome Canary

### v1.1.11

-   Bug fix

### v1.1.10

-   Bug fix

### v1.1.9

-   Bug fix for 1.1.8

### v1.1.8

-   setVolume API method improvements (fixes #83)

### v1.1.7

-   Restore classname on destroy()

### v1.1.6

-   New API methods (fixes #77), Fix for non strict mode (fixes #78)

### v1.1.5

-   Fix for incorrect `isFullscreen()` return value in Mozilla (fixes #38)

### v1.1.4

-   Minor bug fixes

### v1.1.3

-   Fixes for random id used in controls with multiple instances and one call to setup
-   Audio player UI improvements

### v1.1.2

-   Added an onSetup callback option
-   Added fullscreen API methods `toggleFullscreen()` (must be user iniated), and `isFullscreen()`

### v1.1.1

-   Fix for unsupported browser handling
-   Fix for config.controls having no effect

## v1.1.0

-   Added config option to set which controls are shown (if using the default controls html) and better handling of missing controls

### v1.0.31

-   Display duration on `metadataloaded`

### v1.0.30

-   Fixed bug with media longer than 60 minutes (fixes #69)

### v1.0.29

-   Added option to hide controls on fullscreen (default `true`) while palying, after 1s. Pause, mouse hover on progress, or focus on a child control re-shows the controls. On touch a tap of the video (which plays/pauses the video by default) is required. (fixes #47)
-   Fixed a bug with caption toggle in 1.0.28

### v1.0.28

-   Added API support for browsers that don't have full plyr support (pretty much <=IE9 and `<video>` on iPhone/iPod)

### v1.0.27

-   Keyboard accessibility improvements (fixes #66)

### v1.0.26

-   Fixes for SASS (cheers @brunowego)
-   Indentation reset to 4 spaces

### v1.0.25

-   Fixes for iOS volume controls (hidden)
-   Classnames for left/right controls changed

### v1.0.24

-   Added tooltip option to display labels as tooltips (fixes #50)

### v1.0.23

-   Handling loading states in the UI (fixes #36)

### v1.0.22

-   Added support() API method for checking mimetype support
-   Added source() API method for setting media source(s) (fixes #44)
-   Added poster() API method for setting poster source
-   Refactored captions logic for manual captions

### v1.0.21

-   Added an <input type="range"> for seeking to improve experience (and support dragging) (fixes #40, #42)
-   Icons for restart and captions improved (and some IDs changed) (fixes #49)

### v1.0.20

-   Default controls included (Fixes #45)
-   Volume changes on `input` as well as `change` (fixes #43)
-   Fix for undefined Play text
-   License changed to MIT

### v1.0.19

-   Fixed firefox fullscreen issue (fixes #38)

### v1.0.18

-   Added CDN references

### v1.0.17

-   SASS support added (thanks to @brunowego)
-   Docs completely separated to avoid any confusion
-   New gulp tasks (will add more documentation for this)

### v1.0.16

-   Aria label is now dynamic

### v1.0.15

-   Fix for seek time display in controls
-   More documentation for controls html

### v1.0.14

-   Minor change for bootstrap compatibility

### v1.0.13

-   Minor tweaks

### v1.0.12

-   Handle native events (issue #34)

### v1.0.11

-   Bug fixes for fullscreen mode

### v1.0.10

-   Bower includes src files now
-   Folder re-arrangement

### v1.0.9

-   Added buffer progress bar
-   Fixed Safari 8 caption track (it needs to be removed from the DOM like in Safari 7)
-   Added validation (it works or it doesn't basically) of the `html` option passed

### v1.0.8

-   Bug fix

### v1.0.7

-   Storing user selected volume in local storage

### v1.0.6

-   Fullscreen fallback for older browsers to use "full window"

### v1.0.5

-   More minor bug fixes and improvements

### v1.0.4

-   Fixed caption legibility issues

### v1.0.3

-   Minor bug fixes

### v1.0.2

-   Added OGG to <audio> example for Firefox
-   Fixed IE11 fullscreen issues

### v1.0.1

-   Bug fixes for IE (as per usual)
-   Added CSS hooks for media type
-   Return instances of Plyr to the element

# v1.0.0

-   Initial release
