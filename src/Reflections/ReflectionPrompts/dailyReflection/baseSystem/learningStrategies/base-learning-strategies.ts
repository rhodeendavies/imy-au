import { autoinject } from "aurelia-framework";
import { Strategy } from "models/reflections";
import { EnumHelper } from "utils/enumHelper";
import { StrategyCategories } from "utils/enums";
import { BaseDaily } from "../base-daily";

@autoinject
export class BaseLearningStrategies {

	strategies: Strategy[];
	
	constructor(private localParent: BaseDaily) {}

	attached() {
		// TODO: update with call to fetch chosen strategies
		this.strategies = [{
			title: StrategyCategories.Learning,
			strategy: "a test",
			rating: null
		}, {
			title: StrategyCategories.Reviewing,
			strategy: "a test",
			rating: null
		}, {
			title: StrategyCategories.Practicing,
			strategy: "a test",
			rating: null
		}, {
			title: StrategyCategories.Extending,
			strategy: "a test",
			rating: null
		}];

		this.initData();
	}

	initData() {
		if (this.strategies == null) return;
		this.strategies.forEach(x => {
			x.icon = EnumHelper.GetCategoryIcon(x.title);
		});
	}

	submit() {
		if (!this.AllowSubmit) return;
		this.localParent.submitDaily();
	}

	get AllowSubmit(): boolean {
		return this.strategies != null && this.strategies.every(x => x.rating != null);
	}
	
}