$(document).ready(function() {

	/* Handle form change password submit */
	$('#change-password-form').on('submit', function(e) {
		e.preventDefault();

		// Get form data
		const formData = new FormData(this);

		const formObj = Object.fromEntries(formData.entries());

		// Submit form
		accountService.updateAccountPassword(JSON.stringify(formObj))
			.then(message => {
				showSuccessToast({ text: message, headerTitle: 'Password updated', autoClose: 15000 });
				window.location.href = "/admin/login";
			})
			.catch(err => {
				const errors = err.errors;

				if (errors instanceof Array) {
					for (const error of errors) {
						$(`.form-control[name="${error.field}"]`).addClass('is-invalid');
						$(`.form-control[name="${error.field}"]`).siblings('.invalid-feedback').text(error.message);
					}
				} else {
					showOtherToast({text: err.message, headerTitle: 'Bad request'});
				}
			})
	});
});