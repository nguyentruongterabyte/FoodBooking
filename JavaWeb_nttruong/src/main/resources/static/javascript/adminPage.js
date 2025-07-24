$(document).ready(function() {
	// Handle main navigation tab item click
	handleTabItemClick('#main-navigation-tab');

	// Handle booking product type navigation tab item click
	handleTabItemClick('#booking-product-type-navigation');

	handleTabItemClick('#type-selector');
	
	// Handle searching input on search
	handleSearchingInputOnSearch('#searching-input', function() {
		// Get data search for
		const searchingFor = $('#searching-input').attr('data-search-for');
		switch (searchingFor) {
			case 'dashboard':
				getAndRenderTotalOrderItems();
				break;
			case 'manage-item':
				const searchType = $('#searching-input').attr('data-search-type') || 'food';
				getAndRenderTotalItems(searchType);
				break;
			default:
				alert('Invalid data searching for');
		}
	});

	// Handle collapse navigation button click
	$('.collapse-navigation-btn').on('click', function() {
		$('.nav').toggleClass('collapsed');
	});

	/* Handle when main navigation item click */
	$('#main-navigation-tab').on('click', '.navigation-item', function() {

		// Get the current tab name
		const tabName = $(this).attr('data-tab');

		// Prevent user click much times in a tab
		if (mainActiveTab === tabName)
			return;

		mainActiveTab = tabName;

		// Set searching input attribute 'data-search-for'
		$('.searching-input-container').show();
		switch (tabName) {
			case 'dashboard-tab':
				// Set searching for 'dashboard'
				$('#searching-input').attr('data-search-for', 'dashboard');
				// Set header title 'Dashboard'
				$('.header-title').text('Dashboard');
				break;
			case 'manage-item-tab':

				if (foodObject.totalItems === null) {
					getAndRenderTotalItems('food');
				}

				if (drinkObject.totalItems === null) {
					getAndRenderTotalItems('drink');
				}

				// Set searching for 'manage-item'
				$('#searching-input').attr('data-search-for', 'manage-item');
				$('.header-title').text('Manage Item');
				break;
			case 'change-password-tab':
				$('.header-title').text('Change Password');
				$('.searching-input-container').hide();
				break;
			default:
				alert('Invalid tab name');
		}
	});
});

/* Custom render paging */
function customRenderPaging({ root = '#food__pagination-nav .pagination', size = 10, currentPage = 1, totalPages = 1 }) {
	const pagination = getPagination(
		{
			currentPage,
			totalPages,
			delta: 2
		});
	renderPaging(
		{
			root,
			pagination,
			size,
			currentPage
		});
}