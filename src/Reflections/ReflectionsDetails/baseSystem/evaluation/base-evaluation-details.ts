import { autoinject } from "aurelia-framework";
import { BaseSystemEvaluating } from "models/reflections";
import { BaseSystem } from "../base-system";

@autoinject
export class BaseEvaluationDetails {
	evaluatingReflection: BaseSystemEvaluating;

	constructor(private localParent: BaseSystem) {}

	attached() {
		this.evaluatingReflection = this.localParent.reflection.evaluatingReflection;
	}
}