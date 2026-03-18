

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
var cartItems = []       /* [{ productId, quantity }] from localStorage  */
var allProducts = []     /* full product list fetched from products.json  */
var SHIPPING = 2 + Math.random() * 10 % 3 + Math.random()

document.addEventListener('DOMContentLoaded', function () {
    updateCartBadge()
    updateAccountIcon()
    renderContactSection()

    cartItems = getCart()
    console.log(cartItems);


    if (cartItems.length === 0) {
        document.getElementById('order-items-list').innerHTML =
            '<div class="order-empty">Your cart is empty. <a href="products.html">Shop now</a></div>'
        document.getElementById('complete-btn').disabled = true
        document.getElementById('summary-subtotal').textContent = '$0.00'
        document.getElementById('summary-total').textContent = '$' + SHIPPING.toFixed(2)
        return
    }

    fetchJSON('./api/products', function (products) {
        allProducts = products
        renderOrderSummary()
    }, null)
})

/* ══════════════════════════════════════════════════════════
   CONTACT SECTION
   Shows user info card if logged in, email input if guest
══════════════════════════════════════════════════════════ */
function renderContactSection() {
    var section = document.getElementById('contact-section')
    var session = getSession()

    if (session) {
        section.innerHTML = `
          <div class="card">
            <div class="contact-card-info">
              <div class="contact-avatar">${session.name.charAt(0).toUpperCase()}</div>
              <div>
                <div class="contact-name">${session.name}</div>
                <div class="contact-email">${session.email}</div>
              </div>
            </div>
            <br>
            <button class="btn btn-outline" style="font-size:13px; padding:8px 16px;"
                    onclick="logout()">Logout</button>
          </div>
        `
    } else {
        section.innerHTML = `
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="guest-email" placeholder="you@example.com">
          </div>
          <div class="form-group">
            <label>First Name</label>
            <input type="text" id="ship-fname" placeholder="Jane">
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input type="text" id="ship-lname" placeholder="Smith">
          </div>
        `
    }
}

/* ══════════════════════════════════════════════════════════
   ORDER SUMMARY
   Renders compact item list + totals
══════════════════════════════════════════════════════════ */
function renderOrderSummary() {
    var subtotal = 0

    if (cartItems.length === 0) {
        return
    }

    for (var item of cartItems) {
        var product = allProducts.find(function (p) { return p.id == item.productId })
        if (!product) continue
        var lineTotal = product.price * item.quantity
        subtotal += lineTotal

    }


    document.getElementById('summary-subtotal').textContent = '$' + subtotal.toFixed(2)
    document.getElementById('summary-shipping').textContent = '+$' + SHIPPING.toFixed(2)
    updateTotals()
}

var donationAmount = 0

function selectDonation(btn) {
    /* Remove selected from all buttons */
    var btns = document.querySelectorAll('.donation-btn')
    for (var b of btns) b.classList.remove('selected')

    donationAmount = parseFloat(btn.dataset.amount)

    /* "None" stays unselected visually */
    if (donationAmount > 0) btn.classList.add('selected')

    updateTotals()
}

function updateTotals() {
    var subtotalElement = document.getElementById('summary-subtotal')
    var subtotal = parseFloat(subtotalElement.textContent.replace('$', '')) || 0
    var total = subtotal + SHIPPING + donationAmount

    document.getElementById('summary-total').textContent = '$' + total.toFixed(2)
    document.getElementById('complete-btn-label').textContent =
        'Complete Purchase — $' + total.toFixed(2)

    document.getElementById('summary-donation').textContent =
        donationAmount > 0 ? '+$' + donationAmount.toFixed(2) : '—'
}

/* ══════════════════════════════════════════════════════════
   COMPLETE PURCHASE
══════════════════════════════════════════════════════════ */
function completePurchase() {
    /* Save guest info if not logged in */
    if (!isLoggedIn()) {
        var data = {
            guestEmail: document.getElementById('guest-email'),
            firstName: document.getElementById('ship-fname'),
            lastName: document.getElementById('ship-lname'),
        }
        // console.log(data)
        for (const key in data) {
            const E = data[key];

            if (!E || !E.value.trim()) {
                E && E.focus()
                return
            }
        }
        localStorage.setItem('bh_guest_checkout', JSON.stringify(data))
    }

    var address = {
        address: document.getElementById('ship-address'),
        city: document.getElementById('ship-city'),
        country: document.getElementById('ship-country'),

    }
    for (const key in address) {
        const E = data[key];

        if (!E || !E.value.trim()) {
            E && E.focus()
            return
        }
    }

    var payment = {
        cardNum: document.getElementById('card-number'),
        cardExpire: document.getElementById('card-expiry'),
        cvv: document.getElementById('card-cvv'),

    }
    for (const E of payment) {

        if (!E || !E.value.trim()) {
            E && E.focus()
            return
        }
    }


    /* Show processing overlay */
    var overlay = document.getElementById('checkout-overlay')
    overlay.classList.add('active')

    if (donationAmount > 0) {
        localStorage.setItem('bh_donation', donationAmount.toFixed(2))
    }

    /* After 2 seconds — clear cart, decrement stock, show success */
    setTimeout(function () {
        for (var item of cartItems) {
            decrementStock(item.productId, item.quantity)
        }
        clearCart()
        renderCart()

        /* Swap spinner for success state */
        document.getElementById('overlay-spinner').style.display = 'none'
        document.getElementById('overlay-icon').style.display = 'block'
        document.getElementById('overlay-title').textContent = 'Order confirmed!'
        document.getElementById('overlay-subtitle').textContent =
            'Thank you for your purchase. Your baked goods are on their way 🎉'
        document.getElementById('overlay-return-btn').style.display = 'inline-flex'
        window.location.href = './index.html'
    }, 2000)
}

function returnToStore() {
    try {
        window.close()
    } catch (e) { /* ignore */ }
    /* Fallback if window.close() doesn't work */
    setTimeout(function () {
        window.location.href = 'index.html'
    }, 300)
}
