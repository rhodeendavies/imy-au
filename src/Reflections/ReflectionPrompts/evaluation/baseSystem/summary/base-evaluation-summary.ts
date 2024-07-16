import { autoinject, computedFrom } from "aurelia-framework";
import { BaseEvaluation } from "../base-evaluation";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class BaseEvaluationSummary extends ReflectionStep {

	valid: boolean;

	constructor(private localParent: BaseEvaluation) {
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