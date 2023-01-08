import { autoinject, computedFrom } from "aurelia-framework";
import { AuthenticationService } from "services/authenticationService";
import { PlanningPrompts } from "../planning-prompts";
import { LudusPlanningApiModel } from "models/reflectionsApiModels";
import { ApplicationState } from "applicationState";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes } from "utils/enums";

@autoinject
export class LudusPlanning {
	model: LudusPlanningApiModel;

	constructor(
		private localParent: PlanningPrompts,
		private authService: AuthenticationService,
		private appState: ApplicationState,
		private reflectionsApi: ReflectionsService
	) { }

	attached() {
		this.getPlanning();
	}

	nextStep() {
		this.localParent.nextStep();
		this.submitPlanning(false);
	}

	submitPlanning(completed: boolean = true) {
		this.model.completed = completed;
		this.localParent.submitPlanning(this.model, completed);
	}

	async getPlanning() {
		const currentSection = await this.appState.getCurrentSection();
		let id = currentSection.planningReflectionId;
		if (id == null) {
			id = await this.reflectionsApi.createReflection(this.authService.System, ReflectionTypes.Planning, currentSection.id)
		}
		const reflection = await this.reflectionsApi.getLudusPlanningReflection(id);
		this.model = reflection.answers;
	}

	@computedFrom("authService.Course")
	get Course(): string {
		return this.authService.Course;
	}
}