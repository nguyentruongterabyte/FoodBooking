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

	handlePageinationItemClick();

});

/* Handle pagination item click */
function handlePageinationItemClick() {
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
	})
}

function generateOrderItemHTMl(data = {
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
	
}

/* Get orders */
function getOrders(
	{
		dateType = 'today',
		keyword = '',
		includeTotal = true,
		page = 1,
		size = 20,
		orderStatusIds = orderStatuses.map(orderStatus => orderStatus.id)
	}
) {
	console.log(dateType);
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

			orderObject.items = pagedResponse.items;
		}

	}).catch(message => showOtherToast({ text: message, headerTitle: 'Retrieve issues', autoClose: 10000 }));
}



/* Get and render total items */
function getAndRenderTotalOrderItems() {
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
	size: 10,
	items: []
}

