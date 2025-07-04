
  // Define product data for static items (can be fetched via JSON if needed)
  // const staticProducts = [
  //   {
  //     id: "p10",
  //     title: "Grilled Chicken",
  //     image: "images/chicken.png",
  //     category: ["All Products", "Main Course"],
  //     price: 20,
  //     type:"static",
  //   },
  //   {
  //     id: "p11",
  //     title: "Mexican Chicken",
  //     image: "images/food1.png",
  //     category: ["All Products", "Main Course"],
  //     price: 40,
  //     type:"static",
  //   },
  //   {
  //     id: "p12",
  //     title: "Chicago Deep Pizza",
  //     image: "images/pizza-1.png",
  //     category: ["All Products", "Burgers and Pizzas"],
  //     price: 28,
  //     type:"static",
  //   },
  //   {
  //     id: "p13",
  //     title: "King Burger",
  //     image: "images/burger2.png",
  //     category: ["All Products", "Burgers and Pizzas"],
  //     price: 35,
  //     type:"static",
  //   },
  //   {
  //     id: "p14",
  //     title: "Chicken Ala Kiev",
  //     image: "images/ala-kiev.png",
  //     category: ["All Products","Starters"],
  //     price: 30,
  //     type:"static",
  //   },
  //   {
  //     id: "p15",
  //     title: "Brownie Shake",
  //     image: "images/brownie.png",
  //     category: ["All Products", "Drinks"],
  //     price: 20,
  //     type:"static",
  //   },
  //   {
  //     id: "p16",
  //     title: "Chicken Stroganoff",
  //     image: "images/stroganoff.png",
  //     category: ["All Products", "Main Course"],
  //     price: 45,
  //     type:"static",
  //   },
  //   {
  //     id: "p17",
  //     title: "Alfredo Pasta",
  //     image: "images/pasta.png",
  //     category: ["All Products", "Veg"],
  //     price: 28,
  //     type:"static",
  //   },
  //   {
  //     id: "p18",
  //     title: "Fish and Chips",
  //     image: "images/cutlet.png",
  //     category: ["All Products","Starters"],
  //     price: 28,
  //     type:"static",
  //   },
  // ];






async function renderStaticMenu() {
  const container = document.getElementById("static-menu");
  if (!container) {
      console.warn("Static menu container not found.");
      return; // Exit if the container element doesn't exist
  }

  // 1. Fetch ALL products from products.json (it now contains both dynamic and static)
  const allProducts = await fetch("products.json")
      .then(res => {
          if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
      })
      .catch(error => {
          console.error("Error fetching products.json for static menu:", error);
          // Display a message to the user if products fail to load
          container.innerHTML = "<p>Error loading menu items. Please try again later.</p>";
          return []; // Return an empty array to prevent further errors
      });

  // 2. Filter to get only the static products to render in this section
  const staticProductsToRender = allProducts.filter(p => p.type === "static");

  // 3. Get the current wishlist from localStorage (assuming wishlist-manager.js handles saving)
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // 4. Generate the HTML for static menu items
  const menuHtml = staticProductsToRender.map(p => {
      // Check if the current product is in the wishlist
      const isWishlisted = wishlist.some(item => String(item.id) === String(p.id) && item.type === "static");

      // Ensure price is a number for toFixed, if it comes as "$XX.XX" from JSON
      const numericPrice = parseFloat(String(p.price).replace('$', ''));

      return `
          <div class="col-md-6 col-lg-4">
              <div class="static-menu">
                  <ul>
                      <li>
                          <a href="product-details.html?id=${p.id}&type=static"><img src="${p.image}" alt="${p.title}"></a>
                      </li>
                      <li>
                          <div class="like-icon">
                              <a href="#" class="add-to-wishlist" data-id="${p.id}" title="Add to wishlist" data-type="static">
                                  <i class="bi ${isWishlisted ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i>
                              </a>
                          </div>
                          <h4><a href="product-details.html?id=${p.id}&type=static">${p.title}</a></h4>
                          <div class="star-rating">
                              ${'<i class="bi bi-star-fill"></i>'.repeat(p.rating || 4)}
                          </div>
                          <p>$${numericPrice.toFixed(2)}</p>
                          <a href="#" class="theme-btn order-btn" data-id="${p.id}" data-type="static">Order now</a>
                      </li>
                  </ul>
              </div>
          </div>
      `;
  }).join("");

  container.innerHTML = menuHtml || "<p>No static menu items found.</p>";

  // 5. Attach event listeners for "Order now" buttons
  container.querySelectorAll(".order-btn").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
  
      const productId = this.dataset.id;
      const productType = this.dataset.type;
  
      // ✅ Clear existing multi-product checkout data
      localStorage.removeItem("checkoutProducts");
  
      // 🔍 Find the product from the pre-fetched allProducts list
      const selectedProduct = allProducts.find(
        p => String(p.id) === String(productId) && p.type === productType
      );
  
      if (selectedProduct) {
        localStorage.setItem("checkoutProduct", JSON.stringify(selectedProduct));
        window.location.href = "checkout.html";
      } else {
        console.error("Order now: Product not found for ID:", productId, "Type:", productType);
        alert("Could not find product details for order. Please try again.");
      }
    });
  });
  
}

// 6. Call renderStaticMenu when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", renderStaticMenu);

// OPTIONAL: Listen for wishlistUpdated event to re-render static menu if hearts change
// This makes the heart icons on the static menu update instantly if an item is wishlisted/unwishlisted elsewhere.
document.addEventListener('wishlistUpdated', () => {
  console.log("Wishlist updated event detected in static-menu.js, re-rendering.");
  renderStaticMenu(); // Re-render the static menu to update heart icons
});
  
  
  
  