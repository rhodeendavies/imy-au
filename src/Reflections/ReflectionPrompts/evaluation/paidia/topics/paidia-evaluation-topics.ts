import { ApplicationState } from "applicationState";
import { autoinject } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";
import { PaidiaEvaluation } from "../paidia-evaluation";
import { PaidiaTopic } from "models/reflectionsResponses";

@autoinject
export class PaidiaEvaluationTopics {

	topics: PaidiaTopic[];

	constructor(private localParent: PaidiaEvaluation) { }

	attached() {
		this.initData();
	}

	initData() {
		this.localParent.questions.lessonRatings.forEach(x => {
			x.emoji = ComponentHelper.EmojiFromString(x.emoji);
			x.topicsString = x.topics.join(", ");
		});
		this.topics = ComponentHelper.CreatePaidiaTopics(this.localParent.model.topicRatings.ratings, this.localParent.questions.topicRatings.topics)
	}

	nextStep() {
		if (!this.AllowNext) return;
		this.localParent.model.topicRatings.ratings = this.topics.map(x => {
			return {
				id: x.id,
				color: x.colour
			};
		});
		this.localParent.nextStep();
	}

	get AllowNext(): boolean {
		return this.topics?.every(x => !ComponentHelper.NullOrEmpty(x?.colour));
	}
}