/*
 * FILE:    js/api.js
 * OWNER:   Eslam-LC
 *
 * PURPOSE:
 *   Utility functions that fetches a JSON file and gives you the data 
 *   and provide a url fallback system.
 * 
 *   Everyone can call this instead of writing their own XMLHttpRequest.
 *   Must be the first <script> tag on every page.
 *
 * HOW XHR WORKS (important to understand):
 *   fetchJSON does NOT return the data directly.
 *   It starts a request and comes back to you later via a callback function.
 *   Think of it like ordering food — you don't stand at the counter waiting,
 *   you sit down and the waiter brings it to you when it's ready.
 *   So ALL code that uses the data must be written INSIDE the callback.
 *
 * ─────────────────────────────────────────────────────────────
 *
 * fetchJSON(url, onSuccess, onError)
 *
 *   INPUT:
 *     url       - string  - path to the JSON file
 *                           example: '/api/products.json'
 *     onSuccess - function - called with the parsed data when request works
 *                           example: function(data) { ... }
 *     onError   - function - called with an error message when it fails
 *                           example: function(msg) { ... }
 *                           (optional — you can skip it)
 *
 *   OUTPUT:
 *     nothing returned — data is delivered via onSuccess callback
 *
 *   USAGE EXAMPLE:
 *     fetchJSON('/api/products.json', function(products) {
 *         // products is now a JS array — use it here
 *     });
 *
 * ─────────────────────────────────────────────────────────────
 */

function fetchJSON(url, onSuccess, onError) {
    const XHR = new XMLHttpRequest()
    XHR.open("GET", url)
    XHR.responseType = 'json'
    XHR.send()
    XHR.onload = () => {
        if (XHR.status !== 200) {
            console.error(`not ok response ${XHR.status}`)
            return
        }

        if (onSuccess) {
            onSuccess(XHR.response)
            return
        }

        if (onError) {
            onError(XHR.response)
        }
    }
    // XHR.onerror = function () {
    //     if (onError) onError('Network error — is the server running?')
    // }
}