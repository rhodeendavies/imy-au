import { autoinject } from "aurelia-framework";
import { Toast } from "resources/toast/toast";

@autoinject
export class ApplicationState {
	private toast: Toast;

	setToast(_toast) {
		this.toast = _toast;
	}
	
	triggerToast(message: string, seconds: number = 3) {
		this.toast.trigger(message, seconds);
	}
}