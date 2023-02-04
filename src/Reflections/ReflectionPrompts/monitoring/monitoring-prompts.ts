import { ApplicationState } from "applicationState";
import { autoinject, computedFrom } from "aurelia-framework";
import { BaseMonitoringApiModel, LudusMonitoringApiModel, PaidiaMonitoringApiModel } from "models/reflectionsApiModels";
import { SectionTrackerParent } from "resources/sectionTracker/section-tracker";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes, Systems } from "utils/enums";

@autoinject
export class MonitoringPrompts extends SectionTrackerParent {
	
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
		this.activeSection = MonitoringSections.Overview;
	}

	async submitMonitoring(model: BaseMonitoringApiModel | LudusMonitoringApiModel | PaidiaMonitoringApiModel, completed: boolean) {
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

	@computedFrom("authService.System", "appState.MonitoringOpen")
	get ShowBaseSystem(): boolean {
		return this.authService.System == Systems.Base && this.appState.MonitoringOpen;
	}

	@computedFrom("authService.System", "appState.MonitoringOpen")
	get ShowLudus(): boolean {
		return this.authService.System == Systems.Ludus && this.appState.MonitoringOpen;
	}

	@computedFrom("authService.System", "appState.MonitoringOpen")
	get ShowPaidia(): boolean {
		return this.authService.System == Systems.Paidia && this.appState.MonitoringOpen;
	}
}

enum MonitoringSections {
	Overview = 0,
	Feelings = 1,
	Questions = 2,
	LearningStrategies = 3
}