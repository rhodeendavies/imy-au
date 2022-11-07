import { ApplicationState } from "applicationState";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject } from "aurelia-framework";
import { DateTime, Duration, Interval } from "luxon";
import { AuthenticationService } from "services/authenticationService";
import { Events } from "utils/constants";

@autoinject
export class DailyPrompts {

	dailyReflectionAvailable: boolean;
	timeTillNextReflection: string;
	timer: NodeJS.Timer;
	triggerSub: Subscription;

	constructor(
		private appState: ApplicationState,
		private authService: AuthenticationService,
		private ea: EventAggregator) { }

	attached() {
		this.triggerSub = this.ea.subscribe(Events.DailyTriggered, () => this.determineDailyAvailable());
		this.determineDailyAvailable();
		this.timer = setInterval(() => this.determineDailyAvailable(), 1 * 1000);
	}

	detached() {
		this.triggerSub.dispose();
		clearInterval(this.timer);
	}

	determineDailyAvailable() {
		if (this.authService.LastDailyReflection == null) return;

		const now = DateTime.now();
		const lastReflection = DateTime.fromJSDate(this.authService.LastDailyReflection);
		const interval = Interval.fromDateTimes(lastReflection, now);
		this.dailyReflectionAvailable = interval.length("hours") > 24;

		if (!interval.isValid) return;
		const duration = Duration.fromObject({ hours: 24, minutes: 60 }).minus(interval.toDuration(['hours', 'minutes']));
		this.timeTillNextReflection = duration.toHuman({ listStyle: "long", maximumFractionDigits: 0 });
	}

	submitDaily() {
		this.appState.submitPlanning(false);
	}

	get ShowOverview(): boolean {
		return true;
	}
}