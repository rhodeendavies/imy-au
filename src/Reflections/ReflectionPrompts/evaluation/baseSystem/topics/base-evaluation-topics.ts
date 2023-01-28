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
		this.localParent.questions.lessonRatings.forEach(x => {
			x.ratingPercentage = ComponentHelper.GetRatingPercentages(x.rating, 3);
			x.topicsString = x.topics.join(", ");
		});
		this.localParent.questions.topicRatings.topics = ComponentHelper.CreateTopics(this.localParent.model.topicRatings.ratings, this.localParent.questions.topicRatings.topics, this.ratingOptions)
	}

	nextStep() {
		if (!this.AllowNext) return;
		this.localParent.model.topicRatings.ratings = this.localParent.questions.topicRatings.topics.map(x => {
			return {
				id: x.id,
				rating: x.rating
			};
		})
		this.localParent.nextStep();
	}

	get AllowNext(): boolean {
		return this.localParent.questions.topicRatings?.topics?.every(x => x?.rating != null);
	}
}