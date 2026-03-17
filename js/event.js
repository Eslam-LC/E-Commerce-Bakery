var accountBtn, accountLink, accountDropdown, feedbackBtn,
    loginBtn, logoutBtn
var dropdownFlag = false
document.addEventListener('DOMContentLoaded', function (e) {
    accountBtn = document.getElementById('account-btn')
    feedbackBtn = document.getElementById('feedback-btn')
    accountLink = document.getElementById('account-link')
    // console.log(accountLink)
    accountDropdown = document.getElementById('account-dropdown')
    loginBtn = document.getElementById('login-btn')
    logoutBtn = document.getElementById('logout-btn')


    if (accountLink)
        accountLink.addEventListener('click', function (e) {
            if (isLoggedIn()) {
                e.preventDefault()
            }
        })
    // else console.log('accountLink not loaded')

    if (accountBtn)
        accountBtn.addEventListener('click', function (e) {
            if (isLoggedIn()) {
                toggleDropdownMenu()
            }
        })

    if (loginBtn)
        loginBtn.addEventListener('click', function (e) {

            validateCredentials(document.getElementById('login-email').value, document.getElementById('login-password').value, function (userData) {

                login(userData)
                location.href = './index.html'

            }, function (errorMessage) {
                alert(errorMessage)
            })
        })

    if (logoutBtn)
        logoutBtn.addEventListener('click', function () {
            logout()
            toggleDropdownMenu()
        })

    updateAccountIcon()
})

function toggleDropdownMenu() {
    accountDropdown.classList.toggle('open');
    // dropdownFlag = accountDropdown.classList.contains('open');

}

/* ══════════════════════════════════════════════════════════
      FEEDBACK MODAL
   ══════════════════════════════════════════════════════════ */

function initFeedbackModal() {
    feedbackModal = document.getElementById('feedback-modal')
    document.getElementById('feedback-btn').addEventListener('click', openFeedback)
    document.getElementById('feedback-close-btn').addEventListener('click', closeFeedback)
    feedbackModal.addEventListener('click', function (e) {
        if (e.target === feedbackModal) closeFeedback()
    })
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && feedbackModal.classList.contains('open')) closeFeedback()
    })
}

function openFeedback() {
    /* Reset to form view in case success was shown before */
    document.getElementById('feedback-form-view').style.display = 'block'
    document.getElementById('feedback-success-view').style.display = 'none'
    document.getElementById('fb-error').style.display = 'none'
    feedbackModal.classList.add('open')
}

function closeFeedback() {
    feedbackModal.classList.remove('open')
}

function submitFeedback() {
    var name = document.getElementById('fb-name').value.trim()
    var email = document.getElementById('fb-email').value.trim()
    var message = document.getElementById('fb-message').value.trim()
    var errEl = document.getElementById('fb-error')

    if (!name || !email || !message) {
        errEl.textContent = 'Please fill in all fields.'
        errEl.style.display = 'block'
        return
    }

    errEl.style.display = 'none'

    /* Save to localStorage */
    var existing = JSON.parse(localStorage.getItem('bh_feedback') || '[]')
    existing.push({ name, email, message, date: new Date().toISOString() })
    localStorage.setItem('bh_feedback', JSON.stringify(existing))

    /* Show success */
    document.getElementById('feedback-form-view').style.display = 'none'
    var successEl = document.getElementById('feedback-success-view')
    successEl.style.display = 'flex'

    /* Auto-close after 2 seconds */
    setTimeout(closeFeedback, 2000)
}