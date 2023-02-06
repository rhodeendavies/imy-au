import { autoinject, computedFrom } from "aurelia-framework";
import { Strategy } from "models/reflections";
import { PaidiaEvaluatingApiModel } from "models/reflectionsApiModels";
import { PaidiaEvaluatingQuestions, PaidiaFeelingsSummary, PaidiaTopic } from "models/reflectionsResponses";
import { Paidia } from "../paidia";
import { ApplicationState } from "applicationState";
import { ComponentHelper } from "utils/componentHelper";
import { PaidiaSummaryType } from "utils/enums";

@autoinject
export class PaidiaEvaluationDetails {
	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];
	evaluatingReflection: PaidiaEvaluatingApiModel;
	evaluatingQuestions: PaidiaEvaluatingQuestions;
	feelingsSummary: PaidiaFeelingsSummary[];
	topics: PaidiaTopic[];

	showEmoji: boolean;
	showGif: boolean;
	showText: boolean;
	showColour: boolean;

	constructor(private localParent: Paidia, private appState: ApplicationState) { }

	attached() {
		this.evaluatingReflection = null;
		this.evaluatingQuestions = null;
		this.initData();
	}

	initData() {
		if (this.localParent.reflection.evaluatingReflection == null ||
			this.localParent.reflection.evaluatingReflection.answers == null ||
			this.localParent.reflection.evaluatingReflection.questions == null) return;

		this.evaluatingReflection = this.localParent.reflection.evaluatingReflection.answers;
		this.evaluatingQuestions = this.localParent.reflection.evaluatingReflection.questions;

		this.feelingsSummary = ComponentHelper.GetPaidiaFeelingsSummary(this.evaluatingQuestions.courseFeelings)

		this.learningStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.evaluatingQuestions.strategyPlanning.learningStrategy,
			this.appState.strategyOptions.LearningStrategies,
			this.evaluatingReflection.strategyRating.learningRating
		);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.evaluatingQuestions.strategyPlanning.reviewingStrategy,
			this.appState.strategyOptions.ReviewingStrategies,
			this.evaluatingReflection.strategyRating.reviewingRating
		);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.evaluatingQuestions.strategyPlanning.practicingStrategy,
			this.appState.strategyOptions.PracticingStrategies,
			this.evaluatingReflection.strategyRating.practicingRating
		);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.evaluatingQuestions.strategyPlanning.extendingStrategy,
			this.appState.strategyOptions.ExtendingStrategies,
			this.evaluatingReflection.strategyRating.extendingRating
		);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];

		this.evaluatingReflection.courseFeelings.emoji = ComponentHelper.EmojiFromString(this.evaluatingReflection.courseFeelings.emoji);
	
		this.evaluatingQuestions.lessonRatings.forEach(x => {
			x.emoji = ComponentHelper.EmojiFromString(x.emoji);
			x.topicsString = x.topics.join(", ");
		});
		this.topics = ComponentHelper.CreatePaidiaTopics(this.evaluatingReflection.topicRatings.ratings, this.evaluatingQuestions.topicRatings.topics)
	
		this.evaluatingReflection.learningExperience.emoji = ComponentHelper.EmojiFromString(this.evaluatingReflection.learningExperience.emoji);
	
		let types: PaidiaSummaryType[] = [];
		if (this.evaluatingReflection.learningExperience.emoji) {
			types.push(PaidiaSummaryType.emoji)
		}
		if (this.evaluatingReflection.learningExperience.text) {
			types.push(PaidiaSummaryType.text)
		}
		if (this.evaluatingReflection.learningExperience.color) {
			types.push(PaidiaSummaryType.colour)
		}
		if (this.evaluatingReflection.learningExperience.gif) {
			types.push(PaidiaSummaryType.gif)
		}
		types = ComponentHelper.ShuffleArray(types);
		this.showEmoji = types[0] == PaidiaSummaryType.emoji || types[1] == PaidiaSummaryType.emoji;
		this.showColour = types[0] == PaidiaSummaryType.colour || types[1] == PaidiaSummaryType.colour;
		this.showGif = types[0] == PaidiaSummaryType.gif || types[1] == PaidiaSummaryType.gif;
		this.showText = types[0] == PaidiaSummaryType.text || types[1] == PaidiaSummaryType.text;
		
	}

	@computedFrom("localParent.reflection.id")
	get EvaluatingReflection(): PaidiaEvaluatingApiModel {
		this.initData();
		return this.evaluatingReflection;
	}

	@computedFrom("localParent.reflection.id")
	get EvaluatingQuestions(): PaidiaEvaluatingQuestions {
		return this.evaluatingQuestions;
	}

	@computedFrom("evaluatingReflection.feelingsLearningEffect.response")
	get Experience(): string {
		return ComponentHelper.CleanPrompt(this.evaluatingReflection?.feelingsLearningEffect?.response);
	}

	@computedFrom("localParent.reflection.id")
	get DateRecorded(): Date {
		return this.localParent.reflection.evaluatingReflection?.completedAt;
	}

	@computedFrom("evaluatingReflection.learningExperience.emoji")
	get HasEmoji(): boolean {
		return !ComponentHelper.NullOrEmpty(this.evaluatingReflection.learningExperience.emoji);
	}

	@computedFrom("evaluatingReflection.learningExperience.text")
	get HasText(): boolean {
		return !ComponentHelper.NullOrEmpty(this.evaluatingReflection.learningExperience.text);
	}

	@computedFrom("evaluatingReflection.learningExperience.color")
	get HasColour(): boolean {
		return !ComponentHelper.NullOrEmpty(this.evaluatingReflection.learningExperience.color);
	}

	@computedFrom("evaluatingReflection.learningExperience.color")
	get Colour(): string {
		if (!this.HasColour || (!this.showColour && !this.localParent.FullReflection)) return "";
		return `background-color: ${this.evaluatingReflection.learningExperience.color}`;
	}

	@computedFrom("evaluatingReflection.learningExperience.color")
	get ShadowColour(): string {
		if (!this.HasColour || (!this.showColour && !this.localParent.FullReflection)) return "";
		return `box-shadow: 0px 3px 6px ${this.evaluatingReflection.learningExperience.color}`;
	}

	@computedFrom("evaluatingReflection.learningExperience.gif")
	get HasGif(): boolean {
		return !ComponentHelper.NullOrEmpty(this.evaluatingReflection.learningExperience.gif);
	}
}