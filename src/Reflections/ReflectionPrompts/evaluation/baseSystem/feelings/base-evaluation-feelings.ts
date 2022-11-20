import { autoinject, computedFrom } from "aurelia-framework";
import { BaseEvaluation } from "../base-evaluation";

@autoinject
export class BaseEvaluationFeelings {

	valid: boolean;
	
	constructor(private localParent: BaseEvaluation) {}

	nextStep() {
		if (!this.AllowNext) return;

		this.localParent.nextStep();
	}

	@computedFrom("valid", "localParent.model.feeling")
	get AllowNext() {
		return this.valid && this.localParent.model.feeling != null;
	}
}