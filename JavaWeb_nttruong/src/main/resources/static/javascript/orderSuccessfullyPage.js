$(document).ready(function() {
	// Call loop animate
	loopAnimation();
	
	// Handle back button click 
	$('.back-home-btn').on('click', function() {
		window.location.replace('/');
	});
});

/* Driver man loop */
function loopAnimation() {
	$('.driver-man')
		.animate({ left: '-500px' }, 0)
		.animate({ left: '100px' }, 6000)
		.animate({ left: '200px' }, 300)
		.animate({ left: '100%' }, 1000, function() {
			loopAnimation();
		});
}
