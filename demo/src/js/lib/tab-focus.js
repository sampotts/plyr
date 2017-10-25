// ==========================================================================
// tab-focus.js
// Detect keyboard tabbing
// ==========================================================================

(function() {
    var className = 'tab-focus';

    // Remove class on blur
    document.addEventListener('focusout', function(event) {
        event.target.classList.remove(className);
    });

    // Add classname to tabbed elements
    document.addEventListener('keydown', function(event) {
        if (event.keyCode !== 9) {
            return;
        }

        // Delay the adding of classname until the focus has changed
        // This event fires before the focusin event
        window.setTimeout(function() {
            document.activeElement.classList.add(className);
        }, 0);
    });
})();
