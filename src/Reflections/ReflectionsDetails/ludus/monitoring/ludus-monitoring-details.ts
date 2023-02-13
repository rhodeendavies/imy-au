import { autoinject, computedFrom } from "aurelia-framework";
import { Ludus } from "../ludus";
import { LudusMonitoringApiModel, LudusStrategyPlanning } from "models/reflectionsApiModels";
import { Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { ApplicationState } from "applicationState";

@autoinject
export class LudusMonitoringDetails {
	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];
	monitoringReflection: LudusMonitoringApiModel;
	monitoringQuestions: LudusStrategyPlanning;

	constructor(private localParent: Ludus, private appState: ApplicationState) { }

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

		this.learningStrategy = ComponentHelper.CreateStrategyFromLudus(
			this.monitoringQuestions.learningStrategy,
			ComponentHelper.StrategyOptions.LearningStrategies,
			this.monitoringReflection.strategyRating.learningRating
		);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromLudus(
			this.monitoringQuestions.reviewingStrategy,
			ComponentHelper.StrategyOptions.ReviewingStrategies,
			this.monitoringReflection.strategyRating.reviewingRating
		);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromLudus(
			this.monitoringQuestions.practicingStrategy,
			ComponentHelper.StrategyOptions.PracticingStrategies,
			this.monitoringReflection.strategyRating.practicingRating
		);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromLudus(
			this.monitoringQuestions.extendingStrategy,
			ComponentHelper.StrategyOptions.ExtendingStrategies,
			this.monitoringReflection.strategyRating.extendingRating
		);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];
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

	@computedFrom("monitoringReflection.contentConfusion.response")
	get Questions(): string {
		return ComponentHelper.CleanPrompt(this.monitoringReflection?.contentConfusion?.response);
	}

	@computedFrom("localParent.reflection.id")
	get DateRecorded(): Date {
		return this.localParent.reflection.monitoringReflection?.completedAt;
	}
}