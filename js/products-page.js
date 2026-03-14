var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://raw.githubusercontent.com/Eslam-LC/E-Commerce-Bakery/refs/heads/main/api/products');
xhr.send();
xhr.responseType = "json"
xhr.onload = function () {

  var products = xhr.response
  // console.log(xhr.response);

  for (var prod of products) {
    var a = document.createElement('a')
    var img = document.createElement('img')
    var h3Name = document.createElement('h3')
    var h3Price = document.createElement('h3')
    var h5Category = document.createElement('h5')
    var btnDetails = document.createElement('button')

    a.classList.add('prod-card')

    a.href = './product-detail.html?id=' + prod.id
    img.src = prod.images[0]
    h3Name.innerHTML = prod.name
    h3Price.innerHTML = prod.price
    h5Category.innerHTML = 'Category : ' + prod.category
    btnDetails.innerHTML = 'View Details →'
    // btnDetails.onclick(f)

    a.append(img, h5Category, h3Name, h3Price)  /** */
    document.getElementById("product-grid").append(a)

  }

}