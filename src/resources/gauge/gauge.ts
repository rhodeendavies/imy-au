import { autoinject, bindable, computedFrom } from "aurelia-framework";

@autoinject
export class Gauge {

	@bindable value: number;
	@bindable label: string;

	@computedFrom("value")
	get Rotation(): string {
		return `transform: rotate(${180 * this.value / 100}deg)`;
	}
}