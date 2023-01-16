import { ApplicationState } from "applicationState";
import { autoinject } from "aurelia-framework";
import { LudusDailyApiModel, LudusStrategyPlanning } from "models/reflectionsApiModels";
import { LudusDailyResponse } from "models/reflectionsResponses";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes } from "utils/enums";
import { DailyPrompts } from "../daily-prompts";

@autoinject
export class LudusDaily {
	model: LudusDailyApiModel;
	questions: LudusStrategyPlanning;

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
		let reflection: LudusDailyResponse = null;

		if (id != null) {
			reflection = await this.reflectionsApi.getLudusDailyReflection(id);
		}
		if (id == null || (reflection != null && reflection.completed)) {
			id = await this.createDaily(currentSection.id);
			reflection = await this.reflectionsApi.getLudusDailyReflection(id);
		}

		this.localParent.reflectionId = id;
		this.model = reflection.answers;
		this.questions = reflection.questions.strategyPlanning;
	}

	async createDaily(sectionId: number): Promise<number> {
		return await this.reflectionsApi.createReflection(this.authService.System, ReflectionTypes.Planning, sectionId);
	}
}