'use strict'

class PopinShare {
  constructor (data) {
    this.root = document.createElement('div')
    this.root.attachShadow({ mode: 'open' })
		this.data = data
    this.create()
  }

  create () {
		this.root.classList.add('share-dialog')
    this.root.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="sharemethis.css">
			<div class="share-dialog-body">
				<header>
					<button type="button" class="close-button">X</button>
					<h3 class="dialog-title">Partager « ${this.data.title} »</h3>
				</header>
				<div class="targets">
					<button type="button" class="share-button" data-type="facebook" aria-label="Share on Facebook"></button>
					<button type="button" class="share-button" data-type="x" aria-label="Share on X"></button>
					<button type="button" class="share-button" data-type="linkedin" aria-label="Share on LinkedIn"></button>
					<button type="button" class="share-button" data-type="email" aria-label="Share by email"></button>
				</div>
				<div class="link">
					<div class="share-url">${this.data.url}</div>
					<button type="button" class="share-copy-link" aria-label="Copy link"></button>
				</div>
			</div>
    `

    this.root.shadowRoot.querySelectorAll('.share-button')?.forEach(button => {
      button.addEventListener('click', () => {
        const dataType = button.dataset.type

				switch (dataType) {
					case 'facebook':
						this.sharePopup(`https://www.facebook.com/sharer/sharer.php?u=${this.data.url}`, 'Share on Facebook')
						break
					case 'x':
						this.sharePopup(`https://x.com/intent/tweet?text=${this.data.title} - ${this.data.url}`, 'Share on X')
						break
					case 'linkedin':
						this.sharePopup(`https://www.linkedin.com/sharing/share-offsite/?url=${this.data.url}`, 'Share on LinkedIn')
						break
					case 'email':
						window.location.href = `mailto:?subject=${this.data.title}&body=${this.data.text} - ${this.data.url}`
						break
					}
      })
    })

		this.root.shadowRoot.querySelector('.share-copy-link')?.addEventListener('click', event => {
			const button = event.target
			const initialValue = button.textContent
			navigator.clipboard.writeText(this.data.url)

			button.textContent = 'Copied!'
			setTimeout(() => { button.textContent = initialValue }, 1000)
		})

    this.root.shadowRoot.querySelector('.close-button')?.addEventListener('click', () => {
      this.destroy()
    })

		document.body.appendChild(this.root)
  }

  destroy () {
		document.body.removeChild(this.root)
  }

	sharePopup (url, title, width, height) {
		const popupWidth = width || 640
		const popupHeight = height || 320
		const popupPosX = window.screenX + window.innerWidth / 2 - popupWidth / 2
		const popupPosY = window.screenY + window.innerHeight / 2 - popupHeight / 2
		const popup = window.open(url, title, `scrollbars=yes, menubar=0, location=0, status=0, width=${popupWidth}, height=${popupHeight}, top=${popupPosY}, left=${popupPosX}`)

		popup.focus()
		return true
	}
}

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
		new PopinShare(this.data)
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
