import { LitElement, css, html } from 'lit';
import { property, query } from 'lit/decorators.js';

declare global {
	interface HTMLElementTagNameMap {
		'wc-video-categories': VideoCategoriesElement;
	}
}

export class VideoCategoriesElement extends LitElement {
	static define(tag = 'wc-video-categories') {
		if (!customElements.get(tag)) {
			customElements.define(tag, this);
		}
	}

	@property({ type: Array }) categories: string[] = [];

	@query('#input-category') inputCategory!: HTMLInputElement;

	#onDeleteClicked(category: string) {
		this.dispatchEvent(new CustomEvent('delete-clicked', { detail: category }));
	}

	#onSubmit(e: SubmitEvent) {
		e.preventDefault();
		const category = this.inputCategory.value;
		if (!category) return;
		this.dispatchEvent(new CustomEvent('add-category', { detail: category }));
		this.inputCategory.value = '';
	}

	#onCategoryClick(e: Event, index: number) {
		if (e.composedPath()[0] instanceof HTMLButtonElement || index === 0) {
			return;
		}
		const categories = this.categories.slice();
		const temp = categories[0];
		categories[0] = categories[index];
		categories[index] = temp;

		this.dispatchEvent(new CustomEvent('reorder-categories', { detail: categories }));
	}

	render() {
		return html`<div class="video-categories">${this.header()}${this.list()}</div>`;
	}

	protected header() {
		return html`<header>
			<form @submit=${this.#onSubmit}>
				<div>
					<label for="input-category">Add category</label>
					<input autofocus type="text" id="input-category" />
					<button>Submit</button>
				</div>
			</form>
		</header>`;
	}

	protected list() {
		return html`
			<ul class="list">
				${this.categories.map((category, index) => this.categoryEl(category, index))}
			</ul>
		`;
	}

	protected categoryEl(category: string, index: number) {
		return html`<li @click=${(e: Event) => this.#onCategoryClick(e, index)} class="category">
			<p>${category}</p>
			<button @click=${this.#onDeleteClicked.bind(this, category)}>Delete</button>
		</li>`;
	}

	static styles = css`
		* {
			padding: 0;
			margin: 0;
		}

		.video-categories {
			padding: 1rem;
			border: 3px solid #222;
			width: 400px;
			overflow-x: hidden;
		}

		.list {
			margin-block-start: 0.6rem;
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
		}

		.category {
			display: flex;
			align-items: center;
			gap: 1rem;
			cursor: pointer;
		}

		button {
			font: inherit;
			padding: 0.1rem;
		}
	`;
}
