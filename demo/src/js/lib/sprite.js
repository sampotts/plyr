// ==========================================================================
// SVG sprite loading and caching
// This file should be at the top of the body to avoid a flash
// Usage: loadSprite('https://cdn.com/path/to/sprite.svg', 'sprite-id');
// The second argument is optional but prevents loading twice
// ==========================================================================

(function() {
    window.loadSprite = function(url, id) {
        if (typeof url !== "string") {
            return;
        }

        var body = document.body;
        var prefix = "cache-";
        var hasId = typeof id === "string";
        var isCached = false;

        // Check for *actual* storage support
        var cacheSupported = (function() {
            if (!hasId) {
                return false;
            }
            var test = '___test';
            try {
                localStorage.setItem(test, test);
                localStorage.removeItem(test);
                return true;
            } catch (e) {
                return false;
            }
        })();

        function updateSprite(container, data) {
            // Inject content
            container.innerHTML = data;

            // Inject the SVG to the body
            body.insertBefore(container, body.childNodes[0]);
        }

        // Only load once
        if (!hasId || document.querySelectorAll("#" + id).length === 0) {
            // Create container
            var container = document.createElement("div");
            container.setAttribute("hidden", "");

            if (hasId) {
                container.setAttribute("id", id);
            }

            // Check in cache
            if (cacheSupported) {
                var cached = localStorage.getItem(prefix + id);
                isCached = cached !== null;

                if (isCached) {
                    var data = JSON.parse(cached);
                    updateSprite(container, data.content);
                }
            }

            // ReSharper disable once InconsistentNaming
            var xhr = new XMLHttpRequest();

            // XHR for Chrome/Firefox/Opera/Safari
            if ("withCredentials" in xhr) {
                xhr.open("GET", url, true);
            }
            // Not supported
            else {
                return;
            }

            // Once loaded, inject to container and body
            xhr.onload = function() {
                if (cacheSupported) {
                    localStorage.setItem(prefix + id, JSON.stringify({
                        content: xhr.responseText
                    }));
                }

                updateSprite(container, xhr.responseText);
            };

            xhr.send();
        }
    }
})();
