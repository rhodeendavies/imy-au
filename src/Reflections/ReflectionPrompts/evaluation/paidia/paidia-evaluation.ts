import { ApplicationState } from "applicationState";
import { autoinject, computedFrom } from "aurelia-framework";
import { PaidiaEvaluatingApiModel } from "models/reflectionsApiModels";
import { PaidiaEvaluatingQuestions } from "models/reflectionsResponses";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes } from "utils/enums";
import { EvaluationPrompts } from "../evaluation-prompts";
import { log } from "utils/log";
import { ReflectionStepParent } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class PaidiaEvaluation extends ReflectionStepParent {
	model: PaidiaEvaluatingApiModel;
	questions: PaidiaEvaluatingQuestions;

	constructor(
		private localParent: EvaluationPrompts,
		private authService: AuthenticationService,
		private appState: ApplicationState,
		private reflectionsApi: ReflectionsService) {
		super();
		this.mainParent = localParent;
	}

	async getModel() {
		try {
			this.localParent.busy.on();
			const currentSection = await this.appState.getCurrentSection();
			let id = currentSection.evaluatingReflectionId;
			if (id == null) {
				id = await this.reflectionsApi.createReflection(this.authService.System, ReflectionTypes.Evaluating, currentSection.id)
			}
			if (id == null) {
				this.appState.triggerToast("Failed to load evaluation...");
				this.localParent.init();
				return;
			}

			const reflection = await this.reflectionsApi.getPaidiaEvaluatingReflection(id);
			this.localParent.reflectionId = id;
			this.model = reflection.answers;
			this.questions = reflection.questions
			this.localParent.modelLoaded = true;
		} catch (error) {
			log.error(error);
		} finally {
			this.localParent.busy.off();
		}
	}
}