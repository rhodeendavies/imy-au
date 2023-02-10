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
		this.localParent.submitDaily(this.model);
	}

	async getDaily() {
		try {
			const currentSection = await this.appState.getCurrentSectionId();
			const id = await this.reflectionsApi.createReflection(this.authService.System, ReflectionTypes.Daily, currentSection);
			const reflection = await this.reflectionsApi.getPaidiaDailyReflection(id);
			this.localParent.reflectionId = id;
			this.model = reflection.answers;
			this.questions = reflection.questions.strategyPlanning;
		} catch (error) {
			log.error(error);
		} finally {
			this.localParent.busy.off();
		}
	}
}