import { ApplicationState } from "applicationState";
import { Subscription, EventAggregator } from "aurelia-event-aggregator";
import { autoinject, computedFrom } from "aurelia-framework";
import { BasePlanningApiModel, LudusPlanningApiModel, PaidiaPlanningApiModel } from "models/reflectionsApiModels";
import { Busy } from "resources/busy/busy";
import { SectionTrackerParent } from "resources/sectionTracker/section-tracker";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { Events } from "utils/constants";
import { ReflectionTypes, Systems } from "utils/enums";

@autoinject
export class PlanningPrompts extends SectionTrackerParent {

	weekTopic: string = "";
	reflectionId: number;
	busy: Busy = new Busy();
	planningOpen: boolean = false;
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
		this.triggerSub = this.ea.subscribe(Events.PlanningTriggered, () => this.init());
	}
	
	init() {
		this.modelLoaded = false;
		this.activeSection = PlanningSections.Overview;
	}

	detached() {
		this.triggerSub.dispose();
	}

	nextStep(): void {
		this.tracker.moveForward();
		this.planningOpen = true;
	}

	async submitPlanning(model: BasePlanningApiModel | LudusPlanningApiModel | PaidiaPlanningApiModel, completed: boolean) {
		const result = await this.reflectionsApi.submitReflection(this.authService.System, ReflectionTypes.Planning, this.reflectionId, model);
		if (!result) {
			this.appState.triggerToast("Failed to save reflection...");
			return;
		}
		if (completed) {
			this.appState.closePlanning();
			this.planningOpen = false;
		}
	}

	@computedFrom("activeSection")
	get ShowOverview(): boolean {
		return this.activeSection == PlanningSections.Overview;
	}

	@computedFrom("activeSection", "busy.Active", "modelLoaded")
	get ShowFeelings(): boolean {
		return this.activeSection == PlanningSections.Feelings && !this.busy.Active && this.modelLoaded;
	}

	@computedFrom("activeSection", "busy.Active", "modelLoaded")
	get ShowStrengths(): boolean {
		return this.activeSection == PlanningSections.Strengths && !this.busy.Active && this.modelLoaded;
	}

	@computedFrom("activeSection", "busy.Active", "modelLoaded")
	get ShowLearningStrategies(): boolean {
		return this.activeSection == PlanningSections.LearningStrategies && !this.busy.Active && this.modelLoaded;
	}

	@computedFrom("authService.System", "planningOpen")
	get ShowBaseSystem(): boolean {
		return this.authService.System == Systems.Base && this.planningOpen;
	}

	@computedFrom("authService.System", "planningOpen")
	get ShowLudus(): boolean {
		return this.authService.System == Systems.Ludus && this.planningOpen;
	}

	@computedFrom("authService.System", "planningOpen")
	get ShowPaidia(): boolean {
		return this.authService.System == Systems.Paidia && this.planningOpen;
	}

	@computedFrom("authService.Course")
	get Course(): string {
		return this.authService.Course;
	}
}

enum PlanningSections {
	Overview = 0,
	Feelings = 1,
	Strengths = 2,
	LearningStrategies = 3
}