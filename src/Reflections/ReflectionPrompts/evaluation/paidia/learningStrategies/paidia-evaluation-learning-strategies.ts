import { autoinject, computedFrom } from "aurelia-framework";
import { PaidiaCanvasModel, Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { ApplicationState } from "applicationState";
import { PaidiaEvaluation } from "../paidia-evaluation";
import { PaidiaCanvas, PaidiaImages } from "resources/paidiaCanvas/paidia-canvas";
import { StrategyCategories } from "utils/enums";
import environment from "environment";

@autoinject
export class PaidiaEvaluationLearningStrategies {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];
	canvas: PaidiaCanvas;
	canvasModel: PaidiaCanvasModel;
	interactions: number = 0;

	constructor(private localParent: PaidiaEvaluation, private appState: ApplicationState) { }

	attached() {
		this.initData();
	}

	initData() {
		this.learningStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.localParent.questions.strategyPlanning[0].learningStrategy,
			ComponentHelper.StrategyOptions.LearningStrategies,
			this.localParent.model.strategyRating.learningRating
		);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.localParent.questions.strategyPlanning[0].reviewingStrategy,
			ComponentHelper.StrategyOptions.ReviewingStrategies,
			this.localParent.model.strategyRating.reviewingRating
		);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.localParent.questions.strategyPlanning[0].practicingStrategy,
			ComponentHelper.StrategyOptions.PracticingStrategies,
			this.localParent.model.strategyRating.practicingRating
		);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.localParent.questions.strategyPlanning[0].extendingStrategy,
			ComponentHelper.StrategyOptions.ExtendingStrategies,
			this.localParent.model.strategyRating.extendingRating
		);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];
		
		if (ComponentHelper.NullOrEmpty(this.localParent.model.strategyRating.canvas)) {
			this.canvasModel = JSON.parse(this.localParent.questions.strategyPlanning[1].canvas);
		} else {
			this.canvasModel = JSON.parse(this.localParent.model.strategyRating.canvas);
		}
		this.canvas.loadCanvas(this.canvasModel.canvas);

		if (this.localParent.model.strategyRating.interactions == null) {
			this.interactions = 0;
		} else {
			this.interactions = this.localParent.model.strategyRating.interactions;
		}
	}

	emojiChanged(strategy: Strategy) {
		let image = 0;
		let style = 0;
		switch (strategy.title) {
			case StrategyCategories.Learning:
				image = this.canvasModel.learningImage;
				style = this.getNewStyle(this.canvasModel.learningStyle);
				this.canvasModel.learningStyle = style;
				this.canvas.addImage(image, style, PaidiaImages.Learning);
				break;
			case StrategyCategories.Reviewing:
				image = this.canvasModel.reviewingImage;
				style = this.getNewStyle(this.canvasModel.reviewingStyle);
				this.canvasModel.reviewingStyle = style;
				this.canvas.addImage(image, style, PaidiaImages.Reviewing);
				break;
			case StrategyCategories.Extending:
				image = this.canvasModel.extendingImage;
				style = this.getNewStyle(this.canvasModel.extendingStyle);
				this.canvasModel.extendingStyle = style;
				this.canvas.addImage(image, style, PaidiaImages.Extending);
				break;
			case StrategyCategories.Practicing:
				image = this.canvasModel.practicingImage;
				style = this.getNewStyle(this.canvasModel.practicingStyle);
				this.canvasModel.practicingStyle = style;
				this.canvas.addImage(image, style, PaidiaImages.Practicing);
				break;
		}

		this.saveStrategy(strategy);
	}

	getNewStyle(currentStyle: number): number {
		let style = ComponentHelper.RandomWholeNumber(1, environment.numOfStyles);
		while (style == currentStyle) {
			style = ComponentHelper.RandomWholeNumber(1, environment.numOfStyles);
		}
		return style;
	}

	saveStrategy(strategy: Strategy) {
		switch (strategy.title) {
			case StrategyCategories.Learning:
				this.localParent.model.strategyRating.learningRating = ComponentHelper.EmojiToString(strategy.emoji);
				break;
			case StrategyCategories.Extending:
				this.localParent.model.strategyRating.extendingRating = ComponentHelper.EmojiToString(strategy.emoji);
				break;
			case StrategyCategories.Reviewing:
				this.localParent.model.strategyRating.reviewingRating = ComponentHelper.EmojiToString(strategy.emoji);
				break;
			case StrategyCategories.Practicing:
				this.localParent.model.strategyRating.practicingRating = ComponentHelper.EmojiToString(strategy.emoji);
				break;
		}
		this.saveCanvas();
	}

	saveCanvas() {
		setTimeout(() => {
			this.canvasModel.canvas = this.canvas.saveCanvas();
			this.localParent.model.strategyRating.canvas = JSON.stringify(this.canvasModel);
		}, 500);
	}

	nextStep() {
		if (!this.AllowNext) return;
		this.canvasModel.canvas = this.canvas.saveCanvas();
		this.localParent.model.strategyRating = {
			learningRating: ComponentHelper.EmojiToString(this.learningStrategy.emoji),
			reviewingRating: ComponentHelper.EmojiToString(this.reviewingStrategy.emoji),
			practicingRating: ComponentHelper.EmojiToString(this.practicingStrategy.emoji),
			extendingRating: ComponentHelper.EmojiToString(this.extendingStrategy.emoji),
			canvas: JSON.stringify(this.canvasModel),
			interactions: this.interactions
		}
		this.localParent.nextStep();
	}

	@computedFrom("learningStrategy.emoji", "reviewingStrategy.emoji", "practicingStrategy.emoji", "extendingStrategy.emoji")
	get AllowNext(): boolean {
		return this.strategies != null && this.strategies.every(x => !ComponentHelper.NullOrEmpty(x?.emoji));
	}
}