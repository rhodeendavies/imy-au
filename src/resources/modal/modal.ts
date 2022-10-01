import { autoinject } from "aurelia-framework";

@autoinject
export class Modal {
	private open: boolean = false;

	toggle() {
		this.open = !this.open;
	}

	get Open(): boolean {
		return this.open;
	}
}