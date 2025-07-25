$(document).ready(function() {
	/* Handle booking product type navigation item click */
	$('#booking-product-type-navigation').on('click', '.navigation-item', function() {

		// Get the current tab name
		const tabName = $(this).attr('data-tab');

		// Prevent user click much times in a tab
		if (typeActiveTab === tabName)
			return;

		typeActiveTab = tabName;

		// Set searching input attribute 'data-search-type'
		switch (tabName) {
			case 'food-tab':
				// Set searching for 'food'
				$('#searching-input').attr('data-search-type', 'food');
				// Set create button type creation
				$('.create-btn').attr('data-create-type', 'food');
				// Set value of type input 'food'
				$('input[name="type"]').val('food');
				// Set active tab of type selector 'food'
				$('#type-selector li').removeClass('active');
				$('#type-selector li[data-type="food"]').addClass('active');
				// Set demo place image holder
				$('.demo-image').attr('src', '/assets/images/foodPlaceholder.png');
				break;
			case 'drink-tab':
				// Set searching for 'drink'
				$('#searching-input').attr('data-search-type', 'drink');
				// Set create button type creation
				$('.create-btn').attr('data-create-type', 'drink');
				// Set value of type input 'drink'
				$('input[name="type"]').val('drink');
				// Set active tab of type selector 'food'
				$('#type-selector li').removeClass('active');
				$('#type-selector li[data-type="drink"]').addClass('active');
				// Set demo place image holder
				$('.demo-image').attr('src', '/assets/images/drinkPlaceholder.png');

				break;
			default:
				alert('Invalid type!');
		}
	});

	/* Handle delete button click */
	$('table').on('click', '.remove-btn', function() {
		const itemId = Number($(this).attr('data-item-id')); // Get item id

		$('#modal-confirm-title').text('Delete Confirmation');
		$('#modal-confirm-body').text('Are you sure delete this item?');
		
		$('#confirm-btn')
			.attr('data-action', 'delete')
			.attr('data-item-id', itemId);

		// Show confirmation modal
		$('#show-confirm-modal').click();
	});

	/* Handle edit button click */
	$('table').on('click', '.edit-btn', function() {
		const itemId = Number($(this).attr('data-item-id')); // Get item id

		// Find item in food or drink
		const foundItem = foodObject.items.find(item => item.id === itemId)
			|| drinkObject.items.find(item => item.id === itemId)
			|| null;

		// Check if item not found
		if (foundItem === null) {
			showOtherToast({ text: 'Item not found', headerTitle: 'Found item issue' });
			return;
		}

		// Init value
		$('.demo-image').attr('src', foundItem.imageUrl);
		$('.remove-image-btn').show();
		$('input[name="imageFile"]').val('');
		$('input[name="name"]').val(foundItem.name);
		$('input[name="price"]').val(foundItem.price);
		$('textarea[name="description"]').val(foundItem.description);

		// Show detail modal 
		$('#show-detail-btn').click();

		// Set action type 'edit' into form
		$('#info-form')
			.attr('data-item-id', itemId)
			.attr('data-action-type', 'edit');
	});

	/* Handle create new item button click */
	$('#create-btn').on('click', function() {
		// Show detail modal 
		$('#show-detail-btn').click();

		// Set action type 'create' into form
		$('#info-form').attr('data-action-type', 'create');

		// Reset input
		clearInput();
	});

	/* Handle cancel button in detail click */
	$('#cancel-btn').on('click', function() {

		// Close modal
		$('#close-detail-modal-btn').click();
	});

	/* Handle type selector change */
	$('#type-selector').on('click', '.navigation-item', function() {
		const type = $(this).attr('data-type'); // Get type;

		// Set demo image

		if (!$('input[name="imageFile"]').val()) {
			if (type === 'food')
				$('.demo-image').attr('src', '/assets/images/foodPlaceholder.png');
			else if (type === 'drink')
				$('.demo-image').attr('src', '/assets/images/drinkPlaceholder.png');
		}
		// Set type input tag
		$('input[name="type"]').val(String(type));
	});

	/* Handle information form submit */
	$('#info-form').on('submit', function(e) {
		e.preventDefault();

		// Get action type
		const action = $(this).attr('data-action-type');

		// Get form data
		const formData = new FormData(this);

		const formObj = Object.fromEntries(formData.entries());
		// Submit form
		switch (action) {
			case 'create':
				// Call api create booking product
				bookingProductService.createProduct(formObj)
					.then(newItem => {
						$('#close-detail-modal-btn').click(); // Close modal
						showSuccessToast({ text: 'Item added to list. May be order is not exact, please reload page!', headerTitle: 'Add item to list', autoClose: 15000 })
						// Create new item html
						const newItemHtml = `
									<tr data-item-id="${newItem.id}" class="table-primary">
										${generateItemHTML({ itemOrder: '###', ...newItem })}
									</tr>`
						switch (newItem.type) {
							case 'food':
								// add item to DOM
								foodObject.items.unshift(newItem);

								// Add to first new item html
								$('#food-tab table tbody')
									.prepend(newItemHtml);
								break;
							case 'drink':
								// add item to DOM
								drinkObject.items.unshift(newItem);

								// Add to first new item html
								$('#drink-tab table tbody')
									.prepend(newItemHtml);
								break;
							default:
								alert('Something went wrong!');
						}
					}).catch(err => {
						const errors = err.errors;
						if (errors instanceof Array) {
							for (const error of errors) {
								$(`.form-control[name="${error.field}"]`).addClass('is-invalid');
								$(`.form-control[name="${error.field}"]`).siblings('.invalid-feedback').text(error.message);
							}
						} else {
							showOtherToast({ text: err.message, headerTitle: 'Bad Request', autoClose: 10000 });
						}
					});
				break;
			case 'edit':
				const itemId = Number($(this).attr('data-item-id')) || null;

				// Check if can not get item id
				if (itemId === null) {
					alert('Cannot get attribute data-item-id');
					return;
				}

				// Call api update booking product
				bookingProductService.updateBookingProduct(itemId, formObj)
					.then((updatedItem) => {

						$('#close-detail-modal-btn').click(); // Close modal
						showSuccessToast({ text: 'Item updated successfully!', headerTitle: 'Update item', autoClose: 15000 })
						switch (updatedItem.type) {
							case 'food':
								// render item to DOM
								foodObject.items = foodObject.items.map(item => item.id === updatedItem.id ? updatedItem : item);
								$(`#food-tab table tr[data-item-id="${updatedItem.id}"]`)
									.addClass('table-info').html(generateItemHTML({ ...updatedItem, itemOrder: '###' }));
								break;
							case 'drink':
								// render item to DOM
								foodObject.items = drinkObject.items.map(item => item.id === updatedItem.id ? updatedItem : item);
								$(`#drink-tab table tr[data-item-id="${updatedItem.id}"]`)
									.addClass('table-info').html(generateItemHTML({ ...updatedItem, itemOrder: '###' }));
								break;
							default:
								alert('Something went wrong!');
						}
					}).catch(err => {
						const errors = err.errors;
						if (errors instanceof Array) {
							for (const error of errors) {
								$(`.form-control[name="${error.field}"]`).addClass('is-invalid');
								$(`.form-control[name="${error.field}"]`).siblings('.invalid-feedback').text(error.message);
							}
						} else {
							showOtherToast({ text: err.message, headerTitle: 'Bad Request', autoClose: 10000 });
						}
					});
				break;
			default:
				alert('Invalid action form.');
		}
	});

	// Handle image demo when upload file
	$('.image-upload-btn').on('change', function() {
		const file = this.files[0];
		const maxSizeMB = 5;

		if (file) {
			// Check file size
			if (file.size > maxSizeMB * 1024 * 1024) {
				$('.image-invalid-feedback').show().text('The file size must less than ' + maxSizeMB + 'MB');
				$('.demo-image').attr('src', '/assets/images/foodPlaceholder.png'); // Reset image if error occur
				return;
			}

			const reader = new FileReader();

			reader.onload = function(e) {
				$('.demo-image').attr('src', e.target.result);
				$('.remove-image-btn').show();
			};

			reader.readAsDataURL(file);
			$('.invalid-feedback').hide(); // Hide error if the file exists
		}
	});

	/* Handle button remove image click */
	$('.remove-image-btn').on('click', function() {
		$('.demo-image').attr('src', '/assets/images/foodPlaceholder.png'); // Reset image if error occur
		$('input[name="imageFile"]').val('');
		$(this).hide();
	});

	// Handle food size selector change
	$('#food__size-selector').on('change', function() {
		const size = Number($(this).val());


		foodObject.size = size;


		// Get and render first page booking products
		getBookingProducts(
			{
				keyword: getKeywordFromSearchingInput(),
				type: 'food',
				page: 1,
				size: foodObject.size,
				includeTotal: true,
				isDeleted: null
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
				isDeleted: null
			}
		);
	});

	// Handle pagination item click
	handlePaginationItemClick('#drink__pagination-nav .pagination', 'drink');
	handlePaginationItemClick('#food__pagination-nav .pagination', 'food');

	// Handle previous button and next button on pagination click
	handlePrevNextPaginationClick('#drink__pagination-nav .pagination', 'drink');
	handlePrevNextPaginationClick('#food__pagination-nav .pagination', 'food');
});


/* Get and render total items */
function getAndRenderTotalItems(type) {
	switch (type) {
		case 'food': {
			// Init food object
			bookingProductService.getTotalItems(
				{
					keyword: getKeywordFromSearchingInput(),
					type: 'food',
					isDeleted: null
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
								keyword: getKeywordFromSearchingInput(),
								type: 'food',
								page: foodObject.currentPage,
								size: foodObject.size,
								includeTotal: true
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
					isDeleted: null
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
							includeTotal: true
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
	})
}

/* Custom render paging */
function customRenderPaging({ root = '#food__pagination-nav .pagination', size = 5, currentPage = 1, totalPages = 1 }) {
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

/* Get booking product */
function getBookingProducts(
	{
		keyword = '',
		type = 'food',
		page = 1,
		size = 5,
		includeTotal = false,
		isDeleted = null
	}
) {
	bookingProductService.getBookingProductsPage(
		{ keyword, type, page, size, includeTotal, isDeleted }
	)
		.then(pagedResponse => {
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

/* Clear input */
function clearInput() {

	$('.demo-image').attr('src', '/assets/images/foodPlaceholder.png');
	$('.remove-image-btn').hide();
	$('input[name="imageFile"]').val('');
	$('input[name="name"]').val('');
	$('input[name="price"]').val('');
	$('textarea[name="description"]').val('');
}

/* Get keyword from searching input */
function getKeywordFromSearchingInput() {
	return $('#searching-input').val() || '';
}

/* Render List View */
function renderListView({ data = [{
	id: 1,
	name: "S-Green Tea Macciato",
	description: "Lục Trà Macchiato - Size nhỏ #Dòng thức uống đặc trưng, không thêm topping, không dùng ống hút nhựa",
	price: 60000,
	imageUrl: '/assets/images/exampleDrink.png',
	type: 'food',
	isDeleted: false
}], type = 'food' }) {

	if (data.length === 0)
		showOtherToast({ text: 'There is nothing to show!', headerTitle: 'Empty list' });

	switch (type) {
		case 'food':
			$('#food-tab table tbody').empty();
			$('#food-tab table tbody').html(
				data.map((item, index) => `
					<tr data-item-id="${item.id}">
						${generateItemHTML({ ...item, itemOrder: index + 1 })}
					</tr>
				`
				).join('')
			);
			break;
		case 'drink':
			$('#drink-tab table tbody').empty();
			$('#drink-tab table tbody').html(
				data.map((item, index) => `
					<tr data-item-id="${item.id}">
						${generateItemHTML({ ...item, itemOrder: index + 1 })}
					</tr>
				`
				).join('')
			);
			break;
		default:
			alert('Invalid type!');
	}
}

/* Generate Item HTML */
function generateItemHTML(data = {
	id: 1,
	itemOrder: 1,
	name: "Cơm Đùi Gà Góc Tư Sốt Mắm Tỏi Chua Cay phơi phới",
	description: "Đùi gà tươi góc 4 xối mỡ + sốt mắm tỏi + Cơm + dưa leo + salad + canh",
	price: 40000,
	imageUrl: '/assets/images/exampleFood.png',
	type: 'food',
	isDeleted: false
}) {

	const itemOrderStr = String(data.itemOrder).padStart(3, '0') || "NaN";
	return `
			<td>${itemOrderStr}</td>
			<td>
				<div class="wrapper">
					<img class="img-thumbnail" src="${data.imageUrl}" />
					<span>${data.name}</span>
				</div>
			</td>
			<td>${data.description}</td>
			<td>${data.price.toLocaleString()} đ</td>
			<td>
				<div class="form-check form-switch">
					<input class="form-check-input" type="checkbox" role="switch" disabled readonly
						id="flexSwitchCheckChecked" ${!data.isDeleted ? "checked" : ""} >
				</div>
			</td>
			<td>
				<button class="remove-btn" data-item-id="${data.id}" ${data.isDeleted ? 'disabled' : ''}>Delete</button>
				<button class="edit-btn" data-item-id="${data.id}" ${data.isDeleted ? 'disabled' : ''}>Edit</button>
			</td>`;
}

let mainActiveTab = 'dashboard-tab';
let typeActiveTab = 'food-tab';
let foodObject = {
	totalItems: null,
	size: 5,
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
			isDeleted: true,
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
	size: 5,
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