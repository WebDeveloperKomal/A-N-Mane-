document.getElementById('subscription-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Email',
            text: 'Please enter a valid email address.',
            confirmButtonText: 'OK'
        });
        return; // Stop execution if email is invalid
    }

    // Close the modal/dialog
    document.querySelector('[data-dialog-close="close"]').click();

    // Display processing SweetAlert
    Swal.fire({
        title: 'Processing',
        text: 'Please wait...',
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading();
        }
    });

    // Perform fetch request
    fetch('http://localhost:8080/auth/save-subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            Swal.fire({
                icon: 'success',
                title: 'Subscribed!',
                text: 'You have successfully subscribed to our mailing list.',
                confirmButtonText: 'OK'
            });
        })
        .catch((error) => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong. Please try again later.',
                confirmButtonText: 'OK'
            });
        });
});