import { autoinject, computedFrom } from "aurelia-framework";
import { BaseSystemPlanning } from "models/reflections";
import { BaseSystem } from "../base-system";

@autoinject
export class BasePlanningDetails {
	constructor(private localParent: BaseSystem) {}

	@computedFrom("localParent.Reflection.id")
	get PlanningReflection(): BaseSystemPlanning {
		return this.localParent.Reflection.planningReflection;
	}
}