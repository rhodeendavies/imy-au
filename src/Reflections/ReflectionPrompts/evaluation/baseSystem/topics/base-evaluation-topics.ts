import { autoinject } from "aurelia-framework";
import { BaseEvaluation } from "../base-evaluation";

@autoinject
export class BaseEvaluationTopics {

	constructor(private localParent: BaseEvaluation) {}

	nextStep() {
		this.localParent.nextStep();
	}
}