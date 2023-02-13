import { autoinject } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";
import { BasePlanning } from "../base-planning";
import { Strategy } from "models/reflections";
import { ApplicationState } from "applicationState";
import { StrategyCategories } from "utils/enums";

@autoinject
export class BasePlanningLearningStrategies {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];

	constructor(private localParent: BasePlanning, private appState: ApplicationState) { }

	attached() {
		this.initData();
	}

	initData() {
		this.learningStrategy = ComponentHelper.CreateStrategyFromString(
			this.localParent.model.strategyPlanning.learningStrategy,
			ComponentHelper.StrategyOptions.LearningStrategies
		);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromString(
			this.localParent.model.strategyPlanning.reviewingStrategy,
			ComponentHelper.StrategyOptions.ReviewingStrategies
		);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromString(
			this.localParent.model.strategyPlanning.practicingStrategy,
			ComponentHelper.StrategyOptions.PracticingStrategies
		);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromString(
			this.localParent.model.strategyPlanning.extendingStrategy,
			ComponentHelper.StrategyOptions.ExtendingStrategies
		);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];
	}

	saveStrategy(strategy: Strategy) {
		switch (strategy.title) {
			case StrategyCategories.Learning:
				this.localParent.model.strategyPlanning.learningStrategy = strategy.strategy;
				break;
			case StrategyCategories.Extending:
				this.localParent.model.strategyPlanning.extendingStrategy = strategy.strategy;
				break;
			case StrategyCategories.Reviewing:
				this.localParent.model.strategyPlanning.reviewingStrategy = strategy.strategy;
				break;
			case StrategyCategories.Practicing:
				this.localParent.model.strategyPlanning.practicingStrategy = strategy.strategy;
				break;
		}
	}

	submit() {
		if (!this.AllowSubmit) return;
		this.localParent.model.strategyPlanning = {
			learningStrategy: this.learningStrategy.strategy,
			reviewingStrategy: this.reviewingStrategy.strategy,
			practicingStrategy: this.practicingStrategy.strategy,
			extendingStrategy: this.extendingStrategy.strategy,
		}
		this.localParent.submitPlanning();
	}

	get AllowSubmit(): boolean {
		return this.strategies != null && this.strategies.every(x => !ComponentHelper.NullOrEmpty(x?.strategy));
	}
}