import { autoinject, computedFrom } from "aurelia-framework";
import { BaseSystemMonitoring } from "models/reflections";
import { AuthenticationService } from "services/authenticationService";
import { MonitoringPrompts } from "../monitoring-prompts";

@autoinject
export class BaseMonitoring {
	model: BaseSystemMonitoring;

	constructor(private localParent: MonitoringPrompts, private authService: AuthenticationService) {}

	attached() {
		this.model = new BaseSystemMonitoring();
	}

	nextStep() {
		this.localParent.nextStep();
	}

	submitMonitoring() {
		this.localParent.submitMonitoring();
	}

	@computedFrom("authService.Course")
	get Course(): string {
		return this.authService.Course;
	}
}