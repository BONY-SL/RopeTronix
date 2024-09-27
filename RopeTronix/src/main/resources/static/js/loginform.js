
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

function signUp() {


}

function signIn() {

    const email = document.getElementById("_email").value;
    const password = document.getElementById("_password").value;

    if (email === "" || password === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Missing Information',
            text: 'Please enter both email and password.',
            confirmButtonColor: '#5dd042',
            confirmButtonText: 'OK'
        });
    } else {
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
                console.log(response);
                window.location.href = 'dashboard.html';
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Incorrect Information',
                    text: 'Email and Password Not Matched.',
                    confirmButtonColor: '#5dd042',
                    confirmButtonText: 'OK'
                });
            }
        });
    }
}

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});
