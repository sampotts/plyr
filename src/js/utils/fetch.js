// ==========================================================================
// Fetch wrapper
// Using XHR to avoid issues with older browsers
// ==========================================================================

export default function fetch(url, responseType = 'text', withCredentials = false) {
  return new Promise((resolve, reject) => {
    try {
      const request = new XMLHttpRequest();

      // Check for CORS support
      if (!('withCredentials' in request)) {
        reject(new Error('CORS not supported'));
        return;
      }

      // Set to true if needed for CORS
      if (withCredentials) {
        request.withCredentials = true;
      }

      request.addEventListener('load', () => {
        if (request.status < 200 || request.status >= 300) {
          reject(new Error(`Request failed with status ${request.status}`));
          return;
        }

        if (responseType === 'text') {
          try {
            resolve(JSON.parse(request.responseText));
          }
          catch {
            resolve(request.responseText);
          }
        }
        else {
          resolve(request.response);
        }
      });

      request.addEventListener('error', () => {
        reject(new Error(`Network error (status ${request.status})`));
      });

      request.open('GET', url, true);
      request.responseType = responseType;
      request.send();
    }
    catch (error) {
      reject(error);
    }
  });
}
