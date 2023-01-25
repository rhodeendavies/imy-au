import { autoinject, computedFrom } from "aurelia-framework";
import { BaseEvaluation } from "../base-evaluation";

@autoinject
export class BaseEvaluationFeelings {

	valid: boolean;
	feelingsSummary: FeelingsSummary[];
	
	constructor(private localParent: BaseEvaluation) {}

	attached() {
		this.feelingsSummary = this.localParent.questions.courseFeelings.rating.map((x, index) => {
			return {
				rating: x,
				createdAt: this.localParent.questions.courseFeelings.createdAt[index]
			}
		})
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

class FeelingsSummary {
	rating: number;
	createdAt: Date;
}