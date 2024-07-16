import { autoinject } from "aurelia-framework";
import { BaseMonitoring } from "../base-monitoring";
import { Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { ApplicationState } from "applicationState";
import { StrategyCategories } from "utils/enums";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class BaseMonitoringLearningStrategies extends ReflectionStep {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];

	constructor(private localParent: BaseMonitoring, private appState: ApplicationState) {
		super();
		this.stepParent = localParent;
	}

	attached() {
		this.initData();
	}

	initData() {
		this.learningStrategy = ComponentHelper.CreateStrategyFromString(
			this.localParent.questions.learningStrategy,
			ComponentHelper.StrategyOptions.LearningStrategies,
			this.localParent.model.strategyRating.learningRating
		);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromString(
			this.localParent.questions.reviewingStrategy,
			ComponentHelper.StrategyOptions.ReviewingStrategies,
			this.localParent.model.strategyRating.reviewingRating
		);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromString(
			this.localParent.questions.practicingStrategy,
			ComponentHelper.StrategyOptions.PracticingStrategies,
			this.localParent.model.strategyRating.practicingRating
		);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromString(
			this.localParent.questions.extendingStrategy,
			ComponentHelper.StrategyOptions.ExtendingStrategies,
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

	saveStep() {
		this.localParent.model.strategyRating = {
			learningRating: this.learningStrategy.rating,
			reviewingRating: this.reviewingStrategy.rating,
			practicingRating: this.practicingStrategy.rating,
			extendingRating: this.extendingStrategy.rating
		}
	}

	get AllowNext(): boolean {
		return this.strategies != null && this.strategies.every(x => x?.rating != null && x?.valid);
	}
}