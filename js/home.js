updateCartBadge();
updateAccountIcon();

var xhr = new XMLHttpRequest();
xhr.open('GET', '/api/products');
xhr.responseType = 'json';
xhr.send()
xhr.onload = function () {
    var products = xhr.response;
    // console.log(products);
    for (var product of products) {
        var card = document.createElement('div');
        card.className = 'deal-card';
        card.innerHTML =
            `<div class="deal-card-img" style="background-image:url(/api + ${product.thumbnail} + )"></div>` +
            '<div class="deal-card-body">' +
            '<p class="deal-card-name">' + product.name + '</p>' +
            '</div>';
        document.getElementById('carousel-container').appendChild(card);


    }
}