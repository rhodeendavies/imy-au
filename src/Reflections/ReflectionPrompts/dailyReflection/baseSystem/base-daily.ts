import { autoinject, computedFrom } from "aurelia-framework";
import { DailyPrompts } from "../daily-prompts";
import { BaseDailyApiModel, StrategyPlanning } from "models/reflectionsApiModels";
import { ApplicationState } from "applicationState";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes } from "utils/enums";
import { AuthenticationService } from "services/authenticationService";
import { log } from "utils/log";
import { ReflectionStepParent } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class BaseDaily extends ReflectionStepParent {

	model: BaseDailyApiModel;
	questions: StrategyPlanning;

	constructor(
		private localParent: DailyPrompts,
		private authService: AuthenticationService,
		private appState: ApplicationState,
		private reflectionsApi: ReflectionsService
	) {
		super();
		this.mainParent = localParent;
	}

	attached() {
		this.localParent.modelLoaded = false;
		this.getDaily();
	}

	async submit() {
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
			
			const reflection = await this.reflectionsApi.getBaseDailyReflection(this.localParent.reflectionId);
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