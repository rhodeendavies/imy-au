import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class InputList {

	@bindable label: string = "";
	@bindable subLabel: string = "";
	@bindable({ defaultBindingMode: bindingMode.twoWay }) values: string[];
	@bindable onChange;

	inputs: InputListItem[];
	inputListId: string = "";

	constructor() {
		this.inputListId = ComponentHelper.CreateId("inputList");
	}

	addInput() {
		this.inputs.push(new InputListItem(this.inputs.length));
	}

	removeInput(listItem: InputListItem) {
		this.inputs.slice(this.inputs.indexOf(listItem), 1);
	}

	updateValues() {
		this.values = this.inputs.map(x => x.value);
		if (this.onChange != null) {
			setTimeout(() => {
				this.onChange();
			}, 10);
		}
	}

	@computedFrom("inputs.length")
	get LastIndex(): number {
		return this.inputs.length - 1;
	}
}

export class InputListItem {
	value: string;
	id: number;

	constructor(_id: number) {
		this.value = "";
		this.id = _id;
	}
}