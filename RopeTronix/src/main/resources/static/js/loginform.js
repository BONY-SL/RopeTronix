
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
function showErrorAlert(message){

    const  errorMessage = document.getElementById("errorAlert");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 8000);
}
function showErrorAlert2(message){

    const  errorMessage = document.getElementById("errorAlert2");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 8000);
}

function showSuccessAlert(message){

    const  errorMessage = document.getElementById("successAlert");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 8000);
}

function signUp() {


    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email2").value;
    const password = document.getElementById("password2").value;

    if (firstname === "") {
        showErrorAlert("First Name is required!");
        return false;
    }
    if (lastname === "") {
        showErrorAlert("Last Name is required!");
        return false;
    }
    if (email === "") {
        showErrorAlert("Email is required!");
        return false;
    }
    if (password === "") {
        showErrorAlert("Password is required!");
        return false;
    }
    if (password.length < 8) {
        showErrorAlert("Password must be at least 8 characters long!");
        return false;
    }
    if(!email.match(validRegex)){
        showErrorAlert("Please Enter Valid Email Address");
        return false;
    }

    const registerUser ={
        firstname:firstname,
        lastname:lastname,
        email:email,
        password:password
    };

    fetch("http://localhost:8080/repotronix/register", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerUser)
    }).then(response => {
        if (response.ok) {
            console.log(response);
            showSuccessAlert("Registration Successfully !");
            document.getElementById("signUpForm").reset();
        } else {
            showErrorAlert("Registration Unsuccessfully !");
            return false;
        }
    });
}

function signIn() {
    const email = document.getElementById("_email").value;
    const password = document.getElementById("_password").value;

    if (email === "" || password === "") {
        showErrorAlert2("Email And Password Required!");
        return false;
    }

    const user = {
        email: email,
        password: password
    };

    fetch("http://localhost:8080/repotronix/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(response => {
        if (response.ok) {
            response.json().then(data => {


                saveUser(data);

                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            });
        } else {
            response.json().then(data => {
                Swal.fire({
                    icon: 'error',
                    title: 'Incorrect Information',
                    text: data.message || "Invalid Username OR Password",
                    confirmButtonColor: '#5dd042',
                    confirmButtonText: 'OK'
                });
            });
        }
    }).catch(error => {
        console.error("Error:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong. Please try again later.',
            confirmButtonColor: '#5dd042',
            confirmButtonText: 'OK'
        });
    });
}

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}
