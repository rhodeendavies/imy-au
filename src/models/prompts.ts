import { PromptType, StrategyCategories, StrategyCategoryIcons } from "utils/enums";
import { LudusModifier } from "./reflectionsApiModels";

export class BasicPrompts {
	planningPrompts: string[];
	monitoringPrompts: string[];
	evaluatingPrompts: string[];
}

export class Prompts {
	planningPrompts: PromptSection[][];
	monitoringPrompts: PromptSection[][];
	evaluatingPrompts: PromptSection[][];
}

export class PaidiaWord {
	wordIndicator: string;
	currentIndex: number;
	words: string[];
}

export class PromptSection {
	type: PromptType;
	value: string;
	wordIndicator?: string;
	valid?: boolean;
	hasArticle?: boolean;
}

export class WordIndicator {

}

export class Emotions {
	enjoyment: Emotion;
	hope: Emotion;
	pride: Emotion;
	anger: Emotion;
	anxiety: Emotion;
	shame: Emotion;
	hopelessness: Emotion;
	boredom: Emotion;
}

export class Emotion {
	colour: string;
	text: string;
	modifiers: EmotionModifier[];
}

export class EmotionModifier {
	text: string;
	amount: number;
	emotion: string;
	active: boolean;
}

export class Colour {
	red: number;
	green: number;
	blue: number;
}

export class StrategyWrapper {
	name: string;
	index: number;
	description: string;
	modifiers: LudusModifier[];
}

export class BasicStrategyOptions {
	learning: StrategyOption;
	extending: StrategyOption;
	reviewing: StrategyOption;
	practicing: StrategyOption;
}

export class StrategyOption {
	title: StrategyCategories;
	icon: StrategyCategoryIcons;
	description: string;
	strategies: StrategyWrapper[];
}

export class StrategyOptions {
	LearningStrategies: StrategyOption;
	ReviewingStrategies: StrategyOption;
	PracticingStrategies: StrategyOption;
	ExtendingStrategies: StrategyOption;
}

export class BasicLudusModifier {
	name: string;
	description: string;
}