$(document).ready(function() {
	
	// Call API statuses or not
	renderOrderStatusFilterSelector();
	
	// Handle status selector on change
	$('#statuses-selector').on('change', function() {
		const statusId = Number($(this).val());
		console.log(statusId);
		const orderStatus = orderStatuses.find(os => os.id === statusId);
		selectedFilteredStatuses.push(orderStatus);
		console.log(selectedFilteredStatuses);
		
		// Call API filter by order statues
		
		renderOrderStatusFilterSelector();
		renderOrderStatusFilterButtons();
	}); 
	
	// Handle remove filter button click
	$('#selected-statuses-filter').on('click', '.remove-filter', function() {
		const statusId = Number($(this).attr('data-status-id'));
		console.log('clicked')
		selectedFilteredStatuses = selectedFilteredStatuses.filter(selected => selected.id !== statusId);
		
		renderOrderStatusFilterSelector();
		renderOrderStatusFilterButtons();
	});
});

/* Render order status buttons*/
function renderOrderStatusFilterButtons() {
	
	// Array of element html	
	const elementsHTML = selectedFilteredStatuses.map(selected => `
			<li class="selected-order-status-item">
				<button>
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
	{id: 0, name: ''},
	{id: 1, name: 'New'},
	{id: 2, name: 'Shipping'},
	{id: 3, name: 'Cancelled'},
	{id: 4, name: 'Completed'}
]

let selectedFilteredStatuses = [];

