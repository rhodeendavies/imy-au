import { StrategyModifiers } from "./enums";

export class Events {
	static readonly AccordionToggle: string = "AccordionToggle";
	static readonly Login: string = "Login";
	static readonly Logout: string = "Logout";
	static readonly LessonRated: string = "LessonRated";
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

export class StrategyWrapper {
	value: string;
	modifiers: StrategyModifier[];
}

export class StrategyModifier {
	type: StrategyModifiers;
	value: number;
}

export class LearningStrategies {
	static readonly One: StrategyWrapper = {
		value: "Watch all the videos near the beginning of the week",
		modifiers: [{
			type: StrategyModifiers.TimeManagement,
			value: 5
		}]
	};
	static readonly Two: StrategyWrapper = {
		value: "Watch one video a day",
		modifiers: [{
			type: StrategyModifiers.TimeManagement,
			value: 2
		}]
	};
	static readonly Three: StrategyWrapper = {
		value: "Summarise what I have learnt after watching each",
		modifiers: [{
			type: StrategyModifiers.Research,
			value: 5
		}]
	};
	static readonly Four: StrategyWrapper = {
		value: "Take notes while watching the videos",
		modifiers: [{
			type: StrategyModifiers.Interaction,
			value: 5
		}]
	};
}

export class ReviewingStrategies {
	static readonly One: StrategyWrapper = {
		value: "Review the lecture slides after",
		modifiers: [{
			type: StrategyModifiers.Research,
			value: 5
		}]
	}
	static readonly Two: StrategyWrapper = {
		value: "Practice the practical concepts in the video <strong>while</strong> watching it",
		modifiers: [{
			type: StrategyModifiers.Interaction,
			value: 2
		}]
	}
	static readonly Three: StrategyWrapper = {
		value: "Practice the practical concepts in the video <strong>after</strong> watching it",
		modifiers: [{
			type: StrategyModifiers.Interaction,
			value: 5
		}]
	}
	static readonly Four: StrategyWrapper = {
		value: "Review and tweak the provided extra resources (like code files) after watching the videos",
		modifiers: [{
			type: StrategyModifiers.Interaction,
			value: 3
		}]
	}
}

export class PracticingStrategies {
	static readonly One: StrategyWrapper = {
		value: "Review the lecture slides after",
		modifiers: [{
			type: StrategyModifiers.Research,
			value: 2
		}]
	};
	static readonly Two: StrategyWrapper = {
		value: "Practice the practical concepts in the video <strong>while</strong> watching it",
		modifiers: [{
			type: StrategyModifiers.Interaction,
			value: 3
		}]
	};
	static readonly Three: StrategyWrapper = {
		value: "Practice the practical concepts in the video <strong>after</strong> watching it",
		modifiers: [{
			type: StrategyModifiers.Interaction,
			value: 5
		}]
	};
	static readonly Four: StrategyWrapper = {
		value: "Review and tweak the provided extra resources (like code files) after watching the videos",
		modifiers: [{
			type: StrategyModifiers.Interaction,
			value: 5
		}]
	};
}

export class ExtendingStrategies {
	static readonly One: StrategyWrapper = {
		value: "Speak to my classmates about the concepts in the videos",
		modifiers: [{
			type: StrategyModifiers.Interaction,
			value: 5
		}]
	};
	static readonly Two: StrategyWrapper = {
		value: "Practice the concepts in the videos in a project of my own",
		modifiers: [{
			type: StrategyModifiers.Interaction,
			value: 3
		}]
	};
	static readonly Three: StrategyWrapper = {
		value: "Search the web for examples of the concepts mentioned in the videos",
		modifiers: [{
			type: StrategyModifiers.Research,
			value: 5
		}]
	};
	static readonly Four: StrategyWrapper = {
		value: "Search the web for extra resources relating to the concepts mentioned in the videos",
		modifiers: [{
			type: StrategyModifiers.Research,
			value: 5
		}]
	};
}