import { ApplicationState } from "applicationState";
import { autoinject, computedFrom } from "aurelia-framework";
import { LudusDailyApiModel, LudusPlanningApiModel, LudusPreviousComponents, LudusStrategyPlanning } from "models/reflectionsApiModels";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes } from "utils/enums";
import { DailyPrompts } from "../daily-prompts";
import { log } from "utils/log";
import { LudusMonitoringQuestions } from "models/reflectionsResponses";

@autoinject
export class LudusDaily {
	model: LudusDailyApiModel;
	questions: LudusMonitoringQuestions;
	previousComponents: LudusPreviousComponents;

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
			if (this.localParent.reflectionId == null) {
				const currentSection = await this.appState.getCurrentSectionId();
				this.localParent.reflectionId = await this.reflectionsApi.createReflection(this.authService.System, ReflectionTypes.Daily, currentSection);
			}
			if (this.localParent.reflectionId == null) {
				this.appState.triggerToast("Failed to load daily...");
				this.localParent.init();
				return;
			}
			
			const reflection = await this.reflectionsApi.getLudusDailyReflection(this.localParent.reflectionId);
			this.model = reflection.answers;
			this.questions = reflection.questions;
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