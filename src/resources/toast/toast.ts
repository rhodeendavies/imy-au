import { autoinject } from "aurelia-framework";

@autoinject
export class Toast {
	private show: boolean = false;
	private message: string = "";

	trigger(_message: string, seconds: number) {
		this.message = _message;
		this.show = true;
		setTimeout(() => {
			this.show = false
		}, seconds * 1000);
	}
}