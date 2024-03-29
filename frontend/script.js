// start page 
function startPage() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = '<h1>Home Page</h1>';

    const userId = localStorage.getItem('user'); 

    if (userId) { // check if user is signed in
        const orderBtn = document.createElement('button');
        orderBtn.textContent = 'My order';
        orderBtn.onclick = () => navigateTo('order', userId); // 
        mainContent.appendChild(orderBtn);
        printLogoutBtn();
    }
}

// login page 
function loginPage() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = '<div class="login-container"><h2>Account</h2><div id="userForm"></div></div>';

    let userForm = document.getElementById('userForm');

    let inputEmail = document.createElement('input');
    inputEmail.placeholder = "Email";
    let inputPassword = document.createElement('input');
    inputPassword.placeholder = "Password";
    inputPassword.type = "password";
    let loginBtn = document.createElement('button');
    loginBtn.innerText = "Sign in";

    loginBtn.addEventListener('click', () => {
        let sendUser = {email: inputEmail.value, password: inputPassword.value};
    
        fetch("http://localhost:3000/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sendUser),
        })
        .then(res => res.json())
        .then(data => {
            console.log("post user", data);
    
            if (data.user) {
                localStorage.setItem("user", data.user);
                printLogoutBtn(); // Update UI
            } else {
                alert("Incorrect login");
            }            
        });
    });
    
    userForm.innerHTML = '';
    userForm.append(inputEmail, inputPassword, loginBtn);  
}

// print logout button
function printLogoutBtn() {
    const userForm = document.getElementById('userForm');

    // Clear existing content and create logout button
    userForm.innerHTML = "";
    const logoutBtn = document.createElement('button');
    logoutBtn.innerText = "Sign out";
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        startPage(); // Reload the start page after logout
    });
    userForm.appendChild(logoutBtn);
}

// products page
function productsPage() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = '<h2>Products</h2><div id="productContainer"></div>';

    printProducts();
}

function printProducts() {
    fetch('http://localhost:3000/api/products')
    .then(response => response.json())
    .then(products => {
        const productContainer = document.getElementById('productContainer');

        products.forEach((product, index) => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');

            const imagePath = 'images/mockup.jpg';

            productDiv.innerHTML = `
                <img src="${imagePath}" alt="${product.name}" width="200" height="220" loading="lazy">
                <h3>${product.name}</h3>
                <p>${product.price} SEK</p>
                <div class="button-container">
                    <button class="decrease" data-index="${index}" data-id="${product._id}">-</button>
                    <span class="quantity">${cartData[product._id] || 0}</span>
                    <button class="increase" data-index="${index}" data-id="${product._id}">+</button>
                </div>
            `;

            productContainer.appendChild(productDiv);
        });

        // event listeners for plus and minus buttons
        const increaseButtons = document.querySelectorAll('.increase');
        const decreaseButtons = document.querySelectorAll('.decrease');

        increaseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = button.dataset.index;
                const productId = button.dataset.id;
                increaseProductQuantity(index, productId);
            });
        });
        
        decreaseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = button.dataset.index;
                const productId = button.dataset.id;
                decreaseProductQuantity(index, productId);
            });
        });               
    })
    .catch(error => {
        console.error('Error fetching products', error);
    });
}

// increase product quantity
function increaseProductQuantity(index, productId) {
    console.log("Increasing quantity for product ID:", productId); // Add debug log
    const quantityElement = document.querySelectorAll('.quantity')[index];
    let quantity = parseInt(quantityElement.textContent);
    quantity++;
    quantityElement.textContent = quantity;
    updateCart(productId, quantity);
}

// decrease product quantity
function decreaseProductQuantity(index, productId) {
    console.log("Decreasing quantity for product ID:", productId); // Add debug log
    const quantityElement = document.querySelectorAll('.quantity')[index];
    let quantity = parseInt(quantityElement.textContent);
    if (quantity > 0) {
        quantity--;
        quantityElement.textContent = quantity;
        updateCart(productId, quantity);
    }
}

// cart data object and load cart data from localStorage
let cartData = JSON.parse(localStorage.getItem('cartData')) || {};

// update shopping cart data and save to localStorage
function updateCart(productId, quantity) {
    cartData[productId] = quantity;
    localStorage.setItem('cartData', JSON.stringify(cartData));
    displayCart();
}

// load cart data from localStorage
function loadCartData() {
    const storedCartData = localStorage.getItem('cartData');
    if (storedCartData) {
        cartData = JSON.parse(storedCartData);
        displayCart();
    }
}

// show shopping cart
async function displayCart() {
    console.log("Displaying cart..."); // Add debug log
    const cartContainer = document.getElementById('cartContainer');
    let cartHeading = '<h2>Shopping cart</h2>';

    let cartHTML = '';
    let cartIsEmpty = true;

    for (const productId in cartData) {
        const quantity = cartData[productId];
        if (quantity > 0) {
            try {
                const product = await fetchProduct(productId);
                console.log("Product fetched successfully:", product); // Add debug log
                cartHTML += `<h5>${product.name}</h5><p>Quantity: ${quantity}</p>`;
                cartIsEmpty = false;
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        }
    }

    if (cartIsEmpty) {
        cartHTML = "<p>Your cart is empty.</p>";
    }

    cartContainer.innerHTML = cartHeading + cartHTML;
}

async function fetchProduct(productId) {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`);
    if (!response.ok) {
        throw new Error(`Error fetching product ${productId}`);
    }
    const product = await response.json();
    return product;
}

loadCartData();


// place order
function placeOrder(orderData) {
    fetch("http://localhost:3000/api/orders/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData),
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        }
        throw new Error("Error placing order");
    })
    .then(order => {
        const orderContainer = document.getElementById('orderContainer');
        orderContainer.innerHTML = ''; 

        const orderDiv = document.createElement('div');
        orderDiv.textContent = `Order ID: ${order._id}, User ID: ${order.userId}, Products: ${order.products.join(', ')}`;
        orderContainer.appendChild(orderDiv);
    })
    .catch(error => {
        console.error("Error placing order:", error);
    });
}

function displayOrder() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = ''; 

    const orderPageContent = document.createElement('div');
    orderPageContent.innerHTML = '<h1>My order</h1>';
    mainContent.appendChild(orderPageContent);
}
 
// navigation to different pages
function navigateTo(page, userId) {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = ''; // Clear main content

    switch (page) {
        case 'home':
            startPage(userId);
            break;
        case 'login':
            loginPage();
            break;
        case 'products':
            productsPage();
            break;
        case 'cart':
            displayCart();
            break;
        case 'order':
            displayOrder();
            break;
        default:
            navigateTo('home');
            break;
    }

    // clear cart container if not on the cart page
    if (page !== 'cart') {
        const cartContainer = document.getElementById('cartContainer');
        if (cartContainer) {
            cartContainer.innerHTML = '';
        }
    }
}

startPage();

