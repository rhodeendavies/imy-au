import { autoinject, bindable, bindingMode, computedFrom } from 'aurelia-framework';
import { ComponentHelper } from 'utils/componentHelper';
import { PopupPosition } from 'utils/enums';

@autoinject
export class RadioButton {

	@bindable options: RadioOption[] = [];
	@bindable({ defaultBindingMode: bindingMode.twoWay }) value: any;
	@bindable({ defaultBindingMode: bindingMode.twoWay }) name: string;
	@bindable onChange;
	@bindable label: string = "";
	@bindable id: string = "";
	@bindable type: RadioButtonTypes = RadioButtonTypes.normal;
	@bindable position: PopupPosition = PopupPosition.right;

	hovering: boolean;

	constructor() {
		this.id = ComponentHelper.CreateId("radioButton");
	}

	nameChanged(newValue) {
		this.options?.forEach(x => x.selected = newValue == x.name);
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

	enableHover(option: RadioOption) {
		option.hovered = true;
		this.hovering = true;
	}

	disableHover(option: RadioOption) {
		option.hovered = false;
		this.hovering = false;
	}

	@computedFrom("type")
	get Normal(): boolean {
		return this.type == RadioButtonTypes.normal || this.type == RadioButtonTypes.inline || this.type == RadioButtonTypes.stars;
	}

	@computedFrom("type")
	get Blocks(): boolean {
		return this.type == RadioButtonTypes.blocks;
	}

	@computedFrom("type")
	get Stars(): boolean {
		return this.type == RadioButtonTypes.stars;
	}

	@computedFrom("type")
	get Inline(): boolean {
		return this.type == RadioButtonTypes.inline;
	}

	@computedFrom("hovering", "type", "name")
	get Styles(): string {
		let classes = "";
		if (this.hovering) classes += " radio-options-hovering";
		if (this.Inline || this.Stars) classes += " radio-options-inline";
		if (this.Stars) classes += " radio-options-stars";
		if (this.name == null) classes += " empty-stars";
		return classes;
	}
}

export class RadioOption {
	name: any;
	subText?: string;
	popup?: string;
	value: any;
	disabled?: boolean;
	selected?: boolean;
	hovered?: boolean;
}

enum RadioButtonTypes {
	normal = "normal",
	blocks = "blocks",
	inline= "inline",
	stars = "stars"
}