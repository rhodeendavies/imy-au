import { autoinject, computedFrom } from "aurelia-framework";
import { Strategy } from "models/reflections";
import { PaidiaMonitoringApiModel, PaidiaStrategyPlanning } from "models/reflectionsApiModels";
import { Paidia } from "../paidia";
import { ApplicationState } from "applicationState";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class PaidiaMonitoringDetails {
	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];
	monitoringReflection: PaidiaMonitoringApiModel;
	monitoringQuestions: PaidiaStrategyPlanning;

	constructor(private localParent: Paidia, private appState: ApplicationState) { }

	attached() {
		this.monitoringReflection = null;
		this.monitoringQuestions = null;
		this.initData();
	}

	initData() {
		if (this.localParent.reflection.monitoringReflection == null) return;

		this.monitoringReflection = this.localParent.reflection.monitoringReflection.answers;
		this.monitoringQuestions = this.localParent.reflection.monitoringReflection.questions.strategyPlanning;

		this.learningStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.monitoringQuestions.learningStrategy,
			this.appState.strategyOptions.LearningStrategies,
			this.monitoringReflection.strategyRating.learningRating
		);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.monitoringQuestions.reviewingStrategy,
			this.appState.strategyOptions.ReviewingStrategies,
			this.monitoringReflection.strategyRating.reviewingRating
		);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.monitoringQuestions.practicingStrategy,
			this.appState.strategyOptions.PracticingStrategies,
			this.monitoringReflection.strategyRating.practicingRating
		);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.monitoringQuestions.extendingStrategy,
			this.appState.strategyOptions.ExtendingStrategies,
			this.monitoringReflection.strategyRating.extendingRating
		);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];
	
		this.monitoringReflection.courseFeelings.emoji = ComponentHelper.EmojiFromString(this.monitoringReflection.courseFeelings.emoji)
	}

	@computedFrom("localParent.reflection.id")
	get MonitoringReflection(): PaidiaMonitoringApiModel {
		this.initData();
		return this.monitoringReflection;
	}

	@computedFrom("localParent.reflection.id")
	get MonitoringQuestions(): PaidiaStrategyPlanning {
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