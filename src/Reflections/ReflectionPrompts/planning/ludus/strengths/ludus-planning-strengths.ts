import { autoinject } from "aurelia-framework";
import { LudusPlanning } from "../ludus-planning";

@autoinject
export class LudusPlanningStrengths {

	constructor(private localParent: LudusPlanning) {}

	nextStep() {
		this.localParent.nextStep();
	}
}