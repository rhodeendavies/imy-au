import { autoinject } from "aurelia-framework";
import { LudusMonitoring } from "../ludus-monitoring";

@autoinject
export class LudusMonitoringFeelings {
	
	constructor(private localParent: LudusMonitoring) {}

	nextStep() {
		if (this.localParent.model.courseFeelings.rating == null) return;
		this.localParent.nextStep();
	}
}