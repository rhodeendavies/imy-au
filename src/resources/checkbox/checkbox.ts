import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class Checkbox {

	@bindable checkboxOptions: CheckboxOption[] = [];
	@bindable({ defaultBindingMode: bindingMode.twoWay }) values: any[];
	@bindable onChange;
	@bindable label: string = "";
	@bindable id: string = "";

	constructor() {
		this.id = ComponentHelper.CreateId("checkbox");
	}

	checkboxSelected(option: CheckboxOption) {
		if (option.disabled) return;

		option.selected = !option.selected;
		if (option.selected) {
			this.values.push(option.value);
		} else {
			this.values.splice(this.values.indexOf(option), 1);
		}

		if (this.onChange != null) {
			setTimeout(() => {
				this.onChange();
			});
		}
	}

	getCheckboxClasses(option: CheckboxOption): string {
		let classes = "";
		if (option.disabled) classes += " disabled-checkbox";
		if (option.selected) classes += " selected-checkbox";
		return classes;
	}
}

export class CheckboxOption {
	name: string;
	value: any;
	disabled?: boolean;
	selected: boolean;
}