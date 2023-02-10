import { ApplicationState } from "applicationState";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, computedFrom } from "aurelia-framework";
import { BaseEvaluatingApiModel, LudusEvaluatingApiModel, PaidiaEvaluatingApiModel } from "models/reflectionsApiModels";
import { Busy } from "resources/busy/busy";
import { SectionTrackerParent } from "resources/sectionTracker/section-tracker";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { Events } from "utils/constants";
import { ReflectionTypes, Systems } from "utils/enums";

@autoinject
export class EvaluationPrompts extends SectionTrackerParent {
	
	weekTopic: string = ""
	reflectionId: number;
	reflectionTriggered: boolean = false;
	busy: Busy = new Busy();
	triggerSub: Subscription;

	constructor(
		private appState: ApplicationState,
		private authService: AuthenticationService,
		private reflectionsApi: ReflectionsService,
		private ea: EventAggregator) {
		super();
		this.triggerSub = this.ea.subscribe(Events.EvaluationTriggered, () => {
			this.activeSection = EvaluationSections.Overview;
		});
	}

	attached() {
		this.activeSection = EvaluationSections.Overview;
	}

	async submitEvaluation(model: BaseEvaluatingApiModel | LudusEvaluatingApiModel | PaidiaEvaluatingApiModel, completed: boolean) {
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

	@computedFrom("activeSection", "busy.Active")
	get ShowFeelings(): boolean {
		return this.activeSection == EvaluationSections.Feelings && !this.busy.Active;
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

	@computedFrom("authService.System", "appState.EvaluationOpen")
	get ShowBaseSystem(): boolean {
		return this.authService.System == Systems.Base && this.appState.EvaluationOpen;
	}

	@computedFrom("authService.System", "appState.EvaluationOpen")
	get ShowLudus(): boolean {
		return this.authService.System == Systems.Ludus && this.appState.EvaluationOpen;
	}

	@computedFrom("authService.System", "appState.EvaluationOpen")
	get ShowPaidia(): boolean {
		return this.authService.System == Systems.Paidia && this.appState.EvaluationOpen;
	}
}

enum EvaluationSections {
	Overview = 0,
	Feelings = 1,
	Topics = 2,
	LearningStrategies = 3,
	Summary = 4,
}