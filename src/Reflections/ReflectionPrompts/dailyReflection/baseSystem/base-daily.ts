import { autoinject, computedFrom } from "aurelia-framework";
import { DailyPrompts } from "../daily-prompts";
import { BaseDailyApiModel, StrategyPlanning } from "models/reflectionsApiModels";
import { ApplicationState } from "applicationState";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes } from "utils/enums";
import { AuthenticationService } from "services/authenticationService";
import { log } from "utils/log";

@autoinject
export class BaseDaily {

	model: BaseDailyApiModel;
	questions: StrategyPlanning;

	constructor(
		private localParent: DailyPrompts,
		private authService: AuthenticationService,
		private appState: ApplicationState,
		private reflectionsApi: ReflectionsService
	) { }

	attached() {
		this.localParent.modelLoaded = false;
		this.getDaily();
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
			const id = await this.reflectionsApi.createReflection(this.authService.System, ReflectionTypes.Daily, currentSection);
			const reflection = await this.reflectionsApi.getBaseDailyReflection(id);
			this.localParent.reflectionId = id;
			this.model = reflection.answers;
			this.questions = reflection.questions.strategyPlanning;
			this.localParent.modelLoaded = true;
		} catch (error) {
			log.error(error);
		} finally {
			this.localParent.busy.off();
		}
	}

	@computedFrom("localParent.Course")
	get Course(): string {
		return this.localParent.Course;
	}
}