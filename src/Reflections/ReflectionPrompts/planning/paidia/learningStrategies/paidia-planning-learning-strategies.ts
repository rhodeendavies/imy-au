import { autoinject, computedFrom } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";
import { PaidiaCanvasModel, Strategy } from "models/reflections";
import { PaidiaPlanning } from "../paidia-planning";
import environment from "environment";
import { StrategyCategories } from "utils/enums";
import { PaidiaCanvas, PaidiaImages } from "resources/paidiaCanvas/paidia-canvas";
import { ApplicationState } from "applicationState";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class PaidiaPlanningLearningStrategies extends ReflectionStep {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];
	canvas: PaidiaCanvas;
	canvasModel: PaidiaCanvasModel;
	interactions: number = 0;

	constructor(private localParent: PaidiaPlanning, private appState: ApplicationState) { 
		super();
		this.stepParent = localParent;
	}

	attached() {
		this.initData();
	}

	initData() {
		this.learningStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.localParent.model.strategyPlanning.learningStrategy,
			ComponentHelper.StrategyOptions.LearningStrategies
		);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.localParent.model.strategyPlanning.reviewingStrategy,
			ComponentHelper.StrategyOptions.ReviewingStrategies
		);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.localParent.model.strategyPlanning.practicingStrategy,
			ComponentHelper.StrategyOptions.PracticingStrategies
		);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromPaidia(
			this.localParent.model.strategyPlanning.extendingStrategy,
			ComponentHelper.StrategyOptions.ExtendingStrategies
		);
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
		
		if (this.localParent.model.strategyPlanning.interactions?.value == null) {
			this.interactions = 0;
		} else {
			this.interactions = this.localParent.model.strategyPlanning.interactions.value;
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
				this.canvas.addImage(image, style, PaidiaImages.Learning);
				break;
			case StrategyCategories.Reviewing:
				image = this.canvasModel.reviewingImages[strategy.index];
				style = this.canvasModel.reviewingStyles[strategy.index];
				this.canvasModel.reviewingImage = image;
				this.canvas.addImage(image, style, PaidiaImages.Reviewing);
				break;
			case StrategyCategories.Extending:
				image = this.canvasModel.extendingImages[strategy.index];
				style = this.canvasModel.extendingStyles[strategy.index];
				this.canvasModel.extendingImage = image;
				this.canvas.addImage(image, style, PaidiaImages.Extending);
				break;
			case StrategyCategories.Practicing:
				image = this.canvasModel.practicingImages[strategy.index];
				style = this.canvasModel.practicingStyles[strategy.index];
				this.canvasModel.practicingImage = image;
				this.canvas.addImage(image, style, PaidiaImages.Practicing);
				break;
		}

		this.saveStrategy(strategy);
	}

	saveStrategy(strategy: Strategy) {
		switch (strategy.title) {
			case StrategyCategories.Learning:
				this.localParent.model.strategyPlanning.learningStrategy = strategy.strategy;
				break;
			case StrategyCategories.Extending:
				this.localParent.model.strategyPlanning.extendingStrategy = strategy.strategy;
				break;
			case StrategyCategories.Reviewing:
				this.localParent.model.strategyPlanning.reviewingStrategy = strategy.strategy;
				break;
			case StrategyCategories.Practicing:
				this.localParent.model.strategyPlanning.practicingStrategy = strategy.strategy;
				break;
		}
		this.saveCanvas();
	}

	saveCanvas() {
		setTimeout(() => {
			this.canvasModel.canvas = this.canvas.saveCanvas();
			this.localParent.model.strategyPlanning.canvas = JSON.stringify(this.canvasModel);
		}, 500);
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

	saveStep() {
		this.canvasModel.canvas = this.canvas.saveCanvas();
		this.localParent.model.strategyPlanning = {
			learningStrategy: this.learningStrategy.strategy,
			reviewingStrategy: this.reviewingStrategy.strategy,
			practicingStrategy: this.practicingStrategy.strategy,
			extendingStrategy: this.extendingStrategy.strategy,
			canvas: JSON.stringify(this.canvasModel),
			interactions: {
				value: this.interactions
			}
		}
	}

	@computedFrom("learningStrategy.strategy", "reviewingStrategy.strategy", "practicingStrategy.strategy", "extendingStrategy.strategy")
	get AllowNext(): boolean {
		return this.strategies != null && this.strategies.every(x => !ComponentHelper.NullOrEmpty(x?.strategy));
	}
}