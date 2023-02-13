import { autoinject } from "aurelia-framework";
import { BaseDaily } from "../base-daily";
import { Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { ApplicationState } from "applicationState";
import { StrategyCategories } from "utils/enums";

@autoinject
export class BaseLearningStrategies {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];

	constructor(private localParent: BaseDaily, private appState: ApplicationState) { }

	attached() {
		this.initData();
	}

	initData() {
		this.learningStrategy = ComponentHelper.CreateStrategyFromString(
			this.localParent.questions.learningStrategy,
			this.appState.strategyOptions.LearningStrategies,
			this.localParent.model.strategyRating.learningRating
		);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromString(
			this.localParent.questions.reviewingStrategy,
			this.appState.strategyOptions.ReviewingStrategies,
			this.localParent.model.strategyRating.reviewingRating
		);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromString(
			this.localParent.questions.practicingStrategy,
			this.appState.strategyOptions.PracticingStrategies,
			this.localParent.model.strategyRating.practicingRating
		);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromString(
			this.localParent.questions.extendingStrategy,
			this.appState.strategyOptions.ExtendingStrategies,
			this.localParent.model.strategyRating.extendingRating
		);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];
	}

	saveStrategy(strategy: Strategy) {
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

	submit() {
		if (!this.AllowSubmit) return;
		this.localParent.model.strategyRating = {
			learningRating: this.learningStrategy.rating,
			reviewingRating: this.reviewingStrategy.rating,
			practicingRating: this.practicingStrategy.rating,
			extendingRating: this.extendingStrategy.rating
		}
		this.localParent.submitDaily();
	}

	get AllowSubmit(): boolean {
		return this.strategies != null && this.strategies.every(x => x?.rating != null && x?.valid);
	}
}