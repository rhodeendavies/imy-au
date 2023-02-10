import { autoinject, computedFrom } from "aurelia-framework";
import { PaidiaCanvasModel, Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { ApplicationState } from "applicationState";
import { PaidiaDaily } from "../paidia-daily";
import { PaidiaCanvas, PaidiaImages } from "resources/paidiaCanvas/paidia-canvas";
import { StrategyCategories } from "utils/enums";
import environment from "environment";

@autoinject
export class PaidiaLearningStrategies {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];
	canvas: PaidiaCanvas;
	canvasModel: PaidiaCanvasModel;

	constructor(private localParent: PaidiaDaily, private appState: ApplicationState) { }

	attached() {
		this.initData();
	}

	initData() {
		this.learningStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.localParent.questions[0].learningStrategy,
			this.appState.strategyOptions.LearningStrategies,
			this.localParent.model.strategyRating.learningRating
		);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.localParent.questions[0].reviewingStrategy,
			this.appState.strategyOptions.ReviewingStrategies,
			this.localParent.model.strategyRating.reviewingRating
		);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.localParent.questions[0].practicingStrategy,
			this.appState.strategyOptions.PracticingStrategies,
			this.localParent.model.strategyRating.practicingRating
		);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.localParent.questions[0].extendingStrategy,
			this.appState.strategyOptions.ExtendingStrategies,
			this.localParent.model.strategyRating.extendingRating
		);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];
		
		if (ComponentHelper.NullOrEmpty(this.localParent.model.strategyRating.canvas)) {
			this.canvasModel = JSON.parse(this.localParent.questions[1].canvas);
		} else {
			this.canvasModel = JSON.parse(this.localParent.model.strategyRating.canvas);
		}
		this.canvas.loadCanvas(this.canvasModel.canvas);
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
	}

	getNewStyle(currentStyle: number): number {
		let style = ComponentHelper.RandomWholeNumber(1, environment.numOfStyles);
		while (style == currentStyle) {
			style = ComponentHelper.RandomWholeNumber(1, environment.numOfStyles);
		}
		return style;
	}

	submit() {
		if (!this.AllowSubmit) return;
		this.canvasModel.canvas = this.canvas.saveCanvas();
		this.localParent.model.strategyRating = {
			learningRating: ComponentHelper.EmojiToString(this.learningStrategy.emoji),
			reviewingRating: ComponentHelper.EmojiToString(this.reviewingStrategy.emoji),
			practicingRating: ComponentHelper.EmojiToString(this.practicingStrategy.emoji),
			extendingRating: ComponentHelper.EmojiToString(this.extendingStrategy.emoji),
			canvas: JSON.stringify(this.canvasModel)
		}
		this.localParent.submitDaily();
	}

	@computedFrom("learningStrategy.emoji", "reviewingStrategy.emoji", "practicingStrategy.emoji", "extendingStrategy.emoji")
	get AllowSubmit(): boolean {
		return this.strategies != null && this.strategies.every(x => !ComponentHelper.NullOrEmpty(x?.emoji));
	}
}