import { ApplicationState } from "applicationState";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, computedFrom } from "aurelia-framework";
import { BasePlanningApiModel, LudusPlanningApiModel } from "models/reflectionsApiModels";
import { SectionTrackerParent } from "resources/sectionTracker/section-tracker";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { Events } from "utils/constants";
import { ReflectionTypes, Systems } from "utils/enums";

@autoinject
export class PlanningPrompts extends SectionTrackerParent {
	
	triggerSub: Subscription;
	weekTopic: string = ""

	constructor(
		private appState: ApplicationState,
		private authService: AuthenticationService,
		private ea: EventAggregator,
		private reflectionsApi: ReflectionsService) {
		super();
	}

	attached() {
		this.triggerSub = this.ea.subscribe(Events.PlanningTriggered, () => {
			this.activeSection = PlanningSections.Overview;
		});
		this.getWeekTopic();
	}

	detached() {
		this.triggerSub.dispose();
	}

	getWeekTopic() {
		// TODO: replace with actual call
		this.weekTopic = "Styling tables and forms with CSS";
	}
	
	async submitPlanning(model: BasePlanningApiModel | LudusPlanningApiModel, completed: boolean) {
		const result = await this.reflectionsApi.submitReflection(this.authService.System, ReflectionTypes.Planning, await this.appState.getCurrentSectionId(), model);
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

enum PlanningSections {
	Overview = 0,
	Feelings = 1,
	Strengths = 2,
	LearningStrategies = 3
}