import { autoinject, computedFrom } from "aurelia-framework";
import { BaseSystem } from "../base-system";
import { BaseEvaluatingApiModel } from "models/reflectionsApiModels";
import { Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { StrategyOptions } from "utils/constants";
import { BaseEvaluatingQuestions } from "models/reflectionsResponses";

@autoinject
export class BaseEvaluationDetails {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];
	evaluatingReflection: BaseEvaluatingApiModel;
	evaluatingQuestions: BaseEvaluatingQuestions;
	
	constructor(private localParent: BaseSystem) {}

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

		this.learningStrategy = ComponentHelper.CreateStrategyFromString(this.evaluatingQuestions.strategyPlanning.learningStrategy, StrategyOptions.LearningStrategies, this.evaluatingReflection.strategyRating.learningRating);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromString(this.evaluatingQuestions.strategyPlanning.reviewingStrategy, StrategyOptions.ReviewingStrategies, this.evaluatingReflection.strategyRating.reviewingRating);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromString(this.evaluatingQuestions.strategyPlanning.practicingStrategy, StrategyOptions.PracticingStrategies, this.evaluatingReflection.strategyRating.practicingRating);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromString(this.evaluatingQuestions.strategyPlanning.extendingStrategy, StrategyOptions.ExtendingStrategies, this.evaluatingReflection.strategyRating.extendingRating);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];
	}

	@computedFrom("localParent.reflection.id")
	get EvaluatingReflection(): BaseEvaluatingApiModel {
		this.initData();
		return this.evaluatingReflection;
	}

	@computedFrom("localParent.reflection.id")
	get EvaluatingQuestions(): BaseEvaluatingQuestions {
		return this.evaluatingQuestions;
	}

	@computedFrom("localParent.reflection.id")
	get DateRecorded(): Date {
		return this.localParent.reflection.evaluatingReflection?.completedAt;
	}
}