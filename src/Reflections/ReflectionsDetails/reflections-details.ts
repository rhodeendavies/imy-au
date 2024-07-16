import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Reflections } from "Reflections/reflections";
import { BaseReflection, LudusReflection, PaidiaReflection } from "models/reflections";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionSections, Systems } from "utils/enums";

@autoinject
export class ReflectionsDetails {

	@bindable baseReflection: BaseReflection;
	@bindable ludusReflection: LudusReflection;
	@bindable paidiaReflection: PaidiaReflection;
	@bindable dashboardVersion: boolean = false;
	activeSection: number = ReflectionSections.Planning;

	constructor(private localParent: Reflections, private authService: AuthenticationService) {}

	@computedFrom("activeSection")
	get ShowPlanning(): boolean {
		return this.activeSection == ReflectionSections.Planning;
	}

	@computedFrom("activeSection")
	get ShowMonitoring(): boolean {
		return this.activeSection == ReflectionSections.Monitoring;
	}

	@computedFrom("activeSection")
	get ShowEvaluating(): boolean {
		return this.activeSection == ReflectionSections.Evaluating;
	}

	@computedFrom("authService.System")
	get ShowBaseSystem(): boolean {
		return this.authService.System == Systems.Base;
	}

	@computedFrom("authService.System")
	get ShowLudus(): boolean {
		return this.authService.System == Systems.Ludus;
	}

	@computedFrom("authService.System")
	get ShowPaidia(): boolean {
		return this.authService.System == Systems.Paidia;
	}

	@computedFrom("authService.Course")
	get Course(): string {
		return this.authService.Course;
	}
}