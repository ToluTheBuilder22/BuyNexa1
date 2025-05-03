// Cart show/hide
let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');

cartIcon.addEventListener('click', () => {
  cart.classList.add('active');
});

closeCart.addEventListener('click', () => {
  cart.classList.remove('active');
});

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  const addCartButtons = document.querySelectorAll('.add-cart');
  addCartButtons.forEach(btn => {
    btn.addEventListener('click', addToCartClicked);
  });

  document.querySelector('.cart-content').addEventListener('click', e => {
    if (e.target.classList.contains('cart-remove')) {
      e.target.closest('.cart-box').remove();
      updateTotal();
    }
  });

  document.querySelector('.cart-content').addEventListener('input', e => {
    if (e.target.classList.contains('cart-quantity')) {
      if (isNaN(e.target.value) || e.target.value <= 0) {
        e.target.value = 1;
      }
      updateTotal();
    }
  });

  document.querySelector('.btn-buy').addEventListener('click', () => {
    document.querySelector('.modal').classList.remove('hidden');
    populateOrderSummary();
  });

  document.querySelector('.close-modal').addEventListener('click', () => {
    document.querySelector('.modal').classList.add('hidden');
  });
});

// Add product to cart
function addToCartClicked(e) {
  const product = e.target.closest('.product-box');
  const title = product.querySelector('.product-title').innerText;
  const price = product.querySelector('.price').innerText;
  const imgSrc = product.querySelector('.product-img').src;

  if (isInCart(title)) {
    alert("Item already in cart");
    return;
  }

  addProductToCart(title, price, imgSrc);
  updateTotal();
}

function isInCart(title) {
  const items = document.querySelectorAll('.cart-product-title');
  return Array.from(items).some(item => item.innerText === title);
}

function addProductToCart(title, price, imgSrc) {
  const cartContent = document.querySelector('.cart-content');

  const cartBox = document.createElement('div');
  cartBox.classList.add('cart-box');
  cartBox.innerHTML = `
    <img src="${imgSrc}" alt="${title}" class="cart-img">
    <div class="detail-box">
      <div class="cart-product-title">${title}</div>
      <div class="cart-price">${price}</div>
      <input type="number" value="1" class="cart-quantity">
    </div>
    <i class='bx bxs-trash-alt cart-remove'></i>
  `;

  cartContent.appendChild(cartBox);
}

// Update total
function updateTotal() {
  const cartBoxes = document.querySelectorAll('.cart-box');
  let total = 0;

  cartBoxes.forEach(box => {
    const priceText = box.querySelector('.cart-price').innerText.replace(/[₦,]/g, '');
    const price = parseFloat(priceText);
    const quantity = parseInt(box.querySelector('.cart-quantity').value);
    total += price * quantity;
  });

  document.querySelector('.total').innerText = 'Total: ₦${total.toLocaleString()}';
}

// Fill checkout modal with cart items
function populateOrderSummary() {
  const summary = document.getElementById('order-summary');
  summary.innerHTML = '';

  const cartBoxes = document.querySelectorAll('.cart-box');
  if (cartBoxes.length === 0) {
    summary.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  cartBoxes.forEach(box => {
    const title = box.querySelector('.cart-product-title').innerText;
    const price = box.querySelector('.cart-price').innerText;
    const quantity = box.querySelector('.cart-quantity').value;

    const item = document.createElement('p');
    item.innerText = '₦${title} - ₦${price}  ₦${quantity}';
    summary.appendChild(item);
  });
}