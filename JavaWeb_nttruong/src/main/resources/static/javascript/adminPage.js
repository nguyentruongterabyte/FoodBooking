$(document).ready(function() {

	// Connect socket
	connectWebsocket();

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
	const savedState = localStorage.getItem('JavaWeb_nttruong_navCollapsed');
	if (savedState === 'true') {
		$('.nav').addClass('collapsed');
	} else {
		$('.nav').removeClass('collapsed');
	}

	$('.collapse-navigation-btn').on('click', function() {
		const isCollapsed = $('.nav').toggleClass('collapsed').hasClass('collapsed');
		localStorage.setItem('JavaWeb_nttruong_navCollapsed', isCollapsed ? 'true' : 'false');
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

	/* Handle confirmation button click */
	$('#confirm-btn').on('click', function() {
		const action = $(this).attr('data-action');

		switch (action) {
			case 'delete': {
				const itemId = Number($(this).attr('data-item-id')); // Get item id

				// Call API delete booking product
				bookingProductService.deleteBookingProduct(itemId)
					.then((message) => {
						showSuccessToast({ text: message, headerTitle: 'Remove item' });

						let deletedItem = foodObject.items.find(item => item.id === itemId)
							|| drinkObject.items.find(item => item.id === itemId);

						deletedItem.isDeleted = true;
						// Update list
						foodObject =
						{
							...foodObject, items: foodObject.items.map(food =>
								food.id === itemId ? { ...food, isDeleted: true } : food)
						}
						drinkObject =
						{
							...drinkObject, items: drinkObject.items.map(drink =>
								drink.id === itemId ? { ...drink, isDeleted: true } : drink)
						}

						// Re render list view
						$(`table tr[data-item-id="${deletedItem.id}"]`)
							.addClass('table-danger').html(generateItemHTML({ ...deletedItem, itemOrder: '###' }));

						// close modal
						$('#confirm-modal-close-btn').click();
					})
					.catch((message) => {
						showOtherToast({ text: message, headerTitle: 'Remove item issue' });
					});
				break;
			}

			case 'transfer': {

				const itemId = Number($(this).attr('data-item-id')); // Get item id
				const statusId = Number($(this).attr('data-status-id'));

				orderService.updateOrderStatus(
					{
						orderId: itemId,
						statusId
					}
				)
					.then(message => {
						showSuccessToast({ text: message, headerTitle: 'Update successfully' });
						// Get data item from order object
						let itemData = orderObject.items.find(item => item.id === itemId);


						if (itemData) {
							itemData = { ...itemData, orderStatus: orderStatuses.find(os => os.id = statusId) }
							orderObject.items = orderObject.items.map(order => order.id === itemData.id ? itemData : order);
							renderOrderInfo(itemData);
							renderOrderListView(orderObject.items);
						}

						// Send updated status for customer
						if (stompClient.connected) {
							// Create notification for customer
							stompClient.publish({
								destination: "/app/order-status",
								body: JSON.stringify({ orderId: itemData.id, orderStatus: itemData.orderStatus })
							});
						} else {
							console.warn("WebSocket disconnect, cannot sent order!");
						}

						// close modal
						$('#confirm-modal-close-btn').click();
					})
					.catch(message => showErrorToast({ text: message, headerTitle: 'Bad request' }));

				break;
			}

			default:
				alert('Invalid action!');
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


stompClient.onConnect = (frame) => {
	setConnected(true);
	console.log('WebSocket connected:', frame);

	// Subcribe to receive new order notification
	stompClient.subscribe('/topic/orders', (message) => {
		const order = JSON.parse(message.body);

		// Display new order notification
		$("#admin-alert .order-info")
			.html(`Customer <b>${order.customerName}</b> has just created order <b>#${String(order.orderId).padStart(6, '0')}</b>`);
		$("#admin-alert").fadeIn();

		// Re-Render today's sales
		renderTodaySales();

		// Re-render today order count
		renderTodayOrdersCount({ orderStatusId: null, root: '#total-orders-counter' });
			
		setTimeout(function() {
			$("#admin-alert").fadeOut();
		}, 10000);

		// Call API find by id
		orderService.getByOrderId(order.orderId)
			.then(fetchedOrder => {
				orderObject.items.unshift(fetchedOrder);
				// Re render order list view
				renderOrderListView(orderObject.items);
			})
			.catch(message =>
				console.error(message)
			);
	});
};