import { autoinject } from "aurelia-framework";
import { BaseSystemDaily } from "models/reflections";
import { DailyPrompts } from "../daily-prompts";
import { BaseSystemDailyApiModel } from "models/reflectionsResponses";
import { StrategyCategories } from "utils/enums";

@autoinject
export class BaseDaily {

	model: BaseSystemDaily;

	constructor(private localParent: DailyPrompts) {}

	attached() {
		this.model = new BaseSystemDaily();
	}

	nextStep(apiModel: BaseSystemDailyApiModel) {
		this.localParent.submitDaily(apiModel, false);
		this.localParent.nextStep();
	}

	submitDaily() {
		const apiModel: BaseSystemDailyApiModel = {
			courseFeelings: {
				rating: this.model.feeling
			},
			strategyRating: {
				learningRating: this.model.strategies.find(x => x.title == StrategyCategories.Learning).rating,
				reviewingRating: this.model.strategies.find(x => x.title == StrategyCategories.Reviewing).rating,
				practicingRating: this.model.strategies.find(x => x.title == StrategyCategories.Practicing).rating,
				extendingRating: this.model.strategies.find(x => x.title == StrategyCategories.Extending).rating
			},
			completed: true
		}
		this.localParent.submitDaily(apiModel, true);
	}
}