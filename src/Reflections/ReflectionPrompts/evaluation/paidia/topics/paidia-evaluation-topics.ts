import { autoinject } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";
import { PaidiaEvaluation } from "../paidia-evaluation";
import { PaidiaTopic } from "models/reflectionsResponses";
import { Colours } from "utils/constants";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class PaidiaEvaluationTopics extends ReflectionStep {

	topics: PaidiaTopic[];

	constructor(private localParent: PaidiaEvaluation) {
		super();
		this.stepParent = localParent;
	}

	attached() {
		this.initData();
	}

	initData() {
		this.localParent.questions.lessonRatings.forEach(x => {
			x.rating = ComponentHelper.EmojiFromString(x.rating);
			x.topicsString = x.topics.join(", ");
		});
		this.localParent.questions.lessonRatings.sort((a, b) => a.order < b.order ? -1 : 1);
		
		this.topics = ComponentHelper.CreatePaidiaTopics(this.localParent.model.topicRatings.ratings, this.localParent.questions.topicRatings.topics)
	}

	saveStep() {
		this.localParent.model.topicRatings.ratings = this.topics.map(x => {
			return {
				id: x.id,
				color: x.colour
			};
		});
	}

	get AllowNext(): boolean {
		return this.topics?.every(x => !ComponentHelper.NullOrEmpty(x?.colour) && x?.colour != Colours.LightGreyHex);
	}
}