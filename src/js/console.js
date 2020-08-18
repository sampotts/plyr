// ==========================================================================
// Console wrapper
// ==========================================================================

const noop = () => {};

export default class Console {
  constructor(enabled = false) {
    this.enabled = window.console && enabled;

    if (this.enabled) {
      this.log('Debugging enabled');
    }
  }

  get log() {
    // eslint-disable-next-line no-console
    return this.enabled ? Function.prototype.bind.call(console.log, console) : noop;
  }

  get warn() {
    // eslint-disable-next-line no-console
    return this.enabled ? Function.prototype.bind.call(console.warn, console) : noop;
  }

  get error() {
    // eslint-disable-next-line no-console
    return this.enabled ? Function.prototype.bind.call(console.error, console) : noop;
  }
}
