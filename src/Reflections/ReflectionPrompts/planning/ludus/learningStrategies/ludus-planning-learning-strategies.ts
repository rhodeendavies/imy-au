import { autoinject, computedFrom } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";
import { Colours, StrategyOptions } from "utils/constants";
import { LudusPlanning } from "../ludus-planning";
import { LudusComponent, Strategy } from "models/reflections";
import { Busy } from "resources/busy/busy";
import { log } from "utils/log";
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@autoinject
export class LudusPlanningLearningStrategies {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	busy: Busy = new Busy();
	components: LudusComponent[];
	chart: Chart;
	chartUpdated: boolean = false;
	strategies: Strategy[];

	constructor(private localParent: LudusPlanning) { }

	attached() {
		try {
			this.busy.on();
			this.chartUpdated = false;
			this.initData();
			this.updateChart();
		} catch (error) {
			log.error(error);
		} finally {
			this.busy.off();
		}
	}

	initData() {
		this.learningStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.model.strategyPlanning.learningStrategy, StrategyOptions.LearningStrategies);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.model.strategyPlanning.reviewingStrategy, StrategyOptions.ReviewingStrategies);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.model.strategyPlanning.practicingStrategy, StrategyOptions.PracticingStrategies);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.model.strategyPlanning.extendingStrategy, StrategyOptions.ExtendingStrategies);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];
	}

	submit() {
		if (!this.AllowSubmit) return;
		this.localParent.model.strategyPlanning = {
			learningStrategy: ComponentHelper.CreateLudusModifier(this.learningStrategy),
			reviewingStrategy: ComponentHelper.CreateLudusModifier(this.reviewingStrategy),
			practicingStrategy: ComponentHelper.CreateLudusModifier(this.practicingStrategy),
			extendingStrategy: ComponentHelper.CreateLudusModifier(this.extendingStrategy),
		}
		this.localParent.submitPlanning();
	}

	createData(emptyChart: boolean) {
		if (emptyChart) {
			return {
				labels: [""],
				datasets: [{
					label: "",
					data: [1],
					backgroundColor: "#fff",
					borderColor: [Colours.OrangeHex]
				}]
			}
		}
		
		
		this.components = ComponentHelper.GetUniqueComponents([], ComponentHelper.GetAllModifiers(this.strategies));
		const data: number[] = this.components.map(x => x.total);
		const colours = data.map((x, index) => ComponentHelper.GetColourOpacity(Colours.Orange, 1 - ((index-0.1)/this.components.length)))
		const total = data.reduce((prev, curr) => { return prev + curr }, 0);
		
		return {
			labels: this.components.map(x => x.name),
			datasets: [{
				label: "",
				data: data.map(x => {
					return x/ total * 100;
				}),
				backgroundColor: colours,
				borderColor: colours
			}]
		}
	}

	updateChart() {
		setTimeout(() => {
			const emptyChart = this.strategies.every(x => ComponentHelper.NullOrEmpty(x.strategy));
			this.createChart(emptyChart);
		}, 0);
	}

	createChart(emptyChart: boolean) {
		const context = document.getElementById("componentsChart") as HTMLCanvasElement;
		if (context == null) return;

		if (this.chart == null) {
			this.chart = new Chart(context,
			{
				type: "doughnut",
				data: this.createData(emptyChart),
				options: {
					animation: false,
					aspectRatio: 2,
					layout: {
						padding: {
							top: 0,
							bottom: 0,
							right: 0,
							left: 0
						}
					},
					plugins: {
						tooltip: {
							callbacks: {
								label: (context) => {
									return `${context.parsed} %`
								}
							}
						},
						legend: {
							display: !emptyChart,
							position: "right"
						}
					}
				}
			});
		} else {
			this.chart.data = this.createData(emptyChart);
			this.chart.options.plugins.legend.display = !emptyChart;
			if (this.chartUpdated) {
				this.chart.update("none");
			} else {
				this.chart.update();
			}

			this.chartUpdated = !emptyChart;
		}
	}

	@computedFrom("learningStrategy.strategy", "reviewingStrategy.strategy", "practicingStrategy.strategy", "extendingStrategy.strategy")
	get AllowSubmit(): boolean {
		return this.strategies != null && this.strategies.every(x => !ComponentHelper.NullOrEmpty(x?.strategy));
	}
}