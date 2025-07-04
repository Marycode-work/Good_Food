document.addEventListener("DOMContentLoaded", function () {
  // ================= Cart Badge Setup =================
  const cartCountElem = document.getElementById("cart-count");
  function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartCountElem) cartCountElem.textContent = cart.length;
  }
  updateCartBadge();

  // ================= 1. Product Carousel Rendering =================
  const carousel = document.querySelector(".pfood .owl-carousel");
  if (carousel) {
    fetch("products.json")
      .then(res => res.json())
      .then(products => {
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

        products.forEach(product => {
          const isWishlisted = wishlist.some(
            item => item.id === product.id && item.type === "dynamic"
          );

          const item = document.createElement("div");
          item.className = "item";
          item.innerHTML = `
            <div class="food-item">
              <div class="food-pic">
                <div class="like-icon">
                  <a href="#" class="add-to-wishlist" data-id="${product.id}" data-type="dynamic">
                    <i class="bi ${isWishlisted ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i>
                  </a>
                </div>
                <a href="product-details.html?id=${product.id}&type=dynamic">
                  <img src="${product.image}" srcset="${product.srcset || ''}" alt="img">
                </a>
              </div>
              <div class="food-content">
                <h3><a href="#">${product.title}</a></h3>
                <div class="star-rating">
                  <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                </div>
                <p>${product.description}</p>
                <h6>${product.price}
                  <a href="#" class="add-to-cart" data-id="${product.id}">
                    <img src="images/busket.svg" alt="Add to Cart">
                  </a>
                </h6>
                <a href="checkout.html" class="theme-btn order-hover order-now-btn" data-id="${product.id}" data-type="dynamic">Order now</a>
              </div>
            </div>
          `;
          carousel.appendChild(item);

          item.querySelector('.order-now-btn').addEventListener('click', (e) => {
            e.preventDefault();
          
            try {
              // Safety check
              if (!product || !product.id) {
                alert("Product not found. Please refresh and try again.");
                return;
              }
          
              // Clear previous checkout data to avoid confusion
              localStorage.removeItem("checkoutProducts"); // for cart
              localStorage.removeItem("checkoutProduct");  // for single product
          
              // Store the product for checkout
              const selectedProduct = { ...product, type: "dynamic" };
              localStorage.setItem("checkoutProduct", JSON.stringify(selectedProduct));
          
              // Redirect
              window.location.href = "checkout.html";
            } catch (err) {
              console.error("Error in Order Now:", err);
              alert("Something went wrong. Please try again.");
            }
          });
        });

        $('.pfood .owl-carousel').owlCarousel({
          loop: true,
          dots: true,
          margin: 7,
          items: 4,
          nav: true,
          navText: ['<i class="bi bi-chevron-left"></i>', '<i class="bi bi-chevron-right"></i>'],
          responsive: {
            0: { items: 1, nav: true },
            600: { items: 2, nav: false },
            1000: { items: 4, nav: true, loop: false }
          }
        });
      })
      .catch(err => console.error("Failed to load products:", err));
  }

  // ================= 2. Wishlist Page Rendering =================
  const wishlistContainer = document.getElementById("wishlist-container");
  if (wishlistContainer) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const dynamicWishlist = wishlist.filter(item => item.type === "dynamic");

    fetch("products.json")
      .then(res => res.json())
      .then(products => {
        if (dynamicWishlist.length === 0) {
          wishlistContainer.innerHTML = "<p class='empty-wish'><img src='images/sadimg.svg'/>Your wishlist is empty.</p>";
          return;
        }

        dynamicWishlist.forEach(wishlistItem => {
          const product = products.find(p => String(p.id) === String(wishlistItem.id));
          if (!product) return;

          const col = document.createElement("div");
          col.className = "col-md-6 col-lg-4";
          col.innerHTML = `
            <div class="static-menu">
              <ul>
                <li>
                  <a href="#"><img src="${product.image}" srcset="${product.srcset || ''}" alt="img"></a>
                </li>
                <li>
                  <div class="like-icon active"><a href="#"><i class="bi bi-heart-fill text-danger"></i></a></div>
                  <h4><a href="#">${product.title}</a></h4>
                  <div class="star-rating">
                    <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                  </div>
                  <p>${product.price}</p>
                  <a href="order.html?id=${product.id}" class="theme-btn">Order now</a>
                  <a href="#" class="del-icon" data-id="${product.id}" data-type="dynamic">
                    <i class="bi bi-trash"></i>
                  </a>
                </li>
              </ul>
            </div>
          `;
          wishlistContainer.appendChild(col);
        });
      })
      .catch(err => {
        wishlistContainer.innerHTML = "<p>Error loading wishlist.</p>";
        console.error(err);
      });
  }

  // ================= 3. Global Click Listeners =================
  document.body.addEventListener("click", function (e) {
    // Wishlist Add/Remove
    const heart = e.target.closest(".add-to-wishlist");
    if (heart) {
      e.preventDefault();
      const id = String(heart.dataset.id);
      const type = String(heart.dataset.type);
      const icon = heart.querySelector("i");
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      const exists = wishlist.some(item => item.id === id && item.type === type);
      if (!exists) {
        wishlist.push({ id, type });
        icon?.classList?.remove("bi-heart");
        icon?.classList?.add("bi-heart-fill", "text-danger");
        alert("Added to wishlist!");
      } else {
        wishlist = wishlist.filter(item => !(item.id === id && item.type === type));
        icon?.classList?.remove("bi-heart-fill", "text-danger");
        icon?.classList?.add("bi-heart");
        alert("Removed from wishlist.");
      }
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      updateWishlistCount(); //update count after add/remove
    }

    // Wishlist Delete from Page
    const delBtn = e.target.closest(".del-icon");
    if (delBtn) {
      e.preventDefault();
      const id = delBtn.dataset.id;
      const type = delBtn.dataset.type;
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      wishlist = wishlist.filter(item => !(item.id === id && item.type === type));
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      updateWishlistCount(); // update after delete

      const itemToRemove = delBtn.closest(".col-md-6.col-lg-4");
      itemToRemove?.remove();

      const remaining = document.querySelectorAll("#wishlist-container .col-md-6.col-lg-4");
      if (remaining.length === 0) {
        wishlistContainer.innerHTML = "<p class='empty-wish'><img src='images/sadimg.svg'/>Your wishlist is empty.</p>";
      }
    }

    // Add to Cart
    const cartBtn = e.target.closest(".add-to-cart");
    if (cartBtn) {
      e.preventDefault();
      const idStr = String(cartBtn.dataset.id);
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (!cart.includes(idStr)) {
        cart.push(idStr);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartBadge();
        alert("Added to cart!");
      } else {
        alert("Already in cart!");
      }
    }
  });

  // ================= 4. Product List Rendering & Category Filter =================
  const categoryList = document.getElementById("category-list");
  let allProducts = [];

  fetch("products.json")
    .then(res => res.json())
    .then(products => {
      allProducts = products;
      renderProducts(allProducts);
    });

  function renderProducts(products) {
    const productList = document.getElementById("product-list");
    if (!productList) return;

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    productList.innerHTML = products.map(product => {
      const isWishlisted = wishlist.some(item => item.id === product.id && item.type === product.type);
      return `
        <div class="col-md-4 col-sm-6 mb-4">
          <div class="food-item">
            <div class="food-pic">
              <div class="like-icon">
                <a href="#" class="add-to-wishlist" data-id="${product.id}" data-type="${product.type}">
                  <i class="bi ${isWishlisted ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i>
                </a>
              </div>
              <a href="product-details.html?id=${product.id}&type=${product.type}">
                <img src="${product.image}" srcset="${product.srcset || ''}" alt="${product.title}">
              </a>
            </div>
            <div class="food-content">
              <h3><a href="product-details.html?id=${product.id}&type=${product.type}">${product.title}</a></h3>
              <div class="star-rating">
                <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
              </div>
              <p>${product.description}</p>
              <h6>${product.price}
                <a href="#" class="add-to-cart" data-id="${product.id}">
                  <img src="images/busket.svg">
                </a>
              </h6>
              <a href="checkout.html" class="theme-btn order-hover order-now-btn" data-id="${product.id}" data-type="${product.type}">Order now</a>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".order-now-btn");
    if (!btn) return;
  
    e.preventDefault();
  
    const productId = btn.dataset.id;
    const productType = btn.dataset.type;
  
    // Clear multi-product (cart) checkout data
    localStorage.removeItem("checkoutProducts");
  
    fetch("products.json")
      .then(res => res.json())
      .then(products => {
        const selectedProduct = products.find(
          p => String(p.id) === String(productId) && p.type === productType
        );
  
        if (selectedProduct) {
          // Save single product to checkout
          localStorage.setItem("checkoutProduct", JSON.stringify(selectedProduct));
          window.location.href = "checkout.html";
        } else {
          console.error("Product not found:", productId, productType);
          alert("Something went wrong. Try again.");
        }
      })
      .catch(err => {
        console.error("Failed to load products:", err);
        alert("Something went wrong. Try again.");
      });
  });

  categoryList?.addEventListener("click", function (e) {
    const link = e.target.closest("a");
    if (!link) return;

    e.preventDefault();
    const category = link.dataset.category;

    document.querySelectorAll(".cata-list a").forEach(a => a.classList.remove("active"));
    link.classList.add("active");

    if (category === "All Products") {
      renderProducts(allProducts);
    } else {
      const filtered = allProducts.filter(p => Array.isArray(p.category) && p.category.includes(category));
      renderProducts(filtered);
    }
  });
});