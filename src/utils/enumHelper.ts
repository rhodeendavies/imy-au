import { StrategyCategories, StrategyCategoryIcons } from "./enums";

export class EnumHelper {
	static GetCategoryIcon(category: StrategyCategories): StrategyCategoryIcons {
		switch (category) {
			case StrategyCategories.Learning:
				return StrategyCategoryIcons.Learning;
			case StrategyCategories.Reviewing:
				return StrategyCategoryIcons.Reviewing;
			case StrategyCategories.Practicing:
				return StrategyCategoryIcons.Practicing;
			case StrategyCategories.Extending:
				return StrategyCategoryIcons.Extending;
			default:
				return null;
		}
	}

	static Sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	static NullOrEmpty(value: string): boolean {
		return value == null || value == "";
	}
}