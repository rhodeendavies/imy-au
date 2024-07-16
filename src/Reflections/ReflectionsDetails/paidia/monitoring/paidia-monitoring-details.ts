import { autoinject, computedFrom } from "aurelia-framework";
import { Strategy } from "models/reflections";
import { PaidiaMonitoringApiModel, PaidiaStrategyPlanning } from "models/reflectionsApiModels";
import { Paidia } from "../paidia";
import { ApplicationState } from "applicationState";
import { ComponentHelper } from "utils/componentHelper";
import { PaidiaCanvas } from "resources/paidiaCanvas/paidia-canvas";

@autoinject
export class PaidiaMonitoringDetails {
	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];
	monitoringReflection: PaidiaMonitoringApiModel;
	monitoringQuestions: PaidiaStrategyPlanning[];
	canvas: PaidiaCanvas;

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
			this.monitoringQuestions[0].learningStrategy,
			ComponentHelper.StrategyOptions.LearningStrategies,
			this.monitoringReflection.strategyRating.learningRating
		);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.monitoringQuestions[0].reviewingStrategy,
			ComponentHelper.StrategyOptions.ReviewingStrategies,
			this.monitoringReflection.strategyRating.reviewingRating
		);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.monitoringQuestions[0].practicingStrategy,
			ComponentHelper.StrategyOptions.PracticingStrategies,
			this.monitoringReflection.strategyRating.practicingRating
		);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.monitoringQuestions[0].extendingStrategy,
			ComponentHelper.StrategyOptions.ExtendingStrategies,
			this.monitoringReflection.strategyRating.extendingRating
		);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];
	
		this.monitoringReflection.courseFeelings.emoji = ComponentHelper.EmojiFromString(this.monitoringReflection.courseFeelings.emoji)
	
		if (!ComponentHelper.NullOrEmpty(this.monitoringReflection.strategyRating.canvas)) {
			const canvasModel = JSON.parse(this.monitoringReflection.strategyRating.canvas)
			this.canvas.loadCanvasAsImage(canvasModel.canvas);
		}
	}

	@computedFrom("localParent.reflection.id")
	get MonitoringReflection(): PaidiaMonitoringApiModel {
		this.initData();
		return this.monitoringReflection;
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