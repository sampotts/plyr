// ==========================================================================
// Type checking utils
// ==========================================================================

const getConstructor = input => (input !== null && typeof input !== 'undefined' ? input.constructor : null);

const instanceOf = (input, constructor) => Boolean(input && constructor && input instanceof constructor);

const is = {
    object(input) {
        return getConstructor(input) === Object;
    },
    number(input) {
        return getConstructor(input) === Number && !Number.isNaN(input);
    },
    string(input) {
        return getConstructor(input) === String;
    },
    boolean(input) {
        return getConstructor(input) === Boolean;
    },
    function(input) {
        return getConstructor(input) === Function;
    },
    array(input) {
        return !is.nullOrUndefined(input) && Array.isArray(input);
    },
    weakMap(input) {
        return instanceOf(input, WeakMap);
    },
    nodeList(input) {
        return instanceOf(input, NodeList);
    },
    element(input) {
        return instanceOf(input, Element);
    },
    textNode(input) {
        return getConstructor(input) === Text;
    },
    event(input) {
        return instanceOf(input, Event);
    },
    cue(input) {
        return instanceOf(input, window.TextTrackCue) || instanceOf(input, window.VTTCue);
    },
    track(input) {
        return instanceOf(input, TextTrack) || (!is.nullOrUndefined(input) && is.string(input.kind));
    },
    url(input) {
        return !is.nullOrUndefined(input) && /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(input);
    },
    nullOrUndefined(input) {
        return input === null || typeof input === 'undefined';
    },
    empty(input) {
        return (
            is.nullOrUndefined(input) ||
            ((is.string(input) || is.array(input) || is.nodeList(input)) && !input.length) ||
            (is.object(input) && !Object.keys(input).length)
        );
    },
};

export default is;
