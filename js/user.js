/*
 * FILE:    js/user.js
 * OWNER:   Eslam-LC
 *
 * PURPOSE:
 *   Everything related to login, logout, and knowing who is logged in.
 *   The logged-in user is saved in localStorage so it survives page refreshes.
 *   Must be loaded after api.js on every page.
 *
 * STORAGE FORMAT (what gets saved in localStorage):
 *   key: 'bh_session'
 *   value: JSON object like { id: 1, name: "Demo User", email: "demo@bakehaven.com" }
 *   NOTE: password is never saved in the session — only id, name, email
 *
 * ─────────────────────────────────────────────────────────────
 *
 * getSession()
 *   INPUT:  nothing
 *   OUTPUT: object { id, name, email } if logged in
 *           null if nobody is logged in
 *
 * isLoggedIn()
 *   INPUT:  nothing
 *   OUTPUT: true if a session exists, false if not
 *
 * login(userData)
 *   INPUT:  userData - object - { id, name, email } — do NOT include password
 *   OUTPUT: nothing — saves the session and refreshes the header icon
 *   NOTE:   called by Person E after credentials are confirmed correct
 *
 * logout()
 *   INPUT:  nothing
 *   OUTPUT: nothing — clears the session and redirects to home page
 *   NOTE:   wired to the logout button in the header dropdown
 *
 * updateAccountIcon()
 *   INPUT:  nothing
 *   OUTPUT: nothing — changes the header account button based on login state
 *             logged out → shows 👤 icon, clicking goes to login.html
 *             logged in  → shows first letter of email, clicking shows dropdown
 *   NOTE:   call this on every page load
 *
 * validateCredentials(email, password, onSuccess, onFail)
 *   INPUT:  email     - string   - what the user typed in the email field
 *           password  - string   - what the user typed in the password field
 *           onSuccess - function - called with { id, name, email } if match found
 *           onFail    - function - called with an error message string if no match
 *   OUTPUT: nothing returned — result comes via the callback functions
 *   NOTE:   internally calls fetchJSON('/api/users.json', ...) to get the user list
 *           called by Person E on the login page
 *
 * ─────────────────────────────────────────────────────────────
 */

function getSession() {
    // TODO (Person A)
    // key: 'bh_session'
    return JSON.parse(localStorage.getItem('bh_session'))

}

function isLoggedIn() {
    // TODO (Person A)
    return localStorage.getItem('bh_session') !== null
}

function login(userData) {

    localStorage.setItem('bh_session', JSON.stringify(userData))

    updateAccountIcon()
}

function logout() {

    localStorage.removeItem('bh_session')

    updateAccountIcon()
    window.location.href = './index.html'
}

function updateAccountIcon() {
    var btn = document.getElementById('account-btn');
    var link = document.getElementById('account-link');
    if (!btn) return;

    if (isLoggedIn()) {
        var session = getSession();
        btn.classList.remove('fa-solid', 'fa-user');
        btn.textContent = session.name.charAt(0).toUpperCase();
        btn.classList.add('logged-in')
    } else {
        btn.classList.add('fa-solid', 'fa-user');
        btn.textContent = '';
        btn.classList.remove('logged-in')
    }
}

function validateCredentials(email, password, onSuccess, onFail) {
    // not fully implemented yet

    //  * validateCredentials(email, password, onSuccess, onFail)
    //  *   INPUT:  email     - string   - what the user typed in the email field
    //  *           password  - string   - what the user typed in the password field
    //  *           onSuccess - function - called with { id, name, email } if match found
    //  *           onFail    - function - called with an error message string if no match
    //  *   OUTPUT: nothing returned — result comes via the callback functions
    //  *   NOTE:   internally calls fetchJSON('/api/users.json', ...) to get the user list
    //  *           called by Person E on the login page

    fetchJSON('./api/users', (response) => {
        for (const u of response) {
            if (u.email == email && u.password == password) {
                onSuccess({ id: u.id, name: u.name, email: u.email })
                return
            }
        }
        onFail('Incorrect email or password.')
    }, function () {
        onFail('Could not load user data.')
    })
}