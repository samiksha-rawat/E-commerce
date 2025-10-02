document.addEventListener("DOMContentLoaded", () => {
  // Coupons
  const coupons = {
    "WELCOME10": { discount: 0.1, minAmount: 1000, description: "10% off on orders above ₹1000" },
    "SAVE20": { discount: 0.2, minAmount: 2000, description: "20% off on orders above ₹2000" },
    "FIRST50": { discount: 50, minAmount: 500, description: "₹50 off on orders above ₹500" }
  };

  // DOM elements
  const cartContainer = document.getElementById("cart-container");
  const cartItemsList = document.getElementById("cart-items-list");
  const cartCount = document.getElementById("cart-count");
  const wishlistCount = document.getElementById("wishlist-count");
  const totalItemsElement = document.getElementById("total-items");
  const subtotalElement = document.getElementById("subtotal");
  const shippingElement = document.getElementById("shipping");
  const taxElement = document.getElementById("tax");
  const discountElement = document.getElementById("discount");
  const discountRow = document.getElementById("discount-row");
  const totalElement = document.getElementById("total");
  const clearCartBtn = document.getElementById("clear-cart");
  const checkoutBtn = document.getElementById("checkout-btn");
  const emptyCartMessage = document.getElementById("empty-cart");
  const popup = document.getElementById("popup");
  const couponInput = document.getElementById("coupon-code");
  const applyCouponBtn = document.getElementById("apply-coupon");
  const couponMessage = document.getElementById("coupon-message");

  // State
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  let appliedCoupon = null;

  // 🔥 Shared function: update cart count badge
  function updateCartCount() {
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    if (totalItemsElement) totalItemsElement.textContent = totalItems;
  }

  // 🔥 Shared function: update wishlist count badge
  function updateWishlistCount() {
    if (wishlistCount) wishlistCount.textContent = wishlist.length;
  }

  // Popup
  function showPopup(message, type = "success") {
    if (!popup) return;
    popup.textContent = message;
    popup.className = `popup ${type}`;
    popup.style.display = "block";
    setTimeout(() => popup.style.display = "none", 3000);
  }

  // Save cart
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  // Save wishlist
  function saveWishlist() {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistCount();
  }

  // Calculate totals
  function calculateTotals() {
    let subtotal = cart.reduce((sum, item) => {
      const product = productData[item.id];
      return sum + (product.price * item.quantity);
    }, 0);

    let shipping = subtotal > 2000 ? 0 : 99;
    let discount = 0;

    if (appliedCoupon) {
      const coupon = coupons[appliedCoupon];
      if (subtotal >= coupon.minAmount) {
        discount = coupon.discount < 1 ? subtotal * coupon.discount : coupon.discount;
      }
    }

    let tax = (subtotal - discount) * 0.18;
    let total = subtotal + shipping + tax - discount;

    subtotalElement.textContent = `₹${subtotal.toLocaleString()}`;
    shippingElement.textContent = shipping === 0 ? "FREE" : `₹${shipping}`;
    shippingElement.style.color = shipping === 0 ? "#2ed573" : "#333";
    taxElement.textContent = `₹${Math.round(tax).toLocaleString()}`;
    totalElement.textContent = `₹${Math.round(total).toLocaleString()}`;

    if (discount > 0) {
      discountElement.textContent = `-₹${Math.round(discount).toLocaleString()}`;
      discountRow.style.display = "flex";
    } else {
      discountRow.style.display = "none";
    }
  }

  // Render cart
  function renderCart() {
    cartItemsList.innerHTML = "";
    if (cart.length === 0) {
      cartContainer.style.display = "none";
      emptyCartMessage.style.display = "block";
      return;
    }
    cartContainer.style.display = "grid";
    emptyCartMessage.style.display = "none";

    cart.forEach(item => {
      const product = productData[item.id];
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <div class="item-image"><img src="${product.image}" alt="${product.name}" /></div>
        <div class="item-details">
          <div class="item-name">${product.name}</div>
          <div class="item-size">Size: ${item.size || "-"}</div>
          <div class="item-price">₹${product.price}</div>
        </div>
        <div class="quantity-controls">
          <button class="quantity-btn" ${item.quantity <= 1 ? "disabled" : ""}>−</button>
          <div class="quantity-display">${item.quantity}</div>
          <button class="quantity-btn" ${item.quantity >= 10 ? "disabled" : ""}>+</button>
        </div>
        <button class="remove-item-btn">×</button>
      `;

      const [minusBtn, plusBtn] = cartItem.querySelectorAll(".quantity-btn");
      const removeBtn = cartItem.querySelector(".remove-item-btn");

      minusBtn.addEventListener("click", () => updateQuantity(item.id, item.quantity - 1));
      plusBtn.addEventListener("click", () => updateQuantity(item.id, item.quantity + 1));
      removeBtn.addEventListener("click", () => removeFromCart(item.id));

      cartItemsList.appendChild(cartItem);
    });
  }

  // Update quantity
  function updateQuantity(id, qty) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    if (qty <= 0) return removeFromCart(id);
    if (qty > 10) return showPopup("Maximum 10 items allowed", "error");

    item.quantity = qty;
    saveCart();
    renderCart();
    calculateTotals();
    showPopup(`Quantity updated for ${productData[id].name}`, "info");
  }

  // Remove item
  function removeFromCart(id) {
    const product = productData[id];
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
    calculateTotals();
    showPopup(`${product.name} removed from cart`, "error");
  }

  // Clear cart
  clearCartBtn.addEventListener("click", () => {
    cart = [];
    saveCart();
    renderCart();
    calculateTotals();
    showPopup("Cart cleared", "error");
  });

  // Apply coupon
  applyCouponBtn.addEventListener("click", () => {
    const code = couponInput.value.trim().toUpperCase();
    if (!coupons[code]) {
      couponMessage.textContent = "Invalid coupon";
      couponMessage.style.color = "#ff4757";
      return;
    }
    appliedCoupon = code;
    couponMessage.textContent = `✓ ${coupons[code].description}`;
    couponMessage.style.color = "#2ed573";
    calculateTotals();
    showPopup("Coupon applied", "success");
  });

  // Checkout
  checkoutBtn.addEventListener("click", () => {
    showPopup("Proceeding to checkout...", "info");
    // redirect to checkout.html if you have it
    // window.location.href = "checkout.html";
  });

  // 🔥 Function to add product (called from product pages)
  window.addToCart = function(id) {
    let existing = cart.find(item => item.id === id);

    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ id, quantity: 1 });
    }

    saveCart();
    renderCart();
    calculateTotals();
    showPopup(`${productData[id].name} added to cart 🛒`, "success");
  };

  // 🔥 Function to add to wishlist
  window.addToWishlist = function(id) {
    let exists = wishlist.find(item => item.id === id);
    if (exists) {
      showPopup(`${productData[id].name} already in wishlist ❤️`, "info");
      return;
    }
    wishlist.push({ id });
    saveWishlist();
    showPopup(`${productData[id].name} added to wishlist ❤️`, "success");
  };

  // Init
  renderCart();
  updateCartCount();
  updateWishlistCount();
  calculateTotals();
});
