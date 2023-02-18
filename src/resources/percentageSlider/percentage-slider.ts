import { bindingMode, computedFrom } from "aurelia-binding";
import { autoinject } from "aurelia-dependency-injection";
import { bindable } from "aurelia-templating";

@autoinject
export class PercentageSlider {

	@bindable({ defaultBindingMode: bindingMode.twoWay }) percentage: number = null;
	@bindable showCircle: boolean = true;
	@bindable showValues: boolean = true;
	@bindable lowText: string = "Not great";
	@bindable highText: string = "Excellent";
	@bindable onChange;
	loaded: boolean = false;

	attached() {
		this.loaded = false;
		setTimeout(() => {
			this.loaded = true;
		}, 10);
	}

	onChangeTrigger() {
		if (this.onChange != null) {
			setTimeout(() => {
				this.onChange();
			});
		}
	}

	@computedFrom("percentage")
	get Left(): string {
		if (this.percentage == null) return "opacity: 0";
		return `left: ${(this.percentage)}%`;
	}
}