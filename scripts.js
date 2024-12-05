document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.filter-checkbox');
    const products = document.querySelectorAll('.product');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const orderButton = document.getElementById('orderButton');
    const deliveryForm = document.getElementById('deliveryForm');
    const addressInput = document.getElementById('address');
    const phoneInput = document.getElementById('phone');
    const searchInput = document.getElementById('searchInput');

    function filterProducts() {
        const selectedFilters = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';

        products.forEach(product => {
            const productClasses = Array.from(product.classList);
            const productName = product.querySelector('p').textContent.toLowerCase();
            const shouldDisplay = selectedFilters.length === 0 || productClasses.some(className => selectedFilters.includes(className));
            const matchesSearch = productName.includes(searchQuery);
            product.style.display = shouldDisplay && matchesSearch ? 'block' : 'none';
        });
    }

    if (checkboxes) {
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', filterProducts);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }

    // Initial filtering based on default checked state
    filterProducts();

    // Add click event listener to products for navigation
    products.forEach(product => {
        product.addEventListener('click', function() {
            const link = product.getAttribute('data-link');
            if (link) {
                window.location.href = link;
            }
        });
    });

    // Function to add item to cart
    function addToCart(event) {
        const button = event.target;
        const name = button.getAttribute('data-name');
        const price = button.getAttribute('data-price');
        const image = button.getAttribute('data-image');

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, image, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Товар добавлен в корзину!');
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Function to load cart items on the cart page
    function loadCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const totalPriceElement = document.getElementById('total-price');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let totalPrice = 0;

        cartItemsContainer.innerHTML = '';

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="details">
                    <p>${item.name}</p>
                    <p>${item.price} руб. x ${item.quantity}</p>
                </div>
                <button class="remove-from-cart" data-index="${index}">Удалить</button>
            `;
            cartItemsContainer.appendChild(cartItem);
            totalPrice += parseFloat(item.price) * item.quantity;
        });

        totalPriceElement.textContent = `${totalPrice} руб.`;

        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-from-cart');
        removeButtons.forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    }

    // Function to remove item from cart
    function removeFromCart(event) {
        const button = event.target;
        const index = button.getAttribute('data-index');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems(); // Reload cart items to update the display
    }

    // Load cart items if on the cart page
    if (window.location.pathname.includes('cart.html')) {
        loadCartItems();
    }

    // Function to validate phone number
    function validatePhoneNumber(phone) {
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        return phoneRegex.test(phone);
    }

    // Function to handle form submission
    function handleFormSubmit(event) {
        event.preventDefault();

        const address = addressInput.value.trim();
        const phone = phoneInput.value.trim();

        if (!address || !phone) {
            $('#orderModalBody').text('Пожалуйста, заполните все обязательные поля.');
            $('#orderModal').modal('show');
            return;
        }

        if (!validatePhoneNumber(phone)) {
            $('#orderModalBody').text('Некорректный номер телефона.');
            $('#orderModal').modal('show');
            return;
        }

        const formData = {
            address: address,
            phone: phone
        };

        console.log('Данные формы:', formData);

        // Here you can add code to send formData to the server

        $('#orderModalBody').text('Данные формы успешно обработаны и отправлены.');
        $('#orderModal').modal('show');
    }

    // Add event listener to the order button
    if (orderButton) {
        orderButton.addEventListener('click', handleFormSubmit);
    }
});
