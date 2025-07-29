$(document).ready(async function() {

	$('body > .loader').hide();
	
	$('#cart-modal .loader').show();
	// Fetch exact item price from database and compare with local carts 
	const fetchedCart = await Promise.all(carts.map(cartItem => {
		const fetchedCartItem = bookingProductService.getByBookingProductId(cartItem.id)
			.then(bookingProduct => {
				if (cartItem.price !== bookingProduct.price) {

					// Show price changed
					showOtherToast(
						{
							headerTitle: 'Price changed',
							text: `
									The product "${bookingProduct.name}" 
									has been changed price from "${cartItem.price.toLocaleString()} đ" 
									to "${bookingProduct.price.toLocaleString()} đ"`
						}
					);
				}

				// Check if the product is deleted by admin
				if (bookingProduct.isDeleted) {
					showOtherToast(
						{
							headerTitle: 'Item was deleted',
							text: `
								The product "${bookingProduct.name}" 
								has been deleted by admin
							`
						}
					);
					return undefined;
				}

				// Update cart price item
				return { ...cartItem, price: bookingProduct.price }
			})
			.catch(message => showErrorToast({ text: message, headerTitle: 'Retrieve issue' }));
		return fetchedCartItem;
	}));

	setTimeout(function() {
		$('#cart-modal .loader').hide();
	}, 2000);

	if (fetchedCart.every(cartItem => !cartItem)) {
		carts = new Array();
	} else {
		carts = fetchedCart.filter(cartItem => cartItem);
	}

	saveCartToLocalStorage(carts);

	// Connect socket
	connectWebsocket();

	// render list of cart from local storage
	renderListOfCart();

	// Init provinces into select tag
	initProvinceList();

	// Render shipping fee
	renderShippingFee();

	// Render total price
	renderTotalPrice();

	// Handle when province changed
	$('#city').on('change', function() {
		const provinceId = $(this).val(); // Get province id

		// Call api get wards by id
		wardService.getWardsByProvinceId(provinceId)
			.then(wards => {

				// Create ward options
				let html = wards.map(ward => `<option value="${ward.id}" data-shipping-fee="${ward.shippingFee}">${ward.name}</option>`)
				html.unshift('<option value="" hidden></option>')

				// Rnder wards option
				$('#ward').html(html.join(''));

			})
			.catch(message => alert(message));
	});

	// Handle when ward changed
	$('#ward').on('change', function() {
		const wardId = $(this).val(); // Get ward id

		if (!wardId)
			return;

		// Get shipping fee
		shippingFee = Number($(this).find(`option[value="${wardId}"]`).attr('data-shipping-fee'));

		// Re render shipping fee
		renderShippingFee();

		// Re render total price
		renderTotalPrice();
	});

	// Handle form submit
	$('#delivery-form').on('submit', function(e) {
		e.preventDefault();

		// Get form data
		const formData = new FormData(this);

		const formObj = Object.fromEntries(formData.entries());

		// Add booking products
		formObj.bookingProducts = carts.map(cartItem =>
		({
			bookingProductId: cartItem.id,
			quantity: cartItem.quantity
		})
		);

		$('body > .loader').show();
		// Call API create order
		orderService.createOrder(JSON.stringify(formObj))
			.then(newOrder => {
				saveOrderToLocalStorage(newOrder);
				saveCartToLocalStorage();// Reset card

				if (stompClient.connected) {
					// Create notification for admin
					stompClient.publish({
						destination: "/app/order",
						body: JSON.stringify({ orderId: newOrder.id, customerName: newOrder.name })
					});
				} else {
					console.warn("WebSocket disconnect, cannot sent order!");
				}

				showSuccessToast({ headerTilte: 'Place order successfully', text: "Order placed successfully! We're preparing your food" });

				setTimeout(function() {
					$('body > .loader').hide();
				}, 2000);
				
				setTimeout(function() {
					// Redirect to order successfully page
					window.location.replace('/order-successfully');
				}, 2500);
			})
			.catch(err => {
				const errors = err.errors;
				
				$('body .loader').hide();

				if (errors instanceof Array) {
					for (const error of errors) {
						$(`.form-control[name="${error.field}"]`).addClass('is-invalid');
						$(`.form-control[name="${error.field}"]`).siblings('.invalid-feedback').text(error.message);
					}
					showErrorToast({ text: err.message, headerTitle: 'Bad request' });
				} else {
					showErrorToast({ text: err.message, headerTitle: 'Bad request' });
				}
			});
	});

	// Handle remove error when form control (input, textarea) change
	$('.form-control').on('change', function() {
		$(this).removeClass('is-invalid');
	});

	// Handle cancel delivery then back to home page but still keep all select item in basket (Q2.3)
	$('#cancel-btn').on('click', function() {
		window.location.href = '/';
	});

	// Handle limit customer name length
	handleLimitTextInputLength({ inputId: '#name', maxLength: 60 });

	// Handle limit detail address length
	handleLimitTextInputLength({ inputId: '#detail-address', maxLength: 95 });

	// Handle limit message length
	handleLimitTextInputLength({ inputId: '#message', maxLength: 100 });
});

function renderShippingFee() {
	$('#shipping-fee').text(shippingFee.toLocaleString() + " đ")
}

// Render total price
function renderTotalPrice() {
	// Calculate total in carts
	const totalItemPrice = calculateTotalPrice(carts);

	// Calculate total with fee shipping
	const totalPrice = shippingFee + totalItemPrice;

	// Render total price
	$('#total-price').text(totalPrice.toLocaleString() + ' đ');
}

// Get provinces
async function initProvinceList() {
	provinceService.getAllProvinces()
		.then((provinces) => {
			// Create html
			let html = provinces.map(province => `<option value="${province.id}">${province.name}</option>`);
			html.unshift('<option value="" hidden></option>')

			// inner province select
			$('#city').html(html.join(''));

			// Clear ward select
			$('#ward').empty();
		})
		.catch((message) => alert(message));
}

/* Generate cart item html */
function generateCartItemHTML(data = {
	id: 1, name: "Cơm Đùi Gà Góc Tư Sốt Mắm Tỏi Chua Cay phơi phới",
	description: "Đùi gà tươi góc 4 xối mỡ + sốt mắm tỏi + Cơm + dưa leo + salad + canh",
	price: 40000,
	imageUrl: '/assets/images/exampleFood.png',
	quantity: 1
}) {

	return `
			<li class="list-view-item">
				<div class="item-image-container">
					<img class="item-image" src="${data.imageUrl}" />
				</div>
				<div class="item-info">
					<div class="info-group">
						<h4 class="item-name"> ${data.name}</h4>
						<p class="item-description">${data.description}</p>
					</div>
					<div class="info-group">
						<h3 class="item-price">${data.price.toLocaleString()} đ</h3>
						<div class="item-quantity-wrapper">
							<span class="title">Quantity: </span>
							<span class="item-quantity">${data.quantity}</span>
						</div>
					</div>
				</div>
			</li>`;
}

let carts = getCartFromLocalStorage();
let shippingFee = 0;
