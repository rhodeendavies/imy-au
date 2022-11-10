import { autoinject } from "aurelia-framework";
import { Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { EnumHelper } from "utils/enumHelper";
import { StrategyCategories } from "utils/enums";
import { BaseDaily } from "../base-daily";

@autoinject
export class BaseLearningStrategies {

	constructor(private localParent: BaseDaily) {}

	attached() {
		if (ComponentHelper.ListNullOrEmpty(this.localParent.model.strategies)) {
			// TODO: update with call to fetch chosen strategies
			this.localParent.model.strategies = [{
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
	}

	initData() {
		if (this.localParent.model.strategies == null) return;
		this.localParent.model.strategies.forEach(x => {
			x.icon = EnumHelper.GetCategoryIcon(x.title);
		});
	}

	submit() {
		if (!this.AllowSubmit) return;
		this.localParent.submitDaily();
	}

	get AllowSubmit(): boolean {
		return this.localParent.model.strategies != null && this.localParent.model.strategies.every(x => x.rating != null);
	}
	
}