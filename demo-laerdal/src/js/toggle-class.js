// Toggle class on an element
const toggleClass = (element, className = '', toggle = false) =>
  element && element.classList[toggle ? 'add' : 'remove'](className);

export default toggleClass;
