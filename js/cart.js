/*
 * FILE:    js/cart.js
 * OWNER:   Person A
 *
 * PURPOSE:
 *   Everything related to the shopping cart and stock.
 *   Cart items are saved in localStorage so they survive page refreshes.
 *   Must be loaded after api.js on every page.
 *
 * STORAGE FORMAT (what gets saved in localStorage):
 *   key: 'bh_cart'
 *   value: a JSON array like [ { productId: 1, quantity: 2 }, { productId: 5, quantity: 1 } ]
 *
 *   key: 'bh_stock_offsets'
 *   value: a JSON object like { "1": 2, "5": 1 }
 *   (tracks how many of each product were purchased this session)
 *
 * ─────────────────────────────────────────────────────────────
 * CART FUNCTIONS
 * ─────────────────────────────────────────────────────────────
 *
 * getCart()
 *   INPUT:  nothing
 *   OUTPUT: array of { productId, quantity } objects
 *           returns empty array [] if cart is empty
 *
 * addToCart(productId, quantity)
 *   INPUT:  productId - number - the id of the product
 *           quantity  - number - how many to add (usually 1)
 *   OUTPUT: nothing — updates localStorage and refreshes the badge
 *   NOTE:   if product already in cart, adds to existing quantity
 *
 * removeFromCart(productId)
 *   INPUT:  productId - number - the id of the product to remove
 *   OUTPUT: nothing — removes the item and refreshes the badge
 *
 * updateQuantity(productId, newQuantity)
 *   INPUT:  productId   - number - the id of the product
 *           newQuantity - number - the new quantity to set
 *   OUTPUT: nothing — if newQuantity <= 0 the item is removed entirely
 *
 * clearCart()
 *   INPUT:  nothing
 *   OUTPUT: nothing — empties the cart completely (called after checkout)
 *
 * getItemCount()
 *   INPUT:  nothing
 *   OUTPUT: number — total items across all cart entries
 *           example: 2x croissants + 1x cake = 3
 *
 * updateCartBadge()
 *   INPUT:  nothing
 *   OUTPUT: nothing — updates the number on the cart icon in the header
 *           hides the badge when count is 0, shows it when > 0
 *   NOTE:   call this on every page load and after any cart change
 *
 * ─────────────────────────────────────────────────────────────
 * STOCK FUNCTIONS
 * ─────────────────────────────────────────────────────────────
 *
 * getAvailable(product)
 *   INPUT:  product - object - a full product object from products.json
 *   OUTPUT: number — how many are actually available right now
 *           (product.stock minus anything purchased this session)
 *
 * getStatusLabel(available)
 *   INPUT:  available - number - result of getAvailable()
 *   OUTPUT: object with two fields:
 *             text     - string - what to display  e.g. "Only 2 left!"
 *             cssClass - string - CSS class to apply e.g. "low-stock"
 *
 *   The three possible cssClass values (defined in global.css):
 *     "in-stock"     → available > 5
 *     "low-stock"    → available is 1 to 5
 *     "out-of-stock" → available is 0
 *
 * decrementStock(productId, quantity)
 *   INPUT:  productId - number - the id of the product
 *           quantity  - number - how many were purchased
 *   OUTPUT: nothing — saves the offset to localStorage
 *   NOTE:   called by Person E for each cart item after checkout
 *
 * ─────────────────────────────────────────────────────────────
 */

function getCart() {
    var cartString = localStorage.getItem('bh_cart')
    if (cartString != null) {
        return JSON.parse(cartString)
    } else {
        var cart = []
        localStorage.setItem('bh_cart', JSON.stringify(cart))
        return cart
    }
}

function addToCart(productId, quantity) {
    var cart = getCart(), flag = false
    for (const p of cart) {
        if (p.productId == productId) {
            p.quantity += quantity
            flag = true
            break
        }
    }
    if (!flag) {
        cart.push({ productId, quantity })
    }
    localStorage.setItem('bh_cart', JSON.stringify(cart))
    updateCartBadge()
}

function removeFromCart(productId) {
    var cart = getCart()
    for (const key in cart) {
        const p = cart[key]
        if (p.productId == productId) {
            cart.splice(key, 1)
            break
        }
    }
    localStorage.setItem('bh_cart', JSON.stringify(cart))
    updateCartBadge()
}

function updateQuantity(productId, newQuantity) {

    //  * updateQuantity(productId, newQuantity)
    //  *   INPUT:  productId   - number - the id of the product
    //  *           newQuantity - number - the new quantity to set
    //  *   OUTPUT: nothing — if newQuantity <= 0 the item is removed entirely

    var cart = getCart()
    for (const p of cart) {
        if (p.productId == productId) {
            if (newQuantity <= 0) {
                removeFromCart(productId)
            } else {
                p.quantity = newQuantity
            }
            break
        }
    }
    localStorage.setItem('bh_cart', JSON.stringify(cart))
    updateCartBadge()
}

function clearCart() {
    localStorage.removeItem('bh_cart')
    updateCartBadge()
}

function getItemCount() {

    //  * STORAGE FORMAT (what gets saved in localStorage):
    //  *   key: 'bh_cart'
    //  *   value: a JSON array like [ { productId: 1, quantity: 2 }, { productId: 5, quantity: 1 } ]
    //  *
    var cart = getCart()
    var sum = 0
    for (const p of cart) {
        sum += p.quantity
    }
    return sum
}

function updateCartBadge() {
    var badge = document.getElementById('cart-badge')
    if (!badge) return
    badge.innerText = `${getItemCount()}`
}

function getAvailable(product) {
    // TODO (Person A)
}

function getStatusLabel(available) {
    // TODO (Person A)
}

function decrementStock(productId, quantity) {
    // TODO (Person A)
}
