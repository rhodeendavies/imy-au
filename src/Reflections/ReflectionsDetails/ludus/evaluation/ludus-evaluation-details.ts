import { autoinject, computedFrom } from "aurelia-framework";
import { LudusComponent, Strategy } from "models/reflections";
import { LudusEvaluatingApiModel } from "models/reflectionsApiModels";
import { LudusEvaluatingQuestions } from "models/reflectionsResponses";
import { ComponentHelper } from "utils/componentHelper";
import { Ludus } from "../ludus";
import { DateHelper } from "utils/dateHelper";
import { ArcElement, CategoryScale, Chart, ChartType, DoughnutController, Legend, LineController, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import { EmotionModifier } from "models/prompts";
import { ApplicationState } from "applicationState";
import { Colours } from "utils/constants";

Chart.register(LineController, Tooltip, CategoryScale, LinearScale, PointElement, LineElement, DoughnutController, ArcElement, Legend);

@autoinject
export class LudusEvaluationDetails {
	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];
	evaluatingReflection: LudusEvaluatingApiModel;
	evaluatingQuestions: LudusEvaluatingQuestions;
	feelingChart: Chart;
	strategyChart: Chart;
	modifiers: EmotionModifier[];

	constructor(private localParent: Ludus, private appState: ApplicationState) { }

	attached() {
		this.evaluatingReflection = null;
		this.evaluatingQuestions = null;
		this.initData();
	}

	initData() {
		if (this.localParent.reflection.evaluatingReflection == null ||
			this.localParent.reflection.evaluatingReflection.answers == null ||
			this.localParent.reflection.evaluatingReflection.questions == null) return;

		this.evaluatingReflection = this.localParent.reflection.evaluatingReflection.answers;
		this.evaluatingQuestions = this.localParent.reflection.evaluatingReflection.questions;

		if (this.evaluatingReflection.strategyRating.learningRating == null) {
			this.evaluatingReflection.strategyRating.learningRating = 0;
		}
		if (this.evaluatingReflection.strategyRating.reviewingRating == null) {
			this.evaluatingReflection.strategyRating.reviewingRating = 0;
		}
		if (this.evaluatingReflection.strategyRating.practicingRating == null) {
			this.evaluatingReflection.strategyRating.practicingRating = 0;
		}
		if (this.evaluatingReflection.strategyRating.extendingRating == null) {
			this.evaluatingReflection.strategyRating.extendingRating = 0;
		}

		this.learningStrategy = ComponentHelper.CreateStrategyFromLudus(
			this.evaluatingQuestions.strategyPlanning.learningStrategy,
			ComponentHelper.StrategyOptions.LearningStrategies,
			this.evaluatingReflection.strategyRating.learningRating
		);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromLudus(
			this.evaluatingQuestions.strategyPlanning.reviewingStrategy,
			ComponentHelper.StrategyOptions.ReviewingStrategies,
			this.evaluatingReflection.strategyRating.reviewingRating
		);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromLudus(
			this.evaluatingQuestions.strategyPlanning.practicingStrategy,
			ComponentHelper.StrategyOptions.PracticingStrategies,
			this.evaluatingReflection.strategyRating.practicingRating
		);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromLudus(
			this.evaluatingQuestions.strategyPlanning.extendingStrategy,
			ComponentHelper.StrategyOptions.ExtendingStrategies,
			this.evaluatingReflection.strategyRating.extendingRating
		);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];

		this.modifiers = ComponentHelper.GetEmotionModifiers(this.evaluatingReflection.learningExperience);

		this.createFeelingsChart();
		this.createStrategyChart();
		
		this.evaluatingQuestions.topicRatings.topics = ComponentHelper.CreateTopics(this.evaluatingReflection.topicRatings.ratings, this.evaluatingQuestions.topicRatings.topics, [])
	}

	createFeelingsData() {
		this.evaluatingQuestions.courseFeelings.createdAt.push(this.localParent.reflection.evaluatingReflection.completedAt);
		this.evaluatingQuestions.courseFeelings.rating.push(this.evaluatingReflection.courseFeelings.rating);

		const feelingsSummary = ComponentHelper.GetFeelingsSummary(this.evaluatingQuestions.courseFeelings);
		feelingsSummary.sort((a, b) => a.createdAt < b.createdAt ? -1 : 1);

		return {
			labels: feelingsSummary.map(x =>
				DateHelper.FormatDate(x.createdAt, "d LLL")
			),
			datasets: [{
				label: "",
				data: feelingsSummary.map(x => x.rating),
				backgroundColor: Colours.OrangeHex,
				borderColor: Colours.OrangeHex
			}]
		}
	}

	createFeelingsChart() {
		const ctx = document.getElementById("feelingsChartDetails") as HTMLCanvasElement;
		if (ctx == null) return;

		if (this.feelingChart != null) {
			this.feelingChart.destroy();
		}

		this.feelingChart = new Chart(ctx,
			{
				type: "line" as ChartType,
				data: this.createFeelingsData(),
				options: {
					aspectRatio: 3,
					plugins: {
						tooltip: {
							callbacks: {
								label: (context) => {
									return `${context.parsed.y} %`
								}
							}
						},
						legend: {
							display: false
						}
					},
					scales: {
						y: {
							beginAtZero: true,
							max: 100,
							ticks: {
								stepSize: 20,
								padding: 20
							}
						}
					}
				}
			});
	}

	createStrategyData() {
		const data: number[] = this.localParent.components.map(x => x.total);
		const colours = data.map((x, index) => ComponentHelper.GetColourOpacity(Colours.Orange, 1 - ((index - 0.1) / this.localParent.components.length)))
		const total = data.reduce((prev, curr) => { return prev + curr }, 0);

		return {
			labels: this.localParent.components.map(x => x.name),
			datasets: [{
				label: "",
				data: data.map(x => {
					return Math.round(x / total * 100);
				}),
				backgroundColor: colours,
				borderColor: colours
			}]
		}
	}

	createStrategyChart() {
		const ctx = document.getElementById("componentsChartDetails") as HTMLCanvasElement;
		if (ctx == null || this.learningStrategy == null || this.reviewingStrategy == null || this.practicingStrategy == null || this.extendingStrategy == null) return;

		if (this.strategyChart != null) {
			this.strategyChart.destroy();
		}

		this.strategyChart = new Chart(ctx,
			{
				type: "doughnut" as ChartType,
				data: this.createStrategyData(),
				options: {
					aspectRatio: 2,
					plugins: {
						tooltip: {
							callbacks: {
								label: (context) => {
									return `${context.parsed} %`
								}
							}
						},
						legend: {
							display: true,
							position: "right"
						}
					}
				}
			});
	}

	@computedFrom("localParent.reflection.id")
	get EvaluatingReflection(): LudusEvaluatingApiModel {
		this.initData();
		return this.evaluatingReflection;
	}

	@computedFrom("localParent.reflection.id")
	get EvaluatingQuestions(): LudusEvaluatingQuestions {
		return this.evaluatingQuestions;
	}

	@computedFrom("evaluatingReflection.feelingsLearningEffect.response")
	get Experience(): string {
		return ComponentHelper.CleanPrompt(this.evaluatingReflection?.feelingsLearningEffect?.response);
	}

	@computedFrom("localParent.reflection.id")
	get DateRecorded(): Date {
		return this.localParent.reflection.evaluatingReflection?.completedAt;
	}
}