import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { BaseSystemReflection } from "models/reflections";
import { AuthenticationService } from "services/authenticationService";
import { EnumHelper } from "utils/enumHelper";
import { ReflectionsDetails } from "../reflections-details";

@autoinject
export class BaseSystem {

	@bindable reflection: BaseSystemReflection;

	constructor(public localParent: ReflectionsDetails, private authService: AuthenticationService) {}

	attached() {
		this.initReflection();
	}
	
	initReflection() {
		if (this.reflection != null) {
			this.reflection.planningReflection?.strategies.forEach(x => {
				x.icon = EnumHelper.GetCategoryIcon(x.title);
				x.ratingPercentage = Math.ceil(x.rating / 3 * 100);
			});
			this.reflection.monitoringReflection?.strategies.forEach(x => {
				x.icon = EnumHelper.GetCategoryIcon(x.title);
				x.ratingPercentage = Math.ceil(x.rating / 3 * 100);
			});
			this.reflection.evaluatingReflection?.strategies.forEach(x => {
				x.icon = EnumHelper.GetCategoryIcon(x.title);
				x.ratingPercentage = Math.ceil(x.rating / 3 * 100);
			});
		}
	}

	@computedFrom("localParent.dashboardVersion")
	get FullReflection(): boolean {
		return !this.localParent.dashboardVersion;
	}

	@computedFrom("authService.Course")
	get Course(): string {
		return this.authService.Course;
	}

	@computedFrom("reflection.id")
	get Reflection(): BaseSystemReflection {
		this.initReflection();
		return this.reflection;
	}
}