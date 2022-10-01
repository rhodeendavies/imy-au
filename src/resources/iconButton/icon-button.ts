import { autoinject, bindable } from "aurelia-framework";

@autoinject
export class IconButton {

	@bindable icon: string = "";
	
}