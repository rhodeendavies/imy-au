import { autoinject } from "aurelia-framework";
import { LudusComponent, Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { StrategyOptions } from "utils/constants";
import { LudusMonitoring } from "../ludus-monitoring";

@autoinject
export class LudusMonitoringLearningStrategies {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	components: LudusComponent[];

	constructor(private localParent: LudusMonitoring) { }

	attached() {
		this.initData();
	}

	initData() {
		this.learningStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.questions.learningStrategy, StrategyOptions.LearningStrategies);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.questions.reviewingStrategy, StrategyOptions.ReviewingStrategies);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.questions.practicingStrategy, StrategyOptions.PracticingStrategies);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.questions.extendingStrategy, StrategyOptions.ExtendingStrategies);
		
		this.components = ComponentHelper.GetUniqueComponents([], ComponentHelper.GetAllModifiers(this.Strategies));
	}

	submit() {
		if (!this.AllowSubmit) return;
		this.localParent.model.strategyRating = {
			learningRating: this.learningStrategy.rating,
			reviewingRating: this.reviewingStrategy.rating,
			practicingRating: this.practicingStrategy.rating,
			extendingRating: this.extendingStrategy.rating
		}
		this.localParent.submitMonitoring();
	}

	get AllowSubmit(): boolean {
		return this.Strategies != null && this.Strategies.every(x => x?.rating != null);
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