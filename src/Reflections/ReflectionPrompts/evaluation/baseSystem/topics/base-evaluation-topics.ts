import { ApplicationState } from "applicationState";
import { autoinject } from "aurelia-framework";
import { Lesson } from "models/course";
import { RadioOption } from "resources/radioButton/radio-button";
import { BaseTopicRating } from "utils/enums";
import { BaseEvaluation } from "../base-evaluation";

@autoinject
export class BaseEvaluationTopics {

	ratingOptions: RadioOption[] = [
		{ name: "", value: BaseTopicRating.Mastered },
		{ name: "", value: BaseTopicRating.SortOfMastered },
		{ name: "", value: BaseTopicRating.NotYetMastered }
	];
	lessons: Lesson[];

	constructor(private localParent: BaseEvaluation, private appState: ApplicationState) { }

	attached() {
		// TODO: fetch lessons with topics & ratings
		this.lessons = [
			this.appState.createDemoLesson("Block and inline elements", true, 1),
			this.appState.createDemoLesson("Images - part 1", true, 2),
			this.appState.createDemoLesson("Images - part 2", true, 3),
			this.appState.createDemoLesson("Images - examples", true, 1),
			this.appState.createDemoLesson("Video and audio", true, 2)
		];

		this.initData();
	}

	initData() {
		this.lessons.forEach(x => {
			x.ratingPercentage = Math.ceil(x.rating / 3 * 100);
			x.topicsString = x.topics.join(", ");
		});
	}

	nextStep() {
		this.localParent.nextStep();
	}

	get AllowNext(): boolean {
		return this.localParent.model.topics.every(x => x.rating != null);
	}
}