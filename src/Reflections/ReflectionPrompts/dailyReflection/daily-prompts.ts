import { ApplicationState } from "applicationState";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, computedFrom } from "aurelia-framework";
import { DateTime, Duration, Interval } from "luxon";
import { BaseDailyApiModel, LudusDailyApiModel, PaidiaDailyApiModel } from "models/reflectionsApiModels";
import { Availability } from "models/userDetails";
import { Busy } from "resources/busy/busy";
import { SectionTrackerParent } from "resources/sectionTracker/section-tracker";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { Events } from "utils/constants";
import { ReflectionTypes, Systems } from "utils/enums";
import { log } from "utils/log";

@autoinject
export class DailyPrompts extends SectionTrackerParent {

	availability: Availability;
	timeTillNextReflection: string;
	timer: NodeJS.Timer;
	triggerSub: Subscription;
	busy: Busy = new Busy();
	availabilityBusy: Busy = new Busy();
	startDailyBusy: Busy = new Busy();
	evaluatingDone: boolean = false;
	reflectionId: number;
	dailyOpen: boolean = false;
	modelLoaded: boolean = false;

	constructor(
		private appState: ApplicationState,
		private authService: AuthenticationService,
		private ea: EventAggregator,
		private reflectionsApi: ReflectionsService) {
		super();
	}

	attached() {
		this.init();
		this.triggerSub = this.ea.subscribe(Events.DailyTriggered, () => {
			if (this.timer != null) {
				clearInterval(this.timer);
			}
			this.timer = setInterval(() => this.determineDailyAvailable(), 60 * 1000);
			this.init();
			this.determineDailyAvailable();
		});
	}

	init() {
		this.modelLoaded = false;
		this.activeSection = DailySections.Overview;
		this.tracker.resetTracker();
	}

	detached() {
		this.triggerSub.dispose();
		clearInterval(this.timer);
	}

	async determineDailyAvailable(): Promise<boolean> {
		try {
			this.availabilityBusy.on();
			this.availability = await this.reflectionsApi.reflectionAvailable(this.authService.System, ReflectionTypes.Daily, await this.appState.getCurrentSectionId());
			if (this.availability == null) return false;

			const now = DateTime.now();
			const lastReflection = DateTime.fromJSDate(this.availability.lastCompletedAt);
			const interval = Interval.fromDateTimes(lastReflection, now);

			if (!interval.isValid) return false;
			const duration = Duration.fromObject({ hours: 23, minutes: 59 })
				.minus(interval.toDuration(['hours', 'minutes']));
			
			this.timeTillNextReflection = duration.toHuman({ listStyle: "long", maximumFractionDigits: 0 });

			return this.availability.available;
		} catch (error) {
			log.error(error);
		} finally {
			this.availabilityBusy.off();
		}
	}

	async startDaily() {
		try {
			this.startDailyBusy.on();
			if (!this.availability.available) return;
			this.evaluatingDone = (await this.appState.getCurrentSection()).evaluatingReflectionId != null;
			this.nextStep();
		} catch (error) {
			log.error(error);
		} finally {
			this.startDailyBusy.off();
		}
	}

	nextStep() {
		this.tracker.moveForward();
		this.dailyOpen = true;
	}

	closeDaily() {
		this.dailyOpen = false;
		this.availability = null;
		this.appState.closeDaily();
	}

	async submitDaily(model: BaseDailyApiModel | PaidiaDailyApiModel | LudusDailyApiModel) {
		const result = await this.reflectionsApi.submitReflection(this.authService.System, ReflectionTypes.Daily, this.reflectionId, model);
		if (!result) {
			this.appState.triggerToast("Failed to save reflection...");
			return;
		}
		this.dailyOpen = false;
		this.appState.closeDaily();
	}

	@computedFrom("activeSection")
	get ShowOverview(): boolean {
		return this.activeSection == DailySections.Overview;
	}

	@computedFrom("busy.Active", "availabilityBusy.Active", "startDailyBusy.Active")
	get Busy(): boolean {
		return this.busy.Active || this.availabilityBusy.Active || this.startDailyBusy.Active;
	}

	@computedFrom("activeSection", "Busy", "modelLoaded")
	get ShowFeelings(): boolean {
		return this.activeSection == DailySections.Feelings && !this.Busy && this.modelLoaded;
	}

	@computedFrom("activeSection", "Busy", "modelLoaded")
	get ShowLearningStrategies(): boolean {
		return this.activeSection == DailySections.LearningStrategies && !this.Busy && this.modelLoaded;
	}

	@computedFrom("evaluatingDone")
	get EvaluatingDone(): boolean {
		return this.evaluatingDone;
	}

	@computedFrom("authService.System", "dailyOpen", "availability.available")
	get ShowBaseSystem(): boolean {
		return this.availability != null && this.availability.available && this.authService.System == Systems.Base &&
			this.dailyOpen;
	}

	@computedFrom("authService.System", "dailyOpen", "availability.available")
	get ShowLudus(): boolean {
		return this.availability != null && this.availability.available && this.authService.System == Systems.Ludus &&
			this.dailyOpen;
	}

	@computedFrom("authService.System", "dailyOpen", "availability.available")
	get ShowPaidia(): boolean {
		return this.availability != null && this.availability.available && this.authService.System == Systems.Paidia &&
			this.dailyOpen;
	}

	@computedFrom("authService.Course")
	get Course(): string {
		return this.authService.Course;
	}
}

enum DailySections {
	Overview = 0,
	Feelings = 1,
	LearningStrategies = 2
}