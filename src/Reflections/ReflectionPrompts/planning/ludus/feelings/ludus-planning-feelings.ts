import { autoinject, computedFrom } from "aurelia-framework";
import { LudusPlanning } from "../ludus-planning";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class LudusPlanningFeelings extends ReflectionStep {
	
	constructor(private localParent: LudusPlanning) {
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