import { LudusComponent, Strategy } from "models/reflections";
import { Colour, StrategyOption } from "./constants";
import { LudusCalculatedComponents, LudusModifier, LudusPreviousComponents, LudusStrategy } from "models/reflectionsApiModels";
import { PromptSection } from "models/prompts";
import { log } from "./log";

export class ComponentHelper {
	static ModuleName: string = "";

	static SetModule(moduleName: string) {
		this.ModuleName = moduleName;
	}

	static CreateId(component: string): string {
		return `${component}_${Math.random().toString(36).substring(2, 5)}`;
	}

	static RandomWholeNumber(min: number = 0, max: number = 100): number {
		return Math.floor((Math.random() * max) + min);
	}

	static Sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	static NullOrEmpty(value: string): boolean {
		return value == null || value == "";
	}

	static ListNullOrEmpty(value: any[]): boolean {
		return value == null || value.length == 0;
	}

	static InputValid(value: string): boolean {
		return !(/[%{}]/.test(value));
	}

	static LoremIpsum(): string {
		return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fringilla sem dolor, et varius lorem egestas quis. Aenean auctor quam quam, ac porta leo suscipit ac. Donec malesuada dignissim feugiat. Aenean lobortis ex eu ante mollis dictum. Fusce dictum dignissim tristique. Vestibulum blandit rutrum elit vel bibendum. Aliquam vestibulum diam sit amet laoreet molestie. Maecenas et commodo dui, nec tempor libero. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In varius turpis at tortor ultrices, et porta erat blandit. Vestibulum aliquet nibh nisi, nec accumsan sapien efficitur ut. Mauris tristique nec eros at semper. Ut eget dui diam. ";
	}

	static DonecInterdum(): string {
		return "Donec interdum ligula a enim dictum, id vulputate ex cursus. Sed vel lacinia nunc. Integer varius elit et nulla tempor, molestie feugiat neque malesuada. Aenean semper commodo aliquam. Praesent vel arcu maximus, ornare risus nec, tempus nulla. Quisque turpis elit, convallis sed neque eget, tempus dapibus urna. Proin viverra finibus magna, at mattis augue pretium porta. Donec tincidunt libero non vestibulum vestibulum. Pellentesque quis fringilla ante. Donec vestibulum feugiat rhoncus. Etiam elementum enim risus. ";
	}

	static GetColourOpacity(colour: Colour, opacity: number = 1): string {
		return `rgba(${colour.red}, ${colour.green}, ${colour.blue}, ${opacity}`;
	}

	static CreateModifiersString(modifiers: LudusModifier[]): string {
		return modifiers.map(x => `${x.name} +${x.amount}`).join(", ");
	}

	static GetRatingPercentages(rating: number) {
		const result = Math.ceil(rating / 3 * 100);
		if (result > 100) return 100;
		if (result < 0) return 0;
		return result;
	}

	static CreateStrategyFromString(strategy: string, strategyOptions: StrategyOption, rating: number = null): Strategy {
		return {
			title: strategyOptions.title,
			icon: strategyOptions.icon,
			options: [{
				name: strategyOptions.One.value,
				subText: ComponentHelper.CreateModifiersString(strategyOptions.One.modifiers),
				value: strategyOptions.One.value
			}, {
				name: strategyOptions.Two.value,
				subText: ComponentHelper.CreateModifiersString(strategyOptions.Two.modifiers),
				value: strategyOptions.Two.value
			}, {
				name: strategyOptions.Three.value,
				subText: ComponentHelper.CreateModifiersString(strategyOptions.Three.modifiers),
				value: strategyOptions.Three.value
			}, {
				name: strategyOptions.Four.value,
				subText: ComponentHelper.CreateModifiersString(strategyOptions.Four.modifiers),
				value: strategyOptions.Four.value
			}],
			strategy: strategy,
			rating: rating,
			ratingPercentage: this.GetRatingPercentages(rating)
		};
	}

	static CreateStrategyFromLudus(strategy: LudusStrategy, strategyOptions: StrategyOption, rating: number = null): Strategy {
		return {
			title: strategyOptions.title,
			icon: strategyOptions.icon,
			options: [{
				name: strategyOptions.One.value,
				subText: ComponentHelper.CreateModifiersString(strategyOptions.One.modifiers),
				value: strategyOptions.One.modifiers
			}, {
				name: strategyOptions.Two.value,
				subText: ComponentHelper.CreateModifiersString(strategyOptions.Two.modifiers),
				value: strategyOptions.Two.modifiers
			}, {
				name: strategyOptions.Three.value,
				subText: ComponentHelper.CreateModifiersString(strategyOptions.Three.modifiers),
				value: strategyOptions.Three.modifiers
			}, {
				name: strategyOptions.Four.value,
				subText: ComponentHelper.CreateModifiersString(strategyOptions.Four.modifiers),
				value: strategyOptions.Four.modifiers
			}],
			strategy: strategy?.text,
			modifiers: strategy?.modifiers,
			rating: rating
		};
	}

	static CreateLudusModifier(strategy: Strategy): LudusStrategy {
		return {
			text: strategy.strategy,
			modifiers: strategy.modifiers
		}
	}

	static GetUniqueComponents(components: LudusModifier[], modifiers: LudusModifier[]): LudusComponent[] {
		modifiers?.forEach(x => {
			if (!components.some(y => y.name == x.name)) {
				components.push({
					name: x.name,
					amount: modifiers.filter(y => y.name == x.name).reduce((prev, curr) => { return prev + curr.amount }, 0)
				});
			}
		});
		return components.map(x => {
			return {
				name: x.name,
				total: x.amount,
				score: 0
			}
		});
	}

	static GetAllModifiers(strategies: Strategy[]): LudusModifier[] {
		if (strategies == null) return [];

		const allModifiers: LudusModifier[] = [];
		strategies.forEach(x => {
			if (x != null && x.modifiers != null) {
				allModifiers.push(...x.modifiers);
			}
		});
		return allModifiers;
	}

	static GeneratePromptSections(promptString: string): PromptSection[] {
		const sections: PromptSection[] = [];
		const lengthOfString = promptString.length;
		
		let index = 0;
		let inputIndex = 0;
		let endOfInputIndex = 0;

		promptString = promptString.replace(/{%}/g, this.ModuleName);

		while (index < lengthOfString && inputIndex >= 0 && endOfInputIndex >= 0) {
			inputIndex = promptString.indexOf("%{", index);
			endOfInputIndex = promptString.indexOf("}", index);
			
			let subString = "";
			let inputString = "";

			if (inputIndex == -1) {
				subString = promptString.substring(index);
			} else {
				subString = promptString.substring(index, inputIndex);
			}

			sections.push({
				prompt: subString,
				input: false,
				period: subString.indexOf(".") == 0 || subString.indexOf("?") == 0 || subString.indexOf("!") == 0 || subString.indexOf(",") == 0,
				inputValue: ""
			});

			if (inputIndex >= 0) {
				inputString = promptString.substring(inputIndex + 2, endOfInputIndex);
				
				sections.push({
					prompt: "",
					input: true,
					period: false,
					inputValue: inputString
				});
			}

			index = endOfInputIndex + 1;
		}

		return sections;
	}

	static CreateResponseFromPrompt(prompt: PromptSection[]): string {
		return prompt.reduce((prev, curr) => {
			if (curr.input) {
				prev += `%{${curr.inputValue}}`;
			} else {
				prev += curr.prompt;
			}
			return prev;
		}, "");
	}

	static CleanPrompt(promptString: string): string {
		if (promptString == null) return;
		return promptString.replace(/[%{}]/g, "");
	}

	static GetComponentScores(components: LudusComponent[], strategyRatings: Strategy[], modifier: number = 1): LudusComponent[] {
		if (components == null || strategyRatings == null) return [];
		components.forEach(component => {
			let rawValue = 0;
			strategyRatings.forEach(strategy => {
				const componentInStrategy = strategy.modifiers.find(x => x.name == component.name);
				if (componentInStrategy != null) {
					rawValue += componentInStrategy.amount * strategy.rating / 100;
				}
			});
			if (component.originalScore == null || isNaN(component.originalScore)) {
				component.originalScore = 0;
			}
			component.score = component.originalScore + (rawValue / component.total * 100 * modifier);
		});
		return components;
	}

	static GetFinalScore(components: LudusComponent[]): number {
		if (components == null) return 0;
		const sumOfScores = components.reduce((prev, curr) => { return prev + (curr.score * curr.total)}, 0);
		const totalWeights = components.reduce((prev, curr) => { return prev + curr.total}, 0);
		return Math.ceil(sumOfScores / totalWeights);
	}

	static FindLatestScore(components: LudusComponent[], previousComponentsScores: LudusPreviousComponents): LudusComponent[] {
		const planningComponents = previousComponentsScores.planning.calculated;
		const monitoringComponents = previousComponentsScores.monitoring.calculated;
		const dailyComponents = previousComponentsScores.daily.calculated;
		let previousComponents: LudusCalculatedComponents[] = [];
		if (dailyComponents != null && monitoringComponents != null) {
			const dailyEarlier = dailyComponents.length > 0 && dailyComponents.every(x => {
				const comp = monitoringComponents.find(y => y.name == x.name);
				return comp == null || comp.score <= x.score;
			});
			if (dailyEarlier) {
				previousComponents = dailyComponents;
			} else {
				previousComponents = monitoringComponents;
			}
		} else if (dailyComponents != null) {
			previousComponents = dailyComponents;
		} else if (monitoringComponents != null) {
			previousComponents = monitoringComponents;
		} else {
			previousComponents = planningComponents;
		}

		return this.AssignComponentScores(components, previousComponents);
	}

	static AssignComponentScores(components: LudusComponent[], previousComponents: LudusCalculatedComponents[]): LudusComponent[] {
		return components.map(x => {
			const comp = previousComponents.find(y => y.name == x.name);
			
			if (comp != null) {
				x.score = comp.score;
			} else {
				x.score = 0;
			}

			return {
				name: x.name,
				originalScore: x.score,
				total: x.total,
				score: 0
			}
		});
	}
}