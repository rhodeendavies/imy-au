import { autoinject, bindable, bindingMode } from 'aurelia-framework';
import { ComponentHelper } from 'utils/componentHelper';

@autoinject
export class RadioButton {

	@bindable options: RadioOption[] = [];
	@bindable({ defaultBindingMode: bindingMode.twoWay }) value: any;
	@bindable onChange;
	@bindable label: string = "";
	@bindable id: string = "";

	constructor() {
		this.id = ComponentHelper.CreateId("radioButton");
	}

	optionSelected(option: RadioOption) {
		if (option.disabled) return;

		this.options.forEach(x => x.selected = false);
		option.selected = true;
		this.value = option.value;

		if (this.onChange != null) {
			setTimeout(() => {
				this.onChange();
			});
		}
	}

	valueChanged() {
		this.options.forEach(x => x.selected = x.value == this.value);
	}
}

export class RadioOption {
	name: string;
	value: any;
	disabled?: boolean;
	selected?: boolean;
}