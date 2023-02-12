import { ApplicationState } from "applicationState";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, computedFrom } from "aurelia-framework";
import { BaseMonitoringApiModel, LudusMonitoringApiModel, PaidiaMonitoringApiModel } from "models/reflectionsApiModels";
import { Busy } from "resources/busy/busy";
import { SectionTrackerParent } from "resources/sectionTracker/section-tracker";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { Events } from "utils/constants";
import { ReflectionTypes, Systems } from "utils/enums";

@autoinject
export class MonitoringPrompts extends SectionTrackerParent {

	weekTopic: string = ""
	reflectionId: number;
	reflectionTriggered: boolean = false;
	busy: Busy = new Busy();
	monitoringOpen: boolean = false;
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
		this.triggerSub = this.ea.subscribe(Events.MonitoringTriggered, () => this.init());
	}

	init() {
		this.modelLoaded = false;
		this.activeSection = MonitoringSections.Overview;
		this.tracker.resetTracker();
	}

	detached() {
		this.triggerSub.dispose();
	}

	nextStep() {
		this.tracker.moveForward();
		this.monitoringOpen = true;
	}

	async submitMonitoring(model: BaseMonitoringApiModel | LudusMonitoringApiModel | PaidiaMonitoringApiModel, completed: boolean) {
		const result = await this.reflectionsApi.submitReflection(this.authService.System, ReflectionTypes.Monitoring, this.reflectionId, model);
		if (!result) {
			this.appState.triggerToast("Failed to save reflection...");
			return;
		}
		if (completed) {
			this.appState.closeMonitoring();
			this.monitoringOpen = false;
		}
	}

	@computedFrom("activeSection")
	get ShowOverview(): boolean {
		return this.activeSection == MonitoringSections.Overview;
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

	@computedFrom("authService.System", "monitoringOpen")
	get ShowBaseSystem(): boolean {
		return this.authService.System == Systems.Base && this.monitoringOpen;
	}

	@computedFrom("authService.System", "monitoringOpen")
	get ShowLudus(): boolean {
		return this.authService.System == Systems.Ludus && this.monitoringOpen;
	}

	@computedFrom("authService.System", "monitoringOpen")
	get ShowPaidia(): boolean {
		return this.authService.System == Systems.Paidia && this.monitoringOpen;
	}

	@computedFrom("authService.Course")
	get Course(): string {
		return this.authService.Course;
	}
}

enum MonitoringSections {
	Overview = 0,
	Feelings = 1,
	Questions = 2,
	LearningStrategies = 3
}