import { autoinject } from "aurelia-framework";
import { BaseEvaluation } from "../base-evaluation";
import { Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { ApplicationState } from "applicationState";
import { StrategyCategories } from "utils/enums";

@autoinject
export class BaseEvaluationLearningStrategies {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];

	constructor(private localParent: BaseEvaluation, private appState: ApplicationState) { }

	attached() {
		this.initData();
	}

	initData() {
		this.learningStrategy = ComponentHelper.CreateStrategyFromString(
			this.localParent.questions.strategyPlanning.learningStrategy,
			this.appState.strategyOptions.LearningStrategies
		);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromString(
			this.localParent.questions.strategyPlanning.reviewingStrategy,
			this.appState.strategyOptions.ReviewingStrategies
		);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromString(
			this.localParent.questions.strategyPlanning.practicingStrategy,
			this.appState.strategyOptions.PracticingStrategies
		);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromString(
			this.localParent.questions.strategyPlanning.extendingStrategy,
			this.appState.strategyOptions.ExtendingStrategies
		);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];
	}

	saveStrategy(strategy) {
		switch (strategy.title) {
			case StrategyCategories.Learning:
				this.localParent.model.strategyRating.learningRating = strategy.rating;
				break;
			case StrategyCategories.Extending:
				this.localParent.model.strategyRating.extendingRating = strategy.rating;
				break;
			case StrategyCategories.Reviewing:
				this.localParent.model.strategyRating.reviewingRating = strategy.rating;
				break;
			case StrategyCategories.Practicing:
				this.localParent.model.strategyRating.practicingRating = strategy.rating;
				break;
		}
	}

	nextStep() {
		if (!this.AllowSubmit) return;
		this.localParent.model.strategyRating = {
			learningRating: this.learningStrategy.rating,
			reviewingRating: this.reviewingStrategy.rating,
			practicingRating: this.practicingStrategy.rating,
			extendingRating: this.extendingStrategy.rating
		}
		this.localParent.nextStep();
	}

	get AllowSubmit(): boolean {
		return this.strategies != null && this.strategies.every(x => x?.rating != null && x?.valid);
	}
}