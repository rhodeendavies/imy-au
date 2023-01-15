import { ApplicationState } from "applicationState";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, computedFrom } from "aurelia-framework";
import { BaseMonitoringApiModel } from "models/reflectionsApiModels";
import { SectionTrackerParent } from "resources/sectionTracker/section-tracker";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { Events } from "utils/constants";
import { ReflectionTypes, Systems } from "utils/enums";

@autoinject
export class MonitoringPrompts extends SectionTrackerParent {
	
	triggerSub: Subscription;
	weekTopic: string = ""
	reflectionId: number;

	constructor(
		private appState: ApplicationState,
		private authService: AuthenticationService,
		private ea: EventAggregator,
		private reflectionsApi: ReflectionsService) {
		super();
	}

	attached() {
		this.triggerSub = this.ea.subscribe(Events.MonitoringTriggered, () => {
			this.activeSection = MonitoringSections.Overview;
		});
	}

	detached() {
		this.triggerSub.dispose();
	}

	async submitMonitoring(model: BaseMonitoringApiModel, completed: boolean) {
		const result = await this.reflectionsApi.submitReflection(this.authService.System, ReflectionTypes.Monitoring, this.reflectionId, model);
		if (!result) {
			this.appState.triggerToast("Failed to save reflection...");
			return;
		}
		if (completed) {
			this.appState.closeMonitoring();
		}
	}

	@computedFrom("activeSection")
	get ShowOverview(): boolean {
		return this.activeSection == MonitoringSections.Overview;
	}

	@computedFrom("activeSection")
	get ShowFeelings(): boolean {
		return this.activeSection == MonitoringSections.Feelings;
	}

	@computedFrom("activeSection")
	get ShowQuestions(): boolean {
		return this.activeSection == MonitoringSections.Questions;
	}

	@computedFrom("activeSection")
	get ShowLearningStrategies(): boolean {
		return this.activeSection == MonitoringSections.LearningStrategies;
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

enum MonitoringSections {
	Overview = 0,
	Feelings = 1,
	Questions = 2,
	LearningStrategies = 3
}