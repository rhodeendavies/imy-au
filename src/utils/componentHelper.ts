import { Strategy } from "models/reflections";
import { Colour, StrategyModifier, StrategyOption } from "./constants";
import { LudusStrategy } from "models/reflectionsApiModels";

export class ComponentHelper {
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

	static LoremIpsum(): string {
		return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fringilla sem dolor, et varius lorem egestas quis. Aenean auctor quam quam, ac porta leo suscipit ac. Donec malesuada dignissim feugiat. Aenean lobortis ex eu ante mollis dictum. Fusce dictum dignissim tristique. Vestibulum blandit rutrum elit vel bibendum. Aliquam vestibulum diam sit amet laoreet molestie. Maecenas et commodo dui, nec tempor libero. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In varius turpis at tortor ultrices, et porta erat blandit. Vestibulum aliquet nibh nisi, nec accumsan sapien efficitur ut. Mauris tristique nec eros at semper. Ut eget dui diam. ";
	}

	static DonecInterdum(): string {
		return "Donec interdum ligula a enim dictum, id vulputate ex cursus. Sed vel lacinia nunc. Integer varius elit et nulla tempor, molestie feugiat neque malesuada. Aenean semper commodo aliquam. Praesent vel arcu maximus, ornare risus nec, tempus nulla. Quisque turpis elit, convallis sed neque eget, tempus dapibus urna. Proin viverra finibus magna, at mattis augue pretium porta. Donec tincidunt libero non vestibulum vestibulum. Pellentesque quis fringilla ante. Donec vestibulum feugiat rhoncus. Etiam elementum enim risus. ";
	}

	static GetColourOpacity(colour: Colour, opacity: number = 1): string {
		return `rgba(${colour.red}, ${colour.green}, ${colour.blue}, ${opacity}`;
	}

	static CreateModifiersString(modifiers: StrategyModifier[]): string {
		return modifiers.map(x => `${x.type} +${x.value}`).join(", ");
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

	static CreateStrategyFromLudus(strategy: LudusStrategy, strategyOptions: StrategyOption): Strategy {
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
			modifiers: strategy?.modifiers?.map(x => {
				return {
					type: x.name,
					value: x.amount
				}
			}),
			rating: null
		};
	}

	static CreateLudusModifier(strategy: Strategy): LudusStrategy {
		return {
			text: strategy.strategy,
			modifiers: strategy.modifiers.map(x => {
				return {
					name: x.type,
					amount: x.value
				}
			})
		}
	}
}