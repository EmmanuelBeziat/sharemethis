'use strict'

class ShareMeThisInstance {
	constructor (element, data, options) {
		this.root = element
		this.data = data
		this.options = options

		this.root.addEventListener('click', event => {
			event.preventDefault()
			this.share()
		})
	}

	share () {
		if (!this.options.fallbackOnly) {
			navigator?.share && navigator?.canShare(this.data) ? this.shareNative() : this.shareFallBack()
		}
		else {
			this.shareFallBack()
		}
	}

	shareNative () {
		navigator.share(this.data)
	}

	shareFallBack () {
		const { url } = this.data
		navigator.clipboard.writeText(url)
			.then(() => {
				console.log('URL copied to clipboard')
			})
			.catch(err => {
				console.error('Failed to copy URL to clipboard', err)
			})
	}
}

class ShareMeThis {
	constructor (selector = '[data-sharemethis]', data, options = {}) {
		this.elements = Array.from(document.querySelectorAll(selector))
		this.elements?.forEach(element => {
			console.log()
			new ShareMeThisInstance(element, data, options)
		})
	}
}
