
function initLogin() {
    if (isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('forgot-link').addEventListener('click', function (e) {
        e.preventDefault();
        var email = document.getElementById('login-email').value.trim();
        if (!email) {
            showError('login-error', 'Enter your email first, then click Forgot Password.');
        } else {
            showError('login-error', 'A reset link has been sent to: ' + email);
        }
    });

    document.getElementById('login-btn').addEventListener('click', function () {
        var email = document.getElementById('login-email').value.trim();
        var password = document.getElementById('login-password').value.trim();
        var remember = document.getElementById('remember-me').checked;

        if (!email || !password) {
            showError('login-error', 'Please enter your email and password.');
            return;
        }

        validateCredentials(email, password,
            function (userData) {
                login(userData);
                if (remember) {
                    localStorage.setItem('bh_remember', 'true');
                }
                window.location.href = 'index.html';
            },
            function (msg) {
                showError('login-error', msg);
            }
        );
    });
}


function initRegister() {
    if (isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('register-btn').addEventListener('click', function () {
        var name = document.getElementById('reg-name').value.trim();
        var email = document.getElementById('reg-email').value.trim();
        var password = document.getElementById('reg-password').value.trim();
        var confirm = document.getElementById('reg-confirm').value.trim();

        if (!name || !email || !password || !confirm) {
            showError('registerError', 'enter all inputs');
            return;
        }

        if (password !== confirm) {
            showError('registerErrorr', 'Passwords not match');
            return;
        }

        fetchJSON('/api/users.json', function (seededUsers) {
            var extraUsers = JSON.parse(localStorage.getItem('bh_users_extra') || '[]');
            var allUsers = seededUsers.concat(extraUsers);

            for (var i = 0; i < allUsers.length; i++) {
                if (allUsers[i].email === email) {
                    showError('register-error', 'This email is already registered.');
                    return;
                }
            }

            var newUser = { id: Date.now(), name: name, email: email, password: password };
            extraUsers.push(newUser);
            localStorage.setItem('bh_users_extra', JSON.stringify(extraUsers));

            login({ id: newUser.id, name: newUser.name, email: newUser.email });
            window.location.href = '/index.html';
        });
    });
}


if (document.getElementById('login-btn')) initLogin();
else if (document.getElementById('register-btn')) initRegister();

