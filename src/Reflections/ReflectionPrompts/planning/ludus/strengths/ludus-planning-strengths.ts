import { autoinject } from "aurelia-framework";
import { LudusPlanning } from "../ludus-planning";

@autoinject
export class LudusPlanningStrengths {

	valid: boolean;

	constructor(private localParent: LudusPlanning) {}

	nextStep() {
		if (!this.valid) return;
		this.localParent.nextStep();
	}
}