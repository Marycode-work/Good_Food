document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  const productType = urlParams.get("type");

  if (!productId || !productType) {
    alert("Missing product ID or type in URL.");
    return;
  }

  fetch("products.json")
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p.id === productId && p.type === productType);
      if (!product) {
        alert("Product not found.");
        return;
      }

      populateProductDetails(product);
    })
    .catch(err => {
      console.error("Error loading product:", err);
      alert("Failed to load product details.");
    });
});

function populateProductDetails(product) {
  const { title, description, price, image, images = [] } = product;

  // Update product title and description
  document.querySelector(".title-dv h3").textContent = title;
  document.querySelector(".del-cont p").textContent = description;

  // Update price (base)
  const priceElem = document.querySelector(".price-dv");
  const basePrice = parseFloat(price.replace("$", ""));
  priceElem.textContent = `$${basePrice.toFixed(2)}`;

  // Quantity functionality
  const qtyInput = document.getElementById("quantity-input");
  const incrementBtn = document.getElementById("button-increment");
  const decrementBtn = document.getElementById("button-decrement");

  incrementBtn.addEventListener("click", () => {
    qtyInput.value = parseInt(qtyInput.value) + 1;
    updatePrice();
  });

  decrementBtn.addEventListener("click", () => {
    if (parseInt(qtyInput.value) > 1) {
      qtyInput.value = parseInt(qtyInput.value) - 1;
      updatePrice();
    }
  });

  function updatePrice() {
    const quantity = parseInt(qtyInput.value);
    const total = basePrice * quantity;
    priceElem.textContent = `$${total.toFixed(2)}`;
  }

 // Set Order Now click behavior
document.querySelector(".order-btn a").addEventListener("click", (e) => {
  e.preventDefault();

  // Step 1: Clear any cart-based checkout data
  localStorage.removeItem("checkoutProducts");

  // Step 2: Get selected quantity
  const quantity = parseInt(qtyInput.value) || 1;
  const unitPrice = parseFloat(product.price.replace(/[^0-9.]/g, ""));
  const totalPrice = unitPrice;

  // Step 3: Prepare product data for single checkout
  const checkoutProduct = {
    ...product,
    quantity: quantity,
    price: totalPrice.toFixed(2) // store calculated price
  };

  // Step 4: Save and redirect
  localStorage.setItem("checkoutProduct", JSON.stringify(checkoutProduct));
  window.location.href = "checkout.html";
});


  // Carousel updates
  const mainCarousel = $("#main-carousel");
  const thumbCarousel = $("#thumbnail-carousel");

  if (mainCarousel.length && images.length > 0) {
    const slides = images.map(img => `<div class="item"><img src="${img}" alt="Product Image" /></div>`);
    mainCarousel.trigger("replace.owl.carousel", [slides.join("")]).trigger("refresh.owl.carousel");
  }

  if (thumbCarousel.length && images.length > 0) {
    const thumbs = images.map(img => `<div class="item"><img src="${img}" alt="Thumbnail" /></div>`);
    thumbCarousel.trigger("replace.owl.carousel", [thumbs.join("")]).trigger("refresh.owl.carousel");
  }
}
