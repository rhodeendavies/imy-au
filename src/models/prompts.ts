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
	enjoyment: EmotionModifier[];
	hope: EmotionModifier[];
	pride: EmotionModifier[];
	anger: EmotionModifier[];
	anxiety: EmotionModifier[];
	shame: EmotionModifier[];
	hopelessness: EmotionModifier[];
	boredom: EmotionModifier[];
}

export class EmotionModifier {
	text: string;
	modifier: number;
}