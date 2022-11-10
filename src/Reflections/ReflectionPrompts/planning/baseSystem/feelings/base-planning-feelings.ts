import { autoinject } from "aurelia-framework";
import { BasePlanning } from "../base-planning";

@autoinject
export class BasePlanningFeelings {
	
	constructor(private localParent: BasePlanning) {}

	nextStep() {
		if (this.localParent.model.feeling == null) return;

		this.localParent.nextStep();
	}
}