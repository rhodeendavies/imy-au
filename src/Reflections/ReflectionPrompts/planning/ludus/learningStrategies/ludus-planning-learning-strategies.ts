import { autoinject } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";
import { StrategyOptions } from "utils/constants";
import { LudusPlanning } from "../ludus-planning";
import { Strategy } from "models/reflections";

@autoinject
export class LudusPlanningLearningStrategies {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;

	constructor(private localParent: LudusPlanning) { }

	attached() {
		this.initData();
	}

	initData() {
		this.learningStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.model.strategyPlanning.learningStrategy, StrategyOptions.LearningStrategies);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.model.strategyPlanning.reviewingStrategy, StrategyOptions.ReviewingStrategies);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.model.strategyPlanning.practicingStrategy, StrategyOptions.PracticingStrategies);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.model.strategyPlanning.extendingStrategy, StrategyOptions.ExtendingStrategies);
	}

	submit() {
		if (!this.AllowSubmit) return;
		this.localParent.model.strategyPlanning = {
			learningStrategy: ComponentHelper.CreateLudusModifier(this.learningStrategy),
			reviewingStrategy: ComponentHelper.CreateLudusModifier(this.reviewingStrategy),
			practicingStrategy: ComponentHelper.CreateLudusModifier(this.practicingStrategy),
			extendingStrategy: ComponentHelper.CreateLudusModifier(this.extendingStrategy),
		}
		this.localParent.submitPlanning();
	}

	get AllowSubmit(): boolean {
		return this.Strategies != null && this.Strategies.every(x => !ComponentHelper.NullOrEmpty(x?.strategy));
	}

	get Strategies(): Strategy[] {
		return [
			this.learningStrategy,
			this.reviewingStrategy,
			this.practicingStrategy,
			this.extendingStrategy
		];
	}
}