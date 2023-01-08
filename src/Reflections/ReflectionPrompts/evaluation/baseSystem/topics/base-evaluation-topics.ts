import { ApplicationState } from "applicationState";
import { autoinject } from "aurelia-framework";
import { RadioOption } from "resources/radioButton/radio-button";
import { BaseTopicRating } from "utils/enums";
import { BaseEvaluation } from "../base-evaluation";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class BaseEvaluationTopics {

	ratingOptions: RadioOption[] = [
		{ name: "", value: BaseTopicRating.Mastered },
		{ name: "", value: BaseTopicRating.SortOfMastered },
		{ name: "", value: BaseTopicRating.NotYetMastered }
	];

	constructor(private localParent: BaseEvaluation, private appState: ApplicationState) { }

	attached() {
		this.initData();
	}

	initData() {
		this.localParent.questions.lessonRatingSummary.forEach(x => {
			x.ratingPercentage = ComponentHelper.GetRatingPercentages(x.rating);
			x.topicsString = x.topics.join(", ");
		});
	}

	nextStep() {
		if (!this.AllowNext) return;
		this.localParent.nextStep();
	}

	get AllowNext(): boolean {
		return this.localParent.model.topicRatings.ratings.every(x => x.rating != null);
	}
}