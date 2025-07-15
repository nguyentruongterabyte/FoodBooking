// Handle when tab item click
function handleTabItemClick() {
	$(".navigation-tabs").on('click', '.navigation-item', function() {
		// remove all active on other navigation item
		$('.navigation-item').removeClass('active');

		// Add active to current item
		$(this).addClass('active');
		
		const tabId = $(this).attr('data-tab');
		
		if (tabId && $(`#${tabId}`)) {
			
			// Remove class show in other tab contents
			$('.tab-content-item').removeClass('show');
			
			// Add class show to current tab
			$(`#${tabId}`).addClass('show');
		}
	});
}