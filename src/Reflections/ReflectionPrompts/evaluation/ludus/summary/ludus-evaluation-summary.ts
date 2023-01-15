import { autoinject } from "aurelia-framework";
import { LudusEvaluation } from "../ludus-evaluation";

@autoinject
export class BaseEvaluationSummary {

	valid: boolean;

	constructor(private localParent: LudusEvaluation) {}

	submit() {
		if (!this.valid) return;
		this.localParent.submitEvaluation();
	}
}