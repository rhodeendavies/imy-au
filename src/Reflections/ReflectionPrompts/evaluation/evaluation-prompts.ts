import { ApplicationState } from "applicationState";
import { autoinject, computedFrom } from "aurelia-framework";
import { BaseEvaluatingApiModel, LudusEvaluatingApiModel } from "models/reflectionsApiModels";
import { SectionTrackerParent } from "resources/sectionTracker/section-tracker";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes, Systems } from "utils/enums";

@autoinject
export class EvaluationPrompts extends SectionTrackerParent {
	
	weekTopic: string = ""
	reflectionId: number;
	reflectionTriggered: boolean = false;

	constructor(
		private appState: ApplicationState,
		private authService: AuthenticationService,
		private reflectionsApi: ReflectionsService) {
		super();
	}

	attached() {
		this.activeSection = EvaluationSections.Overview;
	}

	async submitEvaluation(model: BaseEvaluatingApiModel | LudusEvaluatingApiModel, completed: boolean) {
		const result = await this.reflectionsApi.submitReflection(this.authService.System, ReflectionTypes.Evaluating, this.reflectionId, model);
		if (!result) {
			this.appState.triggerToast("Failed to save reflection...");
			return;
		}
		if (completed) {
			this.appState.closeEvaluation();
		}
	}

	@computedFrom("activeSection")
	get ShowOverview(): boolean {
		return this.activeSection == EvaluationSections.Overview;
	}

	@computedFrom("activeSection")
	get ShowFeelings(): boolean {
		return this.activeSection == EvaluationSections.Feelings;
	}

	@computedFrom("activeSection")
	get ShowTopics(): boolean {
		return this.activeSection == EvaluationSections.Topics;
	}

	@computedFrom("activeSection")
	get ShowLearningStrategies(): boolean {
		return this.activeSection == EvaluationSections.LearningStrategies;
	}

	@computedFrom("activeSection")
	get ShowSummary(): boolean {
		return this.activeSection == EvaluationSections.Summary;
	}

	@computedFrom("authService.System", "ShowOverview")
	get ShowBaseSystem(): boolean {
		return !this.ShowOverview && this.authService.System == Systems.Base;
	}

	@computedFrom("authService.System", "ShowOverview")
	get ShowLudus(): boolean {
		return !this.ShowOverview && this.authService.System == Systems.Ludus;
	}

	@computedFrom("authService.System", "ShowOverview")
	get ShowPaidia(): boolean {
		return !this.ShowOverview && this.authService.System == Systems.Paidia;
	}
}

enum EvaluationSections {
	Overview = 0,
	Feelings = 1,
	Topics = 2,
	LearningStrategies = 3,
	Summary = 4,
}