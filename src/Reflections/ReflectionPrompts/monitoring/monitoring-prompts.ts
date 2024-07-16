import { ApplicationState } from "applicationState";
import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, computedFrom } from "aurelia-framework";
import { BaseMonitoringApiModel, LudusMonitoringApiModel, PaidiaMonitoringApiModel } from "models/reflectionsApiModels";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { Events } from "utils/constants";
import { ReflectionTypes } from "utils/enums";
import { ReflectionPrompt } from "../reflection-step";

@autoinject
export class MonitoringPrompts extends ReflectionPrompt {

	constructor(
		private appState: ApplicationState,
		authService: AuthenticationService,
		private reflectionsApi: ReflectionsService,
		ea: EventAggregator
	) {
		super(authService, ea);
		this.event = Events.MonitoringTriggered;
	}

	async submit(model: BaseMonitoringApiModel | LudusMonitoringApiModel | PaidiaMonitoringApiModel, completed: boolean) {
		const result = await this.reflectionsApi.submitReflection(this.authService.System, ReflectionTypes.Monitoring, this.reflectionId, model);
		if (!result) {
			this.appState.triggerToast("Failed to save reflection...");
			return;
		}
		if (completed) {
			this.appState.closeMonitoring();
			this.isOpen = false;
		}
	}

	@computedFrom("activeSection", "busy.active", "modelLoaded")
	get ShowFeelings(): boolean {
		return this.activeSection == MonitoringSections.Feelings && !this.busy.active && this.modelLoaded;
	}

	@computedFrom("activeSection", "busy.active", "modelLoaded")
	get ShowQuestions(): boolean {
		return this.activeSection == MonitoringSections.Questions && !this.busy.active && this.modelLoaded;
	}

	@computedFrom("activeSection", "busy.active", "modelLoaded")
	get ShowLearningStrategies(): boolean {
		return this.activeSection == MonitoringSections.LearningStrategies && !this.busy.active && this.modelLoaded;
	}
}

enum MonitoringSections {
	Overview = 0,
	Feelings = 1,
	Questions = 2,
	LearningStrategies = 3
}