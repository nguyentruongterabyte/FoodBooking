$(document).ready(function() {
	$('#login-form').on('submit', function(e) {
		e.preventDefault();
		
		// Get form data
		const formData = new FormData(this);
		
		const formObject = Object.fromEntries(formData.entries());
		
		accountService.login(formObject)
		.then(() => {
			window.location.href = '/admin/dashboard';
		})
		.catch(message => {
			showOtherToast({text: message, headerTitle: 'Bad credential'})
		})
	})
});