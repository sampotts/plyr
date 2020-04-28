import is from './is';
/**
 * Silence a Promise-like object.
 * This is useful for avoiding non-harmful, but potentially confusing "uncaught
 * play promise" rejection error messages.
 * @param  {Object} value An object that may or may not be `Promise`-like.
 */
export function silencePromise(value) {
  if (is.promise(value)) {
    value.then(null, () => {});
  }
}

export default { silencePromise };
