import { autoinject } from "aurelia-framework";
import { LudusPlanning } from "../ludus-planning";

@autoinject
export class LudusPlanningFeelings {
	
	constructor(private localParent: LudusPlanning) {}

	nextStep() {
		if (this.localParent.model.courseFeelings.rating == null) return;
		this.localParent.nextStep();
	}
}