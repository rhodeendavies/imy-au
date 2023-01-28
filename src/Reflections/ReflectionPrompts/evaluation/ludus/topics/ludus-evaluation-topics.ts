import { ApplicationState } from "applicationState";
import { autoinject } from "aurelia-framework";
import { RadioOption } from "resources/radioButton/radio-button";
import { LudusEvaluation } from "../ludus-evaluation";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class LudusEvaluationTopics {

	ratingOptions: RadioOption[] = [
		{ name: "", value: 1 },
		{ name: "", value: 2 },
		{ name: "", value: 3 }
	];

	constructor(private localParent: LudusEvaluation, private appState: ApplicationState) { }

	attached() {
		this.initData();
	}

	initData() {
		this.localParent.questions.lessonRatings.forEach(x => {
			if (x.rating == null) {
				x.rating = 0;
			}
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