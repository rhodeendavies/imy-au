import { autoinject } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";
import { ExtendingStrategies, LearningStrategies, PracticingStrategies, ReviewingStrategies } from "utils/constants";
import { StrategyCategories, StrategyCategoryIcons } from "utils/enums";
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
				{ name: LearningStrategies.One.value, value: LearningStrategies.One.value },
				{ name: LearningStrategies.Two.value, value: LearningStrategies.Two.value },
				{ name: LearningStrategies.Three.value, value: LearningStrategies.Three.value },
				{ name: LearningStrategies.Four.value, value: LearningStrategies.Four.value }
			],
			strategy: "",
			rating: null
		}, {
			title: StrategyCategories.Reviewing,
			icon: StrategyCategoryIcons.Reviewing,
			options: [
				{ name: ReviewingStrategies.One.value, value: ReviewingStrategies.One.value },
				{ name: ReviewingStrategies.Two.value, value: ReviewingStrategies.Two.value },
				{ name: ReviewingStrategies.Three.value, value: ReviewingStrategies.Three.value },
				{ name: ReviewingStrategies.Four.value, value: ReviewingStrategies.Four.value }
			],
			strategy: "",
			rating: null
		}, {
			title: StrategyCategories.Practicing,
			icon: StrategyCategoryIcons.Practicing,
			options: [
				{ name: PracticingStrategies.One.value, value: PracticingStrategies.One.value },
				{ name: PracticingStrategies.Two.value, value: PracticingStrategies.Two.value },
				{ name: PracticingStrategies.Three.value, value: PracticingStrategies.Three.value },
				{ name: PracticingStrategies.Four.value, value: PracticingStrategies.Four.value }
			],
			strategy: "",
			rating: null
		}, {
			title: StrategyCategories.Extending,
			icon: StrategyCategoryIcons.Extending,
			options: [
				{ name: ExtendingStrategies.One.value, value: ExtendingStrategies.One.value },
				{ name: ExtendingStrategies.Two.value, value: ExtendingStrategies.Two.value },
				{ name: ExtendingStrategies.Three.value, value: ExtendingStrategies.Three.value },
				{ name: ExtendingStrategies.Four.value, value: ExtendingStrategies.Four.value }
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