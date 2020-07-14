class PlyrProvider {
  // The currently available speeds for the provider
  static get availableSpeed() {
    return [];
  }

  // Specific events for the provider to listent to
  static get events() {
    return [];
  }

  /** Type of provider (e.g. audio or video)
   *
   * @param {Plyr} player
   *
   * @returns {string} Either audio or video
   */
  // eslint-disable-next-line no-unused-vars
  static type(player) {
    throw new Error('You need to precise the type of the provider');
  }

  static get supportCaptions() {
    return false;
  }

  static getQualityOptions(player) {
    // Whether we're forcing all options (e.g. for streaming)
    if (player.config.quality.forced) {
      return player.config.quality.options;
    }
    return [];
  }

  /**
   * Function called when setting up the plyr player
   * @param {Plyr} player
   */
  static setup(player) {
    if (!(player instanceof Plyr)) {
      throw new Error('Passed object is not an instance of Plyr');
    }
  }

  /**
   * Name of the provider
   */
  static get name() {
    throw new Error('You need to name your provider');
  }

  /**
   * Test if the provider should be used for this url
   * @param {String} url
   *
   * @return {boolean} Match
   */
  // eslint-disable-next-line no-unused-vars
  static test(url) {
    throw new Error('You need to implement a test for your provider');
  }

  /**
   * Check if the array of speed given are supported for the provider
   * @param {Array<number>} speedArray
   *
   * @returns {Array<number>} The filtered out speed array that is available
   */
  static filterSpeed(speedArray) {
    return this.availableSpeed.filter(speed => speedArray.includes(speed));
  }

  static beforeSetup() {}

  // eslint-disable-next-line no-unused-vars
  static async destroy(player) {
    throw new Error('You need to implement a destroy function for your provider');
  }
}

// The specific config for the provider
PlyrProvider.config = {};

export default PlyrProvider;
