function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie("csrftoken");

function GetConvertedValues() {
    var url = "{% url 'GetSelectedCurrency' %}";
    fetch(url, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "X-CSRFToken": csrftoken,
        },
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log("response is=====>", data.currency);
        });
}
GetConvertedValues();

function show_details(params) {
    document.getElementById(params.key).setAttribute("value", params.value);
    var selectedSize = document
        .getElementById("selectedSize")
        .getAttribute("value");
    var selectedColor = document
        .getElementById("selectedColor")
        .getAttribute("value");

    if (selectedColor.length && selectedSize.length) {
        //console.log("call api here");
        var url = "{% url 'get_product_variant' %}";

        fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify({
                productId: params.id,
                selectedSize: selectedSize,
                selectedColor: selectedColor,
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.productVariantPrice == "Product Out Of Stock") {
                    document.getElementById("productFinalPrice").innerHTML =
                        data.productVariantPrice;
                } else {
                    document.getElementById("productFinalPrice").innerHTML =
                        "$" + data.productVariantPrice + ".00";
                    if (data.productVariantDiscount > 0) {
                        let productFinalPrice =
                            document.getElementById("productFinalPrice");
                        let actualPrice = document.createElement("del"),
                            discountPercentage = document.createElement("span");
                        productFinalPrice.appendChild(actualPrice);
                        discountPercentage.setAttribute("id", "discountPercentage");
                        productFinalPrice.appendChild(discountPercentage);
                        actualPrice.innerHTML = "$" + data.productVariantActualPrice;
                        discountPercentage.innerHTML = data.productVariantDiscount + "%";
                    }
                }
                let quantityValue = document
                    .getElementById("counterAtLeftSlidebar")
                    .getAttribute("value");
                let urlForAddToCartCartEffect =
                    "add_to_cart_fun({key:'firstProductVariant'})";
                urlForAddToCartCartEffect = urlForAddToCartCartEffect.replace(
                    "firstProductVariant",
                    data.productVariantId.toString()
                );
                document
                    .getElementById("cartEffect")
                    .setAttribute("onClick", urlForAddToCartCartEffect);
                let urlForAddToWishlistWishlistEffect =
                    "{% url 'add_to_wishlist' 'productVariantId' %}".replace(
                        "productVariantId",
                        data.productVariantId.toString()
                    );
                document
                    .getElementById("wishlistEffect")
                    .setAttribute("href", urlForAddToWishlistWishlistEffect);
            });
    }
}

function counterPlus(params) {
    let counterAtLeftSlidebar = document.getElementById(params.key);
    let a = counterAtLeftSlidebar.getAttribute("value");
    let b = Number(a) + 1;
    counterAtLeftSlidebar.setAttribute("value", b);
}

function counterMinus(params) {
    let counterAtLeftSlidebar = document.getElementById(params.key);
    let a = counterAtLeftSlidebar.getAttribute("value");
    let b = Number(a) - 1;
    if (b <= 0) {
        // if quantity goes to zero or negative then...rehne do tum se na ho payega
    } else {
        counterAtLeftSlidebar.setAttribute("value", b);
    }
}

function add_to_cart_fun(params) {
    console.log('===> Add to cart function calling <===');
    let counterAtLeftSlidebar = document.getElementById("counterAtLeftSlidebar");
    let errorContainer = document.getElementById("message"); // Get the error container element


    //  // Check if the element exists and has a valid value attribute
    //  if (!counterAtLeftSlidebar || !counterAtLeftSlidebar.hasAttribute("value")) {
    //     console.log("Please select valid attributes before adding to the cart.");
    //     errorContainer.innerText = "Please select valid attributes before adding to the cart.";
    //     return; // Exit the function without proceeding further.
    // }

    // let quantityValue = counterAtLeftSlidebar.getAttribute("value");

    // if (!counterAtLeftSlidebar || !quantityValue.hasAttribute("value")) {
    //     console.log('ITS NOT PERFECT ====>');
    // }
    // console.log('===> Add to cart function calling <===');
    // if (params.key == "No Product Yet") {
    //     // No Product Yet To bhai me add kya karuu ???  
    // } else {
    //     let url = "{% url 'add_to_cart' 'id' 'quantity' %}";
    //     url = url.replace("id", params.key);
    //     url = url.replace("quantity", quantityValue);
    //     console.log("url====", url);
    //     alert(url);

    //     // fetch(url, {
    //     //     method: "GET",
    //     //     headers: {
    //     //         "Content-type": "application/json",
    //     //         "X-CSRFToken": csrftoken,
    //     //     },
    //     // }).then((data) => {
    //     //     window.location.replace(data.url);
    //     // });
    // }
}
