import { RadioOption } from "resources/radioButton/radio-button";
import { StrategyCategories } from "utils/enums";

export class BaseSystemDaily {
	feeling: number;
	strategies: Strategy[];

	constructor() {
		this.feeling = null;
		this.strategies = [];
	}
}

export class BaseSystemReflection {
	planningReflection: BaseSystemPlanning;
	monitoringReflection: BaseSystemMonitoring;
	evaluatingReflection: BaseSystemEvaluating;

	constructor() {
		this.planningReflection = new BaseSystemPlanning();
		this.monitoringReflection = new BaseSystemMonitoring();
		this.evaluatingReflection = new BaseSystemEvaluating();
	}
}

export class BaseSystemPlanning {
	feeling: number;
	strengths: string;
	strategies: Strategy[];
	dateRecorded: Date;

	constructor() {
		this.feeling = null;
		this.strengths = "";
		this.strategies = [];
		this.dateRecorded = null;
	}
}

export class BaseSystemMonitoring {
	feeling: number;
	currentQuestions: string;
	strategies: Strategy[];
	dateRecorded: Date;

	constructor() {
		this.feeling = null;
		this.currentQuestions = "";
		this.strategies = [];
		this.dateRecorded = null;
	}
}

export class BaseSystemEvaluating {
	feelings: BaseSystemFeeling[];
	summary: string;
	strategies: Strategy[];
	dateRecorded: Date;

	constructor() {
		this.summary = "";
		this.strategies = [];
		this.feelings = [];
		this.dateRecorded = null;
	}
}

export class BaseSystemFeeling {
	feelingRating: number;
	feelingDate: Date;

	constructor() {
		this.feelingRating = null;
		this.feelingDate = null;
	}
}

export class Strategy {
	title: StrategyCategories;
	strategy: string;
	rating: number;
	
	// frontend only
	ratingPercentage?: number;
	icon?: string;
	options?: RadioOption[];

	constructor() {
		this.title = null;
		this.strategy = "";
		this.rating = 0;
		this.ratingPercentage = 0;
		this.icon = "";
		this.options = [];
	}
}