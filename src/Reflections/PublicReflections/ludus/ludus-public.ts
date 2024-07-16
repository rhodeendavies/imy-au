import { autoinject } from "aurelia-framework";
import { PublicReflections } from "../public-reflections";
import { ReflectionsService } from "services/reflectionsService";
import { ComponentHelper } from "utils/componentHelper";
import { EmotionModifier } from "models/prompts";
import { Colours } from "utils/constants";
import { Chart, DoughnutController, ArcElement, Tooltip, Legend, ChartType } from "chart.js";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@autoinject
export class LudusPublic {
	reflections: EmotionModifier[][];
	chart: Chart;
	// firstSentiment: string;
	// secondSentiment: string;
	// thirdSentiment: string;

	constructor(private localParent: PublicReflections, private reflectionsApi: ReflectionsService) { }

	attached() {
		this.getPublicReflections();
	}

	async getPublicReflections() {
		const learningExperiences = await this.reflectionsApi.getLudusPublicReflections(this.localParent.SectionId);
		if (learningExperiences != null && learningExperiences.length > 0) {
			this.reflections = learningExperiences.map(x => ComponentHelper.GetEmotionModifiers(x));
			this.createChart();
		}
	}

	createData() {
		const emotions: EmotionChart[] = [];
		const sentiments: EmotionChart[] = [];

		this.reflections.forEach(x => {
			x.forEach(y => {
				const emotion = emotions.find(z => z.emotion == y.emotion);
				if (emotion != null) {
					emotion.total += y.amount;
				} else {
					emotions.push({
						emotion: y.emotion,
						total: y.amount
					});
				}

				const sentiment = sentiments.find(z => z.emotion == y.text);
				if (sentiment != null) {
					++sentiment.total;
				} else {
					sentiments.push({
						emotion: y.text,
						total: 1
					});
				}
			});
		});

		// sentiments.sort((a, b) => b.total - a.total);
		// this.firstSentiment = sentiments[0].emotion;
		// this.secondSentiment = sentiments[1]?.emotion;
		// this.thirdSentiment = sentiments[2]?.emotion;

		const colours = emotions.map((x, index) => ComponentHelper.GetColourOpacity(Colours.Orange, 1 - ((index - 0.1) / emotions.length)))
		const total = emotions.reduce((prev, curr) => { return prev + curr.total }, 0)
		return {
			labels: emotions.map(x => x.emotion),
			datasets: [{
				label: "",
				data: emotions.map(x => Math.floor(x.total / total * 100)),
				backgroundColor: colours,
				borderColor: colours
			}]
		}
	}

	createChart() {
		const ctx = document.getElementById("ludusPublicSummary") as HTMLCanvasElement;
		if (ctx == null) return;

		if (this.chart != null) {
			this.chart.destroy();
		}

		this.chart = new Chart(ctx,
			{
				type: "doughnut" as ChartType,
				data: this.createData(),
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
}

class EmotionChart {
	emotion: string;
	total: number;
}