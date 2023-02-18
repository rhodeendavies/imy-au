import { autoinject } from "aurelia-framework";

@autoinject
export class Toast {
	private show: boolean = false;
	private message: string = "";

	trigger(_message: string, seconds: number, permanent: boolean = false) {
		this.message = _message;
		this.show = true;
		if (!permanent) {
			setTimeout(() => {
				this.show = false
			}, seconds * 1000);
		}
	}
}