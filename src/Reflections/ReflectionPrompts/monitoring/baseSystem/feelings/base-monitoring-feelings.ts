import { autoinject } from "aurelia-framework";
import { BaseMonitoring } from "../base-monitoring";

@autoinject
export class BaseMonitoringFeelings {
	
	constructor(private localParent: BaseMonitoring) {}

	nextStep() {
		if (this.localParent.model.courseFeelings.rating == null) return;

		this.localParent.nextStep();
	}
}