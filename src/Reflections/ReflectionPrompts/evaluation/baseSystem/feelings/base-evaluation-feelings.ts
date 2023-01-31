import { autoinject, computedFrom } from "aurelia-framework";
import { BaseEvaluation } from "../base-evaluation";
import { FeelingsSummary } from "models/reflectionsResponses";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class BaseEvaluationFeelings {

	valid: boolean;
	feelingsSummary: FeelingsSummary[];
	
	constructor(private localParent: BaseEvaluation) {}

	attached() {
		this.feelingsSummary = ComponentHelper.GetFeelingsSummary(this.localParent.questions.courseFeelings)
	}

	nextStep() {
		if (!this.AllowNext) return;
		this.localParent.nextStep();
	}

	@computedFrom("valid", "localParent.model.courseFeelings.rating")
	get AllowNext() {
		return this.valid && this.localParent.model.courseFeelings.rating != null;
	}
}