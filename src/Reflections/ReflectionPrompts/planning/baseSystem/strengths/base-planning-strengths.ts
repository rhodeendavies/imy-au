import { autoinject } from "aurelia-framework";
import { BasePlanning } from "../base-planning";

@autoinject
export class BasePlanningStrengths {

	valid: boolean;

	constructor(private localParent: BasePlanning) {}

	nextStep() {
		if (!this.valid) return;
		this.localParent.nextStep();
	}
}