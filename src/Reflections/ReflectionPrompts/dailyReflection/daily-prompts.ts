import { ApplicationState } from "applicationState";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, computedFrom } from "aurelia-framework";
import { DateTime, Duration, Interval } from "luxon";
import { SectionTrackerParent } from "resources/sectionTracker/section-tracker";
import { AuthenticationService } from "services/authenticationService";
import { Events } from "utils/constants";
import { Systems } from "utils/enums";

@autoinject
export class DailyPrompts extends SectionTrackerParent {

	dailyReflectionAvailable: boolean;
	timeTillNextReflection: string;
	timer: NodeJS.Timer;
	triggerSub: Subscription;

	constructor(
		private appState: ApplicationState,
		private authService: AuthenticationService,
		private ea: EventAggregator) {
		super();
	}

	attached() {
		this.activeSection = DailySections.Overview;
		this.determineDailyAvailable();

		this.triggerSub = this.ea.subscribe(Events.DailyTriggered, () => {
			this.determineDailyAvailable();
			this.activeSection = DailySections.Overview;
		});
		this.timer = setInterval(() => this.determineDailyAvailable(), 60 * 1000);
	}

	detached() {
		this.triggerSub.dispose();
		clearInterval(this.timer);
	}

	determineDailyAvailable(): boolean {
		if (this.authService.LastDailyReflection == null) return false;

		const now = DateTime.now();
		const lastReflection = DateTime.fromJSDate(this.authService.LastDailyReflection);
		const interval = Interval.fromDateTimes(lastReflection, now);
		this.dailyReflectionAvailable = interval.length("hours") > 24;

		if (!interval.isValid) return false;
		const duration = Duration.fromObject({ hours: 24, minutes: 60 }).minus(interval.toDuration(['hours', 'minutes']));
		this.timeTillNextReflection = duration.toHuman({ listStyle: "long", maximumFractionDigits: 0 });

		return this.dailyReflectionAvailable;
	}

	startDaily() {
		if (!this.determineDailyAvailable()) return;
		this.nextStep();
	}

	submitDaily() {
		this.appState.submitDaily(true);
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

enum DailySections {
	Overview = 0,
	Feelings = 1,
	LearningStrategies = 2
}