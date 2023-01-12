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
}