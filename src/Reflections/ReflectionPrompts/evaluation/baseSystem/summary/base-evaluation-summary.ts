import { autoinject } from "aurelia-framework";
import { BaseEvaluation } from "../base-evaluation";

@autoinject
export class BaseEvaluationSummary {

	valid: boolean;

	constructor(private localParent: BaseEvaluation) {}

	submit() {
		if (!this.valid) return;
		this.localParent.submitEvaluation();
	}
}