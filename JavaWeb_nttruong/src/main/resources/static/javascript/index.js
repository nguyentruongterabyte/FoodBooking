
$(document).ready(function() {
	// Header height
	/*const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 408;
	*/
	// Search box height
	let activedTab = 'food-tab'

	handleTabItemClick();

	// Handle event scroll
	$(window).on('scroll', function() {
		// const searchBoxHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--search-box-height')) || 146
		const scrollY = $(window).scrollTop(); // Get scroll top postion

		if (scrollY !== 0) { // Add class scrolled
			$('header').addClass('scrolled');
			$('.searching-input-container').addClass('shrink');
		} else { // Remove class scrolled
			$('header').removeClass('scrolled');
			$('.searching-input-container').removeClass('shrink');
		}
		// push tab into header when search box was moved
		/*if (scrollY >= searchBoxHeight) {
			$('#tabs-section').addClass('scrolled');
		} else {
			$('#tabs-section').removeClass('scrolled');

		}*/
	});

	// Init list view
	renderListView({ data: foodObject.items, type: 'food' });

	// Handle navigation tab item click
	$('.navigation-tabs').on('click', '.navigation-item', function() {
		const tabId = $(this).attr('data-tab');
		if (activedTab === tabId)
			return;

		activedTab = tabId;

		switch (activedTab) {
			case 'food-tab':

				// Set search type 'food'
				$('#searching-input').attr('data-search-type', 'food').attr('placeholder', 'Find your favorite food...');
				renderListView({ data: foodObject.items, type: 'food' })
				break;
			case 'drink-tab':
				// Set search type 'drink'
				$('#searching-input').attr('data-search-type', 'drink').attr('placeholder', 'Find your favorite drink...');
				renderListView({ data: drinkObject.items, type: 'drink' })
				break;
			default:
				alert('Invalid tab');
		}

	});

	// Handle add item into cart click
	$('.list-view').on('click', '.add-item-btn', function(e) {

		e.stopPropagation();

		const itemId = Number($(this).attr('data-item-id')); // Get item id
		const itemPrice = Number($(this).attr('data-item-price'));

		// Add item into carts
		carts = [...carts, { id: itemId, quantity: 1, price: itemPrice }];

		// Add class for parrent (li tag)
		$(this).parents('.list-view-item').addClass('added');

		$(this).parents('.cart-wrapper').find('.quantity-input').val('1'); // reset input quantity
		renderCartButton();
	});


	// Handle remove item from cart button click
	$('.list-view').on('click', '.remove-item-btn', function(e) {

		e.stopPropagation();

		const itemId = Number($(this).attr('data-item-id')); // Get item id

		removeItemInCarts(itemId);
	});

	// Handle decrease quantity of item click
	$('.list-view').on('click', '.decrease-item-btn', function(e) {

		e.stopPropagation();

		const itemId = Number($(this).attr('data-item-id')); // Get item id
		// Get quantity of item
		const quantity = carts.find(cartItem => cartItem.id === itemId)?.quantity || 1;

		if (quantity === 1) // When quantity equals 1, then do nothing
			return;

		// Update quantity of item
		carts = carts.map(cartItem => cartItem.id === itemId ? { ...cartItem, quantity: quantity - 1 } : cartItem);

		// update quantity input value
		$(this).siblings('.quantity-input').val(quantity - 1);
		renderCartButton();
	});

	// Handle increase quantity of item click
	$('.list-view').on('click', '.increase-item-btn', function(e) {

		e.stopPropagation();

		const itemId = Number($(this).attr('data-item-id')); // Get item id
		// Get quantity of item
		const quantity = carts.find(cartItem => cartItem.id === itemId)?.quantity || 1;


		if (quantity === MAX_ORDER_PER_ITEM) // When quantity equals MAX_ORDER_PER_ITEM, then do nothing
			return;

		// Update quantity of item
		carts = carts.map(cartItem => cartItem.id === itemId ? { ...cartItem, quantity: quantity + 1 } : cartItem);

		// update quantity input value
		$(this).siblings('.quantity-input').val(quantity + 1);
		renderCartButton();
	});

	$('.list-view').on('click', '.quantity-input', function(e) {
		e.stopPropagation();
	})

	// Handle quantity input blur
	$('.list-view').on('blur', '.quantity-input', function(e) {

		e.stopPropagation();

		const itemId = Number($(this).attr('data-item-id')); // Get item id

		if (!$(this).val()) {// If user blur and nothing in input
			//Then delete the item from carts
			removeItemInCarts(itemId);
		}


		// Get quantity of input
		let quantity = Number($(this).val());


		// Allowed less than max item per order
		if (quantity > MAX_ORDER_PER_ITEM) {
			quantity = MAX_ORDER_PER_ITEM;
			$(this).val(MAX_ORDER_PER_ITEM);
		}

		// Allow more than or equals 1
		if (quantity < 1) {
			quantity = 1;
			$(this).val(1);
		}

		// Return when nothing to changes
		if (quantity === carts.find(cartItem => cartItem.id === itemId)?.quantity)
			return;

		// update carts
		carts = carts.map(cartItem => cartItem.id === itemId ? { ...cartItem, quantity: quantity } : cartItem);
		renderCartButton();
	});

	// Handle item (food, drink) click
	$('.list-view').on('click', '.list-view-item', function() {

		const itemId = Number($(this).attr('data-item-id')); // Get item id

		// Find the item
		const item = foodObject.items.find(food => food.id === itemId) || drinkObject.items.find(drink => drink.id === itemId);

		if (item !== null) {
			$('#show-detail-item-btn').click();
			renderDetailItem(item);
		}
	});
});

const MAX_ORDER_PER_ITEM = 3;

/* Render detail item in detail item modal */
function renderDetailItem(data = {
	id: 1, name: "Cơm Đùi Gà Góc Tư Sốt Mắm Tỏi Chua Cay phơi phới",
	description: "Đùi gà tươi góc 4 xối mỡ + sốt mắm tỏi + Cơm + dưa leo + salad + canh",
	price: 40000,
	imageUrl: '/assets/images/exampleFood.png',
}) {

	// Set quantity to input tag
	const itemQuantity = carts.find(cartItem => cartItem.id === data.id)?.quantity || 1;
	$('#item-detail-quantity').attr('data-item-id', data.id).val(itemQuantity);

	// Render button add to cart
	const totalItemPrice = data.price * itemQuantity;
	$('#add-cart-btn').text(`Add to Basket - ${totalItemPrice.toLocaleString()} đ`);

	// Render detailItem
	const detailItemHtml = `
				<!-- Detail view -->
				<div class="list-view-item">
					<div class="item-image-container">
						<img class="item-image" src="${data.imageUrl}" />
					</div>
					<div class="item-info">
						<div class="info-group">
							<h4 class="item-name">${data.name}
							</h4>
							<p class="item-description">
								${data.description}
							</p>
						</div>
						<h3 class="item-price">${data.price.toLocaleString()} đ</h3>
					</div>
				</div>`;
				
	$('#detail-item .modal-body').html(detailItemHtml);
}

/* Render List View */
function renderListView({ data = [{
	id: 1,
	name: "S-Green Tea Macciato",
	description: "Lục Trà Macchiato - Size nh #Dòng thức uống đặc trưng, không thêm topping, không dùng ống hút nhựa",
	price: 60000,
	imageUrl: '/assets/images/exampleDrink.png',
	type: 'food'
}], type = 'food' }) {
	switch (type) {
		case 'food':
			$('#food-tab .list-view').empty();
			$('#food-tab .list-view').html(
				data.map(item => generateItemHTML(item)).join('')
			);
			break;
		case 'drink':
			$('#drink-tab .list-view').empty();
			$('#drink-tab .list-view').html(
				data.map(item => generateItemHTML(item)).join('')
			);
			break;
		default:
			alert('Invalid type!');
	}
}

// Remove item in carts
function removeItemInCarts(itemId) {
	// Remove item from carts
	carts = carts.filter(cartItem => cartItem.id !== itemId);

	// Remove class for parrent (li tag)
	$(`.list-view-item[data-item-id="${itemId}"]`).removeClass('added');
	$(`.quantity-input[data-item-id="${itemId}"]`).val('1'); // reset input quantity
	renderCartButton();
}

/* Render Cart Button */
function renderCartButton() {
	if (carts.length === 0) { // remove class has items when carts is empty
		$('.cart-btn-wrapper').removeClass('has-items');
		return;
	}

	$('.cart-btn-wrapper').addClass('has-items');

	const totalPrice = calculateTotalPrice(carts);
	const totalItems = calculateTotalItems(carts);

	// Render total items
	$('.cart-btn-wrapper .badge').text(totalItems);

	// Render total price
	$('#total-price').text(totalPrice.toLocaleString() + "đ");

}

/* Calculate total price of carts */
function calculateTotalPrice(carts = [{ id: 1, quantity: 3, price: 30000 }]) {
	const totalPrice = carts.reduce((prev, next) => prev + (next.quantity * next.price), 0);
	return totalPrice;
}

/* Calculate total item of carts */
function calculateTotalItems(carts = [{ id: 1, quantity: 3, price: 30000 }]) {
	const totalItems = carts.reduce((prev, next) => prev + next.quantity, 0);
	return totalItems;
}

/* Generate Item HTML */
function generateItemHTML(data = {
	id: 1,
	name: "Cơm Đùi Gà Góc Tư Sốt Mắm Tỏi Chua Cay phơi phới",
	description: "Đùi gà tươi góc 4 xối mỡ + sốt mắm tỏi + Cơm + dưa leo + salad + canh",
	price: 40000,
	imageUrl: '/assets/images/exampleFood.png',
	type: 'food'
}) {

	// Find item in carts
	const existsCart = carts.find(cardItem => cardItem.id === data.id && cardItem.quantity > 0);

	return `
			<li class="list-view-item ${existsCart ? 'added' : ''}" data-item-id="${data.id}">
				<div class="item-image-container">
					<img class="item-image" src="/assets/images/exampleFood.png" />
				</div>
				<div class="item-info">
					<h4 class="item-name">${data.name}</h4>
					<p class="item-description">${data.description}</p>
					<h3 class="item-price">${data.price.toLocaleString()} đ</h3>
				</div>
				<div class="cart-wrapper">
					<button class="add-item-btn" data-item-id="${data.id}" data-item-price="${data.price}"><i class="fa-solid fa-plus"></i></button>
					<div class="cart-group-btn">
						<button class="remove-item-btn" data-item-id="${data.id}"><i class="fa-solid fa-trash"></i></button>
						<div class="cart-action-wrapper">
							<button class="decrease-item-btn" data-item-id="${data.id}"><i class="fa-solid fa-minus"></i></button>
							<input class="quantity-input" type="number" min="1" max="${MAX_ORDER_PER_ITEM}" value="${existsCart ? existsCart.quantity : 1}" data-item-id="${data.id}"/>
							<button class="increase-item-btn" data-item-id="${data.id}"><i class="fa-solid fa-plus"></i></button>
						</div>
					</div>
				</div>
			</li>`;
}

let foodObject = {
	totalItems: 27,
	size: 10,
	totalPages: 3,
	currentPage: 1,
	items: [
		{
			id: 1,
			name: "Cơm Đùi Gà Góc Tư Sốt Mắm Tỏi Chua Cay phơi phới",
			description: "Đùi gà tươi góc 4 xối mỡ + sốt mắm tỏi + Cơm + dưa leo + salad + canh",
			price: 40000,
			imageUrl: '/assets/images/exampleFood.png',
			type: 'food'
		},
		{
			id: 10,
			name: "Cơm Đùi Gà Góc Tư Sốt Mắm Tỏi Chua Cay phơi phới",
			description: "Đùi gà tươi góc 4 xối mỡ + sốt mắm tỏi + Cơm + dưa leo + salad + canh",
			price: 40000,
			imageUrl: '/assets/images/exampleFood.png',
			type: 'food'
		},
		{
			id: 11,
			name: "Cơm Đùi Gà Góc Tư Sốt Mắm Tỏi Chua Cay phơi phới",
			description: "Đùi gà tươi góc 4 xối mỡ + sốt mắm tỏi + Cơm + dưa leo + salad + canh",
			price: 40000,
			imageUrl: '/assets/images/exampleFood.png',
			type: 'food'
		},
		{
			id: 14,
			name: "Cơm Đùi Gà Góc Tư Sốt Mắm Tỏi Chua Cay phơi phới",
			description: "Đùi gà tươi góc 4 xối mỡ + sốt mắm tỏi + Cơm + dưa leo + salad + canh",
			price: 40000,
			imageUrl: '/assets/images/exampleFood.png',
			type: 'food'
		},
		{
			id: 17,
			name: "Cơm Đùi Gà Góc Tư Sốt Mắm Tỏi Chua Cay phơi phới",
			description: "Đùi gà tươi góc 4 xối mỡ + sốt mắm tỏi + Cơm + dưa leo + salad + canh",
			price: 40000,
			imageUrl: '/assets/images/exampleFood.png',
			type: 'food'
		},
		{
			id: 19,
			name: "Cơm Đùi Gà Góc Tư Sốt Mắm Tỏi Chua Cay phơi phới",
			description: "Đùi gà tươi góc 4 xối mỡ + sốt mắm tỏi + Cơm + dưa leo + salad + canh",
			price: 40000,
			imageUrl: '/assets/images/exampleFood.png',
			type: 'food'
		}
	]
};

let drinkObject = {
	size: 11,
	totalPages: 2,
	currentPage: 2,
	items: [
		{
			id: 5,
			name: "S-Green Tea Macciato",
			description: "Lục Trà Macchiato - Size nh #Dòng thức uống đặc trưng, không thêm topping, không dùng ống hút nhựa",
			price: 60000,
			imageUrl: '/assets/images/exampleDrink.png',
			type: 'drink'
		}
	]
}

let carts = [
	//{ id: 1, quantity: 2, price: 40000 }
];
