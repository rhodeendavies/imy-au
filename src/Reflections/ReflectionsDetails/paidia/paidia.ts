import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { ReflectionsDetails } from "../reflections-details";
import { PaidiaReflection } from "models/reflections";
import { ApplicationState } from "applicationState";

@autoinject
export class Paidia {
	@bindable reflection: PaidiaReflection;

	constructor(private localParent: ReflectionsDetails) { }

	@computedFrom("localParent.dashboardVersion")
	get FullReflection(): boolean {
		return !this.localParent.dashboardVersion;
	}

	@computedFrom("localParent.Course")
	get Course(): string {
		return this.localParent.Course;
	}
}