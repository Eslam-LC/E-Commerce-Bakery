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
            // TODO: proper login logic but for tests loggin directky
            login({
                "id": 1,
                "name": "Ahmed Al-Mansouri",
                "email": "ahmed.almansouri@example.com"
            })
            location.href = '../index.html'
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
