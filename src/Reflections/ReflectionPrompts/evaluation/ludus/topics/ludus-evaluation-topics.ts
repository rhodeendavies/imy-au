import { ApplicationState } from "applicationState";
import { autoinject } from "aurelia-framework";
import { RadioOption } from "resources/radioButton/radio-button";
import { LudusTopicRating } from "utils/enums";
import { ComponentHelper } from "utils/componentHelper";
import { LudusEvaluation } from "../ludus-evaluation";

@autoinject
export class BaseEvaluationTopics {

	ratingOptions: RadioOption[] = [
		{ name: "", value: LudusTopicRating.Mastered },
		{ name: "", value: LudusTopicRating.SortOfMastered },
		{ name: "", value: LudusTopicRating.NotYetMastered }
	];

	constructor(private localParent: LudusEvaluation, private appState: ApplicationState) { }

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