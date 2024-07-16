import { autoinject, computedFrom } from "aurelia-framework";
import { BaseSystem } from "../base-system";
import { BasePlanningApiModel } from "models/reflectionsApiModels";
import { Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { ApplicationState } from "applicationState";

@autoinject
export class BasePlanningDetails {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];
	planningReflection: BasePlanningApiModel;

	constructor(private localParent: BaseSystem, private appState: ApplicationState) { }

	attached() {
		this.planningReflection = null;
		this.initData();
	}

	initData() {
		if (this.localParent.reflection.planningReflection == null) return;

		this.planningReflection = this.localParent.reflection.planningReflection.answers;
		this.learningStrategy = ComponentHelper.CreateStrategyFromString(
			this.planningReflection.strategyPlanning.learningStrategy,
			ComponentHelper.StrategyOptions.LearningStrategies
		);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromString(
			this.planningReflection.strategyPlanning.reviewingStrategy,
			ComponentHelper.StrategyOptions.ReviewingStrategies
		);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromString(
			this.planningReflection.strategyPlanning.practicingStrategy,
			ComponentHelper.StrategyOptions.PracticingStrategies
		);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromString(
			this.planningReflection.strategyPlanning.extendingStrategy,
			ComponentHelper.StrategyOptions.ExtendingStrategies
		);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];
	}

	@computedFrom("localParent.reflection.id")
	get PlanningReflection(): BasePlanningApiModel {
		this.initData();
		return this.planningReflection;
	}

	@computedFrom("localParent.reflection.id")
	get DateRecorded(): Date {
		return this.localParent.reflection.planningReflection?.completedAt;
	}
}