import { autoinject, bindable, bindingMode } from 'aurelia-framework';
import { ComponentHelper } from 'utils/componentHelper';

@autoinject
export class RadioButton {

	@bindable radioOptions: RadioOption[] = [];
	@bindable({ defaultBindingMode: bindingMode.twoWay }) value: any;
	@bindable onChange;
	@bindable label: string = "";
	@bindable id: string = "";

	constructor() {
		this.id = ComponentHelper.CreateId("radioButton");
	}

	radioOptionSelected(option: RadioOption) {
		if (option.disabled) return;
		
		this.radioOptions.forEach(x => x.selected = false);
		option.selected = true;
		this.value = option.value;

		if (this.onChange != null) {
			setTimeout(() => {
				this.onChange();
			}, 0);
		}
	}

	getOptionClasses(option: RadioOption): string {
		let classes = "";
		if (option.disabled) classes += " disabled-radio-option";
		if (option.selected) classes += " selected-radio-option";
		return classes;
	}
}

export class RadioOption {
	name: string;
	value: any;
	disabled?: boolean;
	selected: boolean;
}