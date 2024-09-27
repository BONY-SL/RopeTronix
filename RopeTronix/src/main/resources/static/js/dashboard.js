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
        }
    });
}