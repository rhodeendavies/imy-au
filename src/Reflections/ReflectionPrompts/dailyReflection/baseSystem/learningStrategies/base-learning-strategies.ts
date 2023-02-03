import { autoinject } from "aurelia-framework";
import { BaseDaily } from "../base-daily";
import { Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { ApplicationState } from "applicationState";

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
			this.appState.strategyOptions.LearningStrategies
		);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromString(
			this.localParent.questions.reviewingStrategy,
			this.appState.strategyOptions.ReviewingStrategies
		);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromString(
			this.localParent.questions.practicingStrategy,
			this.appState.strategyOptions.PracticingStrategies
		);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromString(
			this.localParent.questions.extendingStrategy,
			this.appState.strategyOptions.ExtendingStrategies
		);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];
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