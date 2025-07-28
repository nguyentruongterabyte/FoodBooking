$(document).ready(function() {

	// Init chart 7 last days revenue
	setTimeout(function() {
		initChart({ chartType: 'day', chartId: 'days-revenue' });
	}, 0);

	/* Handle tab chart changed */
	$('#revenue-navigation-tab').on('click', '.navigation-item', function() {
		const type = $(this).attr('data-chart-time'); // Get type of chart
		switch (type) {
			case 'week':
				if (!isFetchedWeeksRevenue) {
					initChart({ chartType: 'week', chartId: 'weeks-revenue', chartTitle: 'Revenue 12 last weeks' });
					isFetchedWeeksRevenue = true;
				}
				break;
			case 'month':
				if (!isFetchedMonthRevenue) {
					initChart({ chartType: 'month', chartId: 'months-revenue', chartTitle: 'Revenue 12 last months' });
					isFetchedMonthRevenue = true;
				}
				break;
			case 'day':
			default:
				console.log('fetched');
		}
	});
	
});

/* Init chart */
function initChart({ chartType, chartId, chartTitle = 'Revenue 7 last days' }) {
	$('.chart-wrapper .loader').show();
	orderService.getRevenue(chartType)
		.then(data => {
			setTimeout(function() {
				$('.chart-wrapper .loader').hide();
			}, 200);
			const ctx = document.getElementById(chartId).getContext('2d')

			const gradient = ctx.createLinearGradient(0, 0, 0, 400);
			gradient.addColorStop(0, '#ff6b00');
			gradient.addColorStop(1, 'white');

			new Chart(ctx, {
				type: 'line',
				data: {
					labels: data.map(item => item.period),
					datasets: [{
						label: 'Revenue (Million đồng)',
						data: data.map(item => item.total / 1000000),
						fill: true,
						borderColor: '#ff6b00',
						backgroundColor: gradient,
						tension: 0.4
					}]
				},
				options: {
					responsive: true,
					plugins: {
						tooltip: {
							callbacks: {
								label: function(context) {
									const value = context.raw * 1_000_000;
									return value.toLocaleString('vi-VN') + '₫';
								}
							}
						},
						title: {
							display: true,
							text: chartTitle,
							font: { size: 18 }
						},
						legend: { display: false }
					},
					scales: {
						y: {
							beginAtZero: true,
							ticks: {
								stepSize: 1,
								callback: value => value + ' millions'
							}
						}
					}
				}
			});
		})
		.catch(message => {
			showErrorToast({ text: message, headerTitle: 'Error retrieve chart' })
			$('.chart-wrapper .loader').hide();
		});

}

/* Get last 7 days from current day*/
function getLast7Days() {
	const days = new Array();

	const today = new Date();

	for (let i = 6; i >= 0; i--) {
		const d = new Date(today);

		d.setDate(today.getDate() - i);
		const day = d.getDate().toString().padStart(2, '0');
		const month = (d.getMonth() + 1).toString().padStart(2, '0');

		days.push(`${day}/${month}`);
	}

	return days;
}

// VND
const rawRevenue = [0, 0, 0, 0, 0, 0, 0];

const revenueData = rawRevenue.map(value => value / 1000000);

let isFetchedWeeksRevenue = false;
let isFetchedMonthRevenue = false;
