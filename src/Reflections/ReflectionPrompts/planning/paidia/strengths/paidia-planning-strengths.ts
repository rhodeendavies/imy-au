import { autoinject } from "aurelia-framework";
import { PaidiaPlanning } from "../paidia-planning";

@autoinject
export class PaidiaPlanningStrengths {

	constructor(private localParent: PaidiaPlanning) {}

	nextStep() {
		this.localParent.nextStep();
	}
}