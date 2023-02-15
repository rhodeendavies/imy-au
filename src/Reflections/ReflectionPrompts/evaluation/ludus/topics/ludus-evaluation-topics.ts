import { ApplicationState } from "applicationState";
import { autoinject } from "aurelia-framework";
import { RadioOption } from "resources/radioButton/radio-button";
import { LudusEvaluation } from "../ludus-evaluation";
import { ComponentHelper } from "utils/componentHelper";
import { QuestionTopic } from "models/reflectionsResponses";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class LudusEvaluationTopics extends ReflectionStep {

	ratingOptions: RadioOption[] = [
		{ name: "", value: 1 },
		{ name: "", value: 2 },
		{ name: "", value: 3 }
	];
	oneIndex: number = 0;
	twoIndex: number = 0;
	threeIndex: number = 0;

	constructor(private localParent: LudusEvaluation, private appState: ApplicationState) {
		super();
		this.stepParent = localParent;
	}

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
		this.localParent.questions.topicRatings.topics.forEach(x => {
			if (x.rating != null && x.rating > 0) {
				this.getPhrase(x);
			}
		})
	}

	getPhrase(topic: QuestionTopic) {
		let phrase = "";
		switch (topic.rating) {
			case 1:
				phrase = this.appState.oneStarTopicPhrases[this.oneIndex];
				++this.oneIndex;
				if (this.oneIndex > (this.appState.oneStarTopicPhrases.length - 1)) {
					this.oneIndex = 0;
				}
				break;
			case 2:
				phrase = this.appState.twoStarTopicPhrases[this.twoIndex];
				++this.twoIndex;
				if (this.twoIndex > (this.appState.twoStarTopicPhrases.length - 1)) {
					this.twoIndex = 0;
				}
				break;
			case 3:
				phrase = this.appState.threeStarTopicPhrases[this.threeIndex];
				++this.threeIndex;
				if (this.threeIndex > (this.appState.threeStarTopicPhrases.length - 1)) {
					this.threeIndex = 0;
				}
				break;
		}
		topic.phrase = phrase;
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