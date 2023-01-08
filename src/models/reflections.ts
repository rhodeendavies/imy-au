import { RadioOption } from "resources/radioButton/radio-button";
import { StrategyCategories } from "utils/enums";
import { StrategyModifier } from "utils/constants";
import { BaseEvaluatingResponse, BaseMonitoringResponse, BasePlanningResponse, LessonRatings } from "./reflectionsResponses";

export class BaseReflection {
	id: number;
	planningReflection: BasePlanningResponse;
	monitoringReflection: BaseMonitoringResponse;
	evaluatingReflection: BaseEvaluatingResponse;
}

export class Strategy extends LessonRatings {
	title: StrategyCategories;
	strategy: string;
	rating: number;
	
	// frontend only
	icon?: string;
	options?: RadioOption[];
	modifiers?: StrategyModifier[];
	valid?: boolean;

	constructor() {
		super();
		this.title = null;
		this.strategy = "";
		this.rating = 0;
		this.icon = "";
		this.options = [];
	}
}

export class Topic {
	name: string;
	id: number;
	rating: number;

	constructor() {
		this.name = null;
		this.rating = null;
	}
}