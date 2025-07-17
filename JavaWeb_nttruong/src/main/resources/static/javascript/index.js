
$(document).ready(function() {

	if (foodObject.totalItems === null) {
		getAndRenderTotalItems('food');
	}

	if (drinkObject.totalItems === null) {
		getAndRenderTotalItems('drink');
	}
	// Header height
	/*const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 408;
	*/
	// Search box height
	let activedTab = 'food-tab'

	// handle tab item click
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

		// Find the item from food/drink list
		const item =
			foodObject.items.find(food => food.id === itemId) || drinkObject.items.find(drink => drink.id === itemId);

		// Add item into carts
		carts = [...carts, { ...item, quantity: 1 }];

		// Add class for parrent (li tag)
		$(this).parents('.list-view-item').addClass('added');

		$(this).parents('.cart-wrapper').find('.quantity-input').val('1'); // reset input quantity
		renderCartButton();

		showSuccessToast({ text: 'Item added to your cart', headerTitle: 'Add item to cart' });
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


	// Handle decrease button in detail item click 
	$('#detail-item-modal .decrease-item-btn').on('click', function() {
		// Get quantity of quantity input
		const quantity = Number($(this).siblings('.quantity-input').val());

		// User do enter nothing (quantity will be equals 0)
		if (quantity === 0 || quantity <= 1) {// When quantity equals 1, then do nothing			
			$(this).siblings('.quantity-input').val(1); // reset 1
			return;
		}
		// Set input decrease 1 unit
		$(this).siblings('.quantity-input').val(quantity - 1);
	});

	// Handle increase button in detail item click
	$('#detail-item-modal .increase-item-btn').on('click', function() {
		// Get quantity of quantity input
		const quantity = Number($(this).siblings('.quantity-input').val());

		// User do enter nothing (quantity will be equals 0)
		if (quantity === 0) {
			$(this).siblings('.quantity-input').val(1);
		}

		// When user enter max quantity of item per order 
		// Set the quantity input equals MAX_ORDER_PER_ITEM
		if (quantity >= MAX_ORDER_PER_ITEM) {
			$(this).siblings('.quantity-input').val(MAX_ORDER_PER_ITEM);
			return;
		}

		// Set input increase 1 unit
		$(this).siblings('.quantity-input').val(quantity + 1);
	});

	// Handle quantity input in detail item blur
	$('#detail-item-modal .quantity-input').on('blur', function() {
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
	});

	// Handle add to cart in detail item click
	$('#add-cart-btn').on('click', function() {
		const itemId = Number($(this).attr('data-item-id')); // Get item id

		// Get value of quantity input
		const quantity = Number($('#item-detail-quantity').val());

		if (quantity === 0)
			return;

		// If item has already in cart
		// Find and replace quantity
		if (carts.some(cartItem => cartItem.id === itemId)) {
			carts = carts.map(cartItem => cartItem.id === itemId ? { ...cartItem, quantity } : cartItem);


		} else { // If item has not existed yet, then add to cart
			// Find item in drink or food list
			const item =
				foodObject.items.find(food => food.id === itemId) || drinkObject.items.find(drink => drink.id === itemId);
			carts = [...carts, { ...item, quantity }];

		}

		showSuccessToast({ text: 'Item added to your cart', headerTitle: 'Add item to cart' });

		// Add class for parrent (li tag)
		$(`.list-view-item[data-item-id="${itemId}"]`).addClass('added');

		$(`.list-view .quantity-input[data-item-id="${itemId}"]`).val(quantity); // set input quantity

		// re-render cart button
		renderCartButton();

		// Close detail modal
		$('#close-detail-item-btn').click();

	});

	// Handle show cart when cart button click
	$('#cart-btn').on('click', function() {
		$('#show-cart-btn').click();
		renderListOfCart();
	});

	// Handle when user click on remove item in cart modal
	$('#cart-modal .list').on('click', '.remove-item-btn', function() {
		const itemId = Number($(this).attr('data-item-id')); // Get item id

		// Remove item in cart
		carts = carts.filter(cartItem => cartItem.id !== itemId);

		// Remove element in DOM
		$(`#cart-modal .list-view-item[data-item-id="${itemId}"]`).fadeOut('slow', () => $(this).remove());

		/* Re-render */
		renderTotalPriceOfCart();
		updateListViewItemWhenCartChanged(itemId);
		renderCartButton();
	});

	// Handle decrease button in cart modal click 
	$('#cart-modal .list').on('click', '.decrease-item-btn', function() {
		// Get quantity of quantity input
		const quantity = Number($(this).siblings('.quantity-input').val());


		// User do enter nothing (quantity will be equals 0)
		if (quantity === 0 || quantity <= 1) {// When quantity equals 1, then do nothing			
			$(this).siblings('.quantity-input').val(1); // reset 1
			return;
		}

		const itemId = Number($(this).attr('data-item-id')); // Get item id

		const newQuantity = quantity - 1; // New quantity

		// Update cart
		carts = carts.map(cartItem => cartItem.id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem);

		// Set input decrease 1 unit
		$(this).siblings('.quantity-input').val(newQuantity);

		// re-render total price of this item
		const foundItem = carts.find(cartItem => cartItem.id === itemId);
		const totalPriceOfItem = newQuantity * foundItem.price;
		$(this).parents('.info-group').find('.item-total-price').text(totalPriceOfItem.toLocaleString() + " đ");

		// re-render cart button
		// re-render total price of cart
		// re-render list view
		renderCartButton();
		updateListViewItemWhenCartChanged(itemId);
		renderTotalPriceOfCart();

	});

	// Handle increase button in cart modal click
	$('#cart-modal .list').on('click', '.increase-item-btn', function() {
		// Get quantity of quantity input
		const quantity = Number($(this).siblings('.quantity-input').val());

		// User do enter nothing (quantity will be equals 0)
		if (quantity === 0) {
			$(this).siblings('.quantity-input').val(1);
		}

		// When user enter max quantity of item per order 
		// Set the quantity input equals MAX_ORDER_PER_ITEM
		if (quantity >= MAX_ORDER_PER_ITEM) {
			$(this).siblings('.quantity-input').val(MAX_ORDER_PER_ITEM);
			return;
		}

		const itemId = Number($(this).attr('data-item-id')); // Get item id

		const newQuantity = quantity + 1; // New quantity

		// Update cart
		carts = carts.map(cartItem => cartItem.id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem);


		// Set input increase 1 unit
		$(this).siblings('.quantity-input').val(newQuantity);

		// re-render total price of this item
		const foundItem = carts.find(cartItem => cartItem.id === itemId);
		const totalPriceOfItem = newQuantity * foundItem.price;
		$(this).parents('.info-group').find('.item-total-price').text(totalPriceOfItem.toLocaleString() + " đ");

		// re-render cart button
		// re-render total price of cart
		// re-render list view
		renderCartButton();
		updateListViewItemWhenCartChanged(itemId);
		renderTotalPriceOfCart();
	});

	// Handle quantity input in cart modal blur
	$('#cart-modal .list').on('blur', '.quantity-input', function() {

		const itemId = Number($(this).attr('data-item-id')); // Get item id

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

		// Update carts
		carts.map(cartItem => cartItem.id === itemId ? { ...cartItem, quantity } : cartItem);

		// re-render cart button
		// re-render total price of cart
		// re-render list view
		renderCartButton();
		updateListViewItemWhenCartChanged(itemId);
		renderTotalPriceOfCart();
	});


	// Handle place order button click
	$('#place-order-btn').on('click', function() {
		saveCartToLocalStorage(carts);
	});

	// Handle food size selector change
	$('#food__size-selector').on('change', function() {
		const size = Number($(this).val());
		
		// If size is greater than total items, then do nothing
		if (size >= foodObject.totalItems)
			return;
		
		foodObject.size = size;

		// Get and render first page booking products
		getBookingProducts(
			{
				keyword: getKeywordFromSearchingInput(),
				type: 'food',
				page: 1,
				size: foodObject.size,
				includeTotal: true,
				isDeleted: false
			}
		);
	});

	// Handle drink size selector change
	$('#drink__size-selector').on('change', function() {
		const size = Number($(this).val());
		
		// If size is greater than total items, then do nothing
		if (size >= drinkObject.totalItems)
			return;
		
		drinkObject.size = size;

		// Get and render first page booking products
		getBookingProducts(
			{
				keyword: getKeywordFromSearchingInput(),
				type: 'drink',
				page: 1,
				size: drinkObject.size,
				includeTotal: true,
				isDeleted: false
			}
		);
	});


	// Handle pagination item click
	handlePaginationItemClick('#drink__pagination-nav .pagination', 'drink');
	handlePaginationItemClick('#food__pagination-nav .pagination', 'food');

	// Handle previous button and next button on pagination click
	handlePrevNextPaginationClick('#drink__pagination-nav .pagination', 'drink');
	handlePrevNextPaginationClick('#food__pagination-nav .pagination', 'food');

	// Handle searching input on search
	handleSearchingInputOnSearch('#searching-input', function() {

		const searchType = $('#searching-input').attr('data-search-type') || 'food';
		getAndRenderTotalItems(searchType);

	});

	// Handle sort by price change
	$('#sort-by-price-btn').on('change', function() {
		getBookingProducts(
			{
				includeTotal: false,
				isDeleted: false,
				keyword: getKeywordFromSearchingInput(),
				page: foodObject.currentPage,
				size: foodObject.size,
				type: 'food'
			}
		);

		getBookingProducts(
			{
				includeTotal: false,
				isDeleted: false,
				keyword: getKeywordFromSearchingInput(),
				page: drinkObject.currentPage,
				size: drinkObject.size,
				type: 'drink'
			}
		);
	});
});

const MAX_ORDER_PER_ITEM = 3;

/* Handle previous button and next button on pagination click */
function handlePrevNextPaginationClick(root = '#drink__pagination-nav .pagination', type = 'drink') {
	switch (type) {
		case 'food':
			// previous page button click
			$(root).on('click', '.prev-page', function() {
				let currentPage = foodObject.currentPage; // Get current page

				// If current page is the first page, then do nothing
				if (currentPage <= 1)
					return;

				currentPage--; // Decrease 1 unit
				foodObject.currentPage = currentPage; // set current page food object

				// remove active class
				$(root).find('.page-item-number').removeClass('active');
				$(root).find(`.page-item-number[data-page="${currentPage}"]`).addClass('active');
				// Get and render item
				getBookingProducts(
					{
						keyword: getKeywordFromSearchingInput(),
						type,
						page: foodObject.currentPage,
						size: foodObject.size,
						includeTotal: false,
						isDeleted: null
					}
				);
			});

			// Next page button click
			$(root).on('click', '.next-page', function() {
				let currentPage = foodObject.currentPage; // Get current page

				// If current page is the last page, then do nothing
				if (currentPage >= foodObject.totalPages)
					return;

				currentPage++; // Increase 1 unit
				foodObject.currentPage = currentPage; // set current page food object
				// remove active class
				$(root).find('.page-item-number').removeClass('active');
				$(root).find(`.page-item-number[data-page="${currentPage}"]`).addClass('active');

				// Get and render item
				getBookingProducts(
					{
						keyword: getKeywordFromSearchingInput(),
						type,
						page: foodObject.currentPage,
						size: foodObject.size,
						includeTotal: false,
						isDeleted: null
					}
				);
			});
			break;
		case 'drink':
			// previous page button click
			$(root).on('click', '.prev-page', function() {
				let currentPage = drinkObject.currentPage; // Get current page

				// If current page is the first page, then do nothing
				if (currentPage <= 1)
					return;

				currentPage--; // Decrease 1 unit
				drinkObject.currentPage = currentPage; // set current page drink object
				// remove active class
				$(root).find('.page-item-number').removeClass('active');
				$(root).find(`.page-item-number[data-page="${currentPage}"]`).addClass('active');

				// Get and render item
				getBookingProducts(
					{
						keyword: getKeywordFromSearchingInput(),
						type,
						page: drinkObject.currentPage,
						size: drinkObject.size,
						includeTotal: false,
						isDeleted: null
					}
				);
			});

			// Next page button click
			$(root).on('click', '.next-page', function() {
				let currentPage = drinkObject.currentPage; // Get current page

				// If current page is the last page, then do nothing
				if (currentPage >= drinkObject.totalPages)
					return;

				currentPage++; // Increase 1 unit
				drinkObject.currentPage = currentPage; // set current page drink object
				// remove active class
				$(root).find('.page-item-number').removeClass('active');
				$(root).find(`.page-item-number[data-page="${currentPage}"]`).addClass('active');

				// Get and render item
				getBookingProducts(
					{
						keyword: getKeywordFromSearchingInput(),
						type,
						page: drinkObject.currentPage,
						size: drinkObject.size,
						includeTotal: false,
						isDeleted: null
					}
				);
			});
			break;
		default:
			alert('Invalid type');
	}
}

/* Handle pagination item click */
function handlePaginationItemClick(root = '#drink__pagination-nav .pagination', type = 'drink') {
	$(root).on('click', '.page-item-number', function() {

		// If click '...' item or click on active page, return function
		if ($(this).text() === '...' || $(this).hasClass('active'))
			return;

		// Remove active in other item
		$(root).find('.page-item-number').removeClass('active');

		// Add active class in current item
		$(this).addClass('active');

		const page = Number($(this).text()); // Get item page number

		// Get 
		switch (type) {
			case 'food':
				foodObject.currentPage = page;

				// Re-render paging
				customRenderPaging(
					{
						root: '#food__pagination-nav .pagination',
						currentPage: page,
						size: foodObject.size,
						totalPages: foodObject.totalPages
					});
				getBookingProducts(
					{
						keyword: getKeywordFromSearchingInput(),
						type,
						page: foodObject.currentPage,
						size: foodObject.size,
						includeTotal: false,
						inisDeleted: null
					}
				);
				break;
			case 'drink':
				drinkObject.currentPage = page;
				// Re-render paging
				customRenderPaging(
					{
						root: '#food__pagination-nav .pagination',
						currentPage: page,
						size: drinkObject.size,
						totalPages: drinkObject.totalPages
					});
				getBookingProducts(
					{
						keyword: getKeywordFromSearchingInput(),
						type,
						page: drinkObject.currentPage,
						size: drinkObject.size,
						includeTotal: false,
						inisDeleted: null
					}
				);
				break;
			default:
				alert('Invalid type.')
		}
	});
}


/* Get keyword from searching input */
function getKeywordFromSearchingInput(root = '#searching-input') {
	return $(root).val() || '';
}

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

/* Is price DESC */
function isPriceDESC() {
	return $('#sort-by-price-btn').val() === 'DESC';
}

/* Get booking product */
function getBookingProducts(
	{
		keyword = '',
		type = 'food',
		page = 1,
		size = 10,
		includeTotal = false,
		isDeleted = false
	}
) {
	bookingProductService.getBookingProductsPage(
		{ keyword, type, page, size, includeTotal, isDeleted, priceDESC: isPriceDESC() }
	)
		.then(pagedResponse => {
			// Toggle skeleton
			setTimeout(() => {
				hideSkeletonContainer(false);
			}, 3000)
			switch (type) {
				case 'food': {
					if (pagedResponse.totalPages) {
						foodObject.totalPages = pagedResponse.totalPages;
						foodObject.currentPage = pagedResponse.page;
						// Render pagination
						customRenderPaging(
							{
								root: '#food__pagination-nav .pagination',
								size: foodObject.size,
								currentPage: foodObject.currentPage,
								totalPages: foodObject.totalPages
							}
						);
					}
					foodObject.items = pagedResponse.items;
					// Render list view
					renderListView({ data: foodObject.items, type: 'food' });

					break;
				}
				case 'drink': {

					if (pagedResponse.totalPages) {
						drinkObject.totalPages = pagedResponse.totalPages;
						drinkObject.currentPage = pagedResponse.page;
						// Render pagination
						customRenderPaging(
							{
								root: '#drink__pagination-nav .pagination',
								size: drinkObject.size,
								currentPage: drinkObject.currentPage,
								totalPages: drinkObject.totalPages
							}
						);

						// Render list view
						renderListView({ data: drinkObject.items, type: 'drink' });


					}
					drinkObject.items = pagedResponse.items;
					break;
				}
				default:
					alert('Invalid type');
			}
			renderListView({ data: pagedResponse.items, type });

		})
		.catch(message => showOtherToast({ text: message, headerTitle: 'Retrieve issues', autoClose: 10000 }))
}


/* Get and render total items */
function getAndRenderTotalItems(type = 'food') {
	switch (type) {
		case 'food': {
			// Init food object
			bookingProductService.getTotalItems(
				{
					keyword: getKeywordFromSearchingInput('#searching-input'),
					type: 'food',
					isDeleted: false
				})
				.then(totalItems => {
					foodObject.totalItems = totalItems;
					// Render total items
					$('#food__total-items').text(`Total ${totalItems} items`);
					if (totalItems > 0) {
						$('#food__pagination-nav .pagination').show();
						// Render first page items
						getBookingProducts(
							{
								keyword: getKeywordFromSearchingInput('#searching-input'),
								type: 'food',
								page: foodObject.currentPage,
								size: foodObject.size,
								includeTotal: true,
								isDeleted: false
							}
						);
					} else {
						$('#food__pagination-nav .pagination').hide();
						showOtherToast({ text: 'There is nothing to show!', headerTitle: 'Empty list' });
					}
				})
				.catch(message => showOtherToast({ text: message, headerTitle: 'Get total food items failed' }));
			break;
		}
		case 'drink': {
			// Init drink object
			bookingProductService.getTotalItems(
				{
					keyword: getKeywordFromSearchingInput(),
					type: 'drink',
					isDeleted: false
				})
				.then(totalItems => {
					drinkObject.totalItems = totalItems;
					// Render total items
					$('#drink__total-items').text(`Total ${totalItems} items`);

					if (totalItems > 0) {
						$('#drink__pagination-nav .pagination').show();
						// Render first page items
						getBookingProducts({
							keyword: getKeywordFromSearchingInput(),
							type: 'drink',
							page: drinkObject.currentPage,
							size: drinkObject.size,
							includeTotal: true,
							isDeleted: false
						});
					} else {
						$('#drink__pagination-nav .pagination').hide();
						showOtherToast({ text: 'There is nothing to show!', headerTitle: 'Empty list' });

					}
				})
				.catch(message => showOtherToast({ text: message, headerTitle: 'Get total drink items failed' }));
			break;
		}
		default:
			alert('Invalid total items type');
	}
}

/* Generate cart item html */
function generateCartItemHTML(data = {
	id: 1, name: "Cơm Đùi Gà Góc Tư Sốt Mắm Tỏi Chua Cay phơi phới",
	description: "Đùi gà tươi góc 4 xối mỡ + sốt mắm tỏi + Cơm + dưa leo + salad + canh",
	price: 40000,
	imageUrl: '/assets/images/exampleFood.png',
	quantity: 1
}) {
	const totalItemPrice = data.price * data.quantity;

	return `
			<li class="list-view-item" data-item-id="${data.id}">
				<button class="remove-item-btn" type="button" data-item-id="${data.id}"><i
						class="fa-regular fa-circle-xmark"></i></button>
				<div class="item-image-container">
					<img class="item-image" src="${data.imageUrl}" />
				</div>
				<div class="item-info">
					<div class="info-group">
						<h4 class="item-name">${data.name}
						</h4>
						<p class="item-description">${data.description}</p>
					</div>
					<div class="info-group">
						<h3 class="item-price">${data.price.toLocaleString()} đ</h3>
						<div class="cart-wrapper">
							<div class="cart-group-btn">
								<div class="cart-action-wrapper">
									<button type="button" class="decrease-item-btn" data-item-id="${data.id}"><i
											class="fa-solid fa-minus"></i></button>
									<input class="quantity-input" type="number" min="1" max="${MAX_ORDER_PER_ITEM}" value="${data.quantity}"
										data-item-id="${data.id}" />
									<button type="button" class="increase-item-btn" data-item-id="${data.id}"><i
											class="fa-solid fa-plus"></i></button>
								</div>
							</div>
						</div>
						<h3 class="item-price primary item-total-price" data-item-id="${data.id}">${totalItemPrice.toLocaleString()} đ</h3>
					</div>
				</div>
			</li>`;
}

/* Render detail item in detail item modal */
function renderDetailItem(data = {
	id: 1, name: "Cơm Đùi Gà Góc Tư Sốt Mắm Tỏi Chua Cay phơi phới",
	description: "Đùi gà tươi góc 4 xối mỡ + sốt mắm tỏi + Cơm + dưa leo + salad + canh",
	price: 40000,
	imageUrl: '/assets/images/exampleFood.png',
}) {

	// Set quantity to input tag
	const itemQuantity = carts.find(cartItem => cartItem.id === data.id)?.quantity || 1;
	$('#item-detail-quantity').val(itemQuantity);

	// Render button add to cart
	const totalItemPrice = data.price * itemQuantity;
	$('#add-cart-btn').attr('data-item-id', data.id).text(`Add to Basket - ${totalItemPrice.toLocaleString()} đ`);

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

	$('#detail-item-modal .modal-body').html(detailItemHtml);
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

	updateListViewItemWhenCartChanged(itemId);
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

/* Calculate total item of carts */
function calculateTotalItems(carts = [{ id: 1, quantity: 3, price: 30000 }]) {
	const totalItems = carts.reduce((prev, next) => prev + next.quantity, 0);
	return totalItems;
}

/* update list view item when cart changed*/
function updateListViewItemWhenCartChanged(itemId) {

	// find item in cart
	const foundItemInCart = carts.find(cartItem => cartItem.id === itemId);

	if (foundItemInCart) {// Exist item in cart
		// add class added into item
		$(`.list-view .list-view-item[data-item-id="${itemId}"]`).addClass('added');
		$(`.quantity-input[data-item-id="${itemId}"]`).val(foundItemInCart.quantity); // reset input quantity
	} else {
		// Remove class for parrent (li tag)
		$(`.list-view .list-view-item[data-item-id="${itemId}"]`).removeClass('added');
		$(`.quantity-input[data-item-id="${itemId}"]`).val('1'); // reset input quantity
	}

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
					<img class="item-image" src="${data.imageUrl}" />
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
	totalItems: null,
	size: 10,
	totalPages: 0,
	currentPage: 1,
	items: [
		{
			id: 1,
			name: "Cơm Đùi Gà Góc Tư Sốt Mắm Tỏi Chua Cay phơi phới",
			description: "Đùi gà tươi góc 4 xối mỡ + sốt mắm tỏi + Cơm + dưa leo + salad + canh",
			price: 40000,
			imageUrl: '/assets/images/exampleFood.png',
			type: 'food',
			isDeleted: false,
		},
		{
			id: 10,
			name: "Cơm Đùi Gà Góc Tư Sốt Mắm Tỏi Chua Cay phơi phới",
			description: "Đùi gà tươi góc 4 xối mỡ + sốt mắm tỏi + Cơm + dưa leo + salad + canh",
			price: 40000,
			imageUrl: '/assets/images/exampleFood.png',
			type: 'food',
			isDeleted: false,
		},
		{
			id: 11,
			name: "Cơm Đùi Gà Góc Tư Sốt Mắm Tỏi Chua Cay phơi phới",
			description: "Đùi gà tươi góc 4 xối mỡ + sốt mắm tỏi + Cơm + dưa leo + salad + canh",
			price: 40000,
			imageUrl: '/assets/images/exampleFood.png',
			type: 'food',
			isDeleted: false,
		},
		{
			id: 14,
			name: "Cơm Đùi Gà Góc Tư Sốt Mắm Tỏi Chua Cay phơi phới",
			description: "Đùi gà tươi góc 4 xối mỡ + sốt mắm tỏi + Cơm + dưa leo + salad + canh",
			price: 40000,
			imageUrl: '/assets/images/exampleFood.png',
			type: 'food',
			isDeleted: false,
		},
		{
			id: 17,
			name: "Cơm Đùi Gà Góc Tư Sốt Mắm Tỏi Chua Cay phơi phới",
			description: "Đùi gà tươi góc 4 xối mỡ + sốt mắm tỏi + Cơm + dưa leo + salad + canh",
			price: 40000,
			imageUrl: '/assets/images/exampleFood.png',
			type: 'food',
			isDeleted: false,

		},
		{
			id: 19,
			name: "Cơm Đùi Gà Góc Tư Sốt Mắm Tỏi Chua Cay phơi phới",
			description: "Đùi gà tươi góc 4 xối mỡ + sốt mắm tỏi + Cơm + dưa leo + salad + canh",
			price: 40000,
			imageUrl: '/assets/images/exampleFood.png',
			type: 'food',
			isDeleted: false,
		}
	]
};

let drinkObject = {
	totalItems: null,
	size: 10,
	totalPages: 0,
	currentPage: 1,
	items: [
		{
			id: 5,
			name: "S-Green Tea Macciato",
			description: "Lục Trà Macchiato - Size nh #Dòng thức uống đặc trưng, không thêm topping, không dùng ống hút nhựa",
			price: 60000,
			imageUrl: '/assets/images/exampleDrink.png',
			type: 'drink',
			isDeleted: false,
		}
	]
}

let carts = getCartFromLocalStorage();
