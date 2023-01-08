import { autoinject } from "aurelia-framework";
import { DailyPrompts } from "../daily-prompts";
import { BaseDailyApiModel, StrategyPlanning } from "models/reflectionsApiModels";
import { ApplicationState } from "applicationState";
import { ReflectionsService } from "services/reflectionsService";

@autoinject
export class BaseDaily {

	model: BaseDailyApiModel;
	questions: StrategyPlanning;

	constructor(
		private localParent: DailyPrompts,
		private appState: ApplicationState,
		private reflectionsApi: ReflectionsService
	) { }

	attached() {
		this.getDaily();
	}

	nextStep() {
		this.localParent.nextStep();
		this.submitDaily(false);
	}

	submitDaily(completed: boolean = true) {
		this.model.completed = completed;
		this.localParent.submitDaily(this.model, completed);
	}

	async getDaily() {
		const currentSection = await this.appState.getCurrentSection();
		const length = currentSection.dailyReflectionIds.length;
		const reflection = await this.reflectionsApi.getBaseDailyReflection(currentSection.dailyReflectionIds[length - 1]);
		this.model = reflection.answers;
		this.questions = reflection.questions;
	}
}