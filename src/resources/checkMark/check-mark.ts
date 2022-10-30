import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class CheckMark {

	@bindable({ defaultBindingMode: bindingMode.twoWay }) checked: boolean = false;
	@bindable disabled: boolean = false;
	@bindable id: string = "";
	@bindable onChange;
	@bindable stopPropagation: boolean = true;

	constructor() {
		this.id = ComponentHelper.CreateId("checkMark");
	}

	toggleCheck(event: Event) {
		if (this.disabled) return;

		if (this.stopPropagation) {
			event.stopPropagation();
		}

		this.checked = !this.checked;
		if (this.onChange != null) {
			setTimeout(() => {
				this.onChange();
			});
		}
	}


	@computedFrom("checked")
	get CheckMarkClasses(): string {
		let classes = "";
		if (this.checked) classes += " checked";
		return classes;
	}
}