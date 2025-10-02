document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  // Mobile nav toggle
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  // Wishlist Logic
  const wishlistButtons = document.querySelectorAll(".wishlist-btn");
  const popup = document.getElementById("popup");
  const wishlistCount = document.getElementById("wishlist-count");

  // Load wishlist from local storage or initialize as an empty array
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Function to update the wishlist count displayed on the page
  function updateWishlistCount() {
    wishlistCount.textContent = wishlist.length;
  }

  // Function to update the button's appearance and text
  function updateButtonState(button) {
    const itemName = button.getAttribute("data-name");
    if (wishlist.includes(itemName)) {
      button.textContent = "❤️ Remove from Wishlist";
      button.classList.add("in-wishlist");
    } else {
      button.textContent = "❤️ Add to Wishlist";
      button.classList.remove("in-wishlist");
    }
  }

  // Function to show a temporary pop-up message
  function showPopup(message) {
    popup.textContent = message;
    popup.style.display = "block";
    setTimeout(() => {
      popup.style.display = "none";
    }, 2000);
  }

  // Handle button clicks for adding or removing from wishlist
  function handleWishlistClick(event) {
    const button = event.target;
    const itemName = button.getAttribute("data-name");

    // Check if the item is already in the wishlist
    const index = wishlist.indexOf(itemName);

    if (index > -1) {
      // If it exists, remove it
      wishlist.splice(index, 1);
      showPopup(`${itemName} removed from Wishlist!`);
    } else {
      // If it doesn't exist, add it
      wishlist.push(itemName);
      showPopup(`${itemName} added to Wishlist!`);
    }

    // Save the updated wishlist to local storage
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    // Update the UI
    updateWishlistCount();
    updateButtonState(button);
  }

  // Initialize the state of each wishlist button and add the event listener
  wishlistButtons.forEach(button => {
    updateButtonState(button);
    button.addEventListener("click", handleWishlistClick);
  });

  // Initial update of the wishlist count when the page loads
  updateWishlistCount();
});