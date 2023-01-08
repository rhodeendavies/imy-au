import { autoinject } from "aurelia-framework";
import { BasePlanning } from "../base-planning";

@autoinject
export class BasePlanningFeelings {

	constructor(private localParent: BasePlanning) { }

	nextStep() {
		if (this.localParent.model.courseFeelings.rating == null) return;

		this.localParent.nextStep();
	}
}