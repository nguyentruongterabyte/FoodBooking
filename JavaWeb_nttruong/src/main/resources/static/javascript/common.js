/* Order statuses constaints*/
const ORDER_STATUSES = {
	NEW: 1,
	SHIPPING: 2,
	CANCELLED: 3,
	COMPLETED: 4
};

// Toggle skeleton
function hideSkeletonContainer() {
	$('.skeleton-container').hide();
}

// Handle when tab item click
function handleTabItemClick(navigationId = '') {

	const navigationSelector = `${!!navigationId ? `${navigationId}` : ''}.navigation-tabs`;

	$(navigationSelector).on('click', '.navigation-item', function() {
		// remove all active on other navigation item
		const navItemSelector = `${!!navigationId ? `${navigationId} ` : ''}.navigation-item`
		$(navItemSelector).removeClass('active');

		// Add active to current item
		$(this).addClass('active');

		const tabId = $(this).attr('data-tab');

		if (tabId && $(`#${tabId}`)) {

			// Remove class show in other tab contents
			const tabSelector = !!navigationId
				? `.tab-contents[data-navigation-id="${navigationId}"]>.tab-content-item`
				: '.tab-content-item';

			$(tabSelector).removeClass('show');

			// Add class show to current tab
			$(`#${tabId}`).addClass('show');
		}
	});
}

const LOCAL_STORAGE_CART_NAME = 'JavaWeb_nttruong_carts';
const LOCAL_STORAGE_ORDER_NAME = 'JavaWeb_nttruong_order';

/* Save order to local storage  */
function saveOrderToLocalStorage(order = {
	id: 5,
	name: "Nguyễn Thái Trưởng",
	phone: "0948915051",
	detailAddress: "278 La Xuan Oai, Tang Nhon Phu A",
	message: "Khong Lay Ong Hut Nha",
	shippingFee: 29000,
	totalPrice: 51000,
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
			bookingProductId: 25,
			quantity: 1,
			itemPrice: 51000,
			name: "S-Soursop Black Tea",
			description: "Hồng Trà Mãng Cầu-Size Nhỏ"
		}
	],
	orderStatus: {
		id: 1,
		name: "New"
	},
	createdAt: "2025-07-22T17:09:33",
	createdAtStr: "22 Jul 2025"
}) {
	localStorage.setItem(LOCAL_STORAGE_ORDER_NAME, JSON.stringify(order));
}

/* Get order from local storage */
function getOrderFromLocalStorage() {
	const order = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDER_NAME)) || null;
	return order;
}

/* Save cart to local storage */
function saveCartToLocalStorage(carts = []) {
	localStorage.setItem(LOCAL_STORAGE_CART_NAME, JSON.stringify(carts));
}

/* Get cart from local storage */
function getCartFromLocalStorage() {
	const carts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CART_NAME)) || [];
	return carts;
}

/* Render total price of cart */
function renderTotalPriceOfCart() {
	const totalPrice = calculateTotalPrice(carts);
	$('#cart-total-price').text(totalPrice.toLocaleString() + " đ");

	// disable place order button when total equals 0
	if (carts.length === 0)
		$('#place-order-btn').prop('disabled', true).css('cursor', 'not-allowed');
	else
		$('#place-order-btn').prop('disabled', false).css('cursor', 'pointer');
}

/* Calculate total price of carts */
function calculateTotalPrice(carts = [{ id: 1, quantity: 3, price: 30000 }]) {
	const totalPrice = carts.reduce((prev, next) => prev + (next.quantity * next.price), 0);
	return totalPrice;
}

/* Render cart list */
function renderListOfCart() {
	/* Generate html of list */
	const html = carts.map(cartItem => generateCartItemHTML(cartItem)).join('');

	/* Render into cart modal */
	$('#cart-modal .list').empty();
	$('#cart-modal .list').html(html);

	renderTotalPriceOfCart();
}


/* Show toast notification */
function showToastNotification({
	text = 'A system error occurred. Please try again later',
	autoClose = 6000,
	position = 'top-right',
	headerStyle = {
		background: '#fff6da',
	},
	icon = '<i class="fa-solid fa-gear"></i>',
	headerIconStyle = {
		color: '#ffc107'
	},
	headerTitle = 'Add item to cart',
	style = {
		background: '#ffc107',
		color: '#fff',
		transition: 'all 350ms linear',
	},
	closeButtonColor = '#000',
	progressBarColor = '#FFD700',
}
) {
	new LocalNotification({
		text,
		autoClose,
		position,
		headerStyle,
		icon,
		headerIconStyle,
		headerTitle,
		style,
		closeButtonColor,
		progressBarColor,
	});
}

/* Show success toast notification */
function showSuccessToast({ text = 'Item added to your cart', headerTitle = 'Add item to cart', autoClose }) {
	showToastNotification({
		text,
		autoClose,
		position: 'top-right',
		headerStyle: {
			background: '#ffffffd9',
		},
		icon: '<i class="fa-regular fa-circle-check"></i>',
		headerIconStyle: {
			color: '#17ae30'
		},
		headerTitle,
		style: {
			background: '#17ae30',
			color: '#fff',
			transition: 'all 350ms linear',
		},
		closeButtonColor: '#000',
		progressBarColor: '#FFD700',
	});
}

/* Show error toast notification */
function showErrorToast({ text = 'Order placement failed. Please try again', headerTitle = 'Order placement failed', autoClose }) {
	showToastNotification({
		text,
		autoClose,
		position: 'top-right',
		headerStyle: {
			background: '#fbdce3',
		},
		icon: '<i class="fa-solid fa-circle-exclamation"></i>',
		headerIconStyle: {
			color: '#e31844'
		},
		headerTitle,
		style: {
			background: '#e31844',
			color: '#fff',
			transition: 'all 350ms linear',
		},
		closeButtonColor: '#000',
		progressBarColor: '#FFD700',
	});
}

/* Show other toast notification */
function showOtherToast({ text, headerTitle, autoClose }) {
	showToastNotification({
		text,
		autoClose: autoClose,
		position: 'top-right',
		headerStyle: {
			background: '#fff6da',
		},
		icon: '<i class="fa-solid fa-gear"></i>',
		headerIconStyle: {
			color: '#ffc107'
		},
		headerTitle,
		style: {
			background: '#ffc107',
			color: '#fff',
			transition: 'all 350ms linear',
		},
		closeButtonColor: '#000',
		progressBarColor: '#FFD700',
	});
}

// Get short pagination function
function getPagination({ currentPage, totalPages, delta = 2 }) {
	const range = [];
	const rangeWithDots = [];
	let l;

	// Create short pagination
	// Example, current page: 4; totalPages: 10; delta: 1
	// Result: [1, 3, 4, 5, 10]
	for (let i = 1; i <= totalPages; i++) {
		if (
			i === 1 ||
			i === totalPages ||
			(i >= currentPage - delta && i <= currentPage + delta)
		) {
			range.push(i);
		}
	}

	// delta = 1; [1, 3, 4, 5, 10] => [1, 2, 3, 4, 5, '...', 10]
	// delta = 1; [1, 4, 5, 6, 10] => [1, '...', 4, 5, 6, '...', 10]
	for (let i of range) {
		if (l) {
			if (i - l === 2) {
				// if distance between page is exactly equals 2
				// push directly page (not push '...')
				rangeWithDots.push(l + 1);
			} else if (i - l !== 1) {
				// push '...'
				rangeWithDots.push('...');
			}
		}

		rangeWithDots.push(i);
		l = i;
	}

	return rangeWithDots;
}

// Render pagination
function renderPaging({ root = '#pagination', pagination = [1, '...', 7, 8, 9, '...', 45], size = 2, currentPage = 1 }) {
	$(root).html(
		`
			<!-- Previous page -->
			<li class="page-item prev-page">
				<button class="page-link" aria-label="Previous">
					<span aria-hidden="true">&laquo;</span>
					<span class="sr-only">Previous</span>
				</button>
			</li>

			<!-- Pagination items START -->
			${pagination.map(pageItem =>
			`
					<li class="page-item page-item-number ${currentPage === pageItem ? 'active' : ''}" data-page="${pageItem}"><a class="page-link" data-page="${pageItem}" ${pageItem !== '...' ? `href="#page=${pageItem}&size=${size}"` : ''}>${pageItem}</a></li>
				`).join('')}
			<!-- Pagination items END -->

			<!-- Next page -->
			<li class="page-item next-page">
				<button class="page-link" aria-label="Next">
					<span aria-hidden="true">&raquo;</span>
					<span class="sr-only">Next</span>
				</button>
			</li>
		`
	)
}

// Handle searching input on search
function handleSearchingInputOnSearch(root = "#searching-input", callback = () => { }) {
	$(root).on('keydown', function(e) {
		if (e.key === 'Enter') {
			e.preventDefault(); // Prevent default

			const keyword = $(this).val(); // Get keyword from input
			if (keyword)
				callback(keyword);
		}

	});
}

// Handle limit length text input
function handleLimitTextInputLength({inputId = '#name', maxLength = 100}) {
	$(inputId).on('input', function() {
		const value = $(this).val();
		const valueLength = value.length;
		if (valueLength >= maxLength) {
			$(this).val(value.slice(0, maxLength));
		}
		
		$(this).siblings('.string-length').text(`${$(this).val().length}/${maxLength}`);
	});
}

