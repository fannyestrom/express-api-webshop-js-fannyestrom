let userForm = document.getElementById('userForm');

if (localStorage.getItem('user')) {
    // signed in
    printLogoutBtn();
} else {
    // signed out 
    printLoginForm();
}

function printLoginForm() {
    userForm.innerHTML = "";
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
                localStorage.setItem("user", data.user)
                printLogoutBtn()
            } else {
                alert("Incorrect login");
            }
        })
    })

    userForm.append(inputEmail, inputPassword, loginBtn);
}

function printLogoutBtn() {
    userForm.innerHTML = "";

    let logoutBtn = document.createElement('button');
    logoutBtn.innerText = "Sign out";

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');

        printLoginForm();
    })

    userForm.appendChild(logoutBtn);
}

