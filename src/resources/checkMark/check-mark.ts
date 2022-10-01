import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class CheckMark {

	@bindable({ defaultBindingMode: bindingMode.twoWay }) checked: boolean = false;
	@bindable disabled: boolean = false;
	@bindable id: string = "";

	constructor() {
		this.id = ComponentHelper.CreateId("checkMark");
	}

	toggleCheck() {
		this.checked = !this.checked
	}
}