function getCart() {
    var cart = localStorage.getItem("bh_cart");
    if (cart) {
        return JSON.parse(cart);
    } else {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("bh_cart", JSON.stringify(cart));
}

function addToCart(id, qty) {
    var cart = getCart();
    var found = false;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].productId == id) {
            cart[i].quantity += qty;
            found = true;
            break;
        }
    }
    if (!found) cart.push({ productId: id, quantity: qty });
    saveCart(cart);
    updateCartBadge();
}

function removeFromCart(id) {
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].productId == id) {
            cart.splice(i, 1);
            break;
        }
    }
    saveCart(cart);
    updateCartBadge();
}

function updateQuantity(id, qty) {
    if (qty <= 0) {
        removeFromCart(id);
        return;
    }
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].productId == id) {
            cart[i].quantity = qty;
            break;
        }
    }
    saveCart(cart);
    updateCartBadge();
}

function clearCart() {
    localStorage.removeItem("bh_cart");
    updateCartBadge();
}

function getItemCount() {
    var cart = getCart();
    var total = 0;
    for (var i = 0; i < cart.length; i++) total += cart[i].quantity;
    return total;
}

function updateCartBadge() {
    var badge = document.getElementById("cart-badge");
    if (badge) badge.innerText = getItemCount();
}

function renderCart() {
    var cart = getCart();
    var box = document.getElementById("cart-content");
    if (!box) return;

    if (cart.length === 0) {
        box.innerHTML =
            '<div class="empty-state">' +
            '<p>Your cart is empty 🛒</p>' +
            '<a href="/products.html" class="btn btn-primary">Browse Products</a>' +
            '</div>';
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://raw.githubusercontent.com/Eslam-LC/E-Commerce-Bakery/refs/heads/main/api/products");
    xhr.onload = function () {
        if (xhr.status === 200) {
            var products = JSON.parse(xhr.responseText);
            var html = "";
            var subtotal = 0;

            for (var i = 0; i < cart.length; i++) {
                var item = cart[i];
                var product = null;
                for (var j = 0; j < products.length; j++) {
                    if (products[j].id == item.productId) {
                        product = products[j];
                        break;
                    }
                }
                if (!product) continue;

                var price = product.price * item.quantity;
                subtotal += price;

                var shortDesc = "";
                if (product.description) {
                    if (product.description.length > 60) {
                        shortDesc = product.description.substring(0, 60) + "…";
                    } else {
                        shortDesc = product.description;
                    }
                }

                var imgSrc = product.thumbnail;
                if (!imgSrc.startsWith("http")) {
                    imgSrc = "./api" + imgSrc;
                }

                html +=
                    '<div class="cart-item card">' +
                    '<img src="' + imgSrc + '" alt="' + product.name + '" onerror="this.src=\'https://placehold.co/80x80/f6efe8/c35a0a?text=🍞\'">' +
                    '<div class="cart-item-info">' +
                    '<p class="item-name">' + product.name + '</p>' +
                    '<p class="item-desc">' + shortDesc + '</p>' +
                    '<div class="qty-controls">' +
                    '<button class="qty-btn-minus" onclick="updateQuantity(' + item.productId + ',' + (item.quantity - 1) + ');renderCart()">−</button>' +
                    '<span class="qty-value">' + item.quantity + '</span>' +
                    '<button class="qty-btn-plus" onclick="updateQuantity(' + item.productId + ',' + (item.quantity + 1) + ');renderCart()">+</button>' +
                    '<button class="remove-btn" onclick="removeFromCart(' + item.productId + ');renderCart()">🗑 Remove</button>' +
                    '</div></div>' +
                    '<p class="item-price">$' + price.toFixed(2) + '</p>' +
                    '</div>';
            }

            var total = subtotal;

            box.innerHTML =
                '<div class="cart-layout">' +
                '<div class="cart-left">' +
                '<div class="cart-header-row">' +
                '<p>You have <b>' + cart.length + '</b> item(s)</p>' +
                '<button class="clear-btn" onclick="clearCart();renderCart()">🗑 Clear Cart</button>' +
                '</div>' +
                html +
                '<a href="/products.html" class="btn btn-primary checkout-btn"> Continue Shopping</a>' +
                '</div>' +
                '<div class="cart-right"><div class="order-summary">' +
                '<h3>Order Summary</h3>' +
                '<div class="summary-row"><span>Subtotal</span><span>$' + subtotal.toFixed(2) + '</span></div>' +
                '<hr>' +
                '<div class="summary-row total"><span>Total</span><span>$' + total.toFixed(2) + '</span></div>' +
                '<a href="/checkout.html" target="_blank" class="btn btn-primary checkout-btn">Proceed to Checkout</a>' +
                '</div></div></div>';
        }
    };
    xhr.send();
}

window.addEventListener("load", function() {
    updateCartBadge();
    renderCart();
});