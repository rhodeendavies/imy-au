import { ApplicationState } from "applicationState";
import { autoinject, computedFrom } from "aurelia-framework";
import { PaidiaDailyApiModel, PaidiaStrategyPlanning } from "models/reflectionsApiModels";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes } from "utils/enums";
import { DailyPrompts } from "../daily-prompts";
import { log } from "utils/log";
import { ReflectionStepParent } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class PaidiaDaily extends ReflectionStepParent {
	model: PaidiaDailyApiModel;
	questions: PaidiaStrategyPlanning[];

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

			const reflection = await this.reflectionsApi.getPaidiaDailyReflection(this.localParent.reflectionId);
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