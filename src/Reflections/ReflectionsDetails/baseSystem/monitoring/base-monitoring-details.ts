import { autoinject, computedFrom } from "aurelia-framework";
import { BaseSystem } from "../base-system";
import { BaseMonitoringApiModel, StrategyPlanning } from "models/reflectionsApiModels";
import { Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { ApplicationState } from "applicationState";

@autoinject
export class BaseMonitoringDetails {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];
	monitoringReflection: BaseMonitoringApiModel;
	monitoringQuestions: StrategyPlanning;

	constructor(private localParent: BaseSystem, private appState: ApplicationState) { }

	attached() {
		this.monitoringReflection = null;
		this.monitoringQuestions = null;
		this.initData();
	}

	initData() {
		if (this.localParent.reflection.monitoringReflection == null) return;

		this.monitoringReflection = this.localParent.reflection.monitoringReflection.answers;
		this.monitoringQuestions = this.localParent.reflection.monitoringReflection.questions.strategyPlanning;

		if (this.monitoringReflection.strategyRating.learningRating == null) {
			this.monitoringReflection.strategyRating.learningRating = 0;
		}
		if (this.monitoringReflection.strategyRating.reviewingRating == null) {
			this.monitoringReflection.strategyRating.reviewingRating = 0;
		}
		if (this.monitoringReflection.strategyRating.practicingRating == null) {
			this.monitoringReflection.strategyRating.practicingRating = 0;
		}
		if (this.monitoringReflection.strategyRating.extendingRating == null) {
			this.monitoringReflection.strategyRating.extendingRating = 0;
		}

		this.learningStrategy = ComponentHelper.CreateStrategyFromString(
			this.monitoringQuestions.learningStrategy,
			ComponentHelper.StrategyOptions.LearningStrategies,
			this.monitoringReflection.strategyRating.learningRating
		);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromString(
			this.monitoringQuestions.reviewingStrategy,
			ComponentHelper.StrategyOptions.ReviewingStrategies,
			this.monitoringReflection.strategyRating.reviewingRating
		);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromString(
			this.monitoringQuestions.practicingStrategy,
			ComponentHelper.StrategyOptions.PracticingStrategies,
			this.monitoringReflection.strategyRating.practicingRating
		);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromString(
			this.monitoringQuestions.extendingStrategy,
			ComponentHelper.StrategyOptions.ExtendingStrategies,
			this.monitoringReflection.strategyRating.extendingRating
		);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];
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

	@computedFrom("localParent.reflection.id")
	get DateRecorded(): Date {
		return this.localParent.reflection.monitoringReflection?.completedAt;
	}
}