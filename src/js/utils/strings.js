// ==========================================================================
// String utils
// ==========================================================================

import is from './is';

// Generate a random ID
export function generateId(prefix) {
    return `${prefix}-${Math.floor(Math.random() * 10000)}`;
}

// Format string
export function format(input, ...args) {
    if (is.empty(input)) {
        return input;
    }

    return input.toString().replace(/{(\d+)}/g, (match, i) => args[i].toString());
}

// Get percentage
export function getPercentage(current, max) {
    if (current === 0 || max === 0 || Number.isNaN(current) || Number.isNaN(max)) {
        return 0;
    }

    return (current / max * 100).toFixed(2);
}

// Replace all occurances of a string in a string
export function replaceAll(input = '', find = '', replace = '') {
    return input.replace(
        new RegExp(find.toString().replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1'), 'g'),
        replace.toString(),
    );
}

// Convert to title case
export function toTitleCase(input = '') {
    return input.toString().replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase());
}

// Convert string to pascalCase
export function toPascalCase(input = '') {
    let string = input.toString();

    // Convert kebab case
    string = replaceAll(string, '-', ' ');

    // Convert snake case
    string = replaceAll(string, '_', ' ');

    // Convert to title case
    string = toTitleCase(string);

    // Convert to pascal case
    return replaceAll(string, ' ', '');
}

// Convert string to pascalCase
export function toCamelCase(input = '') {
    let string = input.toString();

    // Convert to pascal case
    string = toPascalCase(string);

    // Convert first character to lowercase
    return string.charAt(0).toLowerCase() + string.slice(1);
}

// Remove HTML from a string
export function stripHTML(source) {
    const fragment = document.createDocumentFragment();
    const element = document.createElement('div');
    fragment.appendChild(element);
    element.innerHTML = source;
    return fragment.firstChild.innerText;
}

// Like outerHTML, but also works for DocumentFragment
export function getHTML(element) {
    const wrapper = document.createElement('div');
    wrapper.appendChild(element);
    return wrapper.innerHTML;
}
