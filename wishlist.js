// A central catalog of all products with their details - matching original structure
const productData = {
  "Open Knit: Slate Polos": {
    price: "₹ 1499",
    image: "assets/t1-f.avif"
  },
  "Demon Slayer: Rengoku": {
    price: "₹ 1050",
    image: "assets/t2-f.avif"
  },
  "Cotton Linen: Russet Brown": {
    price: "₹ 1499",
    image: "assets/t3-f.avif"
  },
  "Hello Kitty: Varsity Tee": {
    price: "₹ 999",
    image: "assets/t5-f.avif"
  },
  "Solids: Charcoal Jeans": {
    price: "₹ 1899",
    image: "assets/wj1-f.avif"
  },
  "Attack On Titan: Eren Tee": {
    price: "₹ 999",
    image: "assets/wt2-f.avif"
  },
  "Harry Potter: The Silent Vow Tee": {
    price: "₹ 1549",
    image: "assets/mt-4f.avif"
  },
  "Pop eye: Brown T-shirt": {
    price: "₹ 1499",
    image: "assets/mt-5f.avif"
  },
  "Shamshara : Blue T-shirt": {
    price: "₹ 999",
    image: "assets/mt-6f.avif"
  },
  "Cotton Linen Stripes: Nautical Cotton Linen Shirts": {
    price: "₹ 1499",
    image: "assets/ms-1f.avif"
  },
  "Cotton Linen Stripes: Meadow Cotton Linen Shirts": {
    price: "₹ 1599",
    image: "assets/ms-2f.avif"
  },
  "Cotton Linen: Lobster Bisque Cotton Linen Shirts": {
    price: "₹ 1449",
    image: "assets/ms-3f.avif"
  },
  "Peter England Men's Micro-Checkered Formal Slim Fit Full Sleeve Shirt": {
    price: "₹ 799",
    image: "assets/mfs-1f.jpg"
  },
  "Peter England Men's Classic Checkered Formal Slim Fit Full Sleeve Shirt": {
    price: "₹ 799",
    image: "assets/mfs-2f.jpg"
  },
  "Peter England Men's Classic Textured Slim Fit Full Sleeve Shirt": {
    price: "₹ 687",
    image: "assets/mfs-3a.jpg"
  }
};

let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to save wishlist to local storage
function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Function to save cart to local storage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to render the wishlist items on the wishlist page
function renderWishlist() {
    const wishlistContainer = document.querySelector('.wishlist-items');
    if (!wishlistContainer) return;

    wishlistContainer.innerHTML = '';
    if (wishlist.length === 0) {
        const emptyMessage = document.getElementById('empty-wishlist');
        if (emptyMessage) {
            emptyMessage.style.display = 'block';
            wishlistContainer.style.display = 'none';
        }
        return;
    }

    const emptyMessage = document.getElementById('empty-wishlist');
    if (emptyMessage) {
        emptyMessage.style.display = 'none';
        wishlistContainer.style.display = 'grid';
    }

    wishlist.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('wishlist-card');
        itemElement.innerHTML = `
            <div class="card-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none';">
                <button class="remove-btn" onclick="removeFromWishlist('${item.id}')" title="Remove from wishlist">×</button>
            </div>
            <div class="card-content">
                <h3 class="card-title">${item.name}</h3>
                <div class="card-price">₹${item.price.toLocaleString()}</div>
                <div class="card-actions">
                    <button class="add-to-cart-btn" onclick="addToCart('${item.name}', ${item.price}, '${item.image}')">Add to Cart</button>
                </div>
            </div>
        `;
        wishlistContainer.appendChild(itemElement);
    });
}

// Function to add a product to the wishlist (stores product names as strings)
function addToWishlist(productName) {
    const product = productData[productName];
    if (!product) {
        console.error(`Product "${productName}" not found in data catalog.`);
        showPopup("Product not found.", "error");
        return;
    }
    
    const exists = wishlist.includes(productName);
    if (!exists) {
        wishlist.push(productName);
        saveWishlist();
        showPopup(`${productName} added to wishlist! ❤️`, "success");
        updateCounts();
    } else {
        showPopup(`${productName} is already in your wishlist!`, "error");
    }
}

// Function to remove a product from the wishlist (removes by product name)
function removeFromWishlist(productName) {
    const index = wishlist.indexOf(productName);
    if (index > -1) {
        wishlist.splice(index, 1);
        saveWishlist();
        showPopup("Item removed from wishlist.", "error");
        renderWishlist();
        updateCounts();
    }
}

// Function to add a product to the cart
function addToCart(productName, price, image) {
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity += 1;
        showPopup(`Increased quantity of ${productName} in cart!`, "cart");
    } else {
        cart.push({
            name: productName,
            quantity: 1,
            price: parseInt(price),
            image: image
        });
        showPopup(`${productName} added to cart!`, "cart");
    }
    saveCart();
    updateCounts();
}

// Function to show a popup notification
function showPopup(message, type) {
    const popup = document.getElementById("popup");
    if (popup) {
        popup.textContent = message;
        popup.className = `popup ${type}`;
        popup.style.display = "block";
        setTimeout(() => {
            popup.style.display = "none";
        }, 3000);
    }
}

// Function to update the cart and wishlist counts in the navbar
function updateCounts() {
    const wishlistCount = document.getElementById("wishlist-count");
    const cartCount = document.getElementById("cart-count");
    
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
    
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    // Update stats on wishlist page
    const totalItemsElement = document.getElementById("total-items");
    const totalValueElement = document.getElementById("total-value");
    
    if (totalItemsElement) {
        totalItemsElement.textContent = wishlist.length;
    }
    
    if (totalValueElement) {
        let totalValue = 0;
        wishlist.forEach(itemName => {
            if (productData[itemName]) {
                const price = parseInt(productData[itemName].price.replace(/[₹,\s]/g, ''));
                totalValue += price;
            }
        });
        totalValueElement.textContent = `₹${totalValue.toLocaleString()}`;
    }
    
    // Show/hide clear all button
    const clearAllBtn = document.getElementById("clear-all");
    if (clearAllBtn) {
        clearAllBtn.style.display = wishlist.length > 0 ? "inline-block" : "none";
    }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    // Add event listeners for the wishlist buttons on the main pages
    document.querySelectorAll(".wishlist-btn").forEach(button => {
        button.addEventListener("click", () => {
            const productName = button.getAttribute("data-name");
            const productId = button.getAttribute("data-id");
            addToWishlist(productId || productName);
        });
    });

    // Add event listeners for the add to cart buttons on the main pages
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", (e) => {
            const itemName = button.getAttribute("data-name");
            const price = button.getAttribute("data-price");
            const image = button.getAttribute("data-image");
            addToCart(itemName, price, image);
        });
    });

    // Clear all wishlist items
    const clearAllBtn = document.getElementById("clear-all");
    if (clearAllBtn) {
        clearAllBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to clear all items from your wishlist?")) {
                wishlist = [];
                saveWishlist();
                showPopup("Wishlist cleared!", "error");
                renderWishlist();
                updateCounts();
            }
        });
    }

    // Initial call to update counts and render wishlist on page load
    updateCounts();
    renderWishlist();
});

// Expose functions globally for HTML event handlers
window.addToWishlist = addToWishlist;
window.addToCart = addToCart;
window.removeFromWishlist = removeFromWishlist;
window.showPopup = showPopup;