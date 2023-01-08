import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsDetails } from "../reflections-details";
import { BaseReflection, Strategy } from "models/reflections";

@autoinject
export class BaseSystem {

	@bindable reflection: BaseReflection;

	constructor(public localParent: ReflectionsDetails, private authService: AuthenticationService) {}

	getRatingPercentage(strategy: Strategy): number {
		return Math.ceil(strategy.rating / 3 * 100)
	}

	@computedFrom("localParent.dashboardVersion")
	get FullReflection(): boolean {
		return !this.localParent.dashboardVersion;
	}

	@computedFrom("authService.Course")
	get Course(): string {
		return this.authService.Course;
	}
}