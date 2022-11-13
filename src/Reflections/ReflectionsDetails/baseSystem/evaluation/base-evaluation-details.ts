import { autoinject, computedFrom } from "aurelia-framework";
import { BaseSystemEvaluating } from "models/reflections";
import { BaseSystem } from "../base-system";

@autoinject
export class BaseEvaluationDetails {
	constructor(private localParent: BaseSystem) {}

	@computedFrom("localParent.Reflection.id")
	get EvaluatingReflection(): BaseSystemEvaluating {
		return this.localParent.Reflection.evaluatingReflection;
	}
}