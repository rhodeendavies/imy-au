import { autoinject } from "aurelia-framework";
import { DailyPrompts } from "../daily-prompts";
import { BaseDailyApiModel, StrategyPlanning } from "models/reflectionsApiModels";
import { ApplicationState } from "applicationState";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes } from "utils/enums";
import { AuthenticationService } from "services/authenticationService";
import { BaseDailyResponse } from "models/reflectionsResponses";

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
		let id = currentSection.dailyReflectionIds[length - 1];
		let reflection: BaseDailyResponse = null;

		if (id != null) {
			reflection = await this.reflectionsApi.getBaseDailyReflection(id);
		}
		if (id == null || (reflection != null && reflection.completed)) {
			id = await this.createDaily(currentSection.id);
			reflection = await this.reflectionsApi.getBaseDailyReflection(id);
		}

		this.localParent.reflectionId = id;
		this.model = reflection.answers;
		this.questions = reflection.questions.strategyPlanning;
	}

	async createDaily(sectionId: number): Promise<number> {
		return await this.reflectionsApi.createReflection(this.authService.System, ReflectionTypes.Planning, sectionId);
	}
}