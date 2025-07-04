     
     // 🔐 Clear localStorage on first visit (new machine)
if (!localStorage.getItem("firstVisit")) {
  localStorage.clear();
  localStorage.setItem("firstVisit", "true");
}
     
     
     
     
     //product list//
    
      //testimonial list//  
      
      $('.testimonial-slider .owl-carousel').owlCarousel({
        loop: true,
        margin: 0,
         nav: true,
          navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>'
      ],
        responsiveClass: true,
        responsive: {
          0: {
            items: 1,
            nav: true,
            autoplay:true
          },
          600: {
            items: 2,
            nav: false,
            autoplay:true
          },
          1000: {
            items: 4,
            nav: true,
            loop: false,
          }
        }
      })
      
      
      
      
      
      
      
      //banner slider//
      $(document).ready(function(){
      $(".banner-sec .owl-carousel").owlCarousel({
      items: 1,
      loop: true,
      margin: 10,
      nav: true,
      dots: true,
      smartSpeed: 800, // Smooth slide transition speed
      autoplay: true,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      animateOut: false, // Let Owl’s built-in slide transitions handle it
      animateIn: false
      });
      });
      //mobile menu//
      
      // Get references
      const menu = document.getElementById('singleMenu');
      const desktopMenuContainer = document.getElementById('mainNavbar');
      const offcanvasMenuContainer = document.getElementById('offcanvasMenuContainer');
      
      function moveMenu() {
      if (window.innerWidth >= 992) {
      // Desktop: append menu to desktop container
      if (menu.parentElement !== desktopMenuContainer) {
      desktopMenuContainer.appendChild(menu);
      }
      } else {
      // Mobile: append menu to offcanvas container
      if (menu.parentElement !== offcanvasMenuContainer) {
      offcanvasMenuContainer.appendChild(menu);
      }
      }
      }
      
      // On page load and window resize, move the menu accordingly
      window.addEventListener('DOMContentLoaded', moveMenu);
      window.addEventListener('resize', moveMenu);
      
      
      // search
      document.addEventListener("DOMContentLoaded", function () {
      const searchToggle = document.querySelector(".search-toggle");
      const searchBarContainer = document.querySelector(".search-bar-container");
      
      searchToggle.addEventListener("click", function (e) {
      e.preventDefault();
      searchBarContainer.classList.toggle("d-none");
      });
      }); 


      //range slider//
       // $(function() {
        //  $("#slider-range").slider({
         //   range: true,
          //  min: 10,
          //  max: 100,
         //   values: [10, 20],
           // slide: function(event, ui) {
          //    $("#amount").html(
         //       '<span class="min">$' + ui.values[0] + '</span>  ' +
             //   '<span class="max">$' + ui.values[1] + '</span>'
           //   );
         //   }
         // });
      
        // Initial display
         // $("#amount").html(
           // '<span class="min">$' + $("#slider-range").slider("values", 0) + '</span>  ' +
           // '<span class="max">$' + $("#slider-range").slider("values", 1) + '</span>'
         // );
        //});


      //product details//
      $(document).ready(function() {
        var mainCarousel = $('#main-carousel');
        var thumbnailCarousel = $('#thumbnail-carousel');
        var duration = 300;
      
        // Initialize main carousel
        mainCarousel.owlCarousel({
          items: 1,
          loop: true,
          nav: true,
           navText: [
               '<i class="bi bi-chevron-left"></i>',
               '<i class="bi bi-chevron-right"></i>'
               ],
          dots: false,
          autoplay: false,
          responsiveRefreshRate: 200
        }).on('changed.owl.carousel', syncPosition);
      
        // Initialize thumbnail carousel
        thumbnailCarousel
          .on('initialized.owl.carousel', function() {
            thumbnailCarousel.find(".owl-item").eq(0).addClass("current");
          })
          .owlCarousel({
            items: 4,
            margin: 10,
            nav: false,
            dots: false,
            responsiveRefreshRate: 100
          }).on('changed.owl.carousel', syncPosition2);
      
        function syncPosition(el) {
          var count = el.item.count - 1;
          var current = Math.round(el.item.index - (el.item.count / 2) - 0.5);
      
          if (current < 0) {
            current = count;
          }
          if (current > count) {
            current = 0;
          }
      
          thumbnailCarousel
            .find(".owl-item")
            .removeClass("current")
            .eq(current)
            .addClass("current");
          var onscreen = thumbnailCarousel.find('.owl-item.active').length - 1;
          var start = thumbnailCarousel.find('.owl-item.active').first().index();
          var end = thumbnailCarousel.find('.owl-item.active').last().index();
      
          if (current > end) {
            thumbnailCarousel.trigger('to.owl.carousel', [current - onscreen, duration, true]);
          }
          if (current < start) {
            thumbnailCarousel.trigger('to.owl.carousel', [current, duration, true]);
          }
        }
      
        function syncPosition2(el) {
          var number = el.item.index;
          mainCarousel.trigger('to.owl.carousel', [number, duration, true]);
        }
      
        thumbnailCarousel.on("click", ".owl-item", function(e) {
          e.preventDefault();
          var index = $(this).index();
          mainCarousel.trigger('to.owl.carousel', [index, duration, true]);
        });
      });
      
      
            //quantity details//
               
            document.addEventListener('DOMContentLoaded', function () {
              const decrementButton = document.getElementById('button-decrement');
              const incrementButton = document.getElementById('button-increment');
              const quantityInput = document.getElementById('quantity-input');
            
              // Only proceed if all elements are present
              if (decrementButton && incrementButton && quantityInput) {
                decrementButton.addEventListener('click', function () {
                  let currentValue = parseInt(quantityInput.value);
                  if (currentValue > parseInt(quantityInput.min)) {
                    quantityInput.value = currentValue - 1;
                  }
                });
            
                incrementButton.addEventListener('click', function () {
                  let currentValue = parseInt(quantityInput.value);
                  if (currentValue < parseInt(quantityInput.max)) {
                    quantityInput.value = currentValue + 1;
                  }
                });
              } else {
                console.warn("Quantity buttons or input not found in the DOM.");
              }
            });

            // wishlist count globally
            function updateWishlistCount() {
              const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
              const count = wishlist.length;
            
              const badge = document.querySelector(".wishlist-count-badge");
              if (badge) {
                badge.textContent = count;
                // badge.style.display = count > 0 ? "inline-block" : "none";
                badge.style.display = "inline-block";
              }
            }
            
        //cart count value globally

      document.addEventListener("DOMContentLoaded", function () {
      const cartCountElem = document.getElementById("cart-count");

      // Load cart from localStorage or initialize
         let cart = JSON.parse(localStorage.getItem("cart")) || [];

         // Update cart count badge
         function updateCartBadge() {
            cartCountElem.textContent = cart.length;
         }

         updateCartBadge();
      });
         
   



           //search details//

           let allProducts = [];

           fetch("products.json")
             .then(res => res.json())
             .then(data => {
               allProducts = data;
             });
         
           const input = document.getElementById("search-input");
           const list = document.getElementById("autocomplete-list");
         
           input.addEventListener("input", function () {
             const query = this.value.toLowerCase();
             list.innerHTML = "";
         
             if (!query) return;
         
             const matches = allProducts.filter(p => p.title.toLowerCase().includes(query)).slice(0, 5);
         
             matches.forEach(product => {
               const li = document.createElement("li");
               li.textContent = product.title;
               li.addEventListener("click", function () {
                 const url = `product-details.html?id=${product.id}&type=${product.type}`;
                 window.location.href = url;
               });
               list.appendChild(li);
             });
           });
         
           // Hide list when clicking outside
           document.addEventListener("click", function (e) {
             if (!e.target.closest("#search-input")) {
               list.innerHTML = "";
             }
           });




           //validation for contact
           document.addEventListener("DOMContentLoaded", function () {
            const form = document.getElementById("contactForm");
            const phoneInput = document.getElementById("phone");
            const messageBox = document.getElementById("formMessage");
          
            // Only allow digits in phone input
            if (phoneInput) {
              phoneInput.addEventListener("input", function () {
                this.value = this.value.replace(/\D/g, "");
              });
            }
          
            function showMessage(messages, type = 'error') {
              if (!messageBox) return;
              messageBox.style.display = 'block';
              messageBox.className = `message ${type === 'error' ? 'error-msg' : 'success-msg'}`;
          
              if (Array.isArray(messages)) {
                messageBox.innerHTML = `<ul>${messages.map(msg => `<li>${msg}</li>`).join("")}</ul>`;
              } else {
                messageBox.textContent = messages;
              }
            }
          
            // ✅ Only run form validation if form exists
            if (form) {
              form.addEventListener("submit", function (e) {
                e.preventDefault();
          
                const nameInput = document.getElementById("name");
                const emailInput = document.getElementById("email");
                const commentInput = document.getElementById("comment");
          
                const name = nameInput?.value.trim() || "";
                const phone = phoneInput?.value.trim() || "";
                const email = emailInput?.value.trim() || "";
                const comment = commentInput?.value.trim() || "";
          
                const phoneRegex = /^\d{10}$/;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          
                const errors = [];
          
                if (!name) {
                  errors.push("Please enter your name.");
                }
          
                if (!phoneRegex.test(phone)) {
                  errors.push("Phone number must be exactly 10 digits.");
                }
          
                if (!emailRegex.test(email)) {
                  errors.push("Please enter a valid email address.");
                }
          
                if (!comment) {
                  errors.push("Please enter your comment.");
                }
          
                if (errors.length > 0) {
                  showMessage(errors, 'error');
                  return;
                }
          
                // Success message
                showMessage("Form submitted successfully!", "success");
          
                // Optionally reset form
                setTimeout(() => {
                  form.reset();
                  if (messageBox) {
                    messageBox.style.display = 'none';
                  }
                }, 3000);
              });
            }
          });
          