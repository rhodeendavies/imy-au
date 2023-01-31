import { autoinject, computedFrom } from "aurelia-framework";
import { Ludus } from "../ludus";
import { LudusPlanningApiModel } from "models/reflectionsApiModels";
import { ComponentHelper } from "utils/componentHelper";
import { StrategyOptions } from "utils/constants";
import { Strategy } from "models/reflections";

@autoinject
export class LudusPlanningDetails {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];
	planningReflection: LudusPlanningApiModel;
	
	constructor(private localParent: Ludus) {}
	
	attached() {
		this.planningReflection = null;
		this.initData();
	}

	initData() {
		if (this.localParent.reflection.planningReflection == null) return;

		this.planningReflection = this.localParent.reflection.planningReflection.answers;
		this.learningStrategy = ComponentHelper.CreateStrategyFromLudus(this.planningReflection.strategyPlanning.learningStrategy, StrategyOptions.LearningStrategies);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromLudus(this.planningReflection.strategyPlanning.reviewingStrategy, StrategyOptions.ReviewingStrategies);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromLudus(this.planningReflection.strategyPlanning.practicingStrategy, StrategyOptions.PracticingStrategies);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromLudus(this.planningReflection.strategyPlanning.extendingStrategy, StrategyOptions.ExtendingStrategies);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];
	}

	@computedFrom("localParent.reflection.id")
	get PlanningReflection(): LudusPlanningApiModel {
		this.initData();
		return this.planningReflection;
	}

	@computedFrom("planningReflection.strengthOptimization.response")
	get Strength(): string {
		return ComponentHelper.CleanPrompt(this.planningReflection?.strengthOptimization?.response);
	}

	@computedFrom("localParent.reflection.id")
	get DateRecorded(): Date {
		return this.localParent.reflection.planningReflection?.completedAt;
	}
}