import { autoinject } from "aurelia-framework";
import { LudusDaily } from "../ludus-daily";

@autoinject
export class LudusFeelings {

	constructor(private localParent: LudusDaily) {}

	nextStep() {
		if (this.localParent.model.courseFeelings.rating == null) return;
		this.localParent.nextStep();
	}
}