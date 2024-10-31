function logOut() {

    Swal.fire({
        title: 'Are you sure you want to logout?',
        text: "You will need to login again to access your account!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5dd042',
        cancelButtonColor: '#ff4646',
        confirmButtonText: 'Yes, logout!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "index.html";
            clearUser();
        }
    });
}


function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function clearUser() {
    localStorage.removeItem('user');
}

function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function showSuccessAlert(message){

    const  errorMessage = document.getElementById("successAlert");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 8000);
}

function showErrorAlert(message){

    const  errorMessage = document.getElementById("errorAlert");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 8000);
}

function setUserToForm() {
    const userDetails = getUser();

    if (userDetails) {
        document.getElementById("firstname").value = userDetails.firstname || '';
        document.getElementById("lastname").value = userDetails.lastname || '';
        document.getElementById("email").value = userDetails.email || '';
        document.getElementById("password").value = userDetails.password || '';
    } else {
        console.error("User details not found.");
    }
}

 function updateUser() {
    const localStorageUser = getUser();

    if (!localStorageUser) {
        console.error("No user found to update.");
        return;
    }

    let firstname = document.getElementById("firstname").value;
    let lastname = document.getElementById("lastname").value;

    if(lastname === "" || firstname === ""){
        showErrorAlert("First Name And Last Name Required!");
        return false;
    }
    const updateUser = {
        id: localStorageUser.id,
        firstname: firstname,
        lastname: lastname,
        email: localStorageUser.email,
    };


    fetch("http://localhost:8080/repotronix/updateUser", {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateUser)
    }).then(response => {
        if (response.ok) {
            response.json().then(data => {
                clearUser();
                saveUser(data);
                setUserToForm();
                showSuccessAlert("Successfully Updated");
            });
        } else {
            response.json().then(data => {
                Swal.fire({
                    icon: 'error',
                    title: 'Unsuccessfully Updated',
                    text: data.message || "Error",
                    confirmButtonColor: '#5dd042',
                    confirmButtonText: 'OK'
                });
            });
        }
    }).catch(error => {
        console.error("Error:", error);
        Swal.fire({
            icon: 'error',
            title: 'Unsuccessfully Updated',
            text: 'Something went wrong. Please try again later.',
            confirmButtonColor: '#5dd042',
            confirmButtonText: 'OK'
        });
    });
}


window.onload = function() {
    setUserToForm();
};


// Function to close the notification manually
 function closeNotification() {
    const notification = document.getElementById("notification");
    notification.classList.remove("visible");
}