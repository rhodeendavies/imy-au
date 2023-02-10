import { autoinject } from "aurelia-framework";
import { DailyPrompts } from "../daily-prompts";
import { BaseDailyApiModel, StrategyPlanning } from "models/reflectionsApiModels";
import { ApplicationState } from "applicationState";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes } from "utils/enums";
import { AuthenticationService } from "services/authenticationService";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { Events } from "utils/constants";
import { log } from "utils/log";

@autoinject
export class BaseDaily {

	model: BaseDailyApiModel;
	questions: StrategyPlanning;
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
			this.localParent.busy.on();
			const currentSection = await this.appState.getCurrentSectionId();
			const id = await this.reflectionsApi.createReflection(this.authService.System, ReflectionTypes.Planning, currentSection);
			const reflection = await this.reflectionsApi.getBaseDailyReflection(id);
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