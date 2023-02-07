import { ApplicationState } from "applicationState";
import { autoinject } from "aurelia-framework";
import { PaidiaDailyApiModel, PaidiaStrategyPlanning } from "models/reflectionsApiModels";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes } from "utils/enums";
import { DailyPrompts } from "../daily-prompts";
import { log } from "utils/log";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { Events } from "utils/constants";

@autoinject
export class PaidiaDaily {
	model: PaidiaDailyApiModel;
	questions: PaidiaStrategyPlanning;
	triggerSub: Subscription;

	constructor(
		private localParent: DailyPrompts,
		private authService: AuthenticationService,
		private appState: ApplicationState,
		private reflectionsApi: ReflectionsService,
		private ea: EventAggregator
	) { }

	attached() {
		this.getDaily();

		this.triggerSub = this.ea.subscribe(Events.DailyTriggered, () => {
			this.getDaily();
		});
	}

	detached() {
		this.triggerSub.dispose();
	}

	nextStep() {
		this.localParent.nextStep();
	}

	async submitDaily() {
		this.model.completed = true;
		const currentSection = await this.appState.getCurrentSection();
		const id = await this.createDaily(currentSection.id);
		if (id != null) {
			this.localParent.submitDaily(this.model, id);
		}
	}

	async getDaily() {
		try {
			this.localParent.busy.on();
			const currentSection = await this.appState.getCurrentSection();
			if (currentSection.monitoringReflectionId != null) {
				const reflection = await this.reflectionsApi.getPaidiaMonitoringReflection(currentSection.monitoringReflectionId);
				this.questions = reflection.questions.strategyPlanning;
			} else if (currentSection.dailyReflectionIds != null && currentSection.dailyReflectionIds.length > 0) {
				const id = currentSection.dailyReflectionIds[currentSection.dailyReflectionIds.length - 1];
				const reflection = await this.reflectionsApi.getPaidiaDailyReflection(id);
				this.questions = reflection.questions.strategyPlanning;
			} else if (currentSection.planningReflectionId != null) {
				const reflection = await this.reflectionsApi.getPaidiaPlanningReflection(currentSection.planningReflectionId);
				this.questions = reflection.answers.strategyPlanning;
			}

			this.model = new PaidiaDailyApiModel();
		} catch (error) {
			log.error(error);
		} finally {
			this.localParent.busy.off();
		}
	}

	async createDaily(sectionId: number): Promise<number> {
		return await this.reflectionsApi.createReflection(this.authService.System, ReflectionTypes.Daily, sectionId);
	}
}