import { autoinject, bindable, bindingMode, computedFrom } from 'aurelia-framework';
import { ComponentHelper } from 'utils/componentHelper';

@autoinject
export class RadioButton {

	@bindable options: RadioOption[] = [];
	@bindable({ defaultBindingMode: bindingMode.twoWay }) value: any;
	@bindable({ defaultBindingMode: bindingMode.twoWay }) name: string;
	@bindable onChange;
	@bindable label: string = "";
	@bindable id: string = "";
	@bindable type: RadioButtonTypes = RadioButtonTypes.normal;

	constructor() {
		this.id = ComponentHelper.CreateId("radioButton");
	}

	attached() {
		if (this.options == null) return;
		const tempList = this.options.map(x => {
			const newItem: RadioOption = {
				name: x.name,
				subText: x.subText,
				value: x.value,
				disabled: x.disabled,
				selected: x.selected
			}
			return newItem;
		});
		this.options = tempList;
	}

	optionSelected(option: RadioOption) {
		if (option.disabled) return;

		this.options.forEach(x => x.selected = false);
		option.selected = true;
		this.value = option.value;
		this.name = option.name;

		if (this.onChange != null) {
			setTimeout(() => {
				this.onChange();
			});
		}
	}

	valueChanged() {
		this.options?.forEach(x => x.selected = x.value == this.value);
	}

	@computedFrom("type")
	get Blocks(): boolean {
		return this.type == RadioButtonTypes.blocks;
	}

	@computedFrom("type")
	get Inline(): boolean {
		return this.type == RadioButtonTypes.inline;
	}
}

export class RadioOption {
	name: string;
	subText?: string;
	value: any;
	disabled?: boolean;
	selected?: boolean;
}

enum RadioButtonTypes {
	normal = "normal",
	blocks = "blocks",
	inline= "inline"
}