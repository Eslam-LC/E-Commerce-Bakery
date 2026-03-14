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
     stockk.innerHTML=`
    <i class="fa-solid fa-fire"></i> Out of Stock
    `

    }
    else if (product.stock <5) {
    stockk.innerHTML=`
    <i class="fa-solid fa-fire"></i> ONLY <span class="stock-num"> ${product.stock} </span> LEFT IN STOCK!
    `
}
    else {

          stockk.innerHTML=`
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





document.getElementById("weight").textContent=product.specs.weight









    var smallImgs = document.getElementsByClassName("small-images");
    for (var i = 0; i < product.images.length; i++) {
        if (smallImgs[i]) {
            smallImgs[i].src = product.images[i];

            smallImgs[i].addEventListener("click", function () {
                mainImgg.src = this.src;
            });
        }
    }


}







/************************* */


function showTab(tabName) {
    // إخفاء كل الـ content
    document.querySelectorAll(".tab-content").forEach(function(el) {
        el.style.display = "none";
    });

    // إزالة active من كل الـ tabs
    document.querySelectorAll(".tab").forEach(function(el) {
        el.classList.remove("active");
    });

    // إظهار الـ tab المختار
    document.getElementById(tabName).style.display = "block";

    // إضافة active للـ button المضغوط
    event.target.classList.add("active");
}



/******************* */
// document.addEventListener("DOMContentLoaded", function() {

//     var id = 1;

//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', `./api/products.json`);
//     xhr.responseType = "json";
//     xhr.send();

//     xhr.onload = function () {
//         var products = xhr.response;

//         var product = products.find(function(p){
//             return p.id == id;
//         });

//         // تأكد إن product موجود
//         if (!product) {
//             console.log("المنتج مش موجود!");
//             return;
//         }

//         document.getElementsByClassName("title")[0].textContent = product.name;
//         document.getElementsByClassName("main-img")[0].src = product.thumbnail;

//         var stockk = document.getElementsByClassName("stock")[0];
//         if (product.stock == 0) {
//             stockk.textContent = "Out of Stock";
//         } else if (product.stock == 1) {
//             stockk.textContent = "Last Piece";
//         } else {
//             stockk.textContent = `${product.stock} Pieces Available`;
//         }

//         document.getElementsByClassName("price")[0].textContent = product.price;
//         document.getElementsByClassName("description")[0].textContent = product.description;

//         var smallImgs = document.getElementsByClassName("small-images");
//         for (var i = 0; i < product.images.length; i++) {
//             if (smallImgs[i]) smallImgs[i].src = product.images[i];
//         }
//     };

//     xhr.onerror = function() {
//         console.log("فيه مشكلة في تحميل الـ JSON");
//     };

// });