import { autoinject, computedFrom } from "aurelia-framework";
import { BaseMonitoring } from "../base-monitoring";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class BaseMonitoringFeelings extends ReflectionStep {
	
	constructor(private localParent: BaseMonitoring) {
		super();
		this.stepParent = localParent;
	}

	saveStep() {
		
	}

	@computedFrom("localParent.model.courseFeelings.rating")
	get AllowNext(): boolean {
		return this.localParent.model.courseFeelings.rating != null;
	}
}