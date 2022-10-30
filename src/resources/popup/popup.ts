import { autoinject, bindable } from "aurelia-framework";

@autoinject
export class Popup {

	@bindable icon: string = "help";
	
}