import { autoinject, computedFrom } from "aurelia-framework";
import { LudusDaily } from "../ludus-daily";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class LudusFeelings extends ReflectionStep {

	constructor(private localParent: LudusDaily) {
		super();
		this.stepParent = localParent;
		this.saveOnStep = false;
	}

	saveStep() {
		
	}

	@computedFrom("localParent.model.courseFeelings.rating")
	get AllowNext(): boolean {
		return this.localParent.model.courseFeelings.rating != null;
	}
}