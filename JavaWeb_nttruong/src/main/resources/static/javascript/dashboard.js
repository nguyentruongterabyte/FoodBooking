$(document).ready(function() {

	getAndRenderTotalOrderItems();

	// Render today's sales
	renderTodaySales();

	// Render today's order count

	// ORDER_STATUSES: common.js
	renderTodayOrdersCount({ orderStatusId: null, root: '#total-orders-counter .card-content' });
	renderTodayOrdersCount({ orderStatusId: ORDER_STATUSES.SHIPPING, root: '#shipping-orders-counter .card-content' });
	renderTodayOrdersCount({ orderStatusId: ORDER_STATUSES.COMPLETED, root: '#completed-orders-counter .card-content' });
	renderTodayOrdersCount({ orderStatusId: ORDER_STATUSES.CANCELLED, root: '#cancelled-orders-counter .card-content' });


	// Call API statuses or not
	renderOrderStatusFilterSelector();

	// Handle status selector on change
	$('#statuses-selector').on('change', function() {

		if ($(this).val() === '')
			return;

		const statusId = Number($(this).val());
		const orderStatus = orderStatuses.find(os => os.id === statusId);
		selectedFilteredStatuses.push(orderStatus);

		// Call API filter by order statues
		getAndRenderTotalOrderItems();
		renderOrderStatusFilterSelector();
		renderOrderStatusFilterButtons();
	});

	// Handle remove filter button click
	$('#selected-statuses-filter').on('click', '.remove-filter', function() {
		const statusId = Number($(this).attr('data-status-id'));
		selectedFilteredStatuses = selectedFilteredStatuses.filter(selected => selected.id !== statusId);

		getAndRenderTotalOrderItems();
		renderOrderStatusFilterSelector();
		renderOrderStatusFilterButtons();
	});

	// Handle date type change 
	$('#date-type-selector').on('change', function() {
		orderObject.dateType = $(this).val();
		getAndRenderTotalOrderItems();
	});

	// Handle order item click
	$('#order-list').on('click', '.order-item', function() {
		const itemId = Number($(this).attr('data-item-id')); // Get item id

		// Get data item from order object
		let itemData = orderObject.items.find(item => item.id === itemId);
		
		if (itemData) {
			$('#show-order-detail-btn').click();
			renderOrderInfo(itemData);
		}
	});

	// Handle order pagination item click
	handleOrderPaginationItemClick();

	// Handle order previous & next page click
	handleOrderPrevNextPaginationClick();
});

/* Handle previous button and next button on pagination click */
function handleOrderPrevNextPaginationClick() {
	// previous page button click
	$('#order__pagination-nav .pagination').on('click', '.prev-page', function() {
		let currentPage = orderObject.currentPage;

		// If the current page is the first page, then do nothing
		if (currentPage <= 1)
			return;
		currentPage--; // Decrease 1 unit
		orderObject.currentPage = currentPage; // set current page order object

		// remove active class
		$('#order__pagination-nav .pagination').find('.page-item-number').removeClass('active');
		$('#order__pagination-nav .pagination').find(`.page-item-number[data-page="${currentPage}"]`).addClass('active');

		// Get and render item
		getOrders({
			keyword: getKeywordFromSearchingInput(),
			orderStatusIds: selectedFilteredStatuses.map(selected => selected.id),
			includeTotal: false,
			page: orderObject.currentPage,
			size: orderObject.size
		});
	});

	// Next page button click
	$('#order__pagination-nav .pagination').on('click', '.next-page', function() {
		let currentPage = orderObject.currentPage;

		// If the current page is the last page, then do nothing
		if (currentPage >= orderObject.totalPages)
			return;

		currentPage++; // Increase 1 unit
		orderObject.currentPage = currentPage; // Set current page order object

		// remove active class
		$('#order__pagination-nav .pagination').find('.page-item-number').removeClass('active');
		$('#order__pagination-nav .pagination').find(`.page-item-number[data-page="${currentPage}"]`).addClass('active');


		// Get and render item
		getOrders({
			keyword: getKeywordFromSearchingInput(),
			orderStatusIds: selectedFilteredStatuses.map(selected => selected.id),
			includeTotal: false,
			page: orderObject.currentPage,
			size: orderObject.size
		});
	});

	// Handle order status button on order detail click
	$('.order-status-selector-wrapper').on('click', '#order-status-btn', function(e) {

		// Get order status id
		const orderStatusId = Number($(this).attr('data-order-status-id'));

		// If the order is completed or cancelled, then do nothing
		if (orderStatusId === ORDER_STATUSES.COMPLETED
			|| orderStatusId === ORDER_STATUSES.CANCELLED)
			return;

		$('#order-status-selector').toggle();
		$('.transfer-icon').toggle();
	});
	
	// Handle order status selector changed
	$('.order-status-selector-wrapper').on('change', '#order-status-selector', function() {
		
		// Get change status 
		const statusIdToChange = Number($(this).val());
		
		// Get previous status
		const currentStatusId = Number($(this).attr('data-order-status-id'));
		
		// Get item id
		const itemId = Number($(this).attr('data-item-id'));

		// Check if both is equals
		if (statusIdToChange === currentStatusId)
			return;
		
		// Get status to change object
		const statusToChange = orderStatuses.find(orderStatus => statusIdToChange === orderStatus.id);
		
		const currentStatus = orderStatuses.find(orderStatus => currentStatusId === orderStatus.id);
		
		$('#confirm-btn')
			.attr('data-action', 'transfer')
			.attr('data-item-id', itemId)
			.attr('data-status-id', statusIdToChange);
		
		$('#modal-confirm-title').text('Change Order Status Confirmation');
		$('#modal-confirm-body').text(
			`Are you sure to transfer order status from "${currentStatus.name}" to "${statusToChange.name}"`
		);
		$('#show-confirm-modal').click();
	});
}

/* Handle pagination item click */
function handleOrderPaginationItemClick() {
	$('#order__pagination-nav .pagination').on('click', '.page-item-number', function() {
		// If click '...' item or click on active page, return function
		if ($(this).text() === '...' || $(this).hasClass('active'))
			return;

		// Remove active in other item
		$('#order__pagination-nav .pagination').find('.page-item-number').removeClass('active');

		// Add active class in current item
		$(this).addClass('active');

		const page = Number($(this).text()); // Get item page number

		orderObject.currentPage = page;

		getOrders(
			{
				keyword: getKeywordFromSearchingInput(),
				orderStatusIds: selectedFilteredStatuses.map(selected => selected.id),
				includeTotal: false,
				page: orderObject.currentPage,
				size: orderObject.size,
			}
		);
	});
}

/* Render order list view */
function renderOrderListView(data = []) {
	const html = data.map(orderItem => generateOrderItemHTML(orderItem));

	$('#order-list').html(html.join(''));
}

/* Render order item info */
function renderOrderInfo(data = {
	id: 11,
	name: "Nguyễn Thái Trưởng",
	phone: "0948915051",
	detailAddress: "30 thôn Tân Lập, xã Chư Kbô, huyện Krông Búk, tỉnh Đắk Lắk",
	message: "",
	shippingFee: 29000,
	totalPrice: 52000,
	ward: {
		id: 7,
		name: "Hoa Thang"
	},
	province: {
		id: 3,
		name: "Dak Lak"
	},
	bookingProducts: [
		{
			bookingProductId: 11,
			quantity: 1,
			itemPrice: 29000,
			name: "Combo Gà Xối Mỡ + Cải Chua - Bao Ngon 💥 1",
			description: "Thịt đùi gà tươi đã rút xương + sốt nước mắm + hành tây + cơm + dưa leo + salad + canh + dưa hấu",
			imageUrl: "http://localhost:8080/api/files/97d39b22-d7a1-4f77-9fcd-f89a74968a3b_f93227e6005185bd347971839a569488ab0a347a%20(1).png"
		},
		{
			bookingProductId: 14,
			quantity: 1,
			itemPrice: 23000,
			name: "Cơm Gà Đùi Góc Tư Xối Mỡ 1",
			description: "Đùi gà tươi góc 4 xối mỡ + Cơm + dưa leo + salad + canh",
			imageUrl: "http://localhost:8080/api/files/d1d21809-2414-46b6-8d23-bfcb9942e7b5_1bca93c4686636d4fca8529d0e002012f927c6a0.png"
		}
	],
	orderStatus: {
		id: 1,
		name: "New"
	},
	cancelledAtStatus: null,
	createdAt: "2025-07-24T09:25:04",
	createdAtStr: "24 Jul 2025"
}) {
	// Order id
	$('#order-detail-modal .order-id').text('#' + String(data.id).padStart(6, '0'));

	// Create at
	$('#order-detail-modal .created-at').text(data.createdAtStr);

	// Total item
	$('#order-detail-modal .total-items-quantity').text(
		data.bookingProducts.reduce((prev, bp) => prev + bp.quantity, 0)
		+ ' Items'
	);

	// Customer name
	$('#order-detail-modal .customer-name').text(data.name);

	// Customer phone
	$('#order-detail-modal .customer-phone').text(data.phone);

	// Customer address
	$('#order-detail-modal .customer-address').text(
		`${data.detailAddress}, ${data.ward.name}, ${data.province.name}`
	);

	// Booking product list
	const bookingProductsHTML = data.bookingProducts.map(
		bookingProduct => `
			<li class="list-view-item">
				<div class="item-image-container">
					<img class="item-image" src="${bookingProduct.imageUrl}">
				</div>
				<div class="item-info">
					<div class="item-info-group">
						<h4 class="item-name">${bookingProduct.name}</h4>
						<p class="item-description">${bookingProduct.description}</p>
						<div class="detail-fee-line">
							<h3 class="item-price">${bookingProduct.itemPrice.toLocaleString()} đ</h3>
							<div class="item-quantity-wrapper">
								<span class="title">Quantity: </span>
								<span class="item-quantity">${bookingProduct.quantity}</span>
							</div>
						</div>
					</div>
				</div>
			</li>
		`
	);

	$('#order-detail-modal .booking-product-list').empty();
	$('#order-detail-modal .booking-product-list').html(bookingProductsHTML.join(''));

	// Total items price
	$('#order-items-total-price').text(data.totalPrice.toLocaleString() + ' đ');

	// Shipping fee
	$('#shipping-fee').text(data.shippingFee.toLocaleString() + ' đ');

	// Order total price
	const orderTotalPrice = Number(data.totalPrice + data.shippingFee);
	$('#order-total-price').text(orderTotalPrice.toLocaleString() + ' đ');

	// Order status button
	let itemStatusButtonHTML = '';
	let itemStatusSelectorHTML = '';
	switch (data.orderStatus.id) {
		case ORDER_STATUSES.NEW:
			itemStatusButtonHTML = `
				<button data-order-status-id="${data.orderStatus.id}" id="order-status-btn" class="btn order-status-btn new-btn">
					<div class="icon"></div>
					<span>New</span>
				</button>`;
			itemStatusSelectorHTML = `
				<select 
					data-item-id="${data.id}" 
					data-order-status-id="${data.orderStatus.id}" 
					id="order-status-selector" 
					class="btn btn-outline-primary order-status-selector"
				>
					<option value="1" disabled selected>New</option>
					<option value="2">Shipping</option>
					<option value="3">Cancel</option>
					<option value="4" disabled>Complete</option>
				</select>`;
			break;
		case ORDER_STATUSES.SHIPPING:
			itemStatusButtonHTML = `
				<button data-order-status-id="${data.orderStatus.id}" id="order-status-btn" class="btn order-status-btn shipping-btn">
					<div class="icon"></div>
					<span>Shipping</span>
				</button>`;
			itemStatusSelectorHTML = `
				<select 
					data-item-id="${data.id}" 
					data-order-status-id="${data.orderStatus.id}" 
					id="order-status-selector" 
					class="btn btn-outline-primary order-status-selector"
				>
					<option value="1" disabled>New</option>
					<option value="2" selected disabled>Shipping</option>
					<option value="3">Cancel</option>
					<option value="4">Complete</option>
				</select>`;
			break;
		case ORDER_STATUSES.CANCELLED:
			itemStatusButtonHTML = `		
				<button data-order-status-id="${data.orderStatus.id}" id="order-status-btn" class="btn order-status-btn cancelled-btn">
					<div class="icon"></div>
					<span>Cancelled</span>
				</button>`;
			itemStatusSelectorHTML = `
				<select 
					data-item-id="${data.id}" 
					data-order-status-id="${data.orderStatus.id}" 
					id="order-status-selector" 
					class="btn btn-outline-primary order-status-selector"
				>
					<option value="1" disabled>New</option>
					<option value="2" disabled>Shipping</option>
					<option value="3" selected disabled>Cancel</option>
					<option value="4" disabled>Complete</option>
				</select>`;
			break;
		case ORDER_STATUSES.COMPLETED:
			itemStatusButtonHTML = `
				<button data-order-status-id="${data.orderStatus.id}" id="order-status-btn"  class="btn order-status-btn completed-btn">
					<div class="icon"></div>
					<span>Completed</span>
				</button>`;
			itemStatusSelectorHTML = `
				<select data-order-status-id="${data.orderStatus.id}" id="order-status-selector" class="btn btn-outline-primary order-status-selector">
					<option value="1" disabled>New</option>
					<option value="2" disabled>Shipping</option>
					<option value="3" disabled>Cancel</option>
					<option value="4" selected disabled>Complete</option>
				</select>`;
			break;
		default:
			itemStatusButtonHTML = `
				<button data-order-status-id="${data.orderStatus.id}" id="order-status-btn"  class="btn order-status-btn cancelled-btn">
					<div class="icon"></div>
					<span>Completed</span>
				</button>`;
			itemStatusSelectorHTML = `
				<select 
					data-item-id="${data.id}" 
					data-order-status-id="${data.orderStatus.id}" 
					id="order-status-selector" 
					class="btn btn-outline-primary order-status-selector"
				>
					<option value="1" disabled>New</option>
					<option value="2" disabled>Shipping</option>
					<option value="3" disabled>Cancel</option>
					<option value="4" selected disabled>Complete</option>
				</select>`;

	}
	$('.order-status-selector-wrapper').html(
		itemStatusButtonHTML +
		'<div class="transfer-icon"><i class="fa-solid fa-arrow-right"></i></div>' +
		itemStatusSelectorHTML
	);
}

/* Generate order item HTML */
function generateOrderItemHTML(data = {
	id: 11,
	name: "Nguyễn Thái Trưởng",
	phone: "0948915051",
	detailAddress: "30 thôn Tân Lập, xã Chư Kbô, huyện Krông Búk, tỉnh Đắk Lắk",
	message: "",
	shippingFee: 29000,
	totalPrice: 52000,
	ward: {
		id: 7,
		name: "Hoa Thang"
	},
	province: {
		id: 3,
		name: "Dak Lak"
	},
	bookingProducts: [
		{
			bookingProductId: 11,
			quantity: 1,
			itemPrice: 29000,
			name: "Combo Gà Xối Mỡ + Cải Chua - Bao Ngon 💥 1",
			description: "Thịt đùi gà tươi đã rút xương + sốt nước mắm + hành tây + cơm + dưa leo + salad + canh + dưa hấu",
			imageUrl: "http://localhost:8080/api/files/97d39b22-d7a1-4f77-9fcd-f89a74968a3b_f93227e6005185bd347971839a569488ab0a347a%20(1).png"
		},
		{
			bookingProductId: 14,
			quantity: 1,
			itemPrice: 23000,
			name: "Cơm Gà Đùi Góc Tư Xối Mỡ 1",
			description: "Đùi gà tươi góc 4 xối mỡ + Cơm + dưa leo + salad + canh",
			imageUrl: "http://localhost:8080/api/files/d1d21809-2414-46b6-8d23-bfcb9942e7b5_1bca93c4686636d4fca8529d0e002012f927c6a0.png"
		}
	],
	orderStatus: {
		id: 1,
		name: "New"
	},
	cancelledAtStatus: null,
	createdAt: "2025-07-24T09:25:04",
	createdAtStr: "24 Jul 2025"
}) {

	let itemStatusButtonHTML = '';
	switch (data.orderStatus.id) {
		case ORDER_STATUSES.NEW:
			itemStatusButtonHTML = `
			<button class="btn order-status-btn new-btn">
				<div class="icon"></div>
				<span>New</span>
			</button>`;
			break;
		case ORDER_STATUSES.SHIPPING:
			itemStatusButtonHTML = `
			<button class="btn order-status-btn shipping-btn">
				<div class="icon"></div>
				<span>Shipping</span>
			</button>`;
			break;
		case ORDER_STATUSES.CANCELLED:
			itemStatusButtonHTML = `		
			<button class="btn order-status-btn cancelled-btn">
				<div class="icon"></div>
				<span>Cancelled</span>
			</button>`;
			break;
		case ORDER_STATUSES.COMPLETED:
			itemStatusButtonHTML = `
			<button class="btn order-status-btn completed-btn">
				<div class="icon"></div>
				<span>Completed</span>
			</button>`;
			break;
		default:
			itemStatusButtonHTML = `
			<button class="btn order-status-btn cancelled-btn">
				<div class="icon"></div>
				<span>Completed</span>
			</button>`;
	}

	return `
		<li class="order-item" data-item-id="${data.id}">
			<div class="order-id-wrapper">
				<h4 class="order-id">#${String(data.id).padStart(6, '0')}</h4>
				<p class="created-at">${data.createdAtStr}</p>
			</div>
			<div class="first-item-wrapper">
				<div class="item-image-wrapper">
					<img src="${data.bookingProducts[0].imageUrl}" alt="${data.bookingProducts[0].name}">
				</div>
				<div class="item-info-wrapper">
					<h3 class="item-name">${data.bookingProducts[0].name}</h3>
					<p class="item-description">${data.bookingProducts[0].description}</p>
					<div class="item-price-wrapper">
						<h3 class="item-price">${data.bookingProducts[0].itemPrice.toLocaleString()} đ</h3>
						<div class="item-quantity-wrapper">
							<p class="title">Quanity:</p>
							<p class="item-quantity">${data.bookingProducts[0].quantity}</p>
						</div>
					</div>
				</div>
			</div>
			<div class="line"></div>
			<p class="total-items-quantity">
				${data.bookingProducts.reduce((prev, bp) => prev + bp.quantity, 0)} Items
			</p>
			<div class="total-price-wrapper">
				<h2 class="total-price">
					${(data.bookingProducts
			.reduce((prev, bp) => prev + bp.quantity * bp.itemPrice, 0) + data.shippingFee)
			.toLocaleString()
		} đ
				</h2>
				${itemStatusButtonHTML}
			</div>
		</li>
	`;
}

/* Get orders */
function getOrders(
	{
		keyword = '',
		includeTotal = true,
		page = 1,
		size = 20,
		orderStatusIds = orderStatuses.map(orderStatus => orderStatus.id)
	}
) {

	// Empty list view 
	$('#order-list').empty();

	// Call API get order page 
	orderService.getOrdersPage(
		{
			dateType: orderObject.dateType,
			keyword,
			orderStatusIds,
			page,
			size,
			includeTotal

		}
	).then(pagedResponse => {
		if (pagedResponse.totalPages) {
			orderObject.totalPages = pagedResponse.totalPages;
			orderObject.currentPage = pagedResponse.page;

			customRenderPaging(
				{
					root: '#order__pagination-nav .pagination',
					size: orderObject.size,
					currentPage: orderObject.currentPage,
					totalPages: orderObject.totalPages
				}
			);

		}
		orderObject.items = pagedResponse.items;
		renderOrderListView(orderObject.items);

	}).catch(message => showOtherToast({ text: message, headerTitle: 'Retrieve issues', autoClose: 10000 }));
}



/* Get and render total items */
function getAndRenderTotalOrderItems() {

	// Empty order list
	$('#order-list').empty();

	// Call API get total items
	orderService.getCount({
		keyword: getKeywordFromSearchingInput('#searching-input'),
		orderStatusIds: selectedFilteredStatuses.map(selected => selected.id),
		dateType: orderObject.dateType
	}).then(totalItems => {
		$('#order__total-items').text(`Total ${totalItems} items`);

		if (totalItems > 0) {
			$('#order__pagination-nav .pagination').show();

			// Render first page items
			getOrders(
				{
					keyword: getKeywordFromSearchingInput(),
					orderStatusIds: selectedFilteredStatuses.map(selected => selected.id),
					includeTotal: true,
					page: orderObject.currentPage,
					size: orderObject.size,
				}
			);
		} else {
			$('#order__pagination-nav .pagination').hide();
			showOtherToast({ text: 'There is nothing to show!', headerTitle: 'Empty list' });
		}
	})
		.catch(message => {
			$('#order__pagination-nav .pagination').hide();
			showOtherToast({ text: message, headerTitle: 'Get total order items failed' });
		})
}

/* Get keyword from searching input */
function getKeywordFromSearchingInput(root = '#searching-input') {
	return $(root).val() || '';
}

/* Call API and Render today's sales*/
function renderTodaySales() {

	// Call API get today sales
	orderService.getTodaySales()
		.then(todaySales => {
			$('#today-sales .card-content').text(Number(todaySales).toLocaleString() + ' đ');
		})
		.catch(message => {
			$('#today-sales .card-content').text('0 đ');
			showErrorToast({ headerTitle: "Retrieve today's sales failed", text: message })
		});
}

/* Call API and render today order count by order status id */
function renderTodayOrdersCount({ orderStatusId, root }) {
	orderService.getTodayCount(orderStatusId)
		.then(todayCount => {
			$(root).text(todayCount);
		})
		.catch(message => showErrorToast({ headerTitle: "Retrieve today count failed", text: message }));
}

/* Render order status buttons*/
function renderOrderStatusFilterButtons() {

	// Array of element html	
	const elementsHTML = selectedFilteredStatuses.map(selected => `
			<li class="selected-order-status-item">
				<button class="btn">
					<span>${selected.name}</span>
					<i data-status-id="${selected.id}" class="fa-regular fa-circle-xmark remove-filter"></i>
				</button>
			</li>
		`);

	// Render filter button list
	$('#selected-statuses-filter').html(elementsHTML.join(''));
}

/* Render order status selector */
function renderOrderStatusFilterSelector() {

	// Array of element html
	let elementsHTML = orderStatuses.map(orderStatus => `
		<option value="${orderStatus.id}" 
		${selectedFilteredStatuses.some(selected => selected.id === orderStatus.id) ? 'disabled' : ''}>${orderStatus.name}</option>
	`);

	elementsHTML.unshift('<option value="" hidden>Filter</option>')
	// Render selector
	$('#statuses-selector').html(elementsHTML.join(''))

}

const orderStatuses = [
	{ id: '', name: '' },
	{ id: ORDER_STATUSES.NEW, name: 'New' },
	{ id: ORDER_STATUSES.SHIPPING, name: 'Shipping' },
	{ id: ORDER_STATUSES.CANCELLED, name: 'Cancelled' },
	{ id: ORDER_STATUSES.COMPLETED, name: 'Completed' }
]

let selectedFilteredStatuses = [];


let orderObject = {
	currentPage: 1,
	dateType: 'today',
	totalPages: null,
	size: 20,
	items: [
		{
			id: 11,
			name: "Nguyễn Thái Trưởng",
			phone: "0948915051",
			detailAddress: "30 thôn Tân Lập, xã Chư Kbô, huyện Krông Búk, tỉnh Đắk Lắk",
			message: "",
			shippingFee: 29000,
			totalPrice: 52000,
			ward: {
				id: 7,
				name: "Hoa Thang"
			},
			province: {
				id: 3,
				name: "Dak Lak"
			},
			bookingProducts: [
				{
					bookingProductId: 11,
					quantity: 1,
					itemPrice: 29000,
					name: "Combo Gà Xối Mỡ + Cải Chua - Bao Ngon 💥 1",
					description: "Thịt đùi gà tươi đã rút xương + sốt nước mắm + hành tây + cơm + dưa leo + salad + canh + dưa hấu",
					imageUrl: "http://localhost:8080/api/files/97d39b22-d7a1-4f77-9fcd-f89a74968a3b_f93227e6005185bd347971839a569488ab0a347a%20(1).png"
				},
				{
					bookingProductId: 14,
					quantity: 1,
					itemPrice: 23000,
					name: "Cơm Gà Đùi Góc Tư Xối Mỡ 1",
					description: "Đùi gà tươi góc 4 xối mỡ + Cơm + dưa leo + salad + canh",
					imageUrl: "http://localhost:8080/api/files/d1d21809-2414-46b6-8d23-bfcb9942e7b5_1bca93c4686636d4fca8529d0e002012f927c6a0.png"
				}
			],
			orderStatus: {
				id: 1,
				name: "New"
			},
			cancelledAtStatus: null,
			createdAt: "2025-07-24T09:25:04",
			createdAtStr: "24 Jul 2025"
		}
	]
}

