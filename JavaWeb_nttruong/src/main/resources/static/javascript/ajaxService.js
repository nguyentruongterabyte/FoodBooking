// host
const host = 'http://localhost:8080/';

// Check connection
function checkInternetConnection() {
	const online = navigator.onLine;
	
	if (!online) {
		if (showOtherToast) {
			showOtherToast({headerTitle: 'No network connection', text: 'No network connection. Please check your internet and try again'});
		} else {
			console.warn('No netword connection. Please check your internet and try again');
		}
	}
	
	return online;
}

// Custom ajax
async function myAjax({
	url = 'api/animals',
	type = 'GET',
	data,
	contentType = 'application/json',
	processData = true,
	success,
	error,
}) {
	
	// If no internet, do nothing
	if (!checkInternetConnection()) 
		return;
	
	return $.ajax({
		type,
		url: host + url,
		data,
		contentType,
		processData,
		timeout: 15000,
		statusCode: {
			// Handle internal system error
			500: function() {
				if (showOtherToast) {
					showOtherToast({headerTitle: 'System error', text: 'A system error occurred. Please try again later'});
				} else {
					console.log('A system error occurred. Please try again later');
				}
			}
		},
		success,
		error: (err, status) => error(null, status, err)
	});
}

const METHOD = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	DELETE: 'DELETE',
	PATCH: 'PATCH'
}

/* Order service */
const orderService = {
	create: {
		url: 'api/orders',
		type: METHOD.POST
	},

	getById: {
		url: 'api/orders/',
		type: METHOD.GET
	},

	todaySales: {
		url: 'api/orders/today-sales',
		type: METHOD.GET
	},

	countToday: {
		url: 'api/orders/count-today',
		type: METHOD.GET
	},

	count: {
		url: 'api/orders/count',
		type: METHOD.GET
	},

	orderPaged: {
		url: 'api/orders/',
		type: METHOD.GET
	},
	
	updateStatus: {
		url: 'api/orders/',
		type: METHOD.PATCH
	},
	
	revenue: {
		url: 'api/orders/revenue',
		type: METHOD.GET
	},
	
	/* Get revenue day|week|month */
	getRevenue: function(type = 'day') {
		return new Promise((resolve, reject) => {
			myAjax({
				url: `${this.revenue.url}?type=${type}`,
				type: this.revenue.type,
				success: (res) => resolve(res.data),
				error: (_, status, err) => {
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					
					reject(err.responseJSON.message);
				}
			});
		});
	},
	
	/* Update order status */
	updateOrderStatus: function({orderId, statusId}) {
		return new Promise((resolve, reject) => {
			myAjax({
				url: `${this.updateStatus.url}${orderId}/${statusId}`,
				type: this.updateStatus.type,
				success: (res) => resolve(res.message),
				error: (_, status, err) => {
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					
					reject(err.responseJSON.message);
				}
			})
		})
	},

	/* Get count */
	getCount: function(
		{
			dateType = 'today',
			orderStatusIds = [1, 2, 3, 4],
			keyword = ''
		}
	) {

		const orderStatusIdParams = orderStatusIds.map(orderStatusId => `orderStatusIds=${orderStatusId}`);

		return new Promise((resolve, reject) => {
			myAjax({
				url: `${this.count.url}?keyword=${keyword}&dateType=${dateType}&${orderStatusIdParams.join('&')}`,
				type: this.count.type,
				success: (res) => resolve(res.data),
				error: (_, status, err) => {
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					
					reject(err.responseJSON.message);
				}
			});
		});
	},

	/* Get orders pagination */
	getOrdersPage: function(
		{
			dateType = 'today',
			orderStatusIds = [1, 2, 3, 4],
			keyword = '',
			page = 1,
			size = 20,
			includeTotal = false
		}
	) {
		return new Promise((resolve, reject) => {
			const orderStatusIdParams = orderStatusIds.map(orderStatusId => `orderStatusIds=${orderStatusId}`);

			myAjax({
				url: `
				${this.orderPaged.url}${page}/${size}
				?keyword=${keyword}
				&dateType=${encodeURIComponent(dateType)}
				&includeTotal=${includeTotal}
				&${orderStatusIdParams.join('&')}`,
				type: this.orderPaged.type,
				success: (res) => resolve(res.data),
				error: (_, status, err) => {
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					
					reject(err.responseJSON.message);
				}
			});
		});
	},

	/* Get today's sales */
	getTodaySales: function() {
		return new Promise((resolve, reject) => {
			myAjax({
				url: this.todaySales.url,
				type: this.todaySales.type,
				success: (res) => resolve(res.data),
				error: (_, status, err) => {
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					
					reject(err.responseJSON.message);
				}
			});
		});
	},

	/* Get quantity of order today by order status
		* NULL: get all
		* NEW (1): get new order quantity
		* SHIPPING (2): get shipping order quantity
		* CANCELLED (3): get cancelled order quantity
		* COMPLETED (4): get completed order quantity
	 */
	getTodayCount: function(orderStatusId = null) {
		return new Promise((resolve, reject) => {
			myAjax({
				url: this.countToday.url + (orderStatusId !== null ? `?orderStatusId=${orderStatusId}` : ''),
				type: this.countToday.type,
				success: (res) => resolve(res.data),
				error: (_, status, err) => {
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					
					reject(err.responseJSON.message);
				}
			})
		})
	},

	/* Get by order id */
	getByOrderId: function(id) {
		return new Promise((resolve, reject) => {
			myAjax({
				url: `${this.getById.url}${id}`,
				type: this.getById.type,
				success: (res) => resolve(res.data),
				error: (_, status, err) => {
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					reject(err.responseJSON.message);
				}
			});
		});
	},

	/*  */

	/* Create new order */
	createOrder: function(data = {
		name: "Nguyen Thai Truong",
		detailAddress: "278 La Xuan Oai Tang Nhon Phu A",
		message: "Khong lay ong hut",
		phone: "0958915051",
		provinceId: 1,
		wardId: 1,
		bookingProducts: [
			{
				bookingProductId: 1,
				quantity: 1
			}
		]
	}) {
		return new Promise((resolve, reject) => {
			myAjax({
				url: this.create.url,
				type: this.create.type,
				data,
				success: (res) => resolve(res.data),
				error: (_, status, err) => {
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					
					reject(
						{
							message: err.responseJSON.message,
							errors: err.responseJSON.errors
						}
					);
				}
			})
		});
	}
}

/* Account service */
const accountService = {
	signIn: {
		url: 'perform-login',
		type: METHOD.POST
	},

	updatePassword: {
		url: 'api/accounts/change-password',
		type: METHOD.PUT
	},

	/* Login */
	login: function(data = {
		username: 'username',
		password: 'password'
	}) {
		const formData = new FormData();
		formData.append('username', data.username);
		formData.append('password', data.password);
		return new Promise((resolve, reject) => {
			myAjax({
				url: this.signIn.url,
				type: this.signIn.type,
				data: formData,
				contentType: false,
				processData: false,
				success: (res) => resolve(res),
				error: (_, status, err) => {
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					
					reject(err.responseJSON.error);
				}
			});
		});
	},

	/* Update account password */
	updateAccountPassword: function(data = {
		password: '123',
		newPassword: '1234'
	}) {
		return new Promise((resolve, reject) => {
			myAjax({
				url: this.updatePassword.url,
				type: this.updatePassword.type,
				data,
				success: (res) => resolve(res.message),
				error: (_, status, err) => {
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					
					console.log(err)
					
					reject(
						{
							message: err.responseJSON.message,
							errors: err.responseJSON.errors
						}
					);
				}
			});
		});
	}
}

/* Booking product service */
const bookingProductService = {
	create: {
		url: 'api/booking-products',
		type: METHOD.POST
	},

	getPage: {
		url: 'api/booking-products/',
		type: METHOD.GET
	},
	
	getById: {
		url: 'api/booking-products/',
		type: METHOD.GET
	},

	getCount: {
		url: 'api/booking-products/count',
		type: METHOD.GET
	},

	delete: {
		url: 'api/booking-products/',
		type: METHOD.DELETE
	},

	update: {
		url: 'api/booking-products/',
		type: METHOD.PUT
	},
	
	/* Get by booking product id */
	getByBookingProductId: function(id) {
		return new Promise((resolve, reject) => {
			myAjax({
				url: `${this.getById.url}${id}`,
				type: this.getById.type,
				success: (res) => resolve(res.data),
				error: (_, status, err) => {
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					
					reject(err.responseJSON.message);
				}
			});
		});
	},

	/* Update booking product */
	updateBookingProduct: function(
		id = 99999,
		data = {
			name: 'Cơm Đùi Gà Góc Tư Sốt Mắm Tỏi Chua Cay phơi phới',
			type: 'food',
			price: 20000,
			description: 'Đùi gà tươi góc 4 xối mỡ + sốt mắm tỏi + Cơm + dưa leo + salad + canh',
			imageFile: null
		}
	) {
		const formData = new FormData();

		if (!!data.name) {
			formData.append('name', data.name);
		}
		if (!!data.type) {
			formData.append('type', data.type);
		}
		if (!!data.price) {
			formData.append('price', data.price);
		}

		if (!!data.description) {
			formData.append('description', data.description);
		}

		if (!!data.imageFile && data.imageFile.size !== 0) {
			formData.append('imageFile', data.imageFile);
		}

		return new Promise((resolve, reject) => {
			myAjax({
				url: `${this.update.url}${id}`,
				type: this.update.type,
				data: formData,
				contentType: false,
				processData: false,
				success: (res) => resolve(res.data),
				error: (_, status, err) => {
					
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					
					reject(
					{
						message: err.responseJSON.message,
						errors: err.responseJSON.errors
					});
				}
			});
		});
	},

	/* Delete booking product */
	deleteBookingProduct: function(id) {
		return new Promise((resolve, reject) => {
			myAjax({
				url: `${this.delete.url}${id}`,
				type: this.delete.type,
				success: (res) => resolve(res.message),
				error: (_, status, err) => {
					
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					
					reject(err.responseJSON.message);
				}
			});
		});
	},

	/* Get total of items */
	getTotalItems: function(
		{
			keyword = '',
			isDeleted = null,
			type = 'food'
		}
	) {
		return new Promise((resolve, reject) => {
			myAjax({
				url: `${this.getCount.url}?keyword=${keyword}&type=${type}${isDeleted === null ? '' : `&isDeleted=${isDeleted}`}`,
				type: this.getCount.type,
				success: (res) => resolve(res.data),
				error: (_, status, err) => {
					
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					
					reject(err.responseJSON.message);
				}
			});
		});
	},

	/* Get booking products page */
	getBookingProductsPage: function(
		{
			keyword = '',
			isDeleted = null,
			type = 'food',
			priceDESC = null,
			includeTotal = false,
			page = 1,
			size = 10,
			useSemantic = false
		}
	) {
		return new Promise((resolve, reject) => {
			myAjax({
				url: `
					${this.getPage.url}
					${page}/${size}?
					keyword=${keyword}
					&type=${type}
					${priceDESC === null ? '' : `&priceDESC=${priceDESC}`}
					&includeTotal=${includeTotal}
					&useSemantic=${useSemantic}
					${isDeleted === null ? '' : `&isDeleted=${isDeleted}`}
				`,
				type: this.getPage.type,
				success: (res) => resolve(res.data),
				error: (_, status, err) => {
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					
					reject(err.responseJSON.message);
				}
			});
		});
	},

	/* Create new product API */
	createProduct: function(data = {
		name: 'Cơm Đùi Gà Góc Tư Sốt Mắm Tỏi Chua Cay phơi phới',
		type: 'food',
		price: 20000,
		description: 'Đùi gà tươi góc 4 xối mỡ + sốt mắm tỏi + Cơm + dưa leo + salad + canh',
		imageFile: new File()
	}) {

		const formData = new FormData();

		formData.append('name', data.name);
		formData.append('type', data.type);
		formData.append('price', data.price);
		formData.append('description', data.description);
		formData.append('imageFile', data.imageFile);

		return new Promise((resolve, reject) => {
			myAjax({
				url: this.create.url,
				type: this.create.type,
				data: formData,
				contentType: false,
				processData: false,
				success: (res) => resolve(res.data),
				error: (_, status, err) => {
					
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					
					reject(
						{
							message: err.responseJSON.message,
							errors: err.responseJSON.errors
						}
					);
					
				}
			});
		});
	},
}

// Ward Service
const wardService = {
	getByProvinceId: {
		url: 'api/wards/by-province-id/',
		type: METHOD.GET
	},

	create: {
		url: 'api/wards',
		type: METHOD.POST
	},

	delete: {
		url: 'api/wards/',
		type: METHOD.DELETE
	},

	// Get wards by province id
	getWardsByProvinceId: function(provinceId) {
		return new Promise((resolve, reject) => {
			myAjax({
				url: this.getByProvinceId.url + provinceId,
				type: this.getByProvinceId.type,
				success: (res) => resolve(res.data),
				error: (_, status, err) => {
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					reject(err.responseJSON.message);
				}
			});
		});
	},

	// Create ward
	createWard: function(data) {
		return new Promise((resolve, reject) => {
			myAjax({
				url: this.create.url,
				type: this.create.type,
				data,
				success: (res) => resolve(res.data),
				error: (_, status, err) => {
					
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					
					reject(err.responseJSON.message);
				}
			});
		});
	},

	// Delete ward
	deleteWard: function(wardId) {
		return new Promise((resolve, reject) => {
			myAjax({
				url: this.delete.url + wardId,
				type: this.delete.type,
				success: (res) => resolve(res.message),
				error: (_, status, err) => {
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					reject(err.responseJSON);
				}
			});
		});
	},
}

// Province Service
const provinceService = {
	getAll: {
		url: 'api/provinces',
		type: METHOD.GET,
	},

	create: {
		url: 'api/provinces',
		type: METHOD.POST
	},

	delete: {
		url: 'api/provinces/',
		type: METHOD.DELETE
	},

	// Get all provinces
	getAllProvinces: function() {
		return new Promise((resolve, reject) => {
			myAjax({
				url: this.getAll.url,
				type: this.getAll.type,
				success: (res) => resolve(res.data),
				error: (_, status, err) => {
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					
					reject(err.responseJSON.message);
				}
			});

		})

	},

	// Create province
	createProvince: function(data) {
		return new Promise((resolve, reject) => {
			myAjax({
				url: this.create.url,
				type: this.create.type,
				data,
				success: (res) => resolve(res.data),
				error: (_, status, err) => {
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					
					reject(err.responseJSON);
				}
			})
		})
	},

	// Delete province
	deleteProvince: function(provinceId) {
		return new Promise((resolve, reject) => {
			myAjax({
				url: this.delete.url + provinceId,
				type: this.create.type,
				data,
				success: (res) => resolve(res.message),
				error: (_, status, err) => {
					// Handle request timeout
					if (status === 'timeout') {
						if (showOtherToast) {
							showOtherToast({text: "Request Timeout", headerTitle: "Request Timeout"});
						} else {
							console.warn("Request Timeout");
						}
						return;
					}
					
					reject(err.responseJSON.message);
				}
			})
		})
	},
}