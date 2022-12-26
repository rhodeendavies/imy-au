import { autoinject, computedFrom } from "aurelia-framework";
import { LudusSystemPlanning } from "models/reflections";
import { AuthenticationService } from "services/authenticationService";
import { PlanningPrompts } from "../planning-prompts";

@autoinject
export class LudusPlanning {
	model: LudusSystemPlanning;

	constructor(private localParent: PlanningPrompts, private authService: AuthenticationService) {}

	attached() {
		this.model = new LudusSystemPlanning();
	}

	nextStep() {
		this.localParent.nextStep();
	}

	submitPlanning() {
		this.localParent.submitPlanning();
	}

	@computedFrom("authService.Course")
	get Course(): string {
		return this.authService.Course;
	}
}