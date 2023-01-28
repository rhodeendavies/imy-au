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

export class PromptSection {
	prompt: string;
	input: boolean;
	period: boolean;
	inputValue: string;
	valid?: boolean;
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
	modifier: string;
	amount: number;
	emotion: string;
	active: boolean;
}