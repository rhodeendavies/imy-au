import { ApplicationState } from "applicationState";
import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, computedFrom } from "aurelia-framework";
import { BaseEvaluatingApiModel, LudusEvaluatingApiModel, PaidiaEvaluatingApiModel } from "models/reflectionsApiModels";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes } from "utils/enums";
import { ReflectionPrompt } from "../reflection-step";

@autoinject
export class EvaluationPrompts extends ReflectionPrompt {

	constructor(
		private appState: ApplicationState,
		authService: AuthenticationService,
		private reflectionsApi: ReflectionsService,
		ea: EventAggregator
	) {
		super(authService, ea);
	}

	async submit(model: BaseEvaluatingApiModel | LudusEvaluatingApiModel | PaidiaEvaluatingApiModel, completed: boolean) {
		const result = await this.reflectionsApi.submitReflection(this.authService.System, ReflectionTypes.Evaluating, this.reflectionId, model);
		if (!result) {
			this.appState.triggerToast("Failed to save reflection...");
			return;
		}
		if (completed) {
			this.appState.closeEvaluation();
			this.isOpen = false;
		}
	}

	@computedFrom("activeSection", "busy.active", "modelLoaded")
	get ShowFeelings(): boolean {
		return this.activeSection == EvaluationSections.Feelings && !this.busy.active && this.modelLoaded;
	}

	@computedFrom("activeSection", "busy.active", "modelLoaded")
	get ShowTopics(): boolean {
		return this.activeSection == EvaluationSections.Topics && !this.busy.active && this.modelLoaded;
	}

	@computedFrom("activeSection", "busy.active", "modelLoaded")
	get ShowLearningStrategies(): boolean {
		return this.activeSection == EvaluationSections.LearningStrategies && !this.busy.active && this.modelLoaded;
	}

	@computedFrom("activeSection", "busy.active", "modelLoaded")
	get ShowSummary(): boolean {
		return this.activeSection == EvaluationSections.Summary && !this.busy.active && this.modelLoaded;
	}
}

enum EvaluationSections {
	Overview = 0,
	Feelings = 1,
	Topics = 2,
	LearningStrategies = 3,
	Summary = 4,
}