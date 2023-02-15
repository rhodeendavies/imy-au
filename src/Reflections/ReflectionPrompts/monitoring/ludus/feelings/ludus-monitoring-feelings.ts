import { autoinject, computedFrom } from "aurelia-framework";
import { LudusMonitoring } from "../ludus-monitoring";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class LudusMonitoringFeelings extends ReflectionStep {

	constructor(private localParent: LudusMonitoring) {
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