import { autoinject, computedFrom } from "aurelia-framework";
import { BasePlanning } from "../base-planning";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class BasePlanningFeelings extends ReflectionStep {

	constructor(private localParent: BasePlanning) {
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