updateCartBadge();
updateAccountIcon();

var xhr = new XMLHttpRequest();
xhr.open('GET', './api/products');
xhr.responseType = 'json';
xhr.send()
xhr.onload = function () {
    var products = xhr.response;
    // console.log(products);
    for (var product of products.slice(0, 16)) {
        
        var discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);


        var card = document.createElement('div');
        card.className = 'deal-card';
        card.innerHTML =
            '<div class="deal-badge">SAVE ' + discount + '%</div>' +
            '<div class="deal-card-img" style="background-image:url(./api' + encodeURI(product.thumbnail) + ')"></div>' +
            '<div class="deal-card-body">' +
            '<p class="deal-card-name">' + product.name + '</p>' +
            '<div class="deal-card-stars">' + '★' + ' <span>(' + product.sales + ' sold)</span></div>' +
            '<div class="deal-card-pricing">' +
            '<span class="deal-card-price">$' + product.price.toFixed(2) + '</span>' +
            '<span class="deal-card-original">$' + product.originalPrice.toFixed(2) + '</span>' +
            '<a href="./product-detail.html?id=' + product.id + '" class="deal-card-btn"><i class="fa fa-cart-shopping"></i></a>' +
            '</div>'

        '</div>';

        document.getElementById('carousel-container').appendChild(card);


    }

}
