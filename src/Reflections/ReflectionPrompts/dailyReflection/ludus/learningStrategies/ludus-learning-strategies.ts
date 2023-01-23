import { autoinject, computedFrom } from "aurelia-framework";
import { LudusComponent, Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { StrategyOptions } from "utils/constants";
import { LudusDaily } from "../ludus-daily";

@autoinject
export class LudusLearningStrategies {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];
	components: LudusComponent[];

	constructor(private localParent: LudusDaily) { }

	attached() {
		this.initData();
	}

	initData() {
		const strategyPlanning = this.localParent.questions.strategyPlanning;
		this.learningStrategy = ComponentHelper.CreateStrategyFromLudus(strategyPlanning.learningStrategy, StrategyOptions.LearningStrategies, this.localParent.model.strategyRating.learningRating);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromLudus(strategyPlanning.reviewingStrategy, StrategyOptions.ReviewingStrategies, this.localParent.model.strategyRating.reviewingRating);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromLudus(strategyPlanning.practicingStrategy, StrategyOptions.PracticingStrategies, this.localParent.model.strategyRating.practicingRating);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromLudus(strategyPlanning.extendingStrategy, StrategyOptions.ExtendingStrategies, this.localParent.model.strategyRating.extendingRating);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];

		this.components = ComponentHelper.GetUniqueComponents([], ComponentHelper.GetAllModifiers(this.strategies));
		this.components = ComponentHelper.FindLatestScore(this.components, this.localParent.questions.previousComponents);
	}

	updateComponents() {
		this.components = ComponentHelper.GetComponentScores(this.components, this.strategies, 0.1);
	}

	submit() {
		if (!this.AllowSubmit) return;
		this.localParent.model.strategyRating = {
			learningRating: this.learningStrategy.rating,
			reviewingRating: this.reviewingStrategy.rating,
			practicingRating: this.practicingStrategy.rating,
			extendingRating: this.extendingStrategy.rating
		}
		this.localParent.model.components.calculated = this.components;
		this.localParent.submitDaily();
	}

	@computedFrom("learningStrategy.rating", "reviewingStrategy.rating", "practicingStrategy.rating", "extendingStrategy.rating")
	get AllowSubmit(): boolean {
		this.updateComponents();
		return this.strategies != null && this.strategies.every(x => x?.rating != null);
	}
}