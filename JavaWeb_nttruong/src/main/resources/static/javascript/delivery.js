$(document).ready(function() {
	
	renderListOfCart();
	
});

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