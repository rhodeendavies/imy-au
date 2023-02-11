import { autoinject, computedFrom } from "aurelia-framework";
import { AuthenticationService } from "services/authenticationService";
import { PlanningPrompts } from "../planning-prompts";
import { BasePlanningApiModel } from "models/reflectionsApiModels";
import { ReflectionTypes } from "utils/enums";
import { ApplicationState } from "applicationState";
import { ReflectionsService } from "services/reflectionsService";
import { log } from "utils/log";

@autoinject
export class BasePlanning {

	model: BasePlanningApiModel;

	constructor(
		private localParent: PlanningPrompts,
		private authService: AuthenticationService,
		private appState: ApplicationState,
		private reflectionsApi: ReflectionsService
	) { }

	attached() {
		this.localParent.modelLoaded = false;
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
		try {
			this.localParent.busy.on();
			const currentSection = await this.appState.getCurrentSection();
			let id = currentSection.planningReflectionId;
			if (id == null) {
				id = await this.reflectionsApi.createReflection(this.authService.System, ReflectionTypes.Planning, currentSection.id)
			}
			this.localParent.reflectionId = id;
			const reflection = await this.reflectionsApi.getBasePlanningReflection(id);
			this.model = reflection.answers;
			this.localParent.modelLoaded = true;
		} catch (error) {
			log.error(error);
		} finally {
			this.localParent.busy.off();
		}
	}

	@computedFrom("authService.Course")
	get Course(): string {
		return this.authService.Course;
	}
}