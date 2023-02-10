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
	triggerSub: Subscription;

	constructor(
		private appState: ApplicationState,
		private authService: AuthenticationService,
		private reflectionsApi: ReflectionsService,
		private ea: EventAggregator) {
		super();
		this.triggerSub = this.ea.subscribe(Events.DailyTriggered, () => {
			this.activeSection = PlanningSections.Overview;
		});
	}

	attached() {
		this.activeSection = PlanningSections.Overview;
	}
	
	async submitPlanning(model: BasePlanningApiModel | LudusPlanningApiModel | PaidiaPlanningApiModel, completed: boolean) {
		const result = await this.reflectionsApi.submitReflection(this.authService.System, ReflectionTypes.Planning, this.reflectionId, model);
		if (!result) {
			this.appState.triggerToast("Failed to save reflection...");
			return;
		}
		if (completed) {
			this.appState.closePlanning();
		}
	}

	@computedFrom("activeSection")
	get ShowOverview(): boolean {
		return this.activeSection == PlanningSections.Overview;
	}

	@computedFrom("activeSection")
	get ShowFeelings(): boolean {
		return this.activeSection == PlanningSections.Feelings;
	}

	@computedFrom("activeSection")
	get ShowStrengths(): boolean {
		return this.activeSection == PlanningSections.Strengths;
	}

	@computedFrom("activeSection")
	get ShowLearningStrategies(): boolean {
		return this.activeSection == PlanningSections.LearningStrategies;
	}

	@computedFrom("authService.System", "appState.PlanningOpen")
	get ShowBaseSystem(): boolean {
		return this.authService.System == Systems.Base && this.appState.PlanningOpen;
	}

	@computedFrom("authService.System", "appState.PlanningOpen")
	get ShowLudus(): boolean {
		return this.authService.System == Systems.Ludus && this.appState.PlanningOpen;
	}

	@computedFrom("authService.System", "appState.PlanningOpen")
	get ShowPaidia(): boolean {
		return this.authService.System == Systems.Paidia && this.appState.PlanningOpen;
	}
}

enum PlanningSections {
	Overview = 0,
	Feelings = 1,
	Strengths = 2,
	LearningStrategies = 3
}