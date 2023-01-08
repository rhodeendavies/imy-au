import { autoinject, computedFrom } from "aurelia-framework";
import { BaseSystem } from "../base-system";
import { BaseMonitoringApiModel, StrategyPlanning } from "models/reflectionsApiModels";
import { Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { StrategyOptions } from "utils/constants";

@autoinject
export class BaseMonitoringDetails {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	monitoringReflection: BaseMonitoringApiModel;
	monitoringQuestions: StrategyPlanning;

	constructor(private localParent: BaseSystem) { }

	attached() {
		this.initData();
	}

	initData() {
		this.monitoringReflection = this.localParent.reflection.monitoringReflection.answers;
		this.monitoringQuestions = this.localParent.reflection.monitoringReflection.questions;
		this.learningStrategy = ComponentHelper.CreateStrategyFromString(this.monitoringQuestions.learningStrategy, StrategyOptions.LearningStrategies, this.monitoringReflection.strategyRating.learningRating);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromString(this.monitoringQuestions.reviewingStrategy, StrategyOptions.ReviewingStrategies, this.monitoringReflection.strategyRating.reviewingRating);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromString(this.monitoringQuestions.practicingStrategy, StrategyOptions.PracticingStrategies, this.monitoringReflection.strategyRating.practicingRating);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromString(this.monitoringQuestions.extendingStrategy, StrategyOptions.ExtendingStrategies, this.monitoringReflection.strategyRating.extendingRating);
	}

	@computedFrom("localParent.reflection.id")
	get MonitoringReflection(): BaseMonitoringApiModel {
		this.initData();
		return this.monitoringReflection;
	}

	@computedFrom("localParent.reflection.id")
	get MonitoringQuestions(): StrategyPlanning {
		this.initData();
		return this.monitoringQuestions;
	}

	get Strategies(): Strategy[] {
		return [
			this.learningStrategy,
			this.reviewingStrategy,
			this.practicingStrategy,
			this.extendingStrategy
		];
	}

	@computedFrom("localParent.reflection.id")
	get DateRecorded(): Date {
		return this.localParent.reflection.monitoringReflection.completedAt;
	}
}