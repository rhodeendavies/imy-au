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
	id: number;
	planningReflection: BaseSystemPlanning;
	monitoringReflection: BaseSystemMonitoring;
	evaluatingReflection: BaseSystemEvaluating;

	constructor() {
		this.id = 0;
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
	feeling: number;
	feelingsAffect: string;
	feelings: BaseSystemFeeling[];
	topics: Topic[];
	summary: string;
	strategies: Strategy[];
	dateRecorded: Date;
	postToPublic: boolean;

	constructor() {
		this.feeling = null;
		this.feelingsAffect = "";
		this.feelings = [];
		this.topics = [];
		this.summary = "";
		this.strategies = [];
		this.dateRecorded = null;
		this.postToPublic = false;
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
	valid?: boolean;

	constructor() {
		this.title = null;
		this.strategy = "";
		this.rating = 0;
		this.ratingPercentage = 0;
		this.icon = "";
		this.options = [];
	}
}

export class Topic {
	title: string;
	rating: number;

	constructor() {
		this.title = null;
		this.rating = 0;
	}
}