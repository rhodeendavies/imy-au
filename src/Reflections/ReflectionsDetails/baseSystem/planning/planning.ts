import { autoinject } from "aurelia-framework";
import { BaseSystemPlanning } from "models/reflections";
import { BaseSystem } from "../base-system";

@autoinject
export class Planning {
	planningReflection: BaseSystemPlanning;

	constructor(private localParent: BaseSystem) {}

	attached() {
		this.planningReflection = this.localParent.reflection.planningReflection;
	}
}