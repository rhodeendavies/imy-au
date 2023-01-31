import { autoinject, computedFrom } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";
import { StrategyOptions } from "utils/constants";
import { PaidiaCanvasModel, Strategy } from "models/reflections";
import { PaidiaPlanning } from "../paidia-planning";
import environment from "environment";
import { StrategyCategories } from "utils/enums";
import { log } from "utils/log";
import { PaidiaCanvas, LudusImages } from "resources/paidiaCanvas/paidia-canvas";

@autoinject
export class PaidiaPlanningLearningStrategies {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];
	canvas: PaidiaCanvas;
	canvasModel: PaidiaCanvasModel;

	constructor(private localParent: PaidiaPlanning) { }

	attached() {
		this.initData();
	}

	initData() {
		this.learningStrategy = ComponentHelper.CreateStrategyFromPaidia(this.localParent.model.strategyPlanning.learningStrategy, StrategyOptions.LearningStrategies);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromPaidia(this.localParent.model.strategyPlanning.reviewingStrategy, StrategyOptions.ReviewingStrategies);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromPaidia(this.localParent.model.strategyPlanning.practicingStrategy, StrategyOptions.PracticingStrategies);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromPaidia(this.localParent.model.strategyPlanning.extendingStrategy, StrategyOptions.ExtendingStrategies);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];

		if (ComponentHelper.NullOrEmpty(this.localParent.model.strategyPlanning.canvas)) {
			this.canvasModel = new PaidiaCanvasModel();
			this.generateRandomImagesForStrategies();
			const backgroundImageNo = ComponentHelper.RandomWholeNumber(1, environment.numOfBackgroundImages);
			this.canvas.createCanvas(backgroundImageNo);
		} else {
			this.canvasModel = JSON.parse(this.localParent.model.strategyPlanning.canvas)
			this.canvas.loadCanvas(this.canvasModel.canvas);
		}
	}

	updateStrategy(strategy: Strategy) {
		let image = 0;
		let style = 0;
		switch (strategy.title) {
			case StrategyCategories.Learning:
				image = this.canvasModel.learningImages[strategy.index];
				style = this.canvasModel.learningStyles[strategy.index];
				this.canvasModel.learningImage = image;
				this.canvas.addImage(image, style, LudusImages.Learning);
				break;
			case StrategyCategories.Reviewing:
				image = this.canvasModel.reviewingImages[strategy.index];
				style = this.canvasModel.reviewingStyles[strategy.index];
				this.canvasModel.reviewingImage = image;
				this.canvas.addImage(image, style, LudusImages.Reviewing);
				break;
			case StrategyCategories.Extending:
				image = this.canvasModel.extendingImages[strategy.index];
				style = this.canvasModel.extendingStyles[strategy.index];
				this.canvasModel.extendingImage = image;
				this.canvas.addImage(image, style, LudusImages.Extending);
				break;
			case StrategyCategories.Practicing:
				image = this.canvasModel.practicingImages[strategy.index];
				style = this.canvasModel.practicingStyles[strategy.index];
				this.canvasModel.practicingImage = image;
				this.canvas.addImage(image, style, LudusImages.Practicing);
				break;
		}
	}

	generateRandomImagesForStrategies() {
		for (let i = 0; i < 4; i++) {
			this.canvasModel.learningImages[i] = this.generateRandomImages();
			this.canvasModel.practicingImages[i] = this.generateRandomImages();
			this.canvasModel.extendingImages[i] = this.generateRandomImages();
			this.canvasModel.reviewingImages[i] = this.generateRandomImages();

			this.canvasModel.learningStyles[i] = ComponentHelper.RandomWholeNumber(1, environment.numOfStyles);
			this.canvasModel.practicingStyles[i] = ComponentHelper.RandomWholeNumber(1, environment.numOfStyles);
			this.canvasModel.extendingStyles[i] = ComponentHelper.RandomWholeNumber(1, environment.numOfStyles);
			this.canvasModel.reviewingStyles[i] = ComponentHelper.RandomWholeNumber(1, environment.numOfStyles);
		}
	}

	generateRandomImages(): number {
		let imageNo = this.getRandomImage();
		while (this.canvasModel.learningImages.includes(imageNo) ||
			this.canvasModel.practicingImages.includes(imageNo) ||
			this.canvasModel.extendingImages.includes(imageNo) ||
			this.canvasModel.reviewingImages.includes(imageNo)) {
			imageNo = this.getRandomImage();
		}
		return imageNo;
	}

	getRandomImage(): number {
		return ComponentHelper.RandomWholeNumber(1, environment.numOfCutOutImages);
	}

	submit() {
		if (!this.AllowSubmit) return;
		this.canvasModel.canvas = JSON.stringify(this.canvas.saveCanvas());
		this.localParent.model.strategyPlanning = {
			learningStrategy: this.learningStrategy.strategy,
			reviewingStrategy: this.reviewingStrategy.strategy,
			practicingStrategy: this.practicingStrategy.strategy,
			extendingStrategy: this.extendingStrategy.strategy,
			canvas: JSON.stringify(this.canvasModel)
		}
		this.localParent.nextStep();
	}



	@computedFrom("learningStrategy.strategy", "reviewingStrategy.strategy", "practicingStrategy.strategy", "extendingStrategy.strategy")
	get AllowSubmit(): boolean {
		return this.strategies != null && this.strategies.every(x => !ComponentHelper.NullOrEmpty(x?.strategy));
	}
}