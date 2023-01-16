import { bindingMode, computedFrom } from "aurelia-binding";
import { autoinject } from "aurelia-dependency-injection";
import { bindable } from "aurelia-templating";

@autoinject
export class PercentageSlider {

	@bindable({ defaultBindingMode: bindingMode.twoWay }) percentage: number;
	@bindable showCircle: boolean = true;
	@bindable showValues: boolean = true;
	@bindable lowText: string = "Not great";
	@bindable highText: string = "Excellent";
	clicking: boolean = false;
	percentageCircleSize: number = 15;

	attached() {
		const root = document.documentElement;
		root.style.setProperty('--slider-value-circle', `${this.percentageCircleSize}px`);
	}

	selectPercentage() {
		this.clicking = false;
	}

	mouseDown() {
		this.clicking = true;
	}

	mouseMove(event) {
		if (!this.clicking) return;

		const rect = event.currentTarget.getBoundingClientRect();
		const barWidth = rect.width;
		const fraction = (event.pageX - rect.left - (this.percentageCircleSize / 4)) / barWidth;
		this.percentage = Math.ceil(fraction * 100);
	}

	@computedFrom("percentage")
	get Left(): string {
		if (this.percentage == null) return "opacity: 0";
		return `left: ${(this.percentage)}%`;
	}
}