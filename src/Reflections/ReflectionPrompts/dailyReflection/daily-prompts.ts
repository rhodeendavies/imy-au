import { ApplicationState } from "applicationState";
import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, computedFrom } from "aurelia-framework";
import { DateTime, Duration, Interval } from "luxon";
import { BaseDailyApiModel, LudusDailyApiModel, PaidiaDailyApiModel } from "models/reflectionsApiModels";
import { Availability } from "models/userDetails";
import { Busy } from "resources/busy/busy";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { Events } from "utils/constants";
import { ReflectionTypes, Systems } from "utils/enums";
import { log } from "utils/log";
import { ReflectionPrompt } from "../reflection-step";

@autoinject
export class DailyPrompts extends ReflectionPrompt {

	availability: Availability;
	timeTillNextReflection: string;
	timer: NodeJS.Timer;
	availabilityBusy: Busy = new Busy();
	startDailyBusy: Busy = new Busy();
	evaluatingDone: boolean = false;

	constructor(
		private appState: ApplicationState,
		authService: AuthenticationService,
		ea: EventAggregator,
		private reflectionsApi: ReflectionsService) {
		super(authService, ea);
	}

	attached() {
		this.timer = setInterval(() => this.determineDailyAvailable(), 60 * 1000);
		this.triggerSub = this.ea.subscribe(Events.DailyTriggered, () => {
			this.init();
		});
	}

	async init() {
		this.reflectionId = null;
		this.modelLoaded = false;
		this.activeSection = DailySections.Overview;
		this.tracker.resetTracker();
		await this.getAvailability();
		this.determineDailyAvailable();
	}

	detached() {
		this.triggerSub.dispose();
		clearInterval(this.timer);
	}

	async getAvailability() {
		try {
			this.availabilityBusy.on();
			this.availability = await this.reflectionsApi.reflectionAvailable(this.authService.System, ReflectionTypes.Daily, await this.appState.getCurrentSectionId());
			if (this.availability != null) {
				this.reflectionId = this.availability.incompleteDailyReflectionId;
			}
		} catch (error) {
			log.error(error);
		} finally {
			this.availabilityBusy.off();
		}
	}

	async determineDailyAvailable() {
		if (this.availability == null || this.availability.available) return;

		const now = DateTime.now();
		const lastReflection = DateTime.fromJSDate(this.availability.lastCompletedAt);
		const interval = Interval.fromDateTimes(lastReflection, now);
		if (!interval.isValid) return;

		const duration = Duration.fromObject({ hours: 23, minutes: 59 })
			.minus(interval.toDuration(['hours', 'minutes']));

		this.timeTillNextReflection = duration.toHuman({ listStyle: "long", maximumFractionDigits: 0 });
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
		this.appState.dailyOpen = true;
	}

	closeDaily() {
		this.availability = null;
		this.appState.closeDaily();
	}

	async submit(model: BaseDailyApiModel | PaidiaDailyApiModel | LudusDailyApiModel) {
		const result = await this.reflectionsApi.submitReflection(this.authService.System, ReflectionTypes.Daily, this.reflectionId, model);
		if (!result) {
			this.appState.triggerToast("Failed to save reflection...");
			return;
		}
		this.appState.closeDaily();
	}

	@computedFrom("busy.active", "availabilityBusy.active", "startDailyBusy.active")
	get Busy(): boolean {
		return this.busy.active || this.availabilityBusy.active || this.startDailyBusy.active;
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

	@computedFrom("authService.System", "appState.dailyOpen", "availability.available", "activeSection")
	get ShowBaseSystem(): boolean {
		this.appState.allowDailyClose = this.activeSection == DailySections.Feelings ||
			this.activeSection == DailySections.LearningStrategies && !this.Busy && this.modelLoaded;
		return this.availability != null && this.availability.available && this.authService.System == Systems.Base &&
			this.appState.dailyOpen;
	}

	@computedFrom("authService.System", "appState.dailyOpen", "availability.available")
	get ShowLudus(): boolean {
		return this.availability != null && this.availability.available && this.authService.System == Systems.Ludus &&
			this.appState.dailyOpen;
	}

	@computedFrom("authService.System", "appState.dailyOpen", "availability.available")
	get ShowPaidia(): boolean {
		return this.availability != null && this.availability.available && this.authService.System == Systems.Paidia &&
			this.appState.dailyOpen;
	}
}

enum DailySections {
	Overview = 0,
	Feelings = 1,
	LearningStrategies = 2
}