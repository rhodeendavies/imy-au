import { ApplicationState } from "applicationState";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, computedFrom } from "aurelia-framework";
import { DateTime, Duration, Interval } from "luxon";
import { BaseDailyApiModel } from "models/reflectionsApiModels";
import { Availability } from "models/userDetails";
import { SectionTrackerParent } from "resources/sectionTracker/section-tracker";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { Events } from "utils/constants";
import { ReflectionTypes, Systems } from "utils/enums";

@autoinject
export class DailyPrompts extends SectionTrackerParent {

	availability: Availability;
	timeTillNextReflection: string;
	timer: NodeJS.Timer;
	triggerSub: Subscription;
	reflectionId: number;

	constructor(
		private appState: ApplicationState,
		private authService: AuthenticationService,
		private ea: EventAggregator,
		private reflectionsApi: ReflectionsService) {
		super();
	}

	attached() {
		this.activeSection = DailySections.Overview;
		this.triggerSub = this.ea.subscribe(Events.DailyTriggered, () => {
			this.timer = setInterval(() => this.determineDailyAvailable(), 60 * 1000);
			this.activeSection = DailySections.Overview;
			this.determineDailyAvailable();
		});
	}

	detached() {
		this.triggerSub.dispose();
		clearInterval(this.timer);
	}

	async determineDailyAvailable(): Promise<boolean> {
		this.availability = await this.reflectionsApi.reflectionAvailable(this.authService.System, ReflectionTypes.Daily, (await this.appState.getCurrentSection()).id);
		if (this.availability == null) return false;

		const now = DateTime.now();
		const lastReflection = DateTime.fromJSDate(this.availability.lastCompletedAt);
		const interval = Interval.fromDateTimes(lastReflection, now);

		if (!interval.isValid) return false;
		const duration = Duration.fromObject({ hours: 24, minutes: 60 }).minus(interval.toDuration(['hours', 'minutes']));
		this.timeTillNextReflection = duration.toHuman({ listStyle: "long", maximumFractionDigits: 0 });

		return this.availability.available;
	}

	startDaily() {
		if (!this.determineDailyAvailable()) return;
		this.nextStep();
	}

	closeDaily() {
		this.appState.closeDaily();
	}

	async submitDaily(model: BaseDailyApiModel, completed: boolean) {
		const result = await this.reflectionsApi.submitReflection(this.authService.System, ReflectionTypes.Daily, this.reflectionId, model);
		if (!result) {
			this.appState.triggerToast("Failed to save reflection...");
			return;
		}
		if (completed) {
			this.appState.closeDaily();
		}
	}

	@computedFrom("activeSection")
	get ShowOverview(): boolean {
		return this.activeSection == DailySections.Overview;
	}

	@computedFrom("activeSection")
	get ShowFeelings(): boolean {
		return this.activeSection == DailySections.Feelings;
	}

	@computedFrom("activeSection")
	get ShowLearningStrategies(): boolean {
		return this.activeSection == DailySections.LearningStrategies;
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

enum DailySections {
	Overview = 0,
	Feelings = 1,
	LearningStrategies = 2
}