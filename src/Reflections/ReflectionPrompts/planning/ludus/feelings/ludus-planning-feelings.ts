import { autoinject } from "aurelia-framework";
import { LudusPlanning } from "../ludus-planning";

@autoinject
export class LudusPlanningFeelings {
	
	constructor(private localParent: LudusPlanning) {}

	nextStep() {
		if (this.localParent.model.feeling == null) return;

		this.localParent.nextStep();
	}
}