const DEFAULT_NOTIFICATION_OPTIONS = {
	position: 'top-right',
	autoClose: 5000,
	canClose: true,
	showProgress: true,
	pauseOnHover: true,
	pauseOnFocusLoss: true,
	style: {},
	closeButtonColor: '#000', // Default close button text color
	icon: null, // Default to no icon
	iconColor: '#000', // Default icon color
	progressBarColor: '#E4235D', // Default progress bar color
	onClose: () => { },
};

class LocalNotification {
	constructor(options) {
		this.options = { ...DEFAULT_NOTIFICATION_OPTIONS, ...options };
		this.notificationElement = this.createNotificationElement();
		this.containerElement = this.getContainerElement(this.options.position);
		this.containerElement.appendChild(this.notificationElement);
		this.applyStyles();
		this.addEventListeners();
		this.show();
		if (this.options.autoClose) {
			this.startAutoCloseTimer();
		}
		if (this.options.showProgress) {
			this.startProgressTimer();
		}
	}

	createNotificationElement() {
		const element = document.createElement('div');
		element.classList.add('notification');

		const headerElement = document.createElement('div')
		headerElement.classList.add('notification-header')

		if (this.options.icon) {
			const iconElement = document.createElement('span');
			iconElement.classList.add('notification-icon');
			iconElement.innerHTML = this.options.icon;
			iconElement.style.color = this.options.iconColor;
			headerElement.appendChild(iconElement);
		}

		const headerTitle = document.createElement('h4')
		headerTitle.classList.add('notification-header-title');
		headerTitle.textContent = this.options.headerTitle || '';
		headerElement.appendChild(headerTitle);

		if (this.options.canClose) {
			headerElement.classList.add('can-close');
			const closeButton = document.createElement('button');
			closeButton.textContent = '×';
			closeButton.classList.add('close-button');
			closeButton.style.color = this.options.closeButtonColor;
			closeButton.addEventListener('click', () => this.remove());
			headerElement.appendChild(closeButton);
		}

		element.appendChild(headerElement);

		const bodyElement = document.createElement('div');
		bodyElement.classList.add('notification-body');

		const textElement = document.createElement('span');
		textElement.classList.add('notification-text');
		textElement.textContent = this.options.text || '';
		bodyElement.appendChild(textElement);

		element.appendChild(bodyElement);

		if (this.options.showProgress) {
			const progressBar = document.createElement('div');
			progressBar.classList.add('progress-bar');
			progressBar.style.setProperty('--color', this.options.progressBarColor);
			element.appendChild(progressBar);
		}

		return element;
	}

	getContainerElement(position) {
		let container = document.querySelector(`.notification-container[data-position='${position}']`);
		if (!container) {
			container = document.createElement('div');
			container.classList.add('notification-container');
			container.dataset.position = position;
			document.body.appendChild(container);
		}
		return container;
	}

	applyStyles() {
		if (this.options.style) {
			Object.entries(this.options.style).forEach(([key, value]) => {
				this.notificationElement.style[key] = value;
			});
		}
		if (this.options.headerStyle) {
			Object.entries(this.options.headerStyle).forEach(([key, value]) => {
				this.notificationElement.querySelector('.notification-header').style[key] = value;
			});
		}
		if (this.options.headerIconStyle) {
			Object.entries(this.options.headerIconStyle).forEach(([key, value]) => {
				this.notificationElement.querySelector('.notification-icon').style[key] = value;
			})
		}
	}

	addEventListeners() {
		if (this.options.pauseOnHover) {
			this.notificationElement.addEventListener('mouseover', () => this.pause());
			this.notificationElement.addEventListener('mouseleave', () => this.resume());
		}
		if (this.options.pauseOnFocusLoss) {
			document.addEventListener('visibilitychange', () => {
				if (document.visibilityState === 'visible') {
					this.resume();
				} else {
					this.pause();
				}
			});
		}
	}

	show() {
		requestAnimationFrame(() => {
			this.notificationElement.classList.add('show');
		});
	}

	remove() {
		this.notificationElement.classList.remove('show');
		this.notificationElement.addEventListener('transitionend', () => {
			this.notificationElement.remove();
			if (!this.containerElement.hasChildNodes()) {
				this.containerElement.remove();
			}
		});
		if (typeof this.options.onClose === 'function') {
			this.options.onClose();
		}
	}

	pause() {
		this.isPaused = true;
		const progressBar = this.notificationElement.querySelector('.progress-bar');
		progressBar.style.animationPlayState = 'paused';
	}

	resume() {
		this.isPaused = false;
		const progressBar = this.notificationElement.querySelector('.progress-bar');
		progressBar.style.animationPlayState = 'running';
	}

	startAutoCloseTimer() {
		this.timeVisible = 0;
		let lastTimestamp = 0;
		const autoCloseInterval = (timestamp) => {
			if (!this.isPaused) {
				const elapsed = timestamp - lastTimestamp;
				this.timeVisible += elapsed;
				lastTimestamp = timestamp;
				if (this.timeVisible >= this.options.autoClose) {
					this.remove();
					return;
				}
			}
			requestAnimationFrame(autoCloseInterval);
		};
		requestAnimationFrame((timestamp) => {
			lastTimestamp = timestamp;
			autoCloseInterval(timestamp);
		});
	}

	startProgressTimer() {
		const progressBar = this.notificationElement.querySelector('.progress-bar');
		progressBar.style.animation = `timeOut ${this.options.autoClose}ms linear 1 forwards`;
		let lastTimestamp = 0;
		const updateProgress = (timestamp) => {
			if (!this.isPaused) {
				const elapsed = timestamp - lastTimestamp;
				this.timeVisible += elapsed;
				lastTimestamp = timestamp;
				const progress = Math.min(1, this.timeVisible / this.options.autoClose);
				progressBar.style.width = `${100 - progress * 100}%`;
			}
			requestAnimationFrame(updateProgress);
		};
		requestAnimationFrame((timestamp) => {
			lastTimestamp = timestamp;
			updateProgress(timestamp);
		});
	}
}

/*const notification = new LocalNotification({
  text: 'This is a very long notification message that should break properly into multiple lines without causing any overflow issues. This is a very long notification message that should break properly into multiple lines without causing any overflow issues.',
  autoClose: 20000, // Custom autoClose duration
  position: 'top-right',
  style: {
	background: '#E4235D',
	color: '#fff',
	transition: 'all 350ms linear',
	height: '10%',
	'border-radius': '10px',
	'margin-top': '10%',
	'margin-right': '15px',
  },
  closeButtonColor: '#fff', // Custom close button text color
  icon: '🔔', // Custom icon
  iconColor: '#FFD700', // Custom icon color
  progressBarColor: '#FFD700' // Custom progress bar color
});*/
