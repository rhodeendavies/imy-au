import { autoinject } from "aurelia-framework";
import { LudusEvaluation } from "../ludus-evaluation";
import { ApplicationState } from "applicationState";
import { PromptSection } from "models/prompts";
import { ComponentHelper } from "utils/componentHelper";
import { CategoryScale, Chart, LineController, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import { Colours } from "utils/constants";
import { DateHelper } from "utils/dateHelper";

Chart.register(LineController, Tooltip, CategoryScale, LinearScale, PointElement, LineElement);

@autoinject
export class LudusEvaluationFeelings {

	indexesShown: number[] = [];
	currentIndex: number = 0;
	numOfPrompts: number = 0;
	promptSections: PromptSection[];
	chart: Chart;

	constructor(private localParent: LudusEvaluation, private appState: ApplicationState) { }

	async attached() {
		await this.appState.initPrompts();
		this.indexesShown = [];
		this.numOfPrompts = this.appState.ludusPrompts.evaluatingPrompts.length;
		if (ComponentHelper.NullOrEmpty(this.localParent.model.feelingsLearningEffect.response)) {
			this.getRandomPrompt();
		} else {
			this.promptSections = ComponentHelper.GeneratePromptSections(this.localParent.model.feelingsLearningEffect.response);
			this.promptSections.forEach(x => x.valid = ComponentHelper.InputValid(x.inputValue));
		}
		this.createChart();
	}

	nextStep() {
		this.localParent.model.feelingsLearningEffect.response = ComponentHelper.CreateResponseFromPrompt(this.promptSections);
		this.localParent.nextStep();
	}

	getNewPrompt() {
		++this.localParent.model.feelingsLearningEffect.interactions;
		this.getRandomPrompt();
	}

	getRandomPrompt(tries: number = 0) {
		this.currentIndex = ComponentHelper.RandomWholeNumber(0, this.numOfPrompts - 1);
		if (this.indexesShown.includes(this.currentIndex) && tries < 10) {
			this.getRandomPrompt(++tries);
		}
		this.indexesShown.push(this.currentIndex);
		this.promptSections = this.appState.ludusPrompts.evaluatingPrompts[this.currentIndex];
	}

	createData() {
		return {
			labels: this.localParent.questions.courseFeelings.createdAt.map(x =>
				DateHelper.FormatDate(x, "d LLL")
			),
			datasets: [{
				label: "",
				data: this.localParent.questions.courseFeelings.rating,
				backgroundColor: Colours.OrangeHex,
				borderColor: Colours.OrangeHex
			}]
		}
	}

	createChart() {
		this.chart = new Chart(document.getElementById("feelingsChart") as HTMLCanvasElement,
			{
				type: "line",
				data: this.createData(),
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

	get AllowNext() {
		return this.promptSections != null && this.promptSections.every(x => !x?.input || (x?.inputValue?.length >= 3 && x?.valid));
	}
}