import { autoinject } from "aurelia-framework";
import { PaidiaEvaluation } from "../paidia-evaluation";

@autoinject
export class PaidiaEvaluationSummary {

	constructor(private localParent: PaidiaEvaluation) { }

	submit() {
		this.localParent.submitEvaluation();
	}
}