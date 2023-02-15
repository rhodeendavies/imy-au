import { ApplicationState } from "applicationState";
import { autoinject } from "aurelia-framework";
import { RadioOption } from "resources/radioButton/radio-button";
import { BaseTopicRating } from "utils/enums";
import { BaseEvaluation } from "../base-evaluation";
import { ComponentHelper } from "utils/componentHelper";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class BaseEvaluationTopics extends ReflectionStep {

	ratingOptions: RadioOption[] = [
		{ name: "", value: BaseTopicRating.Mastered },
		{ name: "", value: BaseTopicRating.SortOfMastered },
		{ name: "", value: BaseTopicRating.NotYetMastered }
	];

	constructor(private localParent: BaseEvaluation, private appState: ApplicationState) {
		super();
		this.stepParent = localParent;
	}

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

	saveStep() {
		this.localParent.model.topicRatings.ratings = this.localParent.questions.topicRatings.topics.map(x => {
			return {
				id: x.id,
				rating: x.rating
			};
		})
	}

	get AllowNext(): boolean {
		return this.localParent.questions.topicRatings?.topics?.every(x => x?.rating != null);
	}
}