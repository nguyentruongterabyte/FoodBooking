$(document).ready(function() {
	
	// Handle hide invalid feedback when user input
	$('#username').on('input', function() {
		$('.invalid-feedback.username').hide();
	});
	
	$('#password').on('input', function() {
		$('.invalid-feedback.password').hide();
	})
	
	$('#login-form').on('submit', function(e) {
		e.preventDefault();
		
		// Get form data
		const formData = new FormData(this);
		
		const formObject = Object.fromEntries(formData.entries());
		
		const username = formObject.username;
		const password = formObject.password;
		
		// Check empty username and show invalid feedback
		if (!username) {
			$('.invalid-feedback.username').show();
		}
		
		// Check empty password and show invalid feedback
		if (!password) {
			$('.invalid-feedback.password').show();
		}
		
		if (!password || !username) {
			$('#username').val(''); // clear input
			$('#password').val(''); // clear input
			return;
		}
		
		// Call API sign in
		accountService.login(formObject)
		.then(() => {
			showSuccessToast({headerTitle: 'Login successfully', text: 'We will direct to dashboard...'});
			
			setTimeout(function () {
				window.location.replace('/admin/dashboard');
			}, 2500);
		})
		.catch(message => {
			$('#username').val(''); // clear input
			$('#password').val(''); // clear input
			showErrorToast({text: message, headerTitle: 'Bad credential'})
		});
	})
});