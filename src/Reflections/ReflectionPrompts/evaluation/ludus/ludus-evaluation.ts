import { ApplicationState } from "applicationState";
import { autoinject, computedFrom } from "aurelia-framework";
import { LudusEvaluatingApiModel } from "models/reflectionsApiModels";
import { LudusEvaluatingQuestions } from "models/reflectionsResponses";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes } from "utils/enums";
import { EvaluationPrompts } from "../evaluation-prompts";

@autoinject
export class LudusEvaluation {
	model: LudusEvaluatingApiModel;
	questions: LudusEvaluatingQuestions;

	constructor(
		private localParent: EvaluationPrompts,
		private authService: AuthenticationService,
		private appState: ApplicationState,
		private reflectionsApi: ReflectionsService) { }

	attached() {
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
		const currentSection = await this.appState.getCurrentSection();
		let id = currentSection.evaluatingReflectionId;
		if (id == null) {
			id = await this.reflectionsApi.createReflection(this.authService.System, ReflectionTypes.Evaluating, currentSection.id)
		}
		const reflection = await this.reflectionsApi.getLudusEvaluatingReflection(id);
		this.localParent.reflectionId = id;
		this.model = reflection.answers;
		this.questions = reflection.questions
	}

	@computedFrom("authService.Course")
	get Course(): string {
		return this.authService.Course;
	}
}