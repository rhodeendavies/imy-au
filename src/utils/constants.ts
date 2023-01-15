import { StrategyCategories, StrategyCategoryIcons, StrategyModifiers } from "./enums";

export class Events {
	static readonly AccordionToggle: string = "AccordionToggle";
	static readonly Login: string = "Login";
	static readonly Logout: string = "Logout";
	static readonly DailyTriggered: string = "DailyTriggered";
	static readonly PlanningTriggered: string = "PlanningTriggered";
	static readonly MonitoringTriggered: string = "MonitoringTriggered";
	static readonly EvaluationTriggered: string = "EvaluationTriggered";
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
}

export class Colour {
	red: number;
	green: number;
	blue: number;
}

export class StrategyWrapper {
	value: string;
	modifiers: StrategyModifier[];
}

export class StrategyModifier {
	type: StrategyModifiers | string;
	value: number;
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
				type: StrategyModifiers.TimeManagement,
				value: 5
			}, {
				type: StrategyModifiers.Research,
				value: 1
			}]
		},
		Two: {
			value: "Watch one video a day",
			modifiers: [{
				type: StrategyModifiers.TimeManagement,
				value: 2
			}, {
				type: StrategyModifiers.Research,
				value: 3
			}]
		},
		Three: {
			value: "Summarise what I have learnt after watching each",
			modifiers: [{
				type: StrategyModifiers.Research,
				value: 5
			}]
		},
		Four: {
			value: "Take notes while watching the videos",
			modifiers: [{
				type: StrategyModifiers.Interaction,
				value: 5
			}]
		}
	};
	static readonly ReviewingStrategies: StrategyOption = {
		title: StrategyCategories.Reviewing,
		icon: StrategyCategoryIcons.Reviewing,
		One: {
			value: "Review the lecture slides after",
			modifiers: [{
				type: StrategyModifiers.Research,
				value: 5
			}]
		},
		Two: {
			value: "Practice the practical concepts in the video <strong>while</strong> watching it",
			modifiers: [{
				type: StrategyModifiers.Interaction,
				value: 2
			}]
		},
		Three: {
			value: "Practice the practical concepts in the video <strong>after</strong> watching it",
			modifiers: [{
				type: StrategyModifiers.Interaction,
				value: 5
			}]
		},
		Four: {
			value: "Review and tweak the provided extra resources (like code files) after watching the videos",
			modifiers: [{
				type: StrategyModifiers.Interaction,
				value: 3
			}]
		}
	};
	static readonly PracticingStrategies: StrategyOption = {
		title: StrategyCategories.Practicing,
		icon: StrategyCategoryIcons.Practicing,
		One: {
			value: "Review the lecture slides after",
			modifiers: [{
				type: StrategyModifiers.Research,
				value: 2
			}]
		},
		Two: {
			value: "Practice the practical concepts in the video <strong>while</strong> watching it",
			modifiers: [{
				type: StrategyModifiers.Interaction,
				value: 3
			}]
		},
		Three: {
			value: "Practice the practical concepts in the video <strong>after</strong> watching it",
			modifiers: [{
				type: StrategyModifiers.Interaction,
				value: 5
			}]
		},
		Four: {
			value: "Review and tweak the provided extra resources (like code files) after watching the videos",
			modifiers: [{
				type: StrategyModifiers.Interaction,
				value: 5
			}]
		}
	};
	static readonly ExtendingStrategies: StrategyOption = {
		title: StrategyCategories.Extending,
		icon: StrategyCategoryIcons.Extending,
		One: {
			value: "Speak to my classmates about the concepts in the videos",
			modifiers: [{
				type: StrategyModifiers.Interaction,
				value: 5
			}]
		},
		Two: {
			value: "Practice the concepts in the videos in a project of my own",
			modifiers: [{
				type: StrategyModifiers.Interaction,
				value: 3
			}]
		},
		Three: {
			value: "Search the web for examples of the concepts mentioned in the videos",
			modifiers: [{
				type: StrategyModifiers.Research,
				value: 5
			}]
		},
		Four: {
			value: "Search the web for extra resources relating to the concepts mentioned in the videos",
			modifiers: [{
				type: StrategyModifiers.Research,
				value: 5
			}]
		}
	};
}