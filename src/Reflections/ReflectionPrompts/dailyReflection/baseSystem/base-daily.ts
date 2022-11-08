import { autoinject } from "aurelia-framework";
import { DailyPrompts } from "../daily-prompts";

@autoinject
export class BaseDaily {

	constructor(private localParent: DailyPrompts) {}

	nextStep() {
		this.localParent.nextStep();
	}

	submitDaily() {
		this.localParent.submitDaily();
	}
}