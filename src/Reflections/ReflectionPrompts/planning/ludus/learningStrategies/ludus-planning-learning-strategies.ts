import { autoinject } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";
import { ExtendingStrategies, LearningStrategies, PracticingStrategies, ReviewingStrategies, StrategyModifier } from "utils/constants";
import { StrategyCategories, StrategyCategoryIcons } from "utils/enums";
import { LudusPlanning } from "../ludus-planning";

@autoinject
export class LudusPlanningLearningStrategies {

	constructor(private localParent: LudusPlanning) { }


	attached() {
		if (ComponentHelper.ListNullOrEmpty(this.localParent.model.strategies)) {
			this.initData();
		}
	}

	createModifiersString(modifiers: StrategyModifier[]): string {
		return modifiers.map(x => `${x.type} +${x.value}`).join(", ");
	}

	initData() {
		this.localParent.model.strategies = [{
			title: StrategyCategories.Learning,
			icon: StrategyCategoryIcons.Learning,
			options: [
				{ 
					name: LearningStrategies.One.value,
					subText: this.createModifiersString(LearningStrategies.One.modifiers),
					value: LearningStrategies.One.value
				},
				{ 
					name: LearningStrategies.Two.value,
					subText: this.createModifiersString(LearningStrategies.Two.modifiers),
					value: LearningStrategies.Two.value
				},
				{ 
					name: LearningStrategies.Three.value,
					subText: this.createModifiersString(LearningStrategies.Three.modifiers),
					value: LearningStrategies.Three.value
				},
				{ 
					name: LearningStrategies.Four.value,
					subText: this.createModifiersString(LearningStrategies.Four.modifiers),
					value: LearningStrategies.Four.value
				}
			],
			strategy: "",
			rating: null
		}, {
			title: StrategyCategories.Reviewing,
			icon: StrategyCategoryIcons.Reviewing,
			options: [
				{ 
					name: ReviewingStrategies.One.value,
					subText: this.createModifiersString(ReviewingStrategies.One.modifiers),
					value: ReviewingStrategies.One.value
				},
				{ 
					name: ReviewingStrategies.Two.value,
					subText: this.createModifiersString(ReviewingStrategies.Two.modifiers),
					value: ReviewingStrategies.Two.value
				},
				{ 
					name: ReviewingStrategies.Three.value,
					subText: this.createModifiersString(ReviewingStrategies.Three.modifiers),
					value: ReviewingStrategies.Three.value
				},
				{ 
					name: ReviewingStrategies.Four.value,
					subText: this.createModifiersString(ReviewingStrategies.Four.modifiers),
					value: ReviewingStrategies.Four.value
				}
			],
			strategy: "",
			rating: null
		}, {
			title: StrategyCategories.Practicing,
			icon: StrategyCategoryIcons.Practicing,
			options: [
				{ 
					name: PracticingStrategies.One.value,
					subText: this.createModifiersString(PracticingStrategies.One.modifiers),
					value: PracticingStrategies.One.value
				},
				{ 
					name: PracticingStrategies.Two.value,
					subText: this.createModifiersString(PracticingStrategies.Two.modifiers),
					value: PracticingStrategies.Two.value
				},
				{ 
					name: PracticingStrategies.Three.value,
					subText: this.createModifiersString(PracticingStrategies.Three.modifiers),
					value: PracticingStrategies.Three.value
				},
				{ 
					name: PracticingStrategies.Four.value,
					subText: this.createModifiersString(PracticingStrategies.Four.modifiers),
					value: PracticingStrategies.Four.value
				}
			],
			strategy: "",
			rating: null
		}, {
			title: StrategyCategories.Extending,
			icon: StrategyCategoryIcons.Extending,
			options: [
				{ 
					name: ExtendingStrategies.One.value,
					subText: this.createModifiersString(ExtendingStrategies.One.modifiers),
					value: ExtendingStrategies.One.value
				},
				{ 
					name: ExtendingStrategies.Two.value,
					subText: this.createModifiersString(ExtendingStrategies.Two.modifiers),
					value: ExtendingStrategies.Two.value
				},
				{ 
					name: ExtendingStrategies.Three.value,
					subText: this.createModifiersString(ExtendingStrategies.Three.modifiers),
					value: ExtendingStrategies.Three.value
				},
				{ 
					name: ExtendingStrategies.Four.value,
					subText: this.createModifiersString(ExtendingStrategies.Four.modifiers),
					value: ExtendingStrategies.Four.value
				}
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