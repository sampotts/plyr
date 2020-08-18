// ==========================================================================
// Time utils
// ==========================================================================

import is from './is';

// Time helpers
export const getHours = value => Math.trunc((value / 60 / 60) % 60, 10);
export const getMinutes = value => Math.trunc((value / 60) % 60, 10);
export const getSeconds = value => Math.trunc(value % 60, 10);

// Format time to UI friendly string
export function formatTime(time = 0, displayHours = false, inverted = false) {
  // Bail if the value isn't a number
  if (!is.number(time)) {
    return formatTime(undefined, displayHours, inverted);
  }

  // Format time component to add leading zero
  const format = value => `0${value}`.slice(-2);
  // Breakdown to hours, mins, secs
  let hours = getHours(time);
  const mins = getMinutes(time);
  const secs = getSeconds(time);

  // Do we need to display hours?
  if (displayHours || hours > 0) {
    hours = `${hours}:`;
  } else {
    hours = '';
  }

  // Render
  return `${inverted && time > 0 ? '-' : ''}${hours}${format(mins)}:${format(secs)}`;
}
