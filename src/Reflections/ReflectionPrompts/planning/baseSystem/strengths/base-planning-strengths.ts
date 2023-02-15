import { autoinject, computedFrom } from "aurelia-framework";
import { BasePlanning } from "../base-planning";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class BasePlanningStrengths extends ReflectionStep {

	valid: boolean;

	constructor(private localParent: BasePlanning) {
		super();
		this.stepParent = localParent;
	}

	saveStep() {
		
	}

	@computedFrom("valid")
	get AllowNext(): boolean {
		return this.valid;
	}
}