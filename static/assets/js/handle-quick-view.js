
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

async function GetConvertedValues(value) {
  var url = "{% url 'get_selected_currency' %}",
    valuereturn = 0;
  await fetch(url, {
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
      (valuereturn = (data.factor * value).toFixed(2)), (symbol = data.symbol);
    });
  return { symbol: symbol, value: valuereturn };
}

async function GetConvertedRangeValues(value1, value2) {
  var url = "{% url 'get_selected_currency' %}",
    valuereturn1 = 0,
    valuereturn2 = 0;
  await fetch(url, {
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
      (valuereturn1 = (data.factor * value1).toFixed(2)),
        (valuereturn2 = (data.factor * value2).toFixed(2)),
        (symbol = data.symbol);
    });
  return { symbol: symbol, value1: valuereturn1, value2: valuereturn2 };
}

async function handleQuickView(params) {
  var url = "{% url 'quick_view' %}";
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({
      productId: params.productId,
      productVariantId: params.productVariantId,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let id = data.productId;
      let firstProductVariant = data.firstProductVariant;
      
      console.log('--------multipleImages>>>>',data.multipleImages);

      var productDetailsAtQuickView=document.getElementById('product-details');
      if(productDetailsAtQuickView){
        productDetailsAtQuickView.remove();
      }

      // // setTimeout(()=>{
      // 
      // var quickViewSliderId=document.getElementsByClassName('quick-view-slider ratio_2');
      // console.log('-----quickViewSliderId>>>>',quickViewSliderId);
      // if(quickViewSliderId[0]){
      //   quickViewSliderId[0].remove();
      // }
      // 
      
      
      // // },2000);
      // // setTimeout(()=>{
      // 
      // var quickNavId=document.getElementsByClassName('quick-nav');
      // console.log('---------------------quickNavId>>>>',quickNavId);
      // 
      // if(quickNavId[0]){
      //   quickNavId[0].remove();
      // }
      // // },2000);


      // ================= for rating ==================
      let productRatingDiv = document.getElementById("productRating");
      productRatingDiv.innerHTML = "";

      for (let j = 1; j <= 5; j++) {
        let ratingLi = document.createElement("li"),
          icon = document.createElement("i");
        icon.setAttribute("class", "fas fa-star");
        if (j <= data.productFinalRating) {
          icon.classList.add("theme-color");
        }
        ratingLi.appendChild(icon);
        productRatingDiv.appendChild(ratingLi);
      }
      let stockStatusLi = document.createElement("li");
      stockStatusLi.setAttribute("class", "font-light");
      stockStatusLi.setAttribute("id", "stockStatus");
      productRatingDiv.appendChild(stockStatusLi);

      // ================= for rating ends==================

      document.getElementById("productName").innerHTML = data.productName;
      document.getElementById("stockStatus").innerHTML =
        "( " + data.productStockStatus + " )";
      // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", data);

      document.getElementById("productPrice").innerHTML =
        data.productVariantMinPrice +
        "-" +
        data.productVariantMaxPrice +
        ".05550";
      // document.getElementById('productPrice').innerHTML = data.productFinalPrice + ".00";

      if (data.productType == "Simple") {
        GetConvertedValues(data.productVariantPrice1).then((Data) => {
          document.getElementById("productPrice").innerHTML =
            Data.symbol + " " + Data.value;
        });
        // document.getElementById("productPrice").innerHTML =data.productVariantPrice1 +".00";
      }
      if (data.productType == "Classified") {
        GetConvertedRangeValues(
          data.productVariantMinPrice,
          data.productVariantMaxPrice
        ).then((Data) => {
          document.getElementById("productPrice").innerHTML =
            Data.symbol +
            " " +
            Data.value1
            //  +
            // " - " +
            // Data.symbol +
            // " " +
            // Data.value2;
        });

        //document.getElementById("productPrice").innerHTML =data.productVariantMinPrice +"-" +data.productVariantMaxPrice +".00";
      }

      var element = document.getElementById("colorLabelDiv");

      if (data.productType == "Classified") {
        if (typeof element != "undefined" && element != null) {
          // removeElementsByClass() --> Custom function made by me at the end of script tag
          // removeElementsByClass("colorLi");
          // removeElementsByClass("sizeLi");
          // Appending colors to frontend from backend
          for (let i = 0; i < data.colorDict.length; i++) {
            let colorA = document.createElement("a");
            let colorsVariantUl = document.createElement("ul");

            let fun ="show_details_for_quick_view({key:'selectedColorAtQuickView',value:" +
            "'" +data.colorDict[i]["fn"] +"'" +",id:" +"'" +data.productId +"'" +"})";
            colorA.setAttribute("onClick", fun);
            colorsVariantUl.appendChild(colorA);

            let colorLi = document.createElement("img");
            colorLi.setAttribute("class", "colorLi");
            colorLi.setAttribute("src", data.colorDict[i]["img"]);

            colorA.appendChild(colorLi);
          }

          // Appending size to frontend from backend
          for (let k = 0; k < data.sizeDict.length; k++) {
          let sizeA = document.createElement("a");
          let sizeVariantUl = document.createElement("ul");


            let fun =
              "show_details_for_quick_view({key:'selectedSizeAtQuickView',value:" +
              "'" +
              data.sizeDict[k]["fn"]
              "'" +
              ",id:" +
              "'" +
              data.productId +
              "'" +
              "})";
            sizeA.setAttribute("onClick", fun);
            sizeVariantUl.appendChild(sizeA);

            let sizeLi = document.createElement("li");
            sizeLi.setAttribute("class", "sizeLi");
            sizeLi.innerHTML = data.sizeDict[k]["sn"];

            sizeA.appendChild(sizeLi);
          }

          // Exists.
        } else {
          // For Colors div
          let colorDiv = document.createElement("div");
          colorDiv.setAttribute("class", "color-types");
          colorDiv.setAttribute("id", "colorLabelDiv");

          let colorsH4 = document.createElement("h4");
          colorsH4.setAttribute("id", "colorLabel");
          colorDiv.appendChild(colorsH4);

          let colorsVariantUl = document.createElement("ul");
          colorsVariantUl.setAttribute("class", "color-variant mb-0");
          colorsVariantUl.setAttribute("id", "colorsVariantUl");
          colorDiv.appendChild(colorsVariantUl);

          hiddenInputForColor = document.createElement("input");
          hiddenInputForColor.setAttribute("type", "hidden");
          hiddenInputForColor.setAttribute("name", "");
          hiddenInputForColor.setAttribute("id", "selectedColorAtQuickView");

          colorDiv.appendChild(hiddenInputForColor);

          // For Size div
          let sizeDiv = document.createElement("div");
          sizeDiv.setAttribute("class", "size-detail");
          sizeDiv.setAttribute("id", "sizeLabelDiv");

          let sizeH4 = document.createElement("h4");
          sizeH4.setAttribute("id", "sizeLabel");
          sizeDiv.appendChild(sizeH4);

          let sizeVariantUl = document.createElement("ul");
          sizeVariantUl.setAttribute("class", "abcd");
          sizeVariantUl.setAttribute("id", "sizeVariantUl");
          sizeDiv.appendChild(sizeVariantUl);

          hiddenInputForSize = document.createElement("input");
          hiddenInputForSize.setAttribute("type", "hidden");
          hiddenInputForSize.setAttribute("name", "");
          hiddenInputForSize.setAttribute("id", "selectedSizeAtQuickView");
          sizeDiv.appendChild(hiddenInputForSize);

          // For price label
          let priceLabell = document.getElementById("priceLabel");

          // Appending Price and Color label to DIV's
          priceLabell.after(colorDiv);
          colorDiv.after(sizeDiv);

          document.getElementById("colorLabel").innerHTML = "Colors";
          document.getElementById("sizeLabel").innerHTML = "Size";

          // Appending colors to frontend from backend
          for (let i = 0; i < data.colorDict.length; i++) {
            let colorUlLi = document.createElement("li");
            let colorA = document.createElement("a");
            let fun =
              "show_details_for_quick_view({key:'selectedColorAtQuickView',value:" +
              "'" +
              data.colorDict[i]["fn"] +
              "'" +
              ",id:" +
              "'" +
              data.productId +
              "'" +
              "})";
            colorA.setAttribute("onClick", fun);
            colorsVariantUl.appendChild(colorUlLi);

            let colorLi = document.createElement("img");
            colorLi.setAttribute("class", "colorLi");
            colorLi.setAttribute("src", data.colorDict[i]["img"]);

            colorUlLi.appendChild(colorA);
            colorA.appendChild(colorLi);
          }

          // Appending size to frontend from backend
          for (let k = 0; k < data.sizeDict.length; k++) {
            let sizeUlLi = document.createElement("li");
            let sizeA = document.createElement("a");
            let fun =
              "show_details_for_quick_view({key:'selectedSizeAtQuickView',value:" +
              "'" +
              data.sizeDict[k]["fn"] +
              "'" +
              ",id:" +
              "'" +
              data.productId +
              "'" +
              "})";
            sizeA.setAttribute("onClick", fun);
            sizeVariantUl.appendChild(sizeUlLi);

            let sizeLi = document.createElement("li");
            sizeLi.setAttribute("class", "sizeLi");
            sizeLi.innerHTML = data.sizeDict[k]["sn"];

            sizeUlLi.appendChild(sizeA);
            sizeA.appendChild(sizeLi);
          }
        }
      } else {
        if (typeof element != "undefined" && element != null) {
          document.getElementById("colorLabelDiv").remove();
          document.getElementById("sizeLabelDiv").remove();
        } else {
        }
      }

      let url1 = "add_to_cart_fun_at_quick_view({key:'test'})".replace(
        "test",
        firstProductVariant.toString()
      );
      document.getElementById("addToCart").setAttribute("onClick", url1);

      let url2 = "{% url 'left_slidebar' 'test' %}".replace(
        "test",
        id.toString()
      );
      document.getElementById("productLeftSlidebar").setAttribute("href", url2);

      var images = document.getElementsByClassName("product-quick-view");

      // for (var i = 0; i < images.length; i++) {
      //   images[i].setAttribute("src", data.multipleImages);
      //   if (images[i].classList.contains("bg-img")) {
      //     images[i].parentElement.style.backgroundImage = `url("${data.multipleImages}")`;
      //   }
      // }

      // Code to render out product details like Category and Brand in quick model view START -------------------------

      const div = document.createElement("div");
      div.className = "product-details";
      div.id="product-details"
      
        
      const h4 = document.createElement("h4");
      h4.textContent = "product details";
      div.appendChild(h4);

      const ul = document.createElement("ul");

      const li1 = document.createElement("li");
      const span1 = document.createElement("span");
      span1.className = "font-light";
      span1.textContent = "Brand :";
      li1.appendChild(span1);
      li1.appendChild(document.createTextNode(data.brand));
      ul.appendChild(li1);

      const li2 = document.createElement("li");
      const span2 = document.createElement("span");
      span2.className = "font-light";
      span2.textContent = "Category :";
      li2.appendChild(span2);
      li2.appendChild(document.createTextNode(data.category));
      ul.appendChild(li2);

      div.appendChild(ul);

      var sizeDivAtQuickView = document.getElementById("sizeLabelDiv");

      if (sizeDivAtQuickView) {
        sizeDivAtQuickView.after(div);
      } else {
        var priceLabelAtQuickView = document.getElementById("priceLabel");
        priceLabelAtQuickView.after(div);
      }
      // Code to render out product details like Category and Brand in quick model view End ---------------------------

      // Code to render out multiple images in quick model view START -------------------------------------------------
      
      // Code to render out multiple images in quick model view END ---------------------------------------------------
    });
}

function removeElementsByClass(className) {
  const elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

//------------------------------

async function show_details_for_quick_view(params) {
  document.getElementById(params.key).setAttribute("value", params.value);
  var selectedSizeAtQuickView = document
    .getElementById("selectedSizeAtQuickView")
    .getAttribute("value");
  var selectedColorAtQuickView = document
    .getElementById("selectedColorAtQuickView")
    .getAttribute("value");
  if (selectedColorAtQuickView.length && selectedSizeAtQuickView.length) {
    console.log("call api here");
    var url = "{% url 'get_product_variant' %}";
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({
        productId: params.id,
        selectedSize: selectedSizeAtQuickView,
        selectedColor: selectedColorAtQuickView,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.productVariantPrice == "Product Out Of Stock") {
          document.getElementById("productPrice").innerHTML =
            data.productVariantPrice;
        } else {
          GetConvertedValues(data.productVariantPrice).then((Data) => {
            document.getElementById("productPrice").innerHTML =
              Data.symbol + " " + Data.value;
          });

          // document.getElementById('productPrice').innerHTML="$"+ data.productVariantPrice
          if (data.productVariantDiscount > 0) {
            let priceLabel = document.getElementById("priceLabel");

            let productPrice = document.getElementById("productPrice");

            // var delLabel = document.getElementById("actualPriceAtQuickView");
            // if(delLabel){
            //   delLabel.remove();
            // }
            // var spanLabel = document.getElementById("discountPercentageAtQuickView");
            // if(spanLabel){
            //   spanLabel.remove();
            // }

            let actualPriceAtQuickView = document.createElement("del");
            let discountPercentageAtQuickView = document.createElement("span");

            actualPriceAtQuickView.setAttribute("id", "actualPriceAtQuickView");
            discountPercentageAtQuickView.setAttribute(
              "id",
              "discountPercentageAtQuickView"
            );

            GetConvertedValues(data.productVariantPrice).then((Data) => {
              productPrice.innerHTML = Data.symbol + " " + Data.value;
            });
            GetConvertedValues(data.productVariantActualPrice).then((Data) => {
              actualPriceAtQuickView.innerHTML =
                Data.symbol + " " + Data.value + " ";
            });
            discountPercentageAtQuickView.innerHTML =
              data.productVariantDiscount + "%";

            // priceLabel.appendChild(productPrice);
            // priceLabel.appendChild(actualPriceAtQuickView);
            // priceLabel.appendChild(discountPercentageAtQuickView);
          }
        }
        let urlForAddToCartAddToCart =
          "add_to_cart_fun_at_quick_view({key:'firstProductVariant'})";
        urlForAddToCartAddToCart = urlForAddToCartAddToCart.replace(
          "firstProductVariant",
          data.productVariantId.toString()
        );

        document
          .getElementById("addToCart")
          .setAttribute("onClick", urlForAddToCartAddToCart);
      });
  }
}
function add_to_cart_fun_at_quick_view(params) {
  let quantityValue = 1;
  if (params.key == "No Product Yet") {
    // No product yet for selected attribute so.... bhai me add kya karu ??
  } else {
    let url = "{% url 'add_to_cart' 'id' 'quantity' %}";
    url = url.replace("id", params.key);
    url = url.replace("quantity", quantityValue);
    fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    });
    window.location.reload();
  }
}