import { bindingMode, computedFrom } from "aurelia-binding";
import { autoinject } from "aurelia-dependency-injection";
import { bindable } from "aurelia-templating";

@autoinject
export class Slider {

	@bindable({ defaultBindingMode: bindingMode.twoWay }) value: number;
	ticks: number[] = [1, 2, 3, 4, 5];

	attached() {
		if (this.value == null) {
			this.value = 3;
		}
	}

	selectTick(tick: number) {
		this.value = tick;
	}

	@computedFrom("value")
	get Left(): string {
		if (this.value == null) return "opacity: 0";
		return `left: ${(this.value - 1) / 4 * 100}%`;
	}
}