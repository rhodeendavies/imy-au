import { autoinject } from "aurelia-framework";
import { BaseMonitoring } from "../base-monitoring";

@autoinject
export class BaseMonitoringQuestions {

	valid: boolean;

	constructor(private localParent: BaseMonitoring) {}

	nextStep() {
		if (!this.valid) return;
		this.localParent.nextStep();
	}
}