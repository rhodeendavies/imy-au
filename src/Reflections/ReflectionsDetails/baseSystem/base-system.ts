import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { ReflectionsDetails } from "../reflections-details";
import { BaseReflection } from "models/reflections";

@autoinject
export class BaseSystem {

	@bindable reflection: BaseReflection;

	constructor(public localParent: ReflectionsDetails) {}

	@computedFrom("localParent.dashboardVersion")
	get FullReflection(): boolean {
		return !this.localParent.dashboardVersion;
	}

	@computedFrom("localParent.Course")
	get Course(): string {
		return this.localParent.Course;
	}
}