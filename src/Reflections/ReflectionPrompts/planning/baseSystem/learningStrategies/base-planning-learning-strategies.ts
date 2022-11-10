import { autoinject } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";
import { ExtendingStrategies, LearningStrategies, PracticingStrategies, ReviewingStrategies, StrategyCategories, StrategyCategoryIcons } from "utils/enums";
import { BasePlanning } from "../base-planning";

@autoinject
export class BasePlanningLearningStrategies {

	constructor(private localParent: BasePlanning) { }


	attached() {
		if (ComponentHelper.ListNullOrEmpty(this.localParent.model.strategies)) {
			this.initData();
		}
	}

	initData() {
		this.localParent.model.strategies = [{
			title: StrategyCategories.Learning,
			icon: StrategyCategoryIcons.Learning,
			options: [
				{ name: LearningStrategies.One, value: LearningStrategies.One },
				{ name: LearningStrategies.Two, value: LearningStrategies.Two },
				{ name: LearningStrategies.Three, value: LearningStrategies.Three },
				{ name: LearningStrategies.Four, value: LearningStrategies.Four }
			],
			strategy: "",
			rating: null
		}, {
			title: StrategyCategories.Reviewing,
			icon: StrategyCategoryIcons.Reviewing,
			options: [
				{ name: ReviewingStrategies.One, value: ReviewingStrategies.One },
				{ name: ReviewingStrategies.Two, value: ReviewingStrategies.Two },
				{ name: ReviewingStrategies.Three, value: ReviewingStrategies.Three },
				{ name: ReviewingStrategies.Four, value: ReviewingStrategies.Four }
			],
			strategy: "",
			rating: null
		}, {
			title: StrategyCategories.Practicing,
			icon: StrategyCategoryIcons.Practicing,
			options: [
				{ name: PracticingStrategies.One, value: PracticingStrategies.One },
				{ name: PracticingStrategies.Two, value: PracticingStrategies.Two },
				{ name: PracticingStrategies.Three, value: PracticingStrategies.Three },
				{ name: PracticingStrategies.Four, value: PracticingStrategies.Four }
			],
			strategy: "",
			rating: null
		}, {
			title: StrategyCategories.Extending,
			icon: StrategyCategoryIcons.Extending,
			options: [
				{ name: ExtendingStrategies.One, value: ExtendingStrategies.One },
				{ name: ExtendingStrategies.Two, value: ExtendingStrategies.Two },
				{ name: ExtendingStrategies.Three, value: ExtendingStrategies.Three },
				{ name: ExtendingStrategies.Four, value: ExtendingStrategies.Four }
			],
			strategy: "",
			rating: null
		}];
	}

	submit() {
		if (!this.AllowSubmit) return;
		this.localParent.submitPlanning();
	}

	get AllowSubmit(): boolean {
		return this.localParent.model.strategies != null && this.localParent.model.strategies.every(x => !ComponentHelper.NullOrEmpty(x.strategy));
	}
}