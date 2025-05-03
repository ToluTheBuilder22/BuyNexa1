let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');
let cartContent = document.querySelector('.cart-content');

cartIcon.onclick = () => {
    cart.classList.add("active");
};

closeCart.onclick = () => {
    cart.classList.remove("active");
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    let addCartButtons = document.getElementsByClassName('add-cart');
    for (let button of addCartButtons) {
        button.addEventListener('click', addCartClicked);
    }

    loadCartFromLocalStorage();
    updateRemoveAndQuantityHandlers();
    updateTotal();
}

function updateRemoveAndQuantityHandlers() {
    let removeCartButtons = document.getElementsByClassName('cart-remove');
    for (let button of removeCartButtons) {
        button.removeEventListener("click", removeCartItem); // Remove previous
        button.addEventListener("click", removeCartItem);
    }

    let quantityInputs = document.getElementsByClassName('cart-quantity');
    for (let input of quantityInputs) {
        input.removeEventListener("change", quantityChanged); // Remove previous
        input.addEventListener("change", quantityChanged);
    }
}

function removeCartItem(event) {
    let buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
    saveCartToLocalStorage();
}

function quantityChanged(event) {
    let input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
    saveCartToLocalStorage();
}

function addCartClicked(event) {
    let button = event.target;
    let title = button.getAttribute('data-title').trim().toLowerCase();
    let price = button.getAttribute('data-price');
    let imgSrc = button.getAttribute('data-img-src');

    let cartItems = document.getElementsByClassName('cart-product-title');
    for (let item of cartItems) {
        if (item.innerText.trim().toLowerCase() === title) {
            alert("You have already added this item to the cart.");
            return;
        }
    }

    addProductToCart(button.getAttribute('data-title'), price, imgSrc, 1);
    updateRemoveAndQuantityHandlers();
    updateTotal();
    saveCartToLocalStorage();
}

function addProductToCart(title, price, imgSrc, quantity = 1) {
    let cartBox = document.createElement('div');
    cartBox.classList.add('cart-box');

    let cartBoxContent = `
        <img src="${imgSrc}" alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="${quantity}" class="cart-quantity">
        </div>
        <i class='bx bxs-trash-alt cart-remove'></i>
    `;
    cartBox.innerHTML = cartBoxContent;
    cartContent.append(cartBox);
}

function updateTotal() {
    let cartBoxes = cartContent.getElementsByClassName('cart-box');
    let total = 0;

    for (let cartBox of cartBoxes) {
        let priceElement = cartBox.getElementsByClassName('cart-price')[0];
        let quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        let price = parseFloat(priceElement.innerText.replace("₦", ""));
        let quantity = quantityElement.value;
        total += price * quantity;
    }

    document.getElementsByClassName("total-price")[0].innerText = "₦" + total.toFixed(2);
}

function saveCartToLocalStorage() {
    let cartBoxes = cartContent.getElementsByClassName('cart-box');
    let cartItems = [];

    for (let cartBox of cartBoxes) {
        let title = cartBox.getElementsByClassName('cart-product-title')[0].innerText;
        let price = cartBox.getElementsByClassName('cart-price')[0].innerText;
        let quantity = cartBox.getElementsByClassName('cart-quantity')[0].value;
        let imgSrc = cartBox.getElementsByClassName('cart-img')[0].src;

        cartItems.push({ title, price, quantity, imgSrc });
    }

    localStorage.setItem('cart', JSON.stringify(cartItems));
}

function loadCartFromLocalStorage() {
    let cartItems = JSON.parse(localStorage.getItem('cart'));

    if (cartItems && Array.isArray(cartItems)) {
        for (let item of cartItems) {
            // Prevent duplicates when reloading
            let existingTitles = Array.from(document.getElementsByClassName('cart-product-title')).map(el => el.innerText.trim().toLowerCase());
            if (!existingTitles.includes(item.title.trim().toLowerCase())) {
                addProductToCart(item.title, item.price, item.imgSrc, item.quantity);
            }
        }
        updateRemoveAndQuantityHandlers();
        updateTotal();
    }
}

// Mobile menu toggle
const openIcon = document.getElementById("openIcon");
const closeIcon = document.getElementById("closeIcon");
const navMenu = document.getElementById("navMenu");

openIcon.addEventListener("click", () => {
    navMenu.classList.add("open");
    openIcon.style.display = "none";
    closeIcon.style.display = "inline";
});

closeIcon.addEventListener("click", () => {
    navMenu.classList.remove("open");
    closeIcon.style.display = "none";
    openIcon.style.display = "inline";
});