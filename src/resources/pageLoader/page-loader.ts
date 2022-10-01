import { autoinject, bindable } from "aurelia-framework";

@autoinject
export class PageLoader {
	@bindable text: string = "Loading";
}