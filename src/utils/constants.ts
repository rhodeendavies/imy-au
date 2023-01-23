import { LudusModifier } from "models/reflectionsApiModels";
import { StrategyCategories, StrategyCategoryIcons, StrategyModifiers } from "./enums";

export class Events {
	static readonly AccordionToggle: string = "AccordionToggle";
	static readonly Login: string = "Login";
	static readonly Logout: string = "Logout";
	static readonly DailyTriggered: string = "DailyTriggered";
	static readonly RefreshApp: string = "RefreshApp";
}

export class Routes {
	static readonly AdminDash: string = "admin-dashboard";
	static readonly Login: string = "login";
	static readonly Dashboard: string = "home";
	static readonly Reflections: string = "reflections";
	static readonly CourseContent: string = "content";
}

export class Colours {
	static readonly Orange: Colour = {
		red: 242,
		green: 100,
		blue: 48
	}
	static readonly OrangeHex: string = "#F26430"
}

export class Colour {
	red: number;
	green: number;
	blue: number;
}

export class StrategyWrapper {
	value: string;
	modifiers: LudusModifier[];
}

export class StrategyOption {
	title: StrategyCategories;
	icon: StrategyCategoryIcons;
	One: StrategyWrapper;
	Two: StrategyWrapper;
	Three: StrategyWrapper;
	Four: StrategyWrapper;
}

export class StrategyOptions {
	static readonly LearningStrategies: StrategyOption = {
		title: StrategyCategories.Learning,
		icon: StrategyCategoryIcons.Learning,
		One: {
			value: "Watch all the videos near the beginning of the week",
			modifiers: [{
				name: StrategyModifiers.TimeManagement,
				amount: 5
			}, {
				name: StrategyModifiers.Research,
				amount: 1
			}]
		},
		Two: {
			value: "Watch one video a day",
			modifiers: [{
				name: StrategyModifiers.TimeManagement,
				amount: 2
			}, {
				name: StrategyModifiers.Research,
				amount: 3
			}]
		},
		Three: {
			value: "Summarise what I have learnt after watching each",
			modifiers: [{
				name: StrategyModifiers.Research,
				amount: 5
			}]
		},
		Four: {
			value: "Take notes while watching the videos",
			modifiers: [{
				name: StrategyModifiers.Interaction,
				amount: 5
			}]
		}
	};
	static readonly ReviewingStrategies: StrategyOption = {
		title: StrategyCategories.Reviewing,
		icon: StrategyCategoryIcons.Reviewing,
		One: {
			value: "Review the lecture slides after",
			modifiers: [{
				name: StrategyModifiers.Research,
				amount: 5
			}]
		},
		Two: {
			value: "Practice the practical concepts in the video <strong>while</strong> watching it",
			modifiers: [{
				name: StrategyModifiers.Interaction,
				amount: 2
			}]
		},
		Three: {
			value: "Practice the practical concepts in the video <strong>after</strong> watching it",
			modifiers: [{
				name: StrategyModifiers.Interaction,
				amount: 5
			}]
		},
		Four: {
			value: "Review and tweak the provided extra resources (like code files) after watching the videos",
			modifiers: [{
				name: StrategyModifiers.Interaction,
				amount: 3
			}]
		}
	};
	static readonly PracticingStrategies: StrategyOption = {
		title: StrategyCategories.Practicing,
		icon: StrategyCategoryIcons.Practicing,
		One: {
			value: "Review the lecture slides after",
			modifiers: [{
				name: StrategyModifiers.Research,
				amount: 2
			}]
		},
		Two: {
			value: "Practice the practical concepts in the video <strong>while</strong> watching it",
			modifiers: [{
				name: StrategyModifiers.Interaction,
				amount: 3
			}]
		},
		Three: {
			value: "Practice the practical concepts in the video <strong>after</strong> watching it",
			modifiers: [{
				name: StrategyModifiers.Interaction,
				amount: 5
			}]
		},
		Four: {
			value: "Review and tweak the provided extra resources (like code files) after watching the videos",
			modifiers: [{
				name: StrategyModifiers.Interaction,
				amount: 5
			}]
		}
	};
	static readonly ExtendingStrategies: StrategyOption = {
		title: StrategyCategories.Extending,
		icon: StrategyCategoryIcons.Extending,
		One: {
			value: "Speak to my classmates about the concepts in the videos",
			modifiers: [{
				name: StrategyModifiers.Interaction,
				amount: 5
			}]
		},
		Two: {
			value: "Practice the concepts in the videos in a project of my own",
			modifiers: [{
				name: StrategyModifiers.Interaction,
				amount: 3
			}]
		},
		Three: {
			value: "Search the web for examples of the concepts mentioned in the videos",
			modifiers: [{
				name: StrategyModifiers.Research,
				amount: 5
			}]
		},
		Four: {
			value: "Search the web for extra resources relating to the concepts mentioned in the videos",
			modifiers: [{
				name: StrategyModifiers.Research,
				amount: 5
			}]
		}
	};
}