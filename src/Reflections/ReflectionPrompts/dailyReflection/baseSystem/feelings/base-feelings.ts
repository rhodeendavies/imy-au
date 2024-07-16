import { autoinject, computedFrom } from "aurelia-framework";
import { BaseDaily } from "../base-daily";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class BaseFeelings extends ReflectionStep {

	constructor(private localParent: BaseDaily) {
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