import { autoinject, computedFrom } from "aurelia-framework";
import { AuthenticationService } from "services/authenticationService";
import { EvaluationPrompts } from "../evaluation-prompts";
import { BaseEvaluatingApiModel } from "models/reflectionsApiModels";
import { ApplicationState } from "applicationState";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes } from "utils/enums";
import { BaseEvaluatingQuestions } from "models/reflectionsResponses";
import { log } from "utils/log";

@autoinject
export class BaseEvaluation {
	model: BaseEvaluatingApiModel;
	questions: BaseEvaluatingQuestions;

	constructor(
		private localParent: EvaluationPrompts,
		private authService: AuthenticationService,
		private appState: ApplicationState,
		private reflectionsApi: ReflectionsService) { }

	attached() {
		this.localParent.modelLoaded = false;
		this.getEvaluating();
	}

	nextStep() {
		this.localParent.nextStep();
		this.submitEvaluation(false);
	}

	submitEvaluation(completed: boolean = true) {
		this.model.completed = completed;
		this.localParent.submitEvaluation(this.model, completed);
	}

	async getEvaluating() {
		try {
			this.localParent.busy.on();
			const currentSection = await this.appState.getCurrentSection();
			let id = currentSection.evaluatingReflectionId;
			if (id == null) {
				id = await this.reflectionsApi.createReflection(this.authService.System, ReflectionTypes.Evaluating, currentSection.id)
			}
			const reflection = await this.reflectionsApi.getBaseEvaluatingReflection(id);
			this.localParent.reflectionId = id;
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