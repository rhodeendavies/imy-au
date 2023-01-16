import { autoinject, computedFrom } from "aurelia-framework";
import { Ludus } from "../ludus";
import { LudusMonitoringApiModel, LudusStrategyPlanning } from "models/reflectionsApiModels";
import { Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { StrategyOptions } from "utils/constants";

@autoinject
export class LudusMonitoringDetails {
	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	monitoringReflection: LudusMonitoringApiModel;
	monitoringQuestions: LudusStrategyPlanning;

	constructor(private localParent: Ludus) { }

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

		this.learningStrategy = ComponentHelper.CreateStrategyFromLudus(this.monitoringQuestions.learningStrategy, StrategyOptions.LearningStrategies, this.monitoringReflection.strategyRating.learningRating);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromLudus(this.monitoringQuestions.reviewingStrategy, StrategyOptions.ReviewingStrategies, this.monitoringReflection.strategyRating.reviewingRating);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromLudus(this.monitoringQuestions.practicingStrategy, StrategyOptions.PracticingStrategies, this.monitoringReflection.strategyRating.practicingRating);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromLudus(this.monitoringQuestions.extendingStrategy, StrategyOptions.ExtendingStrategies, this.monitoringReflection.strategyRating.extendingRating);
	}

	@computedFrom("localParent.reflection.id")
	get MonitoringReflection(): LudusMonitoringApiModel {
		this.initData();
		return this.monitoringReflection;
	}

	@computedFrom("localParent.reflection.id")
	get MonitoringQuestions(): LudusStrategyPlanning {
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

	@computedFrom("monitoringReflection.contentConfusion.response")
	get Questions(): string {
		return ComponentHelper.CleanPrompt(this.monitoringReflection?.contentConfusion?.response);
	}

	@computedFrom("localParent.reflection.id")
	get DateRecorded(): Date {
		return this.localParent.reflection.monitoringReflection?.completedAt;
	}
}