import { autoinject, computedFrom } from "aurelia-framework";
import { PaidiaPlanningApiModel } from "models/reflectionsApiModels";
import { Paidia } from "../paidia";
import { ApplicationState } from "applicationState";
import { ComponentHelper } from "utils/componentHelper";
import { Strategy } from "models/reflections";
import { PaidiaCanvas } from "resources/paidiaCanvas/paidia-canvas";

@autoinject
export class PaidiaPlanningDetails {
	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];
	planningReflection: PaidiaPlanningApiModel;
	canvas: PaidiaCanvas;

	constructor(private localParent: Paidia, private appState: ApplicationState) { }

	attached() {
		this.planningReflection = null;
		this.initData();
	}

	initData() {
		if (this.localParent.reflection.planningReflection == null) return;

		this.planningReflection = this.localParent.reflection.planningReflection.answers;
		this.learningStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.planningReflection.strategyPlanning.learningStrategy,
			this.appState.strategyOptions.LearningStrategies
		);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.planningReflection.strategyPlanning.reviewingStrategy,
			this.appState.strategyOptions.ReviewingStrategies
		);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.planningReflection.strategyPlanning.practicingStrategy,
			this.appState.strategyOptions.PracticingStrategies
		);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.planningReflection.strategyPlanning.extendingStrategy,
			this.appState.strategyOptions.ExtendingStrategies
		);
		this.planningReflection.courseFeelings.emoji = ComponentHelper.EmojiFromString(this.planningReflection.courseFeelings.emoji);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];
	
		if (!ComponentHelper.NullOrEmpty(this.planningReflection.strategyPlanning.canvas)) {
			const canvasModel = JSON.parse(this.planningReflection.strategyPlanning.canvas)
			this.canvas.loadCanvasAsImage(canvasModel.canvas);
		}
	}

	@computedFrom("localParent.reflection.id")
	get PlanningReflection(): PaidiaPlanningApiModel {
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