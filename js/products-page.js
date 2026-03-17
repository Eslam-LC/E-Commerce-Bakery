updateCartBadge()
updateAccountIcon()

var allProducts = []
var categoryParam = null

var xhr = new XMLHttpRequest()
xhr.open('GET', 'https://raw.githubusercontent.com/Eslam-LC/E-Commerce-Bakery/refs/heads/main/api/products')
xhr.responseType = "json"
xhr.send()

xhr.onload = function () {

    allProducts = xhr.response

    const urlParams = new URLSearchParams(window.location.search)
    categoryParam = urlParams.get('category')

    let initialProducts = allProducts
    if (categoryParam) {
        initialProducts = allProducts.filter(p => p.category === categoryParam)
    }

    renderGrid(initialProducts)
    buildCategories(allProducts)
}

function renderGrid(list) {

    var grid = document.getElementById("product-grid")
    grid.innerHTML = ""

    document.getElementById("results-header").innerHTML =
        "<h3>" + list.length + " Products Found</h3>"

    for (var prod of list) {

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
        h3Price.innerHTML = "$" + prod.price
        h5Category.innerHTML = "Category : " + prod.category

        btnDetails.innerHTML = "View Details →"

        a.append(img, h5Category, h3Name, h3Price, btnDetails)

        grid.append(a)
    }
}

function buildCategories(products) {

    var sidebar = document.getElementById("filters-sidebar")

    var categories = []

    for (var p of products) {
        if (!categories.includes(p.category)) {
            categories.push(p.category)
        }
    }

    var html = "<h3>Categories</h3>"

    for (var cat of categories) {

        html += `
        <label>
            <input type="checkbox" value="${cat}" class="cat-filter">
            ${cat}
        </label><br>
        `
    }

    html += `<br><input type="text" id="search" placeholder="Search product">`

    sidebar.innerHTML = html

    var checks = document.querySelectorAll(".cat-filter")

    for (var c of checks) {
        c.addEventListener("change", applyFilters)
    }

    document.getElementById("search").addEventListener("input", applyFilters)

    if (categoryParam) {
        const checkbox = document.querySelector(`input.cat-filter[value="${categoryParam}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
        applyFilters();
    }
}

function applyFilters() {

    var search = document.getElementById("search").value.toLowerCase()

    var checks = document.querySelectorAll(".cat-filter:checked")

    var selectedCats = []

    for (var c of checks) {
        selectedCats.push(c.value)
    }

    var filtered = []

    for (var p of allProducts) {

        var matchSearch = p.name.toLowerCase().includes(search)

        var matchCat =
            selectedCats.length == 0 ||
            selectedCats.includes(p.category)

        if (matchSearch && matchCat) {
            filtered.push(p)
        }
    }

    renderGrid(filtered)
}