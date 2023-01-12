import { autoinject } from "aurelia-framework";
import { BaseMonitoring } from "../base-monitoring";
import { Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { StrategyOptions } from "utils/constants";

@autoinject
export class BaseMonitoringLearningStrategies {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;

	constructor(private localParent: BaseMonitoring) { }

	attached() {
		this.initData();
	}

	initData() {
		this.learningStrategy = ComponentHelper.CreateStrategyFromString(this.localParent.questions.learningStrategy, StrategyOptions.LearningStrategies);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromString(this.localParent.questions.reviewingStrategy, StrategyOptions.ReviewingStrategies);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromString(this.localParent.questions.practicingStrategy, StrategyOptions.PracticingStrategies);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromString(this.localParent.questions.extendingStrategy, StrategyOptions.ExtendingStrategies);
	}

	submit() {
		if (!this.AllowSubmit) return;
		this.localParent.submitMonitoring();
	}

	get AllowSubmit(): boolean {
		return this.Strategies != null && this.Strategies.every(x => x?.rating != null && x?.valid);
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