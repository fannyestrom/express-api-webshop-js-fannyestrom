// start page 
function startPage() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = '<h1>Webshop Home Page</h1>';

    if (localStorage.getItem('user')) {
        const orderBtn = document.createElement('button');
        orderBtn.textContent = 'My order';
        orderBtn.onclick = () => navigateTo('order');
        mainContent.appendChild(orderBtn);
    }
}

if (localStorage.getItem('user')) {
    // signed in
    printLogoutBtn();
} else {
    // signed out 
    loginPage();
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
                navigateTo('home');
            } else {
                alert("Incorrect login");
            }
        });
    });

    userForm.innerHTML = '';
    userForm.append(inputEmail, inputPassword, loginBtn);  

    printLogoutBtn();    
}

// print logout button
function printLogoutBtn() {
    const userForm = document.getElementById('userForm');

    if (localStorage.getItem('user')) {
        userForm.innerHTML = "";
        const logoutBtn = document.createElement('button');
        logoutBtn.innerText = "Sign out";

        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('user');
            loginPage();
        });

        userForm.appendChild(logoutBtn);
    }
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
        
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');

            const imagePath = 'images/mockup.jpg';

            productDiv.innerHTML = `
                <img src="${imagePath}" alt="${product.name}" width="200" height="220" loading="lazy">
                <h3>${product.name}</h3>
                <p>${product.price} SEK</p>
                <div class="button-container">
                    <button class="decrease">-</button>
                    <button class="increase">+</button>
                </div>
            `;

            // increase & decrease buttons event listeners
            const increase = productDiv.querySelector('.increase');
            increase.addEventListener('click', () => addToCart(product));

            const decrease = productDiv.querySelector('.decrease');
            decrease.addEventListener('click', ( )=> removeFromCart(product));
        
            productContainer.appendChild(productDiv);
        });
        console.log(products);
    })
    .catch(error => {
        console.error('Error fetching products', error);
    });
}

// add product to cart
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Product added to cart:', product);
}

// remove product from cart
function removeFromCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === product.id);
    if (index !== -1) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Product removed from cart:', product);
    }
}

// display shopping cart
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const mainContent = document.getElementById('mainContent');

    mainContent.innerHTML = '';

    if (cart.length === 0) {
        mainContent.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        const cartList = document.createElement('ul');

        cart.forEach(product => {
            const listItem = document.createElement('li');
            listItem.textContent = `${product.name} - ${product.price} SEK`;
            cartList.appendChild(listItem);
        });

        mainContent.appendChild(cartList);
    }
}


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
function navigateTo(page) {
    switch (page) {
        case 'home':
            startPage();
            break;
        case 'login':
            loginPage();
            break;
        case 'products':
            productsPage();
            break;
        case 'order':
            displayOrder();
            break;
        case 'cart':
            displayCart();
            break;
        default:
            navigateTo('home');
            break;
    }
}

startPage();

