// // var params=new URLSearchParams(location.search);
// // var id =params.get("id")
// // console.log(id)

var id = 19



var xhr = new XMLHttpRequest();
xhr.open('GET', `./api/products.json`);
xhr.responseType = "json";
xhr.send();
xhr.onload = function () {
    var products = xhr.response


    var product = products.find(function (p) {
        return p.id == id;
    });


    document.getElementsByClassName("title")[0].textContent = product.name
    document.getElementsByClassName("rating-value")[0].textContent = product.rating




    let mainImgg = document.getElementsByClassName("main-img")[0]
    mainImgg.src = "./api" + product.thumbnail;




    var stockk = document.getElementsByClassName("stock-alert")[0]

    if (product.stock == 0) {
        stockk.innerHTML = `
    <i class="fa-solid fa-fire"></i> Out of Stock
    `

    }
    else if (product.stock < 5) {
        stockk.innerHTML = `
    <i class="fa-solid fa-fire"></i> ONLY <span class="stock-num"> ${product.stock} </span> LEFT IN STOCK!
    `
    }
    else {

        stockk.innerHTML = `
    <i class="fa-solid fa-fire"></i> In Stock: <span class="stock-num"> ${product.stock} </span> Pieces Available !
    `
    }

    // if (product.stock == 0) {
    //     stockk.textContent = "Out of Stock "
    // }
    // else if (product.stock == 1) {
    //     stockk.textContent = "Last Piece  "
    // }
    // else {
    //     stockk.textContent = `${product.stock} Pieces Available`

    // }

    document.getElementsByClassName("price")[0].textContent = `$ ${product.price}`
    document.getElementsByClassName("description")[0].textContent = product.description;





    document.getElementById("weight").textContent = product.specs.weight





    var smallImgs = document.getElementsByClassName("small-images");
    for (var i = 0; i < product.images.length; i++) {
        if (smallImgs[i]) {
            smallImgs[i].src = product.images[i];

            smallImgs[i].addEventListener("click", function () {
                mainImgg.src = this.src;
            });
        }
    }

    
    // ////****************************************************** */



    var qty = 1
    var qtyValue = document.getElementById("qty-value")


    document.getElementById("plus").addEventListener('click', function () {
        if (qty < product.stock) {
            qty++;
            qtyValue.textContent = qty;
        }

    });


    document.getElementById("minus").addEventListener("click", function () {
        if (qty > 1) {
            qty--;
            qtyValue.textContent = qty;
        }
    });

document.getElementsByClassName("add-to-cart")[0].addEventListener('click'  ,function (){

    var cart = JSON.parse(localStorage.getItem("cart")) || []


    var existing = cart.find(function (item) {
        return item.id == product.id;
    });


    if (existing) {
        // المنتج موجود → زود الكمية بس
        existing.quantity += qty;
    } else {
        // مش موجود → ضيف منتج جديد
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            thumbnail: product.thumbnail,
            quantity: qty
        });
    }





    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Added ${qty} item(s) to Cart!`);

    });
    


}







/************************* */


function showTab(tabName) {
    // إخفاء كل الـ content
    document.querySelectorAll(".tab-content").forEach(function (el) {
        el.style.display = "none";
    });

    // إزالة active من كل الـ tabs
    document.querySelectorAll(".tab").forEach(function (el) {
        el.classList.remove("active");
    });

    // إظهار الـ tab المختار
    document.getElementById(tabName).style.display = "block";

    // إضافة active للـ button المضغوط
    event.target.classList.add("active");
}



/******************* */


