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

const LOCAL_STORAGE_CART_NAME = 'JavaWeb_nttruong_carts';

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
