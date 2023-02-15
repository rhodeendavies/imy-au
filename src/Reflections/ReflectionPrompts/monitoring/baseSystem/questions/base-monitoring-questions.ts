import { autoinject, computedFrom } from "aurelia-framework";
import { BaseMonitoring } from "../base-monitoring";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class BaseMonitoringQuestions extends ReflectionStep {

	valid: boolean;

	constructor(private localParent: BaseMonitoring) {
		super();
		this.stepParent = localParent;
	}

	saveStep() {
		
	}

	@computedFrom("valid")
	get AllowNext(): boolean {
		return !this.valid;
	}
}