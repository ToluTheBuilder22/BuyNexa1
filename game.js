document.addEventListener('DOMContentLoaded', () => {
  const cartIcon = document.getElementById('cart-icon');
  const cart = document.querySelector('.cart');
  const closeCart = document.getElementById('close-cart');
  const addCartButtons = document.querySelectorAll('.add-cart');
  const cartContent = document.querySelector('.cart-content');
  const totalPriceElement = document.querySelector('.total-price');

  // Load the cart from localStorage
  let addedProducts = JSON.parse(localStorage.getItem('cart')) || {};

  // Render the cart from localStorage
  function renderCart() {
    cartContent.innerHTML = '';
    for (const title in addedProducts) {
      const product = addedProducts[title];
      const cartBox = createCartBox(product.title, product.price, product.imgSrc, product.quantity);
      cartContent.appendChild(cartBox);
    }
    updateTotal();
  }

  // Open cart when cart icon is clicked
  cartIcon.onclick = () => {
    cart.classList.add('active');
  };

  // Close cart when close button is clicked
  closeCart.onclick = () => {
    cart.classList.remove('active');
  };

  // Add product to the cart
  addCartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const productBox = event.target.closest('.product-box');
      const title = productBox.querySelector('.product-title').innerText;
      const price = productBox.querySelector('.price').innerText;
      const imgSrc = productBox.querySelector('.product-img').src;

      if (addedProducts[title]) {
        alert('Already added to cart');
        return;
      }

      addProductToCart(title, price, imgSrc);
      updateTotal();
      saveCartToLocalStorage();
    });
  });

  // Add product to the cart and update the UI
  function addProductToCart(title, price, imgSrc) {
    const cartBox = createCartBox(title, price, imgSrc, 1);
    cartContent.appendChild(cartBox);
    addedProducts[title] = { title, price, imgSrc, quantity: 1 };
  }

  // Create a cart box element
  function createCartBox(title, price, imgSrc, quantity) {
    const cartBox = document.createElement('div');
    cartBox.classList.add('cart-box');
    cartBox.innerHTML = `
      <img src="${imgSrc}" alt="" class="cart-img">
      <div class="detail-box">
        <div class="cart-product-title">${title}</div>
        <div class="cart-price">${price}</div>
        <input type="number" value="${quantity}" class="cart-quantity" min="1">
      </div>
      <i class='bx bx-trash-alt cart-remove'></i>
    `;

    // Handle the remove button click
    cartBox.querySelector('.cart-remove').addEventListener('click', () => {
      cartBox.remove();
      delete addedProducts[title];
      updateTotal();
      saveCartToLocalStorage();
    });

    // Handle quantity change
    cartBox.querySelector('.cart-quantity').addEventListener('change', (e) => {
      const input = e.target;
      const newQuantity = input.value < 1 ? 1 : input.value;
      addedProducts[title].quantity = newQuantity;
      updateTotal();
      saveCartToLocalStorage();
    });

    return cartBox;
  }

  // Update the total price
  function updateTotal() {
    const cartBoxes = document.querySelectorAll('.cart-box');
    let total = 0;

    cartBoxes.forEach(cartBox => {
      const priceElement = cartBox.querySelector('.cart-price');
      const quantityElement = cartBox.querySelector('.cart-quantity');
      const price = parseFloat(priceElement.innerText.replace('₦', '').replace(/,/g, ''));
      const quantity = parseInt(quantityElement.value);
      total += price * quantity;
    });

    totalPriceElement.innerText = total === 0 ? '₦0' : '₦' + total.toLocaleString();
  }

  // Save cart to localStorage
  function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(addedProducts));
  }

  // Render the cart when the page is loaded
  renderCart();
});

