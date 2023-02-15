import { autoinject, computedFrom } from "aurelia-framework";
import { BaseEvaluation } from "../base-evaluation";
import { FeelingsSummary } from "models/reflectionsResponses";
import { ComponentHelper } from "utils/componentHelper";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class BaseEvaluationFeelings extends ReflectionStep {

	valid: boolean;
	feelingsSummary: FeelingsSummary[];
	
	constructor(private localParent: BaseEvaluation) {
		super();
		this.stepParent = localParent;
	}

	attached() {
		this.feelingsSummary = ComponentHelper.GetFeelingsSummary(this.localParent.questions.courseFeelings)
	}

	saveStep() {
	}

	@computedFrom("valid", "localParent.model.courseFeelings.rating")
	get AllowNext() {
		return this.valid && this.localParent.model.courseFeelings.rating != null;
	}
}