import { autoinject } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";
import { BasePlanning } from "../base-planning";
import { Strategy } from "models/reflections";
import { StrategyOptions } from "utils/constants";

@autoinject
export class BasePlanningLearningStrategies {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];

	constructor(private localParent: BasePlanning) { }

	attached() {
		this.initData();
	}

	initData() {
		this.learningStrategy = ComponentHelper.CreateStrategyFromString(this.localParent.model.strategyPlanning.learningStrategy, StrategyOptions.LearningStrategies);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromString(this.localParent.model.strategyPlanning.reviewingStrategy, StrategyOptions.ReviewingStrategies);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromString(this.localParent.model.strategyPlanning.practicingStrategy, StrategyOptions.PracticingStrategies);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromString(this.localParent.model.strategyPlanning.extendingStrategy, StrategyOptions.ExtendingStrategies);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];
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