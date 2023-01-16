import { autoinject, computedFrom } from "aurelia-framework";
import { Strategy } from "models/reflections";
import { LudusEvaluatingApiModel } from "models/reflectionsApiModels";
import { LudusEvaluatingQuestions } from "models/reflectionsResponses";
import { ComponentHelper } from "utils/componentHelper";
import { StrategyOptions } from "utils/constants";
import { Ludus } from "../ludus";

@autoinject
export class LudusEvaluationDetails {
	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	evaluatingReflection: LudusEvaluatingApiModel;
	evaluatingQuestions: LudusEvaluatingQuestions;
	
	constructor(private localParent: Ludus) {}

	attached() {
		this.evaluatingReflection = null;
		this.evaluatingQuestions = null;
		this.initData();
	}

	initData() {
		if (this.localParent.reflection.evaluatingReflection == null) return;

		this.evaluatingReflection = this.localParent.reflection.evaluatingReflection.answers;
		this.evaluatingQuestions = this.localParent.reflection.evaluatingReflection.questions;

		if (this.evaluatingReflection.strategyRating.learningRating == null) {
			this.evaluatingReflection.strategyRating.learningRating = 0;
		}
		if (this.evaluatingReflection.strategyRating.reviewingRating == null) {
			this.evaluatingReflection.strategyRating.reviewingRating = 0;
		}
		if (this.evaluatingReflection.strategyRating.practicingRating == null) {
			this.evaluatingReflection.strategyRating.practicingRating = 0;
		}
		if (this.evaluatingReflection.strategyRating.extendingRating == null) {
			this.evaluatingReflection.strategyRating.extendingRating = 0;
		}
		
		this.learningStrategy = ComponentHelper.CreateStrategyFromLudus(this.evaluatingQuestions.strategyRating.learningStrategy, StrategyOptions.LearningStrategies, this.evaluatingReflection.strategyRating.learningRating);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromLudus(this.evaluatingQuestions.strategyRating.reviewingStrategy, StrategyOptions.ReviewingStrategies, this.evaluatingReflection.strategyRating.reviewingRating);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromLudus(this.evaluatingQuestions.strategyRating.practicingStrategy, StrategyOptions.PracticingStrategies, this.evaluatingReflection.strategyRating.practicingRating);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromLudus(this.evaluatingQuestions.strategyRating.extendingStrategy, StrategyOptions.ExtendingStrategies, this.evaluatingReflection.strategyRating.extendingRating);
	}

	@computedFrom("localParent.reflection.id")
	get EvaluatingReflection(): LudusEvaluatingApiModel {
		this.initData();
		return this.evaluatingReflection;
	}

	@computedFrom("localParent.reflection.id")
	get EvaluatingQuestions(): LudusEvaluatingQuestions {
		return this.evaluatingQuestions;
	}

	get Strategies(): Strategy[] {
		return [
			this.learningStrategy,
			this.reviewingStrategy,
			this.practicingStrategy,
			this.extendingStrategy
		];
	}

	@computedFrom("evaluatingReflection.feelingsLearningEffect.response")
	get Experience(): string {
		return ComponentHelper.CleanPrompt(this.evaluatingReflection?.feelingsLearningEffect?.response);
	}

	@computedFrom("localParent.reflection.id")
	get DateRecorded(): Date {
		return this.localParent.reflection.evaluatingReflection?.completedAt;
	}
}