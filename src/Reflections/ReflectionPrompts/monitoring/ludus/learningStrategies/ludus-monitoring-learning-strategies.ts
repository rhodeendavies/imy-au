import { autoinject, computedFrom } from "aurelia-framework";
import { LudusComponent, Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { LudusMonitoring } from "../ludus-monitoring";
import { ApplicationState } from "applicationState";
import { StrategyCategories } from "utils/enums";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class LudusMonitoringLearningStrategies extends ReflectionStep {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];
	components: LudusComponent[];

	constructor(private localParent: LudusMonitoring, private appState: ApplicationState) { 
		super();
		this.stepParent = localParent;
	}

	attached() {
		this.initData();
	}

	initData() {
		const strategyPlanning = this.localParent.questions.strategyPlanning;
		this.learningStrategy = ComponentHelper.CreateStrategyFromLudus(
			strategyPlanning.learningStrategy,
			ComponentHelper.StrategyOptions.LearningStrategies,
			this.localParent.model.strategyRating.learningRating
		);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromLudus(
			strategyPlanning.reviewingStrategy,
			ComponentHelper.StrategyOptions.ReviewingStrategies,
			this.localParent.model.strategyRating.reviewingRating
		);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromLudus(
			strategyPlanning.practicingStrategy,
			ComponentHelper.StrategyOptions.PracticingStrategies,
			this.localParent.model.strategyRating.practicingRating
		);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromLudus(
			strategyPlanning.extendingStrategy,
			ComponentHelper.StrategyOptions.ExtendingStrategies,
			this.localParent.model.strategyRating.extendingRating
		);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];

		this.components = ComponentHelper.GetUniqueComponents([], ComponentHelper.GetAllModifiers(this.strategies));
		this.components = ComponentHelper.FindLatestScore(this.components, this.localParent.questions.previousComponents);
	}

	updateComponents() {
		if (this.components != null && this.components.length > 0) {
			this.components = ComponentHelper.GetComponentScores(this.components, this.strategies, 0.6);
		}
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
		this.localParent.model.components.calculated = this.components;
	}

	@computedFrom("learningStrategy.rating", "reviewingStrategy.rating", "practicingStrategy.rating", "extendingStrategy.rating")
	get AllowNext(): boolean {
		this.updateComponents();
		return this.strategies != null && this.strategies.every(x => x?.rating != null);
	}
}