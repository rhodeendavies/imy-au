import { autoinject, computedFrom } from "aurelia-framework";
import { DateTime } from "luxon";
import { BaseSystemEvaluating } from "models/reflections";
import { AuthenticationService } from "services/authenticationService";
import { EvaluationPrompts } from "../evaluation-prompts";

@autoinject
export class BaseEvaluation {
	model: BaseSystemEvaluating;

	constructor(private localParent: EvaluationPrompts, private authService: AuthenticationService) {}

	attached() {
		this.model = new BaseSystemEvaluating();
		// TODO: fetch feelings
		this.model.feelings = [{
			feelingRating: 3,
			feelingDate: DateTime.fromObject({ day: 3, month: 10 }).toJSDate()
		}, {
			feelingRating: 2,
			feelingDate: DateTime.fromObject({ day: 5, month: 10 }).toJSDate()
		}, {
			feelingRating: 4,
			feelingDate: DateTime.fromObject({ day: 7, month: 10 }).toJSDate()
		}, {
			feelingRating: 4,
			feelingDate: DateTime.fromObject({ day: 7, month: 10 }).toJSDate()
		}, {
			feelingRating: 4,
			feelingDate: DateTime.fromObject({ day: 7, month: 10 }).toJSDate()
		}];

		this.model.topics = [
			{ title: "Topic #1", rating: null },
			{ title: "Topic #2", rating: null },
			{ title: "Topic #3", rating: null },
			{ title: "Topic #4", rating: null },
			{ title: "Topic #5", rating: null }
		];
	}

	nextStep() {
		this.localParent.nextStep();
	}

	submitEvaluation() {
		this.localParent.submitEvaluation();
	}

	@computedFrom("authService.Course")
	get Course(): string {
		return this.authService.Course;
	}
}