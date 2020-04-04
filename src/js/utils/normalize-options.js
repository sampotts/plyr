export default function(options, defaults) {
  if (!options) {
    return defaults;
  }

  const normalizedOptions = {};

  Object.keys(defaults)
    .forEach(key => {
      if (Object.prototype.hasOwnProperty.call(options, key)) {
        normalizedOptions[key] = options[key];
      } else {
        normalizedOptions[key] = defaults[key];
      }
    });

  return normalizedOptions;
}
