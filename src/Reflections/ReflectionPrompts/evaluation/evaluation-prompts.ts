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
	evaluationOpen: boolean = false;
	modelLoaded: boolean = false;
	triggerSub: Subscription;

	constructor(
		private appState: ApplicationState,
		private authService: AuthenticationService,
		private reflectionsApi: ReflectionsService,
		private ea: EventAggregator
	) {
		super();
	}

	attached() {
		this.init();
		this.triggerSub = this.ea.subscribe(Events.EvaluationTriggered, () => this.init());
	}

	init() {
		this.modelLoaded = false;
		this.activeSection = EvaluationSections.Overview;
		this.tracker.resetTracker();
	}

	detached() {
		this.triggerSub.dispose();
	}

	nextStep() {
		this.tracker.moveForward();
		this.evaluationOpen = true;
	}

	async submitEvaluation(model: BaseEvaluatingApiModel | LudusEvaluatingApiModel | PaidiaEvaluatingApiModel, completed: boolean) {
		const result = await this.reflectionsApi.submitReflection(this.authService.System, ReflectionTypes.Evaluating, this.reflectionId, model);
		if (!result) {
			this.appState.triggerToast("Failed to save reflection...");
			return;
		}
		if (completed) {
			this.appState.closeEvaluation();
			this.evaluationOpen = false;
		}
	}

	@computedFrom("activeSection")
	get ShowOverview(): boolean {
		return this.activeSection == EvaluationSections.Overview;
	}

	@computedFrom("activeSection", "busy.Active", "modelLoaded")
	get ShowFeelings(): boolean {
		return this.activeSection == EvaluationSections.Feelings && !this.busy.Active && this.modelLoaded;
	}

	@computedFrom("activeSection", "busy.Active", "modelLoaded")
	get ShowTopics(): boolean {
		return this.activeSection == EvaluationSections.Topics && !this.busy.Active && this.modelLoaded;
	}

	@computedFrom("activeSection", "busy.Active", "modelLoaded")
	get ShowLearningStrategies(): boolean {
		return this.activeSection == EvaluationSections.LearningStrategies && !this.busy.Active && this.modelLoaded;
	}

	@computedFrom("activeSection", "busy.Active", "modelLoaded")
	get ShowSummary(): boolean {
		return this.activeSection == EvaluationSections.Summary && !this.busy.Active && this.modelLoaded;
	}

	@computedFrom("authService.System", "evaluationOpen")
	get ShowBaseSystem(): boolean {
		return this.authService.System == Systems.Base && this.evaluationOpen;
	}

	@computedFrom("authService.System", "evaluationOpen")
	get ShowLudus(): boolean {
		return this.authService.System == Systems.Ludus && this.evaluationOpen;
	}

	@computedFrom("authService.System", "evaluationOpen")
	get ShowPaidia(): boolean {
		return this.authService.System == Systems.Paidia && this.evaluationOpen;
	}

	
	@computedFrom("authService.Course")
	get Course(): string {
		return this.authService.Course;
	}
}

enum EvaluationSections {
	Overview = 0,
	Feelings = 1,
	Topics = 2,
	LearningStrategies = 3,
	Summary = 4,
}