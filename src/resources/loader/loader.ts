import { autoinject, bindable } from "aurelia-framework";

@autoinject
export class Loader {
	@bindable busy: boolean = false;
	@bindable text: string = "Loading";
}