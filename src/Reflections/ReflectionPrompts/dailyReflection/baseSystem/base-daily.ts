import { autoinject } from "aurelia-framework";
import { BaseSystemDaily } from "models/reflections";
import { DailyPrompts } from "../daily-prompts";

@autoinject
export class BaseDaily {

	model: BaseSystemDaily;

	constructor(private localParent: DailyPrompts) {}

	attached() {
		this.model = new BaseSystemDaily();
	}

	nextStep() {
		this.localParent.nextStep();
	}

	submitDaily() {
		this.localParent.submitDaily();
	}
}