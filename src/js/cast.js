var GoogleCast = (function () {
  defaults = {
    options: {
      applicationId:  chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
    },
  };

  window['__onGCastApiAvailable'] = function(isAvailable) {
    this.isAvailable = isAvailable;
  };

  initializeCastApi = function(config) {
    cast.framework.CastContext.getInstance().setOptions(config.options);

    this.remotePlayer = new cast.framework.RemotePlayer();
    this.remotePlayerController = new cast.framework.RemotePlayerController(this.remotePlayer);
    this.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
        this.switchPlayer.bind(this)
    );
  };

  function switchPlayer()
    if (cast && cast.framework) {
        if (this.remotePlayer.isConnected) {
            this.setupRemotePlayer();
            return;
        }
    }
  }

  function _extend() {
      // Get arguments
      var objects = arguments;

      // Bail if nothing to merge
      if (!objects.length) {
          return;
      }

      // Return first if specified but nothing to merge
      if (objects.length === 1) {
          return objects[0];
      }

      // First object is the destination
      var destination = Array.prototype.shift.call(objects),
          length      = objects.length;

      // Loop through all objects to merge
      for (var i = 0; i < length; i++) {
          var source = objects[i];

          for (var property in source) {
              if (source[property] && source[property].constructor && source[property].constructor === Object) {
                  destination[property] = destination[property] || {};
                  _extend(destination[property], source[property]);
              } else {
                  destination[property] = source[property];
              }
          }
      }

      return destination;
  }

  function _setup(config) {
    config = _extend({}, defaults, config);
    initializeCastApi(config);

  }


  /**
   * Interface:
   * getMedia()
   * getDuration()
   * getCurrentTime()
   * getVolume()
   * isMuted()
   * isReady()
   * isLoading()
   * isPaused()
   * play()
   * pause()
   * stop()
   * restart()
   * rewind()
   * forward()
   * seek(time)
   * source(url)
   * poster(url)
   * setVolume(volume)
   * togglePlay()
   * toggleMute()
   * toggleCaptions()
   * toggleFullscreen()
   * isFullscreen()
   * destroy()
   */

  return {
    setup: _setup,
  };
})();
