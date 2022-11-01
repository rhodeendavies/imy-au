import { autoinject, bindable, computedFrom } from 'aurelia-framework';

@autoinject
export class RatingBox {

	@bindable active: boolean = false;
	@bindable disabled: boolean = false;
	@bindable clickable: boolean = false;

	@computedFrom("active", "disabled", "clickable")
	get Classes(): string {
		let classes = "";
		if (this.active) classes += " active-rating-box";
		if (this.disabled) classes += " disabled-rating-box";
		if (this.clickable) classes += " clickable-rating-box";
		return classes;
	}
}