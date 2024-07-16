import { RadioOption } from "resources/radioButton/radio-button";
import { StrategyCategories } from "utils/enums";
import { BaseEvaluatingResponse, BaseMonitoringResponse, BasePlanningResponse, LessonRatings, LudusEvaluatingResponse, LudusMonitoringResponse, LudusPlanningResponse, PaidiaEvaluatingResponse, PaidiaMonitoringResponse, PaidiaPlanningResponse } from "./reflectionsResponses";
import { LudusModifier } from "./reflectionsApiModels";
import { Section } from "./course";

export class BaseReflection {
	id: number;
	planningReflection: BasePlanningResponse;
	monitoringReflection: BaseMonitoringResponse;
	evaluatingReflection: BaseEvaluatingResponse;
}

export class LudusReflection {
	id: number;
	section: Section;
	planningReflection: LudusPlanningResponse;
	monitoringReflection: LudusMonitoringResponse;
	evaluatingReflection: LudusEvaluatingResponse;
}

export class PaidiaReflection {
	id: number;
	planningReflection: PaidiaPlanningResponse;
	monitoringReflection: PaidiaMonitoringResponse;
	evaluatingReflection: PaidiaEvaluatingResponse;
}

export class Strategy extends LessonRatings {
	title: StrategyCategories;
	strategy: string;
	rating: number;
	
	// frontend only
	icon?: string;
	options?: RadioOption[];
	modifiers?: LudusModifier[];
	valid?: boolean;
	index?: number;
	emoji?: string;
	description?: string;

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

export class LudusComponent {
	name: string;
	total?: number;
	score: number;
	originalScore?: number;
	description?: string;
}

export class PaidiaCanvasModel {
	learningImages: number[];
	learningStyles: number[];
	learningImage: number;
	learningStyle: number;
	reviewingImages: number[];
	reviewingStyles: number[];
	reviewingImage: number;
	reviewingStyle: number;
	practicingImages: number[];
	practicingStyles: number[];
	practicingImage: number;
	practicingStyle: number;
	extendingImages: number[];
	extendingStyles: number[];
	extendingImage: number;
	extendingStyle: number;
	canvas: string;

	constructor() {
		this.learningImages = [];
		this.learningStyles = [];
		this.reviewingImages = [];
		this.reviewingStyles = [];
		this.practicingImages = [];
		this.practicingStyles = [];
		this.extendingImages = [];
		this.extendingStyles = [];
	}
}