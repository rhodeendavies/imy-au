import { LudusComponent, Strategy } from "models/reflections";
import { LudusCalculatedComponents, LudusLearningExperience, LudusModifier, LudusPreviousComponents, LudusStrategy, PaidiaTopicRating, TopicRating } from "models/reflectionsApiModels";
import { BasicLudusModifier, Colour, EmotionModifier, PaidiaWord, PromptSection, StrategyOption } from "models/prompts";
import environment from "environment";
import { FeelingsSummary, HistoricCourseFeelings, PaidiaFeelingsSummary, PaidiaHistoricCourseFeelings, PaidiaTopic, QuestionTopic } from "models/reflectionsResponses";
import { RadioOption } from "resources/radioButton/radio-button";
import { PromptType } from "./enums";
import { PasswordRequirements } from "models/userDetails";

export class ComponentHelper {
	static ModuleName: string = "";
	static PaidiaWords: PaidiaWord[] = [];
	static LudusModifiers: BasicLudusModifier[] = [];

	static SetModule(moduleName: string) {
		this.ModuleName = moduleName;
	}

	static CreateId(component: string): string {
		return `${component}_${Math.random().toString(36).substring(2, 5)}`;
	}

	static RandomWholeNumber(min: number = 0, max: number = 100): number {
		min = Math.ceil(min);
		max = Math.floor(max);
		const value = Math.floor(Math.random() * (max - min + 1)) + min;
		return value;
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
		return !(/[{}]/.test(value));
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

	static GetRatingPercentages(rating: number, max: number) {
		const result = Math.ceil(rating / max * 100);
		if (result > 100) return 100;
		if (result < 0) return 0;
		return result;
	}

	static CreateStrategyFromString(strategy: string, strategyOption: StrategyOption, rating: number = null): Strategy {
		return {
			title: strategyOption.title,
			icon: strategyOption.icon,
			description: strategyOption.description,
			options: strategyOption.strategies.map(x => {
				return {
					name: x.name,
					value: x.name,
					selected: strategy == x.name,
					description: x.description
				}
			}),
			strategy: strategy,
			rating: rating,
			ratingPercentage: this.GetRatingPercentages(rating, 5)
		};
	}

	static CreateStrategyFromPaidia(strategy: string, strategyOption: StrategyOption, rating: string = null): Strategy {
		return {
			title: strategyOption.title,
			icon: strategyOption.icon,
			description: strategyOption.description,
			options: strategyOption.strategies.map(x => {
				return {
					name: x.name,
					value: x.index,
					selected: strategy == x.name,
					description: x.description
				}
			}),
			strategy: strategy,
			rating: null,
			emoji: this.EmojiFromString(rating)
		};
	}

	static CreateStrategyFromLudus(strategy: LudusStrategy, strategyOption: StrategyOption, rating: number = null): Strategy {
		return {
			title: strategyOption.title,
			icon: strategyOption.icon,
			description: strategyOption.description,
			options: strategyOption.strategies.map(x => {
				return {
					name: x.name,
					subText: ComponentHelper.CreateModifiersString(x.modifiers),
					value: x.modifiers,
					selected: strategy?.text == x.name,
					description: x.description
				}
			}),
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
					amount: modifiers
						.filter(y => y.name == x.name)
						.reduce((prev, curr) => { return prev + curr.amount }, 0),
					description: this.LudusModifiers.find(y => y.name == x.name)?.description
				});
			}
		});
		return components.map(x => {
			return {
				name: x.name,
				total: x.amount,
				score: 0,
				description: x.description
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
		// replace all module indicators
		promptString = promptString.replace(new RegExp(`{${environment.moduleIndicator}}`, "g"), this.ModuleName);

		const sections: PromptSection[] = [];
		const lengthOfString = promptString.length;
		let index = 0;
		let inputIndex = 0;
		let endOfInputIndex = 0;
		let nextHasArticle = false;

		while (index < lengthOfString && inputIndex >= 0 && endOfInputIndex >= 0) {
			inputIndex = promptString.indexOf(`{`, index);
			endOfInputIndex = promptString.indexOf("}", index);

			let subString = "";
			let inputString = "";

			if (inputIndex == -1) {
				subString = promptString.substring(index);
			} else {
				subString = promptString.substring(index, inputIndex);
			}

			sections.push({
				type: PromptType.Text,
				value: subString
			});

			if (inputIndex >= 0) {
				inputString = promptString.substring(inputIndex + 2, endOfInputIndex);

				const indicator = promptString[inputIndex + 1];
				if (indicator == environment.inputIndicator) {
					sections.push({
						type: PromptType.Input,
						value: inputString,
						wordIndicator: indicator
					});
				} else if (indicator == environment.articleIndicator) {
					nextHasArticle = true;
				} else {
					const section = {
						type: PromptType.ShuffleWord,
						value: inputString,
						wordIndicator: indicator,
						hasArticle: nextHasArticle
					};

					if (section.value.length == 0) {
						section.value = this.GetWord(section);
					}

					sections.push(section);
					nextHasArticle = false;
				}
			}

			index = endOfInputIndex + 1;
		}

		return sections;
	}

	static GetWord(section: PromptSection): string {
		const paidiaWord = this.PaidiaWords.find(x => x.wordIndicator == section.wordIndicator);
		if (paidiaWord == null) return "";
		if (paidiaWord.currentIndex > paidiaWord.words.length) {
			paidiaWord.currentIndex = 0;
		}
		const index = paidiaWord.currentIndex++;
		const word = paidiaWord.words[index];
		if (section.hasArticle) {
			return `${this.DetermineArticle(word)} ${word}`;
		}
		return word;
	}

	static DetermineArticle(word: string) {
		const startsWithVowel = word.match(/^[aieouAIEOU].*/g);
		return startsWithVowel ? "an" : "a";
	}

	static CreateResponseFromPrompt(prompt: PromptSection[]): string {
		return prompt.reduce((prev, curr) => {
			switch (curr.type) {
				case PromptType.Text:
					prev += curr.value;
					break;
				case PromptType.Input:
					prev += `{${environment.inputIndicator}${curr.value}}`;
					break;
				case PromptType.ShuffleWord:
					prev += `{${curr.wordIndicator}${curr.value}}`;
					break;
			}
			return prev;
		}, "");
	}

	static CleanPrompt(promptString: string): string {
		if (promptString == null) return;
		// MODULE NAME
		promptString = promptString.replace(new RegExp(`{${environment.moduleIndicator}}`, "g"), this.ModuleName);
		// WORDS
		const wordIndicators = this.PaidiaWords.map(x => x.wordIndicator).concat(environment.inputIndicator);
		const wordsRegex = wordIndicators.reduce(((prev, curr) => { return prev += `({${curr})+|` }), "");
		return promptString.replace(new RegExp(`}+|${wordsRegex}`, "g"), "");
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
		const sumOfScores = components.reduce((prev, curr) => { return prev + (curr.score * curr.total) }, 0);
		const totalWeights = components.reduce((prev, curr) => { return prev + curr.total }, 0);
		return Math.ceil(sumOfScores / totalWeights);
	}

	static GetOriginalFinalScore(components: LudusComponent[]): number {
		if (components == null) return 0;
		const sumOfScores = components.reduce((prev, curr) => { return prev + (curr.originalScore * curr.total) }, 0);
		const totalWeights = components.reduce((prev, curr) => { return prev + curr.total }, 0);
		return Math.ceil(sumOfScores / totalWeights);
	}

	static FindLatestScore(components: LudusComponent[], previousComponentsScores: LudusPreviousComponents): LudusComponent[] {
		const planningComponents = previousComponentsScores?.planning?.calculated;
		const monitoringComponents = previousComponentsScores?.monitoring?.calculated;
		const dailyComponents = previousComponentsScores?.daily?.calculated;
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
		if (previousComponents == null) return components;
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

	static ShuffleArray(array: any[]): any[] {
		let currentIndex = array.length;
		let randomIndex = 0;

		while (currentIndex != 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}

		return array;
	}

	static GetFeelingsSummary(feelings: HistoricCourseFeelings): FeelingsSummary[] {
		return feelings.rating.map((x, index) => {
			return {
				rating: x,
				createdAt: feelings.createdAt[index]
			}
		});
	}

	static GetPaidiaFeelingsSummary(feelings: PaidiaHistoricCourseFeelings): PaidiaFeelingsSummary[] {
		return feelings.emoji.map((x, index) => {
			return {
				emoji: this.EmojiFromString(x),
				word: feelings.word[index],
				createdAt: feelings.createdAt[index]
			}
		});
	}

	static CreateTopics(topicRatings: TopicRating[], topicNames: QuestionTopic[], ratingOptions: RadioOption[]): QuestionTopic[] {
		return topicNames.map(x => {
			return {
				id: x.id,
				name: x.name,
				rating: topicRatings?.find(y => y.id == x.id)?.rating,
				options: ratingOptions.map(y => {
					return {
						name: "",
						value: y.value,
						selected: y.value == x.rating
					}
				})
			}
		});
	}

	static CreatePaidiaTopics(topicRatings: PaidiaTopicRating[], topicNames: QuestionTopic[]): PaidiaTopic[] {
		return topicNames.map(x => {
			return {
				id: x.id,
				name: x.name,
				colour: topicRatings?.find(y => y.id == x.id)?.color
			}
		});
	}

	static GetEmotionModifiers(learningExperience: LudusLearningExperience): EmotionModifier[] {
		const emotions = [
			learningExperience.enjoyment,
			learningExperience.hope,
			learningExperience.pride,
			learningExperience.anger,
			learningExperience.anxiety,
			learningExperience.shame,
			learningExperience.hopelessness,
			learningExperience.boredom,
		].filter(x => x != null);

		return emotions.map(x => {
			return {
				text: x.text,
				amount: x.modifiers[0].amount,
				emotion: x.modifiers[0].name,
				active: false
			}
		});
	}

	static EmojiFromString(hex: string) {
		try {
			if (this.NullOrEmpty(hex) || Number.isNaN(hex)) return "";
			return String.fromCodePoint(+(`0x${hex}`));
		} catch (error) {
			return hex;
		}
	}

	static EmojiToString(emoji): string {
		if (this.NullOrEmpty(emoji) || Number.isNaN(emoji)) return "";
		return emoji.codePointAt(0).toString(16);
	}

	static PasswordValid(password: string): PasswordRequirements {
		const result = new PasswordRequirements();
		result.hasMoreThanEightCharacters = password.length >= 8;
		result.hasUppercase = /[A-Z]/.test(password);
		result.hasLowercase = /[a-z]/.test(password);
		result.hasDigit = /\d/.test(password);
		result.hasSymbol = /\W/.test(password);
		return result;
		
	}
}