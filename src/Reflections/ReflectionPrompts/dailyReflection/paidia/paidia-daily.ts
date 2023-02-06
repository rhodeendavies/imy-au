import { ApplicationState } from "applicationState";
import { autoinject } from "aurelia-framework";
import { PaidiaDailyApiModel } from "models/reflectionsApiModels";
import { PaidiaDailyResponse, PaidiaMonitoringQuestions } from "models/reflectionsResponses";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes } from "utils/enums";
import { DailyPrompts } from "../daily-prompts";
import { log } from "utils/log";

@autoinject
export class PaidiaDaily {
	model: PaidiaDailyApiModel;
	questions: PaidiaMonitoringQuestions;

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
		try {
			this.localParent.busy.on();
			const currentSection = await this.appState.getCurrentSection();
			const length = currentSection.dailyReflectionIds.length;
			let id = currentSection.dailyReflectionIds[length - 1];
			let reflection: PaidiaDailyResponse = null;
	
			if (id != null) {
				reflection = await this.reflectionsApi.getPaidiaDailyReflection(id);
			}
			if (id == null || (reflection != null && reflection.completed)) {
				id = await this.createDaily(currentSection.id);
				if (id != null) {
					reflection = await this.reflectionsApi.getPaidiaDailyReflection(id);
				}
			}
	
			this.localParent.reflectionId = id;
			this.model = reflection.answers;
			this.questions = reflection.questions;
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