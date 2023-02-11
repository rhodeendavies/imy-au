import { autoinject } from "aurelia-framework";
import { BaseDaily } from "../base-daily";

@autoinject
export class BaseFeelings {

	constructor(private localParent: BaseDaily) {}

	nextStep() {
		if (this.localParent.model.courseFeelings.rating == null) return;
		this.localParent.nextStep();
	}
}