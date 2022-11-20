import { ApplicationState } from "applicationState";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, computedFrom } from "aurelia-framework";
import { SectionTrackerParent } from "resources/sectionTracker/section-tracker";
import { AuthenticationService } from "services/authenticationService";
import { Events } from "utils/constants";
import { Systems } from "utils/enums";
import { log } from "utils/log";

@autoinject
export class EvaluationPrompts extends SectionTrackerParent {
	
	triggerSub: Subscription;
	weekTopic: string = ""

	constructor(
		private appState: ApplicationState,
		private authService: AuthenticationService,
		private ea: EventAggregator) {
		super();
	}

	attached() {
		this.triggerSub = this.ea.subscribe(Events.EvaluationTriggered, () => {
			this.activeSection = EvaluationSections.Overview;
		});
	}

	detached() {
		this.triggerSub.dispose();
	}

	submitEvaluation() {
		this.appState.submitEvaluation(false);
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
		return !this.ShowOverview && this.authService.System == Systems.BaseSystem;
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