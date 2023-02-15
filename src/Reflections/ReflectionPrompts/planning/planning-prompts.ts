import { ApplicationState } from "applicationState";
import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, computedFrom } from "aurelia-framework";
import { ReflectionApiModel } from "models/reflectionsApiModels";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { Events } from "utils/constants";
import { ReflectionTypes } from "utils/enums";
import { ReflectionPrompt } from "../reflection-step";

@autoinject
export class PlanningPrompts extends ReflectionPrompt {

	constructor(
		private appState: ApplicationState,
		private reflectionsApi: ReflectionsService,
		authService: AuthenticationService,
		ea: EventAggregator
	) {
		super(authService, ea);
		this.event = Events.PlanningTriggered;
	}
	
	async submit(model: ReflectionApiModel, completed: boolean) {
		const result = await this.reflectionsApi.submitReflection(this.authService.System, ReflectionTypes.Planning, this.reflectionId, model);
		if (!result) {
			this.appState.triggerToast("Failed to save reflection...");
			return;
		}
		if (completed) {
			this.appState.closePlanning();
			this.isOpen = false;
		}
	}

	@computedFrom("activeSection", "busy.active", "modelLoaded")
	get ShowFeelings(): boolean {
		return this.activeSection == PlanningSections.Feelings && !this.busy.active && this.modelLoaded;
	}

	@computedFrom("activeSection", "busy.active", "modelLoaded")
	get ShowStrengths(): boolean {
		return this.activeSection == PlanningSections.Strengths && !this.busy.active && this.modelLoaded;
	}

	@computedFrom("activeSection", "busy.active", "modelLoaded")
	get ShowLearningStrategies(): boolean {
		return this.activeSection == PlanningSections.LearningStrategies && !this.busy.active && this.modelLoaded;
	}
}

enum PlanningSections {
	Overview = 0,
	Feelings = 1,
	Strengths = 2,
	LearningStrategies = 3
}