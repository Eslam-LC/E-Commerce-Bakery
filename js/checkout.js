

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
var cartItems = []       /* [{ productId, quantity }] from localStorage  */
var allProducts = []     /* full product list fetched from products.json  */
var SHIPPING = 4.50

document.addEventListener('DOMContentLoaded', function () {
    updateCartBadge()
    updateAccountIcon()
    renderContactSection()

    cartItems = getCart()

    if (cartItems.length === 0) {
        document.getElementById('order-items-list').innerHTML =
            '<div class="order-empty">Your cart is empty. <a href="products.html">Shop now</a></div>'
        document.getElementById('complete-btn').disabled = true
        document.getElementById('summary-subtotal').textContent = '$0.00'
        document.getElementById('summary-total').textContent = '$' + SHIPPING.toFixed(2)
        return
    }

    fetchJSON('api/products.json', function (products) {
        allProducts = products
        renderOrderSummary()
    }, function () {
        document.getElementById('order-items-list').innerHTML =
            '<div class="order-empty">Could not load product data.</div>'
    })
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
        `
    }
}

/* ══════════════════════════════════════════════════════════
   ORDER SUMMARY
   Renders compact item list + totals
══════════════════════════════════════════════════════════ */
function renderOrderSummary() {
    var list = document.getElementById('order-items-list')
    var subtotal = 0

    if (cartItems.length === 0) {
        list.innerHTML = '<div class="order-empty">Your cart is empty.</div>'
        return
    }

    var html = ''
    for (var item of cartItems) {
        var product = allProducts.find(function (p) { return p.id == item.productId })
        if (!product) continue
        var lineTotal = product.price * item.quantity
        subtotal += lineTotal
        html += `
          <div class="order-item">
            <div class="order-item-left">
              <span class="order-item-qty">${item.quantity}</span>
              <span class="order-item-name">${product.name}</span>
            </div>
            <span class="order-item-price">$${lineTotal.toFixed(2)}</span>
          </div>
        `
    }

    list.innerHTML = html || '<div class="order-empty">No items found.</div>'

    document.getElementById('summary-subtotal').textContent = '$' + subtotal.toFixed(2)
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
    var subtotalEl = document.getElementById('summary-subtotal')
    var subtotal = parseFloat(subtotalEl.textContent.replace('$', '')) || 0
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
        var guestEmail = document.getElementById('guest-email')
        if (!guestEmail || !guestEmail.value.trim()) {
            guestEmail && guestEmail.focus()
            return
        }
        localStorage.setItem('bh_guest_checkout', JSON.stringify({
            email: guestEmail.value.trim(),
            firstName: document.getElementById('ship-fname').value,
            lastName: document.getElementById('ship-lname').value,
            address: document.getElementById('ship-address').value
        }))
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

        /* Swap spinner for success state */
        document.getElementById('overlay-spinner').style.display = 'none'
        document.getElementById('overlay-icon').style.display = 'block'
        document.getElementById('overlay-title').textContent = 'Order confirmed!'
        document.getElementById('overlay-subtitle').textContent =
            'Thank you for your purchase. Your baked goods are on their way 🎉'
        document.getElementById('overlay-return-btn').style.display = 'inline-flex'
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
